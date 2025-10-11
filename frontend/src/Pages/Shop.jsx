import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useProducts, useSearchProducts } from "../hooks/useProducts";
import ShopHero from "../components/Shop/ShopHero";
import ShopFiltersSidebar from "../components/Shop/ShopFiltersSidebar";
import ShopMobileFiltersDrawer from "../components/Shop/ShopMobileFiltersDrawer";
import ShopResultsSummary from "../components/Shop/ShopResultsSummary";
import ShopProductGridSection from "../components/Shop/ShopProductGridSection";
import Container from "../components/UI/Container";

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

    const areFiltersDefault =
        category === "all" &&
        filters.gender === "all" &&
        filters.color === "all" &&
        filters.material === "all" &&
        filters.priceRange === "all";

    const productsQuery = useProducts(
        areFiltersDefault
            ? {}
            : {
                  category: category !== "all" ? category : undefined,
                  gender: filters.gender !== "all" ? filters.gender : undefined,
                  color: filters.color !== "all" ? filters.color : undefined,
                  material:
                      filters.material !== "all" ? filters.material : undefined,
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
              }
    );

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

    const filteredProducts = useMemo(() => {
        return q
            ? searchQuery.data?.products || []
            : productsQuery.data?.products || [];
    }, [q, productsQuery.data, searchQuery.data]);

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
            <ShopHero
                category={category}
                q={q}
                filteredProducts={filteredProducts}
            />
            <section className="py-16 bg-white">
                <Container>
                    <div className="mb-8 flex lg:hidden justify-between items-center border-b border-gray-100 pb-6">
                        <div className="text-sm text-gray-600 font-medium">
                            {filteredProducts?.length} Products Found
                        </div>
                        <button
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
                        </button>
                    </div>
                    <div className="flex flex-col lg:flex-row items-start gap-12">
                        <ShopFiltersSidebar
                            filters={filters}
                            sort={sort}
                            updateFilters={updateFilters}
                            setFilters={setFilters}
                            navigate={navigate}
                            search={search}
                            setSort={setSort}
                        />
                        <ShopMobileFiltersDrawer
                            showMobileFilters={showMobileFilters}
                            setShowMobileFilters={setShowMobileFilters}
                            filters={filters}
                            sort={sort}
                            updateFilters={updateFilters}
                            setFilters={setFilters}
                            navigate={navigate}
                            search={search}
                            setSort={setSort}
                        />
                        <div className="flex-1">
                            <ShopResultsSummary
                                filteredProducts={filteredProducts}
                                q={q}
                                sort={sort}
                            />
                            <ShopProductGridSection
                                isLoading={isLoading}
                                error={error}
                                filteredProducts={filteredProducts}
                            />
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
