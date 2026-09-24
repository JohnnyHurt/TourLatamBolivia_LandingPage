/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07020F',
          900: '#0B0418', // Cosmic Midnight Violet
          850: '#0F0620',
          800: '#130924', // Surface Deep Violet
          750: '#180B2E',
          700: '#1D0B38', // Facet Card Violet
          650: '#240E44',
          600: '#2F1258', // Border Violet
          500: '#3D1672',
        },
        brand: {
          cyan: '#00F2FE',
          cyanLight: '#4FACFE',
          cyanGlow: '#00F2FE80',
          magenta: '#FF007F',
          magentaLight: '#F72585',
          magentaGlow: '#FF007F80',
          purple: '#7928CA',
          violet: '#8338EC',
          purpleGlow: '#7928CA80',
          pmiOrange: '#FF5E14',
          pmiOrangeDark: '#E04A05',
          navy: '#0B0418',
        },
      },
      fontFamily: {
        sans: ['Barlow', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        condensed: ['"Barlow Condensed"', 'Impact', 'Arial Narrow', 'sans-serif'],
      },
      backgroundImage: {
        'latam-gradient': 'linear-gradient(135deg, #00F2FE 0%, #7928CA 50%, #FF007F 100%)',
        'latam-horizontal': 'linear-gradient(90deg, #00F2FE 0%, #8338EC 45%, #FF007F 100%)',
        'hero-gradient': 'radial-gradient(circle at 80% 20%, rgba(255, 0, 127, 0.22) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(0, 242, 254, 0.20) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(121, 40, 202, 0.25) 0%, transparent 70%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(29, 11, 56, 0.9) 0%, rgba(11, 4, 24, 0.95) 100%)',
        'card-hover-gradient': 'linear-gradient(180deg, rgba(45, 18, 85, 0.9) 0%, rgba(19, 9, 36, 0.95) 100%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(0, 242, 254, 0.45)',
        'glow-cyan-lg': '0 0 40px rgba(0, 242, 254, 0.6)',
        'glow-magenta': '0 0 25px rgba(255, 0, 127, 0.45)',
        'glow-magenta-lg': '0 0 40px rgba(255, 0, 127, 0.6)',
        'glow-purple': '0 0 25px rgba(121, 40, 202, 0.45)',
        'glow-latam': '0 0 30px rgba(121, 40, 202, 0.35), 0 0 15px rgba(0, 242, 254, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
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
