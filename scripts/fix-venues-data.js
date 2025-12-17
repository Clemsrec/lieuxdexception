/**
 * Script pour corriger les données des venues dans Firestore
 * - Ajouter "Le" devant les noms de châteaux
 * - Uniformiser l'email : contact@lieuxdexception.com
 * - Uniformiser le téléphone : 06 70 56 28 79
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialiser Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
});

const db = admin.firestore();

// Mapping des noms corrects avec "Le"
const venueNameFixes = {
  'chateau-brulaire': 'Le Château de la Brûlaire',
  'chateau-corbe': 'Le Château de la Corbe',
  'manoir-boulaie': 'Le Manoir de la Boulaie',
  'domaine-nantais': 'Le Domaine Nantais',
  'le-dome': 'Le Dôme'
};

// Email et téléphone uniformisés
const UNIFIED_EMAIL = 'contact@lieuxdexception.com';
const UNIFIED_PHONE = '06 70 56 28 79';

async function fixVenuesData() {
  try {
    console.log('🔧 Démarrage de la correction des données venues...\n');

    const venuesSnapshot = await db.collection('venues').get();
    
    if (venuesSnapshot.empty) {
      console.log('❌ Aucun lieu trouvé dans la collection venues');
      return;
    }

    console.log(`📊 ${venuesSnapshot.size} lieux trouvés\n`);

    const batch = db.batch();
    let updateCount = 0;

    for (const doc of venuesSnapshot.docs) {
      const venue = doc.data();
      const venueRef = db.collection('venues').doc(doc.id);
      const updates = {};

      console.log(`\n🏰 Analyse de: ${venue.name} (${doc.id})`);

      // 1. Vérifier et corriger le nom
      if (venueNameFixes[doc.id]) {
        const correctName = venueNameFixes[doc.id];
        if (venue.name !== correctName) {
          console.log(`  ✏️  Nom corrigé: "${venue.name}" → "${correctName}"`);
          updates.name = correctName;
        } else {
          console.log(`  ✅ Nom correct: ${correctName}`);
        }
      }

      // 2. Vérifier et corriger l'email
      const currentEmail = venue.contact?.email || venue.email;
      if (currentEmail !== UNIFIED_EMAIL) {
        console.log(`  📧 Email corrigé: "${currentEmail}" → "${UNIFIED_EMAIL}"`);
        if (venue.contact) {
          updates['contact.email'] = UNIFIED_EMAIL;
        }
        if (venue.email) {
          updates.email = UNIFIED_EMAIL;
        }
      } else {
        console.log(`  ✅ Email correct: ${UNIFIED_EMAIL}`);
      }

      // 3. Vérifier et corriger le téléphone
      const currentPhone = venue.contact?.phone || venue.phone;
      if (currentPhone !== UNIFIED_PHONE) {
        console.log(`  📞 Téléphone corrigé: "${currentPhone}" → "${UNIFIED_PHONE}"`);
        if (venue.contact) {
          updates['contact.phone'] = UNIFIED_PHONE;
        }
        if (venue.phone) {
          updates.phone = UNIFIED_PHONE;
        }
      } else {
        console.log(`  ✅ Téléphone correct: ${UNIFIED_PHONE}`);
      }

      // 4. Ajouter updatedAt
      updates.updatedAt = admin.firestore.Timestamp.now().toDate().toISOString();

      // Si des mises à jour sont nécessaires
      if (Object.keys(updates).length > 1) { // > 1 car updatedAt est toujours présent
        batch.update(venueRef, updates);
        updateCount++;
        console.log(`  ⚡ ${Object.keys(updates).length - 1} champ(s) à mettre à jour`);
      } else {
        console.log(`  ✅ Aucune modification nécessaire`);
      }
    }

    if (updateCount > 0) {
      console.log(`\n💾 Application des modifications...`);
      await batch.commit();
      console.log(`\n✅ ${updateCount} lieu(x) mis à jour avec succès !`);
    } else {
      console.log(`\n✅ Toutes les données sont déjà correctes !`);
    }

    console.log('\n🎉 Correction terminée !');

  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

// Exécuter le script
fixVenuesData();
