import type { Venue } from '@/types/firebase';

/**
 * Récupère l'image card pour un venue depuis ses données Firestore
 * Utilise l'ordre de priorité: cardImage -> heroImage -> hero -> image
 */
export function getCardImage(venue: Venue | string): string {
  // Si string, c'est un identifiant → fallback sur placeholder
  if (typeof venue === 'string') {
    return '/images/Vue-chateau.jpg';
  }
  
  // Si objet Venue, utiliser les vraies images
  return venue.images?.cardImage 
    || venue.images?.heroImage 
    || venue.images?.hero 
    || venue.heroImage 
    || venue.image 
    || '/images/Vue-chateau.jpg';
}

/** 
 * Récupère les images de galerie depuis Firestore
 */
export function getGalleryImages(venue: Venue): string[] {
  if (venue.images?.gallery && venue.images.gallery.length > 0) {
    return venue.images.gallery;
  }
  if (venue.gallery && venue.gallery.length > 0) {
    return venue.gallery;
  }
  // Fallback si pas d'images
  return ['/images/Vue-chateau.jpg'];
}

/** Image utilisée pour les miniatures sur la carte */
export function getMapThumbnail(venue: Venue | string): string {
  return getCardImage(venue);
}
