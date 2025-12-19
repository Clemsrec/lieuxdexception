/**
 * Script pour uploader la photo boulaie_interieur_5.JPG dans Firebase Storage
 * et l'ajouter à la timeline de septembre 2025
 * 
 * Usage: node scripts/upload-boulaie-timeline-photo.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialiser Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'lieux-d-exceptions.firebasestorage.app'
  });
}

const bucket = admin.storage().bucket();
const db = admin.firestore();

async function uploadPhotoAndUpdateTimeline() {
  try {
    console.log('🚀 Upload de la photo boulaie_interieur_5.JPG...\n');

    // Chemin local de la photo
    const localPhotoPath = path.join(__dirname, '../public/venues/manoir-boulaie/mariages/boulaie_interieur_5.JPG');
    
    // Vérifier que le fichier existe
    if (!fs.existsSync(localPhotoPath)) {
      throw new Error(`❌ Fichier introuvable: ${localPhotoPath}`);
    }

    // Destination dans Firebase Storage
    const storagePath = 'venues/manoir-boulaie/mariages/boulaie_interieur_5.jpg';
    
    console.log('📤 Upload vers:', storagePath);
    
    // Upload du fichier
    await bucket.upload(localPhotoPath, {
      destination: storagePath,
      metadata: {
        contentType: 'image/jpeg',
        metadata: {
          venue: 'manoir-boulaie',
          category: 'mariages',
          uploadedAt: new Date().toISOString(),
          purpose: 'timeline-sept-2025'
        }
      }
    });

    // Obtenir l'URL Firebase Storage (format standard avec token)
    const file = bucket.file(storagePath);
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500' // Expire dans très longtemps
    });
    
    // URL publique Firebase Storage (accessible via règles Firestore)
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(storagePath)}?alt=media`;
    
    console.log('✅ Photo uploadée avec succès !');
    console.log('📍 URL:', publicUrl);
    console.log('');

    // Récupérer le document du Manoir de la Boulaie
    console.log('📝 Mise à jour des données du Manoir de la Boulaie...');
    const venuesSnapshot = await db.collection('venues')
      .where('slug', '==', 'manoir-boulaie')
      .limit(1)
      .get();

    if (venuesSnapshot.empty) {
      throw new Error('❌ Manoir de la Boulaie introuvable dans Firestore');
    }

    const boulaieDoc = venuesSnapshot.docs[0];
    const boulaieData = boulaieDoc.data();

    // Ajouter la photo aux images mariages
    const updatedImages = {
      ...boulaieData.images,
      weddings: [
        ...(boulaieData.images?.weddings || []),
        publicUrl
      ]
    };

    // Mettre à jour le document
    await boulaieDoc.ref.update({
      images: updatedImages,
      updatedAt: admin.firestore.Timestamp.now()
    });

    console.log('✅ Images mariages mises à jour');
    console.log('');

    // Créer ou mettre à jour l'entrée timeline pour septembre 2025
    console.log('📅 Ajout à la timeline (septembre 2025)...');
    
    const timelineData = {
      date: '2025-09',
      month: 'septembre',
      year: 2025,
      venue: 'manoir-boulaie',
      venueName: 'Manoir de la Boulaie',
      event: 'Nouvelles photos intérieures mariages',
      description: 'Ajout de photos intérieures pour présentation mariages',
      image: publicUrl,
      category: 'venue-update',
      visible: true,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now()
    };

    await db.collection('timeline').add(timelineData);
    
    console.log('✅ Timeline mise à jour');
    console.log('');
    console.log('🎉 Opération terminée avec succès !');
    console.log('');
    console.log('📌 Résumé :');
    console.log(`   - Photo uploadée: ${storagePath}`);
    console.log(`   - URL publique: ${publicUrl}`);
    console.log(`   - Ajoutée aux images mariages du Manoir de la Boulaie`);
    console.log(`   - Timeline mise à jour pour septembre 2025`);
    console.log('');

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

// Exécuter
uploadPhotoAndUpdateTimeline()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
