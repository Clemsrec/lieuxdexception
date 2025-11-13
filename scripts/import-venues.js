/**
 * Script d'import des 4 domaines Lieux d'Exception dans Firestore
 * Utilise le service account pour l'authentification admin
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les credentials
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '../credentials/firebase-service-account.json'), 'utf8')
);

// Initialiser Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

// Firestore en mode standard (native) - pas besoin de databaseId
const db = getFirestore();

// Données des 4 domaines
const venues = [
  {
    id: 'chateau-brulaire',
    name: 'Château de la Brûlaire',
    slug: 'chateau-brulaire',
    tagline: 'Un écrin de charme dans un cadre verdoyant',
    description: 'Au cœur des coteaux verdoyants de Gesté, le Château de la Brûlaire marie le charme d\'une demeure historique à l\'élégance d\'un domaine de réception. Son parc arboré, son orangerie lumineuse et ses salons raffinés offrent un cadre idéal pour célébrer des moments d\'exception, entre authenticité et art de recevoir.',
    experienceText: 'Au Domaine de la Brûlaire, chaque événement devient un moment suspendu. Nos équipes vous accompagnent à chaque étape, du premier échange jusqu\'au grand jour, pour donner vie à vos envies dans un cadre à la fois raffiné et naturel. Entre élégance des lieux et convivialité des espaces, la Brûlaire est la promesse d\'un mariage à votre image — authentique, poétique et inoubliable.',
    location: 'Gesté, Maine-et-Loire (49)',
    address: 'Domaine de la Brûlaire, 49600 Gesté',
    region: 'pays-de-loire',
    lat: 47.1667,
    lng: -1.1833,
    capacitySeated: 350,
    capacityStanding: 450,
    capacityMin: 20,
    priceRange: 'premium',
    spaces: [
      'Salons du château',
      'Orangerie',
      'Tente silhouette',
      'Terrasse',
      'Parc à l\'anglaise',
      'Parc à la française'
    ],
    accommodation: {
      onSite: true,
      nearby: true,
      description: 'Possibilité d\'hébergement sur place et à proximité'
    },
    ceremony: {
      outdoor: true,
      indoor: true,
      description: 'Possible en extérieur, face au parc ou sous les arbres centenaires. Solution de repli intérieur en cas de mauvais temps.'
    },
    parking: {
      available: true,
      spaces: 100,
      description: 'Stationnement privatif et accès facilité pour vos prestataires'
    },
    catering: {
      inHouse: false,
      external: true,
      partnersAvailable: true,
      description: 'Prestataires libres de choix. Partenaires recommandés : traiteurs, décorateurs, photographes.'
    },
    amenities: [
      'Parc arboré',
      'Orangerie lumineuse',
      'Salons raffinés',
      'Terrasse',
      'Hébergement sur place',
      'Stationnement privatif',
      'Cérémonie laïque',
      'Repli intérieur'
    ],
    eventTypes: ['mariage', 'b2b', 'seminaire', 'reception'],
    style: ['historique', 'elegant', 'champetre'],
    images: {
      hero: '/images/venues/brulaire/hero.jpg',
      gallery: [
        '/images/venues/brulaire/orangerie.jpg',
        '/images/venues/brulaire/parc.jpg',
        '/images/venues/brulaire/salon.jpg',
        '/images/venues/brulaire/terrasse.jpg'
      ],
      thumbnail: '/images/venues/brulaire/thumbnail.jpg'
    },
    contact: {
      phone: '06 02 03 70 11',
      email: 'contact.chateaudelabrulaire@gmail.com',
      instagram: '@chateaudelabrulaire',
      mariagesNet: 'https://www.mariages.net/chateau-mariage/chateau-de-la-brulaire'
    },
    rating: 4.9,
    reviewsCount: 127,
    featured: true,
    active: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'chateau-boulaie',
    name: 'Château de la Boulaie',
    slug: 'chateau-boulaie',
    tagline: 'Moderne et raffiné au cœur du vignoble nantais',
    description: 'Niché à Haute-Goulaine, le Manoir de la Boulaie marie l\'élégance d\'une demeure de caractère à la douceur d\'un cadre naturel. Entouré de vignes et niché dans un jardin à l\'anglaise, ce lieu d\'exception accueille vos mariages et réceptions dans une atmosphère à la fois intime, conviviale et poétique. Chaque événement y devient une célébration sur mesure, portée par la beauté des lieux et le savoir-faire de nos équipes.',
    experienceText: 'À seulement quelques minutes de Nantes, le Château de la Boulaie offre une parenthèse de calme et de raffinement, où le temps semble suspendu. Entouré de vignes et de verdure, ce lieu plein d\'âme conjugue l\'élégance d\'un château de caractère à la chaleur d\'une maison de famille. Nos équipes veillent à chaque détail pour que votre journée soit à votre image : douce, sincère et inoubliable. Un cadre rare, à deux pas de la ville, pour vivre la magie d\'un mariage hors du temps.',
    location: 'Haute-Goulaine, Loire-Atlantique (44)',
    address: '33 rue de la Chapelle St Martin, 44115 Haute-Goulaine',
    region: 'pays-de-loire',
    lat: 47.1833,
    lng: -1.4333,
    capacitySeated: 250,
    capacityStanding: 320,
    capacityMin: 20,
    priceRange: 'premium',
    spaces: [
      'Salons du Château',
      'Salle de bal du Château',
      'Terrasse sur le parc à l\'anglaise',
      'Cour intérieure',
      'Étang',
      'Parc'
    ],
    accommodation: {
      onSite: true,
      nearby: true,
      description: 'Possibilité d\'hébergement sur place et à proximité'
    },
    ceremony: {
      outdoor: true,
      indoor: true,
      description: 'En extérieur face au Château, sous les arbres, ou dans le patio intérieur en cas de mauvais temps.'
    },
    parking: {
      available: true,
      spaces: 80,
      description: 'Stationnement privatif et accès facilité pour vos prestataires'
    },
    catering: {
      inHouse: false,
      external: true,
      partnersAvailable: true,
      description: 'Prestataires libres de choix. Partenaires recommandés : traiteurs, décorateurs, photographes.'
    },
    amenities: [
      'Vignoble',
      'Jardin à l\'anglaise',
      'Salle de bal',
      'Étang',
      'Hébergement sur place',
      'Stationnement privatif',
      'Cérémonie laïque',
      'Patio intérieur'
    ],
    eventTypes: ['mariage', 'b2b', 'seminaire', 'reception'],
    style: ['vignoble', 'rafine', 'romantique'],
    images: {
      hero: '/images/venues/boulaie/hero.jpg',
      gallery: [
        '/images/venues/boulaie/salle-bal.jpg',
        '/images/venues/boulaie/jardin.jpg',
        '/images/venues/boulaie/facade.jpg',
        '/images/venues/boulaie/etang.jpg'
      ],
      thumbnail: '/images/venues/boulaie/thumbnail.jpg'
    },
    contact: {
      phone: '06 02 03 70 11',
      email: 'contact@manoirdelaboulaie.com',
      mariagesNet: 'https://www.mariages.net/chateau-mariage/chateau-de-la-boulaie'
    },
    rating: 4.8,
    reviewsCount: 98,
    featured: true,
    active: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'domaine-nantais',
    name: 'Domaine Nantais',
    slug: 'domaine-nantais',
    tagline: 'Un cadre champêtre et bohème aux portes de Nantes',
    description: 'À seulement quelques minutes de Nantes, le Domaine Nantais invite à célébrer l\'amour au cœur de la nature. Entouré de prairies et de chênes centenaires, ce lieu lumineux respire la liberté et la douceur de vivre. Mariages champêtres, cérémonies laïques, réceptions élégantes ou brunchs en plein air… chaque événement s\'y déroule dans une atmosphère à la fois bohème, chic et conviviale.',
    experienceText: 'Le Domaine Nantais est une invitation à célébrer l\'amour dans un cadre sincère et authentique. Nos équipes vous accompagnent avec bienveillance et créativité pour imaginer un mariage à votre image — naturel, chic et plein d\'émotion. Entre lumière douce, murs en pierres et ambiance bohème, ce lieu respire la convivialité et l\'élégance simple des plus beaux jours.',
    location: 'Le Bignon, Loire-Atlantique (44)',
    address: '6 La Sensive, 44140 Le Bignon',
    region: 'pays-de-loire',
    lat: 47.0833,
    lng: -1.4833,
    capacitySeated: 160,
    capacityStanding: 200,
    capacityMin: 20,
    priceRange: 'medium',
    spaces: [
      'Grande salle de réception ouverte sur le parc',
      'Espace bar',
      'Terrasse couverte',
      'Parc clos et sécurisé'
    ],
    accommodation: {
      onSite: true,
      nearby: true,
      description: 'Possibilité d\'hébergement sur place et à proximité'
    },
    ceremony: {
      outdoor: true,
      indoor: true,
      description: 'Entre les arbres centenaires du parc ou sous la terrasse couverte.'
    },
    parking: {
      available: true,
      spaces: 60,
      description: 'Stationnement privatif et accès facilité pour vos prestataires'
    },
    catering: {
      inHouse: false,
      external: true,
      partnersAvailable: true,
      description: 'Prestataires libres de choix. Partenaires recommandés : traiteurs, décorateurs, photographes.'
    },
    amenities: [
      'Chênes centenaires',
      'Terrasse couverte',
      'Parc clos',
      'Murs en pierres',
      'Hébergement sur place',
      'Stationnement privatif',
      'Cérémonie laïque',
      'Ambiance bohème'
    ],
    eventTypes: ['mariage', 'reception', 'brunch'],
    style: ['champetre', 'boheme', 'nature'],
    images: {
      hero: '/images/venues/nantais/hero.jpg',
      gallery: [
        '/images/venues/nantais/salle.jpg',
        '/images/venues/nantais/parc.jpg',
        '/images/venues/nantais/terrasse.jpg',
        '/images/venues/nantais/arbres.jpg'
      ],
      thumbnail: '/images/venues/nantais/thumbnail.jpg'
    },
    contact: {
      phone: '06 02 03 70 11',
      email: 'domainenantais@gmail.com',
      instagram: '@domaine_nantais',
      mariagesNet: 'https://www.mariages.net/domaine-mariage/domaine-nantais'
    },
    rating: 4.7,
    reviewsCount: 84,
    featured: true,
    active: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'le-dome',
    name: 'Le Dôme',
    slug: 'le-dome',
    tagline: 'Une grande salle de réception élégante et lumineuse',
    description: 'Situé à Port-Saint-Père, à quelques minutes de Nantes, Le Dôme séduit par ses volumes majestueux et son atmosphère baignée de lumière. Conçu pour accueillir des mariages et des événements d\'exception, il offre un espace contemporain et modulable, où chaque détail allie confort et élégance. Sa grande cuisine professionnelle, ses installations modernes et son vaste espace de réception en font un lieu aussi pratique que prestigieux.',
    experienceText: 'Au Dôme, l\'espace devient liberté. Ses volumes généreux et sa lumière naturelle offrent un décor spectaculaire pour célébrer vos plus beaux moments. Mariages festifs, grandes réceptions ou événements élégants : nos équipes vous accompagnent avec passion pour créer une journée fluide, conviviale et mémorable, dans un cadre à la fois moderne et accueillant.',
    location: 'Port-Saint-Père, Loire-Atlantique (44)',
    address: '6 La Chevalerie, 44710 Port-Saint-Père',
    region: 'pays-de-loire',
    lat: 47.1333,
    lng: -1.75,
    capacitySeated: 250,
    capacityStanding: 350,
    capacityMin: 50,
    priceRange: 'medium',
    spaces: [
      'Grande salle de réception',
      'Espaces modulables avec séparation rideau',
      'Terrasse ouverte',
      'Grande cuisine professionnelle'
    ],
    accommodation: {
      onSite: false,
      nearby: true,
      description: 'Pas de logement sur place. Possibilité d\'hébergement à proximité.'
    },
    ceremony: {
      outdoor: true,
      indoor: true,
      description: 'Sur la terrasse ou en intérieur.'
    },
    parking: {
      available: true,
      spaces: 100,
      description: 'Stationnement disponible et accès facilité pour vos prestataires'
    },
    catering: {
      inHouse: true,
      external: true,
      partnersAvailable: true,
      description: 'Grande cuisine professionnelle. Prestataires libres de choix. Partenaires recommandés.'
    },
    amenities: [
      'Volumes majestueux',
      'Lumière naturelle',
      'Cuisine professionnelle',
      'Espaces modulables',
      'Terrasse',
      'Stationnement',
      'Cérémonie laïque',
      'Design contemporain'
    ],
    eventTypes: ['mariage', 'b2b', 'seminaire', 'reception', 'gala'],
    style: ['contemporain', 'lumineux', 'moderne'],
    images: {
      hero: '/images/venues/dome/hero.jpg',
      gallery: [
        '/images/venues/dome/salle.jpg',
        '/images/venues/dome/cuisine.jpg',
        '/images/venues/dome/terrasse.jpg',
        '/images/venues/dome/interieur.jpg'
      ],
      thumbnail: '/images/venues/dome/thumbnail.jpg'
    },
    contact: {
      phone: '06 02 03 70 11',
      email: 'domenantais@gmail.com',
      instagram: '@le_dome_nantais',
      mariagesNet: 'https://www.mariages.net/salle-mariage/dome-nantais'
    },
    rating: 4.6,
    reviewsCount: 72,
    featured: true,
    active: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

// Fonction d'import
async function importVenues() {
  console.log('🚀 Début de l\'import des domaines dans Firestore...\n');

  const venuesCollection = db.collection('venues');

  for (const venue of venues) {
    try {
      await venuesCollection.doc(venue.id).set(venue);
      console.log(`✅ ${venue.name} importé avec succès`);
    } catch (error) {
      console.error(`❌ Erreur lors de l'import de ${venue.name}:`, error);
    }
  }

  console.log('\n🎉 Import terminé !');
  console.log(`\n📊 ${venues.length} domaines importés dans la collection "venues"`);
  
  process.exit(0);
}

// Lancer l'import
importVenues().catch(console.error);
