const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function fixHomepageContent() {
  try {
    const docRef = db.collection('pageContents').doc('homepage_fr');
    
    // Données complètes pour la homepage
    const homepageData = {
      hero: {
        title: 'Lieux d\'Exception',
        subtitle: 'Des domaines de caractère pour vos événements d\'exception',
        description: 'Châteaux et domaines prestigieux en Pays de la Loire pour vos mariages et événements professionnels',
        backgroundImage: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/venues%2Fchateau-brulaire%2Fhero%2Fbrulaire_facade_1.jpg?alt=media',
        buttons: [
          {
            label: 'Découvrir nos lieux',
            href: '#nos-lieux',
            primary: true
          },
          {
            label: 'Nous contacter',
            href: '/fr/contact',
            primary: false
          }
        ]
      },
      
      sections: [
        {
          title: 'Une aventure née de lieux & de passion',
          order: 0,
          visible: true,
          items: [
            {
              content: 'Tout commence par un lieu.'
            },
            {
              content: 'Un château, un domaine, un espace à l\'identité affirmée. Un cadre qui inspire, qui structure, qui marque durablement l\'esprit.'
            },
            {
              content: 'Chez Lieux d\'Exception, nous avons fait de cette conviction notre métier. Depuis plus de 20 ans, nous accompagnons mariages et événements professionnels en réunissant ce qui fait l\'excellence : des domaines de caractère, un savoir-faire éprouvé, et une exigence constante dans chaque détail.'
            }
          ]
        }
      ],
      
      featureCards: [
        {
          title: 'Un accompagnement sur mesure',
          description: 'Parce que chaque événement est unique, nous construisons avec vous un projet fidèle à vos attentes, sans formats imposés ni solutions standardisées.',
          order: 0,
          visible: true
        },
        {
          title: 'Une orchestration fluide',
          description: 'De la première rencontre au jour J, nous pilotons chaque étape avec précision pour que vous puissiez profiter pleinement de votre événement, l\'esprit libre.',
          order: 1,
          visible: true
        },
        {
          title: 'Un réseau de partenaires',
          description: 'Traiteurs, décorateurs, photographes… Chaque prestataire est sélectionné pour son professionnalisme et sa fiabilité. Vous bénéficiez de notre expérience, sans mauvaise surprise.',
          order: 2,
          visible: true
        },
        {
          title: 'Des lieux d\'exception, en exclusivité',
          description: 'Châteaux et domaines de caractère, entièrement privatisés pour votre événement. Vous profitez d\'un cadre élégant et apaisant, en toute intimité.',
          order: 3,
          visible: true
        }
      ],
      
      finalCta: {
        title: 'Parce que l\'émotion se vit pleinement lorsqu\'elle trouve son Lieu d\'Exception',
        description: 'Des domaines où se mêlent beauté, sincérité et art de recevoir.',
        buttons: [
          {
            label: 'Contactez-nous',
            href: '/fr/contact',
            primary: true
          }
        ]
      }
    };
    
    await docRef.set(homepageData, { merge: true });
    
    console.log('✅ Homepage content fixé avec succès !');
    console.log('\n📄 Contenu ajouté:');
    console.log('  - Hero avec backgroundImage et 2 boutons');
    console.log('  - Section "Une aventure" avec 3 paragraphes');
    console.log('  - 4 Feature Cards avec descriptions complètes');
    console.log('  - Final CTA avec description et bouton');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

fixHomepageContent();
