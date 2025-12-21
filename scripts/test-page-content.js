const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function testPageContent() {
  try {
    console.log('🔍 Test de getPageContent...\n');
    
    const doc = await db.collection('pageContents').doc('homepage_fr').get();
    
    if (!doc.exists) {
      console.log('❌ homepage_fr n\'existe pas !');
      return;
    }

    const data = doc.data();
    
    console.log('✅ Document homepage_fr trouvé\n');
    console.log('📄 DONNÉES COMPLÈTES:\n');
    console.log(JSON.stringify(data, null, 2));
    
    console.log('\n\n🎯 VÉRIFICATION RAPIDE:');
    console.log('- hero.title:', data.hero?.title ? '✅' : '❌');
    console.log('- hero.backgroundImage:', data.hero?.backgroundImage ? '✅' : '❌');
    console.log('- hero.buttons:', data.hero?.buttons?.length || 0);
    console.log('- sections:', data.sections?.length || 0);
    console.log('- sections[0].items:', data.sections?.[0]?.items?.length || 0);
    console.log('- featureCards:', data.featureCards?.length || 0);
    console.log('- finalCta:', data.finalCta?.title ? '✅' : '❌');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

testPageContent();
