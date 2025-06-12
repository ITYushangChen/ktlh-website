/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#086c7b',
        'primary-light': '#0a8a9d',
        'primary-dark': '#065562',
      },
    },
  },
  plugins: [],
} 