const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

async function updateTimeline() {
  try {
    console.log('🔄 Mise à jour des événements de la timeline...\n');

    // Récupérer tous les événements
    const snapshot = await db.collection('timeline').get();
    
    if (snapshot.empty) {
      console.log('❌ Aucun événement trouvé dans la collection timeline');
      return;
    }

    const updates = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const docId = doc.id;
      
      console.log(`📝 Traitement: ${data.year} - ${data.title}`);

      const updateData = {};
      
      // 1. Supprimer tous les sous-titres (subtitle)
      if (data.subtitle) {
        console.log(`   ❌ Suppression du sous-titre: "${data.subtitle}"`);
        updateData.subtitle = '';
      }

      // 2. Pour le Dôme : enlever "Début des événements prévu en 2025"
      if (data.title === 'LE DÔME' && data.description && data.description.includes('Début des événements')) {
        const newDescription = data.description.replace(/\.\s*Début des événements prévu en 2025\./g, '.');
        console.log(`   ✏️  Modification description Dôme`);
        console.log(`   Ancien: ${data.description}`);
        console.log(`   Nouveau: ${newDescription}`);
        updateData.description = newDescription;
      }

      // Appliquer les mises à jour si nécessaire
      if (Object.keys(updateData).length > 0) {
        updateData.updatedAt = admin.firestore.Timestamp.now();
        await db.collection('timeline').doc(docId).update(updateData);
        updates.push(`${data.year} - ${data.title}`);
        console.log(`   ✅ Mis à jour\n`);
      } else {
        console.log(`   ⏭️  Aucune modification nécessaire\n`);
      }
    }

    console.log('\n🎉 Mise à jour terminée !');
    console.log(`\n📊 Événements modifiés (${updates.length}):`);
    updates.forEach(event => console.log(`   • ${event}`));

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

updateTimeline()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
