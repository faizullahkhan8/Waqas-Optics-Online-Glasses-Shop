import { useEffect } from "react";
import { SAMPLE_PRODUCTS } from "../Utils/MockData";
import ProductGrid from "../components/Product/ProductGrid";
import { Helmet } from "react-helmet";
import Container from "../components/UI/Container";
import { Link } from "react-router-dom";

export default function HomePage() {
    useEffect(() => window.scrollTo(0, 0), []);
    return (
        <main>
            <Helmet>
                <title>GlassesShop — Classic Eyewear</title>
                <meta
                    name="description"
                    content="Classic, elegant eyewear for men, women and kids. Sunglasses and prescription frames."
                />
                <meta
                    property="og:title"
                    content="GlassesShop — Classic Eyewear"
                />
            </Helmet>

            {/* Hero Section */}
            <section className="relative bg-gray-50 overflow-hidden">
                <Container>
                    <div className="py-20 md:py-28">
                        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <div className="relative z-10">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
                                    Waqas Optics,
                                    <br />
                                    <span className="text-gray-600">
                                        Railway Road Bannu
                                    </span>
                                </h1>
                                <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Eius ullam exercitationem
                                    veniam soluta harum nesciunt quis? Velit
                                    magnam cum itaque expedita alias
                                    exercitationem nobis quibusdam eos dolore
                                    ullam. Enim, saepe.
                                </p>
                                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                    <Link
                                        to="/shop"
                                        className="px-8 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-center"
                                    >
                                        Explore Collection
                                    </Link>
                                    <Link
                                        to="/virtual-try-on"
                                        className="px-8 py-4 border-2 border-gray-900 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-colors text-center"
                                    >
                                        Virtual Try-On
                                    </Link>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-transparent rounded-3xl transform rotate-3"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1520975910767-7b38f9909f8c?w=1200&q=80"
                                    alt="Elegant glasses"
                                    loading="lazy"
                                    className="relative rounded-3xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Featured Products Section */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl font-serif font-bold">
                            Featured Collection
                        </h2>
                        <p className="mt-4 text-gray-600">
                            Discover our most sought-after frames, chosen for
                            their timeless appeal and exceptional craftsmanship.
                        </p>
                    </div>
                    <div className="mt-12">
                        <ProductGrid products={SAMPLE_PRODUCTS} />
                    </div>
                </Container>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-gray-50">
                <Container>
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl font-serif font-bold">
                            Browse Categories
                        </h2>
                        <p className="mt-4 text-gray-600">
                            Find the perfect eyewear for every style and need.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[
                            {
                                name: "Men",
                                image: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=500&q=80",
                            },
                            {
                                name: "Women",
                                image: "https://images.unsplash.com/photo-1544960875-984725584275?w=500&q=80",
                            },
                            {
                                name: "Kids",
                                image: "https://images.unsplash.com/photo-1544960875-984725584275?w=500&q=80",
                            },
                            {
                                name: "Sunglasses",
                                image: "https://images.unsplash.com/photo-1584036553516-bf83210aa16c?w=500&q=80",
                            },
                            {
                                name: "Prescription",
                                image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&q=80",
                            },
                        ].map((category) => (
                            <Link
                                key={category.name}
                                to={`/shop?category=${encodeURIComponent(
                                    category.name
                                )}`}
                                className="group relative overflow-hidden rounded-2xl aspect-[4/5]"
                            >
                                <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/40 transition-colors z-10"></div>
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <span className="text-white text-xl font-serif font-medium">
                                        {category.name}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </Container>
            </section>
        </main>
    );
}
