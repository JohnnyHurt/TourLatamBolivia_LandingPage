/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          950: 'rgb(var(--color-dark-950, 7 2 15) / <alpha-value>)',
          900: 'rgb(var(--color-dark-900, 11 4 24) / <alpha-value>)',
          850: 'rgb(var(--color-dark-850, 15 6 32) / <alpha-value>)',
          800: 'rgb(var(--color-dark-800, 19 9 36) / <alpha-value>)',
          750: 'rgb(var(--color-dark-750, 24 11 46) / <alpha-value>)',
          700: 'rgb(var(--color-dark-700, 29 11 56) / <alpha-value>)',
          650: 'rgb(var(--color-dark-650, 36 14 68) / <alpha-value>)',
          600: 'rgb(var(--color-dark-600, 47 18 88) / <alpha-value>)',
          500: 'rgb(var(--color-dark-500, 61 22 114) / <alpha-value>)',
        },
        brand: {
          cyan: 'rgb(var(--color-brand-cyan, 0 242 254) / <alpha-value>)',
          cyanLight: 'rgb(var(--color-brand-cyan-light, 79 172 254) / <alpha-value>)',
          cyanGlow: 'rgb(var(--color-brand-cyan, 0 242 254) / 0.5)',
          magenta: 'rgb(var(--color-brand-magenta, 255 0 127) / <alpha-value>)',
          magentaLight: 'rgb(var(--color-brand-magenta-light, 247 37 133) / <alpha-value>)',
          magentaGlow: 'rgb(var(--color-brand-magenta, 255 0 127) / 0.5)',
          purple: 'rgb(var(--color-brand-purple, 121 40 202) / <alpha-value>)',
          violet: 'rgb(var(--color-brand-violet, 131 56 236) / <alpha-value>)',
          purpleGlow: 'rgb(var(--color-brand-purple, 121 40 202) / 0.5)',
          pmiOrange: 'rgb(var(--color-brand-pmi-orange, 255 94 20) / <alpha-value>)',
          pmiOrangeDark: 'rgb(var(--color-brand-pmi-orange-dark, 224 74 5) / <alpha-value>)',
          navy: 'rgb(var(--color-brand-navy, 11 4 24) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Barlow', 'Inter', 'system-ui', 'sans-serif'],
        condensed: ['"Barlow Condensed"', 'sans-serif'],
      },
      backgroundImage: {
        'latam-gradient':
          'linear-gradient(135deg, rgb(var(--color-brand-cyan, 0 242 254)) 0%, rgb(var(--color-brand-purple, 121 40 202)) 50%, rgb(var(--color-brand-magenta, 255 0 127)) 100%)',
        'latam-horizontal':
          'linear-gradient(90deg, rgb(var(--color-brand-cyan, 0 242 254)) 0%, rgb(var(--color-brand-violet, 131 56 236)) 45%, rgb(var(--color-brand-magenta, 255 0 127)) 100%)',
        'hero-gradient':
          'radial-gradient(circle at 80% 20%, rgb(var(--color-brand-magenta, 255 0 127) / 0.22) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgb(var(--color-brand-cyan, 0 242 254) / 0.20) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgb(var(--color-brand-purple, 121 40 202) / 0.25) 0%, transparent 70%)',
        'glass-gradient':
          'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'card-gradient':
          'linear-gradient(180deg, rgb(var(--color-dark-700, 29 11 56) / 0.9) 0%, rgb(var(--color-dark-900, 11 4 24) / 0.95) 100%)',
        'card-hover-gradient':
          'linear-gradient(180deg, rgb(var(--color-dark-600, 47 18 88) / 0.9) 0%, rgb(var(--color-dark-800, 19 9 36) / 0.95) 100%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgb(var(--color-brand-cyan, 0 242 254) / 0.45)',
        'glow-cyan-lg': '0 0 40px rgb(var(--color-brand-cyan, 0 242 254) / 0.6)',
        'glow-magenta': '0 0 25px rgb(var(--color-brand-magenta, 255 0 127) / 0.45)',
        'glow-magenta-lg': '0 0 40px rgb(var(--color-brand-magenta, 255 0 127) / 0.6)',
        'glow-purple': '0 0 25px rgb(var(--color-brand-purple, 121 40 202) / 0.45)',
        'glow-latam':
          '0 0 30px rgb(var(--color-brand-purple, 121 40 202) / 0.35), 0 0 15px rgb(var(--color-brand-cyan, 0 242 254) / 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
