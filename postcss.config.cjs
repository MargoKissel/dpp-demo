// postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: {},   // ← теперь берётся прямо из пакета tailwindcss@3
    autoprefixer: {},
  },
};
