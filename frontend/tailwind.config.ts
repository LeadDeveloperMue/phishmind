import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0D1117',
          surface: '#161B22',
          border: '#30363D',
          primary: '#E6EDF3',
          secondary: '#8B949E',
        },
        light: {
          bg: '#F6F8FA',
          surface: '#FFFFFF',
          border: '#D0D7DE',
          primary: '#1F2328',
          secondary: '#656D76',
        },
        accent: '#F97316',
        success: {
          DEFAULT: '#3FB950',
          light: '#1A7F37',
        },
        danger: {
          DEFAULT: '#F85149',
          light: '#CF222E',
        },
        warning: {
          DEFAULT: '#D29922',
          light: '#9A6700',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
} satisfies Config
