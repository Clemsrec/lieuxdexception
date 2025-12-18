/**
 * Script pour afficher la structure COMPLÈTE d'un document venue
 * Permet de voir TOUTES les références d'images (hero, galleries, etc.)
 */

const admin = require('firebase-admin');
const util = require('util');

if (!admin.apps.length) {
  const serviceAccount = require('../firebase-service-account.json');
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

async function inspectVenue(slug = 'chateau-brulaire') {
  console.log(`\n🔍 Inspection complète de: ${slug}\n`);
  
  const snapshot = await db.collection('venues').where('slug', '==', slug).limit(1).get();
  
  if (snapshot.empty) {
    console.log('❌ Venue non trouvée');
    process.exit(1);
  }
  
  const doc = snapshot.docs[0];
  const data = doc.data();
  
  console.log('📋 DONNÉES COMPLÈTES:\n');
  console.log(util.inspect(data, { depth: 10, colors: true, maxArrayLength: null }));
  
  console.log('\n\n📸 RÉFÉRENCES D\'IMAGES TROUVÉES:\n');
  
  // Trouver toutes les références d'images
  const findImages = (obj, path = '') => {
    const images = [];
    
    if (!obj || typeof obj !== 'object') return images;
    
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string') {
        if (value.includes('/venues/') || value.includes('firebasestorage.googleapis.com')) {
          const isStorage = value.includes('firebasestorage.googleapis.com');
          images.push({
            path: currentPath,
            url: value,
            type: isStorage ? 'Storage' : 'Local',
            status: isStorage ? '✅' : '⚠️ '
          });
        }
      } else if (typeof value === 'object') {
        images.push(...findImages(value, currentPath));
      }
    }
    
    return images;
  };
  
  const images = findImages(data);
  
  console.log(`Total références trouvées: ${images.length}\n`);
  
  images.forEach(img => {
    console.log(`${img.status} ${img.path}`);
    console.log(`   Type: ${img.type}`);
    console.log(`   URL: ${img.url.substring(0, 120)}${img.url.length > 120 ? '...' : ''}`);
    console.log('');
  });
  
  // Statistiques
  const storageCount = images.filter(i => i.type === 'Storage').length;
  const localCount = images.filter(i => i.type === 'Local').length;
  
  console.log('='.repeat(60));
  console.log('📊 STATISTIQUES');
  console.log('='.repeat(60));
  console.log(`✅ URLs Storage: ${storageCount}`);
  console.log(`⚠️  URLs Locales: ${localCount}`);
  console.log(`📈 Total: ${images.length}`);
  console.log(`🎯 Progression: ${Math.round((storageCount / images.length) * 100)}%`);
  console.log('='.repeat(60));
  
  process.exit(0);
}

const slug = process.argv[2] || 'chateau-brulaire';
inspectVenue(slug).catch(console.error);
