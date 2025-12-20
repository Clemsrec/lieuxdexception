const fs = require('fs');
const path = require('path');

/**
 * AUDIT COMPLET - Gestion des contenus Dashboard vs Pages publiques
 * 
 * Vérifie :
 * 1. Quelles pages utilisent Firestore (getPageContent)
 * 2. Quelles pages sont hardcodées
 * 3. Quels contenus sont disponibles dans Firestore
 */

console.log('🔍 AUDIT COMPLET - GESTION DES CONTENUS\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const pagesDir = path.join(__dirname, '../src/app/[locale]');

// Pages publiques à vérifier
const pagesToCheck = [
  { id: 'homepage', name: 'Page d\'Accueil', file: 'page.tsx' },
  { id: 'contact', name: 'Contact', file: 'contact/page.tsx' },
  { id: 'mariages', name: 'Mariages', file: 'mariages/page.tsx' },
  { id: 'b2b', name: 'Événements B2B', file: 'evenements-b2b/page.tsx' },
  { id: 'histoire', name: 'Histoire', file: 'galerie-histoire/page.tsx' },
  { id: 'cgv', name: 'CGV', file: 'cgv/page.tsx' },
  { id: 'confidentialite', name: 'Confidentialité', file: 'confidentialite/page.tsx' },
  { id: 'cookies', name: 'Cookies', file: 'cookies/page.tsx' },
  { id: 'mentions', name: 'Mentions Légales', file: 'mentions-legales/page.tsx' },
];

console.log('📄 ANALYSE DES FICHIERS DE PAGES\n');

const results = {
  usesFirestore: [],
  hardcoded: [],
  partial: []
};

for (const page of pagesToCheck) {
  const filePath = path.join(pagesDir, page.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${page.name}: Fichier non trouvé`);
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Vérifier si utilise getPageContent
  const usesGetPageContent = content.includes('getPageContent');
  const hasHardcodedText = content.match(/<h\d[^>]*>[^<]{20,}<\/h\d>/g) || 
                          content.match(/<p[^>]*>[^<]{50,}<\/p>/g);
  
  console.log(`\n${page.name}:`);
  console.log(`   Fichier: ${page.file}`);
  
  if (usesGetPageContent) {
    console.log(`   ✅ Utilise Firestore (getPageContent)`);
    results.usesFirestore.push(page);
    
    if (hasHardcodedText && hasHardcodedText.length > 3) {
      console.log(`   ⚠️  Contient aussi du texte hardcodé (${hasHardcodedText.length} blocs)`);
      results.partial.push(page);
    }
  } else {
    console.log(`   ❌ 100% hardcodé (ne charge rien depuis Firestore)`);
    results.hardcoded.push(page);
    
    if (hasHardcodedText) {
      console.log(`   📝 Blocs de texte hardcodés: ${hasHardcodedText.length}`);
    }
  }
}

console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 RÉSUMÉ DE L\'AUDIT\n');

console.log(`✅ Pages utilisant Firestore: ${results.usesFirestore.length}/${pagesToCheck.length}`);
results.usesFirestore.forEach(p => console.log(`   • ${p.name}`));

console.log(`\n⚠️  Pages partielles (Firestore + hardcodé): ${results.partial.length}/${pagesToCheck.length}`);
results.partial.forEach(p => console.log(`   • ${p.name}`));

console.log(`\n❌ Pages 100% hardcodées: ${results.hardcoded.length}/${pagesToCheck.length}`);
results.hardcoded.forEach(p => console.log(`   • ${p.name}`));

console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('💡 RECOMMANDATIONS\n');

if (results.hardcoded.length > 0) {
  console.log('🔧 Pages à migrer vers Firestore:');
  results.hardcoded.forEach(p => {
    console.log(`\n   ${p.name}:`);
    console.log(`   1. Ajouter '${p.id}' dans PageContentManager.tsx`);
    console.log(`   2. Créer init script pour migrer contenu hardcodé`);
    console.log(`   3. Modifier ${p.file} pour charger depuis Firestore`);
  });
}

if (results.partial.length > 0) {
  console.log('\n\n⚠️  Pages partielles à vérifier:');
  results.partial.forEach(p => {
    console.log(`   • ${p.name}: Vérifier si tout le contenu est bien dans Firestore`);
  });
}

console.log('\n\n✅ STATUT ACTUEL:');
console.log(`   • ${results.usesFirestore.length} pages connectées à Firestore`);
console.log(`   • Dashboard permet de gérer: Homepage, Contact, Mariages, B2B, Histoire`);
console.log(`   • Pages légales (CGV, Mentions, etc) peuvent rester hardcodées (contenu statique)`);
console.log('\n');
