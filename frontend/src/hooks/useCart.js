import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "../services/cartService";
import toast from "react-hot-toast";

// Query Keys
export const cartKeys = {
    all: ["cart"],
    cart: () => [...cartKeys.all, "items"],
};

// Get cart items
export const useCart = () => {
    return useQuery({
        queryKey: cartKeys.cart(),
        queryFn: cartApi.getCart,
        retry: false,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};

// Add to cart mutation
export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.addToCart,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
            toast.success(`${data.product?.title || "Item"} added to cart`);
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Failed to add item to cart"
            );
        },
    });
};

// Update cart item mutation
export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ itemId, quantity }) =>
            cartApi.updateCartItem(itemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Failed to update cart item"
            );
        },
    });
};

// Remove from cart mutation
export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.removeFromCart,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
            toast.success(`${data.product?.title || "Item"} removed from cart`);
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                    "Failed to remove item from cart"
            );
        },
    });
};

// Clear cart mutation
export const useClearCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.cart() });
            toast.success("Cart cleared successfully");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Failed to clear cart"
            );
        },
    });
};
