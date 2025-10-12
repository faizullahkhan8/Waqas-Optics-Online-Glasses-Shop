import { useState, useCallback, useEffect } from "react";
import { cartApi } from "../services/cartService";
import { toast } from "react-hot-toast";

// Get cart items
export const useCart = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await cartApi.getCart();
            setData(result);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch cart");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { data, loading, error, refetch: fetchCart };
};

// Add to cart
export const useAddToCart = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addToCart = useCallback(async (productData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await cartApi.addToCart(productData);
            toast.success(`${data.product?.title || "Item"} added to cart`);
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Failed to add to cart";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { addToCart, loading, error };
};

// Update cart item
export const useUpdateCartItem = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateCartItem = useCallback(async ({ itemId, quantity }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await cartApi.updateCartItem(itemId, quantity);
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Failed to update cart item";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateCartItem, loading, error };
};

// Remove from cart
export const useRemoveFromCart = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const removeFromCart = useCallback(async (itemId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await cartApi.removeFromCart(itemId);
            toast.success(`${data.product?.title || "Item"} removed from cart`);
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Failed to remove from cart";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { removeFromCart, loading, error };
};

// Clear cart
export const useClearCart = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const clearCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await cartApi.clearCart();
            toast.success("Cart cleared successfully");
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Failed to clear cart";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { clearCart, loading, error };
};
