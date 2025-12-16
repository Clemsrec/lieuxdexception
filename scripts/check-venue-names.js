#!/usr/bin/env node

const admin = require('firebase-admin');
const path = require('path');

if (admin.apps.length === 0) {
  const serviceAccount = require(path.join(process.cwd(), 'firebase-service-account.json'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkNames() {
  console.log('🔍 Vérification des noms de châteaux dans Firestore\n');
  
  const snapshot = await db.collection('venues').get();
  
  for (const doc of snapshot.docs) {
    const venue = doc.data();
    console.log(`ID: ${doc.id}`);
    console.log(`Nom: "${venue.name}"`);
    console.log(`Slug: ${venue.slug}`);
    console.log('---');
  }
}

checkNames().catch(console.error);
