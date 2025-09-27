import axios from "axios";
import { clearCredentials } from "../store/authSlice";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api/v1",
    withCredentials: true, // include cookies
    headers: {
        "Content-Type": "application/json",
    },
});
// Setup interceptors with access to redux dispatch
let _storeDispatch = null;
export const setupInterceptors = (dispatch) => {
    _storeDispatch = dispatch;
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (status === 401 && _storeDispatch) {
            // Clear credentials in store on unauthorized
            _storeDispatch(clearCredentials());
        }
        return Promise.reject(error);
    }
);
