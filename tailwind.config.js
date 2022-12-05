/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/**/src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'light': '0 2px 5px 0 rgba(134, 134, 134, 0.2)',
      }
    },
  },
  plugins: [],
}
