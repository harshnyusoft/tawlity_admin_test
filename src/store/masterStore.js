import { create } from 'zustand';

const masterStore = create((set, get) => ({
    // Auth
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    loadingCount: 0,
    isLoading: false,



    // Actions
    setToken: (token) => set({ token }),
    clearToken: () => set({ token: null }),
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
    startLoading: () => {
        const { loadingCount } = get();
        const newCount = loadingCount + 1;
        set({ loadingCount: newCount, isLoading: true });
    },

    stopLoading: () => {
        const { loadingCount } = get();
        const newCount = Math.max(loadingCount - 1, 0);
        set({
            loadingCount: newCount,
            isLoading: newCount > 0,
        });
    },
}));

export default masterStore;
