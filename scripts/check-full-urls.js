/**
 * Script pour vérifier les URLs COMPLÈTES des images dans Firestore
 */

const admin = require('firebase-admin');

// Initialiser Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = require('../firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

async function checkFullUrls() {
  console.log('🔍 Vérification URLs COMPLÈTES dans Firestore:\n');

  const venuesSnapshot = await db.collection('venues').get();

  for (const doc of venuesSnapshot.docs) {
    const data = doc.data();
    console.log(`\n🏰 ${data.name} (${data.slug})`);
    
    if (data.images?.hero) {
      console.log('📸 images.hero:');
      console.log(data.images.hero);
      console.log('   → Contient token?', data.images.hero.includes('token=') ? '✅ OUI' : '❌ NON');
    } else {
      console.log('❌ Pas de images.hero');
    }

    if (data.images?.cardImage) {
      console.log('🃏 images.cardImage:');
      console.log(data.images.cardImage);
    }
  }
}

checkFullUrls()
  .then(() => {
    console.log('\n✅ Vérification terminée');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
