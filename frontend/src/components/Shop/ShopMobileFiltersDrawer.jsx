import Button from "../UI/Button";

export default function ShopMobileFiltersDrawer({
    showMobileFilters,
    setShowMobileFilters,
    filters,
    sort,
    updateFilters,
    setFilters,
    navigate,
    search,
    setSort,
}) {
    return (
        <div
            className={`fixed inset-0 z-50 lg:hidden ${
                showMobileFilters
                    ? "pointer-events-auto"
                    : "pointer-events-none"
            }`}
        >
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
                    showMobileFilters ? "opacity-60" : "opacity-0"
                }`}
                onClick={() => setShowMobileFilters(false)}
            />
            {/* Drawer */}
            <div
                className={`fixed right-0 top-0 w-[85%] max-w-[400px] h-full bg-white shadow-2xl transform transition-all duration-300 ease-in-out rounded-l-2xl flex flex-col ${
                    showMobileFilters ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-serif text-xl text-gray-900 font-medium flex items-center space-x-2">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            />
                        </svg>
                        <span>Filters & Sort</span>
                    </h3>
                    <button
                        onClick={() => setShowMobileFilters(false)}
                        className="p-2 -mr-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-200 transition-all duration-200"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                {/* Filter Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                    {/* Price Range */}
                    <div className="space-y-4">
                        <h5 className="font-serif text-lg font-medium text-gray-900">
                            Price Range
                        </h5>
                        <div className="space-y-3">
                            {[
                                { label: "All Prices", value: "all" },
                                { label: "Under $100", value: "0-100" },
                                { label: "$100 - $200", value: "100-200" },
                                { label: "$200 - $300", value: "200-300" },
                                { label: "Over $300", value: "300-1000" },
                            ].map((range) => (
                                <label
                                    key={range.value}
                                    className="flex items-center group cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                                >
                                    <input
                                        type="radio"
                                        name="price"
                                        value={range.value}
                                        checked={
                                            filters.priceRange === range.value
                                        }
                                        onChange={(e) => {
                                            updateFilters(
                                                "priceRange",
                                                e.target.value
                                            );
                                            setShowMobileFilters(false);
                                        }}
                                        className="text-gray-900 focus:ring-gray-700 h-4 w-4 border-2 border-gray-300"
                                    />
                                    <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors font-medium">
                                        {range.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* Gender */}
                    <div className="space-y-4">
                        <h5 className="font-serif text-lg font-medium text-gray-900">
                            Gender
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: "All", value: "all" },
                                { label: "Men", value: "men" },
                                { label: "Women", value: "women" },
                                { label: "Unisex", value: "unisex" },
                            ].map((gender) => (
                                <Button
                                    key={gender.value}
                                    onClick={() => {
                                        updateFilters("gender", gender.value);
                                        setShowMobileFilters(false);
                                    }}
                                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                                        filters.gender === gender.value
                                            ? "bg-gray-900 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {gender.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    {/* Material */}
                    <div className="space-y-4">
                        <h5 className="font-serif text-lg font-medium text-gray-900">
                            Material
                        </h5>
                        <select
                            value={filters.material}
                            onChange={(e) => {
                                updateFilters("material", e.target.value);
                                setShowMobileFilters(false);
                            }}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-gray-900"
                        >
                            <option value="all">All Materials</option>
                            <option value="metal">Metal</option>
                            <option value="acetate">Acetate</option>
                            <option value="titanium">Titanium</option>
                            <option value="plastic">Plastic</option>
                        </select>
                    </div>
                    {/* Sort */}
                    <div className="space-y-4">
                        <h5 className="font-serif text-lg font-medium text-gray-900">
                            Sort By
                        </h5>
                        <select
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value);
                                const params = new URLSearchParams(search);
                                params.set("sort", e.target.value);
                                navigate({ search: params.toString() });
                                setShowMobileFilters(false);
                            }}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-gray-900"
                        >
                            <option value="popularity">Most Popular</option>
                            <option value="newest">Newest Arrivals</option>
                            <option value="price_asc">
                                Price: Low to High
                            </option>
                            <option value="price_desc">
                                Price: High to Low
                            </option>
                        </select>
                    </div>
                    {/* Reset Button */}
                    <div className="pt-4 border-t border-gray-200">
                        <Button
                            onClick={() => {
                                setFilters({
                                    priceRange: "all",
                                    gender: "all",
                                    color: "all",
                                    material: "all",
                                });
                                navigate({ search: "" });
                                setShowMobileFilters(false);
                            }}
                            className="w-full px-6 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors rounded-xl font-medium shadow-md"
                        >
                            Reset All Filters
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
