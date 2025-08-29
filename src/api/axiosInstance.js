import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "/api/",
    withCredentials: true,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken",
});

export const setAuthToken = (token) => {
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common["Authorization"];
    }
};

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized error:", {
                status: error.response?.status,
                data: error.response?.data,
                url: error.config?.url,
            });
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;