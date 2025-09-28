import { useQuery, useMutation } from "@tanstack/react-query";
import {
    getStripeConfig,
    createCheckoutSession,
    verifyCheckoutSession,
    createPaymentIntent,
    confirmPayment,
} from "../services/paymentService";

// Query Keys
export const paymentKeys = {
    all: ["payment"],
    config: () => [...paymentKeys.all, "config"],
};

// Get Stripe configuration
export const useStripeConfig = () => {
    return useQuery({
        queryKey: paymentKeys.config(),
        queryFn: getStripeConfig,
        staleTime: 1000 * 60 * 30, // 30 minutes - config doesn't change often
    });
};

// Create Stripe Checkout Session mutation
export const useCreateCheckoutSession = () => {
    return useMutation({
        mutationFn: createCheckoutSession,
        retry: (failureCount, error) => {
            // Don't retry on 429 (rate limit) errors
            if (error?.response?.status === 429) {
                return false;
            }
            // Retry other errors up to 2 times
            return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

// Create payment intent mutation (kept for backward compatibility)
export const useCreatePaymentIntent = () => {
    return useMutation({
        mutationFn: ({ amount, currency = "usd", orderId }) =>
            createPaymentIntent(amount, currency, orderId),
        retry: (failureCount, error) => {
            // Don't retry on 429 (rate limit) errors
            if (error?.response?.status === 429) {
                return false;
            }
            // Retry other errors up to 2 times
            return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

// Verify checkout session mutation
export const useVerifyCheckoutSession = () => {
    return useMutation({
        mutationFn: verifyCheckoutSession,
    });
};

// Confirm payment mutation
export const useConfirmPayment = () => {
    return useMutation({
        mutationFn: ({ paymentIntentId, orderId }) =>
            confirmPayment(paymentIntentId, orderId),
    });
};
