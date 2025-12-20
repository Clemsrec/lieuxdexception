/**
 * Configuration des Assets depuis Firebase Storage
 * 
 * Ce fichier centralise toutes les URLs des assets (logos, images système)
 * stockés dans Firebase Storage au lieu du dossier public/.
 * 
 * Avantages :
 * - Modification des assets sans redéploiement
 * - Optimisation automatique des images
 * - Gestion centralisée
 * - Version CDN automatique
 * 
 * Cache-busting : v=20251220 pour forcer le rafraîchissement après optimisation Lighthouse
 */

/**
 * URLs des logos depuis Firebase Storage
 */
export const STORAGE_LOGOS = {
  // Logo principal (blanc pour header) - Optimisé 112 KB → 17 KB
  mainWhite: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/logos%2Flogo-lieux-exception-blanc.png?alt=media&v=20251220',
  
  // Logo principal (couleur pour footer/autres)
  mainColor: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/logos%2Flogo-lieux-exception-couleur.png?alt=media&v=20251220',
  
  // Logo compact (pour mobile)
  compact: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/logos%2Flogo-compact.png?alt=media&v=20251220',
  
  // Logos des châteaux (blanc) - LIGHTHOUSE: 132 KB + 122 KB → 9 KB + 10 KB WebP (-92%)
  venues: {
    domeBlanc: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/logos%2Fvenues%2Fdome-blanc.webp?alt=media&v=20251220',
    domeDore: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/logos%2Fvenues%2Fdome-dore.png?alt=media&v=20251220',
    brulaireBlanc: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/logos%2Fvenues%2Fbrulaire-blanc.png?alt=media&v=20251220',
    brulaireDore: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/logos%2Fvenues%2Fbrulaire-dore.png?alt=media&v=20251220',
    domaineBlanc: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/logos%2Fvenues%2Fdomaine-blanc.webp?alt=media&v=20251220',
    domaineDore: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/logos%2Fvenues%2Fdomaine-dore.png?alt=media&v=20251220',
    boulaieBlanc: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/logos%2Fvenues%2Fboulaie-blanc.png?alt=media&v=20251220',
    boulaieDore: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/logos%2Fvenues%2Fboulaie-dore.png?alt=media&v=20251220',
  },
} as const;

/**
 * URLs des images système depuis Firebase Storage
 */
export const STORAGE_IMAGES = {
  // Images par défaut / placeholders
  placeholder: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/images%2Fplaceholder.jpg?alt=media',
  defaultVenue: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/images%2Fplaceholder.jpg?alt=media',
  
  // Images de fond pour sections
  contactHero: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/images%2Fcontact-hero.jpg?alt=media',
  
  // Images décoratives
  vueChateauGeneric: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/images%2FVue-chateau.jpg?alt=media',
  salleSeminaire: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/images%2Fsalle-seminaire.jpg?alt=media',
  salleSeminaire2: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/images%2Fsalle-seminaire2.jpg?alt=media',
  tableSeminaire: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/images%2Ftable-seminaire.jpg?alt=media',
  table: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/images%2Ftable.jpg?alt=media',
} as const;

/**
 * URLs des partenaires depuis Firebase Storage
 */
export const STORAGE_PARTNERS = {
  partner1: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/partners%2Fpartner-1.webp?alt=media',
  partner2: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/partners%2Fpartner-2.webp?alt=media',
  // ... autres partenaires
} as const;

/**
 * Helper pour obtenir une URL Storage avec fallback
 * @param storageUrl - URL Firebase Storage
 * @param fallbackPublicPath - Chemin de fallback dans /public si Storage indisponible
 * @returns URL à utiliser
 */
export function getAssetUrl(storageUrl: string, fallbackPublicPath?: string): string {
  // En dev, on peut forcer l'utilisation des assets locaux
  if (process.env.NEXT_PUBLIC_USE_LOCAL_ASSETS === 'true' && fallbackPublicPath) {
    return fallbackPublicPath;
  }
  
  return storageUrl;
}

/**
 * Helper pour obtenir le logo principal selon le contexte
 * @param variant - Variante du logo ('white' | 'color')
 * @returns URL du logo
 */
export function getMainLogo(variant: 'white' | 'color' = 'white'): string {
  return variant === 'white' ? STORAGE_LOGOS.mainWhite : STORAGE_LOGOS.mainColor;
}

/**
 * Type pour les variantes de logo
 */
export type LogoVariant = keyof typeof STORAGE_LOGOS;

/**
 * Type pour les images système
 */
export type SystemImage = keyof typeof STORAGE_IMAGES;

/**
 * Type pour les partenaires
 */
export type PartnerLogo = keyof typeof STORAGE_PARTNERS;
