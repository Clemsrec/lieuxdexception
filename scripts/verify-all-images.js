#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de toutes les images utilisées dans le code...\n');

// Liste de tous les fichiers qui peuvent contenir des images
const filesToCheck = [
  'src/app/[locale]/page.tsx',
  'src/app/[locale]/evenements-b2b/page.tsx',
  'src/app/[locale]/mariages/page.tsx',
  'src/components/HomeClient.tsx',
  'src/components/HeroCarousel.tsx',
  'src/lib/sharedVenueImages.ts'
];

// Regex pour trouver toutes les images src
const imageRegex = /src=["']([^"']+\.(jpg|jpeg|png|webp))["']/gi;

let totalImages = 0;
let missingImages = 0;
let goodImages = 0;

for (const file of filesToCheck) {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    continue;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches = [...content.matchAll(imageRegex)];
  
  if (matches.length === 0) continue;
  
  console.log(`📄 ${file}`);
  
  for (const match of matches) {
    const imagePath = match[1];
    totalImages++;
    
    // Vérifier si l'image existe
    const publicPath = path.join(process.cwd(), 'public', imagePath);
    
    if (fs.existsSync(publicPath)) {
      console.log(`   ✅ ${imagePath}`);
      goodImages++;
    } else {
      console.log(`   ❌ MANQUANT: ${imagePath}`);
      missingImages++;
    }
  }
  console.log();
}

console.log('============================================================');
console.log('📊 RÉSULTAT');
console.log('============================================================');
console.log(`Total d'images trouvées: ${totalImages}`);
console.log(`✅ Images existantes: ${goodImages}`);
console.log(`❌ Images manquantes: ${missingImages}`);

if (missingImages > 0) {
  console.log('\n⚠️  ATTENTION: Des images sont manquantes !');
  process.exit(1);
} else {
  console.log('\n✅ Toutes les images sont présentes !');
}
