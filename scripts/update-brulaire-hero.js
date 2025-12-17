/**
 * Script pour mettre à jour l'image hero du Château de la Brûlaire
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

async function updateBrulaireHero() {
  try {
    console.log('🏰 Mise à jour de l\'image hero du Château de la Brûlaire...\n');

    const venueRef = db.collection('venues').doc('chateau-brulaire');
    const newHeroPath = '/venues/chateau-brulaire/hero-aerial.jpg';

    const updates = {
      heroImage: newHeroPath,
      'images.hero': newHeroPath,
      'images.heroImage': newHeroPath,
      image: newHeroPath,
      updatedAt: admin.firestore.Timestamp.now().toDate().toISOString()
    };

    await venueRef.update(updates);

    console.log('✅ Image hero mise à jour avec succès !');
    console.log(`📸 Nouveau chemin: ${newHeroPath}`);
    console.log('\n💡 N\'oubliez pas de placer la nouvelle photo à:');
    console.log('   public/venues/chateau-brulaire/hero-aerial.jpg');

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

updateBrulaireHero();
