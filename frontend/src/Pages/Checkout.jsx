import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../store/cartSlice";
import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";
import Button from "../components/UI/Button";
import { useCreateOrder } from "../hooks/useOrders";
import { useCreateCheckoutSession } from "../hooks/usePayment";

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        state: "",
        postal: "",
        country: "",
        phone: "",
    });
    const [errors, setErrors] = useState({});
    const [payment, setPayment] = useState("cod");
    const [stripeError, setStripeError] = useState(null);

    // Check for error messages in URL params
    useEffect(() => {
        const error = searchParams.get("error");
        if (error) {
            if (error === "payment_cancelled") {
                setStripeError("Payment was cancelled. Please try again.");
            } else if (error === "no_session_id") {
                setStripeError("Invalid payment session. Please try again.");
            }
        }
    }, [searchParams]);

    // Memoize cart total to prevent unnecessary recalculations
    const cartTotal = useMemo(() => {
        return cart.reduce((s, i) => s + i.price * i.qty, 0);
    }, [cart]);

    // API action hooks
    const createOrderAction = useCreateOrder();
    const createCheckoutSessionAction = useCreateCheckoutSession();

    function validate() {
        const e = {};
        if (!form.name) e.name = "Name required";
        if (!form.email || !/\S+@\S+/.test(form.email))
            e.email = "Valid email required";
        if (!form.address) e.address = "Address required";
        if (!form.city) e.city = "City required";
        if (!form.state) e.state = "State required";
        if (!form.postal) e.postal = "Postal code required";
        if (!form.country) e.country = "Country required";
        if (!form.phone) e.phone = "Phone number required";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function placeOrder() {
        if (!validate()) return;

        if (payment === "card") {
            // Create Stripe checkout session and redirect
            const orderData = {
                shippingInfo: {
                    address: {
                        line1: form.address,
                        city: form.city,
                        state: form.state,
                        country: form.country,
                        postalCode: form.postal,
                        phone: form.phone,
                    },
                },
            };

            try {
                const res = await createCheckoutSessionAction.createSession(
                    orderData
                );
                // Redirect to Stripe checkout page
                window.location.href = res.url;
            } catch (err) {
                setStripeError(
                    err?.response?.data?.message ||
                        "Failed to create checkout session"
                );
            }
            return;
        }

        // Send order to backend for COD
        const orderData = {
            shippingInfo: {
                address: {
                    line1: form.address,
                    city: form.city,
                    state: form.state,
                    country: form.country,
                    postalCode: form.postal,
                    phone: form.phone,
                },
            },
            paymentInfo: {
                id: "COD-" + Date.now(), // Generate a unique ID for COD
                status: "pending",
            },
        };
        try {
            const res = await createOrderAction.createOrder(orderData);
            dispatch(clearCart());
            navigate(
                `/thank-you?order=${res.orderId || res.order?._id || res._id}`
            );
        } catch (err) {
            setErrors({
                submit: err?.response?.data?.message || "Order failed",
            });
        }
    }

    return (
        <main>
            <Helmet>
                <title>Checkout — GlassesShop</title>
            </Helmet>
            <section className="py-16 bg-gray-50">
                <Container>
                    <div className="max-w-2xl mx-auto text-center mb-12">
                        <h1 className="text-4xl font-serif font-bold text-gray-900">
                            Checkout
                        </h1>
                        <p className="mt-4 text-gray-600">
                            Complete your purchase securely
                        </p>
                    </div>

                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="bg-white rounded-xl shadow-sm p-8">
                                <h2 className="font-serif text-2xl text-gray-900 mb-8">
                                    Shipping Details
                                </h2>
                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                value={form.name}
                                                onChange={(e) =>
                                                    setForm((s) => ({
                                                        ...s,
                                                        name: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                                            />
                                            {errors.name && (
                                                <div className="mt-2 text-red-500 text-sm">
                                                    {errors.name}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={(e) =>
                                                    setForm((s) => ({
                                                        ...s,
                                                        email: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                                            />
                                            {errors.email && (
                                                <div className="mt-2 text-red-500 text-sm">
                                                    {errors.email}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Street Address
                                        </label>
                                        <input
                                            value={form.address}
                                            onChange={(e) =>
                                                setForm((s) => ({
                                                    ...s,
                                                    address: e.target.value,
                                                }))
                                            }
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                                        />
                                        {errors.address && (
                                            <div className="mt-2 text-red-500 text-sm">
                                                {errors.address}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City
                                            </label>
                                            <input
                                                value={form.city}
                                                onChange={(e) =>
                                                    setForm((s) => ({
                                                        ...s,
                                                        city: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Postal Code
                                            </label>
                                            <input
                                                value={form.postal}
                                                onChange={(e) =>
                                                    setForm((s) => ({
                                                        ...s,
                                                        postal: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                State
                                            </label>
                                            <input
                                                value={form.state}
                                                onChange={(e) =>
                                                    setForm((s) => ({
                                                        ...s,
                                                        state: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                                            />
                                            {errors.state && (
                                                <div className="mt-2 text-red-500 text-sm">
                                                    {errors.state}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Country
                                            </label>
                                            <input
                                                value={form.country}
                                                onChange={(e) =>
                                                    setForm((s) => ({
                                                        ...s,
                                                        country: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                                            />
                                            {errors.country && (
                                                <div className="mt-2 text-red-500 text-sm">
                                                    {errors.country}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={form.phone}
                                                onChange={(e) =>
                                                    setForm((s) => ({
                                                        ...s,
                                                        phone: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                                            />
                                            {errors.phone && (
                                                <div className="mt-2 text-red-500 text-sm">
                                                    {errors.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Payment Method
                                        </label>
                                        <div className="flex gap-6 mb-4">
                                            <label
                                                className={`flex items-center gap-3 cursor-pointer px-4 py-2 rounded-lg border transition-colors ${
                                                    payment === "cod"
                                                        ? "border-gray-900 bg-gray-50"
                                                        : "border-gray-200 bg-white hover:bg-gray-50"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="cod"
                                                    checked={payment === "cod"}
                                                    onChange={() =>
                                                        setPayment("cod")
                                                    }
                                                    className="h-4 w-4 text-gray-900 border-gray-300"
                                                />
                                                <span className="text-gray-900 font-medium">
                                                    Cash on Delivery
                                                </span>
                                            </label>
                                            <label
                                                className={`flex items-center gap-3 cursor-pointer px-4 py-2 rounded-lg border transition-colors ${
                                                    payment === "card"
                                                        ? "border-gray-900 bg-gray-50"
                                                        : "border-gray-200 bg-white hover:bg-gray-50"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value="card"
                                                    checked={payment === "card"}
                                                    onChange={() =>
                                                        setPayment("card")
                                                    }
                                                    className="h-4 w-4 text-gray-900 border-gray-300"
                                                />
                                                <span className="text-gray-900 font-medium">
                                                    Card
                                                </span>
                                            </label>
                                        </div>
                                        {payment === "card" && (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0">
                                                            <svg
                                                                className="h-5 w-5 text-blue-400"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-3">
                                                            <h3 className="text-sm font-medium text-blue-800">
                                                                Secure Payment
                                                                with Stripe
                                                            </h3>
                                                            <div className="mt-2 text-sm text-blue-700">
                                                                <p>
                                                                    You'll be
                                                                    redirected
                                                                    to Stripe's
                                                                    secure
                                                                    checkout
                                                                    page to
                                                                    complete
                                                                    your
                                                                    payment.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {stripeError && (
                                                    <div className="mt-2 text-red-500 text-sm">
                                                        {stripeError}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {errors.submit && (
                                        <div className="mt-2 text-red-500 text-sm">
                                            {errors.submit}
                                        </div>
                                    )}
                                </form>
                            </div>

                            <div>
                                <div className="bg-white rounded-xl shadow-sm p-8 sticky top-24">
                                    <h2 className="font-serif text-2xl text-gray-900 mb-6">
                                        Order Summary
                                    </h2>
                                    <div className="divide-y divide-gray-100">
                                        {cart.map((item) => (
                                            <div
                                                key={item._id}
                                                className="py-4 flex items-center gap-4"
                                            >
                                                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={
                                                            item.images?.[0] ||
                                                            "/placeholder-product.svg"
                                                        }
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900 truncate">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Quantity: {item.qty}
                                                    </p>
                                                </div>
                                                <div className="text-gray-900 font-medium">
                                                    $
                                                    {(
                                                        item.price * item.qty
                                                    ).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Subtotal</span>
                                            <span>${cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Shipping</span>
                                            <span>Free</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Tax</span>
                                            <span>Calculated at next step</span>
                                        </div>
                                        <div className="border-t border-gray-100 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-serif text-gray-900">
                                                    Total
                                                </span>
                                                <span className="text-2xl font-medium text-gray-900">
                                                    ${cartTotal.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        {payment === "cod" && (
                                            <Button
                                                className="w-full px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    placeOrder();
                                                }}
                                            >
                                                Complete Order
                                            </Button>
                                        )}
                                        {payment === "card" && (
                                            <Button
                                                className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    placeOrder();
                                                }}
                                                disabled={
                                                    createCheckoutSessionAction.loading
                                                }
                                            >
                                                {createCheckoutSessionAction.loading
                                                    ? "Redirecting to Payment..."
                                                    : "Pay with Stripe"}
                                            </Button>
                                        )}
                                        <p className="mt-4 text-sm text-center text-gray-500">
                                            By placing your order, you agree to
                                            our Terms of Service and Privacy
                                            Policy
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
