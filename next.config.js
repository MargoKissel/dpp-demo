/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['raw.githubusercontent.com', 'res.cloudinary.com', 'drive.google.com'],
  },
};
export default nextConfig;
