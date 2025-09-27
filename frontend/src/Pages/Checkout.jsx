import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../store/cartSlice";
import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";
import Button from "../components/UI/Button";
import StripeCheckout from "../components/StripeCheckout";
import { orderApi } from "../services/orderService";

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        postal: "",
    });
    const [errors, setErrors] = useState({});
    const [payment, setPayment] = useState("cod");
    const [stripeError, setStripeError] = useState(null);

    function validate() {
        const e = {};
        if (!form.name) e.name = "Name required";
        if (!form.email || !/\S+@\S+/.test(form.email))
            e.email = "Valid email required";
        if (!form.address) e.address = "Address required";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function placeOrder() {
        if (!validate()) return;
        if (payment === "card") {
            // Stripe payment handled in StripeCheckout
            return;
        }
        // Send order to backend for COD
        try {
            const orderData = {
                items: cart,
                total: cart.reduce((s, i) => s + i.price * i.qty, 0),
                customer: form,
                payment,
            };
            const res = await orderApi.createOrder(orderData);
            dispatch(clearCart());
            navigate(`/thank-you?order=${res.data.orderId || res.data._id}`);
        } catch (err) {
            setErrors({
                submit: err?.response?.data?.message || "Order failed",
            });
        }
    }

    async function handleStripeSuccess(paymentIntent) {
        // Send order to backend with Stripe payment info
        try {
            const orderData = {
                items: cart,
                total: cart.reduce((s, i) => s + i.price * i.qty, 0),
                customer: form,
                payment: "card",
                stripePaymentId: paymentIntent.id,
            };
            const res = await orderApi.createOrder(orderData);
            dispatch(clearCart());
            navigate(`/thank-you?order=${res.data.orderId || res.data._id}`);
        } catch (err) {
            setStripeError(err?.response?.data?.message || "Order failed");
        }
    }
    function handleStripeError(error) {
        setStripeError(error?.message || "Payment failed");
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
                                                <StripeCheckout
                                                    amount={cart.reduce(
                                                        (s, i) =>
                                                            s + i.price * i.qty,
                                                        0
                                                    )}
                                                    onSuccess={
                                                        handleStripeSuccess
                                                    }
                                                    onError={handleStripeError}
                                                />
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
                                                key={item.id}
                                                className="py-4 flex items-center gap-4"
                                            >
                                                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={item.images[0]}
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
                                            <span>
                                                $
                                                {cart
                                                    .reduce(
                                                        (s, i) =>
                                                            s + i.price * i.qty,
                                                        0
                                                    )
                                                    .toFixed(2)}
                                            </span>
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
                                                    $
                                                    {cart
                                                        .reduce(
                                                            (s, i) =>
                                                                s +
                                                                i.price * i.qty,
                                                            0
                                                        )
                                                        .toFixed(2)}
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
                                                className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    // StripeCheckout handles payment
                                                }}
                                                disabled
                                            >
                                                Pay with Card
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
