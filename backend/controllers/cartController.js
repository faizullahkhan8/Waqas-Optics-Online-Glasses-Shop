const Cart = require("../models/cart");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");

// Get or create cart => /api/v1/cart
exports.getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate(
            "items.product",
            "stock"
        );

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [],
            });
        }

        // Check stock availability and update quantities if needed
        let isUpdated = false;
        cart.items = cart.items.filter((item) => {
            if (item.product && item.product.stock < item.quantity) {
                item.quantity = item.product.stock;
                isUpdated = true;
            }
            return item.product && item.product.stock > 0;
        });

        if (isUpdated) {
            await cart.save();
        }

        res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        next(error);
    }
};

// Add item to cart => /api/v1/cart/add
exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        if (product.stock < quantity) {
            return next(new ErrorHandler("Insufficient stock", 400));
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [],
            });
        }

        const cartItem = cart.items.find(
            (item) => item.product.toString() === productId.toString()
        );

        if (cartItem) {
            cartItem.quantity = quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                name: product.name,
                price: product.price,
                image: product.images[0].url,
            });
        }

        await cart.save();

        res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        next(error);
    }
};

// Update cart item quantity => /api/v1/cart/update
exports.updateCartItem = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        if (quantity > product.stock) {
            return next(new ErrorHandler("Insufficient stock", 400));
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return next(new ErrorHandler("Cart not found", 404));
        }

        const cartItem = cart.items.find(
            (item) => item.product.toString() === productId.toString()
        );

        if (!cartItem) {
            return next(new ErrorHandler("Item not found in cart", 404));
        }

        if (quantity <= 0) {
            cart.items = cart.items.filter(
                (item) => item.product.toString() !== productId.toString()
            );
        } else {
            cartItem.quantity = quantity;
        }

        await cart.save();

        res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        next(error);
    }
};

// Remove item from cart => /api/v1/cart/remove
exports.removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return next(new ErrorHandler("Cart not found", 404));
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId.toString()
        );

        await cart.save();

        res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        next(error);
    }
};

// Clear cart => /api/v1/cart/clear
exports.clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return next(new ErrorHandler("Cart not found", 404));
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
        });
    } catch (error) {
        next(error);
    }
};
