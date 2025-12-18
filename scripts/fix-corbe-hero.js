/**
 * Script pour corriger les références d'images du Château de la Corbe
 * Le fichier hero.jpg existe mais Firestore référence hero.webp
 */

const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

async function fixCorbeHeroImage() {
  try {
    const venueRef = db.collection('venues').doc('chateau-corbe');
    
    console.log('🔧 Correction des références d\'images pour le Château de la Corbe...\n');
    
    // Mise à jour des champs
    await venueRef.update({
      'heroImage': '/venues/chateau-corbe/hero.jpg',
      'images.hero': '/venues/chateau-corbe/hero.jpg',
      'images.cardImage': '/venues/chateau-corbe/hero.jpg',
      'images.heroImage': '/venues/chateau-corbe/hero.jpg',
      'updatedAt': admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('✅ Mise à jour réussie!');
    console.log('   hero.webp → hero.jpg\n');
    
    // Vérification
    const doc = await venueRef.get();
    const data = doc.data();
    
    console.log('📸 Nouvelles références:');
    console.log('   heroImage:', data.heroImage);
    console.log('   images.hero:', data.images?.hero);
    console.log('   images.cardImage:', data.images?.cardImage);
    console.log('   images.heroImage:', data.images?.heroImage);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

fixCorbeHeroImage();
