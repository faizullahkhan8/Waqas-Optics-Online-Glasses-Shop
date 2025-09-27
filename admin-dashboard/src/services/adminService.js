import { api } from "../lib/api";

export const getDashboardStats = async () => {
    const res = await api.get("/admin/dashboard/stats");
    return res.data;
};

export const getRecentOrders = async () => {
    const res = await api.get("/admin/dashboard/recent-orders");
    return res.data;
};

export const getAnalyticsOverview = async () => {
    const res = await api.get("/admin/analytics/overview");
    return res.data;
};

export const getSalesData = async (period) => {
    const res = await api.get("/admin/analytics/sales-data", {
        params: { period },
    });
    return res.data;
};

export const getTopProducts = async () => {
    const res = await api.get("/admin/analytics/top-products");
    return res.data;
};

export const getAllUsers = async () => {
    const res = await api.get("/admin/users");
    return res.data;
};

export const getAllOrders = async () => {
    const res = await api.get("/orders/admin/orders");
    return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const res = await api.put(`/orders/admin/order/${orderId}`, {
        orderStatus: status,
    });
    return res.data;
};
