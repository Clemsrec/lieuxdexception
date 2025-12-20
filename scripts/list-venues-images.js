/**
 * Lister tous les venues et leurs images hero/logos
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../firebase-service-account.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
db.settings({ databaseId: 'lieuxdexception' });

async function listVenues() {
  console.log('📋 LISTE DES VENUES ET IMAGES\n');

  const snapshot = await db.collection('venues').get();
  
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`ID: ${doc.id}`);
    console.log(`Nom: ${data.name}`);
    console.log(`Hero: ${data.heroImage || 'N/A'}`);
    console.log(`Logo: ${data.logo || 'N/A'}`);
    if (data.galleries?.mariages && data.galleries.mariages.length > 0) {
      console.log(`Mariages gallery:`);
      data.galleries.mariages.slice(0, 3).forEach((img, i) => {
        console.log(`  ${i + 1}. ${img}`);
      });
    }
  });
}

listVenues().catch(console.error);
