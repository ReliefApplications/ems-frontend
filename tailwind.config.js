/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/**/src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        'darkgray': '#A9A9A9',
      },
    },
  },
  plugins: [],
}
