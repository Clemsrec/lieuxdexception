/**
 * Script pour activer tous les châteaux dans Firestore
 * Ajoute le champ active: true à tous les documents de la collection venues
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialiser Firebase Admin
const serviceAccount = require(path.join(__dirname, '..', 'firebase-service-account.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function activateAllVenues() {
  try {
    console.log('🔥 Récupération de tous les châteaux...');
    
    const venuesSnapshot = await db.collection('venues').get();
    console.log(`📊 ${venuesSnapshot.size} châteaux trouvés`);

    if (venuesSnapshot.empty) {
      console.log('⚠️ Aucun château trouvé dans Firestore');
      return;
    }

    const batch = db.batch();
    let count = 0;

    venuesSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`\n✅ Activation: ${doc.id}`);
      console.log(`   Nom: ${data.name}`);
      console.log(`   Active actuel: ${data.active}`);
      console.log(`   Lat/Lng: ${data.lat}, ${data.lng}`);
      
      batch.update(doc.ref, {
        active: true,
        featured: true,
        displayOrder: count + 1,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      count++;
    });

    await batch.commit();
    console.log(`\n🎉 ${count} châteaux activés avec succès !`);
    
    // Vérification
    console.log('\n🔍 Vérification...');
    const activeVenues = await db.collection('venues')
      .where('active', '==', true)
      .get();
    console.log(`✅ ${activeVenues.size} châteaux actifs dans Firestore`);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

activateAllVenues()
  .then(() => {
    console.log('\n✨ Script terminé !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
