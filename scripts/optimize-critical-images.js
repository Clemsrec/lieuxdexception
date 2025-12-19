const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Script d'optimisation des images critiques identifiées par Lighthouse
 * 
 * Problèmes identifiés :
 * - chateau-brulaire/hero.jpg : 3.9 MB → cible <500 KB
 * - Logos venues : 116 KB (3223x1479) → cible <30 KB (400px largeur)
 * - Logo principal : 112 KB (3393x1094) → cible <30 KB (800px largeur)
 * - Autres heros : conversion WebP avec compression
 */

async function optimizeImage(inputPath, outputPath, options = {}) {
  const {
    width = null,
    quality = 85,
    format = 'webp',
    progressive = true
  } = options;

  try {
    console.log(`\n📸 Optimisation: ${path.basename(inputPath)}`);
    
    const inputStats = fs.statSync(inputPath);
    console.log(`   Taille actuelle: ${(inputStats.size / 1024).toFixed(1)} KB`);

    let pipeline = sharp(inputPath);

    // Redimensionner si width spécifié
    if (width) {
      pipeline = pipeline.resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Conversion selon format
    if (format === 'webp') {
      pipeline = pipeline.webp({ 
        quality,
        effort: 6 // Compression maximale (0-6)
      });
    } else if (format === 'png') {
      pipeline = pipeline.png({
        quality,
        compressionLevel: 9,
        progressive
      });
    } else if (format === 'jpeg') {
      pipeline = pipeline.jpeg({
        quality,
        progressive,
        mozjpeg: true
      });
    }

    await pipeline.toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
    
    console.log(`   ✅ Nouvelle taille: ${(outputStats.size / 1024).toFixed(1)} KB`);
    console.log(`   💰 Économie: ${savings}%`);

    return {
      input: inputPath,
      output: outputPath,
      originalSize: inputStats.size,
      optimizedSize: outputStats.size,
      savings: parseFloat(savings)
    };
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Optimisation des images critiques pour Lighthouse\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const publicDir = path.join(__dirname, '../public');
  const results = [];

  // 1. PRIORITÉ 1 : Hero Brûlaire (3.9 MB → <500 KB)
  console.log('\n🔥 PRIORITÉ 1 : Hero Château de la Brûlaire');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const brulairResult = await optimizeImage(
    path.join(publicDir, 'venues/chateau-brulaire/hero.jpg'),
    path.join(publicDir, 'venues/chateau-brulaire/hero-optimized.webp'),
    { width: 2000, quality: 85, format: 'webp' }
  );
  if (brulairResult) results.push(brulairResult);

  // 2. Logos venues (trop larges pour leur affichage)
  console.log('\n\n📋 PRIORITÉ 2 : Logos venues');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const logoVenues = [
    { name: 'boulaie-blanc.png', width: 400 },
    { name: 'brulaire-blanc.png', width: 400 },
    { name: 'corbe-blanc.png', width: 400 },
    { name: 'dome-blanc.png', width: 400 },
    { name: 'domaine-blanc.png', width: 400 }
  ];

  for (const logo of logoVenues) {
    const inputPath = path.join(publicDir, `logos/venues/${logo.name}`);
    if (fs.existsSync(inputPath)) {
      const result = await optimizeImage(
        inputPath,
        path.join(publicDir, `logos/venues/${logo.name.replace('.png', '-optimized.png')}`),
        { width: logo.width, quality: 90, format: 'png' }
      );
      if (result) results.push(result);
    }
  }

  // 3. Logo principal Lieux d'Exception
  console.log('\n\n🏛️ PRIORITÉ 3 : Logo principal');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const logoResult = await optimizeImage(
    path.join(publicDir, 'logos/logo-lieux-exception-blanc.png'),
    path.join(publicDir, 'logos/logo-lieux-exception-blanc-optimized.png'),
    { width: 800, quality: 90, format: 'png' }
  );
  if (logoResult) results.push(logoResult);

  // 4. Autres heros à convertir en WebP
  console.log('\n\n🖼️ PRIORITÉ 4 : Autres images hero');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const otherHeros = [
    { path: 'venues/chateau-corbe/hero.jpg', width: 1920 },
    { path: 'venues/manoir-boulaie/mariages/dome_interieur_1.jpg', width: 1600 },
    { path: 'venues/domaine-nantais/mariages/domaine_cocktail_1.jpg', width: 1920 }
  ];

  for (const hero of otherHeros) {
    const inputPath = path.join(publicDir, hero.path);
    if (fs.existsSync(inputPath)) {
      const outputPath = inputPath.replace(/\.(jpg|jpeg)$/i, '-optimized.webp');
      const result = await optimizeImage(
        inputPath,
        outputPath,
        { width: hero.width, quality: 85, format: 'webp' }
      );
      if (result) results.push(result);
    }
  }

  // 5. Résumé
  console.log('\n\n📊 RÉSUMÉ DES OPTIMISATIONS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
  const totalSavings = totalOriginal - totalOptimized;
  const percentSavings = ((totalSavings / totalOriginal) * 100).toFixed(1);

  console.log(`\n✅ ${results.length} images optimisées`);
  console.log(`📦 Taille originale: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📦 Taille optimisée: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`💰 Économie totale: ${(totalSavings / 1024 / 1024).toFixed(2)} MB (${percentSavings}%)`);
  
  console.log('\n\n⚠️  PROCHAINES ÉTAPES :');
  console.log('1. Vérifier visuellement les images optimisées');
  console.log('2. Renommer les fichiers -optimized en remplaçant les originaux');
  console.log('3. Uploader sur Firebase Storage (ou utiliser public/ si optimisation locale)');
  console.log('4. Mettre à jour les URLs dans Firestore si nécessaire\n');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
