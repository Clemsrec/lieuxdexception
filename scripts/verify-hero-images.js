const admin = require('firebase-admin');

if (!admin.apps.length) {
  const sa = require('../firebase-service-account.json');
  admin.initializeApp({ credential: admin.credential.cert(sa) });
}

admin.firestore().collection('venues').get().then(snapshot => {
  console.log('\n🏰 Vérification images.hero pour toutes les venues:\n');
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const hero = data.images?.hero || data.heroImage || data.hero || 'MANQUANT';
    const isStorage = hero.includes('firebasestorage.googleapis.com');
    
    console.log(`${isStorage ? '✅' : '❌'} ${data.name || doc.id}`);
    console.log(`   Slug: ${data.slug}`);
    console.log(`   Hero: ${hero.substring(0, 100)}...`);
    console.log('');
  });
  
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
