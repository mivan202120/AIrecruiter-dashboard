import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f0fe',
          100: '#c6d8fc',
          200: '#9fbffa',
          300: '#78a5f8',
          400: '#5a91f5',
          500: '#3b7df3',
          600: '#1a73e8',
          700: '#1557b0',
          800: '#0f4186',
          900: '#0a2b5c',
        },
        accent: {
          purple: '#8b5cf6',
          teal: '#14b8a6',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '4px',
        lg: '12px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
} satisfies Config
