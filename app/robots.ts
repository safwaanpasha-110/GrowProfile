import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/pricing', '/faq', '/privacy', '/terms', '/favicon.ico', '/favicon.png', '/apple-touch-icon.png', '/og-image.png'],
        disallow: [
          '/dashboard/',
          '/admin/',
          '/auth/',
          '/api/',
          '/data-deletion',
        ],
      },
    ],
    sitemap: 'https://growprofile.app/sitemap.xml',
    host: 'https://growprofile.app',
  }
}
