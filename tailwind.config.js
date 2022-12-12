/** @type {import('tailwindcss').Config} */

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
        light: '0 2px 5px 0 rgba(134, 134, 134, 0.2)',
      },
      flexGrow: {
        2: 2,
        3: 3,
      },
    },
  },
  plugins: [],
};
