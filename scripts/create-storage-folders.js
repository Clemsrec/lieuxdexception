/**
 * Script pour créer la structure de dossiers dans Firebase Storage
 * Usage: node scripts/create-storage-folders.js
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const serviceAccount = require('../firebase-service-account.json');

// Initialiser Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'lieux-d-exceptions.firebasestorage.app'
});

const db = getFirestore(app);
const storage = getStorage(app).bucket();

/**
 * Créer un dossier dans Storage en uploadant un fichier placeholder
 */
async function createFolder(folderPath) {
  const placeholderPath = `${folderPath}/.placeholder`;
  
  try {
    const file = storage.file(placeholderPath);
    await file.save('', {
      metadata: {
        contentType: 'text/plain',
        metadata: {
          description: 'Placeholder pour maintenir la structure de dossiers'
        }
      }
    });
    console.log(`✅ Dossier créé: ${folderPath}`);
  } catch (error) {
    console.error(`❌ Erreur création dossier ${folderPath}:`, error.message);
  }
}

/**
 * Script principal
 */
async function main() {
  console.log('🚀 Création de la structure de dossiers dans Firebase Storage...\n');
  
  try {
    // 1. Créer le dossier Logos
    console.log('📁 Création du dossier Logos...');
    await createFolder('Logos');
    
    // 2. Récupérer tous les lieux depuis Firestore
    console.log('\n📁 Création des dossiers pour chaque château...');
    const venuesSnapshot = await db.collection('venues').get();
    
    if (venuesSnapshot.empty) {
      console.log('⚠️  Aucun lieu trouvé dans Firestore');
      return;
    }
    
    console.log(`   Nombre de lieux trouvés: ${venuesSnapshot.size}\n`);
    
    // 3. Créer un dossier pour chaque lieu
    for (const doc of venuesSnapshot.docs) {
      const venue = doc.data();
      const venueName = venue.name || doc.id;
      
      // Nettoyer le nom pour créer un nom de dossier valide
      const folderName = venueName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
        .replace(/[^a-zA-Z0-9\s-]/g, '')  // Retirer les caractères spéciaux
        .replace(/\s+/g, '-')              // Remplacer espaces par tirets
        .toLowerCase();
      
      await createFolder(folderName);
    }
    
    console.log('\n✨ Structure de dossiers créée avec succès!');
    console.log('\n📋 Dossiers créés:');
    console.log('   - Logos');
    console.log(`   - ${venuesSnapshot.size} dossiers pour les châteaux`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

main();
