import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: {
    compilationMode: 'annotation',
  },
  // Configure image domains to avoid invalid src prop error
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
  },
  // Silence Next.js 16 error about missing turbopack config when webpack config is present
  turbopack: {},
  webpack: (config, { dev, isServer }) => {
    // Prevent infinite loops in Cypress component testing by ignoring snapshot files
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/cypress/snapshots/**', '**/cypress/screenshots/**'],
      }
    }
    return config
  },
}

export default nextConfig
