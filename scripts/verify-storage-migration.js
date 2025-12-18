/**
 * Script de vérification rapide après migration
 * Affiche les URLs des images hero pour chaque venue
 */

const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = require('../firebase-service-account.json');
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

async function checkVenues() {
  console.log('🔍 Vérification des URLs Storage dans Firestore\n');
  
  const snapshot = await db.collection('venues').get();
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const heroUrl = data.images?.hero || data.heroImage || data.hero || 'non défini';
    const isStorage = heroUrl.includes('firebasestorage.googleapis.com');
    const status = isStorage ? '✅' : '⚠️ ';
    
    console.log(`${status} ${data.name || doc.id}`);
    console.log(`   Hero: ${heroUrl.substring(0, 100)}${heroUrl.length > 100 ? '...' : ''}`);
    
    if (data.cardImage) {
      const isCardStorage = data.cardImage.includes('firebasestorage.googleapis.com');
      console.log(`   Card: ${isCardStorage ? '✅' : '⚠️ '} ${data.cardImage.substring(0, 100)}...`);
    }
    console.log('');
  }
  
  process.exit(0);
}

checkVenues().catch(console.error);
