/**
 * generateSmartMetadata - Générateur de métadonnées pour Next.js 15
 * 
 * Génère les métadonnées optimisées SEO selon le type de page
 * Compatible avec l'export metadata de Next.js App Router
 */

import type { Metadata } from 'next';
import { universalSEOConfig, type PageType } from '@/config/seo.config';

interface SmartMetadataParams {
  pageType: PageType;
  data?: any;
  customMeta?: {
    title?: string;
    description?: string;
    keywords?: string[];
    canonical?: string;
    image?: string;
  };
}

/**
 * Génère automatiquement les métadonnées selon le contexte
 */
export function generateSmartMetadata(params: SmartMetadataParams): Metadata {
  const { pageType, data, customMeta } = params;
  const config = universalSEOConfig;
  const template = config.metaTemplates[pageType];

  // Variables de remplacement
  const variables = {
    'business.name': 'Lieux d\'Exception',
    'business.venues': '5',
    'business.experience': config.business.expertise.experience,
    'business.years': '25+',
    'region': config.business.localSEO.region,
    'venue.name': data?.venue?.name || '',
    'venue.type': data?.venue?.eventTypes?.[0] || 'Lieu',
    'venue.city': data?.venue?.address?.city || '',
    'venue.capacity': data?.venue?.capacity?.max || '300',
    'venue.description': data?.venue?.description || '',
    'venue.features': data?.venue?.amenitiesList?.slice(0, 3).join(', ') || '',
    'service.name': data?.name || '',
    'service.description': data?.description || '',
    'service.benefits': data?.benefits?.[0] || '',
    'contact.phone': config.business.contact.phone
  };

  // Remplacer les variables dans le template
  let title = template?.titlePattern || "{business.name} | {region}";
  let description = template?.descriptionPattern || config.business.expertise.primary;

  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    title = title.replace(placeholder, value);
    description = description.replace(placeholder, value);
  });

  // Construire les keywords
  const keywordsFocus = template?.keywordsFocus || ['primary'];
  const keywords: string[] = [];
  
  keywordsFocus.forEach(focus => {
    const categoryKeywords = config.keywords.corporate[focus as keyof typeof config.keywords.corporate];
    if (Array.isArray(categoryKeywords)) {
      keywords.push(...categoryKeywords.slice(0, 5));
    }
  });

  // Merge avec custom meta
  const finalTitle = customMeta?.title || title;
  const finalDescription = customMeta?.description || description;
  const finalKeywords = customMeta?.keywords || keywords;
  const finalImage = customMeta?.image || 'https://lieuxdexception.fr/images/Vue-chateau.jpg';

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    authors: [{ name: 'Lieux d\'Exception' }],
    creator: 'Lieux d\'Exception',
    publisher: 'Lieux d\'Exception',
    
    // Open Graph
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: customMeta?.canonical,
      siteName: 'Lieux d\'Exception',
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
      locale: 'fr_FR',
      type: 'website',
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [finalImage],
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Alternate
    ...(customMeta?.canonical && {
      alternates: {
        canonical: customMeta.canonical,
      },
    }),
  };
}

/**
 * Génère les métadonnées pour la page d'accueil
 */
export function generateHomeMetadata(): Metadata {
  return generateSmartMetadata({
    pageType: 'homepage',
    customMeta: {
      canonical: 'https://lieuxdexception.fr',
    },
  });
}

/**
 * Génère les métadonnées pour une page venue
 */
export function generateVenueMetadata(venue: any): Metadata {
  return generateSmartMetadata({
    pageType: 'venue',
    data: { venue },
    customMeta: {
      canonical: `https://lieuxdexception.fr/lieux/${venue.slug}`,
    },
  });
}

/**
 * Génère les métadonnées pour une page service
 */
export function generateServiceMetadata(serviceName: string, serviceDescription: string): Metadata {
  return generateSmartMetadata({
    pageType: 'service',
    data: {
      name: serviceName,
      description: serviceDescription,
    },
  });
}

/**
 * Génère les métadonnées pour la page contact
 */
export function generateContactMetadata(): Metadata {
  return generateSmartMetadata({
    pageType: 'contact',
    customMeta: {
      canonical: 'https://lieuxdexception.fr/contact',
    },
  });
}

// ⚠️ FONCTION SUPPRIMÉE : generateCatalogueMetadata
// La page catalogue a été supprimée, cette fonction n'est plus nécessaire
