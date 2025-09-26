const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} = require("../controllers/cartController");

const { isAuthenticatedUser } = require("../middleware/auth");

// Validation middleware
const cartItemValidation = [
    check("productId", "Product ID is required").not().isEmpty(),
    check("quantity", "Quantity must be a positive number").isInt({ min: 1 }),
];

const productIdValidation = [
    check("productId", "Product ID is required").not().isEmpty(),
];

// All routes are protected
router.use(isAuthenticatedUser);

router.route("/cart").get(getCart);

router.route("/cart/add").post(cartItemValidation, addToCart);

router.route("/cart/update").put(cartItemValidation, updateCartItem);

router.route("/cart/remove").delete(productIdValidation, removeFromCart);

router.route("/cart/clear").delete(clearCart);

module.exports = router;
