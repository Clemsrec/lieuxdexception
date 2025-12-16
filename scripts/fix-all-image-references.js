#!/usr/bin/env node

/**
 * Script pour mettre à jour TOUTES les références d'images dans le projet
 * Remplace les anciennes URLs hardcodées par des images dynamiques de Firestore
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Recherche de toutes les références d\'images hardcodées...\n');

// Mapping des anciennes images vers les nouvelles images hero
const VENUE_SLUG_MAP = {
  'chateau-de-la-brulaire': 'chateau-brulaire',
  'chateau-de-la-corbe': 'chateau-corbe',
  'domaine-nantais': 'domaine-nantais',
  'le-dome': 'le-dome',
  'manoir-de-la-boulaie': 'manoir-boulaie'
};

// Fichiers à modifier avec leurs remplacements
const updates = [
  // =========== Pages avec images hardcodées ===========
  {
    file: 'src/app/[locale]/evenements-b2b/page.tsx',
    replacements: [
      {
        old: 'src="/venues/manoir-de-la-boulaie/photo-2025-11-17-12-04-49-7-24.webp"',
        new: 'src="/venues/manoir-boulaie/b2b/boulaie_b2b_1.jpg"'
      },
      {
        old: 'src="/venues/chateau-de-la-brulaire/le-1825-la-table-domaine-de-la-brulaire-00008-08.webp"',
        new: 'src="/venues/chateau-brulaire/b2b/brulaire_b2b_1.jpg"'
      },
      {
        old: 'src="/venues/domaine-nantais/photo-2025-11-17-12-08-54-2-04.webp"',
        new: 'src="/venues/domaine-nantais/b2b/nantais_b2b_1.jpg"'
      },
      {
        old: 'src="/venues/le-dome/whatsapp-image-2025-11-05-at-12-03-12-04.webp"',
        new: 'src="/venues/le-dome/mariages/dome_mariage_1.jpg"'
      }
    ]
  },
  {
    file: 'src/app/[locale]/mariages/page.tsx',
    replacements: [
      {
        old: 'src="/venues/chateau-de-la-brulaire/ef0dc0f1-274d-49f6-bdf8-abd123a8eaa2-01.webp"',
        new: 'src="/venues/chateau-brulaire/mariages/brulaire_mariage_1.jpg"'
      },
      {
        old: 'src="/venues/manoir-de-la-boulaie/image-17-nov-2025-18-29-07-01.webp"',
        new: 'src="/venues/manoir-boulaie/mariages/boulaie_mariage_1.jpg"'
      },
      {
        old: 'src="/venues/chateau-de-la-corbe/photo-2025-11-13-18-49-13-3-01.webp"',
        new: 'src="/venues/chateau-corbe/mariages/corbe_mariage_1.jpg"'
      },
      {
        old: 'src="/venues/domaine-nantais/image-17-nov-2025-19-34-28-01.webp"',
        new: 'src="/venues/domaine-nantais/mariages/nantais_mariage_1.jpg"'
      },
      {
        old: 'src="/venues/le-dome/whatsapp-image-2025-11-05-at-12-03-07-1-01.webp"',
        new: 'src="/venues/le-dome/mariages/dome_mariage_1.jpg"'
      },
      {
        old: 'src="/venues/chateau-de-la-brulaire/img-0079-02.webp"',
        new: 'src="/venues/chateau-brulaire/mariages/brulaire_mariage_2.jpg"'
      }
    ]
  },
  
  // =========== Fonction getCardImage ===========
  {
    file: 'src/lib/sharedVenueImages.ts',
    replacements: [
      {
        old: `// Liste centralisée des 4 photos à utiliser pour tous les lieux
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
}`,
        new: `import type { Venue } from '@/types/firebase';

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
}`
      }
    ]
  },
  
  // =========== Mise à jour du composant HomeClient ===========
  {
    file: 'src/components/HomeClient.tsx',
    replacements: [
      {
        old: `import { getCardImage } from '@/lib/sharedVenueImages';`,
        new: `import { getCardImage } from '@/lib/sharedVenueImages';`
      },
      {
        old: `src={getCardImage(venue.id || venue.slug)}`,
        new: `src={getCardImage(venue)}`
      }
    ]
  }
];

// Exécution des mises à jour
let totalUpdates = 0;
let filesUpdated = 0;

for (const { file, replacements } of updates) {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${file}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let updated = false;
  
  for (const { old, new: newStr } of replacements) {
    if (content.includes(old)) {
      content = content.replace(old, newStr);
      updated = true;
      totalUpdates++;
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf-8');
    filesUpdated++;
    console.log(`✅ ${file}`);
  }
}

console.log(`\n============================================================`);
console.log(`📊 RÉSULTAT`);
console.log(`============================================================`);
console.log(`✅ Fichiers modifiés: ${filesUpdated}`);
console.log(`✅ Remplacements effectués: ${totalUpdates}`);
console.log(`\n⚠️  IMPORTANT: Redémarrer le serveur pour voir les changements\n`);
