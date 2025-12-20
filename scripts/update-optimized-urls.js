/**
 * Mettre à jour les URLs des images optimisées dans Firestore
 * Et corriger les références dans storage-assets.ts
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../firebase-service-account.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
db.settings({ databaseId: 'lieuxdexception' });

async function updateVenueImages() {
  console.log('🔄 Mise à jour des URLs Firestore\n');

  // 1. Brûlaire hero : .jpg → .webp
  console.log('1️⃣  Château de la Brûlaire - Hero');
  const brulaire = await db.collection('venues').doc('chateau-brulaire').get();
  if (brulaire.exists) {
    await db.collection('venues').doc('chateau-brulaire').update({
      heroImage: 'venues/chateau-brulaire/hero.webp'
    });
    console.log('   ✅ Updated: hero.jpg → hero.webp\n');
  }

  // 2. Domaine cocktail : .jpg → .webp
  console.log('2️⃣  Domaine Nantais - Mariages gallery');
  const domaine = await db.collection('venues').doc('domaine-nantais').get();
  if (domaine.exists) {
    const data = domaine.data();
    if (data.galleries?.mariages) {
      const updated = data.galleries.mariages.map(img => 
        img === 'venues/domaine-nantais/mariages/domaine_cocktail_1.jpg'
          ? 'venues/domaine-nantais/mariages/domaine_cocktail_1.webp'
          : img
      );
      await db.collection('venues').doc('domaine-nantais').update({
        'galleries.mariages': updated
      });
      console.log('   ✅ Updated: domaine_cocktail_1.jpg → .webp\n');
    }
  }

  // 3. Logos venues
  console.log('3️⃣  Logos venues (Dôme, Domaine)');
  const logosUpdates = [
    { id: 'chateau-le-dome', field: 'logo', old: 'logos/venues/dome-blanc.png', new: 'logos/venues/dome-blanc.webp' },
    { id: 'domaine-nantais', field: 'logo', old: 'logos/venues/domaine-blanc.png', new: 'logos/venues/domaine-blanc.webp' }
  ];

  for (const update of logosUpdates) {
    await db.collection('venues').doc(update.id).update({
      [update.field]: update.new
    });
    console.log(`   ✅ ${update.id}: ${path.basename(update.old)} → .webp`);
  }

  console.log('\n✅ Toutes les URLs Firestore mises à jour');
}

const path = require('path');
updateVenueImages().catch(console.error);
