/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'drive.google.com',
      'lh3.googleusercontent.com'
    ],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true, // временно, можно убрать после refine
  },
};

export default nextConfig;
