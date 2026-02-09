/**
 * Script de test d'accessibilité des images de galerie
 * Vérifie que toutes les images Firebase Storage sont accessibles
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const https = require('https');

const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

const db = admin.firestore();

/**
 * Tester l'accessibilité d'une URL
 */
function testImageUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({
        url,
        status: res.statusCode,
        accessible: res.statusCode === 200
      });
    }).on('error', (err) => {
      resolve({
        url,
        status: 'ERROR',
        accessible: false,
        error: err.message
      });
    });
  });
}

/**
 * Tester les galeries
 */
async function testGalleries() {
  try {
    console.log('\n=== TEST ACCESSIBILITÉ DES GALERIES ===\n');

    const snapshot = await db.collection('venues').get();
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const galleryImages = data.images?.gallery || [];
      
      if (galleryImages.length === 0) {
        console.log(`⚠️  ${data.name} : Aucune image de galerie`);
        continue;
      }

      console.log(`\n🏰 ${data.name} (${galleryImages.length} images)`);
      console.log('─'.repeat(60));

      // Tester les 3 premières images
      const samplesToTest = galleryImages.slice(0, 3);
      
      for (let i = 0; i < samplesToTest.length; i++) {
        const url = samplesToTest[i];
        const result = await testImageUrl(url);
        
        if (result.accessible) {
          console.log(`  ✅ Image ${i + 1} : OK (${result.status})`);
        } else {
          console.log(`  ❌ Image ${i + 1} : ERREUR (${result.status})`);
          console.log(`     URL: ${url.substring(0, 80)}...`);
          if (result.error) {
            console.log(`     Erreur: ${result.error}`);
          }
        }
      }

      if (galleryImages.length > 3) {
        console.log(`  ℹ️  ... et ${galleryImages.length - 3} autres images`);
      }
    }

    console.log('\n=== FIN DU TEST ===\n');

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

testGalleries()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
