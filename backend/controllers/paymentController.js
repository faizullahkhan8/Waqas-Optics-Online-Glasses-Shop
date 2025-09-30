import Stripe from "stripe";
import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
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

// Create Stripe Checkout Session => POST /api/v1/payment/create-checkout-session
export const createCheckoutSession = async (req, res, next) => {
    try {
        const { shippingInfo } = req.body;

        if (!shippingInfo) {
            return next(
                new ErrorHandler("Shipping information is required", 400)
            );
        }

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user._id }).populate(
            "items.product"
        );
        if (!cart || cart.items.length === 0) {
            return next(new ErrorHandler("Cart is empty", 400));
        }

        // Calculate pricing
        const itemsPrice = cart.totalPrice;
        const taxPrice = itemsPrice * 0.15; // 15% tax
        const shippingPrice = itemsPrice > 200 ? 0 : 25; // Free shipping over $200
        const totalPrice = itemsPrice + taxPrice + shippingPrice;

        // Create line items for Stripe
        const lineItems = cart.items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                },
                unit_amount: Math.round(item.price * 100), // Convert to cents
            },
            quantity: item.quantity,
        }));

        // Add tax and shipping as line items if applicable
        if (taxPrice > 0) {
            lineItems.push({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Tax (15%)",
                    },
                    unit_amount: Math.round(taxPrice * 100),
                },
                quantity: 1,
            });
        }

        if (shippingPrice > 0) {
            lineItems.push({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Shipping",
                    },
                    unit_amount: Math.round(shippingPrice * 100),
                },
                quantity: 1,
            });
        }

        // Create Stripe checkout session
        const session = await getStripe().checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${
                process.env.FRONTEND_URL || "http://localhost:3002"
            }/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${
                process.env.FRONTEND_URL || "http://localhost:3002"
            }/checkout?error=payment_cancelled`,
            metadata: {
                userId: req.user._id.toString(),
                shippingInfo: JSON.stringify(shippingInfo),
                cartId: cart._id.toString(),
                itemsPrice: itemsPrice.toString(),
                taxPrice: taxPrice.toString(),
                shippingPrice: shippingPrice.toString(),
                totalPrice: totalPrice.toString(),
            },
        });

        res.status(200).json({
            success: true,
            sessionId: session.id,
            url: session.url,
        });
    } catch (error) {
        next(error);
    }
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

// Verify Stripe Checkout Session and Create Order => POST /api/v1/payment/verify-session
export const verifyCheckoutSession = async (req, res, next) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return next(new ErrorHandler("Session ID is required", 400));
        }

        // Retrieve the checkout session from Stripe
        const session = await getStripe().checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            return next(new ErrorHandler("Payment not completed", 400));
        }

        // Parse metadata
        const shippingInfo = JSON.parse(session.metadata.shippingInfo);
        const cartId = session.metadata.cartId;
        const userId = session.metadata.userId;
        const itemsPrice = parseFloat(session.metadata.itemsPrice);
        const taxPrice = parseFloat(session.metadata.taxPrice);
        const shippingPrice = parseFloat(session.metadata.shippingPrice);
        const totalPrice = parseFloat(session.metadata.totalPrice);

        // Get the cart
        const cart = await Cart.findById(cartId).populate("items.product");
        if (!cart) {
            return next(new ErrorHandler("Cart not found", 404));
        }

        // Create order
        const order = await Order.create({
            shippingInfo,
            orderItems: cart.items,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo: {
                id: session.payment_intent,
                status: "paid",
            },
            stripePaymentId: session.payment_intent,
            paymentStatus: "paid",
            paidAt: Date.now(),
            user: userId,
        });

        // Update stock
        for (const item of order.orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock -= item.quantity;
                await product.save({ validateModifiedOnly: true });
            }
        }

        // Clear cart
        cart.items = [];
        await cart.save({ validateModifiedOnly: true });

        res.status(201).json({
            success: true,
            order,
            orderId: order._id,
        });
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
