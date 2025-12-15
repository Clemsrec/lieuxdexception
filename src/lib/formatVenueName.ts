/**
 * formatVenueName.ts
 * Helpers pour formater l'affichage des noms de lieux.
 *
 * Règle appliquée : toujours préfixer la dénomination par "Le" suivi
 * du nom principal (on supprime les préfixes existants comme "Château", "Domaine", "Le", "La", "Les", "L'" pour éviter les doublons).
 */

export function displayVenueName(rawName?: string): string {
  if (!rawName) return 'Le lieu';
  const name = String(rawName).trim();
  // Supprimer articles/termes initiaux pour éviter "Le Domaine Domaine X"
  const cleaned = name.replace(/^(Le|La|Les|L'|Château|Domaine)\s+/i, '').trim();
  return `Le ${cleaned}`;
}

export default displayVenueName;
