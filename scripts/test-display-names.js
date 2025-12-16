#!/usr/bin/env node

// Simuler la nouvelle fonction displayVenueName
function displayVenueName(rawName) {
  if (!rawName) return 'Le Lieu d\'Exception';
  const name = String(rawName).trim();
  
  // Si le nom commence déjà par "Le ", le retourner tel quel
  if (name.startsWith('Le ')) {
    return name;
  }
  
  // Sinon, ajouter "Le" devant
  return `Le ${name}`;
}

const venues = [
  "Château de la Brûlaire",
  "Château de la Corbe",
  "Domaine Nantais",
  "Le Dôme",
  "Manoir de la Boulaie"
];

console.log('🏰 Test d\'affichage des noms avec "Le" devant:\n');

venues.forEach(name => {
  console.log(`Firestore: "${name}"`);
  console.log(`Affiché:   "${displayVenueName(name)}"`);
  console.log('---');
});
