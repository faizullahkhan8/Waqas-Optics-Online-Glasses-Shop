import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";
import ProductGrid from "../components/Product/ProductGrid";
import Button from "../components/UI/Button";
import { Link } from "react-router-dom";

export default function WishlistPage() {
    const wishlist = useSelector((state) => state.wishlist);

    return (
        <main>
            <Helmet>
                <title>Wishlist — GlassesShop</title>
                <meta name="description" content="Your saved products" />
            </Helmet>
            <section className="py-16 bg-gray-50 min-h-[60vh]">
                <Container>
                    <div className="max-w-2xl mx-auto text-center mb-12">
                        <h1 className="text-4xl font-serif font-bold text-gray-900">
                            My Wishlist
                        </h1>
                        <p className="mt-4 text-gray-600">
                            All your favorite products in one place
                        </p>
                    </div>

                    {wishlist.length === 0 ? (
                        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm p-10 text-center">
                            <div className="text-5xl mb-4">💖</div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Your wishlist is empty
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Browse our shop and add products you love!
                            </p>
                            <Button
                                as={Link}
                                to="/shop"
                                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                            >
                                Go to Shop
                            </Button>
                        </div>
                    ) : (
                        <ProductGrid products={wishlist} />
                    )}
                </Container>
            </section>
        </main>
    );
}
