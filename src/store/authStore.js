import { create } from "zustand";

export const useAuthStore = create((set) => ({
    token: null,
    refreshToken: null,
    login: (access, refresh) => {
        set({ token: access, refreshToken: refresh });
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
    },
    logout: () => {
        set({ token: null, refreshToken: null });
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    },
    restore: () => {
        const access = localStorage.getItem("access_token");
        const refresh = localStorage.getItem("refresh_token");
        if (access) set({ token: access, refreshToken: refresh });
    }
}));
