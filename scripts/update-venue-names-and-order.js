/**
 * Script pour mettre à jour les noms des venues et définir l'ordre d'affichage
 * 
 * Modifications :
 * 1. Ajouter "Le" devant les noms des lieux
 * 2. Définir l'ordre : Brulaire - Corbe - Manoir - Domaine Nantais - Le Dôme
 * 
 * Usage : node scripts/update-venue-names-and-order.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialiser Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieuxdexception.firebaseio.com'
  });
}

const db = admin.firestore();

/**
 * Mapping des venues avec nouveaux noms et ordre d'affichage
 */
const venueUpdates = {
  'chateau-de-la-brulaire': {
    name: 'Le Château de la Brulaire',
    displayOrder: 1
  },
  'chateau-de-la-corbe': {
    name: 'Le Château de la Corbe',
    displayOrder: 2
  },
  'manoir-de-la-boulaie': {
    name: 'Le Manoir de la Boulaie',
    displayOrder: 3
  },
  'domaine-nantais': {
    name: 'Le Domaine Nantais',
    displayOrder: 4
  },
  'le-dome': {
    name: 'Le Dôme',
    displayOrder: 5
  }
};

/**
 * Mettre à jour les venues dans Firestore
 */
async function updateVenues() {
  try {
    console.log('🚀 Début de la mise à jour des venues...\n');

    const venuesRef = db.collection('venues');
    const snapshot = await venuesRef.get();

    if (snapshot.empty) {
      console.log('❌ Aucune venue trouvée dans Firestore');
      return;
    }

    let updatedCount = 0;

    for (const doc of snapshot.docs) {
      const venueData = doc.data();
      const slug = doc.id;

      if (venueUpdates[slug]) {
        const updates = venueUpdates[slug];
        
        await venuesRef.doc(slug).update({
          name: updates.name,
          displayOrder: updates.displayOrder,
          updatedAt: admin.firestore.Timestamp.now()
        });

        console.log(`✅ ${slug} → ${updates.name} (ordre: ${updates.displayOrder})`);
        updatedCount++;
      } else {
        console.log(`⚠️  ${slug} - Pas de mise à jour définie`);
      }
    }

    console.log(`\n✨ Mise à jour terminée : ${updatedCount} venues modifiées`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour :', error);
  } finally {
    process.exit(0);
  }
}

// Exécuter le script
updateVenues();
