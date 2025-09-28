import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "../services/wishlistService";
import toast from "react-hot-toast";

// Query Keys
export const wishlistKeys = {
    all: ["wishlist"],
    wishlist: () => [...wishlistKeys.all, "items"],
};

// Get wishlist items
export const useWishlist = () => {
    return useQuery({
        queryKey: wishlistKeys.wishlist(),
        queryFn: wishlistApi.getWishlist,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Add to wishlist mutation
export const useAddToWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: wishlistApi.addToWishlist,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: wishlistKeys.wishlist(),
            });
            toast.success(`${data.product?.title || "Item"} added to wishlist`);
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                    "Failed to add item to wishlist"
            );
        },
    });
};

// Remove from wishlist mutation
export const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: wishlistApi.removeFromWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: wishlistKeys.wishlist(),
            });
            toast.success("Item removed from wishlist");
        },
        onError: () => {
            toast.error("Failed to remove item from wishlist");
        },
    });
};
