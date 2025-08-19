/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'backend:8000'],
    },
    optimizePackageImports: ['@headlessui/react', 'lucide-react'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // During container builds, Next runs ESLint with its own config.
  // Remove deprecated options from project ESLint config or skip lint during build if needed.
  eslint: {
    // Set to true if your CI must build even with lint issues or old options:
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['localhost', 'backend'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },
};

module.exports = nextConfig;
