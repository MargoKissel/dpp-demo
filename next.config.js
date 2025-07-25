/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Позволяет собирать даже если есть ошибки TS
    ignoreBuildErrors: true,
  },
}

export default nextConfig
