/**
 * Script simple : Mettre à jour les URLs Firestore
 * Guide pour mise à jour manuelle
 */

console.log('🔄 Mise à jour manuelle des URLs WebP dans Firestore\n');

console.log('📋 URLs à mettre à jour :');
console.log('\n1️⃣  Château de la Brûlaire');
console.log('   ID Firestore : chateau-brulaire');
console.log('   heroImage : venues/chateau-brulaire/hero.jpg → hero.webp\n');

console.log('2️⃣  Château Le Dôme');
console.log('   ID Firestore : chateau-le-dome');
console.log('   logo : logos/venues/dome-blanc.png → dome-blanc.webp\n');

console.log('3️⃣  Le Domaine Nantais');
console.log('   ID Firestore : domaine-nantais');
console.log('   logo : logos/venues/domaine-blanc.png → domaine-blanc.webp');
console.log('   gallery : venues/domaine-nantais/mariages/domaine_cocktail_1.jpg → .webp\n');

console.log('═══════════════════════════════════════');
console.log('⚠️  ACTION MANUELLE REQUISE');
console.log('═══════════════════════════════════════\n');

console.log('Option 1 : Console Firebase');
console.log('  1. Ouvrir https://console.firebase.google.com');
console.log('  2. Projet : lieux-d-exceptions');
console.log('  3. Firestore Database > lieuxdexception');
console.log('  4. Collection : venues');
console.log('  5. Éditer chaque document manuellement\n');

console.log('Option 2 : Dashboard Admin');
console.log('  1. Aller sur https://lieuxdexception.com/admin/venues');
console.log('  2. Éditer chaque lieu');
console.log('  3. Mettre à jour les chemins d\'images\n');

console.log('Option 3 : API Route (si serveur fonctionne)');
console.log('  curl http://localhost:3001/api/admin/update-webp-urls\n');

console.log('💡 Les images WebP sont déjà uploadées sur Firebase Storage');
console.log('✅ storage-assets.ts est déjà à jour avec les nouvelles URLs');
console.log('⏳ Il faut juste mettre à jour Firestore pour que le site les charge\n');

console.log('🎯 Gains attendus :');
console.log('  - Brûlaire hero : 3 927 KB → 924 KB (-76%)');
console.log('  - Logos (2x) : 257 KB → 21 KB (-92%)');
console.log('  - Domaine cocktail : 267 KB → 120 KB (-55%)');
console.log('  - TOTAL : ~3.3 MB économisés (-75%)\n');
