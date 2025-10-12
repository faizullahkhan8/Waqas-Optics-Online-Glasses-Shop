import { useWishlist, useRemoveFromWishlist } from "../../hooks/useWishlist";
import { useAddToCart } from "../../hooks/useCart";

export default function Wishlist() {
    const { data: wishlistData, loading, error, refetch } = useWishlist();
    const { removeFromWishlist } = useRemoveFromWishlist();
    const { addToCart } = useAddToCart();

    // Extract wishlist items from the response
    const wishlistItems = wishlistData?.wishlist?.items || [];

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await removeFromWishlist(productId);
            // Refetch wishlist to update the UI
            refetch();
        } catch (error) {
            // Error handling is done in the hook
            console.error("Failed to remove from wishlist:", error);
        }
    };

    const handleAddToCart = async (product) => {
        try {
            await addToCart({
                productId: product._id,
                quantity: 1,
            });
            // Remove from wishlist after adding to cart
            await removeFromWishlist(product._id);
            // Refetch wishlist to update the UI
            refetch();
        } catch (error) {
            // Error handling is done in the hook
            console.error("Failed to add to cart:", error);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="h-20 bg-gray-200 rounded"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-red-800 font-medium mb-2">
                        Error Loading Wishlist
                    </h3>
                    <p className="text-red-600 text-sm">{error}</p>
                    <button
                        onClick={refetch}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
                My Wishlist
            </h2>

            {wishlistItems &&
            (Array.isArray(wishlistItems) ? wishlistItems.length : 0) > 0 ? (
                <div className="grid gap-6">
                    {wishlistItems.map((item, index) => {
                        const product = item.product || {};
                        return (
                            <div
                                key={product._id || `wishlist-item-${index}`}
                                className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                            >
                                <img
                                    src={
                                        (product.images &&
                                            product.images[0]?.url) ||
                                        "/placeholder-image.jpg"
                                    }
                                    alt={product.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 mb-1">
                                        {product.name || "Unknown Product"}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        {product.brand || "Unknown Brand"}
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        ${product.price || "0.00"}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() =>
                                            product._id &&
                                            handleAddToCart(product)
                                        }
                                        className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                                        disabled={!product._id}
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() =>
                                            product._id &&
                                            handleRemoveFromWishlist(
                                                product._id
                                            )
                                        }
                                        className="px-4 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors"
                                        disabled={!product._id}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-600 mb-4">Your wishlist is empty</p>
                    <a
                        href="/shop"
                        className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Browse Products
                    </a>
                </div>
            )}
        </div>
    );
}
