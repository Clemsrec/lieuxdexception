#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Correction de TOUTES les images hardcodées...\n');

// ============ MAPPING DES IMAGES RÉELLES ============
const IMAGE_REPLACEMENTS = {
  'src/app/[locale]/evenements-b2b/page.tsx': [
    {
      old: 'src="/venues/manoir-boulaie/b2b/boulaie_b2b_1.jpg"',
      new: 'src="/venues/manoir-boulaie/b2b/boulaie_seminaire_4.jpg"'
    },
    {
      old: 'src="/venues/chateau-brulaire/b2b/brulaire_b2b_1.jpg"',
      new: 'src="/venues/chateau-brulaire/b2b/brulaire_bar_2.jpg"'
    },
    {
      old: 'src="/venues/domaine-nantais/b2b/nantais_b2b_1.jpg"',
      new: 'src="/venues/domaine-nantais/b2b/domaine_accueil_cafe.jpg"'
    },
    {
      old: 'src="/venues/le-dome/mariages/dome_mariage_1.jpg"',
      new: 'src="/venues/le-dome/hero.jpg"'
    }
  ],
  'src/app/[locale]/mariages/page.tsx': [
    {
      old: 'src="/venues/chateau-brulaire/mariages/brulaire_mariage_1.jpg"',
      new: 'src="/venues/chateau-brulaire/mariages/brulaire.jpg"'
    },
    {
      old: 'src="/venues/manoir-boulaie/mariages/boulaie_mariage_1.jpg"',
      new: 'src="/venues/manoir-boulaie/mariages/manoir_boulaie_1.jpg"'
    },
    {
      old: 'src="/venues/chateau-corbe/mariages/corbe_mariage_1.jpg"',
      new: 'src="/venues/chateau-corbe/mariages/corbe_exterieur_1.jpg"'
    },
    {
      old: 'src="/venues/domaine-nantais/mariages/nantais_mariage_1.jpg"',
      new: 'src="/venues/domaine-nantais/mariages/domaine_mariage_8.jpg"'
    },
    {
      old: 'src="/venues/le-dome/mariages/dome_mariage_1.jpg"',
      new: 'src="/venues/le-dome/mariages/dome_exterieur_2.jpg"'
    },
    {
      old: 'src="/venues/chateau-brulaire/mariages/brulaire_mariage_2.jpg"',
      new: 'src="/venues/chateau-brulaire/mariages/brulaire_chambre_1.jpg"'
    }
  ]
};

let totalUpdates = 0;
let filesUpdated = 0;

for (const [file, replacements] of Object.entries(IMAGE_REPLACEMENTS)) {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${file}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let updated = false;
  
  for (const { old, new: newStr } of replacements) {
    if (content.includes(old)) {
      content = content.replace(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newStr);
      updated = true;
      totalUpdates++;
      console.log(`  ✓ ${old.substring(5, 60)}... → ${newStr.substring(5, 60)}...`);
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf-8');
    filesUpdated++;
    console.log(`✅ ${file}\n`);
  }
}

console.log(`============================================================`);
console.log(`📊 RÉSULTAT`);
console.log(`============================================================`);
console.log(`✅ Fichiers modifiés: ${filesUpdated}`);
console.log(`✅ Images mises à jour: ${totalUpdates}`);
console.log(`\n⚠️  Redémarrer le serveur pour voir les changements\n`);
