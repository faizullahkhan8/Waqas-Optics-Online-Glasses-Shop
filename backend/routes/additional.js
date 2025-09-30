import express from "express";
const router = express.Router();
import { check } from "express-validator";

import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    createCoupon,
    validateCoupon,
    getNotifications,
    markNotificationAsRead,
    clearAllNotifications,
    getUserDashboardStats,
} from "../controllers/additionalController.js";

import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

// Validation middleware
const couponValidation = [
    check("code", "Coupon code is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("discountType", "Discount type must be percentage or fixed").isIn([
        "percentage",
        "fixed",
    ]),
    check("discountAmount", "Discount amount is required").isNumeric(),
    check("startDate", "Start date is required").isISO8601(),
    check("expiryDate", "Expiry date is required").isISO8601(),
];

// Wishlist routes
router
    .route("/wishlist")
    .get(isAuthenticatedUser, getWishlist)
    .post(isAuthenticatedUser, addToWishlist);

router
    .route("/wishlist/:productId")
    .delete(isAuthenticatedUser, removeFromWishlist);

// Coupon routes
router
    .route("/admin/coupon/new")
    .post(
        isAuthenticatedUser,
        authorizeRoles("admin"),
        couponValidation,
        createCoupon
    );

router
    .route("/coupon/validate")
    .post(
        isAuthenticatedUser,
        check("code", "Coupon code is required").not().isEmpty(),
        validateCoupon
    );

// Notification routes
router
    .route("/notifications")
    .get(isAuthenticatedUser, getNotifications)
    .put(isAuthenticatedUser, clearAllNotifications);

router
    .route("/notifications/:id")
    .put(isAuthenticatedUser, markNotificationAsRead);

router
    .route("/user-dashboard-stats")
    .get(isAuthenticatedUser, getUserDashboardStats);

export default router;
