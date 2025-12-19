/**
 * Script pour initialiser les événements de la timeline dans Firestore
 * 
 * Usage: node scripts/init-timeline-events.js
 */

const admin = require('firebase-admin');

// Initialiser Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

/**
 * Événements de la timeline
 */
const timelineEvents = [
  {
    year: '2020',
    month: 'Mai',
    date: '2020-05',
    title: 'LE DOMAINE NANTAIS',
    subtitle: 'Ouverture au public',
    description: 'Première pierre de l\'aventure Lieux d\'Exception. Le Domaine Nantais accueille ses premiers événements et pose les fondations de notre signature : des lieux de caractère au service d\'expériences mémorables.',
    image: '/venues/domaine-nantais/hero.webp',
    imagePosition: 'bottom',
    isMajor: true,
    venue: 'domaine-nantais',
    venueName: 'Domaine Nantais',
    event: 'Ouverture au public',
    category: 'opening',
    visible: true,
    order: 0,
  },
  {
    year: '2021',
    month: '',
    date: '2021-01',
    title: 'LE DÔME',
    subtitle: 'Acquisition du lieu',
    description: 'Un projet singulier rejoint Lieux d\'Exception. Le Dôme est acquis avec une ambition forte : créer un espace événementiel atypique, immersif et résolument différenciant. Début des événements prévu en 2025.',
    image: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/venues%2Fle-dome%2Fmariages%2Fdome_interieur_1.jpg?alt=media',
    imagePosition: 'top',
    isMajor: false,
    venue: 'le-dome',
    venueName: 'Le Dôme',
    event: 'Acquisition du lieu',
    category: 'acquisition',
    visible: true,
    order: 1,
  },
  {
    year: '2023',
    month: '',
    date: '2023-01',
    title: 'LE MANOIR DE LA BOULAIE',
    subtitle: 'Acquisition & réhabilitation',
    description: 'Acquisition d\'un manoir de caractère nécessitant une rénovation complète. Deux années de travaux sont engagées pour redonner vie au lieu et le transformer en domaine événementiel d\'exception. Ouverture aux événements en 2025.',
    image: '/venues/manoir-boulaie/hero.webp',
    imagePosition: 'bottom',
    isMajor: false,
    venue: 'manoir-boulaie',
    venueName: 'Manoir de la Boulaie',
    event: 'Acquisition & réhabilitation',
    category: 'acquisition',
    visible: true,
    order: 2,
  },
  {
    year: '2025',
    month: 'Sept',
    date: '2025-09',
    title: 'LE MANOIR DE LA BOULAIE',
    subtitle: 'Lancement des travaux d\'extension',
    description: 'Début des travaux d\'extension du manoir afin d\'enrichir l\'expérience proposée et d\'élargir les capacités d\'accueil. Fin des travaux prévue en avril 2026.',
    image: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/venues%2Fmanoir-boulaie%2Fmariages%2Fboulaie_interieur_5.jpg?alt=media',
    imagePosition: 'top',
    isMajor: false,
    venue: 'manoir-boulaie',
    venueName: 'Manoir de la Boulaie',
    event: 'Lancement des travaux d\'extension',
    category: 'renovation',
    visible: true,
    order: 3,
  },
  {
    year: '2025',
    month: 'Sept',
    date: '2025-09',
    title: 'LE CHÂTEAU DE LA BRÛLAIRE',
    subtitle: 'Acquisition',
    description: 'Un nouveau château rejoint la collection Lieux d\'Exception. Un lieu emblématique, sélectionné pour son cachet, son potentiel et son adéquation avec notre vision.',
    image: '/venues/chateau-brulaire/hero.webp',
    imagePosition: 'bottom',
    isMajor: true,
    venue: 'chateau-brulaire',
    venueName: 'Château de la Brûlaire',
    event: 'Acquisition',
    category: 'acquisition',
    visible: true,
    order: 4,
  },
  {
    year: '2025',
    month: 'Déc',
    date: '2025-12',
    title: 'LE CHÂTEAU DE LA CORBE',
    subtitle: 'Acquisition',
    description: 'Dernière acquisition en date, le Château de la Corbe vient renforcer notre portefeuille de lieux exclusifs, dédiés aux mariages et aux événements professionnels haut de gamme.',
    image: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/venues%2Fchateau-corbe%2Fhero.jpg?alt=media',
    imagePosition: 'top',
    isMajor: true,
    venue: 'chateau-corbe',
    venueName: 'Château de la Corbe',
    event: 'Acquisition',
    category: 'acquisition',
    visible: true,
    order: 5,
  },
];

async function initTimelineEvents() {
  try {
    console.log('🚀 Initialisation des événements de la timeline...\n');

    // Supprimer les anciens événements de timeline
    console.log('🗑️  Suppression des anciennes entrées...');
    const oldEventsSnapshot = await db.collection('timeline').get();
    const deletePromises = oldEventsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`✅ ${oldEventsSnapshot.size} anciennes entrées supprimées\n`);

    // Créer les nouveaux événements
    console.log('📝 Création des nouveaux événements...\n');
    
    for (const event of timelineEvents) {
      const eventData = {
        ...event,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      };
      
      await db.collection('timeline').add(eventData);
      console.log(`✅ ${event.year} ${event.month || ''} - ${event.venueName} - ${event.event}`);
    }

    console.log('\n🎉 Tous les événements de la timeline ont été initialisés avec succès !');
    console.log(`\n📊 Total: ${timelineEvents.length} événements créés`);
    console.log('\n📌 Vous pouvez maintenant les gérer depuis le dashboard admin');
    console.log('   👉 http://localhost:3002/admin/contenus\n');

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

// Exécuter
initTimelineEvents()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
