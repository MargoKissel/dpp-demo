/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // сканировать файлы app‑router и компоненты
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
