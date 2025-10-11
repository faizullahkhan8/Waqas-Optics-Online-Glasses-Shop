import Button from "../UI/Button";

export default function ShopFiltersSidebar({
    filters,
    sort,
    updateFilters,
    setFilters,
    navigate,
    search,
    setSort,
}) {
    return (
        <aside className="hidden lg:block w-80 bg-white rounded-3xl border border-gray-100 shadow-lg sticky top-24 overflow-hidden">
            {/* Sidebar Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                            />
                        </svg>
                    </div>
                    <h4 className="font-serif text-xl font-medium text-gray-900">
                        Refine Selection
                    </h4>
                </div>
            </div>
            <div className="p-8 space-y-8">
                {/* Price Range */}
                <div className="space-y-4">
                    <h5 className="font-serif text-lg font-medium text-gray-900 flex items-center">
                        <span className="mr-2">💰</span>Price Range
                    </h5>
                    <div className="space-y-3 pl-6">
                        {[
                            { label: "All Prices", value: "all" },
                            { label: "Under $100", value: "0-100" },
                            { label: "$100 - $200", value: "100-200" },
                            { label: "$200 - $300", value: "200-300" },
                            { label: "Over $300", value: "300-1000" },
                        ].map((range) => (
                            <label
                                key={range.value}
                                className="flex items-center group cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition-colors"
                            >
                                <input
                                    type="radio"
                                    name="price"
                                    value={range.value}
                                    checked={filters.priceRange === range.value}
                                    onChange={(e) =>
                                        updateFilters(
                                            "priceRange",
                                            e.target.value
                                        )
                                    }
                                    className="text-gray-900 focus:ring-gray-700 focus:ring-2 h-4 w-4 border-2 border-gray-300"
                                />
                                <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors font-medium">
                                    {range.label}
                                </span>
                                {filters.priceRange === range.value && (
                                    <div className="ml-auto w-2 h-2 bg-gray-900 rounded-full"></div>
                                )}
                            </label>
                        ))}
                    </div>
                </div>
                {/* Gender */}
                <div className="space-y-4">
                    <h5 className="font-serif text-lg font-medium text-gray-900 flex items-center">
                        <span className="mr-2">👤</span>Gender
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "All", value: "all" },
                            { label: "Men", value: "men" },
                            { label: "Women", value: "women" },
                            { label: "Unisex", value: "unisex" },
                        ].map((gender) => (
                            <Button
                                key={gender.value}
                                onClick={() =>
                                    updateFilters("gender", gender.value)
                                }
                                className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 border-2 ${
                                    filters.gender === gender.value
                                        ? "bg-gray-900 text-white border-gray-900 shadow-md"
                                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                {gender.label}
                            </Button>
                        ))}
                    </div>
                </div>
                {/* Material */}
                <div className="space-y-4">
                    <h5 className="font-serif text-lg font-medium text-gray-900 flex items-center">
                        <span className="mr-2">🔧</span>Material
                    </h5>
                    <div className="relative">
                        <select
                            value={filters.material}
                            onChange={(e) =>
                                updateFilters("material", e.target.value)
                            }
                            className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all cursor-pointer appearance-none"
                        >
                            <option value="all">All Materials</option>
                            <option value="metal">Metal</option>
                            <option value="acetate">Acetate</option>
                            <option value="titanium">Titanium</option>
                            <option value="plastic">Plastic</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                {/* Sort By */}
                <div className="space-y-4">
                    <h5 className="font-serif text-lg font-medium text-gray-900 flex items-center">
                        <span className="mr-2">📊</span>Sort By
                    </h5>
                    <div className="relative">
                        <select
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value);
                                const params = new URLSearchParams(search);
                                params.set("sort", e.target.value);
                                navigate({ search: params.toString() });
                            }}
                            className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all cursor-pointer appearance-none"
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
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>
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
                        }}
                        className="w-full px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black transition-all duration-300 rounded-xl font-medium shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        <span>Reset All Filters</span>
                    </Button>
                </div>
            </div>
        </aside>
    );
}
