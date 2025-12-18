const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

async function checkVenues() {
  console.log('🔍 Vérification des lieux dans Firestore...\n');
  
  try {
    const snapshot = await db.collection('venues').get();
    
    console.log(`✅ Nombre total de lieux : ${snapshot.size}\n`);
    
    if (snapshot.size === 0) {
      console.log('❌ Aucun lieu trouvé dans Firestore !');
      console.log('💡 Utilisez scripts/import-venues.js pour importer des lieux\n');
      return;
    }
    
    console.log('📋 Détails des lieux :\n');
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`  Nom: ${data.name || 'N/A'}`);
      console.log(`  Slug: ${data.slug || 'N/A'}`);
      console.log(`  Actif: ${data.active !== undefined ? data.active : 'N/A'}`);
      console.log(`  Supprimé: ${data.deleted !== undefined ? data.deleted : 'N/A'}`);
      console.log(`  Types événements: ${data.eventTypes ? data.eventTypes.join(', ') : 'N/A'}`);
      console.log('---');
    });
    
    // Statistiques
    const actifs = snapshot.docs.filter(doc => doc.data().active === true).length;
    const inactifs = snapshot.docs.filter(doc => doc.data().active === false).length;
    const supprimes = snapshot.docs.filter(doc => doc.data().deleted === true).length;
    
    console.log('\n📊 Statistiques :');
    console.log(`  Actifs: ${actifs}`);
    console.log(`  Inactifs: ${inactifs}`);
    console.log(`  Supprimés (soft delete): ${supprimes}`);
    console.log(`  Champ 'active' manquant: ${snapshot.size - actifs - inactifs}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

checkVenues();
