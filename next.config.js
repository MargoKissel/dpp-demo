/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // для внешнего рендеринга (Google Drive)
    domains: [
      'drive.google.com',
      'lh3.googleusercontent.com'
    ],
    // оставьте unoptimized, если не хотите настраивать loader
    unoptimized: true,
  },
}

export default nextConfig
