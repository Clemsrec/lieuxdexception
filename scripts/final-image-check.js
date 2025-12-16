#!/usr/bin/env node

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialiser Firebase Admin
if (admin.apps.length === 0) {
  const serviceAccount = require(path.join(process.cwd(), 'firebase-service-account.json'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

async function finalCheck() {
  console.log('🔍 VÉRIFICATION FINALE DES IMAGES\n');
  console.log('============================================================\n');
  
  const snapshot = await db.collection('venues').get();
  
  console.log('📊 HERO IMAGES PAR CHÂTEAU:\n');
  
  for (const doc of snapshot.docs) {
    const venue = doc.data();
    const heroPath = venue.images?.heroImage || venue.images?.hero || venue.heroImage || venue.image;
    
    if (heroPath) {
      const fullPath = path.join(process.cwd(), 'public', heroPath);
      const exists = fs.existsSync(fullPath);
      const status = exists ? '✅' : '❌';
      
      console.log(`${status} ${venue.name}`);
      console.log(`   Path: ${heroPath}`);
      
      if (exists) {
        const stats = fs.statSync(fullPath);
        const sizeKB = (stats.size / 1024).toFixed(0);
        console.log(`   Size: ${sizeKB} KB`);
      }
      console.log();
    } else {
      console.log(`❌ ${venue.name} - AUCUNE HERO IMAGE DÉFINIE`);
      console.log();
    }
  }
  
  console.log('============================================================');
  console.log('📁 IMAGES PLACEHOLDER:\n');
  
  const placeholders = [
    '/images/Vue-chateau.jpg',
    '/images/table.jpg',
    '/images/salle-seminaire.jpg',
    '/images/contact-hero.jpg'
  ];
  
  for (const img of placeholders) {
    const fullPath = path.join(process.cwd(), 'public', img);
    const exists = fs.existsSync(fullPath);
    console.log(`${exists ? '✅' : '❌'} ${img}`);
  }
  
  console.log('\n============================================================');
  console.log('✅ Vérification terminée !');
  console.log('🚀 Redémarrez le serveur pour voir les changements\n');
}

finalCheck().catch(console.error);
