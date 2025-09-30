import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";
import ProductGrid from "../components/Product/ProductGrid";
import Button from "../components/UI/Button";
import { Link } from "react-router-dom";
import { useWishlist } from "../hooks/useWishlist";
import { useDispatch } from "react-redux";

export default function WishlistPage() {
    const { data: wishlistData, isLoading } = useWishlist();
    const dispatch = useDispatch();
    const wishlist = wishlistData?.items || wishlistData || [];
    dispatch({
        type: "wishlist/setWishlist",
        payload: wishlist.map((item) => item.product),
    });

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
                    {isLoading ? (
                        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm p-10 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Loading your wishlist...
                            </h2>
                        </div>
                    ) : (Array.isArray(wishlist)
                          ? wishlist.length
                          : wishlist?.items?.length || 0) === 0 ? (
                        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm p-10 text-center">
                            <div className="text-5xl mb-4">💖</div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Your wishlist is empty
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Browse our shop and add products you love!
                            </p>
                            <Link
                                to="/shop"
                                className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Go to Shop
                            </Link>
                        </div>
                    ) : (
                        <ProductGrid
                            products={wishlist.map((item) => item.product)}
                        />
                    )}
                </Container>
            </section>
        </main>
    );
}
