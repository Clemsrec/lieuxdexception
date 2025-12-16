#!/usr/bin/env node

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialiser Firebase Admin si pas déjà fait
if (admin.apps.length === 0) {
  const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json');
  
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ Fichier firebase-service-account.json introuvable');
    process.exit(1);
  }
  
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

async function checkHeroImages() {
  console.log('🔍 Vérification des hero images dans Firestore...\n');
  
  const snapshot = await db.collection('venues').get();
  
  for (const doc of snapshot.docs) {
    const venue = doc.data();
    const slug = venue.slug || doc.id;
    
    console.log(`\n🏰 ${venue.name.toUpperCase()}`);
    console.log(`   Slug: ${slug}`);
    
    // Vérifier toutes les variantes d'images
    console.log(`   image: ${venue.image || 'MANQUANT'}`);
    console.log(`   heroImage: ${venue.heroImage || 'MANQUANT'}`);
    console.log(`   images.hero: ${venue.images?.hero || 'MANQUANT'}`);
    console.log(`   images.heroImage: ${venue.images?.heroImage || 'MANQUANT'}`);
    console.log(`   images.cardImage: ${venue.images?.cardImage || 'MANQUANT'}`);
    
    // Vérifier si le fichier existe
    const heroPath = venue.images?.heroImage || venue.images?.hero || venue.heroImage || venue.image;
    if (heroPath) {
      const filePath = path.join(process.cwd(), 'public', heroPath);
      const exists = fs.existsSync(filePath);
      console.log(`   Fichier: ${exists ? '✅' : '❌'} ${heroPath}`);
    }
  }
}

checkHeroImages().catch(console.error);
