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
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration  
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Enable standalone output for Docker
  output: 'standalone',
};

module.exports = nextConfig;