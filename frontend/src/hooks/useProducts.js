import { useState, useCallback, useEffect } from "react";
import { productApi } from "../services/productService";
import { toast } from "react-hot-toast";

// Get all products with filters
export const useProducts = (filters = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await productApi.getProducts(filters);
            setData(result);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(filters)]);

    return { data, loading, error, refetch: fetchProducts };
};

// Get single product
export const useProduct = (id) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProduct = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        setError(null);
        try {
            const result = await productApi.getProduct(id);
            setData(result);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch product");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return { data, loading, error, refetch: fetchProduct };
};

// Search products
export const useSearchProducts = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchProducts = useCallback(async (searchTerm, filters = {}) => {
        if (!searchTerm || searchTerm.length <= 2) return;

        setLoading(true);
        setError(null);
        try {
            const result = await productApi.searchProducts(searchTerm, filters);
            setData(result);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to search products"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, searchProducts };
};

// Get featured products
export const useFeaturedProducts = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFeaturedProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await productApi.getFeaturedProducts();
            setData(result);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to fetch featured products"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFeaturedProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { data, loading, error, refetch: fetchFeaturedProducts };
};

// Get products by category
export const useProductsByCategory = (category) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProductsByCategory = useCallback(async () => {
        if (!category) return;

        setLoading(true);
        setError(null);
        try {
            const result = await productApi.getProductsByCategory(category);
            setData(result);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to fetch products by category"
            );
        } finally {
            setLoading(false);
        }
    }, [category]);

    useEffect(() => {
        fetchProductsByCategory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    return { data, loading, error, refetch: fetchProductsByCategory };
};

// Create product (admin only)
export const useCreateProduct = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createProduct = useCallback(async (productData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await productApi.createProduct(productData);
            toast.success("Product created successfully!");
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Product creation failed";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createProduct, loading, error };
};

// Update product (admin only)
export const useUpdateProduct = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateProduct = useCallback(async ({ id, ...productData }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await productApi.updateProduct(id, productData);
            toast.success("Product updated successfully!");
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Product update failed";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateProduct, loading, error };
};

// Delete product (admin only)
export const useDeleteProduct = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteProduct = useCallback(async (productId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await productApi.deleteProduct(productId);
            toast.success("Product deleted successfully!");
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Product deletion failed";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteProduct, loading, error };
};
