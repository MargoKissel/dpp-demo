/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",        // все страницы App Router
    "./src/app/**/*.{js,ts,jsx,tsx}",     // если у тебя структура /src/app
    "./components/**/*.{js,ts,jsx,tsx}",  // все компоненты
    "./lib/**/*.{js,ts}",                 // утилиты (fetchProduct и т.д.)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
