import { COLORS } from './src/constants/colors.js';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        // Theme-aware: backed by CSS variables — light/dark respond automatically
        bg:      'var(--ff-bg)',
        surface: 'var(--ff-surface)',
        card:    'var(--ff-card)',

        text: {
          primary:   'var(--ff-text-primary)',
          secondary: 'var(--ff-text-secondary)',
          muted:     'var(--ff-text-muted)',
        },

        border: {
          subtle: 'var(--ff-border)',
        },

        overlay: {
          light: 'var(--ff-overlay)',
        },

        // Brand / semantic: static, theme-independent
        accent: {
          primary:   COLORS.primary,
          secondary: COLORS.secondary,
        },

        success: COLORS.success,
        danger:  COLORS.danger,
        warning: COLORS.warning,
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