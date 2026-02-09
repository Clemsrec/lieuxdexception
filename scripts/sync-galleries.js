/**
 * Script de synchronisation des galeries
 * Met à jour les URLs dans Firestore pour correspondre aux fichiers réels dans Storage
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'lieux-d-exceptions.firebasestorage.app'
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

/**
 * Générer l'URL publique d'un fichier Storage
 */
function getPublicUrl(filePath) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;
}

/**
 * Synchroniser les galeries
 */
async function syncGalleries() {
  try {
    console.log('\n=== SYNCHRONISATION DES GALERIES ===\n');

    // Récupérer tous les fichiers Storage
    const [files] = await bucket.getFiles({ prefix: 'venues/' });
    
    // Grouper par lieu et type
    const venueFiles = {};
    files.forEach(file => {
      const parts = file.name.split('/');
      if (parts.length >= 3) {
        const venueSlug = parts[1];
        const category = parts[2]; // b2b, mariages, etc.
        
        if (!venueFiles[venueSlug]) {
          venueFiles[venueSlug] = { b2b: [], mariages: [], other: [] };
        }
        
        // Exclure hero.jpg, card.jpg, hero.webp (images principales)
        const fileName = parts[parts.length - 1];
        if (!fileName.match(/^(hero|card)\.(jpg|webp|png)$/i)) {
          if (venueFiles[venueSlug][category]) {
            venueFiles[venueSlug][category].push(file.name);
          } else {
            venueFiles[venueSlug].other.push(file.name);
          }
        }
      }
    });

    // Mapper les slugs Firestore aux slugs Storage
    const slugMapping = {
      'chateau-brulaire': 'chateau-brulaire',
      'chateau-de-la-brulaire': 'chateau-brulaire',
      'chateau-corbe': 'chateau-corbe',
      'chateau-de-la-corbe': 'chateau-corbe',
      'domaine-nantais': 'domaine-nantais',
      'le-dome': 'le-dome',
      'manoir-boulaie': 'manoir-boulaie',
      'manoir-de-la-boulaie': 'manoir-boulaie'
    };

    // Mettre à jour chaque lieu
    const venuesSnapshot = await db.collection('venues').get();
    let updated = 0;
    let errors = 0;

    for (const doc of venuesSnapshot.docs) {
      const venue = doc.data();
      const venueSlug = venue.slug;
      const storageSlug = slugMapping[venueSlug] || venueSlug;

      console.log(`\n🏰 ${venue.name}`);
      console.log(`   Slug Firestore: ${venueSlug}`);
      console.log(`   Slug Storage: ${storageSlug}`);

      if (!venueFiles[storageSlug]) {
        console.log(`   ⚠️  Aucun fichier trouvé dans Storage`);
        continue;
      }

      // Construire le tableau de galerie depuis Storage
      const allFiles = [
        ...venueFiles[storageSlug].b2b,
        ...venueFiles[storageSlug].mariages,
        ...venueFiles[storageSlug].other
      ];

      const galleryUrls = allFiles
        .sort() // Trier alphabétiquement
        .map(filePath => getPublicUrl(filePath));

      console.log(`   📸 Fichiers Storage trouvés: ${allFiles.length}`);
      console.log(`   📋 URLs Firestore actuelles: ${venue.images?.gallery?.length || 0}`);

      if (galleryUrls.length > 0) {
        try {
          await db.collection('venues').doc(doc.id).update({
            'images.gallery': galleryUrls,
            gallery: galleryUrls, // Pour compatibilité
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });

          console.log(`   ✅ Mis à jour: ${galleryUrls.length} images`);
          updated++;
        } catch (error) {
          console.log(`   ❌ Erreur mise à jour: ${error.message}`);
          errors++;
        }
      } else {
        console.log(`   ⚠️  Aucune image à synchroniser`);
      }
    }

    console.log('\n=== RÉSUMÉ ===');
    console.log(`✅ ${updated} lieu(x) synchronisé(s)`);
    if (errors > 0) {
      console.log(`❌ ${errors} erreur(s)`);
    }
    console.log('');

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

// Mode dry-run ou update
const mode = process.argv[2];

if (mode === '--update' || mode === '-u') {
  syncGalleries()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
} else {
  console.log('\n⚠️  MODE DRY-RUN (aucune modification)\n');
  console.log('Pour appliquer les modifications, exécutez :');
  console.log('  node scripts/sync-galleries.js --update\n');
  process.exit(0);
}
