/** @type {import('tailwindcss').Config} */

const { reduce } = require('lodash');

module.exports = {
  important: true,
  content: [
    './projects/**/src/**/*.{html,ts}',
    './dist/safe/**/*.{html,ts,js,mjs}',
    './node_modules/safe/**/*.mjs',
  ],
  theme: {
    extend: {
      boxShadow: {
        '2lg': '0 2px 5px 0 rgba(134, 134, 134, 0.2)',
      },
      colors: {
        'test': '#ff00ff',
        'primary': {
          50: 'rgb(var(--primary-50) / <alpha-value>)',
          100: 'rgb(var(--primary-100) / <alpha-value>)',
          200: 'rgb(var(--primary-200) / <alpha-value>)',
          300: 'rgb(var(--primary-300) / <alpha-value>)',
          400: 'rgb(var(--primary-400) / <alpha-value>)',
          500: 'rgb(var(--primary-500) / <alpha-value>)',
          600: 'rgb(var(--primary-600) / <alpha-value>)',
          700: 'rgb(var(--primary-700) / <alpha-value>)',
          800: 'rgb(var(--primary-800) / <alpha-value>)',
          900: 'rgb(var(--primary-900) / <alpha-value>)',
        },
        'secondary': {
          50: 'rgb(var(--secondary-50) / <alpha-value>)', //main
          100: 'rgb(var(--secondary-100) / <alpha-value>)', //lighter
          150: 'rgb(var(--secondary-150) / <alpha-value>)', //darker
          200: 'rgb(var(--secondary-200) / <alpha-value>)', //200
        }
      }
    },
  },
  plugins: [],
};
