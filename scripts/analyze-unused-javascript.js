/**
 * Script d'analyse : JavaScript inutilisé
 * 
 * Problèmes identifiés par Lighthouse :
 * 1. Google Tag Manager : 52 KB inutilisés (sur 126 KB)
 * 2. Chunks Next.js : 47 KB inutilisés (sur 80 KB)
 */

console.log('🔍 ANALYSE JAVASCRIPT INUTILISÉ - 99 KB\n');

console.log('═══════════════════════════════════════');
console.log('1️⃣  GOOGLE TAG MANAGER (52 KB inutilisés)');
console.log('═══════════════════════════════════════\n');

console.log('Problème :');
console.log('  GTM charge beaucoup de fonctionnalités non utilisées');
console.log('  - Event tracking avancé');
console.log('  - Conversion tracking');
console.log('  - Custom dimensions\n');

console.log('✅ Déjà optimisé :');
console.log('  - strategy="lazyOnload" (chargement différé)');
console.log('  - Pas de GTM container (juste gtag.js)\n');

console.log('💡 Solutions possibles :');
console.log('  Option 1 : Garder tel quel (acceptable, ~41% usage)');
console.log('  Option 2 : Minimal Analytics (parcel plugin)');
console.log('  Option 3 : Désactiver complètement (-126 KB)\n');

console.log('Recommandation : GARDER (tracking important B2B)\n');

console.log('═══════════════════════════════════════');
console.log('2️⃣  CHUNKS NEXT.JS (47 KB inutilisés)');
console.log('═══════════════════════════════════════\n');

console.log('Chunks identifiés :');
console.log('  - d0deef33.js : 41.7 KB (25 KB inutilisés) → Framer Motion');
console.log('  - 336.js : 38.5 KB (22 KB inutilisés) → React Leaflet\n');

console.log('💡 Optimisations :');
console.log('  1. Framer Motion : Import sélectif');
console.log('     ❌ import { motion } from "framer-motion"');
console.log('     ✅ import { m } from "framer-motion/m" (-30%)\n');

console.log('  2. Leaflet CSS : Lazy load');
console.log('     ✅ Déjà fait : import dynamique\n');

console.log('  3. Dynamic imports pour composants lourds');
console.log('     - VenueGallery (modal)');
console.log('     - VenuesMap (carte)\n');

console.log('═══════════════════════════════════════');
console.log('📊 GAINS ESTIMÉS');
console.log('═══════════════════════════════════════\n');

console.log('Optimisations réalistes :');
console.log('  - Leaflet CSS lazy : -5 KB');
console.log('  - Framer Motion optimisé : -15 KB');
console.log('  - Dynamic imports : -10 KB');
console.log('  ────────────────────────────────');
console.log('  TOTAL : ~30 KB économisés (-30%)\n');

console.log('GTM : Conserver (tracking business critique)\n');

console.log('═══════════════════════════════════════');
console.log('✅ ACTIONS');
console.log('═══════════════════════════════════════\n');

console.log('1. Leaflet CSS lazy load : ✅ FAIT');
console.log('2. Framer Motion : Utiliser "framer-motion/m"');
console.log('3. Dynamic imports : VenueGallery, VenuesMap');
console.log('4. GTM : Garder (important pour leads B2B)\n');
