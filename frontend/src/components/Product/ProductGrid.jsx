import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, isLoading = false }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse"
                    >
                        <div className="aspect-[4/3] bg-gray-200" />
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                            <div className="h-8 bg-gray-200 rounded w-1/3 mt-4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
                <div
                    key={product.id}
                    className={`transform transition-all duration-500 ${
                        mounted
                            ? "translate-y-0 opacity-100"
                            : "translate-y-4 opacity-0"
                    }`}
                    style={{
                        transitionDelay: `${index * 100}ms`,
                    }}
                >
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}
