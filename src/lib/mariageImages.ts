import { promises as fs } from 'fs';
import path from 'path';

/**
 * Liste des doublons détectés à exclure (même taille de fichier)
 */
const EXCLUDED_FILES = [
  'domaine_nantais_1.jpg', // Doublon de domaine_cocktail_3.jpg
  'manoir_boulaie_1.jpg',  // Doublon de boulaie_facade_1.jpg
  'manoir_boulaie_2.jpg',  // Doublon de boulaie_interieur_3.jpg
  'dome_interieur_3.jpg',  // Doublon de dome.jpg
];

/**
 * Récupère toutes les images d'un dossier mariages
 */
export async function getMariageImages(venueSlug: string): Promise<Array<{ src: string; alt: string }>> {
  const imagesDir = path.join(process.cwd(), 'public', 'venues', venueSlug, 'mariages');
  
  try {
    const files = await fs.readdir(imagesDir);
    
    // Filtrer uniquement les images JPG/JPEG et exclure les doublons
    const imageFiles = files.filter(file => {
      const isImage = /\.(jpg|jpeg)$/i.test(file);
      const isNotExcluded = !EXCLUDED_FILES.includes(file);
      return isImage && isNotExcluded;
    });
    
    // Convertir en objets avec src et alt
    return imageFiles.map(file => ({
      src: `/venues/${venueSlug}/mariages/${file}`,
      alt: `${getVenueName(venueSlug)} - Photo mariage`
    }));
  } catch (error) {
    console.error(`Erreur lecture images pour ${venueSlug}:`, error);
    return [];
  }
}

/**
 * Obtient un nom lisible pour un slug de lieu
 */
function getVenueName(slug: string): string {
  const names: Record<string, string> = {
    'chateau-brulaire': 'Le Château de la Brûlaire',
    'chateau-corbe': 'Le Château de la Corbe',
    'domaine-nantais': 'Le Domaine Nantais',
    'manoir-boulaie': 'Le Manoir de la Boulaie',
    'le-dome': 'Le Dôme'
  };
  return names[slug] || slug;
}

/**
 * Sélectionne aléatoirement N images parmi une liste
 */
export function getRandomImages<T>(images: T[], count: number = 6): T[] {
  const shuffled = [...images].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, images.length));
}

/**
 * Récupère toutes les images B2B d'un lieu pour les pages individuelles
 */
export async function getB2BImages(venueSlug: string): Promise<Array<{ src: string; alt: string }>> {
  const imagesDir = path.join(process.cwd(), 'public', 'venues', venueSlug, 'b2b');
  
  try {
    const files = await fs.readdir(imagesDir);
    
    // Filtrer uniquement les images JPG/JPEG/PNG
    const imageFiles = files.filter(file => {
      return /\.(jpg|jpeg|png)$/i.test(file);
    });
    
    // Convertir en objets avec src et alt
    return imageFiles.map(file => ({
      src: `/venues/${venueSlug}/b2b/${file}`,
      alt: `${getVenueName(venueSlug)} - Photo ${file.replace(/\.(jpg|jpeg|png)$/i, '')}`
    }));
  } catch (error) {
    console.error(`Erreur lecture images B2B pour ${venueSlug}:`, error);
    return [];
  }
}
