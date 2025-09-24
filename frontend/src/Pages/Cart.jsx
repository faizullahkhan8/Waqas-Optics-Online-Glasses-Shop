import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateQty, removeFromCart, clearCart } from "../store/cartSlice";
import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";
import Button from "../components/UI/Button";
import toast from "react-hot-toast";

export default function CartPage() {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const navigate = useNavigate();
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

    return (
        <main>
            <Helmet>
                <title>Cart — GlassesShop</title>
            </Helmet>
            <section className="py-16 bg-gray-50">
                <Container>
                    <div className="max-w-2xl mx-auto text-center mb-12">
                        <h1 className="text-4xl font-serif font-bold text-gray-900">
                            Shopping Cart
                        </h1>
                        <p className="mt-4 text-gray-600">
                            {cart.length === 0
                                ? "Your cart is empty"
                                : `${cart.length} ${
                                      cart.length === 1 ? "item" : "items"
                                  } in your cart`}
                        </p>
                    </div>

                    {cart.length === 0 ? (
                        <div className="max-w-md mx-auto text-center bg-white rounded-2xl p-8 shadow-sm">
                            <p className="text-gray-600 mb-6">
                                Your shopping cart is empty. Discover our
                                collection and find your perfect pair.
                            </p>
                            <Link
                                to="/shop"
                                className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex gap-6">
                                            <Link
                                                to={`/product/${item.slug}`}
                                                className="shrink-0 aspect-square w-24 h-24 rounded-lg overflow-hidden bg-gray-100"
                                            >
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <Link
                                                            to={`/product/${item.slug}`}
                                                            className="block font-serif text-lg text-gray-900 hover:text-gray-600 transition-colors"
                                                        >
                                                            {item.title}
                                                        </Link>
                                                        <p className="mt-1 text-gray-600">
                                                            $
                                                            {item.price.toFixed(
                                                                2
                                                            )}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        onClick={() => {
                                                            dispatch(
                                                                removeFromCart(
                                                                    item.id
                                                                )
                                                            );
                                                            toast.success(
                                                                `${item.title} removed from cart`
                                                            );
                                                        }}
                                                        className="text-gray-400 hover:text-red-500 bg-transparent shadow-none p-1"
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                                <div className="mt-4 flex items-center gap-4">
                                                    <div className="flex items-center">
                                                        <label className="mr-3 text-sm text-gray-600">
                                                            Quantity
                                                        </label>
                                                        <div className="relative">
                                                            <select
                                                                value={item.qty}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const qty =
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    if (
                                                                        qty > 0
                                                                    ) {
                                                                        dispatch(
                                                                            updateQty(
                                                                                {
                                                                                    id: item.id,
                                                                                    qty,
                                                                                }
                                                                            )
                                                                        );
                                                                        toast.success(
                                                                            `Updated ${item.title} quantity`
                                                                        );
                                                                    }
                                                                }}
                                                                className="appearance-none bg-gray-100 border-0 rounded-lg py-2 pl-4 pr-8 text-gray-900 focus:ring-2 focus:ring-gray-900"
                                                            >
                                                                {[
                                                                    1, 2, 3, 4,
                                                                    5, 6, 7, 8,
                                                                    9, 10,
                                                                ].map((n) => (
                                                                    <option
                                                                        key={n}
                                                                        value={
                                                                            n
                                                                        }
                                                                    >
                                                                        {n}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                                                                <svg
                                                                    className="h-4 w-4"
                                                                    fill="none"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path d="M19 9l-7 7-7-7"></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-lg font-medium text-gray-900">
                                                        $
                                                        {(
                                                            item.price *
                                                            item.qty
                                                        ).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <aside className="bg-white rounded-xl p-6 shadow-sm h-fit lg:sticky lg:top-24">
                                <h2 className="font-serif text-2xl text-gray-900">
                                    Order Summary
                                </h2>
                                <div className="mt-6 space-y-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-gray-900">
                                            ${subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4">
                                        <div className="flex justify-between text-lg">
                                            <span className="font-serif">
                                                Total
                                            </span>
                                            <span className="font-medium">
                                                ${subtotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <div className="relative">
                                        <input
                                            placeholder="Enter promo code"
                                            className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-gray-900"
                                        />
                                        <Button className="absolute right-2 top-2 px-4 py-1.5 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800">
                                            Apply
                                        </Button>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <Button
                                        className="w-full px-8 py-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                                        onClick={() => navigate("/checkout")}
                                    >
                                        Proceed to Checkout
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            dispatch(clearCart());
                                            toast.success("Cart cleared");
                                        }}
                                        className="w-full px-8 py-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                    >
                                        Clear Cart
                                    </Button>
                                </div>
                            </aside>
                        </div>
                    )}
                </Container>
            </section>
        </main>
    );
}
