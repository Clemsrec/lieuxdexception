/**
 * formatVenueName.ts
 * Helpers pour formater l'affichage des noms de lieux.
 *
 * Ajoute "Le" devant le nom du lieu s'il n'est pas déjà présent.
 */

export function displayVenueName(rawName?: string): string {
  if (!rawName) return 'Le Lieu d\'Exception';
  const name = String(rawName).trim();
  
  // Si le nom commence déjà par "Le ", le retourner tel quel
  if (name.startsWith('Le ')) {
    return name;
  }
  
  // Sinon, ajouter "Le" devant
  return `Le ${name}`;
}

export default displayVenueName;
