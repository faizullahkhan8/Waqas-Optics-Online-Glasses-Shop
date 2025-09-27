import { useState, useMemo } from "react";
import { SAMPLE_PRODUCTS } from "../Utils/MockData";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
    useProducts,
    useSearchProducts,
    useProductsByCategory,
} from "../hooks/useProducts";
import Container from "../components/UI/Container";
import ProductGrid from "../components/Product/ProductGrid";
import Button from "../components/UI/Button";

export default function ShopPage() {
    const { search } = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(search);
    const q = params.get("q") || "";
    const category = params.get("category") || "all";
    const [filters, setFilters] = useState({
        priceRange: params.get("price") || "all",
        gender: params.get("gender") || "all",
        color: params.get("color") || "all",
        material: params.get("material") || "all",
    });
    const [sort, setSort] = useState(params.get("sort") || "popularity");
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const updateFilters = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        const params = new URLSearchParams(search);
        params.set(key, value);
        navigate({ search: params.toString() });
    };

    // React Query hooks for fetching products
    const productsQuery = useProducts({
        category: category !== "all" ? category : undefined,
        gender: filters.gender !== "all" ? filters.gender : undefined,
        color: filters.color !== "all" ? filters.color : undefined,
        material: filters.material !== "all" ? filters.material : undefined,
        minPrice:
            filters.priceRange !== "all"
                ? filters.priceRange.split("-")[0]
                : undefined,
        maxPrice:
            filters.priceRange !== "all"
                ? filters.priceRange.split("-")[1]
                : undefined,
        sort,
        page: 1,
        limit: 50,
    });

    const searchQuery = useSearchProducts(q, {
        category: category !== "all" ? category : undefined,
        gender: filters.gender !== "all" ? filters.gender : undefined,
        color: filters.color !== "all" ? filters.color : undefined,
        material: filters.material !== "all" ? filters.material : undefined,
        minPrice:
            filters.priceRange !== "all"
                ? filters.priceRange.split("-")[0]
                : undefined,
        maxPrice:
            filters.priceRange !== "all"
                ? filters.priceRange.split("-")[1]
                : undefined,
        sort,
    });

    // Fallback to MockData if API is not available
    const filteredProducts = useMemo(() => {
        // Use API data if available, otherwise fallback to mock data
        const apiProducts = q
            ? searchQuery.data?.products
            : productsQuery.data?.products;

        if (apiProducts) {
            return apiProducts;
        }

        // Fallback to mock data with client-side filtering
        let res = SAMPLE_PRODUCTS.slice();

        // Text search
        if (q) {
            const searchQueryLower = q.toLowerCase();
            res = res.filter(
                (p) =>
                    p.title.toLowerCase().includes(searchQueryLower) ||
                    p.description.toLowerCase().includes(searchQueryLower)
            );
        }

        // Category filter
        if (category !== "all") {
            res = res.filter(
                (p) => p.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Apply filters
        if (filters.gender !== "all") {
            res = res.filter((p) => p.gender === filters.gender);
        }
        if (filters.color !== "all") {
            res = res.filter((p) => p.color === filters.color);
        }
        if (filters.material !== "all") {
            res = res.filter((p) => p.material === filters.material);
        }
        if (filters.priceRange !== "all") {
            const [min, max] = filters.priceRange.split("-").map(Number);
            res = res.filter((p) => p.price >= min && p.price <= max);
        }

        // Apply sorting
        switch (sort) {
            case "price_asc":
                res.sort((a, b) => a.price - b.price);
                break;
            case "price_desc":
                res.sort((a, b) => b.price - a.price);
                break;
            case "popularity":
                res.sort((a, b) => b.popularity - a.popularity);
                break;
            case "newest":
                res.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                break;
            default:
                break;
        }

        return res;
    }, [q, category, filters, sort, productsQuery.data, searchQuery.data]);

    // Loading and error states
    const isLoading = q ? searchQuery.isLoading : productsQuery.isLoading;
    const error = q ? searchQuery.error : productsQuery.error;

    return (
        <main>
            <Helmet>
                <title>
                    {q
                        ? `Search results for "${q}" — GlassesShop`
                        : category !== "all"
                        ? `${category} Glasses & Sunglasses — GlassesShop`
                        : "Shop Glasses & Sunglasses — GlassesShop"}
                </title>
                <meta
                    name="description"
                    content={`Browse our collection of ${
                        category !== "all" ? category.toLowerCase() + " " : ""
                    }glasses and sunglasses. Find the perfect frames for your style.`}
                />
            </Helmet>

            {/* Enhanced Hero Section */}
            <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                {/* Subtle decorative elements */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="absolute top-32 right-16 w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                    <div className="absolute bottom-32 right-1/3 w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>

                <Container>
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="mb-6">
                            {/* Elegant divider */}
                            <div className="flex items-center justify-center mb-8">
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
                                <div className="mx-4 w-2 h-2 bg-gray-400 rounded-full"></div>
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-24"></div>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-serif font-light text-gray-900 mb-6 tracking-tight">
                                {category === "all" ? (
                                    <>
                                        Our Curated
                                        <span className="block font-normal italic text-gray-700">
                                            Collection
                                        </span>
                                    </>
                                ) : (
                                    <span className="capitalize">
                                        {category}
                                    </span>
                                )}
                            </h1>
                        </div>

                        <div className="flex items-center justify-center space-x-6 text-gray-600">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-px bg-gray-300"></div>
                                <span className="font-medium tracking-wide">
                                    {filteredProducts.length}
                                    <span className="ml-1 font-light">
                                        elegant pieces
                                    </span>
                                </span>
                                <div className="w-8 h-px bg-gray-300"></div>
                            </div>
                        </div>

                        {q && (
                            <p className="mt-4 text-lg text-gray-500 font-light italic">
                                Featuring results for "{q}"
                            </p>
                        )}
                    </div>
                </Container>
            </section>

            <section className="py-16 bg-white">
                <Container>
                    {/* Mobile Filters Button - Enhanced */}
                    <div className="mb-8 flex lg:hidden justify-between items-center border-b border-gray-100 pb-6">
                        <div className="text-sm text-gray-600 font-medium">
                            {filteredProducts.length} Products Found
                        </div>
                        <Button
                            className="group px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md flex items-center space-x-2"
                            onClick={() => setShowMobileFilters(true)}
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
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                />
                            </svg>
                            <span>Filter & Sort</span>
                        </Button>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start gap-12">
                        {/* Enhanced Filters Sidebar */}
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
                                {/* Price Range - Enhanced */}
                                <div className="space-y-4">
                                    <h5 className="font-serif text-lg font-medium text-gray-900 flex items-center">
                                        <span className="mr-2">💰</span>
                                        Price Range
                                    </h5>
                                    <div className="space-y-3 pl-6">
                                        {[
                                            {
                                                label: "All Prices",
                                                value: "all",
                                            },
                                            {
                                                label: "Under $100",
                                                value: "0-100",
                                            },
                                            {
                                                label: "$100 - $200",
                                                value: "100-200",
                                            },
                                            {
                                                label: "$200 - $300",
                                                value: "200-300",
                                            },
                                            {
                                                label: "Over $300",
                                                value: "300-1000",
                                            },
                                        ].map((range) => (
                                            <label
                                                key={range.value}
                                                className="flex items-center group cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition-colors"
                                            >
                                                <input
                                                    type="radio"
                                                    name="price"
                                                    value={range.value}
                                                    checked={
                                                        filters.priceRange ===
                                                        range.value
                                                    }
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
                                                {filters.priceRange ===
                                                    range.value && (
                                                    <div className="ml-auto w-2 h-2 bg-gray-900 rounded-full"></div>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Gender - Enhanced */}
                                <div className="space-y-4">
                                    <h5 className="font-serif text-lg font-medium text-gray-900 flex items-center">
                                        <span className="mr-2">👤</span>
                                        Gender
                                    </h5>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: "All", value: "all" },
                                            { label: "Men", value: "men" },
                                            { label: "Women", value: "women" },
                                            {
                                                label: "Unisex",
                                                value: "unisex",
                                            },
                                        ].map((gender) => (
                                            <Button
                                                key={gender.value}
                                                onClick={() =>
                                                    updateFilters(
                                                        "gender",
                                                        gender.value
                                                    )
                                                }
                                                className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 border-2 ${
                                                    filters.gender ===
                                                    gender.value
                                                        ? "bg-gray-900 text-white border-gray-900 shadow-md"
                                                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                {gender.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Material - Enhanced */}
                                <div className="space-y-4">
                                    <h5 className="font-serif text-lg font-medium text-gray-900 flex items-center">
                                        <span className="mr-2">🔧</span>
                                        Material
                                    </h5>
                                    <div className="relative">
                                        <select
                                            value={filters.material}
                                            onChange={(e) =>
                                                updateFilters(
                                                    "material",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all cursor-pointer appearance-none"
                                        >
                                            <option value="all">
                                                All Materials
                                            </option>
                                            <option value="metal">Metal</option>
                                            <option value="acetate">
                                                Acetate
                                            </option>
                                            <option value="titanium">
                                                Titanium
                                            </option>
                                            <option value="plastic">
                                                Plastic
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

                                {/* Sort By - Enhanced */}
                                <div className="space-y-4">
                                    <h5 className="font-serif text-lg font-medium text-gray-900 flex items-center">
                                        <span className="mr-2">📊</span>
                                        Sort By
                                    </h5>
                                    <div className="relative">
                                        <select
                                            value={sort}
                                            onChange={(e) => {
                                                setSort(e.target.value);
                                                const params =
                                                    new URLSearchParams(search);
                                                params.set(
                                                    "sort",
                                                    e.target.value
                                                );
                                                navigate({
                                                    search: params.toString(),
                                                });
                                            }}
                                            className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all cursor-pointer appearance-none"
                                        >
                                            <option value="popularity">
                                                Most Popular
                                            </option>
                                            <option value="newest">
                                                Newest Arrivals
                                            </option>
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

                                {/* Reset Button - Enhanced */}
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

                        {/* Enhanced Mobile Filter Drawer */}
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
                                    showMobileFilters
                                        ? "opacity-60"
                                        : "opacity-0"
                                }`}
                                onClick={() => setShowMobileFilters(false)}
                            />

                            {/* Drawer */}
                            <div
                                className={`fixed right-0 top-0 w-[85%] max-w-[400px] h-full bg-white shadow-2xl transform transition-all duration-300 ease-in-out rounded-l-2xl flex flex-col ${
                                    showMobileFilters
                                        ? "translate-x-0"
                                        : "translate-x-full"
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
                                        onClick={() =>
                                            setShowMobileFilters(false)
                                        }
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

                                {/* Filter Content - Same enhanced structure as desktop but mobile optimized */}
                                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                                    {/* All filter sections with same enhancements as desktop version */}
                                    {/* Price Range */}
                                    <div className="space-y-4">
                                        <h5 className="font-serif text-lg font-medium text-gray-900">
                                            Price Range
                                        </h5>
                                        <div className="space-y-3">
                                            {[
                                                {
                                                    label: "All Prices",
                                                    value: "all",
                                                },
                                                {
                                                    label: "Under $100",
                                                    value: "0-100",
                                                },
                                                {
                                                    label: "$100 - $200",
                                                    value: "100-200",
                                                },
                                                {
                                                    label: "$200 - $300",
                                                    value: "200-300",
                                                },
                                                {
                                                    label: "Over $300",
                                                    value: "300-1000",
                                                },
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
                                                            filters.priceRange ===
                                                            range.value
                                                        }
                                                        onChange={(e) => {
                                                            updateFilters(
                                                                "priceRange",
                                                                e.target.value
                                                            );
                                                            setShowMobileFilters(
                                                                false
                                                            );
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
                                                {
                                                    label: "Women",
                                                    value: "women",
                                                },
                                                {
                                                    label: "Unisex",
                                                    value: "unisex",
                                                },
                                            ].map((gender) => (
                                                <Button
                                                    key={gender.value}
                                                    onClick={() => {
                                                        updateFilters(
                                                            "gender",
                                                            gender.value
                                                        );
                                                        setShowMobileFilters(
                                                            false
                                                        );
                                                    }}
                                                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                                                        filters.gender ===
                                                        gender.value
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
                                                updateFilters(
                                                    "material",
                                                    e.target.value
                                                );
                                                setShowMobileFilters(false);
                                            }}
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-gray-900"
                                        >
                                            <option value="all">
                                                All Materials
                                            </option>
                                            <option value="metal">Metal</option>
                                            <option value="acetate">
                                                Acetate
                                            </option>
                                            <option value="titanium">
                                                Titanium
                                            </option>
                                            <option value="plastic">
                                                Plastic
                                            </option>
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
                                                const params =
                                                    new URLSearchParams(search);
                                                params.set(
                                                    "sort",
                                                    e.target.value
                                                );
                                                navigate({
                                                    search: params.toString(),
                                                });
                                                setShowMobileFilters(false);
                                            }}
                                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-gray-900"
                                        >
                                            <option value="popularity">
                                                Most Popular
                                            </option>
                                            <option value="newest">
                                                Newest Arrivals
                                            </option>
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

                        {/* Product Grid Section */}
                        <div className="flex-1">
                            <div className="space-y-8">
                                {/* Results Summary */}
                                <div className="hidden lg:flex items-center justify-between border-b border-gray-100 pb-6">
                                    <div className="text-gray-600">
                                        <span className="font-medium text-gray-900">
                                            {filteredProducts.length}
                                        </span>
                                        <span className="ml-1">
                                            products found
                                        </span>
                                        {q && (
                                            <span className="ml-1">
                                                for "{q}"
                                            </span>
                                        )}
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
                                                onClick={() =>
                                                    window.location.reload()
                                                }
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
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
