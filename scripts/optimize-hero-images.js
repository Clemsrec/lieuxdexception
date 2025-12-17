#!/usr/bin/env node

/**
 * Script d'optimisation des images hero des châteaux
 * Convertit les images JPEG lourdes en WebP/AVIF avec compression optimale
 * Cible: Réduire payload de 4.4 MB (chateau-brulaire 3.8 MB → ~500 KB)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Configuration qualité/taille
 */
const CONFIG = {
  webp: {
    quality: 75,      // Balance qualité/taille (75 = optimal selon PageSpeed)
    effort: 6,        // 0-6, 6 = meilleure compression (slow)
  },
  avif: {
    quality: 60,      // AVIF plus efficace, qualité 60 ≈ JPEG 85
    effort: 9,        // 0-9, 9 = meilleure compression (very slow)
  },
  jpeg: {
    quality: 80,      // Backup JPEG optimisé
    progressive: true,
    mozjpeg: true,    // Utiliser mozjpeg (meilleur que libjpeg)
  },
  resize: {
    width: 1920,      // Max width pour desktop full HD
    withoutEnlargement: true,  // Ne pas agrandir les petites images
  },
};

/**
 * Images hero à optimiser (priorité PageSpeed)
 */
const HERO_IMAGES = [
  {
    venue: 'chateau-brulaire',
    input: 'public/venues/chateau-brulaire/hero.jpg',
    currentSize: '3.8 MB',
    targetSize: '~500 KB',
  },
  {
    venue: 'manoir-boulaie',
    input: 'public/venues/manoir-boulaie/hero.jpg',
    currentSize: '335 KB',
    targetSize: '~118 KB',
  },
  {
    venue: 'domaine-nantais',
    input: 'public/venues/domaine-nantais/hero.jpg',
    currentSize: '327 KB',
    targetSize: '~122 KB',
  },
  {
    venue: 'chateau-le-dome',
    input: 'public/venues/chateau-le-dome/hero.jpg',
    currentSize: 'unknown',
    targetSize: '~500 KB',
  },
  {
    venue: 'chateau-de-la-corbe',
    input: 'public/venues/chateau-de-la-corbe/hero.jpg',
    currentSize: 'unknown',
    targetSize: '~500 KB',
  },
];

/**
 * Optimise une image en WebP/AVIF + JPEG backup
 */
async function optimizeImage(imageConfig) {
  const { venue, input } = imageConfig;
  
  console.log(`\n📸 [${venue}] Optimisation ${input}...`);
  
  // Vérifier si le fichier existe
  if (!fs.existsSync(input)) {
    console.log(`⚠️  Fichier non trouvé: ${input}`);
    return;
  }
  
  const inputPath = path.resolve(input);
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const basename = path.basename(inputPath, ext);
  
  // Chemins de sortie
  const outputWebP = path.join(dir, `${basename}.webp`);
  const outputAVIF = path.join(dir, `${basename}.avif`);
  const outputJPEG = path.join(dir, `${basename}-optimized.jpg`);
  
  // Récupérer stats originales
  const statsOriginal = fs.statSync(inputPath);
  const sizeOriginal = (statsOriginal.size / 1024 / 1024).toFixed(2);
  
  try {
    // 1. WebP (priorité Next.js Image)
    console.log(`   ⏳ Génération WebP (quality ${CONFIG.webp.quality})...`);
    await sharp(inputPath)
      .resize(CONFIG.resize.width, null, { withoutEnlargement: true })
      .webp(CONFIG.webp)
      .toFile(outputWebP);
    
    const statsWebP = fs.statSync(outputWebP);
    const sizeWebP = (statsWebP.size / 1024).toFixed(0);
    const reductionWebP = ((1 - statsWebP.size / statsOriginal.size) * 100).toFixed(0);
    console.log(`   ✅ WebP: ${sizeWebP} KB (${reductionWebP}% réduction)`);
    
    // 2. AVIF (meilleure compression)
    console.log(`   ⏳ Génération AVIF (quality ${CONFIG.avif.quality})...`);
    await sharp(inputPath)
      .resize(CONFIG.resize.width, null, { withoutEnlargement: true })
      .avif(CONFIG.avif)
      .toFile(outputAVIF);
    
    const statsAVIF = fs.statSync(outputAVIF);
    const sizeAVIF = (statsAVIF.size / 1024).toFixed(0);
    const reductionAVIF = ((1 - statsAVIF.size / statsOriginal.size) * 100).toFixed(0);
    console.log(`   ✅ AVIF: ${sizeAVIF} KB (${reductionAVIF}% réduction)`);
    
    // 3. JPEG optimisé (fallback navigateurs anciens)
    console.log(`   ⏳ Génération JPEG optimisé (quality ${CONFIG.jpeg.quality})...`);
    await sharp(inputPath)
      .resize(CONFIG.resize.width, null, { withoutEnlargement: true })
      .jpeg(CONFIG.jpeg)
      .toFile(outputJPEG);
    
    const statsJPEG = fs.statSync(outputJPEG);
    const sizeJPEG = (statsJPEG.size / 1024).toFixed(0);
    const reductionJPEG = ((1 - statsJPEG.size / statsOriginal.size) * 100).toFixed(0);
    console.log(`   ✅ JPEG: ${sizeJPEG} KB (${reductionJPEG}% réduction)`);
    
    console.log(`\n   📊 Original: ${sizeOriginal} MB → Meilleur: AVIF ${sizeAVIF} KB (${reductionAVIF}% gain)`);
    
  } catch (error) {
    console.error(`   ❌ Erreur:`, error.message);
  }
}

/**
 * Main
 */
async function main() {
  console.log('🚀 Optimisation des images hero (WebP/AVIF conversion)');
  console.log('📌 Objectif: -4.4 MB payload, LCP 28.1s → <5s\n');
  console.log('⚙️  Configuration:');
  console.log(`   - WebP: quality ${CONFIG.webp.quality}, effort ${CONFIG.webp.effort}`);
  console.log(`   - AVIF: quality ${CONFIG.avif.quality}, effort ${CONFIG.avif.effort}`);
  console.log(`   - Resize: max ${CONFIG.resize.width}px width`);
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  // Traiter chaque image séquentiellement
  for (const imageConfig of HERO_IMAGES) {
    await optimizeImage(imageConfig);
  }
  
  console.log('\n✅ Optimisation terminée !');
  console.log('\n📝 PROCHAINES ÉTAPES:');
  console.log('   1. Renommer les fichiers optimisés:');
  console.log('      mv hero-optimized.jpg hero-original-backup.jpg');
  console.log('      mv hero.webp hero-optimized.webp (Next.js auto-serve WebP)');
  console.log('   2. Vérifier visuellement la qualité des images');
  console.log('   3. Déployer et tester PageSpeed (LCP attendu <5s)');
}

// Vérifier que Sharp est installé
try {
  require.resolve('sharp');
} catch (error) {
  console.error('❌ Sharp non installé. Installer avec:');
  console.error('   npm install --save-dev sharp');
  process.exit(1);
}

main().catch(console.error);
