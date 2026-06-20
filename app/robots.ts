// filepath: /Users/denis/Documents/GitHub/memento/app/robots.ts
import type { MetadataRoute } from 'next'

// Function to dynamically generate robots.txt content
export default function generateRobots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://memento-mori.vercel.app/sitemap.xml',
  }
}
