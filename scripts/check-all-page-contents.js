const admin = require('firebase-admin');

if (admin.apps.length === 0) {
  const serviceAccount = require('../firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

const db = admin.firestore();

async function checkAllPageContents() {
  try {
    const pages = ['homepage_fr', 'mariages_fr', 'b2b_fr', 'histoire_fr', 'contact_fr'];
    
    console.log('🔍 Vérification des contenus de pages...\n');
    
    for (const pageId of pages) {
      const doc = await db.collection('pageContents').doc(pageId).get();
      
      if (!doc.exists) {
        console.log(`❌ ${pageId}: NON TROUVÉ`);
        continue;
      }
      
      const data = doc.data();
      console.log(`✅ ${pageId}:`);
      console.log(`   - hero: ${data.hero ? 'Présent' : 'Absent'}`);
      console.log(`   - sections: ${data.sections ? data.sections.length : 0}`);
      console.log(`   - blocks: ${data.blocks ? data.blocks.length : 0}`);
      console.log(`   - featureCards: ${data.featureCards ? data.featureCards.length : 0}`);
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

checkAllPageContents();
