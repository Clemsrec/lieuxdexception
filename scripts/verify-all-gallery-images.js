/**
 * Script pour vérifier l'existence de toutes les images de galerie dans Firebase Storage
 * et identifier les URLs cassées
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
  });
}

const bucket = admin.storage().bucket();
const db = admin.firestore();

async function checkImageExists(imageUrl) {
  try {
    // Extraire le chemin du fichier depuis l'URL
    const urlParts = imageUrl.split('/o/')[1];
    if (!urlParts) return { exists: false, error: 'URL invalide' };
    
    const filePath = decodeURIComponent(urlParts.split('?')[0]);
    const file = bucket.file(filePath);
    
    const [exists] = await file.exists();
    return { exists, filePath };
  } catch (error) {
    return { exists: false, error: error.message };
  }
}

async function checkAllGalleries() {
  console.log('🔍 Vérification de toutes les images de galerie\n');

  const venuesSnapshot = await db.collection('venues').get();
  
  let totalImages = 0;
  let totalMissing = 0;
  let totalValid = 0;
  const missingByVenue = {};

  for (const doc of venuesSnapshot.docs) {
    const data = doc.data();
    const gallery = data.images?.gallery || [];
    
    if (gallery.length === 0) continue;

    console.log(`\n🏰 ${data.name} (${data.slug})`);
    console.log(`   📊 ${gallery.length} images dans la galerie`);
    
    const missing = [];
    
    for (let i = 0; i < gallery.length; i++) {
      const imageUrl = gallery[i];
      const result = await checkImageExists(imageUrl);
      
      totalImages++;
      
      if (!result.exists) {
        totalMissing++;
        missing.push({
          index: i + 1,
          url: imageUrl.substring(0, 100),
          path: result.filePath,
          error: result.error
        });
        console.log(`   ❌ Photo ${i + 1}: ${result.filePath || imageUrl.substring(0, 80)}`);
      } else {
        totalValid++;
      }
    }
    
    if (missing.length > 0) {
      missingByVenue[data.slug] = {
        name: data.name,
        missing: missing
      };
    } else {
      console.log(`   ✅ Toutes les images existent`);
    }
  }

  // Résumé
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ');
  console.log('='.repeat(60));
  console.log(`Total images vérifiées: ${totalImages}`);
  console.log(`✅ Images valides: ${totalValid}`);
  console.log(`❌ Images manquantes: ${totalMissing}`);
  
  if (totalMissing > 0) {
    console.log('\n⚠️  IMAGES MANQUANTES PAR LIEU:');
    console.log('='.repeat(60));
    for (const [slug, data] of Object.entries(missingByVenue)) {
      console.log(`\n${data.name} (${slug}):`);
      data.missing.forEach(img => {
        console.log(`  - Photo ${img.index}: ${img.path || 'Chemin invalide'}`);
        if (img.error) console.log(`    Erreur: ${img.error}`);
      });
    }
  }

  process.exit(0);
}

checkAllGalleries().catch(error => {
  console.error('❌ Erreur:', error);
  process.exit(1);
});
