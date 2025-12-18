/**
 * Script pour vérifier les images du Château de la Corbe
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

async function checkCorbeImages() {
  try {
    const doc = await db.collection('venues').doc('chateau-corbe').get();
    
    if (!doc.exists) {
      console.log('❌ Document chateau-corbe introuvable dans Firestore');
      return;
    }
    
    const data = doc.data();
    
    console.log('🏰 Château de la Corbe - Configuration Images:\n');
    console.log('📍 ID:', doc.id);
    console.log('📛 Nom:', data.name);
    console.log('🔄 Actif:', data.active);
    console.log('\n📸 Images:');
    console.log('   Hero Image:', data.heroImage || '❌ NON DÉFINI');
    console.log('   Images B2B:', data.images?.b2b?.length || 0, 'photos');
    console.log('   Images Mariages:', data.images?.weddings?.length || 0, 'photos');
    
    if (data.heroImage) {
      console.log('\n✅ Chemin hero actuel:', data.heroImage);
    } else {
      console.log('\n❌ PROBLÈME: heroImage manquant!');
      console.log('   Le chemin devrait être: /venues/chateau-corbe/hero.jpg');
    }

    // Afficher les détails complets des images
    if (data.images) {
      console.log('\n📂 Détails complets:');
      console.log(JSON.stringify(data.images, null, 2));
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

checkCorbeImages();
