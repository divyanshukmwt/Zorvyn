import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      transactions: [],

      filters: {
        search: '',
        category: 'all',
        type: 'all',
        sort: 'date',
      },

      role: 'admin',

      theme: 'dark',

      page: 'dashboard',

      isLoading: false,

      toasts: [],

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      setRole: (role) => set({ role }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),

      setPage: (page) => set({ page }),

      setLoading: (bool) => set({ isLoading: bool }),

      addToast: ({ msg, kind }) =>
        set((state) => {
          const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`;
          const toasts = [{ id, msg, kind }, ...state.toasts].slice(0, 4);
          return { toasts };
        }),

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      hydrateTransactions: (transactions) => set({ transactions }),
    }),
    {
      name: 'Zorvyn-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        theme: state.theme,
        role: state.role,
      }),
    }
  )
);

export default useStore;
