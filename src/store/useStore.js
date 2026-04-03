import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * @typedef {'income'|'expense'} TxType
 * @typedef {'date'|'amount'} SortKey
 * @typedef {'admin'|'viewer'} Role
 * @typedef {'dark'|'light'} Theme
 * @typedef {'dashboard'|'transactions'|'analytics'|'wallet'} Page
 * @typedef {'success'|'error'|'info'|'warning'} ToastKind
 * @typedef {{ id: string, msg: string, kind: ToastKind }} Toast
 * @typedef {{ id: number, date: string, desc: string, amount: number, type: TxType, category: string }} Transaction
 */

const useStore = create(
  persist(
    (set) => ({
      /** @type {Transaction[]} */
      transactions: [],

      filters: {
        search: '',
        category: 'all',
        type: 'all',
        /** @type {SortKey} */
        sort: 'date',
      },

      /** @type {Role} */
      role: 'admin',

      /** @type {Theme} */
      theme: 'dark',

      /** @type {Page} */
      page: 'dashboard',

      isLoading: false,

      /** @type {Toast[]} */
      toasts: [],

      /** @param {Transaction} tx */
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions],
        })),

      /** @param {number} id */
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      /**
       * @param {string} key
       * @param {string} value
       */
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      /** @param {Role} role */
      setRole: (role) => set({ role }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),

      /** @param {Page} page */
      setPage: (page) => set({ page }),

      /** @param {boolean} bool */
      setLoading: (bool) => set({ isLoading: bool }),

      /**
       * @param {{ msg: string, kind: ToastKind }} toast
       */
      addToast: ({ msg, kind }) =>
        set((state) => {
          const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`;
          const toasts = [{ id, msg, kind }, ...state.toasts].slice(0, 4);
          return { toasts };
        }),

      /** @param {string} id */
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
