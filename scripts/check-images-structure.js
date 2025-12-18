const admin = require('firebase-admin');

if (!admin.apps.length) {
  const sa = require('../firebase-service-account.json');
  admin.initializeApp({ credential: admin.credential.cert(sa) });
}

admin.firestore().collection('venues').doc('chateau-brulaire').get().then(doc => {
  const data = doc.data();
  console.log('\n📊 Structure du champ images pour chateau-brulaire:\n');
  console.log('heroImage:', data.heroImage);
  console.log('images:', JSON.stringify(data.images, null, 2));
  console.log('hero:', data.hero);
  console.log('cardImage:', data.cardImage);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
