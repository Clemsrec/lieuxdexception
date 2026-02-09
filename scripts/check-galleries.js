/**
 * Script de vérification des galeries
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

const db = admin.firestore();

async function checkGalleries() {
  try {
    const snapshot = await db.collection('venues').get();
    
    console.log('\n=== VÉRIFICATION DES GALERIES PHOTOS ===\n');
    
    let totalVenues = 0;
    let venuesWithGallery = 0;
    let venuesWithoutGallery = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      totalVenues++;
      
      console.log('🏰', data.name || 'Sans nom');
      
      const galleryCount = data.images?.gallery?.length || 0;
      const legacyGalleryCount = data.gallery?.length || 0;
      
      console.log('  images.gallery:', galleryCount, 'photos');
      
      if (galleryCount > 0) {
        venuesWithGallery++;
        console.log('  ✅ Galerie présente');
        console.log('  Exemples URLs:');
        data.images.gallery.slice(0, 2).forEach((url, i) => {
          console.log(`    ${i + 1}. ${url}`);
        });
      } else if (legacyGalleryCount > 0) {
        console.log('  ⚠️  Galerie dans ancien format (data.gallery):', legacyGalleryCount, 'photos');
        venuesWithGallery++;
      } else {
        console.log('  ❌ Aucune galerie');
        venuesWithoutGallery++;
      }
      
      console.log('');
    });
    
    console.log('=== RÉSUMÉ ===');
    console.log(`Total lieux: ${totalVenues}`);
    console.log(`Avec galerie: ${venuesWithGallery}`);
    console.log(`Sans galerie: ${venuesWithoutGallery}`);
    console.log('');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

checkGalleries()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
