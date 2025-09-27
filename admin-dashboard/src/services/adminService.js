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

// Profile APIs (use auth endpoints)
export const getProfile = async () => {
    const res = await api.get("/auth/me");
    return res.data;
};

export const updateProfile = async (payload) => {
    const res = await api.put("/auth/me/update", payload);
    return res.data;
};

// Auth
export const loginAdmin = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
};

export const logoutAdmin = async () => {
    const res = await api.get("/auth/logout");
    return res.data;
};

// Product admin APIs
export const createProduct = async (formData) => {
    // formData should be a FormData instance with images[] and other fields
    const res = await api.post("/products/admin/product/new", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const fetchProducts = async (params = {}) => {
    const res = await api.get("/products/products", { params });
    return res.data;
};

export const getProduct = async (id) => {
    const res = await api.get(`/products/product/${id}`);
    return res.data;
};

export const updateProduct = async (id, formData) => {
    const res = await api.put(`/products/admin/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

export const deleteProduct = async (id) => {
    const res = await api.delete(`/products/admin/product/${id}`);
    return res.data;
};
