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
  
  // Experimental features to improve build performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', '@/components/ui'],
    // Enable partial prerendering for better performance
    // ppr: true, // Disabled - only available in canary builds
  },
  
  // Static generation timeout (in seconds)
  staticPageGenerationTimeout: 120,
};

module.exports = nextConfig;