/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        google: {
          blue: '#4285f4',
          red: '#ea4335',
          yellow: '#fbbc05',
          green: '#34a853',
          border: '#dfe1e5',
          darkBorder: '#5f6368',
          darkBg: '#202124',
          darkSurface: '#303134',
          darkHover: '#3c4043',
          lightHover: '#f8f9fa',
          link: '#1a0dab',
          darkLink: '#8ab4f8',
        },
        yt: {
          red: '#ff0033',
          glow: 'rgba(255, 0, 51, 0.4)'
        },
        li: {
          blue: '#0a66c2',
          glow: 'rgba(10, 102, 194, 0.4)'
        },
        ig: {
          pink: '#e1306c',
          purple: '#833ab4',
          glow: 'rgba(225, 48, 108, 0.4)'
        }
      },
      boxShadow: {
        'google': '0 1px 6px rgba(32, 33, 36, 0.28)',
        'google-hover': '0 2px 8px rgba(32, 33, 36, 0.35)',
        'google-open': '0 4px 16px rgba(32, 33, 36, 0.28)',
        'google-dark': '0 1px 8px rgba(0, 0, 0, 0.6)',
        'google-dark-hover': '0 2px 10px rgba(0, 0, 0, 0.8)',
        'google-dark-open': '0 6px 24px rgba(0, 0, 0, 0.85)',
        'yt-halo': '0 0 20px rgba(255, 0, 51, 0.35)',
        'li-halo': '0 0 20px rgba(10, 102, 194, 0.35)',
        'ig-halo': '0 0 20px rgba(225, 48, 108, 0.35)',
      }
    },
  },
  plugins: [],
}
