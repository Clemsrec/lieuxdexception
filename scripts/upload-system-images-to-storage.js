/**
 * Script pour uploader les images système dans Firebase Storage
 * 
 * Usage: node scripts/upload-system-images-to-storage.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialiser Firebase Admin
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(require('../firebase-service-account.json')),
    storageBucket: 'lieux-d-exceptions.firebasestorage.app'
  });
}

const bucket = admin.storage().bucket();

/**
 * Upload un fichier vers Storage
 */
async function uploadFile(localPath, storagePath) {
  const fullLocalPath = path.join(__dirname, '..', localPath);
  
  if (!fs.existsSync(fullLocalPath)) {
    console.log(`❌ Fichier introuvable: ${fullLocalPath}`);
    return null;
  }

  try {
    console.log(`📤 Upload: ${localPath} → ${storagePath}`);
    
    await bucket.upload(fullLocalPath, {
      destination: storagePath,
      metadata: {
        contentType: getContentType(localPath),
        metadata: {
          uploadedAt: new Date().toISOString(),
          source: 'migration-from-public',
        }
      },
    });

    // Obtenir l'URL publique permanente (avec ?alt=media)
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(storagePath)}?alt=media`;

    console.log(`✅ Uploadé: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`❌ Erreur upload ${localPath}:`, error.message);
    return null;
  }
}

/**
 * Obtenir le content type selon l'extension
 */
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
  };
  return types[ext] || 'application/octet-stream';
}

/**
 * Créer un placeholder si nécessaire
 */
async function createPlaceholder() {
  // Créer une image placeholder simple (1x1 pixel gris)
  const placeholderPath = path.join(__dirname, '..', 'public', 'images', 'placeholder.jpg');
  
  // Si le placeholder n'existe pas déjà, utiliser Vue-chateau.jpg comme placeholder
  if (!fs.existsSync(placeholderPath)) {
    console.log('⚠️  Placeholder non trouvé, utilisation de Vue-chateau.jpg');
    return await uploadFile('public/images/Vue-chateau.jpg', 'images/placeholder.jpg');
  }
  
  return await uploadFile('public/images/placeholder.jpg', 'images/placeholder.jpg');
}

/**
 * Uploader toutes les images système
 */
async function uploadSystemImages() {
  console.log('\n🚀 Upload des images système vers Firebase Storage...\n');

  const imagesToUpload = [
    {
      local: 'public/images/contact-hero.jpg',
      storage: 'images/contact-hero.jpg',
      description: 'Image Hero page Contact'
    },
    {
      local: 'public/images/Vue-chateau.jpg',
      storage: 'images/Vue-chateau.jpg',
      description: 'Vue château générique'
    },
    {
      local: 'public/images/salle-seminaire.jpg',
      storage: 'images/salle-seminaire.jpg',
      description: 'Salle de séminaire 1'
    },
    {
      local: 'public/images/salle-seminaire2.jpg',
      storage: 'images/salle-seminaire2.jpg',
      description: 'Salle de séminaire 2'
    },
    {
      local: 'public/images/table-seminaire.jpg',
      storage: 'images/table-seminaire.jpg',
      description: 'Table de séminaire'
    },
    {
      local: 'public/images/table.jpg',
      storage: 'images/table.jpg',
      description: 'Table générique'
    },
  ];

  const results = [];

  // Upload du placeholder en premier
  console.log('\n📋 Placeholder image');
  const placeholderUrl = await createPlaceholder();
  if (placeholderUrl) {
    results.push({
      description: 'Image placeholder par défaut',
      storage: 'images/placeholder.jpg',
      url: placeholderUrl,
      success: true,
    });
  }

  // Upload des autres images
  for (const image of imagesToUpload) {
    console.log(`\n📋 ${image.description}`);
    const url = await uploadFile(image.local, image.storage);
    
    if (url) {
      results.push({
        ...image,
        url,
        success: true,
      });
    } else {
      results.push({
        ...image,
        success: false,
      });
    }
  }

  // Résumé
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`\n✅ Réussis: ${successful.length}`);
  console.log(`❌ Échoués: ${failed.length}`);

  if (successful.length > 0) {
    console.log('\n📝 URLs à copier dans src/lib/storage-assets.ts:\n');
    console.log('export const STORAGE_IMAGES = {');
    successful.forEach(r => {
      const key = r.storage.replace('images/', '').replace(/[\/\-\.]/g, '_').replace(/_jpg$/, '').replace(/_jpeg$/, '').replace(/_png$/, '').replace(/_webp$/, '');
      console.log(`  // ${r.description}`);
      console.log(`  ${key}: '${r.url}',\n`);
    });
    console.log('} as const;\n');
  }

  if (failed.length > 0) {
    console.log('\n⚠️  Échecs:');
    failed.forEach(r => {
      console.log(`- ${r.local}`);
    });
  }

  console.log('\n✨ Terminé!\n');
}

// Exécuter
uploadSystemImages().catch(console.error);
