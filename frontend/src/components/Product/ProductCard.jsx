import { Link } from "react-router-dom";
import Button from "../UI/Button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import { toggleWishlist } from "../../store/wishlistSlice";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
    const dispatch = useDispatch();
    const wishlist = useSelector((state) => state.wishlist);
    const isInWishlist = wishlist.some((item) => item.id === product.id);

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, qty: 1 }));
        toast.success(`${product.title} added to cart`);
    };

    const handleToggleWishlist = () => {
        dispatch(toggleWishlist(product));
        toast.success(
            `${product.title} ${
                isInWishlist ? "removed from" : "added to"
            } wishlist`
        );
    };

    return (
        <article
            className="group relative overflow-hidden bg-white"
            aria-labelledby={`p-${product.id}`}
        >
            <div className="relative">
                <Link
                    to={`/product/${product.slug}`}
                    className="block aspect-[4/5] overflow-hidden bg-gray-100"
                >
                    <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                    />
                </Link>
                <Button
                    onClick={handleToggleWishlist}
                    aria-label={`Toggle wishlist for ${product.title}`}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                        isInWishlist
                            ? "text-red-500"
                            : "text-gray-600 hover:text-red-500"
                    }`}
                >
                    {isInWishlist ? "♥" : "♡"}
                </Button>
            </div>
            <div className="p-6">
                <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <h3
                            id={`p-${product.id}`}
                            className="font-serif text-lg text-gray-900 group-hover:text-gray-600 transition-colors duration-300"
                        >
                            {product.title}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-lg font-medium text-gray-900">
                            ${product.price.toFixed(2)}
                        </p>
                        {product.oldPrice && (
                            <p className="text-sm text-gray-500 line-through">
                                ${product.oldPrice.toFixed(2)}
                            </p>
                        )}
                    </div>
                </div>
                <div className="mt-6">
                    <Button
                        className="w-full px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-300 rounded-lg font-medium"
                        onClick={handleAddToCart}
                        aria-label={`Add ${product.title} to cart`}
                    >
                        Add to Cart
                    </Button>
                </div>
            </div>
        </article>
    );
}
