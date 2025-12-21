const admin = require('firebase-admin');

if (admin.apps.length === 0) {
  const serviceAccount = require('../firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

const db = admin.firestore();

async function checkPageContent() {
  try {
    const doc = await db.collection('pageContents').doc('homepage_fr').get();
    
    if (!doc.exists) {
      console.log('❌ Document homepage_fr non trouvé');
      return;
    }
    
    const data = doc.data();
    console.log('✅ Document homepage_fr trouvé');
    console.log('📝 Clés:', Object.keys(data));
    console.log('\n📄 Structure complète:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

checkPageContent();
