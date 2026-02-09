/**
 * Helper pour extraire les images de galerie par catégorie depuis Firestore
 * Remplace l'ancien système basé sur le filesystem
 */

import type { Venue } from '@/types/firebase';

/**
 * Extrait les images mariages depuis venue.images.gallery
 * Retourne toutes les images de galerie car les lieux reçoivent mariages ET B2B
 * Note: Historiquement, seul Le Dôme avait des images dans /mariages/,
 * les autres lieux utilisent /b2b/ pour leurs deux types d'événements
 */
export function getMariageImagesFromVenue(venue: Venue): string[] {
  if (!venue.images?.gallery) return [];
  
  // Retourner toutes les images de galerie (utilisables pour mariages et B2B)
  return venue.images.gallery;
}

/**
 * Extrait les images B2B depuis venue.images.gallery
 * Filtre les images du dossier /b2b/
 */
export function getB2BImagesFromVenue(venue: Venue): string[] {
  if (!venue.images?.gallery) return [];
  
  // Filtrer les images contenant '/b2b/' dans l'URL
  return venue.images.gallery.filter(url => url.includes('/b2b/'));
}

/**
 * Randomise un tableau et retourne un nombre limité d'éléments
 */
export function getRandomImages<T>(images: T[], count: number = 6): T[] {
  if (!images || images.length === 0) return [];
  
  // Fisher-Yates shuffle
  const shuffled = [...images];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, count);
}
