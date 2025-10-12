import api from "../lib/api";

// Auth API endpoints
export const authApi = {
    // Register new user
    register: async (userData) => {
        const { data } = await api.post("/auth/register", userData);
        return data;
    },

    // Login user
    login: async (credentials) => {
        const { data } = await api.post("/auth/login", credentials);
        return data;
    },

    // Logout user
    logout: async () => {
        const { data } = await api.post("/auth/logout");
        return data;
    },

    // Get current user profile
    getProfile: async () => {
        const { data } = await api.get("/auth/me");
        return data;
    },

    // Update user profile
    updateProfile: async (profileData) => {
        const { data } = await api.put("/auth/me/update", profileData);
        return data;
    },

    // add/update address
    updateAddress: async (addressData) => {
        const { data } = await api.post("/auth/address", addressData);
        return data;
    },

    // get addresses
    getAddress: async () => {
        const { data } = await api.get("/auth/address");
        return data;
    },

    // delete address
    deleteAddress: async (addressId) => {
        const { data } = await api.delete(`/auth/address/${addressId}`);
        return data;
    },

    // Change password
    changePassword: async (passwordData) => {
        const { data } = await api.put("/auth/change-password", passwordData);
        return data;
    },

    // Forgot password
    forgotPassword: async (email) => {
        const { data } = await api.post("/auth/forgot-password", { email });
        return data;
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        const { data } = await api.post("/auth/reset-password", {
            token,
            password: newPassword,
        });
        return data;
    },
};
