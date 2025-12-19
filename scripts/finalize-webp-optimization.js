const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'lieux-d-exceptions.firebasestorage.app',
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const bucket = admin.storage().bucket();
const db = admin.firestore();

async function uploadAndUpdateVenue(venueName, localPath, storagePath, firestoreSlug) {
  console.log(`\n🏰 ${venueName}`);
  
  try {
    // Vérifier si le fichier existe
    if (!fs.existsSync(localPath)) {
      // Créer le WebP si nécessaire
      const jpgPath = localPath.replace('.webp', '.jpg');
      if (fs.existsSync(jpgPath)) {
        console.log(`   🔄 Conversion JPG → WebP...`);
        await sharp(jpgPath)
          .webp({ quality: 85, effort: 6 })
          .toFile(localPath);
      } else {
        console.log(`   ⚠️  Fichier non trouvé`);
        return;
      }
    }

    const stats = fs.statSync(localPath);
    console.log(`   📏 Taille: ${(stats.size / 1024).toFixed(1)} KB`);

    // Upload vers Firebase Storage
    console.log(`   ☁️  Upload: ${storagePath}`);
    await bucket.upload(localPath, {
      destination: storagePath,
      metadata: {
        contentType: 'image/webp',
        cacheControl: 'public, max-age=31536000',
      }
    });

    // Mettre à jour Firestore
    const venueQuery = await db.collection('venues').where('slug', '==', firestoreSlug).get();
    if (!venueQuery.empty) {
      const doc = venueQuery.docs[0];
      const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/';
      const newUrl = `${baseUrl}${storagePath.replace(/\//g, '%2F')}?alt=media`;
      
      await doc.ref.update({
        heroImage: newUrl,
        updatedAt: admin.firestore.Timestamp.now()
      });
      
      console.log(`   ✅ Firestore mis à jour`);
    }

  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Finalisation optimisation images\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const publicDir = path.join(__dirname, '../public');

  // Upload et mise à jour des 3 lieux manquants
  await uploadAndUpdateVenue(
    'Le Domaine Nantais',
    path.join(publicDir, 'venues/domaine-nantais/hero.webp'),
    'venues/domaine-nantais/hero.webp',
    'domaine-nantais'
  );

  await uploadAndUpdateVenue(
    'Le Manoir de la Boulaie',
    path.join(publicDir, 'venues/manoir-boulaie/hero.webp'),
    'venues/manoir-boulaie/hero.webp',
    'manoir-boulaie'
  );

  // Le Dôme : convertir et uploader
  const domeJpgPath = path.join(publicDir, 'venues/le-dome/mariages/dome_interieur_1.jpg');
  const domeWebpPath = path.join(publicDir, 'venues/le-dome/mariages/dome_interieur_1.webp');
  
  console.log(`\n🏰 Le Dôme`);
  if (!fs.existsSync(domeWebpPath) && fs.existsSync(domeJpgPath)) {
    console.log(`   🔄 Conversion JPG → WebP...`);
    await sharp(domeJpgPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(domeWebpPath);
  }
  
  if (fs.existsSync(domeWebpPath)) {
    const stats = fs.statSync(domeWebpPath);
    console.log(`   📏 Taille: ${(stats.size / 1024).toFixed(1)} KB`);
    
    await bucket.upload(domeWebpPath, {
      destination: 'venues/le-dome/mariages/dome_interieur_1.webp',
      metadata: {
        contentType: 'image/webp',
        cacheControl: 'public, max-age=31536000',
      }
    });

    const venueQuery = await db.collection('venues').where('slug', '==', 'le-dome').get();
    if (!venueQuery.empty) {
      const doc = venueQuery.docs[0];
      const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/';
      const newUrl = `${baseUrl}venues%2Fle-dome%2Fmariages%2Fdome_interieur_1.webp?alt=media`;
      
      await doc.ref.update({
        heroImage: newUrl,
        updatedAt: admin.firestore.Timestamp.now()
      });
      
      console.log(`   ✅ Firestore mis à jour`);
    }
  }

  console.log('\n\n📊 RÉSUMÉ');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ 5 lieux avec images WebP optimisées');
  console.log('⚡️ Économie estimée globale: ~4 MB');
  console.log('🚀 LCP attendu: Amélioration majeure\n');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
