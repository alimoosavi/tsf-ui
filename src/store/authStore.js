import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            setToken: (token) => set({ token }),
            logout: () => set({ token: null }),
            restore: async () => {
                // Optional: Add logic to restore token if needed
            },
        }),
        {
            name: 'auth-storage',
            getStorage: () => localStorage,
        }
    )
);