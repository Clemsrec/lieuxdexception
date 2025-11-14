#!/usr/bin/env node

/**
 * Script d'import des 3 lieux d'exception avec leurs contenus marketing officiels
 * 
 * Lieux importés :
 * 1. Domaine Nantais
 * 2. Le Dôme - Port-Saint-Père
 * 3. Manoir de la Boulaie
 * 
 * Usage: node scripts/import-lieux-textes.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialiser Firebase Admin
const serviceAccount = require(path.join(__dirname, '..', 'firebase-service-account.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://lieuxdexception.firebaseio.com'
});

const db = admin.firestore();

/**
 * Données des 3 lieux avec contenus marketing officiels
 */
const venues = [
  {
    // DOMAINE NANTAIS
    id: 'domaine-nantais',
    slug: 'domaine-nantais',
    name: 'Domaine Nantais',
    tagline: 'À 10 minutes de Nantes, dans un parc paysagé d\'1 hectare',
    description: 'Au cœur d\'un parc paysagé d\'1 hectare, le Domaine Nantais vous accueille dans une salle de caractère en pierre naturelle, entièrement rénovée en 2025. Modulable et élégante, elle peut recevoir jusqu\'à 220 personnes pour vos séminaires, réunions, cocktails ou soirées d\'entreprise.',
    
    // Textes longs (version site web)
    longDescription: `Le Domaine Nantais vous ouvre ses portes dans un cadre verdoyant de 1 hectare, entièrement clos et paysagé, idéal pour allier travail, cohésion et convivialité. À seulement 10 minutes du périphérique nantais, notre site vous permet d'organiser vos séminaires, réunions, ateliers ou événements corporate dans un environnement calme, modulable et inspirant.`,
    
    highlights: [
      'Salle en pierre naturelle rénovée en 2025',
      'Parc paysagé d\'1 hectare entièrement clos',
      'Terrasse et patio couvert de 80 m²',
      'Salle de réunion cosy pour 30 personnes',
      'Cuisine professionnelle et bar de service',
      'Éclairage personnalisé aux couleurs de votre entreprise',
      'Terrain de jeu idéal pour team-building et olympiades'
    ],
    
    features: {
      espaces: [
        'Grande salle en pierre naturelle - jusqu\'à 220 personnes',
        'Salle de réunion cosy - 30 personnes',
        'Terrasse & patio couvert - 80 m²',
        'Parc arboré - 1 hectare'
      ],
      equipements: [
        'Mobilier récent : tables rondes, rectangulaires, mange-debout, chaises',
        'Cuisine professionnelle & bar de service',
        'Barnum de 25 m²',
        'Éclairage personnalisable du parc et de la salle',
        'Connexions et confort thermique optimal'
      ],
      services: [
        'Liberté totale sur vos prestataires',
        'Offre clé en main disponible',
        'Équipe expérimentée à votre écoute',
        'Parking privatif',
        'Accessibilité optimale (3 min grand axe routier)'
      ]
    },
    
    eventTypes: ['b2b', 'seminaires', 'cocktails', 'team-building', 'mariages'],
    
    capacity: {
      min: 30,
      max: 220,
      seated: 180,
      cocktail: 220
    },
    
    address: {
      street: 'Adresse à compléter',
      city: 'Nantes',
      region: 'Loire-Atlantique',
      zipCode: '44000',
      country: 'France'
    },
    
    location: 'À 10 min de Nantes',
    
    contact: {
      phone: '06 02 03 70 11',
      email: 'contact@lieuxdexception.com'
    },
    
    images: {
      hero: '/images/domaine-nantais-hero.jpg',
      gallery: [
        '/images/domaine-nantais-1.jpg',
        '/images/domaine-nantais-2.jpg',
        '/images/domaine-nantais-3.jpg'
      ]
    },
    
    pricing: {
      startingPrice: 'Sur devis',
      currency: 'EUR'
    },
    
    featured: true,
    active: true,
    rating: 4.9,
    reviewCount: 47,
    
    seo: {
      metaTitle: 'Domaine Nantais - Séminaires & Événements B2B à 10 min de Nantes',
      metaDescription: 'Organisez vos séminaires, réunions et événements d\'entreprise au Domaine Nantais. Parc paysagé 1 ha, salle en pierre 220 pers, à 10 min de Nantes.',
      keywords: ['domaine nantais', 'séminaire nantes', 'événement b2b', 'salle réception nantes', 'team building']
    },
    
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  
  {
    // LE DÔME
    id: 'le-dome',
    slug: 'le-dome',
    name: 'Le Dôme',
    tagline: 'Un espace spectaculaire où tout devient possible',
    description: 'À 20 minutes de Nantes, Le Dôme vous accueille dans un espace événementiel unique, modulable à l\'infini. Que vous imaginiez un séminaire immersif, une soirée de gala, un lancement de produit grandiose ou une expérience hors du commun, ici, vos idées prennent forme… en grand.',
    
    longDescription: `Le Dôme est votre toile blanche. Son potentiel scénographique et sa liberté d'exploitation vous permettent d'exprimer votre créativité sans contrainte. Avec ses hauteurs exceptionnelles, ses grands volumes ouverts et son architecture atypique, Le Dôme permet des mises en scène audacieuses et des formats XXL.`,
    
    highlights: [
      'Hauteurs exceptionnelles et grands volumes ouverts',
      'Architecture atypique spectaculaire',
      'Modulable à l\'infini pour tous vos concepts',
      'Accès véhicules / structures scéniques',
      'Équipements techniques sur-mesure',
      'Capacité d\'accueil adaptée aux grands groupes',
      'Indoor & outdoor possibles'
    ],
    
    features: {
      espaces: [
        'Volume impressionnant avec hauteurs exceptionnelles',
        'Espaces personnalisables à 100%',
        'Configuration XXL pour grands groupes',
        'Zones indoor & outdoor modulables'
      ],
      equipements: [
        'Accès véhicules et structures scéniques',
        'Installations techniques professionnelles',
        'Équipements sur demande ou sur-mesure',
        'Sonorisation et éclairage haute performance'
      ],
      services: [
        'Équipe dédiée à la production et logistique',
        'Liberté totale de traiteur ou service clé en main',
        'Accompagnement créatif et technique',
        'Parking sur site',
        'Accès facile depuis Nantes (20 min)'
      ]
    },
    
    eventTypes: ['b2b', 'gala', 'lancement-produit', 'salon', 'spectacle', 'exposition'],
    
    capacity: {
      min: 100,
      max: 1000,
      seated: 500,
      cocktail: 1000
    },
    
    address: {
      street: 'Adresse à compléter',
      city: 'Port-Saint-Père',
      region: 'Loire-Atlantique',
      zipCode: '44710',
      country: 'France'
    },
    
    location: 'Port-Saint-Père, à 20 min de Nantes',
    
    contact: {
      phone: '06 02 03 70 11',
      email: 'contact@lieuxdexception.com'
    },
    
    images: {
      hero: '/images/le-dome-hero.jpg',
      gallery: [
        '/images/le-dome-1.jpg',
        '/images/le-dome-2.jpg',
        '/images/le-dome-3.jpg'
      ]
    },
    
    pricing: {
      startingPrice: 'Sur devis',
      currency: 'EUR'
    },
    
    featured: true,
    active: true,
    rating: 4.8,
    reviewCount: 32,
    
    specialties: [
      'Événements XXL et formats audacieux',
      'Soirées thématiques et shows',
      'Séminaires immersifs',
      'Défilés, expositions, roadshows',
      'Team-building atypiques',
      'Événements hybrides ou digitaux'
    ],
    
    targetAudience: [
      'Agences événementielles',
      'Entreprises (grands groupes)',
      'Collectivités',
      'Marques',
      'Producteurs de spectacles'
    ],
    
    seo: {
      metaTitle: 'Le Dôme Port-Saint-Père - Espace Événementiel XXL près de Nantes',
      metaDescription: 'Événements d\'exception au Dôme : volumes spectaculaires, liberté totale, formats XXL. Idéal pour galas, lancements, spectacles. À 20 min de Nantes.',
      keywords: ['le dome', 'événement xxl', 'salle spectacle nantes', 'lancement produit', 'gala entreprise']
    },
    
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  
  {
    // MANOIR DE LA BOULAIE
    id: 'manoir-boulaie',
    slug: 'manoir-boulaie',
    name: 'Manoir de la Boulaie',
    tagline: 'Charme historique et confort moderne, à 10 min de Nantes',
    description: 'Dans un écrin de verdure de plus d\'1 ha, ce lieu d\'exception allie charme historique et confort moderne sur 600 m² de salons rénovés. Idéal pour vos événements professionnels (séminaires, réunions, cocktails, lancements…), le Manoir vous offre un cadre élégant et une équipe dédiée pour une organisation sur-mesure.',
    
    longDescription: `Dans un cadre de caractère, le Manoir propose des espaces modulables alliant confort, technologie et image de marque. Installez votre séminaire dans un écrin de nature de 1,5 ha au bord d'un lac. Respirez, marchez, échangez… entre deux sessions, vos collaborateurs se ressourcent pleinement.`,
    
    highlights: [
      '600 m² de salons rénovés',
      'Écrin de verdure de 1,5 ha',
      'Accès direct à une plage privée au bord du lac',
      'Parking privé de 150 places',
      'Entièrement accessible PMR',
      'Approche éco-responsable (gestion raisonnée, tri, partenaires locaux)',
      'Espace détente avec billard et babyfoot'
    ],
    
    features: {
      espaces: [
        '4 salons lumineux en enfilade - jusqu\'à 250 pers.',
        '1 salle de réception de 280 m² avec patio',
        '1 salon de 300 m² avec vue lac et plage privée',
        '4 salles de sous-commission pour confidentialité',
        'Espace détente avec billard et babyfoot'
      ],
      equipements: [
        'Équipements high-tech dans toutes les salles',
        'Mobilier moderne et modulable',
        'Sonorisation et vidéoprojection',
        'Connexion WiFi haut débit',
        'Cuisine professionnelle'
      ],
      services: [
        'Équipe experte de A à Z',
        'Proposition sur mesure alignée sur vos objectifs',
        'Suivi rigoureux et coordination fluide',
        'Transport privé sur demande',
        'Parking privé 150 places',
        'Accessibilité PMR complète'
      ]
    },
    
    eventTypes: ['b2b', 'seminaires', 'conferences', 'formations', 'team-building', 'cocktails', 'mariages'],
    
    capacity: {
      min: 30,
      max: 250,
      seated: 200,
      cocktail: 250
    },
    
    address: {
      street: 'Adresse à compléter',
      city: 'Nantes',
      region: 'Loire-Atlantique',
      zipCode: '44000',
      country: 'France'
    },
    
    location: 'À 10 min de Nantes, au bord du lac',
    
    contact: {
      phone: '06 02 03 70 11',
      email: 'contact@lieuxdexception.com'
    },
    
    images: {
      hero: '/images/manoir-boulaie-hero.jpg',
      gallery: [
        '/images/manoir-boulaie-1.jpg',
        '/images/manoir-boulaie-2.jpg',
        '/images/manoir-boulaie-3.jpg'
      ]
    },
    
    pricing: {
      startingPrice: 'Sur devis',
      currency: 'EUR'
    },
    
    featured: true,
    active: true,
    rating: 4.9,
    reviewCount: 89,
    
    certifications: [
      'Accessibilité PMR',
      'Approche éco-responsable',
      'Partenaires locaux'
    ],
    
    uniqueSellingPoints: [
      'Cadre naturel inspirant au bord du lac',
      'Accès plage privée pour activités outdoor',
      'Espaces modulables entre élégance et fonctionnalité',
      'Équipe experte avec 20 ans d\'expérience',
      'Gestion éco-responsable et durable'
    ],
    
    seo: {
      metaTitle: 'Manoir de la Boulaie - Séminaires & Événements au Bord du Lac près de Nantes',
      metaDescription: 'Organisez vos séminaires et événements d\'entreprise au Manoir de la Boulaie. 600m² de salons, plage privée, parc 1,5 ha. À 10 min de Nantes.',
      keywords: ['manoir boulaie', 'séminaire lac nantes', 'événement nature', 'manoir réception', 'team building lac']
    },
    
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

/**
 * Import des lieux dans Firestore
 */
async function importVenues() {
  console.log('🚀 Début de l\'import des 3 lieux d\'exception...\n');
  
  try {
    const batch = db.batch();
    
    for (const venue of venues) {
      const venueRef = db.collection('venues').doc(venue.id);
      batch.set(venueRef, venue);
      console.log(`✅ ${venue.name} préparé pour l'import`);
    }
    
    await batch.commit();
    console.log('\n🎉 Tous les lieux ont été importés avec succès !');
    console.log('\n📋 Résumé :');
    console.log(`   - Domaine Nantais (220 pers) - Séminaires & B2B`);
    console.log(`   - Le Dôme (1000 pers) - Événements XXL`);
    console.log(`   - Manoir de la Boulaie (250 pers) - Séminaires & Mariages au bord du lac`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import :', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Exécution
importVenues();
