/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  serverExternalPackages: ["bcryptjs"],
};

module.exports = nextConfig;