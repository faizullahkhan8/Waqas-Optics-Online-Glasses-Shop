import { Helmet } from "react-helmet";
import { Link, useLocation } from "react-router-dom";
import Container from "../components/UI/Container";

export default function ThankYouPage() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const orderId = params.get("order");
    return (
        <main>
            <Helmet>
                <title>Thank You — GlassesShop</title>
            </Helmet>
            <section className="min-h-[80vh] flex items-center py-16 bg-gray-50">
                <Container>
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gray-900 text-white flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>

                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                            Thank You for Your Order
                        </h1>

                        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                            <p className="text-gray-600 mb-4">
                                We're excited to fulfill your order! A
                                confirmation email will be sent to you shortly.
                            </p>
                            <div className="inline-block px-6 py-3 bg-gray-100 rounded-lg text-gray-900 font-medium mb-4">
                                Order ID: {orderId}
                            </div>
                            <p className="text-sm text-gray-500">
                                Please save this order number for your reference
                            </p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-600">
                                Need help with your order? Our customer service
                                team is here to assist you.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                                <Link
                                    to="/"
                                    className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Return to Home
                                </Link>
                                <Link
                                    to="/shop"
                                    className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex items-center justify-center gap-8 text-gray-500">
                                <Link
                                    to="/contact"
                                    className="hover:text-gray-900 transition-colors"
                                >
                                    Contact Us
                                </Link>
                                <Link
                                    to="/faq"
                                    className="hover:text-gray-900 transition-colors"
                                >
                                    FAQs
                                </Link>
                                <Link
                                    to="/track-order"
                                    className="hover:text-gray-900 transition-colors"
                                >
                                    Track Order
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
