/**
 * Script d'optimisation des images critiques identifiées par Lighthouse
 * Économies estimées : ~5 MB
 * 
 * Problèmes à résoudre :
 * 1. Brûlaire hero.jpg : 3.9 MB → WebP + resize (5120x3241 → 2000px max)
 * 2. Dôme mariages/dome_interieur_1.jpg : 244 KB → WebP
 * 3. Domaine mariages/domaine_cocktail.jpg : 266 KB → WebP
 * 4. Logos venues surdimensionnés : 132 KB + 122 KB → resize (2469x1479 → 200px)
 */

const sharp = require('sharp');
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const fs = require('fs');
const path = require('path');

// Initialiser Firebase Admin
const serviceAccount = require('../firebase-service-account.json');
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'lieux-d-exceptions.firebasestorage.app'
});

const bucket = getStorage().bucket();

/**
 * Optimiser une image : WebP + compression + resize optionnel
 */
async function optimizeImage(remotePath, localPath, options = {}) {
  const {
    maxWidth = null,
    quality = 85,
    resize = false
  } = options;

  console.log(`\n📥 Téléchargement : ${remotePath}`);
  
  try {
    // Télécharger l'image
    await bucket.file(remotePath).download({ destination: localPath });
    const stats = fs.statSync(localPath);
    const originalSize = (stats.size / 1024).toFixed(2);
    console.log(`   Taille originale : ${originalSize} KB`);

    // Optimiser
    const outputPath = localPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    let sharpInstance = sharp(localPath);

    // Resize si demandé
    if (resize && maxWidth) {
      sharpInstance = sharpInstance.resize(maxWidth, null, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Convertir en WebP
    await sharpInstance
      .webp({ quality, effort: 6 })
      .toFile(outputPath);

    const optimizedStats = fs.statSync(outputPath);
    const optimizedSize = (optimizedStats.size / 1024).toFixed(2);
    const savings = ((1 - optimizedStats.size / stats.size) * 100).toFixed(1);

    console.log(`   ✅ Optimisé : ${optimizedSize} KB (-${savings}%)`);

    return {
      originalPath: localPath,
      optimizedPath: outputPath,
      originalSize: stats.size,
      optimizedSize: optimizedStats.size,
      savings: parseInt(savings),
      remotePath: remotePath.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    };
  } catch (error) {
    console.error(`   ❌ Erreur : ${error.message}`);
    return null;
  }
}

/**
 * Upload une image optimisée vers Firebase Storage
 */
async function uploadOptimized(localPath, remotePath) {
  console.log(`\n📤 Upload : ${remotePath}`);
  
  try {
    await bucket.upload(localPath, {
      destination: remotePath,
      metadata: {
        contentType: 'image/webp',
        cacheControl: 'public, max-age=31536000'
      }
    });
    console.log(`   ✅ Uploadé`);
    
    // Nettoyer les fichiers locaux
    fs.unlinkSync(localPath);
    const originalPath = localPath.replace('.webp', '.jpg');
    if (fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
    }
  } catch (error) {
    console.error(`   ❌ Erreur upload : ${error.message}`);
  }
}

/**
 * Script principal
 */
async function main() {
  console.log('🎯 OPTIMISATION DES IMAGES LIGHTHOUSE\n');
  console.log('Économies estimées : ~5 MB\n');

  const tempDir = path.join(__dirname, '../temp-optimize');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const results = [];

  // 1. Brûlaire hero - PRIORITÉ CRITIQUE (3.9 MB!)
  console.log('═══════════════════════════════════════');
  console.log('1️⃣  BRÛLAIRE HERO (3.9 MB → WebP + resize)');
  console.log('═══════════════════════════════════════');
  const brulaire = await optimizeImage(
    'venues/chateau-brulaire/hero.jpg',
    path.join(tempDir, 'brulaire-hero.jpg'),
    { maxWidth: 2000, quality: 85, resize: true }
  );
  if (brulaire) {
    results.push(brulaire);
    await uploadOptimized(brulaire.optimizedPath, brulaire.remotePath);
  }

  // 2. Dôme mariages
  console.log('\n═══════════════════════════════════════');
  console.log('2️⃣  DÔME MARIAGES (244 KB → WebP)');
  console.log('═══════════════════════════════════════');
  const domeInterieur = await optimizeImage(
    'venues/chateau-le-dome/mariages/dome_interieur_1.jpg',
    path.join(tempDir, 'dome-interieur.jpg'),
    { quality: 85 }
  );
  if (domeInterieur) {
    results.push(domeInterieur);
    await uploadOptimized(domeInterieur.optimizedPath, domeInterieur.remotePath);
  }

  // 3. Domaine mariages
  console.log('\n═══════════════════════════════════════');
  console.log('3️⃣  DOMAINE MARIAGES (266 KB → WebP)');
  console.log('═══════════════════════════════════════');
  const domaineCocktail = await optimizeImage(
    'venues/domaine-nantais/mariages/domaine_cocktail_1.jpg',
    path.join(tempDir, 'domaine-cocktail.jpg'),
    { quality: 85 }
  );
  if (domaineCocktail) {
    results.push(domaineCocktail);
    await uploadOptimized(domaineCocktail.optimizedPath, domaineCocktail.remotePath);
  }

  // 4. Logos venues (Dôme + Domaine) - Surdimensionnés!
  console.log('\n═══════════════════════════════════════');
  console.log('4️⃣  LOGOS VENUES (2469x1479 → 200px)');
  console.log('═══════════════════════════════════════');
  
  const logosToOptimize = [
    { remote: 'logos/venues/dome-blanc.png', local: 'dome-blanc.png' },
    { remote: 'logos/venues/domaine-blanc.png', local: 'domaine-blanc.png' }
  ];

  for (const logo of logosToOptimize) {
    const result = await optimizeImage(
      logo.remote,
      path.join(tempDir, logo.local),
      { maxWidth: 200, quality: 90, resize: true }
    );
    if (result) {
      results.push(result);
      await uploadOptimized(result.optimizedPath, result.remotePath);
    }
  }

  // Résumé
  console.log('\n\n═══════════════════════════════════════');
  console.log('📊 RÉSUMÉ');
  console.log('═══════════════════════════════════════');

  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalOptimized = results.reduce((sum, r) => sum + r.optimizedSize, 0);
  const totalSavings = totalOriginal - totalOptimized;
  const percentSavings = ((totalSavings / totalOriginal) * 100).toFixed(1);

  console.log(`Images optimisées : ${results.length}`);
  console.log(`Taille originale : ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Taille optimisée : ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`✅ Économies : ${(totalSavings / 1024 / 1024).toFixed(2)} MB (-${percentSavings}%)`);

  console.log('\n🎯 PROCHAINES ÉTAPES :');
  console.log('1. Mettre à jour les URLs dans Firestore (hero Brûlaire)');
  console.log('2. Vérifier les images sur le site');
  console.log('3. Re-run Lighthouse pour confirmer les gains');

  // Nettoyer
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

main().catch(console.error);
