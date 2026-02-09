/**
 * Script pour lister les fichiers dans Firebase Storage
 * et comparer avec les URLs dans Firestore
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

async function listStorageFiles() {
  try {
    console.log('\n=== STRUCTURE FIREBASE STORAGE ===\n');

    // Lister les fichiers dans venues/
    const [files] = await bucket.getFiles({ prefix: 'venues/' });
    
    // Grouper par lieu
    const venueFiles = {};
    
    files.forEach(file => {
      const parts = file.name.split('/');
      if (parts.length >= 2) {
        const venueName = parts[1]; // venues/{nom-lieu}/...
        if (!venueFiles[venueName]) {
          venueFiles[venueName] = [];
        }
        venueFiles[venueName].push(file.name);
      }
    });

    console.log(`Total fichiers trouvés : ${files.length}\n`);

    // Afficher par lieu
    for (const [venue, fileList] of Object.entries(venueFiles)) {
      console.log(`📁 ${venue} (${fileList.length} fichiers)`);
      
      // Afficher les 5 premiers
      fileList.slice(0, 5).forEach(filePath => {
        console.log(`   └─ ${filePath}`);
      });
      
      if (fileList.length > 5) {
        console.log(`   └─ ... et ${fileList.length - 5} autres fichiers`);
      }
      console.log('');
    }

    console.log('\n=== COMPARAISON AVEC FIRESTORE ===\n');

    const snapshot = await db.collection('venues').get();
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const galleryUrls = data.images?.gallery || [];
      
      if (galleryUrls.length > 0) {
        console.log(`🏰 ${data.name}`);
        console.log(`   Firestore : ${galleryUrls.length} URLs enregistrées`);
        
        // Extraire le chemin Storage de la première URL
        if (galleryUrls[0]) {
          const match = galleryUrls[0].match(/\/o\/([^?]+)\?/);
          if (match) {
            const storagePath = decodeURIComponent(match[1]);
            console.log(`   Exemple path : ${storagePath}`);
            
            // Vérifier si ce fichier existe dans Storage
            const exists = files.some(f => f.name === storagePath);
            console.log(`   Existe dans Storage : ${exists ? '✅' : '❌'}`);
          }
        }
        console.log('');
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  }
}

listStorageFiles()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
