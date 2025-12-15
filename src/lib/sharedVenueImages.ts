// Liste centralisée des 4 photos à utiliser pour tous les lieux
export const SHARED_VENUE_IMAGES = [
  '/images/Vue-chateau.jpg',
  '/images/salle-seminaire.jpg',
  '/images/salle-seminaire2.jpg',
  '/images/table-seminaire.jpg'
];

/** Retourne les 4 images (galerie) */
export function getGalleryImages(): string[] {
  return SHARED_VENUE_IMAGES;
}

/**
 * Choisit une image parmi les 4 en fonction de l'identifiant du lieu
 * pour avoir une répartition visuelle cohérente.
 */
export function getCardImage(identifier?: string): string {
  if (!identifier) return SHARED_VENUE_IMAGES[0];
  let sum = 0;
  for (let i = 0; i < identifier.length; i++) sum += identifier.charCodeAt(i);
  const idx = sum % SHARED_VENUE_IMAGES.length;
  return SHARED_VENUE_IMAGES[idx];
}

/** Image utilisée pour les miniatures sur la carte */
export function getMapThumbnail(identifier?: string): string {
  return getCardImage(identifier);
}
