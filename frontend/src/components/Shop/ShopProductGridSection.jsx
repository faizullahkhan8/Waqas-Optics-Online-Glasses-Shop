import ProductGrid from "../Product/ProductGrid";
import Button from "../UI/Button";

export default function ShopProductGridSection({
    isLoading,
    error,
    filteredProducts,
}) {
    return (
        <div className="space-y-8">
            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            )}
            {/* Error State */}
            {error && !isLoading && (
                <div className="text-center py-20">
                    <div className="text-red-500 mb-4">
                        <svg
                            className="w-16 h-16 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Failed to load products
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {error?.message ||
                                "Something went wrong while fetching products"}
                        </p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            )}
            {/* Products Grid */}
            {!isLoading && !error && (
                <ProductGrid products={filteredProducts} />
            )}
        </div>
    );
}
