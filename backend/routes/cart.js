import express from "express";
const router = express.Router();
import { check } from "express-validator";

import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from "../controllers/cartController.js";

import { isAuthenticatedUser } from "../middleware/auth.js";

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

router.route("/").get(getCart);

router.route("/add").post(cartItemValidation, addToCart);

router.route("/update").put(cartItemValidation, updateCartItem);

router.route("/remove").delete(productIdValidation, removeFromCart);

router.route("/clear").delete(clearCart);

export default router;
