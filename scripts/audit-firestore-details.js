const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

async function auditFirestoreContents() {
  console.log('🔍 AUDIT DÉTAILLÉ DES CONTENUS FIRESTORE\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const snapshot = await db.collection('pageContents').get();
    
    console.log(`📦 Total: ${snapshot.size} documents dans Firestore\n`);

    const contentsByPage = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      const [pageId, locale] = doc.id.split('_');
      
      if (!contentsByPage[pageId]) {
        contentsByPage[pageId] = {
          locales: [],
          sections: {}
        };
      }
      
      contentsByPage[pageId].locales.push(locale);
      
      // Analyser les sections
      if (data.hero) contentsByPage[pageId].sections.hero = true;
      if (data.sections) {
        Object.keys(data.sections).forEach(sectionKey => {
          contentsByPage[pageId].sections[sectionKey] = true;
        });
      }
    });

    // Afficher par page
    for (const [pageId, content] of Object.entries(contentsByPage)) {
      console.log(`\n📄 ${pageId.toUpperCase()}`);
      console.log(`   Langues: ${content.locales.join(', ')} (${content.locales.length}/6)`);
      console.log(`   Sections:`);
      
      Object.keys(content.sections).forEach(section => {
        console.log(`      • ${section}`);
      });
    }

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ CONCLUSION\n');
    
    console.log('📋 Pages avec contenu Firestore:');
    Object.keys(contentsByPage).forEach(pageId => {
      const locales = contentsByPage[pageId].locales.length;
      const status = locales === 1 ? '⚠️  1 langue seulement' : locales === 6 ? '✅ Toutes langues' : `⚠️  ${locales}/6 langues`;
      console.log(`   • ${pageId}: ${status}`);
    });

    console.log('\n🎯 Prochaines étapes:');
    console.log('   1. Vérifier que Contact, Mariages, B2B utilisent bien ce contenu');
    console.log('   2. Si pas utilisé → migrer le code des pages pour charger depuis Firestore');
    console.log('   3. Ajouter les traductions manquantes (actuellement 1/6 langues)');
    console.log('\n');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

auditFirestoreContents()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
