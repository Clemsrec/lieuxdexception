const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

async function updateTimelineStories() {
  console.log('📝 Mise à jour des textes de la timeline...\n');
  
  try {
    // 1. Le Manoir de la Boulaie 2023 - Ajouter clin d'œil gastronomique
    const manoirRef = db.collection('timeline').doc('CldIg4WcwAw0XIOKuqkx');
    await manoirRef.update({
      description: 'Autrefois un haut lieu de la gastronomie française, le Manoir de la Boulaie réouvre ses portes après deux années de rénovation complète pour vous faire vivre des événements d\'exception.',
      updatedAt: admin.firestore.Timestamp.now()
    });
    console.log('✅ Le Manoir de la Boulaie (2023) mis à jour');
    
    // 2. Le Château de la Brûlaire - Enlever "un nouveau château" et enrichir
    const brûlaireRef = db.collection('timeline').doc('vvm9RKfZgWuCMlgfGkYq');
    await brûlaireRef.update({
      description: 'Le Château de la Brûlaire rejoint la collection Lieux d\'Exception. Ancienne demeure de Bonaventure du Fou, ce lieu emblématique séduit par son architecture d\'inspiration louisianaise et ses orangeries authentiques. Jadis restaurant étoilé, il s\'apprête à accueillir vos événements d\'exception.',
      updatedAt: admin.firestore.Timestamp.now()
    });
    console.log('✅ Le Château de la Brûlaire mis à jour');
    
    console.log('\n🎉 Mise à jour terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    process.exit(1);
  }
}

updateTimelineStories()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
