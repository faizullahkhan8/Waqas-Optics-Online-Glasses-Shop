import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../../store/wishlistSlice";
import { addToCart } from "../../store/cartSlice";
import { useRemoveFromWishlist } from "../../hooks/useWishlist";

export default function Wishlist() {
    const wishlist = useSelector((state) => state.wishlist.items);
    const dispatch = useDispatch();
    const removeFromWishlistMutation = useRemoveFromWishlist();

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await removeFromWishlistMutation.mutateAsync(productId);
            dispatch(removeFromWishlist(productId));
        } catch {
            // Error handling is done in the hook
        }
    };

    const handleAddToCart = async (product) => {
        try {
            dispatch(
                addToCart({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0]?.url || "",
                    quantity: 1,
                })
            );
            await removeFromWishlistMutation.mutateAsync(product._id);
            dispatch(removeFromWishlist(product._id));
        } catch {
            // Error handling is done in the hook
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
                My Wishlist
            </h2>

            {wishlist &&
            (Array.isArray(wishlist)
                ? wishlist.length
                : wishlist?.items?.length || 0) > 0 ? (
                <div className="grid gap-6">
                    {wishlist.map((product) => (
                        <div
                            key={product._id}
                            className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                            <img
                                src={
                                    product.images[0]?.url ||
                                    "/placeholder-image.jpg"
                                }
                                alt={product.name}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900 mb-1">
                                    {product.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2">
                                    {product.brand}
                                </p>
                                <p className="font-medium text-gray-900">
                                    ${product.price}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() =>
                                        handleRemoveFromWishlist(product._id)
                                    }
                                    className="px-4 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
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
