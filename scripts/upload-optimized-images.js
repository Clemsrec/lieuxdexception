const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'lieux-d-exceptions.firebasestorage.app'
  });
}

const bucket = admin.storage().bucket();

/**
 * Upload un fichier vers Firebase Storage
 */
async function uploadToStorage(localPath, storagePath, contentType) {
  const stats = fs.statSync(localPath);
  console.log(`   📏 Taille: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`   ☁️  Upload vers: ${storagePath}`);

  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: {
      contentType,
      cacheControl: 'public, max-age=31536000', // 1 an
    }
  });

  console.log(`   ✅ Upload terminé`);
  return stats.size;
}

async function main() {
  console.log('☁️  Upload des images optimisées vers Firebase Storage\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const publicDir = path.join(__dirname, '../public');
  
  const uploads = [
    {
      name: 'Hero Brûlaire (WebP)',
      localPath: path.join(publicDir, 'venues/chateau-brulaire/hero.webp'),
      storagePath: 'venues/chateau-brulaire/hero.webp',
      contentType: 'image/webp'
    },
    {
      name: 'Hero Corbe (optimisé)',
      localPath: path.join(publicDir, 'venues/chateau-corbe/hero-optimized.webp'),
      storagePath: 'venues/chateau-corbe/hero.webp',
      contentType: 'image/webp'
    },
    {
      name: 'Image cocktail Domaine',
      localPath: path.join(publicDir, 'venues/domaine-nantais/mariages/domaine_cocktail_1-optimized.webp'),
      storagePath: 'venues/domaine-nantais/mariages/domaine_cocktail_1.webp',
      contentType: 'image/webp'
    }
  ];

  const results = [];

  for (const upload of uploads) {
    console.log(`\n🔧 ${upload.name}`);
    
    try {
      if (!fs.existsSync(upload.localPath)) {
        console.log(`   ⚠️  Fichier non trouvé: ${path.basename(upload.localPath)}`);
        continue;
      }

      const size = await uploadToStorage(upload.localPath, upload.storagePath, upload.contentType);
      results.push({ name: upload.name, size });

    } catch (error) {
      console.error(`   ❌ Erreur: ${error.message}`);
    }
  }

  console.log('\n\n📊 RÉSUMÉ');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ ${results.length} images uploadées sur Firebase Storage`);
  
  const totalSize = results.reduce((sum, r) => sum + r.size, 0);
  console.log(`📦 Taille totale uploadée: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  results.forEach(r => {
    console.log(`   • ${r.name}: ${(r.size / 1024).toFixed(1)} KB`);
  });

  console.log('\n\n⚠️  PROCHAINES ÉTAPES :');
  console.log('1. Mettre à jour les URLs dans Firestore pour pointer vers les .webp');
  console.log('2. Vérifier que les images s\'affichent correctement');
  console.log('3. Relancer Lighthouse pour mesurer l\'amélioration\n');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
