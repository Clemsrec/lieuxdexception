#!/usr/bin/env node

/**
 * Script d'import des données exemple dans Firestore
 * 
 * Usage:
 *   node scripts/import-example-data.js
 * 
 * Ce script importe les données d'exemple depuis docs/firestore-example-data.json
 * dans la collection 'venues' de Firestore.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration Firebase (depuis variables d'environnement)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('🔥 Initialisation Firebase...');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Convertit les dates ISO en Timestamp Firestore
 */
function convertDates(obj) {
  const result = { ...obj };
  
  if (result.createdAt && typeof result.createdAt === 'string') {
    result.createdAt = Timestamp.fromDate(new Date(result.createdAt));
  }
  
  if (result.updatedAt && typeof result.updatedAt === 'string') {
    result.updatedAt = Timestamp.fromDate(new Date(result.updatedAt));
  }
  
  return result;
}

/**
 * Importe les données dans Firestore
 */
async function importData() {
  try {
    // Charger les données depuis le fichier JSON
    const dataPath = join(__dirname, '..', 'docs', 'firestore-example-data.json');
    const rawData = readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    console.log('📦 Données chargées depuis', dataPath);
    
    if (!data.venues) {
      throw new Error('Aucune donnée "venues" trouvée dans le fichier JSON');
    }

    const venuesCollection = collection(db, 'venues');
    const venueIds = Object.keys(data.venues);

    console.log(`\n📍 Import de ${venueIds.length} lieux...`);

    for (const venueId of venueIds) {
      const venue = data.venues[venueId];
      const venueWithTimestamps = convertDates(venue);
      
      const docRef = doc(venuesCollection, venueId);
      await setDoc(docRef, venueWithTimestamps);
      
      console.log(`  ✅ ${venue.name} (${venueId})`);
    }

    console.log('\n🎉 Import terminé avec succès !');
    console.log(`\n💡 Vous pouvez maintenant voir les lieux sur:`);
    console.log(`   - http://localhost:3000/catalogue`);
    console.log(`   - http://localhost:3000/comparer`);
    
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'import:', error.message);
    process.exit(1);
  }
}

// Lancer l'import
importData();
