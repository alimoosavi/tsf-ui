import axios from "axios";
import { useAuthStore } from "../store/authStore";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken",
});

export const setAuthToken = (token) => {
    console.log('Setting axios Authorization header:', token ? `Bearer ${token}` : null);
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common["Authorization"];
    }
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.error("Unauthorized error, attempting token refresh:", {
                status: error.response?.status,
                data: error.response?.data,
                url: error.config?.url,
            });
            try {
                const { refreshToken, setTokens } = useAuthStore.getState();
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }
                const response = await axiosInstance.post("/token/refresh/", { refresh: refreshToken });
                const { access } = response.data;
                setTokens(access, refreshToken);
                originalRequest.headers["Authorization"] = `Bearer ${access}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError.response?.data || refreshError);
                useAuthStore.getState().logout();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        console.error("Request error:", {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
        });
        return Promise.reject(error);
    }
);

export default axiosInstance;