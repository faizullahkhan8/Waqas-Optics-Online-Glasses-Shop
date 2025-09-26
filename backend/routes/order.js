const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
    createOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    createPaymentIntent,
} = require("../controllers/orderController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

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
router
    .route("/order/new")
    .post(isAuthenticatedUser, orderValidation, createOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router.route("/payment/intent").post(isAuthenticatedUser, createPaymentIntent);

// Admin routes
router
    .route("/admin/orders")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
    .route("/admin/order/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);

module.exports = router;
