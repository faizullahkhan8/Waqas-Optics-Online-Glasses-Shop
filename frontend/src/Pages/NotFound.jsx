import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <main>
            <Helmet>
                <title>Page Not Found — GlassesShop</title>
            </Helmet>
            <section className="min-h-[80vh] flex items-center justify-center py-20 bg-gray-50">
                <Container>
                    <div className="max-w-md mx-auto text-center">
                        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
                            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                                Page Not Found
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Oops! It seems the page you're looking for has
                                wandered off. Let's get you back on track.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/"
                                    className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Return Home
                                </Link>
                                <Link
                                    to="/shop"
                                    className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors"
                                >
                                    Browse Collection
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-8 text-gray-500">
                            <Link
                                to="/contact"
                                className="hover:text-gray-900 transition-colors"
                            >
                                Need Help?
                            </Link>
                            <Link
                                to="/about"
                                className="hover:text-gray-900 transition-colors"
                            >
                                About Us
                            </Link>
                            <Link
                                to="/shop"
                                className="hover:text-gray-900 transition-colors"
                            >
                                Shop
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
