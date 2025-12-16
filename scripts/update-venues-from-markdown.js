/**
 * Script de mise à jour des venues avec données des fichiers markdown
 * SANS les prix (selon consigne)
 */

const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieuxdexception.firebaseio.com'
  });
}

const db = admin.firestore();

const venuesData = {
  'chateau-brulaire': {
    rooms: 4,
    accommodationRooms: 15,
    accommodationDetails: '15 chambres dont 8 twin',
    detailedSpaces: [
      { name: "Comte du Fou", size: 100, unit: "m²" },
      { name: "L'Orangerie", size: 200, unit: "m²" },
      { name: "Salons du Château", size: 200, unit: "m²" },
      { name: "Parc", size: 5000, unit: "m²" }
    ],
    capacityDetails: {
      meeting: 20,
      uShape: 20,
      theater: 200,
      cabaret: 3500,
      classroom: null,
      banquet: 170,
      cocktail: 450
    },
    equipment: [
      "Équipement son",
      "Écran LCD",
      "Vidéoprojecteur",
      "Wifi",
      "Paperboard",
      "DJ",
      "Animations",
      "Micro"
    ],
    activities: [
      "Rallye & Chasse au trésor"
    ],
    parkingSpaces: 100
  },
  
  'chateau-corbe': {
    rooms: 3,
    accommodationRooms: 0,
    status: "Nouveau",
    detailedSpaces: [
      { name: "Salle Atlantique", size: 70, unit: "m²" },
      { name: "L'Orangerie", size: 380, unit: "m²" },
      { name: "Parc", size: 25000, unit: "m²" }
    ],
    capacityDetails: {
      meeting: 25,
      uShape: 25,
      theater: 300,
      cabaret: 250,
      classroom: 35,
      banquet: 300,
      cocktail: 450,
      cocktailPark: 5000 // Capacité massive du parc de 25 hectares
    },
    equipment: [
      "Équipement son",
      "Vidéoprojecteur",
      "Wifi",
      "Sonorisation professionnelle",
      "Éclairage architectural"
    ],
    services: [
      "Parking 100 places",
      "Cuisine traiteur équipée",
      "Accès PMR"
    ]
  },
  
  'domaine-nantais': {
    rooms: 3,
    accommodationRooms: 0,
    privatizable: true,
    renovationDate: "Mars 2025",
    detailedSpaces: [
      { name: "Grande Salle", size: 200, unit: "m²" },
      { name: "Espace Accueil", size: 120, unit: "m²" },
      { name: "Le Parc", size: 1500, unit: "m²" }
    ],
    capacityDetails: {
      meeting: 25,
      uShape: 30,
      theater: 200,
      cabaret: 50,
      classroom: 100,
      banquet: 400, // Correction : 400 selon .md
      cocktail: 100 // Dans espace accueil
    },
    equipment: [
      "Équipement son",
      "Écran LCD",
      "Micro",
      "DJ",
      "Vidéoprojecteur",
      "Paperboard",
      "Wifi"
    ],
    services: [
      "Vestiaire",
      "Piste de danse",
      "Parking sur place",
      "Accès PMR",
      "Terrasse / Cour intérieure",
      "Jardin / Parc",
      "Cuisine événementielle"
    ],
    activities: [
      "Multi-Activités & Olympiades",
      "Oenologie",
      "Rallye & Chasse au trésor",
      "VTT"
    ]
  },
  
  'manoir-boulaie': {
    rooms: 11,
    accommodationRooms: 11,
    accommodationDetails: '11 chambres',
    status: "Ouverture prochainement",
    totalSurfaceRooms: 600,
    detailedSpaces: [
      { name: "Salon séminaires et réceptions", size: 280, unit: "m²" },
      { name: "Salon de travail", size: 70, unit: "m²" },
      { name: "Salon privé", size: 40, unit: "m²" },
      { name: "L'Orangerie", size: 280, unit: "m²" },
      { name: "L'Amphi", size: 130, unit: "m²" }
    ],
    capacityDetails: {
      meeting: 70,
      uShape: 50,
      theater: 250,
      cabaret: 170,
      classroom: 170,
      banquet: 250,
      cocktail: 300
    },
    equipment: [
      "Wifi",
      "DJ",
      "Animations",
      "Écran LCD",
      "Micro",
      "Paperboard",
      "Équipement son",
      "Blocs-notes & stylo",
      "Vidéoprojecteur"
    ],
    services: [
      "Terrain de pétanque",
      "Plage privée",
      "Espace détente",
      "Accès PMR",
      "Jardin / Parc",
      "Parking sur place",
      "Terrasse / Cour intérieure",
      "Piscine",
      "Spa",
      "Vestiaire",
      "Cuisine événementielle"
    ],
    activities: [
      "Oenologie",
      "Cours de cuisine & Gastronomie",
      "Multi-Activités & Olympiades",
      "Murder Party & Enquête",
      "Rallye & Chasse au trésor"
    ]
  }
};

async function updateVenues() {
  try {
    console.log('\n🔄 MISE À JOUR DES VENUES AVEC DONNÉES MARKDOWN\n');
    console.log('='.repeat(70));
    
    for (const [venueId, data] of Object.entries(venuesData)) {
      console.log(`\n📝 Mise à jour: ${venueId}`);
      
      const venueRef = db.collection('venues').doc(venueId);
      const venueDoc = await venueRef.get();
      
      if (!venueDoc.exists) {
        console.log(`   ❌ Venue ${venueId} n'existe pas`);
        continue;
      }
      
      // Préparer les données à mettre à jour
      const updateData = {
        updatedAt: admin.firestore.Timestamp.now()
      };
      
      // Ajouter uniquement les champs qui ont des valeurs
      if (data.rooms) updateData.rooms = data.rooms;
      if (data.accommodationRooms !== undefined) updateData.accommodationRooms = data.accommodationRooms;
      if (data.accommodationDetails) updateData.accommodationDetails = data.accommodationDetails;
      if (data.detailedSpaces) updateData.detailedSpaces = data.detailedSpaces;
      if (data.capacityDetails) updateData.capacityDetails = data.capacityDetails;
      if (data.equipment) updateData.equipment = data.equipment;
      if (data.activities) updateData.activities = data.activities;
      if (data.services) updateData.services = data.services;
      if (data.parkingSpaces) updateData.parkingSpaces = data.parkingSpaces;
      if (data.status) updateData.displayStatus = data.status; // Renommé en displayStatus
      if (data.privatizable !== undefined) updateData.privatizable = data.privatizable;
      if (data.renovationDate) updateData.renovationDate = data.renovationDate;
      if (data.totalSurfaceRooms) updateData.totalSurfaceRooms = data.totalSurfaceRooms;
      
      // Mettre à jour aussi les capacités principales si nécessaire
      if (data.capacityDetails) {
        if (data.capacityDetails.banquet && data.capacityDetails.banquet !== venueDoc.data().capacitySeated) {
          updateData.capacitySeated = data.capacityDetails.banquet;
          console.log(`   ⚠️  Correction capacitySeated: ${venueDoc.data().capacitySeated} → ${data.capacityDetails.banquet}`);
        }
        if (data.capacityDetails.cocktail && data.capacityDetails.cocktail !== venueDoc.data().capacityStanding) {
          updateData.capacityStanding = data.capacityDetails.cocktail;
          console.log(`   ⚠️  Correction capacityStanding: ${venueDoc.data().capacityStanding} → ${data.capacityDetails.cocktail}`);
        }
      }
      
      await venueRef.update(updateData);
      
      console.log(`   ✅ ${Object.keys(updateData).length - 1} champs mis à jour`);
      if (data.rooms) console.log(`      • ${data.rooms} salles`);
      if (data.accommodationRooms) console.log(`      • ${data.accommodationRooms} chambres`);
      if (data.detailedSpaces) console.log(`      • ${data.detailedSpaces.length} espaces détaillés`);
      if (data.equipment) console.log(`      • ${data.equipment.length} équipements`);
      if (data.activities) console.log(`      • ${data.activities.length} activités`);
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ Mise à jour terminée avec succès!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

updateVenues();
