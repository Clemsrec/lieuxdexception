/**
 * Helper pour récupérer le bon logo d'un lieu selon le thème (clair/sombre)
 * Utilise les logos blanc pour fonds sombres et dorés pour fonds clairs
 */

/**
 * Mapping des slugs vers les noms de fichiers logo
 * Supporte les slugs courts (chateau-brulaire) et longs (chateau-de-la-brulaire)
 */
const LOGO_MAP: Record<string, string> = {
  // Slugs longs (Firestore)
  'chateau-de-la-brulaire': 'brulaire',
  'manoir-de-la-boulaie': 'boulaie',
  'domaine-nantais': 'domaine',
  'le-dome': 'dome',
  // Slugs courts (filesystem/URLs)
  'chateau-brulaire': 'brulaire',
  'manoir-boulaie': 'boulaie',
  'dome': 'dome',
  // Note: Le Château de la Corbe n'a pas de logo disponible
};

/**
 * Types de thème pour le logo
 */
export type LogoTheme = 'blanc' | 'dore';

/**
 * Récupère le chemin du logo pour un lieu donné
 * @param slug Le slug du lieu (ex: 'chateau-de-la-brulaire')
 * @param theme Le thème du logo ('blanc' pour fond sombre, 'dore' pour fond clair)
 * @returns Le chemin du logo ou null si non disponible
 */
export function getVenueLogo(slug: string, theme: LogoTheme = 'blanc'): string | null {
  const logoName = LOGO_MAP[slug];
  if (!logoName) {
    return null;
  }
  return `/logos/${logoName}-${theme}.png`;
}

/**
 * Vérifie si un lieu a un logo disponible
 * @param slug Le slug du lieu
 * @returns true si un logo existe
 */
export function hasVenueLogo(slug: string): boolean {
  return slug in LOGO_MAP;
}

/**
 * Récupère tous les slugs de lieux ayant un logo
 * @returns Array des slugs
 */
export function getVenuesWithLogos(): string[] {
  return Object.keys(LOGO_MAP);
}
