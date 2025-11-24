import { MetadataRoute } from 'next';
import { getVenues } from '@/lib/firestore';

/**
 * Génération dynamique du sitemap.xml
 * Inclut toutes les pages statiques + lieux dynamiques depuis Firestore
 * 
 * @returns {Promise<MetadataRoute.Sitemap>} Configuration du sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://lieuxdexception.fr';
  
  // Récupérer tous les lieux actifs pour URLs dynamiques
  const venues = await getVenues({ featured: true });
  
  // Pages statiques principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/mariages`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/evenements-b2b`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/catalogue`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cgv`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/confidentialite`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Pages dynamiques (lieux)
  const venuePages: MetadataRoute.Sitemap = venues.map((venue) => ({
    url: `${baseUrl}/lieux/${venue.slug}`,
    lastModified: venue.updatedAt instanceof Date 
      ? venue.updatedAt 
      : venue.updatedAt?.toDate?.() || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Fusionner et retourner
  return [...staticPages, ...venuePages];
}
