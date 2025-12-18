/**
 * Script de vérification des logos hardcodés
 * Confirme que tous les logos référencés dans le code existent bien
 */

const fs = require('fs');
const path = require('path');

const LOGO_MAP = {
  'chateau-brulaire': { blanc: '/logos/brulaire-blanc.png', dore: '/logos/brulaire-dore.png' },
  'chateau-de-la-brulaire': { blanc: '/logos/brulaire-blanc.png', dore: '/logos/brulaire-dore.png' },
  'manoir-boulaie': { blanc: '/logos/boulaie-blanc.png', dore: '/logos/boulaie-dore.png' },
  'manoir-de-la-boulaie': { blanc: '/logos/boulaie-blanc.png', dore: '/logos/boulaie-dore.png' },
  'domaine-nantais': { blanc: '/logos/domaine-blanc.png', dore: '/logos/domaine-dore.png' },
  'le-dome': { blanc: '/logos/dome-blanc.png', dore: '/logos/dome-dore.png' },
  'dome': { blanc: '/logos/dome-blanc.png', dore: '/logos/dome-dore.png' },
};

const MAIN_LOGO = '/logos/logo-lieux-exception-blanc.png';

console.log('🔍 Vérification des logos hardcodés...\n');

const publicDir = path.join(__dirname, '..', 'public');
const errors = [];
const verified = new Set();

// Vérifier le logo principal
console.log('📌 Logo principal:');
const mainLogoPath = path.join(publicDir, MAIN_LOGO);
if (fs.existsSync(mainLogoPath)) {
  console.log(`   ✅ ${MAIN_LOGO}`);
  verified.add(MAIN_LOGO);
} else {
  console.log(`   ❌ ${MAIN_LOGO} (MANQUANT)`);
  errors.push(MAIN_LOGO);
}

// Vérifier tous les logos de lieux
console.log('\n🏰 Logos des lieux:');

Object.entries(LOGO_MAP).forEach(([slug, logos]) => {
  console.log(`\n   ${slug}:`);
  
  ['blanc', 'dore'].forEach(theme => {
    const logoPath = logos[theme];
    const fullPath = path.join(publicDir, logoPath);
    
    if (fs.existsSync(fullPath)) {
      console.log(`      ✅ ${theme}: ${logoPath}`);
      verified.add(logoPath);
    } else {
      console.log(`      ❌ ${theme}: ${logoPath} (MANQUANT)`);
      errors.push(logoPath);
    }
  });
});

// Lister les logos disponibles mais non référencés
console.log('\n📂 Logos disponibles dans /public/logos:');
const logosDir = path.join(publicDir, 'logos');
const availableLogos = fs.readdirSync(logosDir).filter(f => f.endsWith('.png') || f.endsWith('.svg'));

availableLogos.forEach(logo => {
  const logoPath = `/logos/${logo}`;
  if (!verified.has(logoPath)) {
    console.log(`   ℹ️  ${logo} (non référencé dans le code)`);
  }
});

// Résumé
console.log('\n' + '='.repeat(60));
if (errors.length === 0) {
  console.log('✅ TOUS LES LOGOS HARDCODÉS SONT VALIDES!');
  console.log(`   ${verified.size} logos vérifiés avec succès`);
} else {
  console.log(`❌ ${errors.length} logo(s) manquant(s):`);
  errors.forEach(e => console.log(`   - ${e}`));
  process.exit(1);
}

console.log('\n📝 Notes:');
console.log('   - chateau-corbe: Pas de logo (affiché sans logo)');
console.log('   - Logos CLE: Disponibles mais non utilisés actuellement');
console.log('   - Tous les logos sont hardcodés dans src/lib/logoHelper.ts');
console.log('   - Aucune dépendance Firestore pour les logos');
