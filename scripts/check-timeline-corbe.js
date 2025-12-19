/**
 * Script pour vérifier et corriger la timeline du Château de la Corbe (décembre 2025)
 * 
 * Usage: node scripts/check-timeline-corbe.js
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

async function checkAndFixTimeline() {
  try {
    console.log('🔍 Recherche de la timeline décembre 2025 - Château de la Corbe...\n');

    // Chercher l'entrée timeline pour décembre 2025 et Château de la Corbe
    const timelineSnapshot = await db.collection('timeline')
      .where('date', '==', '2025-12')
      .where('venue', '==', 'chateau-corbe')
      .get();

    if (timelineSnapshot.empty) {
      console.log('❌ Aucune entrée trouvée pour décembre 2025 - Château de la Corbe');
      return;
    }

    console.log(`✅ Trouvé ${timelineSnapshot.size} entrée(s)\n`);

    for (const doc of timelineSnapshot.docs) {
      const data = doc.data();
      console.log('📄 Entrée actuelle:');
      console.log('   ID:', doc.id);
      console.log('   Event:', data.event);
      console.log('   Image:', data.image || '⚠️  AUCUNE IMAGE');
      console.log('');

      if (!data.image) {
        console.log('🔍 Recherche de photos du Château de la Corbe dans Storage...\n');
        
        // Lister les fichiers du Château de la Corbe
        const [files] = await bucket.getFiles({
          prefix: 'venues/chateau-corbe/'
        });

        console.log(`📸 Trouvé ${files.length} fichiers pour le Château de la Corbe`);
        
        // Prendre la première photo hero ou mariages
        let selectedPhoto = null;
        
        // Priorité 1: Photo hero
        const heroPhoto = files.find(f => f.name.includes('hero') || f.name.includes('facade'));
        if (heroPhoto) {
          selectedPhoto = heroPhoto;
          console.log('✅ Photo hero trouvée:', heroPhoto.name);
        }
        
        // Priorité 2: Photo mariages
        if (!selectedPhoto) {
          const mariagePhoto = files.find(f => f.name.includes('mariages/'));
          if (mariagePhoto) {
            selectedPhoto = mariagePhoto;
            console.log('✅ Photo mariages trouvée:', mariagePhoto.name);
          }
        }
        
        // Priorité 3: N'importe quelle photo
        if (!selectedPhoto && files.length > 0) {
          selectedPhoto = files[0];
          console.log('✅ Première photo disponible:', selectedPhoto.name);
        }

        if (selectedPhoto) {
          const photoUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(selectedPhoto.name)}?alt=media`;
          
          console.log('');
          console.log('📝 Mise à jour de la timeline avec la photo:');
          console.log('   URL:', photoUrl);
          
          await doc.ref.update({
            image: photoUrl,
            updatedAt: admin.firestore.Timestamp.now()
          });
          
          console.log('✅ Timeline mise à jour avec succès !');
        } else {
          console.log('❌ Aucune photo trouvée pour le Château de la Corbe');
        }
      } else {
        console.log('✅ L\'entrée a déjà une photo');
      }
    }

    console.log('\n🎉 Vérification terminée !');

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

// Exécuter
checkAndFixTimeline()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
