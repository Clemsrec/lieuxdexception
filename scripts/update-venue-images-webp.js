const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

async function updateVenueImages() {
  console.log('🔄 Mise à jour des URLs d\'images dans Firestore\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/';
    
    // 1. Château de la Brûlaire : hero.jpg → hero.webp
    console.log('🏰 Château de la Brûlaire');
    const brulaire = await db.collection('venues').where('slug', '==', 'chateau-brulaire').get();
    if (!brulaire.empty) {
      const doc = brulaire.docs[0];
      await doc.ref.update({
        heroImage: `${baseUrl}venues%2Fchateau-brulaire%2Fhero.webp?alt=media`,
        updatedAt: admin.firestore.Timestamp.now()
      });
      console.log('   ✅ hero.jpg → hero.webp (3.9 MB → 603 KB)');
    }

    // 2. Château de la Corbe : hero.jpg → hero.webp
    console.log('\n🏰 Château de la Corbe');
    const corbe = await db.collection('venues').where('slug', '==', 'chateau-corbe').get();
    if (!corbe.empty) {
      const doc = corbe.docs[0];
      await doc.ref.update({
        heroImage: `${baseUrl}venues%2Fchateau-corbe%2Fhero.webp?alt=media`,
        updatedAt: admin.firestore.Timestamp.now()
      });
      console.log('   ✅ hero.jpg → hero.webp (213 KB → 219 KB - déjà optimisé)');
    }

    // 3. Domaine Nantais : image galerie cocktail
    console.log('\n🏰 Domaine Nantais (galerie mariages)');
    const domaine = await db.collection('venues').where('slug', '==', 'domaine-nantais').get();
    if (!domaine.empty) {
      const doc = domaine.docs[0];
      const data = doc.data();
      
      if (data.galleries && data.galleries.mariages) {
        const updatedImages = data.galleries.mariages.map(img => {
          if (img.includes('domaine_cocktail_1.jpg')) {
            return img.replace('domaine_cocktail_1.jpg', 'domaine_cocktail_1.webp');
          }
          return img;
        });

        await doc.ref.update({
          'galleries.mariages': updatedImages,
          updatedAt: admin.firestore.Timestamp.now()
        });
        console.log('   ✅ domaine_cocktail_1.jpg → .webp (266 KB → 119 KB)');
      }
    }

    console.log('\n\n📊 RÉSUMÉ');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ 3 lieux mis à jour');
    console.log('💰 Économie estimée: ~3.5 MB de bande passante');
    console.log('⚡️ Impact LCP: Amélioration significative attendue');
    
    console.log('\n\n✨ Les images WebP optimisées sont maintenant servies !');
    console.log('📊 Relancer Lighthouse pour mesurer l\'amélioration\n');

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

updateVenueImages()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
