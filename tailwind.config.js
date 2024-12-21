/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Koyu arka planlar için
        dark: {
          900: '#000000', // Saf siyah
          800: '#0A0A0A',
          700: '#141414',
        },
        // Mavi gradyan için
        glow: {
          400: '#4FD1C5', // Açık turkuaz
          500: '#38B2AC', // Turkuaz
          600: '#319795', // Koyu turkuaz
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    }
  },
  plugins: [],
};
