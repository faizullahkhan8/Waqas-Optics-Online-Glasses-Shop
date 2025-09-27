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
        const { data } = await api.get("/auth/profile");
        return data;
    },

    // Update user profile
    updateProfile: async (profileData) => {
        const { data } = await api.put("/auth/profile", profileData);
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
