/**
 * Script pour créer une entrée timeline pour le Château de la Corbe (décembre 2025)
 * 
 * Usage: node scripts/create-timeline-corbe-dec2025.js
 */

const admin = require('firebase-admin');

// Initialiser Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'lieux-d-exceptions.firebasestorage.app'
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function createTimelineEntry() {
  try {
    console.log('🔍 Recherche de photos du Château de la Corbe...\n');
    
    // Lister les fichiers du Château de la Corbe
    const [files] = await bucket.getFiles({
      prefix: 'venues/chateau-corbe/'
    });

    console.log(`📸 Trouvé ${files.length} fichiers pour le Château de la Corbe\n`);
    
    // Afficher quelques exemples
    console.log('Exemples de fichiers:');
    files.slice(0, 10).forEach(f => {
      console.log('  -', f.name);
    });
    console.log('');
    
    // Prendre une belle photo (hero de préférence)
    let selectedPhoto = files.find(f => f.name.includes('hero') || f.name.includes('facade'));
    
    if (!selectedPhoto) {
      selectedPhoto = files.find(f => f.name.includes('mariages/') && (f.name.endsWith('.jpg') || f.name.endsWith('.jpeg')));
    }
    
    if (!selectedPhoto && files.length > 0) {
      selectedPhoto = files.find(f => f.name.endsWith('.jpg') || f.name.endsWith('.jpeg'));
    }

    if (!selectedPhoto) {
      console.log('❌ Aucune photo trouvée');
      return;
    }

    const photoUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(selectedPhoto.name)}?alt=media`;
    
    console.log('✅ Photo sélectionnée:', selectedPhoto.name);
    console.log('📍 URL:', photoUrl);
    console.log('');

    // Créer l'entrée timeline
    console.log('📝 Création de l\'entrée timeline...');
    
    const timelineData = {
      date: '2025-12',
      month: 'décembre',
      year: 2025,
      venue: 'chateau-corbe',
      venueName: 'Château de la Corbe',
      event: 'Mise à jour du site web',
      description: 'Intégration du Château de la Corbe sur le site Lieux d\'Exception',
      image: photoUrl,
      category: 'venue-update',
      visible: true,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now()
    };

    const docRef = await db.collection('timeline').add(timelineData);
    
    console.log('✅ Entrée timeline créée avec succès !');
    console.log('   ID:', docRef.id);
    console.log('   Photo:', photoUrl);
    console.log('');
    console.log('🎉 Opération terminée !');

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

// Exécuter
createTimelineEntry()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
