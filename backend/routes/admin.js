const express = require("express");
const router = express.Router();
const {
    getDashboardStats,
    getAnalytics,
    getRecentOrders,
    getTopProducts,
    getSalesData,
} = require("../controllers/adminController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { getAllUsers } = require("../controllers/adminController");

// Protect all admin routes: require authentication and admin role
router.use(isAuthenticatedUser, authorizeRoles("admin"));

// Dashboard routes
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/recent-orders", getRecentOrders);

// Admin users
router.get("/users", getAllUsers);

// Analytics routes
router.get("/analytics/overview", getAnalytics);
router.get("/analytics/sales-data", getSalesData);
router.get("/analytics/top-products", getTopProducts);

module.exports = router;
