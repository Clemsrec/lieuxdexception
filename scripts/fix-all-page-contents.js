const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function fixAllPageContents() {
  try {
    // 1. MARIAGES_FR
    console.log('📝 Mise à jour de mariages_fr...');
    const mariagesData = {
      hero: {
        title: 'Mariages d\'Exception',
        subtitle: 'Célébrez votre union dans nos domaines d\'exception',
        description: 'Des lieux de caractère pour un jour inoubliable',
        backgroundImage: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/venues%2Fchateau-brulaire%2Fmariages%2Fmise-en-scene.jpg?alt=media',
        buttons: [
          {
            label: 'Demander des informations',
            href: '/fr/contact',
            primary: true
          }
        ]
      },
      sections: [
        {
          title: 'Lieux d\'Exception, la signature de votre mariage',
          order: 0,
          visible: true,
          items: [
            { content: 'Chaque histoire est unique.' },
            { content: 'Votre mariage mérite un lieu et un accompagnement à la hauteur de ce moment rare.' },
            { content: 'Chez Lieux d\'Exception, nous réunissons des domaines de caractère et un savoir-faire éprouvé pour créer des mariages élégants, sincères et profondément mémorables.' }
          ]
        }
      ],
      featureCards: [
        {
          title: 'Une rencontre qui donne le ton',
          description: 'Dès notre première rencontre, nous prenons le temps de vous écouter. Vos envies, vos priorités, vos contraintes : tout est intégré pour construire un mariage fidèle à votre histoire, sans pression ni format imposé.',
          order: 0,
          visible: true
        },
        {
          title: 'Une organisation fluide, du début à la fin',
          description: 'Du choix du lieu à la mise en scène du jour J, nous orchestrons chaque étape avec précision. Vous profitez pleinement des préparatifs, l\'esprit libre, en toute confiance.',
          order: 1,
          visible: true
        },
        {
          title: 'Des partenaires fiables, pour une confiance totale',
          description: 'Chaque prestataire est sélectionné pour son professionnalisme, sa fiabilité et son sens du service. Traiteurs, décorateurs, fleuristes, photographes… vous êtes entourés de professionnels sur lesquels vous pouvez compter, sans mauvaise surprise.',
          order: 2,
          visible: true
        },
        {
          title: 'Des lieux exclusifs, pour une tranquillité absolue',
          description: 'Châteaux et domaines de caractère, entièrement privatisés pour votre mariage. Vous profitez de votre journée en toute intimité, dans un cadre élégant et apaisant, sans contraintes extérieures.',
          order: 3,
          visible: true
        }
      ]
    };
    
    await db.collection('pageContents').doc('mariages_fr').set(mariagesData, { merge: true });
    console.log('✅ mariages_fr complété');
    
    // 2. B2B_FR
    console.log('\n📝 Mise à jour de b2b_fr...');
    const b2bData = {
      hero: {
        title: 'Événements B2B et Séminaires',
        subtitle: 'Des lieux inspirants pour vos événements professionnels',
        description: 'Séminaires, conférences et événements corporate dans nos domaines d\'exception',
        backgroundImage: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/venues%2Fchateau-corbe%2Fb2b%2Fcorbe_seminaire_1.jpg?alt=media',
        buttons: [
          {
            label: 'Demander un devis',
            href: '/fr/contact',
            primary: true
          }
        ]
      },
      sections: [
        {
          title: 'Ce que nous vous offrons',
          order: 0,
          visible: true,
          items: [
            {
              title: 'Une émotion d\'éveil',
              content: 'Des lieux à forte identité, pensés pour créer un effet immédiat et marquer durablement les esprits.'
            },
            {
              title: 'Un service d\'excellence',
              content: 'Plus de 20 ans d\'expertise événementielle, un coordinateur dédié et un réseau de partenaires premium pour un pilotage précis et maîtrisé.'
            },
            {
              title: 'Des lieux inspirés',
              content: 'Domaines privatisables, modulables et ouverts aux formats les plus exigeants. Nous adaptons l\'espace à votre ambition, jamais l\'inverse.'
            }
          ]
        }
      ],
      blocks: [
        {
          title: 'Marquer durablement les esprits',
          content: 'Des lieux à forte identité, pensés pour créer un effet immédiat. <strong class="text-primary">Votre événement devient un moment de référence, qui valorise votre image et renforce l\'adhésion de vos équipes et de vos clients.</strong>',
          order: 0
        },
        {
          title: 'Des environnements qui déclenchent la performance',
          content: '<strong class="text-primary">Cohésion, créativité, prise de recul, décisions stratégiques.</strong> Nos domaines offrent des cadres propices à l\'échange et à la réflexion, loin des formats standardisés et impersonnels.',
          order: 1
        },
        {
          title: 'Une liberté totale de création',
          content: 'Chaque lieu est privatisable, modulable et ouvert aux formats les plus exigeants. <strong class="text-primary">Séminaire confidentiel, expérience immersive ou événement d\'envergure : nous adaptons l\'espace à votre ambition, jamais l\'inverse.</strong>',
          order: 2
        },
        {
          title: 'Un savoir-faire qui sécurise votre projet',
          content: '<strong class="text-primary">Plus de 20 ans d\'expertise événementielle, un coordinateur dédié et un réseau de partenaires premium.</strong> Vous bénéficiez d\'un pilotage précis, fluide et maîtrisé, du premier échange au jour J.',
          order: 3
        }
      ]
    };
    
    await db.collection('pageContents').doc('b2b_fr').set(b2bData, { merge: true });
    console.log('✅ b2b_fr complété');
    
    console.log('\n✨ Tous les contenus ont été complétés avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

fixAllPageContents();
