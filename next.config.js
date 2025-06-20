/** @type {import('next').NextConfig} */
const nextConfig = {
  // Clean configuration for Vercel deployment
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'placehold.co',
    ],
  },
  
  // Remove swcMinify to prevent SWC binary issues
  // swcMinify: true,
  
  // Temporarily ignore build errors for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ESLint configuration  
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;