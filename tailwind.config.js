/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#36abf7',
          500: '#0c8ee9',
          600: '#0270c7',
          700: '#0359a1',
          800: '#074c84',
          900: '#0c406e',
          950: '#082849',
        },
        dark: {
          50: '#f6f6f7',
          100: '#e1e3e5',
          200: '#c3c7cb',
          300: '#9fa4ab',
          400: '#79808a',
          500: '#5e6570',
          600: '#474e57',
          700: '#373d45',
          800: '#20242a',
          900: '#121519',
          950: '#0b0d10',
        },
        ai: {
          light: '#f5f3ff',
          border: '#ddd6fe',
          primary: '#8b5cf6',
          dark: '#6d28d9',
          glow: 'rgba(139, 92, 246, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
