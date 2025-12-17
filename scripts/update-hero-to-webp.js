#!/usr/bin/env node

/**
 * Script pour mettre à jour toutes les références d'images hero vers WebP
 * Next.js Image Component servira automatiquement AVIF si supporté par le navigateur
 */

const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieuxdexception.firebaseio.com'
  });
}

const db = admin.firestore();

const updates = {
  'chateau-brulaire': '/venues/chateau-brulaire/hero.webp',
  'chateau-corbe': '/venues/chateau-corbe/hero.webp',
  'domaine-nantais': '/venues/domaine-nantais/hero.webp',
  'manoir-boulaie': '/venues/manoir-boulaie/hero.webp',
  'le-dome': '/venues/le-dome/hero.webp'
};

async function updateHeroImages() {
  try {
    console.log('\n🖼️  MISE À JOUR IMAGES HERO → WebP\n');
    console.log('='.repeat(70));
    
    for (const [slug, webpPath] of Object.entries(updates)) {
      console.log(`\n📝 ${slug}...`);
      
      const venueRef = db.collection('venues').doc(slug);
      const doc = await venueRef.get();
      
      if (!doc.exists) {
        console.log(`   ⚠️  Venue non trouvée`);
        continue;
      }
      
      await venueRef.update({
        'images.hero': webpPath,
        'images.heroImage': webpPath,
        'images.cardImage': webpPath,
        updatedAt: admin.firestore.Timestamp.now().toDate().toISOString()
      });
      
      console.log(`   ✅ Images hero mises à jour → ${webpPath}`);
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('\n✅ TOUTES LES IMAGES HERO SONT MAINTENANT EN WebP !');
    console.log('\n💡 Next.js servira automatiquement AVIF si le navigateur le supporte');
    console.log('   Économies attendues: ~3.3 MB sur la homepage\n');
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    process.exit(1);
  }
}

updateHeroImages().then(() => process.exit(0));
