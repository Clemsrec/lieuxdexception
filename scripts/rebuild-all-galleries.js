/**
 * Script pour nettoyer et reconstruire les galeries depuis Firebase Storage
 * Liste tous les fichiers réellement présents et met à jour Firestore
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
  });
}

const bucket = admin.storage().bucket();
const db = admin.firestore();

/**
 * Génère une Signed URL pour un fichier
 */
async function getSignedUrl(file) {
  try {
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2030',
    });
    return signedUrl;
  } catch (error) {
    console.error(`Erreur signed URL pour ${file.name}:`, error.message);
    return null;
  }
}

/**
 * Liste tous les fichiers d'un venue dans Storage
 */
async function listVenueFiles(venueSlug) {
  const prefix = `venues/${venueSlug}/`;
  const [files] = await bucket.getFiles({ prefix });
  
  // Filtrer les images (b2b et mariages uniquement, pas hero)
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const galleryFiles = files.filter(file => {
    const fileName = file.name.toLowerCase();
    const isImage = imageExtensions.some(ext => fileName.endsWith(ext));
    const isGallery = fileName.includes('/b2b/') || fileName.includes('/mariages/');
    const notHero = !fileName.endsWith('/hero.jpg') && !fileName.endsWith('/hero.webp') && !fileName.endsWith('/hero.png');
    return isImage && isGallery && notHero;
  });
  
  return galleryFiles;
}

/**
 * Reconstruit la galerie d'un venue
 */
async function rebuildVenueGallery(venueId, venueSlug, venueName) {
  console.log(`\n🏰 ${venueName} (${venueSlug})`);
  
  // Lister les fichiers existants dans Storage
  const files = await listVenueFiles(venueSlug);
  console.log(`   📁 ${files.length} images trouvées dans Storage`);
  
  if (files.length === 0) {
    console.log(`   ⚠️  Aucune image à ajouter à la galerie`);
    return;
  }
  
  // Générer les Signed URLs
  const galleryUrls = [];
  for (const file of files) {
    const url = await getSignedUrl(file);
    if (url) {
      galleryUrls.push(url);
    }
  }
  
  console.log(`   ✅ ${galleryUrls.length} URLs générées`);
  
  // Mettre à jour Firestore
  await db.collection('venues').doc(venueId).update({
    'images.gallery': galleryUrls
  });
  
  console.log(`   💾 Firestore mis à jour`);
}

async function rebuildAllGalleries() {
  console.log('🔄 Reconstruction des galeries depuis Firebase Storage\n');
  console.log('='.repeat(60));

  const venuesSnapshot = await db.collection('venues').get();
  
  for (const doc of venuesSnapshot.docs) {
    const data = doc.data();
    await rebuildVenueGallery(doc.id, data.slug, data.name);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Reconstruction terminée !');
  process.exit(0);
}

rebuildAllGalleries().catch(error => {
  console.error('❌ Erreur:', error);
  process.exit(1);
});
