import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

/**
 * Types Firebase pour Lieux d'Exception
 * Base de données Firestore: lieuxdexception
 */

export interface FirebaseUser extends User {}

/**
 * Espace détaillé avec superficie
 */
export interface DetailedSpace {
  name: string;
  size: number;
  unit: string; // "m²"
}

/**
 * Capacités détaillées par configuration
 */
export interface CapacityDetails {
  meeting?: number;
  uShape?: number;
  theater?: number;
  cabaret?: number;
  classroom?: number;
  banquet?: number;
  cocktail?: number;
  cocktailPark?: number; // Pour grands espaces extérieurs (ex: Château Corbe 5000 pers.)
}

/**
 * Profil utilisateur admin
 */
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'manager' | 'viewer';
  permissions: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Structure d'un lieu d'exception
 * Collection Firestore: venues
 */
export interface Venue {
  id: string;
  name: string;
  slug: string; // URL-friendly name
  description: string;
  shortDescription: string;
  tagline?: string; // Phrase d'accroche
  experienceText?: string; // Texte d'expérience client
  
  // Localisation
  address: {
    street: string;
    city: string;
    postalCode: string;
    region: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  
  // Coordonnées simplifiées pour compatibilité (raccourci)
  lat: number;
  lng: number;
  location: string; // Format: "Loire-Atlantique (44)"
  region?: string; // Région simplifiée
  
  // Capacités
  capacity: {
    min: number;
    max: number;
    cocktail?: number;
    seated?: number;
    theater?: number;
    classroom?: number;
  };
  
  // Capacité simplifiée pour compatibilité (valeur maximale)
  capacitySeated?: number;
  capacityStanding?: number;
  capacityMin?: number;
  
  // Types d'événements supportés
  eventTypes: Array<'conference' | 'seminar' | 'wedding' | 'reception' | 'corporate' | 'gala'>;
  
  // Tarification
  pricing: {
    b2b: {
      halfDay: number;
      fullDay: number;
      evening: number;
    };
    wedding: {
      reception: number;
      ceremony: number;
      weekend: number;
    };
    currency: 'EUR';
  };
  
  // Structure alternative pour compatibilité avec fonctionnalites.md
  priceRange?: {
    min: number;
    max: number;
    currency: 'EUR';
  };
  
  // Médias
  images: {
    hero: string; // Image principale
    heroImage?: string; // Image hero paysage pour homepage carousel
    cardImage?: string; // Image pour les cards du catalogue (thumbnail optimisé)
    gallery: string[]; // Galerie d'images complète
    virtual360?: string; // Visite virtuelle
  };
  
  // Format simplifié pour compatibilité
  image?: string; // Image principale (raccourci pour images.hero)
  heroImage?: string; // Raccourci pour images.heroImage
  cardImage?: string; // Raccourci pour images.cardImage
  gallery?: string[]; // Raccourci pour images.gallery
  
  // Services et équipements
  amenities: {
    audioVisual: boolean;
    wifi: boolean;
    parking: boolean;
    catering: boolean;
    accommodation: boolean;
    accessibility: boolean;
  };
  
  // Informations additionnelles
  spaces?: string[]; // Liste des espaces disponibles
  amenitiesList?: string[]; // Liste textuelle des équipements pour affichage
  
  // Équipements détaillés pour compatibilité
  accommodation?: boolean;
  accommodationRooms?: number;
  accommodationDetails?: string; // Ex: "15 chambres dont 8 twin"
  catering?: boolean;
  parking?: number; // Nombre de places
  parkingSpaces?: number; // Nombre de places (alias)
  audioVisual?: boolean;
  wifi?: boolean;
  accessibility?: boolean;
  
  // Nouvelles données enrichies (depuis fichiers markdown)
  rooms?: number; // Nombre de salles
  detailedSpaces?: DetailedSpace[]; // Espaces avec superficies
  capacityDetails?: CapacityDetails; // Capacités par configuration
  equipment?: string[]; // Équipements techniques
  activities?: string[]; // Activités proposées
  services?: string[]; // Services disponibles
  displayStatus?: 'Nouveau' | 'Ouverture prochainement' | string; // Statut marketing du lieu
  privatizable?: boolean; // Privatisable ou non
  renovationDate?: string; // Date de rénovation (ex: "Mars 2025")
  totalSurfaceRooms?: number; // Surface totale des salons (m²)
  
  // Informations de contact
  contact: {
    phone: string;
    email: string;
    website?: string;
    manager: string;
    instagram?: string;
    mariagesNet?: string;
  };
  
  // Champs de contact simplifiés pour compatibilité
  email?: string;
  phone?: string;
  url?: string; // URL du site dédié du lieu
  websiteUrl?: string;
  externalUrl?: string; // URL du site externe du lieu (prioritaire pour les cards)
  
  // Métadonnées
  featured: boolean;
  status: 'active' | 'maintenance' | 'closed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Ordre d'affichage optionnel pour tri personnalisés
  displayOrder?: number;
  
  // SEO et multilingue
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  
  // Métriques SEO
  rating?: number; // Note moyenne (0-5)
  reviewsCount?: number; // Nombre d'avis
  
  // Traductions pour les 6 langues
  translations?: {
    [locale: string]: {
      name: string;
      description: string;
      shortDescription: string;
      seo: {
        title: string;
        description: string;
        keywords: string[];
      };
    };
  };
}

/**
 * Filtres pour la recherche de lieux
 */
export interface VenueFilters {
  eventType?: 'b2b' | 'wedding' | 'all';
  capacity?: {
    min?: number;
    max?: number;
  };
  region?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  amenities?: string[];
  availability?: {
    startDate?: Date;
    endDate?: Date;
  };
  featured?: boolean; // Filtrer par domaines mis en avant
}

/**
 * Lead généré par les formulaires
 * Collection Firestore: leads
 */
export interface Lead {
  id: string;
  type: 'b2b' | 'wedding' | 'contact';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  
  // Informations de contact
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    position?: string;
  };
  
  // Détails de l'événement
  event: {
    type: string;
    expectedDate?: Timestamp;
    alternativeDate?: Timestamp;
    guestCount: number;
    budget?: {
      min: number;
      max: number;
      currency: 'EUR';
    };
    description: string;
    venues?: string[]; // IDs des lieux souhaités
  };
  
  // Données spécifiques au type
  b2bData?: {
    companySize: string;
    eventFormat: 'conference' | 'seminar' | 'training' | 'teambuilding' | 'other';
    duration: 'half-day' | 'full-day' | 'multi-day';
    services: string[];
  };
  
  weddingData?: {
    weddingDate?: Timestamp;
    ceremonyType: 'religious' | 'civil' | 'symbolic';
    receptionStyle: 'seated' | 'cocktail' | 'buffet' | 'mixed';
    specialRequests: string[];
  };
  
  // Métadonnées
  source: 'website' | 'phone' | 'email' | 'referral';
  language: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Intégration Odoo
  odooId?: string;
  syncedToOdoo: boolean;
  lastSyncAt?: Timestamp;
}

/**
 * Configuration multilingue
 * Collection Firestore: i18n
 */
export interface I18nContent {
  id: string;
  locale: 'fr' | 'en' | 'es' | 'de' | 'it' | 'pt';
  namespace: string; // 'common', 'venue', 'form', etc.
  content: Record<string, string>;
  updatedAt: Timestamp;
}

/**
 * Statistiques et analytics
 * Collection Firestore: analytics
 */
export interface Analytics {
  id: string;
  date: string; // YYYY-MM-DD
  metrics: {
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    averageSessionDuration: number;
    conversions: {
      total: number;
      b2b: number;
      wedding: number;
      contact: number;
    };
  };
  sources: {
    direct: number;
    organic: number;
    social: number;
    referral: number;
    email: number;
  };
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  createdAt: Timestamp;
}