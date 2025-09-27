import express from "express";
const router = express.Router();
import {
    getDashboardStats,
    getAnalytics,
    getRecentOrders,
    getTopProducts,
    getSalesData,
    getAllUsers,
} from "../controllers/adminController.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";

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

export default router;
