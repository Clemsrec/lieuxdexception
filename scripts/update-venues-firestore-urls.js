/**
 * Script pour mettre à jour tous les documents Firestore venues
 * Remplace les URLs /venues/* par les URLs Firebase Storage
 * 
 * Utilise le mapping généré par upload-venues-images-to-storage.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialiser Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = require('../firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'lieux-d-exceptions.firebasestorage.app'
  });
}

const db = admin.firestore();
const mappingPath = path.join(__dirname, 'venues-storage-mapping.json');

/**
 * Charge le mapping des URLs Storage
 */
function loadMapping() {
  if (!fs.existsSync(mappingPath)) {
    console.error(`❌ Fichier mapping non trouvé: ${mappingPath}`);
    console.log('⚠️  Exécutez d\'abord: node scripts/upload-venues-images-to-storage.js');
    process.exit(1);
  }
  
  return JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
}

/**
 * Convertit un chemin local /venues/slug/... en URL Storage
 */
function convertPathToStorageUrl(localPath, venueSlug, mapping) {
  // Nettoyer le chemin (enlever /venues/ ou ./venues/)
  let cleanPath = localPath.replace(/^\.?\/venues\//, '').replace(/^venues\//, '');
  
  // Enlever le slug au début si présent
  cleanPath = cleanPath.replace(new RegExp(`^${venueSlug}/`), '');
  
  // Chercher dans le mapping
  const venueFiles = mapping[venueSlug] || [];
  const match = venueFiles.find(file => 
    file.localPath === cleanPath || 
    file.storagePath.endsWith(cleanPath)
  );
  
  if (match) {
    return match.url;
  }
  
  // Si pas trouvé dans le mapping, construire l'URL manuellement
  const encodedPath = `venues/${venueSlug}/${cleanPath}`.split('/').map(encodeURIComponent).join('/');
  return `https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/${encodedPath}?alt=media`;
}

/**
 * Met à jour récursivement tous les chemins /venues/ dans un objet
 */
function updateImagePaths(obj, venueSlug, mapping, updatedPaths = new Set()) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => updateImagePaths(item, venueSlug, mapping, updatedPaths));
  }
  
  const updated = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && value.startsWith('/venues/')) {
      const newUrl = convertPathToStorageUrl(value, venueSlug, mapping);
      updated[key] = newUrl;
      updatedPaths.add(`${key}: ${value} → ${newUrl}`);
    } else if (typeof value === 'object' && value !== null) {
      updated[key] = updateImagePaths(value, venueSlug, mapping, updatedPaths);
    } else {
      updated[key] = value;
    }
  }
  
  return updated;
}

/**
 * Met à jour un document venue dans Firestore
 */
async function updateVenueDocument(venueId, venueSlug, mapping) {
  try {
    const docRef = db.collection('venues').doc(venueId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log(`⚠️  Document ${venueId} n'existe pas`);
      return { updated: false, changes: 0 };
    }
    
    const data = doc.data();
    const updatedPaths = new Set();
    
    // Mettre à jour récursivement tous les chemins
    const updatedData = updateImagePaths(data, venueSlug, mapping, updatedPaths);
    
    if (updatedPaths.size === 0) {
      console.log(`ℹ️  ${venueSlug}: Aucun changement nécessaire`);
      return { updated: false, changes: 0 };
    }
    
    // Sauvegarder les modifications
    await docRef.update(updatedData);
    
    console.log(`✅ ${venueSlug}: ${updatedPaths.size} chemins mis à jour`);
    updatedPaths.forEach(path => console.log(`   - ${path}`));
    
    return { updated: true, changes: updatedPaths.size };
  } catch (error) {
    console.error(`❌ Erreur mise à jour ${venueSlug}:`, error.message);
    return { updated: false, changes: 0, error: error.message };
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🔄 Mise à jour des documents Firestore venues avec URLs Storage\n');
  
  // Charger le mapping
  const mapping = loadMapping();
  const venueSlugs = Object.keys(mapping);
  console.log(`📋 ${venueSlugs.length} venues à traiter: ${venueSlugs.join(', ')}\n`);
  
  // Récupérer tous les documents venues
  const venuesSnapshot = await db.collection('venues').get();
  const venues = [];
  
  venuesSnapshot.forEach(doc => {
    venues.push({
      id: doc.id,
      slug: doc.data().slug
    });
  });
  
  console.log(`📚 ${venues.length} documents trouvés dans Firestore\n`);
  
  let totalUpdated = 0;
  let totalChanges = 0;
  const errors = [];
  
  // Mettre à jour chaque venue
  for (const venue of venues) {
    if (!mapping[venue.slug]) {
      console.log(`⚠️  ${venue.slug}: Pas de mapping trouvé (aucune image uploadée ?)`);
      continue;
    }
    
    const result = await updateVenueDocument(venue.id, venue.slug, mapping);
    
    if (result.updated) {
      totalUpdated++;
      totalChanges += result.changes;
    }
    
    if (result.error) {
      errors.push({ venue: venue.slug, error: result.error });
    }
    
    // Petit délai pour éviter de surcharger Firestore
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Résumé
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ DE LA MISE À JOUR FIRESTORE');
  console.log('='.repeat(60));
  console.log(`Documents mis à jour : ${totalUpdated}/${venues.length}`);
  console.log(`Total chemins modifiés : ${totalChanges}`);
  console.log(`Erreurs : ${errors.length}`);
  console.log('='.repeat(60));
  
  if (errors.length > 0) {
    console.log('\n❌ ERREURS:');
    errors.forEach(e => console.log(`  - ${e.venue}: ${e.error}`));
  }
  
  console.log('\n✨ Mise à jour terminée !');
  process.exit(0);
}

// Exécution
main().catch(error => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
});
