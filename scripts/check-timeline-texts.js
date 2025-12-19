const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

async function checkTimeline() {
  console.log('📖 Vérification des textes de la timeline...\n');
  
  const snapshot = await db.collection('timeline').get();
  
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📅 ${data.year} - ${data.title}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Description: ${data.description}`);
    console.log(`ID: ${doc.id}`);
  });
  
  console.log('\n✅ Vérification terminée\n');
}

checkTimeline()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
