const tailwind = require('@tailwindcss/postcss')  // 👈

module.exports = {
  plugins: {
    [tailwind]: {},        // 👈
    autoprefixer: {},
  },
};
