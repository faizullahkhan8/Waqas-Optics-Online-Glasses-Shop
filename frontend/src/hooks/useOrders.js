import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../services/orderService";
import toast from "react-hot-toast";

// Query Keys
export const orderKeys = {
    all: ["orders"],
    lists: () => [...orderKeys.all, "list"],
    details: () => [...orderKeys.all, "detail"],
    detail: (id) => [...orderKeys.details(), id],
};

// Get user's orders
export const useOrders = () => {
    return useQuery({
        queryKey: orderKeys.lists(),
        queryFn: orderApi.getOrders,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Get single order
export const useOrder = (orderId) => {
    return useQuery({
        queryKey: orderKeys.detail(orderId),
        queryFn: () => orderApi.getOrder(orderId),
        enabled: !!orderId,
    });
};

// Create order mutation
export const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: orderApi.createOrder,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            toast.success("Order placed successfully!");
            return data;
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Failed to place order"
            );
        },
    });
};

// Update order status mutation (admin only)
export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, status }) =>
            orderApi.updateOrderStatus(orderId, status),
        onSuccess: (_, { orderId }) => {
            queryClient.invalidateQueries({
                queryKey: orderKeys.detail(orderId),
            });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            toast.success("Order status updated successfully");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Failed to update order status"
            );
        },
    });
};

// Cancel order mutation
export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: orderApi.cancelOrder,
        onSuccess: (_, orderId) => {
            queryClient.invalidateQueries({
                queryKey: orderKeys.detail(orderId),
            });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            toast.success("Order cancelled successfully");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Failed to cancel order"
            );
        },
    });
};
