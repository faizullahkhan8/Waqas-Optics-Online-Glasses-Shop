import express from "express";
const router = express.Router();
import {
    createPaymentIntent,
    confirmPayment,
    getPaymentStatus,
    handleWebhook,
    createCustomer,
    getStripeConfig,
} from "../controllers/paymentController.js";
import { isAuthenticatedUser } from "../middleware/auth.js";

// Public routes
router.get("/config", getStripeConfig);

// Webhook route (must be before express.json() middleware affects it)
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    handleWebhook
);

// Protected routes (require authentication)
router.post("/create-payment-intent", isAuthenticatedUser, createPaymentIntent);
router.post("/confirm-payment", isAuthenticatedUser, confirmPayment);
router.get("/status/:paymentIntentId", isAuthenticatedUser, getPaymentStatus);
router.post("/create-customer", isAuthenticatedUser, createCustomer);

export default router;
