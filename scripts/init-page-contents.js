/**
 * Script d'initialisation des contenus de pages par défaut
 * 
 * Ce script crée les contenus initiaux pour toutes les pages publiques
 * en français (fr) à partir des contenus actuels hardcodés.
 * 
 * Usage: node scripts/init-page-contents.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialiser Firebase Admin SDK
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

/**
 * Contenu par défaut pour la Homepage
 */
const homepageContent = {
  id: 'homepage',
  pageName: 'Page d\'Accueil',
  locale: 'fr',
  hero: {
    title: 'Lieux d\'Exception',
    subtitle: 'Des domaines de caractère pour vos événements d\'exception',
    description: 'Châteaux et domaines prestigieux en Pays de la Loire pour vos mariages et événements professionnels',
    backgroundImage: '',
    ctaText: 'Contactez-nous',
    ctaLink: '/contact',
  },
  sections: [
    {
      id: 'histoire',
      title: 'Une aventure née de lieux & de passion',
      content: `<p>Tout commence par un lieu.</p>
<p>Un domaine découvert, une émotion, l'envie de partager sa beauté.</p>
<p>Puis un second, un troisième… à chaque fois la même flamme, la même passion pour créer des souvenirs précieux.</p>
<p>Peu à peu, ces lieux se sont reliés, unis par une même philosophie : révéler leur âme, unir les talents, sublimer chaque instant.</p>
<p class="text-xl font-medium">Ainsi est née Lieux d'Exception — une signature plus qu'un nom, un fil conducteur entre des domaines d'âme et des équipes passionnées, où chaque événement devient une histoire.</p>`,
      order: 0,
      visible: true,
    },
  ],
  blocks: [],
  featureCards: [
    {
      id: 'card_01',
      number: '01',
      title: 'Un accompagnement sur mesure',
      content: 'Chaque projet débute par une immersion complète dans votre univers : comprendre votre histoire, vos envies et vos contraintes afin de concevoir un événement fidèle à votre image, sans compromis.',
      order: 0,
      visible: true,
    },
    {
      id: 'card_02',
      number: '02',
      title: 'Une orchestration fluide',
      content: 'De la sélection du lieu à la mise en scène finale, nous pilotons l\'ensemble de l\'organisation avec rigueur et précision. Bénéficiez d\'un interlocuteur unique qui coordonne chaque étape pour un déroulé parfaitement maîtrisé.',
      order: 1,
      visible: true,
    },
    {
      id: 'card_03',
      number: '03',
      title: 'Un réseau de partenaires',
      content: 'Nous collaborons exclusivement avec des professionnels reconnus pour leur exigence, leur sens du détail et la qualité irréprochable de leurs prestations.',
      order: 2,
      visible: true,
    },
    {
      id: 'card_04',
      number: '04',
      title: 'Des lieux d\'exception, en exclusivité',
      content: 'Nos lieux vous sont proposés en exclusivité, pour garantir intimité, sérénité et une expérience unique, loin des lieux standardisés.',
      order: 3,
      visible: true,
    },
  ],
  contactInfo: [],
  finalCta: {
    title: 'Parce que l\'émotion se vit pleinement lorsqu\'elle trouve son Lieu d\'Exception',
    subtitle: 'Des domaines où se mêlent beauté, sincérité et art de recevoir',
    content: '',
    ctaText: 'Contact & Devis',
    ctaLink: '/contact',
    backgroundImage: '/venues/domaine-nantais/mariages/domaine_cocktail_5.jpg',
  },
  updatedAt: new Date(),
  updatedBy: 'system',
  version: 1,
};

/**
 * Contenu par défaut pour la page Contact
 */
const contactContent = {
  id: 'contact',
  pageName: 'Contact',
  locale: 'fr',
  hero: {
    title: 'Contactez-Nous',
    subtitle: 'Notre équipe est à votre écoute pour concrétiser votre projet',
    description: '',
    backgroundImage: '/images/contact-hero.jpg',
    ctaText: '',
    ctaLink: '',
  },
  sections: [],
  blocks: [],
  featureCards: [],
  contactInfo: [
    {
      type: 'b2b',
      phone: '06 70 56 28 79',
      email: 'contact@lieuxdexception.com',
      description: 'Événements Professionnels',
    },
    {
      type: 'wedding',
      phone: '06 02 03 70 11',
      email: 'contact@lieuxdexception.com',
      description: 'Mariages & Événements Privés',
    },
  ],
  finalCta: null,
  updatedAt: new Date(),
  updatedBy: 'system',
  version: 1,
};

/**
 * Contenu par défaut pour la page Mariages
 */
const mariagesContent = {
  id: 'mariages',
  pageName: 'Mariages',
  locale: 'fr',
  hero: {
    title: 'Mariages d\'Exception',
    subtitle: 'Célébrez votre union dans un cadre d\'exception',
    description: 'Des lieux prestigieux en Loire-Atlantique pour un mariage inoubliable',
    backgroundImage: '/venues/chateau-brulaire/mariages/mise-en-scene.jpg',
    ctaText: 'Demander des informations',
    ctaLink: '/contact',
  },
  sections: [
    {
      id: 'intro',
      title: 'Lieux d\'Exception, la signature de votre mariage',
      content: `<p>Chaque histoire est unique.</p>
<p>Votre mariage mérite un lieu et un accompagnement à la hauteur de ce moment rare.</p>
<p>Chez Lieux d'Exception, nous réunissons des domaines de caractère et un savoir-faire éprouvé pour créer des mariages élégants, sincères et profondément mémorables.</p>`,
      order: 0,
      visible: true,
    },
  ],
  blocks: [],
  featureCards: [
    {
      id: 'mariage_01',
      number: '01',
      title: 'Une rencontre qui donne le ton',
      content: 'Dès notre première rencontre, nous prenons le temps de vous écouter.<br/>Vos envies, vos priorités, vos contraintes : tout est intégré pour construire un mariage fidèle à votre histoire, sans pression ni format imposé.',
      order: 0,
      visible: true,
    },
    {
      id: 'mariage_02',
      number: '02',
      title: 'Une organisation fluide, du début à la fin',
      content: 'Du choix du lieu à la mise en scène du jour J, nous orchestrons chaque étape avec précision.<br/>Vous profitez pleinement des préparatifs, l\'esprit libre, en toute confiance.',
      order: 1,
      visible: true,
    },
    {
      id: 'mariage_03',
      number: '03',
      title: 'Des partenaires fiables, pour une confiance totale',
      content: 'Chaque prestataire est sélectionné pour son professionnalisme, sa fiabilité et son sens du service.<br/>Traiteurs, décorateurs, fleuristes, photographes… vous êtes entourés de professionnels sur lesquels vous pouvez compter, sans mauvaise surprise.',
      order: 2,
      visible: true,
    },
    {
      id: 'mariage_04',
      number: '04',
      title: 'Des lieux exclusifs, pour une tranquillité absolue',
      content: 'Châteaux et domaines de caractère, entièrement privatisés pour votre mariage.<br/>Vous profitez de votre journée en toute intimité, dans un cadre élégant et apaisant, sans contraintes extérieures.',
      order: 3,
      visible: true,
    },
  ],
  contactInfo: [],
  finalCta: {
    title: 'Parce que l\'émotion se vit pleinement lorsqu\'elle trouve son Lieu d\'Exception',
    subtitle: 'Des domaines où se mêlent beauté, sincérité et art de recevoir',
    content: 'Téléphone Mariages : 06 02 03 70 11<br/>Email : contact@lieuxdexception.com',
    ctaText: 'Contact & Devis',
    ctaLink: '/contact',
    backgroundImage: '/venues/chateau-corbe/mariages/corbe_orangerie_3.jpg',
  },
  updatedAt: new Date(),
  updatedBy: 'system',
  version: 1,
};

/**
 * Contenu par défaut pour la page Événements B2B
 */
const b2bContent = {
  id: 'b2b',
  pageName: 'Événements B2B',
  locale: 'fr',
  hero: {
    title: 'Événements Professionnels',
    subtitle: 'Des lieux d\'exception pour vos événements d\'entreprise',
    description: 'Séminaires, conférences et événements corporate dans des domaines prestigieux',
    backgroundImage: '/venues/chateau-corbe/b2b/corbe_seminaire_1.jpg',
    ctaText: 'Demander un devis',
    ctaLink: '/contact',
  },
  sections: [
    {
      id: 'intro',
      title: 'Une expérience qui engage vos équipes et vos clients',
      content: `<p>Aujourd'hui, un événement professionnel ne doit plus seulement rassembler.</p>
<p>Il doit inspirer, aligner et produire de l'impact.</p>
<p>Chez Lieux d'Exception, nous concevons des expériences événementielles exclusives, portées par des lieux rares et un savoir-faire éprouvé, au service de vos enjeux stratégiques.</p>`,
      order: 0,
      visible: true,
    },
  ],
  blocks: [
    {
      id: 'b2b_block_01',
      title: 'Marquer durablement les esprits',
      subtitle: '',
      content: 'Des lieux à forte identité, pensés pour créer un effet immédiat. <strong>Votre événement devient un moment de référence, qui valorise votre image et renforce l\'adhésion de vos équipes et de vos clients.</strong>',
      image: '',
      imageAlt: '',
      ctaText: '',
      ctaLink: '',
      order: 0,
      visible: true,
    },
    {
      id: 'b2b_block_02',
      title: 'Des environnements qui déclenchent la performance',
      subtitle: '',
      content: '<strong>Cohésion, créativité, prise de recul, décisions stratégiques.</strong> Nos domaines offrent des cadres propices à l\'échange et à la réflexion, loin des formats standardisés et impersonnels.',
      image: '',
      imageAlt: '',
      ctaText: '',
      ctaLink: '',
      order: 1,
      visible: true,
    },
    {
      id: 'b2b_block_03',
      title: 'Une liberté totale de création',
      subtitle: '',
      content: 'Chaque lieu est privatisable, modulable et ouvert aux formats les plus exigeants. <strong>Séminaire confidentiel, expérience immersive ou événement d\'envergure : nous adaptons l\'espace à votre ambition, jamais l\'inverse.</strong>',
      image: '',
      imageAlt: '',
      ctaText: '',
      ctaLink: '',
      order: 2,
      visible: true,
    },
    {
      id: 'b2b_block_04',
      title: 'Un savoir-faire qui sécurise votre projet',
      subtitle: '',
      content: '<strong>Plus de 20 ans d\'expertise événementielle, un coordinateur dédié et un réseau de partenaires premium.</strong> Vous bénéficiez d\'un pilotage précis, fluide et maîtrisé, du premier échange au jour J.',
      image: '',
      imageAlt: '',
      ctaText: '',
      ctaLink: '',
      order: 3,
      visible: true,
    },
  ],
  featureCards: [],
  contactInfo: [],
  finalCta: {
    title: 'Êtes-vous prêt à vivre cette expérience ?',
    subtitle: 'Vous avez un objectif. Nous avons les lieux, l\'expertise et la méthode pour le transformer en expérience marquante.',
    content: 'Téléphone Pro/B2B : 06 70 56 28 79<br/>Email : contact@lieuxdexception.com',
    ctaText: 'Contact & Devis',
    ctaLink: '/contact',
    backgroundImage: '/venues/manoir-boulaie/b2b/boulaie_seminaire_6.jpg',
  },
  updatedAt: new Date(),
  updatedBy: 'system',
  version: 1,
};

/**
 * Contenu par défaut pour la page Histoire
 */
const histoireContent = {
  id: 'histoire',
  pageName: 'Histoire',
  locale: 'fr',
  hero: {
    title: 'Histoire',
    subtitle: 'L\'aventure Lieux d\'Exception',
    description: 'Il y a des lieux que l\'on visite. Et d\'autres que l\'on ressent. Depuis plus de cinq ans, Lieux d\'Exception écrit une histoire faite de rencontres, de paris audacieux et de passions partagées autour de l\'événementiel haut de gamme. Chaque acquisition est guidée par une même ambition : révéler l\'âme de lieux rares et les transformer en scènes d\'émotions inoubliables.',
    backgroundImage: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/venues%2Fchateau-corbe%2Fb2b%2Fcorbe_vue_chateau_2.jpg?alt=media',
    ctaText: '',
    ctaLink: '',
  },
  sections: [],
  blocks: [],
  featureCards: [],
  contactInfo: [],
  finalCta: null,
  updatedAt: new Date(),
  updatedBy: 'system',
  version: 1,
};

/**
 * Fonction principale
 */
async function initPageContents() {
  try {
    console.log('🚀 Initialisation des contenus de pages...\n');

    // Homepage
    console.log('📝 Création du contenu Homepage (fr)...');
    await db.collection('pageContents').doc('homepage_fr').set(homepageContent);
    console.log('✅ Homepage créée\n');

    // Contact
    console.log('📝 Création du contenu Contact (fr)...');
    await db.collection('pageContents').doc('contact_fr').set(contactContent);
    console.log('✅ Contact créée\n');

    // Mariages
    console.log('📝 Création du contenu Mariages (fr)...');
    await db.collection('pageContents').doc('mariages_fr').set(mariagesContent);
    console.log('✅ Mariages créée\n');

    // B2B
    console.log('📝 Création du contenu B2B (fr)...');
    await db.collection('pageContents').doc('b2b_fr').set(b2bContent);
    console.log('✅ B2B créée\n');

    // Histoire
    console.log('📝 Création du contenu Histoire (fr)...');
    await db.collection('pageContents').doc('histoire_fr').set(histoireContent);
    console.log('✅ Histoire créée\n');

    console.log('🎉 Tous les contenus de pages ont été initialisés avec succès !');
    console.log('\n📌 Vous pouvez maintenant les modifier depuis le dashboard admin :');
    console.log('   👉 http://localhost:3002/admin/contenus\n');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des contenus:', error);
    process.exit(1);
  }
}

// Exécuter
initPageContents()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
