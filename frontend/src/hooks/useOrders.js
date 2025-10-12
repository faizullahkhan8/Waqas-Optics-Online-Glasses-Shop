import { useState, useCallback, useEffect } from "react";
import { orderApi } from "../services/orderService";
import { toast } from "react-hot-toast";

// Get user's orders
export const useOrders = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await orderApi.getOrders();
            setData(result);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { data, loading, error, refetch: fetchOrders };
};

// Get single order
export const useOrder = (orderId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrder = useCallback(async () => {
        if (!orderId) return;

        setLoading(true);
        setError(null);
        try {
            const result = await orderApi.getOrder(orderId);
            setData(result);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch order");
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    return { data, loading, error, refetch: fetchOrder };
};

// Create order
export const useCreateOrder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createOrder = useCallback(async (orderData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderApi.createOrder(orderData);
            toast.success("Order placed successfully!");
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Failed to create order";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createOrder, loading, error };
};

// Update order status (admin only)
export const useUpdateOrderStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateOrderStatus = useCallback(async ({ orderId, status }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderApi.updateOrderStatus(orderId, status);
            toast.success("Order status updated successfully");
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Failed to update order status";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateOrderStatus, loading, error };
};

// Cancel order
export const useCancelOrder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cancelOrder = useCallback(async (orderId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderApi.cancelOrder(orderId);
            toast.success("Order cancelled successfully");
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Failed to cancel order";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { cancelOrder, loading, error };
};
