import axiosInstance from "./axiosInstance";

export async function login(username, password) {
    console.log('Login payload:', { username, password });
    try {
        const response = await axiosInstance.post("/token/", {
            username,
            password,
        });
        console.log('Login response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error);
        throw error.response?.data || { detail: "Login failed" };
    }
}

export async function registerUser(username, email, password) {
    console.log('Register payload:', { username, email, password });
    try {
        const response = await axiosInstance.post("/register/", {
            username,
            email,
            password,
        });
        console.log('Register response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Register error:', error.response?.data || error);
        throw error.response?.data || { detail: "Registration failed" };
    }
}
