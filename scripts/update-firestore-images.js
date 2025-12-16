#!/usr/bin/env node

/**
 * Script de mise à jour des URLs images dans Firestore
 * Met à jour les chemins images des venues avec les nouvelles photos organisées
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialiser Firebase Admin
if (!admin.apps.length) {
  const serviceAccountPath = path.join(__dirname, '../firebase-service-account.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
    });
    console.log('✅ Firebase Admin initialisé avec service account');
  } else {
    console.error('❌ Fichier service account introuvable');
    process.exit(1);
  }
}

const db = admin.firestore();
const VENUES_DIR = path.join(__dirname, '../public/venues');

// Mapping des slugs
const VENUE_SLUGS = {
  'chateau-brulaire': 'chateau-brulaire',
  'chateau-corbe': 'chateau-corbe',
  'domaine-nantais': 'domaine-nantais',
  'le-dome': 'le-dome',
  'manoir-boulaie': 'manoir-boulaie'
};

/**
 * Liste toutes les photos d'un lieu
 */
function getVenuePhotos(slug) {
  const venuePath = path.join(VENUES_DIR, slug);
  const photos = {
    hero: null,
    gallery: []
  };
  
  if (!fs.existsSync(venuePath)) {
    console.log(`   ⚠️  Dossier inexistant: ${slug}`);
    return photos;
  }
  
  // Chercher le hero
  const heroExtensions = ['.jpg', '.jpeg', '.png'];
  for (const ext of heroExtensions) {
    const heroPath = path.join(venuePath, `hero${ext}`);
    if (fs.existsSync(heroPath)) {
      photos.hero = `/venues/${slug}/hero${ext}`;
      break;
    }
  }
  
  // Lister toutes les photos dans b2b et mariages
  ['b2b', 'mariages', 'gallery'].forEach(subdir => {
    const subdirPath = path.join(venuePath, subdir);
    if (fs.existsSync(subdirPath)) {
      const files = fs.readdirSync(subdirPath)
        .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
        .map(f => `/venues/${slug}/${subdir}/${f.toLowerCase()}`);
      photos.gallery.push(...files);
    }
  });
  
  return photos;
}

/**
 * Met à jour un lieu dans Firestore
 */
async function updateVenue(venueId, slug) {
  try {
    console.log(`\n🏰 ${slug.toUpperCase()}`);
    
    // Récupérer le document actuel
    const venueRef = db.collection('venues').doc(venueId);
    const doc = await venueRef.get();
    
    if (!doc.exists) {
      console.log('   ❌ Document Firestore introuvable');
      return false;
    }
    
    // Récupérer les nouvelles photos
    const photos = getVenuePhotos(slug);
    
    if (!photos.hero) {
      console.log('   ⚠️  Aucune photo hero trouvée');
      return false;
    }
    
    console.log(`   📸 Hero: ${photos.hero}`);
    console.log(`   📚 Gallery: ${photos.gallery.length} photos`);
    
    // Préparer les updates
    const updates = {
      image: photos.hero,
      heroImage: photos.hero,
      'images.hero': photos.hero,
      'images.heroImage': photos.hero,
      'images.cardImage': photos.hero, // Utiliser hero comme card temporairement
      gallery: photos.gallery,
      'images.gallery': photos.gallery,
      updatedAt: new Date().toISOString()
    };
    
    // Mettre à jour Firestore
    await venueRef.update(updates);
    
    console.log('   ✅ Firestore mis à jour');
    return true;
    
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
    return false;
  }
}

/**
 * Met à jour tous les lieux
 */
async function updateAllVenues() {
  console.log('🔄 Mise à jour des URLs images dans Firestore');
  console.log('='.repeat(60));
  
  let updated = 0;
  let failed = 0;
  
  for (const [venueId, slug] of Object.entries(VENUE_SLUGS)) {
    const success = await updateVenue(venueId, slug);
    if (success) updated++;
    else failed++;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSULTAT');
  console.log('='.repeat(60));
  console.log(`✅ Mis à jour: ${updated}`);
  console.log(`❌ Échecs: ${failed}`);
  console.log('='.repeat(60));
  
  if (updated > 0) {
    console.log('\n💡 Prochaines étapes :');
    console.log('   1. Redémarrer le serveur dev: npm run dev');
    console.log('   2. Vérifier les images sur http://localhost:3001');
    console.log('   3. Si OK, commit et push les changements\n');
  }
}

// Exécution
(async () => {
  try {
    await updateAllVenues();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
})();
