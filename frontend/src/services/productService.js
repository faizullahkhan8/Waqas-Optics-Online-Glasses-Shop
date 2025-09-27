import api from "../lib/api";

// Product API endpoints
export const productApi = {
    // Get all products with filters
    getProducts: async (params = {}) => {
        const { data } = await api.get("/products", { params });
        return data;
    },

    // Get single product by ID or slug
    getProduct: async (id) => {
        const { data } = await api.get(`/products/${id}`);
        return data;
    },

    // Search products
    searchProducts: async (query, filters = {}) => {
        const { data } = await api.get("/products/search", {
            params: { q: query, ...filters },
        });
        return data;
    },

    // Get featured products
    getFeaturedProducts: async () => {
        const { data } = await api.get("/products/featured");
        return data;
    },

    // Get products by category
    getProductsByCategory: async (category) => {
        const { data } = await api.get(`/products/category/${category}`);
        return data;
    },

    // Create product (admin only)
    createProduct: async (productData) => {
        const { data } = await api.post("/products", productData);
        return data;
    },

    // Update product (admin only)
    updateProduct: async (id, productData) => {
        const { data } = await api.put(`/products/${id}`, productData);
        return data;
    },

    // Delete product (admin only)
    deleteProduct: async (id) => {
        const { data } = await api.delete(`/products/${id}`);
        return data;
    },
};
