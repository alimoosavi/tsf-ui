// src/api/authService.js
import axiosInstance from "./axiosInstance"; // Adjust path if needed

export async function login(username, password) {
    try {
        const response = await axiosInstance.post("/token/", {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: "Login failed" };
    }
}

export async function registerUser(username, email, password) {
    try {
        const response = await axiosInstance.post("/register/", {
            username,
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: "Registration failed" };
    }
}
