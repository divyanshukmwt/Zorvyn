/**
 * @typedef {{ color: string, emoji: string }} CategoryMeta
 * @typedef {{ id: number, date: string, desc: string, amount: number, type: 'income'|'expense', category: string }} Transaction
 */

/** @type {Record<string, CategoryMeta>} */
export const CATEGORIES = {
  Food:          { color: '#F97316', emoji: '🍔' },
  Transport:     { color: '#3B82F6', emoji: '🚗' },
  Shopping:      { color: '#EC4899', emoji: '🛍️' },
  Health:        { color: '#10B981', emoji: '💊' },
  Entertainment: { color: '#8B5CF6', emoji: '🎬' },
  Utilities:     { color: '#6366F1', emoji: '⚡' },
  Salary:        { color: '#34D399', emoji: '💰' },
  Freelance:     { color: '#5EEAD4', emoji: '💻' },
  Investment:    { color: '#FBBF24', emoji: '📈' },
};

export const CATEGORY_NAMES = Object.keys(CATEGORIES);

/** @type {Transaction[]} */
export const SEED_TRANSACTIONS = [
  { id: 1,  date: '2026-04-01', desc: 'April Salary',                    amount: 85000, type: 'income',  category: 'Salary' },
  { id: 2,  date: '2026-03-31', desc: 'Grocery Run — BigBasket',         amount: 2840,  type: 'expense', category: 'Food' },
  { id: 3,  date: '2026-03-29', desc: 'Uber Ride — Office Commute',      amount: 380,   type: 'expense', category: 'Transport' },
  { id: 4,  date: '2026-03-28', desc: 'Netflix Premium Plan',            amount: 649,   type: 'expense', category: 'Entertainment' },
  { id: 5,  date: '2026-03-27', desc: 'Freelance — React Dashboard',     amount: 42000, type: 'income',  category: 'Freelance' },
  { id: 6,  date: '2026-03-25', desc: 'Pharmacy — MedPlus',              amount: 760,   type: 'expense', category: 'Health' },
  { id: 7,  date: '2026-03-24', desc: 'Amazon — Home Essentials',        amount: 3290,  type: 'expense', category: 'Shopping' },
  { id: 8,  date: '2026-03-22', desc: 'BESCOM Electricity Bill',         amount: 1850,  type: 'expense', category: 'Utilities' },
  { id: 9,  date: '2026-03-20', desc: 'March Salary',                    amount: 85000, type: 'income',  category: 'Salary' },
  { id: 10, date: '2026-03-18', desc: 'Swiggy — Friday Night Dinner',    amount: 890,   type: 'expense', category: 'Food' },
  { id: 11, date: '2026-03-15', desc: 'SIP — NIFTY 50 Index Fund',       amount: 10000, type: 'expense', category: 'Investment' },
  { id: 12, date: '2026-03-14', desc: 'Ola Cab — Airport Drop',          amount: 520,   type: 'expense', category: 'Transport' },
  { id: 13, date: '2026-03-12', desc: 'Freelance — Brand Identity',      amount: 18000, type: 'income',  category: 'Freelance' },
  { id: 14, date: '2026-03-10', desc: 'Spotify + YouTube Premium',       amount: 399,   type: 'expense', category: 'Entertainment' },
  { id: 15, date: '2026-03-08', desc: 'D-Mart Monthly Groceries',        amount: 4200,  type: 'expense', category: 'Food' },
  { id: 16, date: '2026-03-05', desc: 'Airtel Broadband — 300 Mbps',     amount: 1199,  type: 'expense', category: 'Utilities' },
  { id: 17, date: '2026-02-28', desc: 'February Salary',                 amount: 85000, type: 'income',  category: 'Salary' },
  { id: 18, date: '2026-02-25', desc: 'Cult.fit Gym Membership',         amount: 2500,  type: 'expense', category: 'Health' },
  { id: 19, date: '2026-02-20', desc: 'Myntra — Seasonal Shopping',      amount: 5640,  type: 'expense', category: 'Shopping' },
  { id: 20, date: '2026-02-14', desc: "Valentine's Day Dinner",          amount: 3200,  type: 'expense', category: 'Food' },
];

export const MONTHLY_SUMMARY = [
  { month: 'Jan', income: 88000,  expenses: 42000 },
  { month: 'Feb', income: 88000,  expenses: 39500 },
  { month: 'Mar', income: 92000,  expenses: 44800 },
  { month: 'Apr', income: 92000,  expenses: 41200 },
  { month: 'May', income: 95000,  expenses: 46300 },
  { month: 'Jun', income: 95000,  expenses: 43900 },
  { month: 'Jul', income: 100000, expenses: 48600 },
  { month: 'Aug', income: 100000, expenses: 45200 },
  { month: 'Sep', income: 103000, expenses: 49800 },
  { month: 'Oct', income: 108000, expenses: 47500 },
  { month: 'Nov', income: 112000, expenses: 52100 },
  { month: 'Dec', income: 118000, expenses: 55400 },
];
