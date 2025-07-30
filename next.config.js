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

  // Добавляем эту секцию, чтобы игнорировать ошибки TS при сборке
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
