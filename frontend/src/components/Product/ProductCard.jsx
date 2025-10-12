import { Link } from "react-router-dom";
import Button from "../UI/Button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../store/wishlistSlice";
import {
    useAddToWishlist,
    useRemoveFromWishlist,
} from "../../hooks/useWishlist";
import { useAddToCart } from "../../hooks/useCart";

export default function ProductCard({ product }) {
    const dispatch = useDispatch();
    const wishlist = useSelector((state) => state?.wishlist?.items || []);
    const isInWishlist = wishlist?.some((item) => item._id === product._id);

    const addToWishlistMutation = useAddToWishlist();
    const removeFromWishlistMutation = useRemoveFromWishlist();
    const addToCartMutation = useAddToCart();

    const handleAddToCart = async () => {
        try {
            await addToCartMutation.addToCart({
                productId: product._id,
                quantity: 1,
            });
            dispatch(addToCart({ ...product, qty: 1 }));
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    const handleToggleWishlist = async () => {
        try {
            if (isInWishlist) {
                await removeFromWishlistMutation.removeFromWishlist(
                    product?._id
                );
                dispatch(removeFromWishlist(product?._id));
            } else {
                await addToWishlistMutation.addToWishlist(product?._id);
                dispatch(addToWishlist(product));
            }
        } catch (error) {
            console.error("Failed to update wishlist:", error);
        }
    };

    return (
        <article
            className="group relative overflow-hidden bg-white"
            aria-labelledby={`p-${product?._id || "unknown"}`}
        >
            <div className="relative">
                <Link
                    to={`/product/${product?._id || ""}`}
                    className="block aspect-[4/5] sm:aspect-[4/5] overflow-hidden bg-gray-100"
                >
                    <img
                        src={
                            product.images?.[0] ||
                            "/images/products/placeholder-product.svg"
                        }
                        alt={product?.name || "Product"}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                    />
                </Link>
                <Button
                    onClick={handleToggleWishlist}
                    aria-label={`Toggle wishlist for ${
                        product?.name || "Product"
                    }`}
                    className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                        isInWishlist
                            ? "text-red-500"
                            : "text-gray-600 hover:text-red-500"
                    }`}
                >
                    <span className="text-sm sm:text-base">
                        {isInWishlist ? "♥" : "♡"}
                    </span>
                </Button>
            </div>
            <div className="p-4 sm:p-6">
                <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <h3
                            id={`p-${product?._id || "unknown"}`}
                            className="font-serif text-base sm:text-lg text-gray-900 group-hover:text-gray-600 transition-colors duration-300 line-clamp-2"
                        >
                            {product?.name || "Untitled Product"}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-base sm:text-lg font-medium text-gray-900">
                            ${product.price ? product.price.toFixed(2) : "0.00"}
                        </p>
                        {product.oldPrice && (
                            <p className="text-xs sm:text-sm text-gray-500 line-through">
                                ${product.oldPrice.toFixed(2)}
                            </p>
                        )}
                    </div>
                </div>
                <div className="mt-4 sm:mt-6">
                    <Button
                        className="w-full px-4 py-2.5 sm:px-6 sm:py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-300 rounded-lg font-medium text-sm sm:text-base"
                        onClick={handleAddToCart}
                        aria-label={`Add ${product?.name || "Product"} to cart`}
                    >
                        Add to Cart
                    </Button>
                </div>
            </div>
        </article>
    );
}
