import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    getStripeConfig,
    createPaymentIntent,
    confirmPayment,
} from "../services/paymentService";
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

    // Create payment intent mutation
    const createPaymentMutation = useMutation({
        mutationFn: ({ amount, orderId }) =>
            createPaymentIntent(amount, "usd", orderId),
        onSuccess: (data) => {
            setClientSecret(data.clientSecret);
        },
        onError: (error) => {
            console.error("Payment intent creation failed:", error);
            toast.error("Failed to initialize payment");
            onError?.(error);
        },
    });

    // Initialize payment intent when component mounts
    useEffect(() => {
        if (amount && !clientSecret) {
            createPaymentMutation.mutate({ amount, orderId });
        }
    }, [amount, orderId, clientSecret, createPaymentMutation]);

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
                    await confirmPayment(paymentIntent.id, orderId);
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
                        createPaymentMutation.isPending
                    }
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    {isProcessing
                        ? "Processing..."
                        : createPaymentMutation.isPending
                        ? "Initializing..."
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
    const {
        data: stripeConfig,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["stripe-config"],
        queryFn: getStripeConfig,
    });

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
