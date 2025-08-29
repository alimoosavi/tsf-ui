import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../api/axiosInstance';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            accessToken: null,
            refreshToken: null,
            setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
            logout: () => set({ accessToken: null, refreshToken: null }),
            restore: async () => {
                const { refreshToken } = get();
                if (!refreshToken) {
                    console.log('No refresh token found, skipping restore');
                    return;
                }
                try {
                    console.log('Attempting to refresh token');
                    const response = await axiosInstance.post('/token/refresh/', { refresh: refreshToken });
                    set({ accessToken: response.data.access });
                    console.log('Token refreshed successfully');
                } catch (error) {
                    console.error('Token refresh failed:', error.response?.data || error);
                    set({ accessToken: null, refreshToken: null });
                    throw error;
                }
            },
        }),
        {
            name: 'auth-storage',
            getStorage: () => localStorage,
        }
    )
);