const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function debugHomepageContent() {
  try {
    const doc = await db.collection('pageContents').doc('homepage_fr').get();
    
    if (!doc.exists) {
      console.log('❌ Document homepage_fr n\'existe pas !');
      return;
    }

    const data = doc.data();
    console.log('📄 HOMEPAGE_FR - Contenu complet:\n');
    
    // Hero
    console.log('🎯 HERO:');
    if (data.hero) {
      console.log('  title:', data.hero.title || '(vide)');
      console.log('  subtitle:', data.hero.subtitle || '(vide)');
      console.log('  description:', data.hero.description || '(vide)');
      console.log('  backgroundImage:', data.hero.backgroundImage ? '✅' : '❌');
      console.log('  buttons:', data.hero.buttons?.length || 0, 'bouton(s)');
    } else {
      console.log('  ❌ Hero absent');
    }
    
    // Sections
    console.log('\n📝 SECTIONS:', data.sections?.length || 0);
    if (data.sections?.length > 0) {
      data.sections.forEach((section, i) => {
        console.log(`\n  Section ${i + 1}:`);
        console.log('    title:', section.title || '(vide)');
        console.log('    visible:', section.visible !== false ? '✅' : '❌');
        console.log('    order:', section.order || 0);
        console.log('    items:', section.items?.length || 0);
        if (section.items?.length > 0) {
          section.items.forEach((item, j) => {
            console.log(`      Item ${j + 1}:`, item.content?.substring(0, 50) + '...');
          });
        }
      });
    }
    
    // Feature Cards
    console.log('\n🎴 FEATURE CARDS:', data.featureCards?.length || 0);
    if (data.featureCards?.length > 0) {
      data.featureCards.forEach((card, i) => {
        console.log(`\n  Card ${i + 1}:`);
        console.log('    title:', card.title || '(vide)');
        console.log('    description:', card.description?.substring(0, 50) + '...');
        console.log('    visible:', card.visible !== false ? '✅' : '❌');
        console.log('    order:', card.order || 0);
      });
    }
    
    // Final CTA
    console.log('\n📣 FINAL CTA:');
    if (data.finalCta) {
      console.log('  title:', data.finalCta.title || '(vide)');
      console.log('  description:', data.finalCta.description || '(vide)');
      console.log('  buttons:', data.finalCta.buttons?.length || 0);
    } else {
      console.log('  ❌ Final CTA absent');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

debugHomepageContent();
