#!/usr/bin/env node

/**
 * Script pour compléter les adresses manquantes dans Firestore
 * Ajoute les coordonnées GPS et adresses complètes pour tous les châteaux
 */

const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/**
 * Données complètes pour chaque château
 * Sources: docs/INFORMATIONS-GÉNÉRALES-(GROUPE).md
 */
const venuesData = {
  'chateau-brulaire': {
    address: {
      street: 'Domaine de la Brûlaire',
      city: 'Gesté',
      postalCode: '49600',
      region: 'Pays de la Loire',
      department: 'Maine-et-Loire',
      country: 'France',
      coordinates: {
        lat: 47.1667,
        lng: -1.1833
      }
    },
    lat: 47.1667,
    lng: -1.1833,
    location: 'Maine-et-Loire (49)',
    region: 'Pays de la Loire'
  },
  'chateau-corbe': {
    address: {
      street: 'Château de la Corbe',
      city: 'Bournezeau',
      postalCode: '85480',
      region: 'Pays de la Loire',
      department: 'Vendée',
      country: 'France',
      coordinates: {
        lat: 46.6336,
        lng: -1.1642
      }
    },
    lat: 46.6336,
    lng: -1.1642,
    location: 'Vendée (85)',
    region: 'Pays de la Loire'
  },
  'manoir-boulaie': {
    address: {
      street: '33 rue de la Chapelle St Martin',
      city: 'Haute-Goulaine',
      postalCode: '44115',
      region: 'Pays de la Loire',
      department: 'Loire-Atlantique',
      country: 'France',
      coordinates: {
        lat: 47.1858,
        lng: -1.4267
      }
    },
    lat: 47.1858,
    lng: -1.4267,
    location: 'Loire-Atlantique (44)',
    region: 'Pays de la Loire'
  },
  'le-dome': {
    address: {
      street: '6 La Chevalerie',
      city: 'Port-Saint-Père',
      postalCode: '44710',
      region: 'Pays de la Loire',
      department: 'Loire-Atlantique',
      country: 'France',
      coordinates: {
        lat: 47.1328,
        lng: -1.7536
      }
    },
    lat: 47.1328,
    lng: -1.7536,
    location: 'Loire-Atlantique (44)',
    region: 'Pays de la Loire'
  },
  'domaine-nantais': {
    address: {
      street: 'Adresse à confirmer',
      city: 'Nantes',
      postalCode: '44000',
      region: 'Pays de la Loire',
      department: 'Loire-Atlantique',
      country: 'France',
      coordinates: {
        lat: 47.2184,
        lng: -1.5536
      }
    },
    lat: 47.2184,
    lng: -1.5536,
    location: 'Loire-Atlantique (44)',
    region: 'Pays de la Loire'
  }
};

async function updateVenueAddresses() {
  console.log('\n🏰 MISE À JOUR DES ADRESSES DES CHÂTEAUX\n');

  for (const [slug, data] of Object.entries(venuesData)) {
    try {
      const venueRef = db.collection('venues').doc(slug);
      
      await venueRef.update({
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        location: data.location,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`✅ ${slug}`);
      console.log(`   📍 ${data.address.street}, ${data.address.postalCode} ${data.address.city}`);
      console.log(`   🗺️  GPS: ${data.lat}, ${data.lng}\n`);
    } catch (error) {
      console.error(`❌ Erreur pour ${slug}:`, error.message);
    }
  }

  console.log('\n✨ Mise à jour terminée!\n');
  process.exit(0);
}

updateVenueAddresses();
