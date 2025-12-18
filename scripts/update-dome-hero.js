/**
 * Script pour mettre à jour l'image hero du Château Le Dôme
 * Utilise dome_interieur_1.jpg comme image principale
 */

const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('../firebase-service-account.json');

const app = initializeApp({ 
  credential: require('firebase-admin').credential.cert(serviceAccount) 
});
const db = getFirestore(app);

const NEW_HERO_IMAGE = '/venues/le-dome/mariages/dome_interieur_1.jpg';

async function updateDomeHero() {
  try {
    console.log('🔍 Récupération des données actuelles...');
    
    const domeRef = db.collection('venues').doc('le-dome');
    const doc = await domeRef.get();
    
    if (!doc.exists) {
      console.log('❌ Document le-dome non trouvé');
      process.exit(1);
    }
    
    const currentData = doc.data();
    console.log('📸 Images actuelles:');
    console.log('  - Hero Images:', currentData.heroImages || 'Non défini');
    console.log('  - Featured Image:', currentData.featuredImage || 'Non défini');
    
    console.log('\n🔄 Mise à jour...');
    
    // Mettre à jour avec la nouvelle image (tous les champs possibles)
    await domeRef.update({
      heroImage: NEW_HERO_IMAGE,
      heroImages: [NEW_HERO_IMAGE],
      featuredImage: NEW_HERO_IMAGE,
      'images.hero': NEW_HERO_IMAGE,
      'images.cardImage': NEW_HERO_IMAGE,
      'images.heroImage': NEW_HERO_IMAGE,
      updatedAt: FieldValue.serverTimestamp(),
    });
    
    console.log('✅ Image hero mise à jour avec succès!');
    console.log('   Nouvelle image:', NEW_HERO_IMAGE);
    console.log('\n📸 Tous les champs hero ont été mis à jour.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

updateDomeHero();
