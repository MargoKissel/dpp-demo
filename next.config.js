/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ⬇️ Отключаем падение билда от TS
  typescript: {
    ignoreBuildErrors: true,
  },

  // ⬇️ И от ESLint‑предупреждений
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
