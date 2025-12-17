/**
 * Script pour ajouter les emails B2B et Mariages distincts
 * - Email B2B/Pro : contact@lieuxdexception.com (tous les lieux)
 * - Email Mariages : contact@[nom-lieu].com (spécifique à chaque lieu)
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

const EMAIL_B2B = 'contact@lieuxdexception.com';

// Mapping des emails mariages par lieu
const EMAILS_MARIAGES = {
  'chateau-brulaire': 'contact@chateaudelabrulaire.com',
  'chateau-corbe': 'contact@chateaudelacorbe.com',
  'domaine-nantais': 'contact@domainenantais.com',
  'le-dome': 'contact@ledome.com',
  'manoir-boulaie': 'contact@manoirdelaboulaie.com'
};

async function updateVenuesEmails() {
  try {
    console.log('📧 Mise à jour des emails B2B et Mariages...\n');

    const venuesSnapshot = await db.collection('venues').get();
    
    if (venuesSnapshot.empty) {
      console.log('❌ Aucun lieu trouvé dans la collection venues');
      return;
    }

    console.log(`📊 ${venuesSnapshot.size} lieux trouvés\n`);

    const batch = db.batch();
    let updatedCount = 0;

    for (const doc of venuesSnapshot.docs) {
      const venue = doc.data();
      const venueRef = db.collection('venues').doc(doc.id);

      const emailMariages = EMAILS_MARIAGES[doc.id];

      if (!emailMariages) {
        console.log(`⚠️  ${venue.name} (${doc.id}) : Email mariages non défini, ignoré`);
        continue;
      }

      console.log(`🏰 ${venue.name} (${doc.id})`);

      const updates = {
        // Nouveau champ emailB2B
        emailB2B: EMAIL_B2B,
        // Nouveau champ emailMariages
        emailMariages: emailMariages,
        // Mettre à jour contact.email avec l'email B2B par défaut
        'contact.email': EMAIL_B2B,
        // Ajouter l'email mariages dans contact
        'contact.emailMariages': emailMariages,
        // Garder l'ancien champ email pour compatibilité
        email: EMAIL_B2B,
        // Timestamp
        updatedAt: admin.firestore.Timestamp.now().toDate().toISOString()
      };

      batch.update(venueRef, updates);
      
      console.log(`  ✅ Email B2B: ${EMAIL_B2B}`);
      console.log(`  ✅ Email Mariages: ${emailMariages}\n`);
      
      updatedCount++;
    }

    console.log(`💾 Application des modifications...`);
    await batch.commit();
    console.log(`\n✅ ${updatedCount} lieu(x) mis à jour avec succès !`);
    
    console.log('\n📋 Structure des emails:');
    console.log('   - emailB2B: contact@lieuxdexception.com (tous les lieux)');
    console.log('   - emailMariages: contact@[nom-lieu].com (spécifique)');
    console.log('   - contact.email: contact@lieuxdexception.com (par défaut)');
    console.log('   - contact.emailMariages: contact@[nom-lieu].com');

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

updateVenuesEmails();
