/**
 * Générateurs Structured Data Universels - Lieux d'Exception
 * 
 * Génération automatique de Schema.org selon type de site et page
 * Optimisé pour Google Rich Results, SGE, ChatGPT, Claude
 */

import { universalSEOConfig, type SiteType, type PageType } from '@/config/seo.config';
import type { Venue } from '@/types/firebase';
import { displayVenueName } from '@/lib/formatVenueName';

// ============================================================================
// TYPES
// ============================================================================

interface StructuredDataGeneratorParams {
  siteType: SiteType;
  pageType: PageType;
  data?: any;
  url?: string;
}

// ============================================================================
// GÉNÉRATEURS PAR TYPE DE SITE
// ============================================================================

const structuredDataGenerators = {
  corporate: {
    homepage: generateCorporateOrganization,
    venue: generateVenueStructuredData,
    service: generateServiceStructuredData,
    contact: generateContactStructuredData,
    about: generateAboutStructuredData,
    // catalogue: generateCatalogueStructuredData - SUPPRIMÉ (page catalogue supprimée)
  },
  // Autres types extensibles (ecommerce, blog, etc.)
};

// ============================================================================
// ORGANIZATION SCHEMA (Page d'accueil)
// ============================================================================

function generateCorporateOrganization(data?: any) {
  const config = universalSEOConfig;
  
  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "name": "Lieux d'Exception",
    "description": config.business.expertise.primary,
    "url": "https://lieuxdexception.fr",
    
    // Localisation
    "address": {
      "@type": "PostalAddress",
      "addressRegion": config.business.localSEO.region,
      "addressCountry": "FR"
    },
    
    // Coordonnées
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": config.business.localSEO.coordinates.lat,
      "longitude": config.business.localSEO.coordinates.lng
    },
    
    // Contact
    "telephone": config.business.contact.phone,
    "email": config.business.contact.email,
    
    // Services offerts
    "makesOffer": config.business.services.map(service => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": service.name,
        "description": service.description
      }
    })),
    
    // Expertise et expérience (E-E-A-T)
    "knowsAbout": config.ai.expertise.specializations,
    
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "50",
      "bestRating": "5"
    },
    
    // Certifications et reconnaissance
    "award": config.ai.expertise.credentials,
    
    // Horaires
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  };
}

// ============================================================================
// VENUE SCHEMA (Page lieu spécifique)
// ============================================================================

function generateVenueStructuredData(data?: { venue: Venue }) {
  if (!data?.venue) return null;
  
  const venue = data.venue;
  const config = universalSEOConfig;
  
  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "name": displayVenueName(venue.name),
    "description": venue.description,
    "url": `https://lieuxdexception.fr/lieux/${venue.slug}`,
    
    // Localisation précise
    "address": {
      "@type": "PostalAddress",
      "streetAddress": venue.address?.street || "Adresse à compléter",
      "addressLocality": venue.address?.city,
      "postalCode": venue.address?.postalCode,
      "addressRegion": venue.address?.region,
      "addressCountry": "FR"
    },
    
    // Image principale
    "image": venue.images?.hero || "/images/Vue-chateau.jpg",
    
    // Capacité
    "maximumAttendeeCapacity": venue.capacity?.max || 300,
    
    // Équipements
    "amenityFeature": venue.amenitiesList?.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })) || [],
    
    // Prix (si disponible)
    ...(venue.pricing?.b2b?.fullDay && {
      "priceRange": `À partir de ${venue.pricing.b2b.fullDay}€`,
    }),
    
    // Contact
    "telephone": config.business.contact.phone,
    
    // Note
    ...(venue.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": venue.rating.toString(),
        "bestRating": "5"
      }
    })
  };
}

// ============================================================================
// SERVICE SCHEMA (Page service)
// ============================================================================

function generateServiceStructuredData(data?: any) {
  const serviceName = data?.name || "Organisation d'événements";
  const config = universalSEOConfig;
  
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": serviceName,
    "provider": {
      "@type": "Organization",
      "name": "Lieux d'Exception",
      "telephone": config.business.contact.phone,
      "email": config.business.contact.email
    },
    "areaServed": {
      "@type": "State",
      "name": config.business.localSEO.region
    },
    "offers": {
      "@type": "Offer",
      "description": data?.description || "Devis personnalisé gratuit",
      "availability": "https://schema.org/InStock"
    }
  };
}

// ============================================================================
// CONTACT SCHEMA (Page contact)
// ============================================================================

function generateContactStructuredData(data?: any) {
  const config = universalSEOConfig;
  
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Lieux d'Exception",
    "description": "Contactez-nous pour votre projet événement en Loire-Atlantique",
    "mainEntity": {
      "@type": "Organization",
      "name": "Lieux d'Exception",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": config.business.contact.phone,
        "email": config.business.contact.email,
        "contactType": "Customer Service",
        "availableLanguage": "French",
        "areaServed": "FR",
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      }
    }
  };
}

// ============================================================================
// ABOUT SCHEMA (Page à propos)
// ============================================================================

function generateAboutStructuredData(data?: any) {
  const config = universalSEOConfig;
  
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "À Propos - Lieux d'Exception",
    "description": config.business.expertise.primary,
    "mainEntity": {
      "@type": "Organization",
      "name": "Lieux d'Exception",
      "foundingDate": "1995",
      "description": config.business.expertise.primary,
      "knowsAbout": config.ai.expertise.specializations,
      "award": config.ai.expertise.credentials
    }
  };
}

// ============================================================================
// ⚠️ CATALOGUE SCHEMA SUPPRIMÉ
// ============================================================================
// La page catalogue a été supprimée, cette fonction n'est plus nécessaire
// function generateCatalogueStructuredData() { ... } - SUPPRIMÉ

// ============================================================================
// FAQ SCHEMA GENERATOR
// ============================================================================

export function generateFAQSchema(pageType: PageType) {
  const faqs = universalSEOConfig.faqByPageType[pageType] || [];
  
  if (faqs.length === 0) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// ============================================================================
// BREADCRUMB SCHEMA GENERATOR
// ============================================================================

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// ============================================================================
// FONCTION PRINCIPALE - GÉNÉRATEUR UNIVERSEL
// ============================================================================

export function generateUniversalStructuredData(params: StructuredDataGeneratorParams) {
  const { siteType, pageType, data, url } = params;
  
  // Sélectionner le générateur approprié
  const generators: any = structuredDataGenerators;
  const generator = generators[siteType]?.[pageType];
  
  if (!generator) {
    console.warn(`No structured data generator for ${siteType}/${pageType}`);
    return null;
  }
  
  // Générer le structured data
  const structuredData = generator(data);
  
  // Ajouter l'URL si fournie
  if (structuredData && url) {
    structuredData.url = url;
  }
  
  return structuredData;
}

// ============================================================================
// EXPORTS
// ============================================================================

const universalStructuredDataExports = {
  generateUniversalStructuredData,
  generateFAQSchema,
  generateBreadcrumbSchema
};

export default universalStructuredDataExports;
