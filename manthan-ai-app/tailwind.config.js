/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e9edff',
          200: '#d7dcff',
          300: '#b8c1ff',
          400: '#6E8CFB', // provided
          500: '#636CCB', // provided
          600: '#50589C', // provided
          700: '#3C467B', // provided
          800: '#2F375F',
          900: '#232a48',
        },
        primary: {
          50: '#f5f7ff',
          100: '#e9edff',
          200: '#d7dcff',
          300: '#b8c1ff',
          400: '#6E8CFB',
          500: '#636CCB',
          600: '#50589C',
          700: '#3C467B',
          800: '#2F375F',
          900: '#232a48',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
