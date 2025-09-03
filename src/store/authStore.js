import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance, { setAuthToken } from '../api/axiosInstance';
import { debounce } from '../utils/debounce';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            accessToken: null,
            refreshToken: null,
            isRestoring: false,
            setTokens: (access, refresh) => {
                console.log('Setting tokens:', { access, refresh });
                set({ accessToken: access, refreshToken: refresh });
                setAuthToken(access);
            },
            logout: () => {
                console.log('Clearing tokens and localStorage');
                set({ accessToken: null, refreshToken: null });
                localStorage.removeItem('auth-storage');
                setAuthToken(null);
            },
            restore: debounce(async () => {
                const { refreshToken, isRestoring } = get();
                if (!refreshToken || isRestoring) {
                    console.log('No refresh token or already restoring, skipping');
                    return;
                }
                set({ isRestoring: true });
                try {
                    console.log('Attempting to refresh token');
                    const response = await axiosInstance.post('/token/refresh/', { refresh: refreshToken });
                    set({ accessToken: response.data.access });
                    setAuthToken(response.data.access);
                    console.log('Token refreshed successfully');
                } catch (error) {
                    console.error('Token refresh failed:', error.response?.data || error);
                    set({ accessToken: null, refreshToken: null });
                    localStorage.removeItem('auth-storage');
                    setAuthToken(null);
                    throw error;
                } finally {
                    set({ isRestoring: false });
                }
            }, 1000),
        }),
        {
            name: 'auth-storage',
            getStorage: () => localStorage,
        }
    )
);