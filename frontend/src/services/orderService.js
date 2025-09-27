import api from "../lib/api";

// Order API endpoints
export const orderApi = {
    // Get user's orders
    getOrders: async () => {
        const { data } = await api.get("/orders");
        return data;
    },

    // Get single order
    getOrder: async (orderId) => {
        const { data } = await api.get(`/orders/${orderId}`);
        return data;
    },

    // Create new order
    createOrder: async (orderData) => {
        const { data } = await api.post("/orders", orderData);
        return data;
    },

    // Update order status (admin only)
    updateOrderStatus: async (orderId, status) => {
        const { data } = await api.put(`/orders/${orderId}/status`, { status });
        return data;
    },

    // Cancel order
    cancelOrder: async (orderId) => {
        const { data } = await api.put(`/orders/${orderId}/cancel`);
        return data;
    },
};
