/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        success: "#22c55e",
        danger: "#ef4444",
        warning: "#f59e0b",
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [],
};