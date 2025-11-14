import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '../firebase-service-account.json'), 'utf8')
);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Images placeholder qui existent déjà
const placeholders = {
  hero: '/images/Vue-chateau.jpg',
  gallery: [
    '/images/table.jpg',
    '/images/table-seminaire.jpg',
    '/images/salle-seminaire.jpg'
  ],
  thumbnail: '/images/Vue-chateau.jpg'
};

async function fixImages() {
  const venuesRef = db.collection('venues');
  const snapshot = await venuesRef.get();
  
  console.log(`Mise à jour de ${snapshot.size} venues...`);
  
  for (const doc of snapshot.docs) {
    await doc.ref.update({
      'images.hero': placeholders.hero,
      'images.gallery': placeholders.gallery,
      'images.thumbnail': placeholders.thumbnail
    });
    console.log(`✅ ${doc.id} mis à jour`);
  }
  
  console.log('✅ Toutes les images mises à jour avec des placeholders');
  process.exit(0);
}

fixImages().catch(console.error);
