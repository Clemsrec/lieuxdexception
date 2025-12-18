/**
 * Script pour uploader toutes les images de venues depuis /public/venues vers Firebase Storage
 * Préserve la structure des dossiers : venues/{slug}/{sous-dossier}/{fichier}
 * 
 * Structure attendue :
 * /public/venues/
 *   ├── chateau-brulaire/
 *   │   ├── hero.jpg
 *   │   ├── b2b/...
 *   │   └── mariages/...
 *   ├── domaine-nantais/...
 *   └── ...
 * 
 * Devient dans Storage :
 * venues/
 *   ├── chateau-brulaire/
 *   │   ├── hero.jpg
 *   │   ├── b2b/...
 *   │   └── mariages/...
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialiser Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = require('../firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'lieux-d-exceptions.firebasestorage.app'
  });
}

const bucket = admin.storage().bucket();
const publicVenuesDir = path.join(__dirname, '..', 'public', 'venues');

/**
 * Récupère tous les fichiers images d'un dossier récursivement
 */
function getImageFiles(dir, baseDir = dir) {
  let files = [];
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Récursion dans les sous-dossiers
      files = files.concat(getImageFiles(fullPath, baseDir));
    } else if (stat.isFile()) {
      // Vérifier si c'est une image
      const ext = path.extname(item).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        // Chemin relatif depuis baseDir pour préserver structure
        const relativePath = path.relative(baseDir, fullPath);
        files.push({
          localPath: fullPath,
          relativePath: relativePath
        });
      }
    }
  }
  
  return files;
}

/**
 * Upload un fichier vers Storage
 */
async function uploadFile(localPath, storagePath) {
  try {
    await bucket.upload(localPath, {
      destination: storagePath,
      metadata: {
        contentType: getContentType(localPath),
        metadata: {
          uploadedBy: 'migration-script',
          uploadedAt: new Date().toISOString(),
          source: 'public/venues'
        }
      }
    });
    
    // Générer URL publique avec ?alt=media
    const encodedPath = storagePath.split('/').map(encodeURIComponent).join('/');
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media`;
    
    console.log(`✅ ${storagePath}`);
    return publicUrl;
  } catch (error) {
    console.error(`❌ Erreur upload ${storagePath}:`, error.message);
    throw error;
  }
}

/**
 * Détermine le Content-Type selon l'extension
 */
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp'
  };
  return types[ext] || 'application/octet-stream';
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Début de la migration des images venues vers Storage\n');
  
  // Vérifier que le dossier existe
  if (!fs.existsSync(publicVenuesDir)) {
    console.error(`❌ Dossier non trouvé: ${publicVenuesDir}`);
    process.exit(1);
  }
  
  // Récupérer tous les dossiers venues
  const venueSlugs = fs.readdirSync(publicVenuesDir).filter(item => {
    const fullPath = path.join(publicVenuesDir, item);
    return fs.statSync(fullPath).isDirectory();
  });
  
  console.log(`📁 ${venueSlugs.length} venues trouvées: ${venueSlugs.join(', ')}\n`);
  
  let totalFiles = 0;
  let uploadedFiles = 0;
  let failedFiles = 0;
  const uploadedUrls = {};
  
  // Traiter chaque venue
  for (const slug of venueSlugs) {
    console.log(`\n📸 Traitement de ${slug}...`);
    const venueDir = path.join(publicVenuesDir, slug);
    
    // Récupérer tous les fichiers images
    const imageFiles = getImageFiles(venueDir);
    totalFiles += imageFiles.length;
    
    console.log(`   ${imageFiles.length} images trouvées`);
    
    if (!uploadedUrls[slug]) {
      uploadedUrls[slug] = [];
    }
    
    // Upload chaque fichier
    for (const file of imageFiles) {
      const storagePath = `venues/${slug}/${file.relativePath}`;
      
      try {
        const url = await uploadFile(file.localPath, storagePath);
        uploadedFiles++;
        
        uploadedUrls[slug].push({
          localPath: file.relativePath,
          storagePath: storagePath,
          url: url
        });
      } catch (error) {
        failedFiles++;
      }
    }
  }
  
  // Résumé
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ DE LA MIGRATION');
  console.log('='.repeat(60));
  console.log(`Total images trouvées : ${totalFiles}`);
  console.log(`✅ Uploadées avec succès : ${uploadedFiles}`);
  console.log(`❌ Échecs : ${failedFiles}`);
  console.log('='.repeat(60));
  
  // Sauvegarder le mapping dans un fichier JSON
  const mappingPath = path.join(__dirname, 'venues-storage-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(uploadedUrls, null, 2));
  console.log(`\n💾 Mapping sauvegardé dans: ${mappingPath}`);
  
  // Afficher quelques exemples d'URLs
  console.log('\n📋 Exemples d\'URLs générées:');
  for (const [slug, files] of Object.entries(uploadedUrls)) {
    if (files.length > 0) {
      console.log(`\n${slug}:`);
      files.slice(0, 3).forEach(f => {
        console.log(`  ${f.localPath} → ${f.url}`);
      });
      if (files.length > 3) {
        console.log(`  ... et ${files.length - 3} autres`);
      }
    }
  }
  
  console.log('\n✨ Migration terminée !');
  process.exit(0);
}

// Exécution
main().catch(error => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
});
