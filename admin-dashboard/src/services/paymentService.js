import { api } from "../lib/api";

// Get Stripe configuration (publishable key)
export const getStripeConfig = async () => {
    const res = await api.get("/payment/config");
    return res.data;
};

// Create payment intent
export const createPaymentIntent = async (
    amount,
    currency = "usd",
    orderId = null
) => {
    const res = await api.post("/payment/create-payment-intent", {
        amount,
        currency,
        orderId,
    });
    return res.data;
};

// Confirm payment
export const confirmPayment = async (paymentIntentId, orderId = null) => {
    const res = await api.post("/payment/confirm-payment", {
        paymentIntentId,
        orderId,
    });
    return res.data;
};

// Get payment status
export const getPaymentStatus = async (paymentIntentId) => {
    const res = await api.get(`/payment/status/${paymentIntentId}`);
    return res.data;
};

// Create Stripe customer
export const createCustomer = async (email, name, phone) => {
    const res = await api.post("/payment/create-customer", {
        email,
        name,
        phone,
    });
    return res.data;
};
