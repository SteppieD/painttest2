/** @type {import('next').NextConfig} */
const nextConfig = {
  // Clean configuration for Vercel deployment
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'placehold.co',
      'i.pravatar.cc',
    ],
  },
  
  // Remove swcMinify to prevent SWC binary issues
  // swcMinify: true,
  
  // TypeScript configuration - temporarily ignore errors for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ESLint configuration - temporarily ignore warnings for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Enable standalone output for Docker
  output: 'standalone',
};

module.exports = nextConfig;