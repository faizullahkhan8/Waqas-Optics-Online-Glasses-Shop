import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../services/productService";

// Query Keys
export const productKeys = {
    all: ["products"],
    lists: () => [...productKeys.all, "list"],
    list: (filters) => [...productKeys.lists(), { filters }],
    details: () => [...productKeys.all, "detail"],
    detail: (id) => [...productKeys.details(), id],
    search: (query) => [...productKeys.all, "search", query],
    featured: () => [...productKeys.all, "featured"],
    category: (category) => [...productKeys.all, "category", category],
};

// Get all products
export const useProducts = (filters = {}) => {
    return useQuery({
        queryKey: productKeys.list(filters),
        queryFn: () => productApi.getProducts(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Get single product
export const useProduct = (id) => {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => productApi.getProduct(id),
        enabled: !!id,
    });
};

// Search products
export const useSearchProducts = (query, filters = {}) => {
    return useQuery({
        queryKey: productKeys.search({ query, ...filters }),
        queryFn: () => productApi.searchProducts(query, filters),
        enabled: !!query && query.length > 2,
    });
};

// Get featured products
export const useFeaturedProducts = () => {
    return useQuery({
        queryKey: productKeys.featured(),
        queryFn: productApi.getFeaturedProducts,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

// Get products by category
export const useProductsByCategory = (category) => {
    return useQuery({
        queryKey: productKeys.category(category),
        queryFn: () => productApi.getProductsByCategory(category),
        enabled: !!category,
    });
};

// Create product mutation (admin only)
export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productApi.createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
};

// Update product mutation (admin only)
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...productData }) =>
            productApi.updateProduct(id, productData),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
};

// Delete product mutation (admin only)
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productApi.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productKeys.all });
        },
    });
};
