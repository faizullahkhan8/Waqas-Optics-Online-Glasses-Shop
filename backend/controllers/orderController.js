const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create new order => /api/v1/order/new
exports.createOrder = async (req, res, next) => {
    try {
        const { shippingInfo, paymentInfo } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart || cart.items.length === 0) {
            return next(new ErrorHandler("Cart is empty", 400));
        }

        // Verify stock availability
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (!product || product.stock < item.quantity) {
                return next(
                    new ErrorHandler(`Insufficient stock for ${item.name}`, 400)
                );
            }
        }

        const itemsPrice = cart.totalPrice;
        const taxPrice = itemsPrice * 0.15; // 15% tax
        const shippingPrice = itemsPrice > 200 ? 0 : 25; // Free shipping over $200
        const totalPrice = itemsPrice + taxPrice + shippingPrice;

        const order = await Order.create({
            shippingInfo,
            orderItems: cart.items,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            paidAt: Date.now(),
            user: req.user._id,
        });

        // Update stock
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            product.stock -= item.quantity;
            await product.save();
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

// Get single order => /api/v1/order/:id
exports.getSingleOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );

        if (!order) {
            return next(new ErrorHandler("Order not found", 404));
        }

        // Check if the order belongs to the logged-in user or if user is admin
        if (
            order.user._id.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return next(
                new ErrorHandler("Not authorized to access this order", 403)
            );
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

// Get logged in user orders => /api/v1/orders/me
exports.myOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id });

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Get all orders => /api/v1/admin/orders
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate("user", "name email");

        let totalAmount = 0;
        orders.forEach((order) => {
            totalAmount += order.totalPrice;
        });

        res.status(200).json({
            success: true,
            totalAmount,
            orders,
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Update order status => /api/v1/admin/order/:id
exports.updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(new ErrorHandler("Order not found", 404));
        }

        if (order.orderStatus === "Delivered") {
            return next(
                new ErrorHandler("Order has already been delivered", 400)
            );
        }

        if (req.body.orderStatus === "Shipped") {
            order.orderStatus = "Shipped";
        }

        if (req.body.orderStatus === "Delivered") {
            order.orderStatus = "Delivered";
            order.deliveredAt = Date.now();
        }

        await order.save();

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};

// Create Stripe payment intent => /api/v1/payment/intent
exports.createPaymentIntent = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart || cart.items.length === 0) {
            return next(new ErrorHandler("Cart is empty", 400));
        }

        const itemsPrice = cart.totalPrice;
        const taxPrice = itemsPrice * 0.15;
        const shippingPrice = itemsPrice > 200 ? 0 : 25;
        const totalAmount = Math.round(
            (itemsPrice + taxPrice + shippingPrice) * 100
        ); // Convert to cents

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: "usd",
            metadata: { integration_check: "accept_a_payment" },
        });

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret,
        });
    } catch (error) {
        next(error);
    }
};
