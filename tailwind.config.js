/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './apps/**/src/**/*.{html,ts}',
    './libs/safe/**/*.{html,ts,js,mjs}',
    './libs/ui/**/*.{html,ts,js,mjs}',
  ],
  theme: {
    extend: {
      boxShadow: {
        '2lg': '0 2px 5px 0 rgba(134, 134, 134, 0.2)',
      },
      colors: {
        primary: {
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
        secondary: {
          50: 'rgb(var(--secondary-50) / <alpha-value>)', //main
          100: 'rgb(var(--secondary-100) / <alpha-value>)', //lighter
          150: 'rgb(var(--secondary-150) / <alpha-value>)', //darker
          200: 'rgb(var(--secondary-200) / <alpha-value>)', //200
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s forwards',
        fadeOut: 'fadeOut 0.1s forwards',
      },
    },
    fontFamily: {
      'system-ui': ['Roboto', 'Helvetica Neue', 'sans-serif'],
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes
    }),
  ],
};
