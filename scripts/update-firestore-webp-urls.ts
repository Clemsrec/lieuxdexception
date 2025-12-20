/**
 * Mise à jour URLs Firestore avec images WebP optimisées
 * CRITIQUE : Les pages chargent encore les anciennes URLs depuis Firestore
 */

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';
import * as serviceAccount from '../firebase-service-account.json';

// Initialiser Admin SDK
const app = initializeApp({
  credential: credential.cert(serviceAccount as any)
});

const db = getFirestore(app);
db.settings({ databaseId: 'lieuxdexception' });

async function updateFirestoreUrls() {
  console.log('🔄 MISE À JOUR URLS FIRESTORE → WebP\n');

  try {
    const venuesRef = db.collection('venues');
    const snapshot = await venuesRef.get();

    console.log(`📋 ${snapshot.size} venues trouvés\n`);

    let updatedCount = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const updates: any = {};
      let hasUpdates = false;

      // 1. Hero image : .jpg → .webp
      if (data.heroImage) {
        if (data.heroImage.includes('chateau-brulaire/hero.jpg')) {
          updates.heroImage = 'venues/chateau-brulaire/hero.webp';
          hasUpdates = true;
          console.log(`✅ ${doc.id}: hero.jpg → hero.webp`);
        }
      }

      // 2. Logo : .png → .webp (Dôme, Domaine)
      if (data.logo) {
        if (data.logo.includes('dome-blanc.png')) {
          updates.logo = 'logos/venues/dome-blanc.webp';
          hasUpdates = true;
          console.log(`✅ ${doc.id}: dome-blanc.png → .webp`);
        } else if (data.logo.includes('domaine-blanc.png')) {
          updates.logo = 'logos/venues/domaine-blanc.webp';
          hasUpdates = true;
          console.log(`✅ ${doc.id}: domaine-blanc.png → .webp`);
        }
      }

      // 3. Galleries mariages
      if (data.galleries?.mariages) {
        const updatedGallery = data.galleries.mariages.map((img: string) => {
          if (img.includes('domaine_cocktail_1.jpg')) {
            hasUpdates = true;
            return 'venues/domaine-nantais/mariages/domaine_cocktail_1.webp';
          }
          return img;
        });

        if (hasUpdates) {
          updates['galleries.mariages'] = updatedGallery;
          console.log(`✅ ${doc.id}: domaine_cocktail_1.jpg → .webp`);
        }
      }

      // Appliquer les mises à jour
      if (hasUpdates) {
        await venuesRef.doc(doc.id).update(updates);
        updatedCount++;
      }
    }

    console.log(`\n✅ ${updatedCount} venues mis à jour avec URLs WebP`);
    console.log('\n🎯 Économies attendues après refresh :');
    console.log('  - Brûlaire hero : 3 927 KB → 924 KB (-76%)');
    console.log('  - Logos Dôme/Domaine : 257 KB → 21 KB (-92%)');
    console.log('  - Domaine cocktail : 267 KB → 120 KB (-55%)');
    console.log('  - TOTAL : ~3.3 MB économisés\n');

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }

  process.exit(0);
}

updateFirestoreUrls();
