import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import {
    useStripeConfig,
    useCreatePaymentIntent,
    useConfirmPayment,
} from "../hooks/usePayment";
import toast from "react-hot-toast";

// Stripe Elements options
const cardElementOptions = {
    style: {
        base: {
            fontSize: "16px",
            color: "#424770",
            "::placeholder": {
                color: "#aab7c4",
            },
        },
        invalid: {
            color: "#9e2146",
        },
    },
};

// Payment Form Component
const PaymentForm = ({ amount, orderId, onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [paymentIntentCreated, setPaymentIntentCreated] = useState(false);
    const [lastAttemptTime, setLastAttemptTime] = useState(0);

    // Create payment intent mutation
    const createPaymentMutation = useCreatePaymentIntent();

    // Confirm payment mutation
    const confirmPaymentMutation = useConfirmPayment();

    // Handle payment intent creation success
    useEffect(() => {
        if (createPaymentMutation.data) {
            setClientSecret(createPaymentMutation.data.clientSecret);
            setPaymentIntentCreated(true);
        }
    }, [createPaymentMutation.data]);

    // Handle payment intent creation error
    useEffect(() => {
        if (createPaymentMutation.error) {
            console.error(
                "Payment intent creation failed:",
                createPaymentMutation.error
            );
            if (createPaymentMutation.error?.response?.status === 429) {
                toast.error(
                    "Too many payment requests. Please wait 15 minutes before trying again."
                );
                // Disable further attempts for rate limited requests
                setPaymentIntentCreated(true);
            } else {
                toast.error("Failed to initialize payment. Please try again.");
            }
            onError?.(createPaymentMutation.error);
        }
    }, [createPaymentMutation.error, onError]);

    // Initialize payment intent when component mounts
    useEffect(() => {
        const now = Date.now();
        const timeSinceLastAttempt = now - lastAttemptTime;

        if (
            amount &&
            amount > 0 &&
            !clientSecret &&
            !paymentIntentCreated &&
            !createPaymentMutation.loading &&
            timeSinceLastAttempt > 2000
        ) {
            setLastAttemptTime(now);
            createPaymentMutation.createIntent({ amount, orderId });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount, orderId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setIsProcessing(true);

        const cardElement = elements.getElement(CardElement);

        try {
            // Confirm payment with Stripe
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                    },
                }
            );

            if (error) {
                console.error("Payment failed:", error);
                toast.error(error.message);
                onError?.(error);
            } else if (paymentIntent.status === "succeeded") {
                // Confirm payment on backend
                try {
                    await confirmPaymentMutation.confirmPayment({
                        paymentIntentId: paymentIntent.id,
                        orderId,
                    });
                    toast.success("Payment successful!");
                    onSuccess?.(paymentIntent);
                } catch (confirmError) {
                    console.error("Payment confirmation failed:", confirmError);
                    toast.error("Payment succeeded but confirmation failed");
                }
            }
        } catch (err) {
            console.error("Payment error:", err);
            toast.error("Payment processing failed");
            onError?.(err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {createPaymentMutation.error?.response?.status === 429 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-yellow-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Payment Rate Limited
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                    Too many payment attempts. Please wait 15
                                    minutes before trying again.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="p-4 border border-gray-300 rounded-lg">
                <CardElement options={cardElementOptions} />
            </div>

            <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">
                    Total: ${amount?.toFixed(2)}
                </div>
                <button
                    type="submit"
                    disabled={
                        !stripe ||
                        isProcessing ||
                        createPaymentMutation.loading ||
                        !clientSecret ||
                        createPaymentMutation.error?.response?.status === 429
                    }
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    {isProcessing
                        ? "Processing..."
                        : createPaymentMutation.loading
                        ? "Initializing..."
                        : createPaymentMutation.error?.response?.status === 429
                        ? "Rate Limited - Try Later"
                        : `Pay $${amount?.toFixed(2)}`}
                </button>
            </div>
        </form>
    );
};

// Main Stripe Checkout Component
const StripeCheckout = ({ amount, orderId, onSuccess, onError }) => {
    const [stripePromise, setStripePromise] = useState(null);

    // Get Stripe config
    const { data: stripeConfig, isLoading, error } = useStripeConfig();

    useEffect(() => {
        if (stripeConfig?.publishableKey) {
            setStripePromise(loadStripe(stripeConfig.publishableKey));
        }
    }, [stripeConfig]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading payment form...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600 p-4 bg-red-50 rounded-lg">
                Failed to load payment form: {error.message}
            </div>
        );
    }

    if (!stripePromise) {
        return (
            <div className="text-gray-600 p-4">
                Stripe configuration not available
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise}>
            <PaymentForm
                amount={amount}
                orderId={orderId}
                onSuccess={onSuccess}
                onError={onError}
            />
        </Elements>
    );
};

export default StripeCheckout;
