import { useState, useCallback } from "react";
import { authApi } from "../services/authService";
import { toast } from "react-hot-toast";

// Get user profile
export const useProfile = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await authApi.getProfile();
            setData(result);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, fetchProfile };
};

// Register user
export const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = useCallback(async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.register(userData);
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
            }
            toast.success("Registration successful!");
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Registration failed";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { register, loading, error };
};

// Login user
export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = useCallback(async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.login(credentials);
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.reload();
            }
            toast.success("Login successful!");
            return data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Login failed";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { login, loading, error };
};

// Logout user
export const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const logout = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await authApi.logout();
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
            toast.success("Logged out successfully!");
        } catch {
            // Even if logout fails on server, clear local storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
            toast.success("Logged out successfully!");
        } finally {
            setLoading(false);
        }
    }, []);

    return { logout, loading, error };
};

// Update profile
export const useUpdateProfile = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateProfile = useCallback(async (profileData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.updateProfile(profileData);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Profile updated successfully");
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Profile update failed";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateProfile, loading, error };
};

// get addresses
export const useGetAddress = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [addresses, setAddresses] = useState([]);

    const getAddress = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.getAddress();
            setAddresses(data.addresses);
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Failed to load addresses";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getAddress, loading, error, addresses };
};

// Update address
export const useUpdateAddress = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateAddress = useCallback(async (addressData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.updateAddress(addressData);
            toast.success("Address updated successfully");
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Address update failed";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateAddress, loading, error };
};

// Delete address
export const useDeleteAddress = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteAddress = useCallback(async (addressId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.deleteAddress(addressId);
            toast.success("Address deleted successfully");
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Address deletion failed";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteAddress, loading, error };
};

// Change password
export const useChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const changePassword = useCallback(async (passwordData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.changePassword(passwordData);
            toast.success("Password changed successfully");
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Password change failed";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { changePassword, loading, error };
};

// Forgot password
export const useForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const forgotPassword = useCallback(async (email) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.forgotPassword(email);
            toast.success("Password reset email sent!");
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Failed to send reset email";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { forgotPassword, loading, error };
};

// Reset password
export const useResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const resetPassword = useCallback(async ({ token, password }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.resetPassword(token, password);
            toast.success("Password reset successful!");
            return data;
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Password reset failed";
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { resetPassword, loading, error };
};
