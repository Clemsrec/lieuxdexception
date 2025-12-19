/**
 * Script pour vérifier toutes les entrées timeline et identifier celles sans image
 * 
 * Usage: node scripts/check-all-timeline-images.js
 */

const admin = require('firebase-admin');

// Initialiser Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkAllTimelineImages() {
  try {
    console.log('🔍 Vérification de toutes les entrées timeline...\n');

    const snapshot = await db.collection('timeline')
      .orderBy('date', 'desc')
      .get();

    if (snapshot.empty) {
      console.log('❌ Aucune entrée timeline trouvée');
      return;
    }

    console.log(`📊 Total: ${snapshot.size} entrées\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    let withImage = 0;
    let withoutImage = 0;
    const missingImages = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      const hasImage = Boolean(data.image);
      
      if (hasImage) {
        withImage++;
      } else {
        withoutImage++;
        missingImages.push({
          id: doc.id,
          date: data.date,
          venue: data.venue || data.venueName,
          event: data.event
        });
      }

      const status = hasImage ? '✅' : '❌';
      console.log(`${status} ${data.date || 'N/A'} | ${(data.venueName || data.venue || 'N/A').padEnd(25)} | ${data.event || 'N/A'}`);
    });

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('\n📈 Statistiques:');
    console.log(`   ✅ Avec image: ${withImage}`);
    console.log(`   ❌ Sans image: ${withoutImage}`);
    console.log(`   📊 Total: ${snapshot.size}`);

    if (missingImages.length > 0) {
      console.log('\n⚠️  Entrées sans image:');
      console.log('═══════════════════════════════════════════════════════════════\n');
      missingImages.forEach((entry, index) => {
        console.log(`${index + 1}. ${entry.date} - ${entry.venue}`);
        console.log(`   Event: ${entry.event}`);
        console.log(`   ID: ${entry.id}`);
        console.log('');
      });
    } else {
      console.log('\n🎉 Toutes les entrées ont une image !');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

// Exécuter
checkAllTimelineImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
