/**
 * Script pour uploader les logos dans Firebase Storage
 * 
 * Usage: node scripts/upload-logos-to-storage.js
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

    // Obtenir l'URL publique
    const file = bucket.file(storagePath);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500', // URL valide très longtemps
    });

    console.log(`✅ Uploadé: ${url}`);
    return url;
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
 * Uploader tous les logos
 */
async function uploadLogos() {
  console.log('\n🚀 Upload des logos vers Firebase Storage...\n');

  const logosToUpload = [
    {
      local: 'public/logos/logo-lieux-exception-blanc.png',
      storage: 'logos/logo-lieux-exception-blanc.png',
      description: 'Logo principal blanc (header)'
    },
    {
      local: 'public/logos/Logo-CLE-avec-Texte-Plan-de-travail.png',
      storage: 'logos/logo-lieux-exception-couleur.png',
      description: 'Logo principal couleur'
    },
    {
      local: 'public/logos/Logo_CLE_seule.png',
      storage: 'logos/logo-compact.png',
      description: 'Logo compact'
    },
    // Logos des châteaux
    {
      local: 'public/logos/dome-blanc.png',
      storage: 'logos/venues/dome-blanc.png',
      description: 'Logo Château Le Dôme (blanc)'
    },
    {
      local: 'public/logos/dome-dore.png',
      storage: 'logos/venues/dome-dore.png',
      description: 'Logo Château Le Dôme (doré)'
    },
    {
      local: 'public/logos/brulaire-blanc.png',
      storage: 'logos/venues/brulaire-blanc.png',
      description: 'Logo Château de la Brulaire (blanc)'
    },
    {
      local: 'public/logos/brulaire-dore.png',
      storage: 'logos/venues/brulaire-dore.png',
      description: 'Logo Château de la Brulaire (doré)'
    },
    {
      local: 'public/logos/domaine-blanc.png',
      storage: 'logos/venues/domaine-blanc.png',
      description: 'Logo Domaine (blanc)'
    },
    {
      local: 'public/logos/domaine-dore.png',
      storage: 'logos/venues/domaine-dore.png',
      description: 'Logo Domaine (doré)'
    },
    {
      local: 'public/logos/boulaie-blanc.png',
      storage: 'logos/venues/boulaie-blanc.png',
      description: 'Logo Château de la Boulaie (blanc)'
    },
    {
      local: 'public/logos/boulaie-dore.png',
      storage: 'logos/venues/boulaie-dore.png',
      description: 'Logo Château de la Boulaie (doré)'
    },
  ];

  const results = [];

  for (const logo of logosToUpload) {
    console.log(`\n📋 ${logo.description}`);
    const url = await uploadFile(logo.local, logo.storage);
    
    if (url) {
      results.push({
        ...logo,
        url,
        success: true,
      });
    } else {
      results.push({
        ...logo,
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
    successful.forEach(r => {
      console.log(`// ${r.description}`);
      console.log(`${r.storage.replace(/[\/\-\.]/g, '_')}: '${r.url}',\n`);
    });
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
uploadLogos().catch(console.error);
