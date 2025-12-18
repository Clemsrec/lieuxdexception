#!/usr/bin/env node

/**
 * Script de migration des images vers Firebase Storage
 * 
 * Migre toutes les images de public/Photos chateaux/ vers Firebase Storage
 * avec organisation automatique par château et catégorie (b2b/mariages/galerie)
 * 
 * Usage: node scripts/migrate-images-to-storage.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Initialisation Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
});

const bucket = admin.storage().bucket();

// Configuration
const SOURCE_DIR = path.join(__dirname, '..', 'public', 'Photos chateaux');
const LOGOS_SOURCE = path.join(__dirname, '..', 'public', 'logos');
const DRY_RUN = process.argv.includes('--dry-run');

// Mapping noms dossiers → slugs Firebase Storage
const VENUE_MAPPING = {
  'Château de la Brûlaire': 'le-chateau-de-la-brulaire',
  'Château de la Corbe': 'le-chateau-de-la-corbe',
  'Domaine Nantais': 'le-domaine-nantais',
  'Le Dôme': 'le-dome',
  'Manoir de la Boulaie': 'le-manoir-de-la-boulaie',
};

const CATEGORY_MAPPING = {
  'B2B': 'b2b',
  'MARIAGES': 'mariages',
  'GALERIE Onglet MARIAGES & PRIVÉS': 'galerie-mariages',
  'GALERIE Onglet SÉMINAIRES & PRO': 'galerie-b2b',
  'EN-TÊTE SITE INTERNET': 'hero-images',
};

// Statistiques
const stats = {
  totalFiles: 0,
  uploaded: 0,
  skipped: 0,
  errors: 0,
  byVenue: {},
  errorDetails: [],
};

/**
 * Vérifie si le fichier est une image
 */
function isImageFile(filename) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'];
  const ext = path.extname(filename).toLowerCase();
  return imageExtensions.includes(ext);
}

/**
 * Génère les métadonnées à partir du nom de fichier
 */
function generateMetadata(filename, venueName, category) {
  const nameWithoutExt = path.basename(filename, path.extname(filename));
  
  // Nettoyer le nom (enlever numéros, underscores, etc.)
  const cleanName = nameWithoutExt
    .replace(/[_-]/g, ' ')
    .replace(/\d+/g, '')
    .trim();
  
  const alt = `${venueName} - ${category} - ${cleanName}`;
  const title = cleanName || filename;
  const description = `Image de ${venueName} pour la catégorie ${category}`;
  
  return { alt, title, description };
}

/**
 * Upload un fichier vers Firebase Storage
 */
async function uploadFile(localPath, storagePath, metadata) {
  try {
    const destination = bucket.file(storagePath);
    
    // Vérifier si le fichier existe déjà
    const [exists] = await destination.exists();
    if (exists) {
      console.log(`   ⏭️  Existe déjà: ${storagePath}`);
      stats.skipped++;
      return false;
    }
    
    if (DRY_RUN) {
      console.log(`   🔍 [DRY-RUN] Uploadrait: ${storagePath}`);
      stats.uploaded++;
      return true;
    }
    
    // Upload le fichier
    await bucket.upload(localPath, {
      destination: storagePath,
      metadata: {
        contentType: getMimeType(localPath),
        metadata: metadata,
      },
    });
    
    console.log(`   ✅ Uploadé: ${storagePath}`);
    stats.uploaded++;
    return true;
    
  } catch (error) {
    console.error(`   ❌ Erreur upload ${storagePath}:`, error.message);
    stats.errors++;
    stats.errorDetails.push({
      file: storagePath,
      error: error.message,
    });
    return false;
  }
}

/**
 * Détermine le MIME type
 */
function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.avif': 'image/avif',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Parcourt récursivement un dossier et upload les images
 */
async function processDirectory(dir, storagePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Ignorer fichiers cachés
    if (entry.name.startsWith('.')) continue;
    
    if (entry.isDirectory()) {
      // Récursion dans sous-dossiers
      const newStoragePath = storagePath ? `${storagePath}/${entry.name}` : entry.name;
      await processDirectory(fullPath, newStoragePath);
    } else if (entry.isFile() && isImageFile(entry.name)) {
      stats.totalFiles++;
      
      // Upload le fichier
      const fileStoragePath = storagePath ? `${storagePath}/${entry.name}` : entry.name;
      await uploadFile(fullPath, fileStoragePath, {
        uploadedAt: new Date().toISOString(),
        source: 'migration-script',
      });
    }
  }
}

/**
 * Migre les images d'un château
 */
async function migrateVenue(venueFolderName, venueSlug) {
  const venuePath = path.join(SOURCE_DIR, venueFolderName);
  
  if (!fs.existsSync(venuePath)) {
    console.log(`⚠️  Dossier introuvable: ${venueFolderName}`);
    return;
  }
  
  console.log(`\n📍 Migration: ${venueFolderName} → ${venueSlug}`);
  stats.byVenue[venueSlug] = { uploaded: 0, skipped: 0, errors: 0 };
  
  const venueStartUploaded = stats.uploaded;
  const venueStartSkipped = stats.skipped;
  const venueStartErrors = stats.errors;
  
  // Lire les catégories (B2B, MARIAGES)
  const entries = fs.readdirSync(venuePath, { withFileTypes: true });
  
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    
    const categoryPath = path.join(venuePath, entry.name);
    const categorySlug = CATEGORY_MAPPING[entry.name] || entry.name.toLowerCase();
    
    console.log(`  📂 Catégorie: ${entry.name} → ${categorySlug}`);
    
    // Lire toutes les images de cette catégorie
    const images = fs.readdirSync(categoryPath).filter(file => isImageFile(file));
    
    for (const image of images) {
      const localPath = path.join(categoryPath, image);
      const storagePath = `${venueSlug}/${categorySlug}/${image}`;
      const metadata = generateMetadata(image, venueFolderName, entry.name);
      
      stats.totalFiles++;
      await uploadFile(localPath, storagePath, metadata);
    }
  }
  
  stats.byVenue[venueSlug].uploaded = stats.uploaded - venueStartUploaded;
  stats.byVenue[venueSlug].skipped = stats.skipped - venueStartSkipped;
  stats.byVenue[venueSlug].errors = stats.errors - venueStartErrors;
}

/**
 * Migre les logos
 */
async function migrateLogos() {
  console.log(`\n🎨 Migration des logos`);
  
  if (!fs.existsSync(LOGOS_SOURCE)) {
    console.log(`⚠️  Dossier logos introuvable: ${LOGOS_SOURCE}`);
    return;
  }
  
  const logos = fs.readdirSync(LOGOS_SOURCE).filter(file => isImageFile(file));
  
  for (const logo of logos) {
    const localPath = path.join(LOGOS_SOURCE, logo);
    const storagePath = `Logos/${logo}`;
    
    stats.totalFiles++;
    await uploadFile(localPath, storagePath, {
      alt: `Logo - ${logo}`,
      title: logo,
      category: 'logos',
      uploadedAt: new Date().toISOString(),
      source: 'migration-script',
    });
  }
}

/**
 * Migre les galeries génériques
 */
async function migrateGenericGalleries() {
  console.log(`\n🖼️  Migration des galeries génériques`);
  
  for (const [folderName, slug] of Object.entries(CATEGORY_MAPPING)) {
    if (!folderName.startsWith('GALERIE') && !folderName.startsWith('EN-TÊTE')) continue;
    
    const galleryPath = path.join(SOURCE_DIR, folderName);
    
    if (!fs.existsSync(galleryPath)) continue;
    
    console.log(`  📂 ${folderName} → galerie-generale/${slug}`);
    
    await processDirectory(galleryPath, `galerie-generale/${slug}`);
  }
}

/**
 * Génère le rapport final
 */
function generateReport() {
  const reportPath = path.join(__dirname, '..', 'migration-report.json');
  
  const report = {
    timestamp: new Date().toISOString(),
    dryRun: DRY_RUN,
    summary: {
      totalFiles: stats.totalFiles,
      uploaded: stats.uploaded,
      skipped: stats.skipped,
      errors: stats.errors,
      successRate: ((stats.uploaded / stats.totalFiles) * 100).toFixed(2) + '%',
    },
    byVenue: stats.byVenue,
    errors: stats.errorDetails,
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 RAPPORT DE MIGRATION`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Mode: ${DRY_RUN ? '🔍 DRY-RUN (simulation)' : '🚀 PRODUCTION'}`);
  console.log(`Fichiers totaux: ${stats.totalFiles}`);
  console.log(`✅ Uploadés: ${stats.uploaded}`);
  console.log(`⏭️  Ignorés (déjà existants): ${stats.skipped}`);
  console.log(`❌ Erreurs: ${stats.errors}`);
  console.log(`📈 Taux de succès: ${report.summary.successRate}`);
  console.log(`\n📄 Rapport détaillé sauvegardé: ${reportPath}`);
  console.log(`${'='.repeat(60)}\n`);
  
  if (stats.errors > 0) {
    console.log(`⚠️  ${stats.errors} erreur(s) détectée(s). Voir migration-report.json pour les détails.`);
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 MIGRATION IMAGES VERS FIREBASE STORAGE`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Mode: ${DRY_RUN ? '🔍 DRY-RUN (aucun upload réel)' : '🚀 PRODUCTION'}`);
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Bucket: ${bucket.name}`);
  console.log(`${'='.repeat(60)}\n`);
  
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Erreur: Dossier source introuvable: ${SOURCE_DIR}`);
    process.exit(1);
  }
  
  try {
    // 1. Migrer les logos
    await migrateLogos();
    
    // 2. Migrer chaque château
    for (const [folderName, slug] of Object.entries(VENUE_MAPPING)) {
      await migrateVenue(folderName, slug);
    }
    
    // 3. Migrer les galeries génériques
    await migrateGenericGalleries();
    
    // 4. Générer le rapport
    generateReport();
    
    console.log(`\n✅ Migration terminée avec succès !`);
    
    if (DRY_RUN) {
      console.log(`\n💡 Pour lancer la migration réelle, exécutez:`);
      console.log(`   node scripts/migrate-images-to-storage.js`);
    }
    
  } catch (error) {
    console.error(`\n❌ Erreur fatale:`, error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Exécution
main();
