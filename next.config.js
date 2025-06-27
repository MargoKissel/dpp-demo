/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // без этого Next.js не увидит папку app/
  },
}

export default nextConfig
