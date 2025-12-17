/**
 * Script pour ajouter les numéros de téléphone B2B et Mariages distincts
 * - 06 70 56 28 79 : Téléphone B2B/Pro
 * - 06 02 03 70 11 : Téléphone Mariages/Privés
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

const PHONE_B2B = '06 70 56 28 79';
const PHONE_MARIAGES = '06 02 03 70 11';
const EMAIL = 'contact@lieuxdexception.com';

async function updateVenuesPhones() {
  try {
    console.log('📞 Mise à jour des numéros de téléphone B2B et Mariages...\n');

    const venuesSnapshot = await db.collection('venues').get();
    
    if (venuesSnapshot.empty) {
      console.log('❌ Aucun lieu trouvé dans la collection venues');
      return;
    }

    console.log(`📊 ${venuesSnapshot.size} lieux trouvés\n`);

    const batch = db.batch();

    for (const doc of venuesSnapshot.docs) {
      const venue = doc.data();
      const venueRef = db.collection('venues').doc(doc.id);

      console.log(`🏰 ${venue.name} (${doc.id})`);

      const updates = {
        // Nouveau champ phoneB2B
        phoneB2B: PHONE_B2B,
        // Nouveau champ phoneMariages
        phoneMariages: PHONE_MARIAGES,
        // Mettre à jour contact.phone avec le numéro B2B par défaut
        'contact.phone': PHONE_B2B,
        // Ajouter le numéro mariages dans contact
        'contact.phoneMariages': PHONE_MARIAGES,
        // Garder l'email
        'contact.email': EMAIL,
        email: EMAIL,
        // Timestamp
        updatedAt: admin.firestore.Timestamp.now().toDate().toISOString()
      };

      batch.update(venueRef, updates);
      
      console.log(`  ✅ Téléphone B2B: ${PHONE_B2B}`);
      console.log(`  ✅ Téléphone Mariages: ${PHONE_MARIAGES}`);
      console.log(`  ✅ Email: ${EMAIL}\n`);
    }

    console.log(`💾 Application des modifications...`);
    await batch.commit();
    console.log(`\n✅ ${venuesSnapshot.size} lieu(x) mis à jour avec succès !`);
    
    console.log('\n📋 Structure des téléphones:');
    console.log('   - phoneB2B: 06 70 56 28 79');
    console.log('   - phoneMariages: 06 02 03 70 11');
    console.log('   - contact.phone: 06 70 56 28 79 (par défaut)');
    console.log('   - contact.phoneMariages: 06 02 03 70 11');

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

updateVenuesPhones();
