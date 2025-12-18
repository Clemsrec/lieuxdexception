/**
 * Script pour régénérer les URLs Firebase Storage avec tokens
 * et mettre à jour Firestore
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Initialisation Firebase Admin
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
 * Récupère l'URL publique d'un fichier Storage avec token
 */
async function getPublicUrlWithToken(filePath) {
  try {
    const file = bucket.file(filePath);
    
    // Vérifier si le fichier existe
    const [exists] = await file.exists();
    if (!exists) {
      console.log(`   ⚠️  Fichier introuvable: ${filePath}`);
      return null;
    }

    // Récupérer les métadonnées qui contiennent le token
    const [metadata] = await file.getMetadata();
    
    // Construire l'URL publique avec token
    const bucketName = bucket.name;
    const encodedPath = encodeURIComponent(filePath);
    
    // Récupérer le download token existant
    const token = metadata.metadata?.firebaseStorageDownloadTokens;
    
    if (token) {
      // URL avec token existant
      return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media&token=${token}`;
    } else {
      // Pas de token (fichier uploadé sans token) - générer une signed URL temporaire
      console.log(`   ⚠️  Pas de token pour ${filePath}, création signed URL...`);
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2030', // Expire dans 5 ans
      });
      return signedUrl;
    }
    
  } catch (error) {
    console.error(`   ❌ Erreur pour ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Met à jour les URLs d'une venue dans Firestore
 */
async function updateVenueUrls(venueId, venueData) {
  const updates = {};
  let hasUpdates = false;

  // Hero image
  if (venueData.images?.hero) {
    const heroPath = venueData.images.hero.split('/o/')[1]?.split('?')[0];
    if (heroPath) {
      const decodedPath = decodeURIComponent(heroPath);
      const newUrl = await getPublicUrlWithToken(decodedPath);
      if (newUrl && newUrl !== venueData.images.hero) {
        updates['images.hero'] = newUrl;
        hasUpdates = true;
        console.log(`   ✅ Hero URL mise à jour`);
      }
    }
  }

  // Card image
  if (venueData.images?.cardImage) {
    const cardPath = venueData.images.cardImage.split('/o/')[1]?.split('?')[0];
    if (cardPath) {
      const decodedPath = decodeURIComponent(cardPath);
      const newUrl = await getPublicUrlWithToken(decodedPath);
      if (newUrl && newUrl !== venueData.images.cardImage) {
        updates['images.cardImage'] = newUrl;
        hasUpdates = true;
        console.log(`   ✅ Card URL mise à jour`);
      }
    }
  }

  // Galerie
  if (venueData.images?.gallery && Array.isArray(venueData.images.gallery)) {
    const newGallery = [];
    let galleryUpdated = false;
    
    for (const imageUrl of venueData.images.gallery) {
      const imagePath = imageUrl.split('/o/')[1]?.split('?')[0];
      if (imagePath) {
        const decodedPath = decodeURIComponent(imagePath);
        const newUrl = await getPublicUrlWithToken(decodedPath);
        if (newUrl) {
          newGallery.push(newUrl);
          if (newUrl !== imageUrl) galleryUpdated = true;
        } else {
          newGallery.push(imageUrl);
        }
      } else {
        newGallery.push(imageUrl);
      }
    }
    
    if (galleryUpdated) {
      updates['images.gallery'] = newGallery;
      hasUpdates = true;
      console.log(`   ✅ Galerie mise à jour (${newGallery.length} images)`);
    }
  }

  // Appliquer les mises à jour
  if (hasUpdates) {
    await db.collection('venues').doc(venueId).update(updates);
    console.log(`   💾 Firestore mis à jour pour ${venueData.name}`);
    return true;
  }
  
  return false;
}

/**
 * Fonction principale
 */
async function regenerateUrls() {
  console.log('🔄 Régénération des URLs Firebase Storage avec tokens\n');

  try {
    // Récupérer toutes les venues
    const venuesSnapshot = await db.collection('venues').get();
    
    let updatedCount = 0;
    
    for (const doc of venuesSnapshot.docs) {
      const venueData = doc.data();
      console.log(`\n🏰 ${venueData.name} (${doc.id})`);
      
      const updated = await updateVenueUrls(doc.id, venueData);
      if (updated) updatedCount++;
    }
    
    console.log(`\n✅ Terminé ! ${updatedCount}/${venuesSnapshot.size} venues mises à jour`);
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

regenerateUrls();
