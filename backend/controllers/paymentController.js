import Stripe from "stripe";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";

// Initialize Stripe lazily
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error(
            "STRIPE_SECRET_KEY is not set in environment variables"
        );
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// Create Payment Intent => POST /api/v1/payment/create-payment-intent
export const createPaymentIntent = async (req, res, next) => {
    try {
        const { amount, currency = "usd", orderId } = req.body;

        if (!amount) {
            return next(new ErrorHandler("Amount is required", 400));
        }

        // Create payment intent
        const paymentIntent = await getStripe().paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency,
            metadata: {
                orderId: orderId || "",
                userId: req.session.userId || "",
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        next(error);
    }
};

// Confirm Payment => POST /api/v1/payment/confirm-payment
export const confirmPayment = async (req, res, next) => {
    try {
        const { paymentIntentId, orderId } = req.body;

        // Retrieve payment intent from Stripe
        const paymentIntent = await getStripe().paymentIntents.retrieve(
            paymentIntentId
        );

        if (paymentIntent.status === "succeeded") {
            // Update order status if orderId is provided
            if (orderId) {
                await Order.findByIdAndUpdate(orderId, {
                    paymentStatus: "paid",
                    stripePaymentId: paymentIntentId,
                    orderStatus: "processing",
                });
            }

            res.status(200).json({
                success: true,
                message: "Payment confirmed successfully",
                paymentStatus: paymentIntent.status,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Payment not completed",
                paymentStatus: paymentIntent.status,
            });
        }
    } catch (error) {
        next(error);
    }
};

// Get Payment Status => GET /api/v1/payment/status/:paymentIntentId
export const getPaymentStatus = async (req, res, next) => {
    try {
        const { paymentIntentId } = req.params;

        const paymentIntent = await getStripe().paymentIntents.retrieve(
            paymentIntentId
        );

        res.status(200).json({
            success: true,
            paymentStatus: paymentIntent.status,
            amount: paymentIntent.amount / 100, // Convert from cents
            currency: paymentIntent.currency,
        });
    } catch (error) {
        next(error);
    }
};

// Stripe Webhook Handler => POST /api/v1/payment/webhook
export const handleWebhook = async (req, res, next) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = getStripe().webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object;
                console.log("Payment succeeded:", paymentIntent.id);

                // Update order status if metadata contains orderId
                if (paymentIntent.metadata.orderId) {
                    await Order.findByIdAndUpdate(
                        paymentIntent.metadata.orderId,
                        {
                            paymentStatus: "paid",
                            stripePaymentId: paymentIntent.id,
                            orderStatus: "processing",
                        }
                    );
                }
                break;

            case "payment_intent.payment_failed":
                const failedPayment = event.data.object;
                console.log("Payment failed:", failedPayment.id);

                // Update order status if metadata contains orderId
                if (failedPayment.metadata.orderId) {
                    await Order.findByIdAndUpdate(
                        failedPayment.metadata.orderId,
                        {
                            paymentStatus: "failed",
                            stripePaymentId: failedPayment.id,
                        }
                    );
                }
                break;

            case "payment_intent.canceled":
                const canceledPayment = event.data.object;
                console.log("Payment canceled:", canceledPayment.id);

                // Update order status if metadata contains orderId
                if (canceledPayment.metadata.orderId) {
                    await Order.findByIdAndUpdate(
                        canceledPayment.metadata.orderId,
                        {
                            paymentStatus: "canceled",
                            stripePaymentId: canceledPayment.id,
                        }
                    );
                }
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error("Error handling webhook:", error);
        next(error);
    }
};

// Create Customer => POST /api/v1/payment/create-customer
export const createCustomer = async (req, res, next) => {
    try {
        const { email, name, phone } = req.body;

        const customer = await getStripe().customers.create({
            email,
            name,
            phone,
            metadata: {
                userId: req.session.userId || "",
            },
        });

        res.status(200).json({
            success: true,
            customer,
        });
    } catch (error) {
        next(error);
    }
};

// Get Stripe Config (for frontend) => GET /api/v1/payment/config
export const getStripeConfig = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        });
    } catch (error) {
        next(error);
    }
};
