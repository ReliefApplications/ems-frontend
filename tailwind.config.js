/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './projects/**/src/**/*.{html,ts}',
    './dist/safe/**/*.{html,ts,js,mjs}',
    './node_modules/safe/**/*.mjs',
  ],
  theme: {
    extend: {
      boxShadow: {
        light: '0 2px 5px 0 rgba(134, 134, 134, 0.2)',
        dark: '0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
