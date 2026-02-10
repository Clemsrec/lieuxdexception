#!/usr/bin/env node

/**
 * Script de test pour Firebase Storage
 * Vérifie l'accès au bucket et liste les fichiers
 */

const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const fs = require('fs');
const path = require('path');

// Initialiser Firebase Admin
function initAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  try {
    // Dev: Service account key
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY || fs.existsSync('./firebase-service-account.json')) {
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || './firebase-service-account.json';
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      
      console.log('🔑 Utilisation du service account:', serviceAccount.client_email);
      console.log('🏗️  Projet:', serviceAccount.project_id);
      
      return initializeApp({
        credential: cert(serviceAccount),
        storageBucket: 'lieux-d-exceptions.firebasestorage.app',
      });
    }

    throw new Error('❌ Aucun service account trouvé');
  } catch (error) {
    console.error('💥 Erreur initialisation:', error.message);
    process.exit(1);
  }
}

async function testStorage() {
  const app = initAdmin();
  const bucket = getStorage(app).bucket();
  
  console.log('🪣 Bucket:', bucket.name);
  
  try {
    // Test 1: Lister tous les fichiers (les 20 premiers)
    console.log('\n📂 Test 1: Listing des fichiers (max 20)...');
    const [allFiles] = await bucket.getFiles({ maxResults: 20 });
    
    console.log(`✅ ${allFiles.length} fichiers trouvés:`);
    
    for (const file of allFiles) {
      console.log(`   📄 ${file.name}`);
      
      // Afficher quelques détails pour les 3 premiers
      if (allFiles.indexOf(file) < 3) {
        try {
          const [metadata] = await file.getMetadata();
          console.log(`      📏 ${metadata.size} bytes, ${metadata.contentType}`);
        } catch (err) {
          console.log(`      ⚠️  Erreur métadonnées: ${err.message}`);
        }
      }
    }
    
    // Test 2: Lister avec delimiter pour voir les dossiers
    console.log('\n📁 Test 2: Listing avec delimiter...');
    const [filesWithDelimiter] = await bucket.getFiles({ delimiter: '/' });
    
    console.log(`✅ ${filesWithDelimiter.length} éléments racine:`);
    filesWithDelimiter.forEach(file => {
      console.log(`   📁 ${file.name}`);
    });
    
    // Test 3: Tester dossier venues spécifiquement
    console.log('\n🏰 Test 3: Dossier venues...');
    const [venuesFiles] = await bucket.getFiles({ prefix: 'venues/', delimiter: '/' });
    
    console.log(`✅ ${venuesFiles.length} éléments dans venues/:`);
    venuesFiles.forEach(file => {
      console.log(`   🏛️  ${file.name}`);
    });
    
  } catch (error) {
    console.error('💥 Erreur lors du test:', error);
  }
}

// Exécuter le test
testStorage().then(() => {
  console.log('\n🎉 Test terminé !');
  process.exit(0);
}).catch(error => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
});