/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
}

module.exports = nextConfig