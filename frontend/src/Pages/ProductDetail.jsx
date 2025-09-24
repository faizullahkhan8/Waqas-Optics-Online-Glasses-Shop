import { Link, useNavigate, useParams } from "react-router-dom";
import { SAMPLE_PRODUCTS } from "../Utils/MockData";
import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";
import Button from "../components/UI/Button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { toggleWishlist } from "../store/wishlistSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import NotFoundPage from "./NotFound";

export default function ProductDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const product = SAMPLE_PRODUCTS.find((p) => p.slug === slug);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const wishlist = useSelector((state) => state.wishlist);
    const isInWishlist = wishlist.some((item) => item.id === product?.id);

    if (!product) return <NotFoundPage />;

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, qty: quantity }));
        toast.success(`${product.title} added to cart`);
        navigate("/cart");
    };

    const handleToggleWishlist = () => {
        dispatch(toggleWishlist(product));
        toast.success(
            `${product.title} ${
                isInWishlist ? "removed from" : "added to"
            } wishlist`
        );
    };

    const relatedProducts = SAMPLE_PRODUCTS.filter(
        (p) => p.id !== product.id && p.category === product.category
    ).slice(0, 4);

    return (
        <main>
            <Helmet>
                <title>{product.title} — GlassesShop</title>
                <meta name="description" content={product.description} />
                <script type="application/ld+json">{`
          ${JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.title,
              image: product.images,
              description: product.description,
              sku: product.id,
              offers: {
                  "@type": "Offer",
                  price: product.price.toString(),
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
              },
          })}
        `}</script>
            </Helmet>

            <section className="py-16 bg-gray-50">
                <Container>
                    <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm p-8 lg:p-12">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                            <div>
                                <div className="bg-white rounded-xl overflow-hidden">
                                    <div className="relative aspect-square bg-gray-100">
                                        <img
                                            src={product.images[selectedImage]}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                                    </div>
                                    {product.images.length > 1 && (
                                        <div className="p-6 border-t border-gray-100">
                                            <div className="flex gap-4 overflow-x-auto custom-scrollbar">
                                                {product.images.map(
                                                    (img, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() =>
                                                                setSelectedImage(
                                                                    idx
                                                                )
                                                            }
                                                            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                                                                selectedImage ===
                                                                idx
                                                                    ? "ring-2 ring-gray-900 ring-offset-2"
                                                                    : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-2"
                                                            }`}
                                                        >
                                                            <img
                                                                src={img}
                                                                alt={`${
                                                                    product.title
                                                                } view ${
                                                                    idx + 1
                                                                }`}
                                                                className="w-full h-full object-cover"
                                                                loading="lazy"
                                                            />
                                                            {selectedImage ===
                                                                idx && (
                                                                <div className="absolute inset-0 bg-gray-900/10"></div>
                                                            )}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="lg:py-8">
                                <div className="lg:py-4">
                                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                                        {product.title}
                                    </h1>

                                    <div className="mt-6 flex items-baseline gap-4">
                                        <span className="text-3xl font-medium text-gray-900">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        {product.oldPrice && (
                                            <span className="text-lg text-gray-500 line-through">
                                                ${product.oldPrice.toFixed(2)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-8">
                                        <p className="text-lg text-gray-600 leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>

                                    <div className="mt-12 space-y-8">
                                        <div className="flex items-center gap-6">
                                            <label className="font-medium text-gray-900">
                                                Quantity
                                            </label>
                                            <div className="flex items-center bg-gray-100 rounded-lg">
                                                <button
                                                    onClick={() =>
                                                        setQuantity((q) =>
                                                            Math.max(1, q - 1)
                                                        )
                                                    }
                                                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={quantity}
                                                    onChange={(e) => {
                                                        const val = parseInt(
                                                            e.target.value
                                                        );
                                                        if (val > 0)
                                                            setQuantity(val);
                                                    }}
                                                    className="w-16 h-12 bg-transparent text-center text-gray-900 border-x border-gray-200"
                                                />
                                                <button
                                                    onClick={() =>
                                                        setQuantity(
                                                            (q) => q + 1
                                                        )
                                                    }
                                                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <Button
                                                onClick={handleAddToCart}
                                                className="flex-1 px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors rounded-lg font-medium"
                                            >
                                                Add to Cart
                                            </Button>
                                            <Button
                                                onClick={handleToggleWishlist}
                                                className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl transition-all ${
                                                    isInWishlist
                                                        ? "bg-gray-900 text-white hover:bg-gray-800"
                                                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                                                }`}
                                                aria-label={`${
                                                    isInWishlist
                                                        ? "Remove from"
                                                        : "Add to"
                                                } wishlist`}
                                            >
                                                {isInWishlist ? "♥" : "♡"}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-gray-100">
                                        <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
                                            Product Specifications
                                        </h2>
                                        <dl className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                                            {[
                                                {
                                                    label: "Category",
                                                    value: product.category,
                                                },
                                                {
                                                    label: "Gender",
                                                    value: product.gender,
                                                },
                                                {
                                                    label: "Material",
                                                    value: product.material,
                                                },
                                                {
                                                    label: "Color",
                                                    value: product.color,
                                                },
                                            ].map((detail) => (
                                                <div
                                                    key={detail.label}
                                                    className="flex items-center"
                                                >
                                                    <dt className="w-32 font-medium text-gray-500">
                                                        {detail.label}
                                                    </dt>
                                                    <dd className="text-gray-900">
                                                        {detail.value}
                                                    </dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products Section */}
                    <div className="mt-20 pt-12 border-t border-gray-100">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-serif font-bold text-gray-900">
                                You May Also Like
                            </h2>
                            <p className="mt-4 text-gray-600">
                                Discover similar styles from our collection
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((rp) => (
                                <Link
                                    key={rp.id}
                                    to={`/product/${rp.slug}`}
                                    className="group"
                                >
                                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100">
                                        <img
                                            src={rp.images[0]}
                                            alt={rp.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <h3 className="font-serif text-gray-900 group-hover:text-gray-600 transition-colors">
                                            {rp.title}
                                        </h3>
                                        <p className="font-medium text-gray-900">
                                            ${rp.price.toFixed(2)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
