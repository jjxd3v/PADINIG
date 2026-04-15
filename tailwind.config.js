

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a5f', // Deep navy blue
          light: '#2c5282',
          dark: '#1a202c',
        },
        secondary: {
          DEFAULT: '#059669', // Emerald green
          light: '#10b981',
          dark: '#047857',
        },
        accent: {
          DEFAULT: '#f59e0b', // Amber
          light: '#fbbf24',
          dark: '#d97706',
        },
        emergency: {
          DEFAULT: '#dc2626', // Red
          light: '#ef4444',
          dark: '#b91c1c',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc', // Very light slate
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
      }
    },
  },
  plugins: [],
}

