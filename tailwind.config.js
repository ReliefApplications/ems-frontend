/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './apps/**/src/**/*.{html,ts}',
    './libs/shared/**/*.{html,ts,js,mjs}',
    './libs/ui/**/*.{html,ts,js,mjs}',
  ],
  theme: {
    extend: {
      boxShadow: {
        '2xs': '0 4px 6px 0 rgba(48, 64, 141, 0.01)',
        xs: '0px -8px 16px 0px rgba(48, 64, 141, 0.06)',
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
        light: {
          50: '#F7F9FD',
          75: '#E7EDF9',
          100: '#EFF3FB',
          200: '#858B99',
        },
        neutral: {
          850: '#212121',
          450: '#B8B8B8',
          350: '#C2C2C2',
        },
        green: {
          550: '#37B400',
          650: '#2B8A00',
        },
        red: {
          550: '#FF4C4C',
          650: '#E04343',
        },
        yellow: {
          550: '#FFC000',
          650: '#FFA500',
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
      'system-ui': ['Lato', 'Helvetica Neue', 'sans-serif'],
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes
    }),
  ],
};
