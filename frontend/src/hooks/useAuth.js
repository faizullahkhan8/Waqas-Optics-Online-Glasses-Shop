import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../services/authService";
import toast from "react-hot-toast";

// Query Keys
export const authKeys = {
    all: ["auth"],
    profile: () => [...authKeys.all, "profile"],
};

// Get user profile
export const useProfile = () => {
    return useQuery({
        queryKey: authKeys.profile(),
        queryFn: authApi.getProfile,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Register mutation
export const useRegister = () => {
    return useMutation({
        mutationFn: authApi.register,
        onSuccess: (data) => {
            toast.success("Registration successful!");
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
            }
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Registration failed");
        },
    });
};

// Login mutation
export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            toast.success("Login successful!");
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                queryClient.invalidateQueries({ queryKey: authKeys.profile() });
            }
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Login failed");
        },
    });
};

// Logout mutation
export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            queryClient.clear();
            toast.success("Logged out successfully");
        },
        onError: () => {
            // Still clear local storage even if API call fails
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            queryClient.clear();
        },
    });
};

// Update profile mutation
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.updateProfile,
        onSuccess: (data) => {
            queryClient.setQueryData(authKeys.profile(), data);
            toast.success("Profile updated successfully");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Profile update failed"
            );
        },
    });
};

// Change password mutation
export const useChangePassword = () => {
    return useMutation({
        mutationFn: authApi.changePassword,
        onSuccess: () => {
            toast.success("Password changed successfully");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Password change failed"
            );
        },
    });
};

// Forgot password mutation
export const useForgotPassword = () => {
    return useMutation({
        mutationFn: authApi.forgotPassword,
        onSuccess: () => {
            toast.success("Password reset email sent");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Failed to send reset email"
            );
        },
    });
};

// Reset password mutation
export const useResetPassword = () => {
    return useMutation({
        mutationFn: ({ token, password }) =>
            authApi.resetPassword(token, password),
        onSuccess: () => {
            toast.success("Password reset successfully");
        },
        onError: (error) => {
            toast.error(
                error.response?.data?.message || "Password reset failed"
            );
        },
    });
};
