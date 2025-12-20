const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

async function auditPageContents() {
  console.log('📊 AUDIT DES CONTENUS DE PAGES\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Pages publiques du site
  const publicPages = [
    { id: 'homepage', name: 'Page d\'Accueil', route: '/' },
    { id: 'contact', name: 'Contact', route: '/contact' },
    { id: 'mariages', name: 'Mariages', route: '/mariages' },
    { id: 'b2b', name: 'Événements B2B', route: '/evenements-b2b' },
    { id: 'histoire', name: 'Histoire', route: '/galerie-histoire' },
    { id: 'cgv', name: 'CGV', route: '/cgv' },
    { id: 'confidentialite', name: 'Confidentialité', route: '/confidentialite' },
    { id: 'cookies', name: 'Cookies', route: '/cookies' },
    { id: 'mentions-legales', name: 'Mentions Légales', route: '/mentions-legales' },
  ];

  console.log('📋 Pages publiques du site:\n');

  try {
    // Récupérer tous les contenus de Firestore
    const contentsSnapshot = await db.collection('pageContents').get();
    const firestoreContents = new Map();
    
    contentsSnapshot.forEach(doc => {
      firestoreContents.set(doc.id, doc.data());
    });

    console.log(`✅ ${firestoreContents.size} contenus trouvés dans Firestore\n`);

    // Analyser chaque page
    for (const page of publicPages) {
      console.log(`\n📄 ${page.name} (${page.route})`);
      console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const locales = ['fr', 'en', 'es', 'de', 'it', 'pt'];
      let hasFirestoreContent = false;
      let localesWithContent = [];

      for (const locale of locales) {
        const contentId = `${page.id}_${locale}`;
        if (firestoreContents.has(contentId)) {
          hasFirestoreContent = true;
          localesWithContent.push(locale);
        }
      }

      if (hasFirestoreContent) {
        console.log(`   ✅ Géré dans Firestore (${localesWithContent.length}/6 langues: ${localesWithContent.join(', ')})`);
      } else {
        console.log(`   ⚠️  HARDCODÉ - Non géré dans dashboard`);
      }
    }

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RÉSUMÉ\n');

    const managedPages = publicPages.filter(page => {
      const contentId = `${page.id}_fr`;
      return firestoreContents.has(contentId);
    });

    const unmanagedPages = publicPages.filter(page => {
      const contentId = `${page.id}_fr`;
      return !firestoreContents.has(contentId);
    });

    console.log(`✅ Pages gérées dans dashboard : ${managedPages.length}/${publicPages.length}`);
    managedPages.forEach(p => console.log(`   • ${p.name}`));

    if (unmanagedPages.length > 0) {
      console.log(`\n⚠️  Pages NON gérées (hardcodées) : ${unmanagedPages.length}/${publicPages.length}`);
      unmanagedPages.forEach(p => console.log(`   • ${p.name} (${p.route})`));
    }

    console.log('\n\n💡 RECOMMANDATIONS\n');
    console.log('Pour les pages hardcodées, vous pouvez :');
    console.log('1. Les ajouter au PageContentManager');
    console.log('2. Migrer le contenu hardcodé vers Firestore');
    console.log('3. Ou les laisser hardcodées si contenu statique simple\n');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

auditPageContents()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
