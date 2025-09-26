const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    createCoupon,
    validateCoupon,
    getNotifications,
    markNotificationAsRead,
    clearAllNotifications,
} = require("../controllers/additionalController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

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

module.exports = router;
