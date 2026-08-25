/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        krishi: {
          50: '#f2f9f1',
          100: '#e2f2df',
          200: '#c5e4c0',
          300: '#99d092',
          400: '#67b45e',
          500: '#46993d',
          600: '#357c2e',
          700: '#2b6227',
          800: '#264f23',
          900: '#21421f',
          950: '#0d240d',
        },
        harvest: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
