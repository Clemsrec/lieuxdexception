/**
 * Script pour afficher en détail les images de chaque venue
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialiser Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = require(serviceAccountPath);

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

async function debugVenuesImages() {
  try {
    const venuesSnapshot = await db.collection('venues').get();
    
    console.log('\n🔍 IMAGES UTILISÉES PAR LE CODE (venue.images?.hero || venue.heroImage || venue.image)\n');
    
    venuesSnapshot.forEach(doc => {
      const venue = doc.data();
      
      // Simuler la logique du composant
      const imageUsed = venue.images?.hero || venue.heroImage || venue.image || '/images/placeholder.jpg';
      
      console.log(`\n🏰 ${venue.name} (${doc.id})`);
      console.log(`   ➡️  IMAGE AFFICHÉE: ${imageUsed}`);
      console.log(`   Détails:`);
      console.log(`      venue.images?.hero = ${venue.images?.hero || 'undefined'}`);
      console.log(`      venue.heroImage = ${venue.heroImage || 'undefined'}`);
      console.log(`      venue.image = ${venue.image || 'undefined'}`);
    });

    console.log('\n');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    process.exit(0);
  }
}

debugVenuesImages();
