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

// All routes are protected
router.use(isAuthenticatedUser);

router.route("/").get(getCart);

router.route("/").post(addToCart);

router.route("/:id").put(updateCartItem);

router.route("/:id").delete(removeFromCart);

router.route("/clear").delete(clearCart);

export default router;
