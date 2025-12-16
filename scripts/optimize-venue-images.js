#!/usr/bin/env node

/**
 * Script d'optimisation des images venues
 * - Optimise toutes les photos dans public/venues/
 * - Convertit en WebP (qualité 85%)
 * - Redimensionne si > 1920px
 * - Garde les originaux en backup
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const VENUES_DIR = path.join(__dirname, '../public/venues');
const BACKUP_DIR = path.join(__dirname, '../public/venues-backup');

const CONFIG = {
  quality: 85,
  maxWidth: 1920,
  maxHeight: 1920,
  webpQuality: 85,
  jpegQuality: 85
};

let stats = {
  processed: 0,
  optimized: 0,
  skipped: 0,
  errors: 0,
  originalSize: 0,
  optimizedSize: 0
};

/**
 * Formate la taille en unités lisibles
 */
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Vérifie si un fichier doit être optimisé
 */
function shouldOptimize(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ['.jpg', '.jpeg', '.png'].includes(ext);
}

/**
 * Optimise une image
 */
async function optimizeImage(filePath) {
  try {
    const filename = path.basename(filePath);
    const dirname = path.dirname(filePath);
    
    // Stats du fichier original
    const originalStats = fs.statSync(filePath);
    stats.originalSize += originalStats.size;
    
    // Créer backup si nécessaire
    const relativePath = path.relative(VENUES_DIR, filePath);
    const backupPath = path.join(BACKUP_DIR, relativePath);
    const backupDir = path.dirname(backupPath);
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Copier en backup seulement si pas déjà fait
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
    }
    
    // Charger l'image
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Déterminer si redimensionnement nécessaire
    let needsResize = false;
    let targetWidth = metadata.width;
    let targetHeight = metadata.height;
    
    if (metadata.width > CONFIG.maxWidth || metadata.height > CONFIG.maxHeight) {
      needsResize = true;
      
      // Calculer les nouvelles dimensions en conservant le ratio
      if (metadata.width > metadata.height) {
        targetWidth = CONFIG.maxWidth;
        targetHeight = Math.round(metadata.height * (CONFIG.maxWidth / metadata.width));
      } else {
        targetHeight = CONFIG.maxHeight;
        targetWidth = Math.round(metadata.width * (CONFIG.maxHeight / metadata.height));
      }
    }
    
    // Préparer le pipeline d'optimisation
    let pipeline = image;
    
    if (needsResize) {
      pipeline = pipeline.resize(targetWidth, targetHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Optimiser selon le format
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.png') {
      pipeline = pipeline.png({
        quality: CONFIG.jpegQuality,
        compressionLevel: 9,
        adaptiveFiltering: true
      });
    } else {
      pipeline = pipeline.jpeg({
        quality: CONFIG.jpegQuality,
        progressive: true,
        mozjpeg: true
      });
    }
    
    // Sauvegarder l'image optimisée
    await pipeline.toFile(filePath + '.tmp');
    
    // Remplacer l'original
    fs.renameSync(filePath + '.tmp', filePath);
    
    // Stats du fichier optimisé
    const optimizedStats = fs.statSync(filePath);
    stats.optimizedSize += optimizedStats.size;
    
    const reduction = ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(1);
    
    console.log(`   ✅ ${filename}`);
    console.log(`      ${formatSize(originalStats.size)} → ${formatSize(optimizedStats.size)} (-${reduction}%)`);
    
    if (needsResize) {
      console.log(`      Redimensionné: ${metadata.width}×${metadata.height} → ${targetWidth}×${targetHeight}`);
    }
    
    stats.optimized++;
    
  } catch (error) {
    console.error(`   ❌ Erreur: ${path.basename(filePath)} - ${error.message}`);
    stats.errors++;
  }
}

/**
 * Traite récursivement un dossier
 */
async function processDirectory(dirPath, venueName = '') {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Récursif sur les sous-dossiers
      await processDirectory(itemPath, venueName || item);
    } else if (stat.isFile() && shouldOptimize(itemPath)) {
      stats.processed++;
      await optimizeImage(itemPath);
    }
  }
}

/**
 * Traite tous les lieux
 */
async function optimizeAllVenues() {
  console.log('🎨 Optimisation des images des lieux');
  console.log('='.repeat(60));
  console.log(`📁 Dossier: ${VENUES_DIR}`);
  console.log(`💾 Backup: ${BACKUP_DIR}`);
  console.log(`⚙️  Qualité: ${CONFIG.jpegQuality}%`);
  console.log(`📐 Taille max: ${CONFIG.maxWidth}px`);
  console.log('='.repeat(60));
  
  // Créer le dossier de backup
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log('✅ Dossier backup créé\n');
  }
  
  // Lister les lieux
  const venues = fs.readdirSync(VENUES_DIR).filter(item => {
    const itemPath = path.join(VENUES_DIR, item);
    return fs.statSync(itemPath).isDirectory();
  });
  
  console.log(`📍 ${venues.length} lieu(x) trouvé(s): ${venues.join(', ')}\n`);
  
  // Traiter chaque lieu
  for (const venue of venues) {
    console.log(`\n🏰 ${venue.toUpperCase()}`);
    const venuePath = path.join(VENUES_DIR, venue);
    await processDirectory(venuePath, venue);
  }
}

/**
 * Affiche le rapport final
 */
function displayReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 RAPPORT D\'OPTIMISATION');
  console.log('='.repeat(60));
  console.log(`✅ Images optimisées: ${stats.optimized}`);
  console.log(`⏭️  Images ignorées: ${stats.skipped}`);
  console.log(`❌ Erreurs: ${stats.errors}`);
  console.log(`📈 Total traité: ${stats.processed}`);
  console.log('');
  console.log(`💾 Taille originale: ${formatSize(stats.originalSize)}`);
  console.log(`🎯 Taille optimisée: ${formatSize(stats.optimizedSize)}`);
  
  if (stats.originalSize > 0) {
    const totalReduction = ((stats.originalSize - stats.optimizedSize) / stats.originalSize * 100).toFixed(1);
    const savedSpace = stats.originalSize - stats.optimizedSize;
    console.log(`🔥 Gain total: ${formatSize(savedSpace)} (-${totalReduction}%)`);
  }
  
  console.log('='.repeat(60));
  
  if (stats.optimized > 0) {
    console.log('\n💡 Prochaines étapes :');
    console.log('   1. Vérifier visuellement les images optimisées');
    console.log('   2. Si OK, supprimer le backup: rm -rf public/venues-backup');
    console.log('   3. Mettre à jour les chemins dans Firestore');
    console.log('   4. Commit et push les changements\n');
  }
}

// Exécution principale
(async () => {
  try {
    await optimizeAllVenues();
    displayReport();
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
})();
