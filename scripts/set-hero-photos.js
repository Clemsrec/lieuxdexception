#!/usr/bin/env node

/**
 * Script de sélection des photos hero pour les lieux
 * Analyse les photos disponibles et suggère/définit les meilleures hero images
 * 
 * Critères de sélection :
 * - Photos extérieures (exterieur, facade, vue)
 * - Grandes tailles
 * - Vues d'ensemble du lieu
 */

const fs = require('fs');
const path = require('path');

const VENUES_DIR = path.join(__dirname, '../public/venues');

// Slugs des lieux
const VENUES = [
  'chateau-brulaire',
  'chateau-corbe',
  'domaine-nantais',
  'le-dome',
  'manoir-boulaie'
];

/**
 * Vérifie si un lieu a déjà une photo hero
 */
function hasHeroPhoto(slug) {
  const venuePath = path.join(VENUES_DIR, slug);
  const extensions = ['.jpg', '.jpeg', '.png'];
  
  return extensions.some(ext => 
    fs.existsSync(path.join(venuePath, `hero${ext}`))
  );
}

/**
 * Calcule un score de pertinence pour une photo hero
 */
function calculateHeroScore(filename) {
  let score = 0;
  const lower = filename.toLowerCase();
  
  // Mots-clés positifs
  if (lower.includes('vue')) score += 10;
  if (lower.includes('ensemble')) score += 10;
  if (lower.includes('exterieur')) score += 8;
  if (lower.includes('facade')) score += 8;
  if (lower.includes('chateau')) score += 5;
  if (lower.includes('vue_chateau')) score += 12;
  if (lower.includes('vue_d_ensemble')) score += 15;
  
  // Préférer les photos principales (numérotées 1)
  if (/_1\./.test(lower)) score += 3;
  
  // Pénaliser les photos intérieures
  if (lower.includes('interieur')) score -= 5;
  if (lower.includes('salon')) score -= 3;
  if (lower.includes('chambre')) score -= 5;
  if (lower.includes('bar')) score -= 3;
  if (lower.includes('seminaire')) score -= 2;
  
  return score;
}

/**
 * Trouve les meilleures candidates pour photo hero
 */
function findHeroCandidates(slug) {
  const venuePath = path.join(VENUES_DIR, slug);
  const candidates = [];
  
  // Parcourir tous les sous-dossiers
  ['b2b', 'mariages', 'gallery'].forEach(subdir => {
    const subdirPath = path.join(venuePath, subdir);
    
    if (!fs.existsSync(subdirPath)) return;
    
    const files = fs.readdirSync(subdirPath);
    
    files.forEach(file => {
      if (!/\.(jpg|jpeg|png)$/i.test(file)) return;
      
      const score = calculateHeroScore(file);
      const filePath = path.join(subdirPath, file);
      const stats = fs.statSync(filePath);
      
      candidates.push({
        file,
        path: filePath,
        subdir,
        score,
        size: stats.size
      });
    });
  });
  
  // Trier par score décroissant, puis par taille
  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.size - a.size;
  });
  
  return candidates;
}

/**
 * Copie une photo comme hero image
 */
function setHeroPhoto(slug, sourcePath) {
  const ext = path.extname(sourcePath);
  const targetPath = path.join(VENUES_DIR, slug, `hero${ext}`);
  
  fs.copyFileSync(sourcePath, targetPath);
  console.log(`   ✅ Photo hero définie: ${path.basename(sourcePath)}`);
  
  return targetPath;
}

/**
 * Affiche les informations d'un lieu
 */
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Traite un lieu
 */
function processVenue(slug) {
  const displayName = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  
  console.log(`\n🏰 ${displayName.toUpperCase()}`);
  
  // Vérifier si hero existe déjà
  if (hasHeroPhoto(slug)) {
    console.log('   ✅ Photo hero déjà définie');
    return;
  }
  
  console.log('   ⚠️  Aucune photo hero trouvée');
  
  // Trouver les candidates
  const candidates = findHeroCandidates(slug);
  
  if (candidates.length === 0) {
    console.log('   ❌ Aucune photo disponible pour ce lieu');
    return;
  }
  
  console.log(`   📸 ${candidates.length} photo(s) analysée(s)`);
  console.log('   \n   🎯 Top 3 candidates :');
  
  candidates.slice(0, 3).forEach((candidate, index) => {
    console.log(`   ${index + 1}. ${candidate.file}`);
    console.log(`      Score: ${candidate.score} | Taille: ${formatFileSize(candidate.size)} | Dossier: ${candidate.subdir}`);
  });
  
  // Sélectionner automatiquement la meilleure
  const best = candidates[0];
  
  if (best.score > 0) {
    console.log(`\n   🌟 Sélection automatique: ${best.file} (score: ${best.score})`);
    setHeroPhoto(slug, best.path);
  } else {
    console.log('\n   ⚠️  Aucune photo avec score > 0, sélection manuelle recommandée');
    console.log(`   💡 Suggestion: Copier manuellement la meilleure photo en hero.jpg`);
  }
}

/**
 * Génère un rapport final
 */
function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 RAPPORT FINAL - PHOTOS HERO');
  console.log('='.repeat(60));
  
  VENUES.forEach(slug => {
    const displayName = slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    
    const status = hasHeroPhoto(slug) ? '✅' : '❌';
    console.log(`${status} ${displayName}`);
  });
  
  console.log('='.repeat(60));
}

// Exécution principale
console.log('🎨 Script de sélection des photos hero');
console.log('='.repeat(60));

VENUES.forEach(processVenue);

generateReport();

console.log('\n💡 Prochaines étapes :');
console.log('   1. Vérifier visuellement les photos hero sélectionnées');
console.log('   2. Remplacer manuellement si nécessaire');
console.log('   3. Optimiser les images avec scripts/optimize-images.js');
console.log('   4. Mettre à jour les URLs dans Firestore\n');
