import Wishlist from "../models/wishlist.js";
import Order from "../models/order.js";
// import Review from "../models/review.js";
import Coupon from "../models/coupon.js";
import Notification from "../models/notification.js";
import Cart from "../models/cart.js";
import ErrorHandler from "../utils/errorHandler.js";

// Wishlist Controllers
export const getWishlist = async (req, res, next) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
            "items.product",
            "name price images stock"
        );

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user._id,
                items: [],
            });
        }

        res.status(200).json({
            success: true,
            wishlist,
        });
    } catch (error) {
        next(error);
    }
};

export const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user._id,
                items: [{ product: productId }],
            });
        } else {
            const exists = wishlist.items.some(
                (item) => item.product.toString() === productId
            );

            if (!exists) {
                wishlist.items.push({ product: productId });
                await wishlist.save();
            }
        }

        res.status(200).json({
            success: true,
            message: "Item added to wishlist",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const removeFromWishlist = async (req, res, next) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            return next(new ErrorHandler("Wishlist not found", 404));
        }

        wishlist.items = wishlist.items.filter(
            (item) => item.product.toString() !== req.params.productId
        );

        await wishlist.save();

        res.status(200).json({
            success: true,
            message: "Item removed from wishlist",
        });
    } catch (error) {
        next(error);
    }
};

// Coupon Controllers
export const createCoupon = async (req, res, next) => {
    try {
        req.body.createdBy = req.user._id;
        const coupon = await Coupon.create(req.body);

        res.status(201).json({
            success: true,
            coupon,
        });
    } catch (error) {
        next(error);
    }
};

export const validateCoupon = async (req, res, next) => {
    try {
        const { code } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart || cart.items.length === 0) {
            return next(new ErrorHandler("Cart is empty", 400));
        }

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true,
            startDate: { $lte: new Date() },
            expiryDate: { $gt: new Date() },
        });

        if (!coupon) {
            return next(new ErrorHandler("Invalid or expired coupon", 400));
        }

        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            return next(new ErrorHandler("Coupon usage limit exceeded", 400));
        }

        if (cart.totalPrice < coupon.minimumAmount) {
            return next(
                new ErrorHandler(
                    `Minimum order amount of $${coupon.minimumAmount} required`,
                    400
                )
            );
        }

        let discountAmount;
        if (coupon.discountType === "percentage") {
            discountAmount = (cart.totalPrice * coupon.discountAmount) / 100;
            if (coupon.maxDiscountAmount) {
                discountAmount = Math.min(
                    discountAmount,
                    coupon.maxDiscountAmount
                );
            }
        } else {
            discountAmount = coupon.discountAmount;
        }

        res.status(200).json({
            success: true,
            coupon,
            discountAmount,
        });
    } catch (error) {
        next(error);
    }
};

// Notification Controllers
export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort("-createdAt")
            .limit(50);

        res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        next(error);
    }
};

export const markNotificationAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!notification) {
            return next(new ErrorHandler("Notification not found", 404));
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
        });
    } catch (error) {
        next(error);
    }
};

export const clearAllNotifications = async (req, res, next) => {
    try {
        await Notification.updateMany({ user: req.user._id }, { isRead: true });

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        next(error);
    }
};

// endpoint => api/v1/additional/user-dashboard-stats
// get stats for the user dashboard
export const getUserDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Get user orders count
        const ordersCount = await Order.countDocuments({ user: userId });

        // Get user wishlist items count
        const wishlistCount = await Wishlist.countDocuments({ user: userId });

        // Get user reviews count
        // const reviewsCount = await Review.countDocuments({ user: userId });

        res.status(200).json({
            success: true,
            stats: {
                orders: ordersCount,
                wishlist: wishlistCount,
                // reviews: reviewsCount,
            },
        });
    } catch (error) {
        next(error);
    }
};
