/**
 * Script de correction des hébergements uniquement
 * 
 * Corrections à apporter :
 * - Manoir de la Boulaie : Modifier "Hébergements sur place" → "Hébergements proposés (à proximité)"
 * - Le Dôme : Retirer les hébergements (accommodation = false)
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialisation Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

const db = admin.firestore();

/**
 * Mapping des modifications d'hébergements
 */
const ACCOMMODATION_UPDATES = {
  'Le Manoir de la Boulaie': {
    accommodation: false, // Pas d'hébergements sur place
    accommodationDetails: 'Hébergements proposés à proximité',
    accommodationRooms: 0 // Pas de chambres sur place
  },
  'Le Dôme': {
    accommodation: false, // Pas d'hébergements
    accommodationDetails: null,
    accommodationRooms: 0
  }
};

/**
 * Fonction principale de correction
 */
async function updateAccommodations() {
  try {
    console.log('\n=== CORRECTION DES HÉBERGEMENTS ===\n');

    const venuesRef = db.collection('venues');
    const snapshot = await venuesRef.get();

    if (snapshot.empty) {
      console.log('❌ Aucun lieu trouvé dans Firestore');
      return;
    }

    let updated = 0;

    for (const doc of snapshot.docs) {
      const venueData = doc.data();
      const venueName = venueData.name;

      if (ACCOMMODATION_UPDATES[venueName]) {
        const updates = ACCOMMODATION_UPDATES[venueName];
        
        console.log(`\n📝 Correction: ${venueName}`);
        console.log(`  Avant:`);
        console.log(`    - Hébergements: ${venueData.accommodation ? 'Oui' : 'Non'}`);
        console.log(`    - Détails: ${venueData.accommodationDetails || 'N/A'}`);
        console.log(`    - Chambres: ${venueData.accommodationRooms || 'N/A'}`);
        
        console.log(`  Après:`);
        console.log(`    - Hébergements: ${updates.accommodation ? 'Oui' : 'Non'}`);
        console.log(`    - Détails: ${updates.accommodationDetails || 'Aucun'}`);
        console.log(`    - Chambres: ${updates.accommodationRooms}`);

        // Préparer l'objet de mise à jour
        const updateData = {
          accommodation: updates.accommodation,
          accommodationRooms: updates.accommodationRooms,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        // Ajouter accommodationDetails seulement s'il existe
        if (updates.accommodationDetails) {
          updateData.accommodationDetails = updates.accommodationDetails;
        } else {
          // Supprimer le champ s'il est null
          updateData.accommodationDetails = admin.firestore.FieldValue.delete();
        }

        // Mettre à jour le document
        await venuesRef.doc(doc.id).update(updateData);

        console.log(`  ✅ Corrigé avec succès`);
        updated++;
      }
    }

    console.log('\n=== RÉSUMÉ ===');
    console.log(`✅ ${updated} lieu(x) corrigé(s)`);
    console.log('\n✅ Correction terminée\n');

  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
    throw error;
  }
}

/**
 * Fonction de vérification post-correction
 */
async function verifyAfterUpdate() {
  try {
    console.log('\n=== VÉRIFICATION POST-CORRECTION ===\n');

    const venuesRef = db.collection('venues');
    const snapshot = await venuesRef.get();

    if (snapshot.empty) {
      console.log('❌ Aucun lieu trouvé');
      return;
    }

    // Afficher seulement les lieux concernés
    const venuesToCheck = Object.keys(ACCOMMODATION_UPDATES);
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (venuesToCheck.includes(data.name)) {
        console.log(`🏰 ${data.name}`);
        console.log(`  Hébergements: ${data.accommodation ? 'Oui' : 'Non'}`);
        console.log(`  Détails: ${data.accommodationDetails || 'Aucun'}`);
        console.log(`  Chambres: ${data.accommodationRooms || 0}`);
        console.log('');
      }
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

// Exécution selon le mode
const mode = process.argv[2];

if (mode === '--verify' || mode === '-v') {
  verifyAfterUpdate()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else if (mode === '--update' || mode === '-u') {
  updateAccommodations()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else {
  console.log('\n📋 Script de correction des hébergements\n');
  console.log('Usage:');
  console.log('  node scripts/update-accommodation-details.js [option]\n');
  console.log('Options:');
  console.log('  -v, --verify   Vérifier l\'état actuel');
  console.log('  -u, --update   Appliquer les corrections');
  console.log('  -h, --help     Afficher cette aide\n');
  console.log('Corrections à appliquer:');
  console.log('  • Manoir de la Boulaie : "Hébergements proposés à proximité"');
  console.log('  • Le Dôme : Pas d\'hébergements\n');
  process.exit(0);
}
