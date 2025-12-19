const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

async function checkHistoire() {
  try {
    const doc = await db.collection('pageContents').doc('histoire_fr').get();
    if (doc.exists) {
      console.log('✅ histoire_fr existe dans Firestore');
      console.log('Titre:', doc.data().hero?.title || 'N/A');
      console.log('Sous-titre:', doc.data().hero?.subtitle || 'N/A');
    } else {
      console.log('❌ histoire_fr n\'existe pas dans Firestore');
      console.log('⚠️  Exécuter: node scripts/init-page-contents.js');
    }
  } catch (error) {
    console.error('Erreur:', error.message);
  }
  process.exit(0);
}

checkHistoire();
