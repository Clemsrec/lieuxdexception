/**
 * Script de vérification détaillée des données venues
 */

const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieuxdexception.firebaseio.com'
  });
}

const db = admin.firestore();

async function checkVenuesData() {
  try {
    const snapshot = await db.collection('venues').get();
    
    console.log('\n📊 DONNÉES COMPLÈTES DES VENUES:\n');
    
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log('\n' + '='.repeat(80));
      console.log(`VENUE: ${data.name || doc.id}`);
      console.log('='.repeat(80));
      console.log(JSON.stringify(data, null, 2));
    });
    
    console.log('\n' + '='.repeat(80));
    console.log(`Total: ${snapshot.size} venues\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkVenuesData();
