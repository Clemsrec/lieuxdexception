/**
 * SmartSEO - Composant SEO intelligent avec génération automatique
 * 
 * Génère automatiquement des métadonnées optimisées selon le contexte
 * Intègre structured data, E-E-A-T et optimisations IA
 */

'use client';

import { usePathname } from 'next/navigation';
import { universalSEOConfig, type SiteType, type PageType } from '@/config/seo.config';
import { generateUniversalStructuredData, generateFAQSchema } from '@/lib/universalStructuredData';

// ============================================================================
// TYPES
// ============================================================================

interface SmartSEOProps {
  pageType: PageType;
  siteType?: SiteType;
  data?: any;
  customMeta?: {
    title?: string;
    description?: string;
    keywords?: string[];
    canonical?: string;
    image?: string;
  };
}

// ============================================================================
// FONCTION DE GÉNÉRATION INTELLIGENTE DES MÉTADONNÉES
// ============================================================================

function generateSmartMeta(pageType: PageType, data?: any) {
  const config = universalSEOConfig;
  const template = config.metaTemplates[pageType];
  
  if (!template) {
    return {
      title: "Lieux d'Exception - Groupe Riou",
      description: config.business.expertise.primary,
      keywords: config.keywords.corporate.primary
    };
  }

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
  let title = template.titlePattern;
  let description = template.descriptionPattern;

  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    title = title.replace(placeholder, value);
    description = description.replace(placeholder, value);
  });

  // Construire les keywords selon le focus
  const keywordsFocus = template.keywordsFocus;
  const keywords: string[] = [];
  
  keywordsFocus.forEach(focus => {
    const categoryKeywords = config.keywords.corporate[focus as keyof typeof config.keywords.corporate];
    if (Array.isArray(categoryKeywords)) {
      keywords.push(...categoryKeywords.slice(0, 3));
    }
  });

  return {
    title,
    description,
    keywords
  };
}

// ============================================================================
// COMPOSANT SMARTSEO
// ============================================================================

export default function SmartSEO({
  pageType,
  siteType = 'corporate',
  data,
  customMeta
}: SmartSEOProps) {
  const pathname = usePathname();
  const config = universalSEOConfig;

  // Génération automatique des métadonnées
  const autoMeta = generateSmartMeta(pageType, data);
  
  // Merge avec custom meta
  const meta = {
    title: customMeta?.title || autoMeta.title,
    description: customMeta?.description || autoMeta.description,
    keywords: customMeta?.keywords || autoMeta.keywords,
    canonical: customMeta?.canonical || `https://lieuxdexception.fr${pathname}`,
    image: customMeta?.image || '/images/Vue-chateau.jpg'
  };

  // Génération structured data
  const structuredData = generateUniversalStructuredData({
    siteType,
    pageType,
    data,
    url: meta.canonical
  });

  // Génération FAQ schema
  const faqSchema = generateFAQSchema(pageType);

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords.join(', ')} />
      
      {/* Canonical */}
      <link rel="canonical" href={meta.canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Lieux d'Exception" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />

      {/* Géolocalisation */}
      <meta name="geo.region" content="FR-44" />
      <meta name="geo.placename" content={config.business.localSEO.primaryCity} />
      <meta name="geo.position" content={`${config.business.localSEO.coordinates.lat};${config.business.localSEO.coordinates.lng}`} />
      <meta name="ICBM" content={`${config.business.localSEO.coordinates.lat}, ${config.business.localSEO.coordinates.lng}`} />

      {/* Business Local */}
      <meta name="business:contact_data:locality" content={config.business.localSEO.primaryCity} />
      <meta name="business:contact_data:region" content={config.business.localSEO.region} />
      <meta name="business:contact_data:phone_number" content={config.business.contact.phone} />
      <meta name="business:contact_data:email" content={config.business.contact.email} />

      {/* E-E-A-T Signals (pour IA) */}
      <meta name="expertise" content={config.ai.expertise.domain} />
      <meta name="experience" content={config.ai.experience.years} />
      <meta name="authoritativeness" content={config.ai.authoritativeness.officialStatus} />
      <meta name="trustworthiness" content={config.ai.trustworthiness.transparency.join(', ')} />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}

// ============================================================================
// EXPORT
// ============================================================================

export { SmartSEO };
