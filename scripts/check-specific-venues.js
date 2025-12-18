/**
 * Vérifier les URLs des venues spécifiques qui ne s'affichent pas
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function checkVenues() {
  console.log('🔍 Vérification venues problématiques\n');

  const slugs = ['manoir-boulaie', 'domaine-nantais', 'le-dome'];

  for (const slug of slugs) {
    const snapshot = await db.collection('venues').where('slug', '==', slug).get();
    
    if (snapshot.empty) {
      console.log(`❌ Venue non trouvée: ${slug}\n`);
      continue;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    
    console.log(`🏰 ${data.name} (${slug})`);
    console.log(`   ID: ${doc.id}`);
    console.log(`   images.hero: ${data.images?.hero || '❌ MANQUANT'}`);
    console.log(`   heroImage: ${data.heroImage || '(vide)'}`);
    console.log(`   image: ${data.image || '(vide)'}`);
    console.log();
  }
  
  process.exit(0);
}

checkVenues().catch(error => {
  console.error('❌ Erreur:', error);
  process.exit(1);
});
