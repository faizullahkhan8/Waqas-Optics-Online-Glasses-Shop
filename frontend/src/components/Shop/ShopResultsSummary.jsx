export default function ShopResultsSummary({ filteredProducts, q, sort }) {
    return (
        <div className="hidden lg:flex items-center justify-between border-b border-gray-100 pb-6">
            <div className="text-gray-600">
                <span className="font-medium text-gray-900">
                    {filteredProducts?.length}
                </span>
                <span className="ml-1">products found</span>
                {q && <span className="ml-1">for "{q}"</span>}
            </div>
            <div className="text-sm text-gray-500">
                Sorted by{" "}
                {sort === "popularity"
                    ? "Most Popular"
                    : sort === "newest"
                    ? "Newest"
                    : sort === "price_asc"
                    ? "Price: Low to High"
                    : "Price: High to Low"}
            </div>
        </div>
    );
}
