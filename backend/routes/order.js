import express from "express";
const router = express.Router();
import { check } from "express-validator";

import {
    createOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
} from "../controllers/orderController.js";

import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

// Validation middleware
const orderValidation = [
    check("shippingInfo.address.line1", "Address line 1 is required")
        .not()
        .isEmpty(),
    check("shippingInfo.address.city", "City is required").not().isEmpty(),
    check("shippingInfo.address.state", "State is required").not().isEmpty(),
    check("shippingInfo.address.country", "Country is required")
        .not()
        .isEmpty(),
    check("shippingInfo.address.postalCode", "Postal code is required")
        .not()
        .isEmpty(),
    check("shippingInfo.address.phone", "Phone number is required")
        .not()
        .isEmpty(),
    check("paymentInfo.id", "Payment ID is required").not().isEmpty(),
    check("paymentInfo.status", "Payment status is required").not().isEmpty(),
];

// Protected routes
router.route("/new").post(isAuthenticatedUser, orderValidation, createOrder);
router.route("/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/me").get(isAuthenticatedUser, myOrders);

// Admin routes
router
    .route("/admin/orders")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
    .route("/admin/order/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);

export default router;
