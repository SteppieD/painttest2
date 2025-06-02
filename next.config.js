/** @type {import('next').NextConfig} */
const nextConfig = {
  // Replit-optimized configuration
  env: {
    // Replit environment variables
    REPLIT: process.env.REPLIT || 'true',
    REPL_SLUG: process.env.REPL_SLUG || '',
    REPL_OWNER: process.env.REPL_OWNER || '',
    NEXT_TELEMETRY_DISABLED: '1',
  },
  
  // Images configuration for Replit
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'placehold.co',
      'replit.com',
      '*.replit.com',
    ],
  },
  
  // Disable PWA for Replit (causes issues with hot reload)
  swcMinify: true,
  
  // Replit-specific webpack config
  webpack: (config, { dev, isServer }) => {
    // Better SQLite3 configuration for Replit
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    // Externalize better-sqlite3 for server-side
    if (isServer) {
      config.externals.push('better-sqlite3');
    }
    
    return config;
  },
  
  // Experimental features for Replit compatibility
  experimental: {
    appDir: true, // Your preference from original config
    serverComponentsExternalPackages: ['better-sqlite3'],
    outputFileTracingRoot: process.cwd(),
  },
  
  // Output configuration for Replit
  output: 'standalone',
  
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