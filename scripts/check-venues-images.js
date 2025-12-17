/**
 * Script pour vérifier et afficher tous les chemins d'images des venues
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialiser Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
});

const db = admin.firestore();

async function checkVenuesImages() {
  try {
    console.log('🔍 Vérification des chemins d\'images dans Firestore...\n');

    const venuesSnapshot = await db.collection('venues').get();
    
    venuesSnapshot.forEach(doc => {
      const venue = doc.data();
      console.log(`\n🏰 ${venue.name} (${doc.id})`);
      console.log(`   Hero: ${venue.heroImage || venue.image || 'NON DÉFINI'}`);
      console.log(`   images.hero: ${venue.images?.hero || 'NON DÉFINI'}`);
      console.log(`   images.heroImage: ${venue.images?.heroImage || 'NON DÉFINI'}`);
      console.log(`   cardImage: ${venue.cardImage || 'NON DÉFINI'}`);
      console.log(`   images.cardImage: ${venue.images?.cardImage || 'NON DÉFINI'}`);
    });

    console.log('\n✅ Vérification terminée');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    process.exit(0);
  }
}

checkVenuesImages();
