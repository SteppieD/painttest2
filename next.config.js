/** @type {import('next').NextConfig} */
const nextConfig = {
  // Clean configuration for Vercel deployment
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'placehold.co',
    ],
  },
  
  // Vercel-optimized settings
  swcMinify: true,
  
  // Type checking configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;