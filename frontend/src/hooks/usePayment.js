import { useState, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
    getStripeConfig,
    createCheckoutSession,
    verifyCheckoutSession,
    createPaymentIntent,
    confirmPayment,
} from "../services/paymentService";

// Get Stripe configuration
export const useStripeConfig = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStripeConfig = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getStripeConfig();
            setData(result);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to fetch Stripe config"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStripeConfig();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { data, loading, error, refetch: fetchStripeConfig };
};

// Create Stripe Checkout Session
export const useCreateCheckoutSession = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createSession = useCallback(async (sessionData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await createCheckoutSession(sessionData);
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                "Failed to create checkout session";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createSession, loading, error };
};

// Create payment intent (kept for backward compatibility)
export const useCreatePaymentIntent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createIntent = useCallback(
        async ({ amount, currency = "usd", orderId }) => {
            setLoading(true);
            setError(null);
            try {
                const data = await createPaymentIntent(
                    amount,
                    currency,
                    orderId
                );
                return data;
            } catch (err) {
                const errorMsg =
                    err.response?.data?.message ||
                    "Failed to create payment intent";
                setError(errorMsg);
                toast.error(errorMsg);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { createIntent, loading, error };
};

// Verify checkout session
export const useVerifyCheckoutSession = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const verifySession = useCallback(async (sessionId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await verifyCheckoutSession(sessionId);
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                "Failed to verify checkout session";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { verifySession, loading, error };
};

// Confirm payment
export const useConfirmPayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const confirmPaymentAction = useCallback(
        async ({ paymentIntentId, orderId }) => {
            setLoading(true);
            setError(null);
            try {
                const data = await confirmPayment(paymentIntentId, orderId);
                toast.success("Payment confirmed successfully!");
                return data;
            } catch (err) {
                const errorMsg =
                    err.response?.data?.message || "Failed to confirm payment";
                setError(errorMsg);
                toast.error(errorMsg);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { confirmPayment: confirmPaymentAction, loading, error };
};
