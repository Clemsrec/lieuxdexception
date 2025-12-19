const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

async function checkVenueImages() {
  console.log('🔍 Vérification des URLs d\'images dans Firestore\n');
  
  const venues = await db.collection('venues').get();
  
  venues.forEach(doc => {
    const data = doc.data();
    console.log(`\n📍 ${data.name || data.slug}`);
    console.log(`   Hero: ${data.heroImage || 'N/A'}`);
  });
}

checkVenueImages()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
