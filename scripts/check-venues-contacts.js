/**
 * Script pour vérifier les informations de contact B2B et Mariages
 * de tous les lieux dans Firestore
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

async function checkVenuesContacts() {
  try {
    console.log('📞 Vérification des contacts B2B et Mariages...\n');

    const venuesSnapshot = await db.collection('venues').get();
    
    if (venuesSnapshot.empty) {
      console.log('❌ Aucun lieu trouvé dans la collection venues');
      return;
    }

    console.log(`📊 ${venuesSnapshot.size} lieu(x) trouvé(s)\n`);
    console.log('━'.repeat(80));

    for (const doc of venuesSnapshot.docs) {
      const venue = doc.data();

      console.log(`\n🏰 ${venue.name} (${doc.id})`);
      console.log('─'.repeat(80));

      // Vérifier les champs racine
      console.log('📧 Emails:');
      console.log(`   - emailB2B: ${venue.emailB2B || '❌ MANQUANT'}`);
      console.log(`   - emailMariages: ${venue.emailMariages || '❌ MANQUANT'}`);
      console.log(`   - email (général): ${venue.email || '❌ MANQUANT'}`);

      console.log('\n📞 Téléphones:');
      console.log(`   - phoneB2B: ${venue.phoneB2B || '❌ MANQUANT'}`);
      console.log(`   - phoneMariages: ${venue.phoneMariages || '❌ MANQUANT'}`);
      console.log(`   - phone (général): ${venue.phone || '❌ MANQUANT'}`);

      // Vérifier l'objet contact
      if (venue.contact) {
        console.log('\n📋 Objet contact:');
        console.log(`   - contact.emailB2B: ${venue.contact.emailB2B || '❌ MANQUANT'}`);
        console.log(`   - contact.emailMariages: ${venue.contact.emailMariages || '❌ MANQUANT'}`);
        console.log(`   - contact.email: ${venue.contact.email || '❌ MANQUANT'}`);
        console.log(`   - contact.phoneB2B: ${venue.contact.phoneB2B || '❌ MANQUANT'}`);
        console.log(`   - contact.phoneMariages: ${venue.contact.phoneMariages || '❌ MANQUANT'}`);
        console.log(`   - contact.phone: ${venue.contact.phone || '❌ MANQUANT'}`);
        console.log(`   - contact.instagram: ${venue.contact.instagram || 'Non défini'}`);
        console.log(`   - contact.mariagesNet: ${venue.contact.mariagesNet || 'Non défini'}`);
      } else {
        console.log('\n⚠️  Objet contact non défini');
      }

      // Validation
      const hasAllB2B = venue.emailB2B && venue.phoneB2B;
      const hasAllMariages = venue.emailMariages && venue.phoneMariages;
      
      console.log('\n✅ Statut:');
      console.log(`   - B2B: ${hasAllB2B ? '✅ Complet' : '❌ Incomplet'}`);
      console.log(`   - Mariages: ${hasAllMariages ? '✅ Complet' : '❌ Incomplet'}`);
      console.log('━'.repeat(80));
    }

    console.log('\n✅ Vérification terminée !');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

checkVenuesContacts();
