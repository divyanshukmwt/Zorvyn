import { COLORS } from './src/constants/colors.js';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        bg: COLORS.bg,
        surface: COLORS.surface,
        card: COLORS.card,

        accent: {
          primary: COLORS.primary,
          secondary: COLORS.secondary,
        },

        success: COLORS.success,
        danger: COLORS.danger,
        warning: COLORS.warning,

        text: {
          primary: COLORS.textPrimary,
          secondary: COLORS.textSecondary,
          muted: COLORS.textMuted,
        },

        border: {
          subtle: COLORS.border,
        },

        overlay: {
          light: COLORS.overlay,
        },
      },

      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },

      borderRadius: {
        card: '14px',
        btn: '10px',
        input: '8px',
        badge: '9999px',
      },

      boxShadow: {
        card: '0 6px 24px rgba(0,0,0,0.35)',
        'card-hover': '0 14px 40px rgba(0,0,0,0.5)',
        glow: '0 0 18px rgba(167,139,250,0.12)',
      },

      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },

  plugins: [],
};