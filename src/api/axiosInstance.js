import axios from "axios";
import { useAuthStore } from "../store/authStore"; // Only for reference, not used directly

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/",
    headers: { "Content-Type": "application/json" },
});

// Function to set up the interceptor with the token
export const setAuthToken = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common["Authorization"];
    }
};

// Optional: Add response interceptor for handling 401 errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Optionally handle token expiration (e.g., refresh token or logout)
            console.error("Unauthorized: Token may be invalid or expired.");
            // Example: Clear token and redirect to login
            // useAuthStore.getState().logout(); // This won't work here directly
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;