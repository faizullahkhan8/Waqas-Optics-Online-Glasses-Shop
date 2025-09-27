import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api/v1",
    withCredentials: true, // include cookies
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Optionally handle 401 globally
        return Promise.reject(error);
    }
);
