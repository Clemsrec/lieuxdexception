/**
 * Script de mise à jour des capacités des lieux
 * 
 * Mise à jour demandée :
 * - Château de la Brulaire : 350 assises / +1000 cocktail / Hébergements sur place
 * - Château de la Corbe : 400 assises / +1000 cocktail / Hébergements sur place
 * - Manoir de la Boulaie : 300 assises / 500 cocktail / Hébergements proposés
 * - Domaine Nantais : 160 assises / 300 cocktail / Hébergements sur place
 * - Le Dôme : 300 assises / 600 cocktail
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
// Note: La base de données "lieuxdexception" est la base par défaut du projet

/**
 * Mapping des noms de lieux avec leurs nouvelles capacités
 */
const CAPACITIES_UPDATE = {
  'Château de la Brulaire': {
    capacity: {
      min: 50,
      max: 350,
      seated: 350,
      cocktail: 1000
    },
    capacitySeated: 350,
    capacityStanding: 1000,
    accommodation: true,
    accommodationDetails: 'Hébergements sur place'
  },
  'Château de la Corbe': {
    capacity: {
      min: 50,
      max: 400,
      seated: 400,
      cocktail: 1000
    },
    capacitySeated: 400,
    capacityStanding: 1000,
    accommodation: true,
    accommodationDetails: 'Hébergements sur place'
  },
  'Manoir de la Boulaie': {
    capacity: {
      min: 50,
      max: 300,
      seated: 300,
      cocktail: 500
    },
    capacitySeated: 300,
    capacityStanding: 500,
    accommodation: false,
    accommodationDetails: 'Hébergements proposés à proximité'
  },
  'Domaine Nantais': {
    capacity: {
      min: 30,
      max: 160,
      seated: 160,
      cocktail: 300
    },
    capacitySeated: 160,
    capacityStanding: 300,
    accommodation: true,
    accommodationDetails: 'Hébergements sur place'
  },
  'Le Dôme': {
    capacity: {
      min: 50,
      max: 300,
      seated: 300,
      cocktail: 600
    },
    capacitySeated: 300,
    capacityStanding: 600,
    accommodation: false,
    accommodationDetails: null
  }
};

/**
 * Fonction principale de mise à jour
 */
async function updateVenuesCapacities() {
  try {
    console.log('\n=== MISE À JOUR DES CAPACITÉS DES LIEUX ===\n');

    const venuesRef = db.collection('venues');
    const snapshot = await venuesRef.get();

    if (snapshot.empty) {
      console.log('❌ Aucun lieu trouvé dans Firestore');
      return;
    }

    let updated = 0;
    let notFound = [];

    // Parcourir tous les lieux
    for (const doc of snapshot.docs) {
      const venueData = doc.data();
      const venueName = venueData.name;

      // Vérifier si ce lieu doit être mis à jour
      if (CAPACITIES_UPDATE[venueName]) {
        const newCapacities = CAPACITIES_UPDATE[venueName];
        
        console.log(`\n📝 Mise à jour: ${venueName}`);
        console.log(`  Avant:`);
        console.log(`    - Assises: ${venueData.capacitySeated || venueData.capacity?.seated || 'N/A'}`);
        console.log(`    - Cocktail: ${venueData.capacityStanding || venueData.capacity?.cocktail || 'N/A'}`);
        console.log(`    - Hébergements: ${venueData.accommodation ? 'Oui' : 'Non'}`);
        
        console.log(`  Après:`);
        console.log(`    - Assises: ${newCapacities.capacitySeated}`);
        console.log(`    - Cocktail: ${newCapacities.capacityStanding}`);
        console.log(`    - Hébergements: ${newCapacities.accommodation ? 'Oui' : 'Non'} ${newCapacities.accommodationDetails || ''}`);

        // Mettre à jour le document
        await venuesRef.doc(doc.id).update({
          capacity: newCapacities.capacity,
          capacitySeated: newCapacities.capacitySeated,
          capacityStanding: newCapacities.capacityStanding,
          accommodation: newCapacities.accommodation,
          ...(newCapacities.accommodationDetails && { accommodationDetails: newCapacities.accommodationDetails }),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`  ✅ Mis à jour avec succès`);
        updated++;
      }
    }

    // Vérifier si tous les lieux ont été trouvés
    for (const venueName of Object.keys(CAPACITIES_UPDATE)) {
      const found = snapshot.docs.some(doc => doc.data().name === venueName);
      if (!found) {
        notFound.push(venueName);
      }
    }

    console.log('\n=== RÉSUMÉ ===');
    console.log(`✅ ${updated} lieu(x) mis à jour sur ${Object.keys(CAPACITIES_UPDATE).length}`);
    
    if (notFound.length > 0) {
      console.log(`\n⚠️  Lieux non trouvés dans Firestore:`);
      notFound.forEach(name => console.log(`  - ${name}`));
      console.log('\nVérifiez les noms exacts dans la base de données.');
    }

    console.log('\n✅ Mise à jour terminée\n');

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    throw error;
  }
}

/**
 * Fonction de vérification (mode dry-run)
 */
async function verifyCurrentCapacities() {
  try {
    console.log('\n=== CAPACITÉS ACTUELLES DANS FIRESTORE ===\n');

    const venuesRef = db.collection('venues');
    const snapshot = await venuesRef.get();

    if (snapshot.empty) {
      console.log('❌ Aucun lieu trouvé');
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`🏰 ${data.name || 'Sans nom'}`);
      console.log(`  Assises: ${data.capacitySeated || data.capacity?.seated || 'N/A'}`);
      console.log(`  Cocktail: ${data.capacityStanding || data.capacity?.cocktail || 'N/A'}`);
      console.log(`  Hébergements: ${data.accommodation ? 'Oui' : 'Non'}${data.accommodationDetails ? ' - ' + data.accommodationDetails : ''}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

// Exécution selon le mode
const mode = process.argv[2];

if (mode === '--verify' || mode === '-v') {
  // Mode vérification uniquement
  verifyCurrentCapacities()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else if (mode === '--update' || mode === '-u') {
  // Mode mise à jour
  updateVenuesCapacities()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else {
  // Afficher l'aide
  console.log('\n📋 Script de mise à jour des capacités des lieux\n');
  console.log('Usage:');
  console.log('  node scripts/update-venues-capacities.js [option]\n');
  console.log('Options:');
  console.log('  -v, --verify   Vérifier les capacités actuelles (sans modification)');
  console.log('  -u, --update   Mettre à jour les capacités dans Firestore');
  console.log('  -h, --help     Afficher cette aide\n');
  console.log('Exemple:');
  console.log('  node scripts/update-venues-capacities.js --verify');
  console.log('  node scripts/update-venues-capacities.js --update\n');
  process.exit(0);
}
