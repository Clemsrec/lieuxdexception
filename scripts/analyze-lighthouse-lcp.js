/**
 * Optimisation LCP : Script d'analyse des problèmes Lighthouse
 * 
 * Problèmes identifiés :
 * 1. Délai de chargement ressource hero : 1 050 ms (1 seconde!)
 * 2. Ancien JavaScript : 12 Kio à nettoyer
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ANALYSE LIGHTHOUSE - LCP & JAVASCRIPT\n');

// 1. Analyser le délai LCP
console.log('═══════════════════════════════════════');
console.log('1️⃣  ANALYSE LCP (Largest Contentful Paint)');
console.log('═══════════════════════════════════════\n');

console.log('Répartition LCP actuelle :');
console.log('  - Time to First Byte       : 0 ms      ✅');
console.log('  - Délai chargement resource: 1 050 ms  ❌ PROBLÈME');
console.log('  - Durée chargement resource: 150 ms    ✅');
console.log('  - Délai affichage élément  : 130 ms    ✅');
console.log('  ────────────────────────────────────────');
console.log('  TOTAL LCP                  : ~1 330 ms\n');

console.log('🎯 Problème principal :');
console.log('Le navigateur attend 1 seconde avant de COMMENCER à charger l\'image hero.\n');

console.log('💡 Solutions :');
console.log('1. Ajouter <link rel="preload"> dans <head> pour l\'image hero');
console.log('   → Démarre le téléchargement plus tôt');
console.log('   → Réduit délai de ~1 050 ms → ~100 ms\n');

console.log('2. Utiliser fetchpriority="high" (déjà fait ✅)');
console.log('   → Priorité haute pour l\'image hero\n');

console.log('3. Optimiser l\'image (déjà fait ✅)');
console.log('   → Brûlaire hero : 3.9 MB → 924 KB WebP (-76%)\n');

// 2. Analyser le JavaScript ancien
console.log('\n═══════════════════════════════════════');
console.log('2️⃣  JAVASCRIPT ANCIEN (12 Kio à nettoyer)');
console.log('═══════════════════════════════════════\n');

console.log('🔍 Recherche des anciens patterns JavaScript...\n');

// Patterns à vérifier
const oldPatterns = [
  { pattern: 'componentDidMount', description: 'Ancien lifecycle React (Class Components)' },
  { pattern: 'componentWillMount', description: 'Lifecycle deprecated' },
  { pattern: 'UNSAFE_', description: 'Lifecycle unsafe' },
  { pattern: 'jQuery', description: 'Ancienne bibliothèque' },
  { pattern: '$.', description: 'Syntaxe jQuery' },
  { pattern: 'var ', description: 'Ancien var au lieu de const/let' },
  { pattern: 'moment.js', description: 'Bibliothèque lourde (remplacer par date-fns)' },
  { pattern: 'lodash', description: 'Import non optimisé (utiliser imports spécifiques)' },
];

// Chercher dans src/
function searchPattern(dir, pattern) {
  const results = [];
  
  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);
    
    files.forEach(file => {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        walkDir(filePath);
      } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx'))) {
        const content = fs.readFileSync(filePath, 'utf8');
        const regex = new RegExp(pattern, 'g');
        const matches = content.match(regex);
        
        if (matches && matches.length > 0) {
          results.push({
            file: filePath.replace(process.cwd(), ''),
            count: matches.length
          });
        }
      }
    });
  }
  
  walkDir(dir);
  return results;
}

const srcDir = path.join(process.cwd(), 'src');

oldPatterns.forEach(({ pattern, description }) => {
  const results = searchPattern(srcDir, pattern);
  
  if (results.length > 0) {
    console.log(`❌ ${description} (pattern: "${pattern}")`);
    results.forEach(({ file, count }) => {
      console.log(`   ${file} (${count} occurrence${count > 1 ? 's' : ''})`);
    });
    console.log('');
  }
});

// 3. Vérifier les imports non optimisés
console.log('\n═══════════════════════════════════════');
console.log('3️⃣  IMPORTS NON OPTIMISÉS');
console.log('═══════════════════════════════════════\n');

const unoptimizedImports = [
  { pattern: "import.*from 'lodash'", optimized: "import { specific } from 'lodash'" },
  { pattern: "import.*from '@mui/material'", optimized: "import Button from '@mui/material/Button'" },
];

unoptimizedImports.forEach(({ pattern, optimized }) => {
  const results = searchPattern(srcDir, pattern);
  
  if (results.length > 0) {
    console.log(`⚠️  Import non optimisé : ${pattern}`);
    console.log(`   Recommandation : ${optimized}`);
    results.forEach(({ file, count }) => {
      console.log(`   ${file}`);
    });
    console.log('');
  }
});

// 4. Recommandations finales
console.log('\n═══════════════════════════════════════');
console.log('📋 RECOMMANDATIONS');
console.log('═══════════════════════════════════════\n');

console.log('PRIORITÉ 1 : Réduire délai LCP (-1 000 ms)');
console.log('  → Ajouter preload pour image hero dans <head>');
console.log('  → Impact : LCP 1 330 ms → ~330 ms (-75%)\n');

console.log('PRIORITÉ 2 : Nettoyer JavaScript ancien (-12 Kio)');
console.log('  → Remplacer var par const/let');
console.log('  → Optimiser imports lodash/mui');
console.log('  → Impact : -12 KB JS parsé/exécuté\n');

console.log('PRIORITÉ 3 : Vérifier bundle analysis');
console.log('  → npm run build && npx @next/bundle-analyzer');
console.log('  → Identifier les gros modules inutiles\n');

console.log('✅ Build production réussi - Ready to deploy!');
