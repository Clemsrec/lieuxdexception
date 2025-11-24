import { MetadataRoute } from 'next';

/**
 * Configuration robots.txt pour optimiser le crawl
 * Autorise tous les robots sauf sur /admin
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://lieuxdexception.fr';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/api/admin/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin', '/api/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
