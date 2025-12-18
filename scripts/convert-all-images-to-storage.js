/**
 * Script COMPLET pour convertir TOUTES les références d'images vers Storage
 * Gère tous les champs : gallery, images.gallery, galleries.b2b, galleries.mariages, etc.
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

if (!admin.apps.length) {
  const serviceAccount = require('../firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'lieux-d-exceptions.firebasestorage.app'
  });
}

const db = admin.firestore();
const mappingPath = path.join(__dirname, 'venues-storage-mapping.json');

// Charger le mapping
function loadMapping() {
  if (!fs.existsSync(mappingPath)) {
    console.error(`❌ Fichier mapping non trouvé: ${mappingPath}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
}

/**
 * Convertit un chemin local en URL Storage
 */
function convertToStorageUrl(localPath, venueSlug, mapping) {
  if (!localPath || typeof localPath !== 'string') return localPath;
  
  // Déjà une URL Storage
  if (localPath.includes('firebasestorage.googleapis.com')) {
    return localPath;
  }
  
  // Pas un chemin /venues/
  if (!localPath.startsWith('/venues/')) {
    return localPath;
  }
  
  // Nettoyer le chemin
  let cleanPath = localPath.replace(/^\/venues\//, '');
  cleanPath = cleanPath.replace(new RegExp(`^${venueSlug}/`), '');
  
  // Chercher dans le mapping
  const venueFiles = mapping[venueSlug] || [];
  const match = venueFiles.find(file => 
    file.localPath === cleanPath || 
    file.storagePath.endsWith(cleanPath) ||
    file.localPath.endsWith(cleanPath)
  );
  
  if (match) {
    return match.url;
  }
  
  // Construire manuellement l'URL
  const encodedPath = `venues/${venueSlug}/${cleanPath}`
    .split('/')
    .map(encodeURIComponent)
    .join('/');
  
  return `https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/${encodedPath}?alt=media`;
}

/**
 * Convertit récursivement tous les chemins dans un objet
 */
function convertAllPaths(obj, venueSlug, mapping, stats = { converted: 0, total: 0 }) {
  if (!obj) return obj;
  
  // Tableau
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'string' && item.startsWith('/venues/')) {
        stats.total++;
        const converted = convertToStorageUrl(item, venueSlug, mapping);
        if (converted !== item) stats.converted++;
        return converted;
      }
      return convertAllPaths(item, venueSlug, mapping, stats);
    });
  }
  
  // Objet
  if (typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' && value.startsWith('/venues/')) {
        stats.total++;
        const converted = convertToStorageUrl(value, venueSlug, mapping);
        if (converted !== value) stats.converted++;
        result[key] = converted;
      } else if (typeof value === 'object') {
        result[key] = convertAllPaths(value, venueSlug, mapping, stats);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  
  return obj;
}

/**
 * Met à jour un document venue
 */
async function updateVenueComplete(venueId, venueSlug, mapping) {
  try {
    const docRef = db.collection('venues').doc(venueId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log(`⚠️  ${venueSlug}: Document n'existe pas`);
      return { updated: false, stats: { total: 0, converted: 0 } };
    }
    
    const data = doc.data();
    const stats = { total: 0, converted: 0 };
    
    // Convertir TOUS les chemins récursivement
    const updatedData = convertAllPaths(data, venueSlug, mapping, stats);
    
    if (stats.converted === 0) {
      console.log(`ℹ️  ${venueSlug}: Aucune conversion nécessaire (${stats.total} déjà Storage)`);
      return { updated: false, stats };
    }
    
    // Sauvegarder
    await docRef.update(updatedData);
    
    console.log(`✅ ${venueSlug}: ${stats.converted}/${stats.total} chemins convertis`);
    
    return { updated: true, stats };
  } catch (error) {
    console.error(`❌ ${venueSlug}:`, error.message);
    return { updated: false, stats: { total: 0, converted: 0 }, error: error.message };
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🔄 Conversion COMPLÈTE de toutes les images vers Storage\n');
  
  const mapping = loadMapping();
  const venueSlugs = Object.keys(mapping);
  console.log(`📋 ${venueSlugs.length} venues à traiter\n`);
  
  // Récupérer tous les documents
  const snapshot = await db.collection('venues').get();
  const venues = [];
  
  snapshot.forEach(doc => {
    venues.push({
      id: doc.id,
      slug: doc.data().slug
    });
  });
  
  let totalConverted = 0;
  let totalPaths = 0;
  let venuesUpdated = 0;
  
  // Traiter chaque venue
  for (const venue of venues) {
    if (!mapping[venue.slug]) {
      console.log(`⚠️  ${venue.slug}: Pas de mapping`);
      continue;
    }
    
    const result = await updateVenueComplete(venue.id, venue.slug, mapping);
    
    if (result.updated) {
      venuesUpdated++;
    }
    
    totalConverted += result.stats.converted;
    totalPaths += result.stats.total;
    
    // Délai anti-spam
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Résumé
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ CONVERSION COMPLÈTE');
  console.log('='.repeat(60));
  console.log(`Venues mises à jour : ${venuesUpdated}/${venues.length}`);
  console.log(`Chemins convertis : ${totalConverted}`);
  console.log(`Total chemins traités : ${totalPaths}`);
  console.log(`Taux conversion : ${Math.round((totalConverted / totalPaths) * 100)}%`);
  console.log('='.repeat(60));
  
  console.log('\n✨ Conversion complète terminée !');
  process.exit(0);
}

main().catch(error => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
});
