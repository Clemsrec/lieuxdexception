import { MetadataRoute } from 'next';

/**
 * Configuration robots.txt pour optimiser le crawl
 * Autorise tous les robots sauf sur /admin
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://lieuxdexception.com';
  
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/api/admin/', '/api/analytics/', '/api/leads/'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/admin'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin', '/api/admin/', '/api/analytics/', '/api/leads/'],
        crawlDelay: 1,
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/admin/',
          '/api/analytics/',
          '/api/leads/',
          '/api/fcm/',
          '/_next/static/',
        ],
        crawlDelay: 2,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
