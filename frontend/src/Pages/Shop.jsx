import { useState, useMemo } from "react";
import { SAMPLE_PRODUCTS } from "../Utils/MockData";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
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

    const updateFilters = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        const params = new URLSearchParams(search);
        params.set(key, value);
        navigate({ search: params.toString() });
    };

    const filteredProducts = useMemo(() => {
        let res = SAMPLE_PRODUCTS.slice();

        // Text search
        if (q) {
            const searchQuery = q.toLowerCase();
            res = res.filter(
                (p) =>
                    p.title.toLowerCase().includes(searchQuery) ||
                    p.description.toLowerCase().includes(searchQuery)
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
    }, [q, category, filters, sort]);

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
            <section className="py-16 bg-gray-50">
                <Container>
                    {/* Page Header */}
                    <div className="max-w-2xl mx-auto text-center mb-12">
                        <h1 className="text-4xl font-serif font-bold text-gray-900">
                            {category === "all" ? "Our Collection" : category}
                        </h1>
                        <p className="mt-4 text-gray-600">
                            {filteredProducts.length} elegant pieces
                            {q && ` matching "${q}"`}
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start gap-8">
                        {/* Filters Sidebar */}
                        <aside className="w-full lg:w-72 bg-white rounded-2xl p-6 sticky top-24">
                            <div className="border-b border-gray-100 pb-6">
                                <h4 className="font-serif text-xl text-gray-900">
                                    Refine Selection
                                </h4>
                            </div>

                            <div className="py-6 border-b border-gray-100">
                                <h5 className="font-serif text-gray-900 mb-4">
                                    Price Range
                                </h5>
                                <div className="space-y-3">
                                    {[
                                        { label: "All Prices", value: "all" },
                                        { label: "Under $100", value: "0-100" },
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
                                            className="flex items-center group cursor-pointer"
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
                                                className="text-gray-900 focus:ring-gray-700 h-4 w-4"
                                            />
                                            <span className="ml-3 text-gray-600 group-hover:text-gray-900 transition-colors">
                                                {range.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="py-6 border-b border-gray-100">
                                <h5 className="font-serif text-gray-900 mb-4">
                                    Gender
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: "All", value: "all" },
                                        { label: "Men", value: "men" },
                                        { label: "Women", value: "women" },
                                        { label: "Unisex", value: "unisex" },
                                    ].map((gender) => (
                                        <Button
                                            key={gender.value}
                                            onClick={() =>
                                                updateFilters(
                                                    "gender",
                                                    gender.value
                                                )
                                            }
                                            className={`px-5 py-2 text-sm rounded-full transition-all duration-300 ${
                                                filters.gender === gender.value
                                                    ? "bg-gray-900 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                        >
                                            {gender.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="py-6 border-b border-gray-100">
                                <h5 className="font-serif text-gray-900 mb-4">
                                    Material
                                </h5>
                                <select
                                    value={filters.material}
                                    onChange={(e) =>
                                        updateFilters(
                                            "material",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-lg text-gray-700 focus:ring-2 focus:ring-gray-900"
                                >
                                    <option value="all">All Materials</option>
                                    <option value="metal">Metal</option>
                                    <option value="acetate">Acetate</option>
                                    <option value="titanium">Titanium</option>
                                    <option value="plastic">Plastic</option>
                                </select>
                            </div>

                            <div className="py-6 border-b border-gray-100">
                                <h5 className="font-serif text-gray-900 mb-4">
                                    Sort By
                                </h5>
                                <select
                                    value={sort}
                                    onChange={(e) => {
                                        setSort(e.target.value);
                                        const params = new URLSearchParams(
                                            search
                                        );
                                        params.set("sort", e.target.value);
                                        navigate({ search: params.toString() });
                                    }}
                                    className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-lg text-gray-700 focus:ring-2 focus:ring-gray-900"
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

                            <div className="pt-6">
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
                                    className="w-full px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors rounded-lg"
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-1">
                            <div className="grid gap-8">
                                <ProductGrid products={filteredProducts} />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
