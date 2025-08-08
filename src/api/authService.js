import axiosInstance from "./axiosInstance";

export const login = async (username, password) => {
    const res = await axiosInstance.post("token/", { username, password });
    return res.data;
};

export const registerUser = async (username, password) => {
    const res = await axiosInstance.post("register/", { username, password });
    return res.data;
};
