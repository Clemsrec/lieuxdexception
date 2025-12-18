/**
 * Vérifier que tous les lieux ont des images hero valides
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const serviceAccount = require('../firebase-service-account.json');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

async function checkAllVenuesImages() {
  try {
    const snapshot = await db.collection('venues').where('active', '==', true).get();
    
    console.log(`🔍 Vérification de ${snapshot.size} lieux actifs...\n`);
    
    const issues = [];
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const venueId = doc.id;
      const heroImage = data.heroImage || data.images?.hero || data.images?.heroImage;
      
      if (!heroImage) {
        issues.push({
          id: venueId,
          name: data.name,
          problem: 'Aucune image hero définie'
        });
        continue;
      }
      
      // Vérifier si le fichier existe
      const publicPath = path.join(__dirname, '..', 'public', heroImage);
      
      if (!fs.existsSync(publicPath)) {
        issues.push({
          id: venueId,
          name: data.name,
          heroImage,
          problem: `Fichier introuvable: ${heroImage}`
        });
      } else {
        console.log(`✅ ${data.name}: ${heroImage}`);
      }
    }
    
    if (issues.length > 0) {
      console.log(`\n❌ ${issues.length} problème(s) détecté(s):\n`);
      issues.forEach(issue => {
        console.log(`   ${issue.name} (${issue.id})`);
        console.log(`   → ${issue.problem}`);
        if (issue.heroImage) {
          console.log(`   → Référence: ${issue.heroImage}`);
        }
        console.log('');
      });
    } else {
      console.log('\n✅ Tous les lieux ont des images hero valides!');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

checkAllVenuesImages();
