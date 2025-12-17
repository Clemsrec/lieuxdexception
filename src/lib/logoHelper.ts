/**
 * Helper pour récupérer le bon logo d'un lieu selon le thème (clair/sombre)
 * Version hardcodée pour plus de fiabilité
 */

/**
 * Types de thème pour le logo
 */
export type LogoTheme = 'blanc' | 'dore';

/**
 * Map des logos disponibles (centralisée)
 */
const LOGO_MAP: Record<string, { blanc: string; dore: string }> = {
  'chateau-brulaire': { blanc: '/logos/brulaire-blanc.png', dore: '/logos/brulaire-dore.png' },
  'chateau-de-la-brulaire': { blanc: '/logos/brulaire-blanc.png', dore: '/logos/brulaire-dore.png' },
  'manoir-boulaie': { blanc: '/logos/boulaie-blanc.png', dore: '/logos/boulaie-dore.png' },
  'manoir-de-la-boulaie': { blanc: '/logos/boulaie-blanc.png', dore: '/logos/boulaie-dore.png' },
  'domaine-nantais': { blanc: '/logos/domaine-blanc.png', dore: '/logos/domaine-dore.png' },
  'le-dome': { blanc: '/logos/dome-blanc.png', dore: '/logos/dome-dore.png' },
  'dome': { blanc: '/logos/dome-blanc.png', dore: '/logos/dome-dore.png' },
  // Note: chateau-corbe et chateau-de-la-corbe n'ont pas de logo (affiché sans logo)
};

/**
 * Récupère le chemin du logo pour un lieu donné
 * @param slug Le slug du lieu (ex: 'chateau-brulaire')
 * @param theme Le thème du logo ('blanc' pour fond sombre, 'dore' pour fond clair)
 * @returns Le chemin du logo ou null si non disponible
 */
export function getVenueLogo(slug: string, theme: LogoTheme = 'blanc'): string | null {
  return LOGO_MAP[slug]?.[theme] || null;
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
