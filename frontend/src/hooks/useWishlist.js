import { useState, useCallback, useEffect } from "react";
import { wishlistApi } from "../services/wishlistService";
import { toast } from "react-hot-toast";

// Get wishlist items
export const useWishlist = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWishlist = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await wishlistApi.getWishlist();
            setData(result);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch wishlist");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWishlist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { data, loading, error, refetch: fetchWishlist };
};

// Add to wishlist
export const useAddToWishlist = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addToWishlist = useCallback(async (productId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await wishlistApi.addToWishlist(productId);
            toast.success(data.message || "Added to wishlist");
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Failed to add to wishlist";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { addToWishlist, loading, error };
};

// Remove from wishlist
export const useRemoveFromWishlist = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const removeFromWishlist = useCallback(async (productId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await wishlistApi.removeFromWishlist(productId);
            toast.success("Item removed from wishlist");
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Failed to remove from wishlist";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { removeFromWishlist, loading, error };
};
