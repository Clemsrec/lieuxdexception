#!/usr/bin/env node

/**
 * Script d'organisation des photos des lieux
 * Déplace les photos depuis "public/Photos chateaux" vers "public/venues/{slug}/"
 * 
 * Structure cible :
 * public/venues/
 *   chateau-brulaire/
 *     hero.jpg (photo principale)
 *     gallery/ (galerie générale)
 *     b2b/ (photos séminaires/pro)
 *     mariages/ (photos mariages/privés)
 *   chateau-corbe/
 *   ...
 */

const fs = require('fs');
const path = require('path');

// Mapping des noms de dossiers vers les slugs
const VENUE_MAPPING = {
  'Château de la Brûlaire': 'chateau-brulaire',
  'Château de la Corbe': 'chateau-corbe',
  'Domaine Nantais': 'domaine-nantais',
  'Le Dôme': 'le-dome',
  'Manoir de la Boulaie': 'manoir-boulaie'
};

// Chemins
const SOURCE_DIR = path.join(__dirname, '../public/Photos chateaux');
const TARGET_BASE = path.join(__dirname, '../public/venues');

/**
 * Crée la structure de dossiers pour un lieu
 */
function createVenueStructure(slug) {
  const venuePath = path.join(TARGET_BASE, slug);
  const dirs = [
    venuePath,
    path.join(venuePath, 'gallery'),
    path.join(venuePath, 'b2b'),
    path.join(venuePath, 'mariages')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Créé: ${dir}`);
    }
  });
}

/**
 * Copie un fichier et renomme si nécessaire
 */
function copyFile(source, target) {
  if (!fs.existsSync(source)) {
    console.log(`⚠️  Source inexistante: ${source}`);
    return false;
  }
  
  // Créer le dossier parent si nécessaire
  const targetDir = path.dirname(target);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Si le fichier cible existe déjà, ajouter un suffixe
  let finalTarget = target;
  let counter = 1;
  while (fs.existsSync(finalTarget)) {
    const ext = path.extname(target);
    const basename = path.basename(target, ext);
    finalTarget = path.join(
      path.dirname(target),
      `${basename}_${counter}${ext}`
    );
    counter++;
  }
  
  fs.copyFileSync(source, finalTarget);
  console.log(`📸 Copié: ${path.basename(source)} → ${path.relative(__dirname + '/..', finalTarget)}`);
  return true;
}

/**
 * Traite les photos d'un lieu spécifique
 */
function processVenuePhotos(venueName, slug) {
  const venuePath = path.join(SOURCE_DIR, venueName);
  
  if (!fs.existsSync(venuePath)) {
    console.log(`⚠️  Dossier inexistant: ${venueName}`);
    return;
  }
  
  console.log(`\n🏰 Traitement: ${venueName} → ${slug}`);
  createVenueStructure(slug);
  
  let photoCount = 0;
  
  // Traiter les sous-dossiers B2B et MARIAGES
  ['B2B', 'MARIAGES'].forEach(eventType => {
    const eventPath = path.join(venuePath, eventType);
    
    if (!fs.existsSync(eventPath)) {
      console.log(`   ⚠️  Pas de dossier ${eventType}`);
      return;
    }
    
    const targetSubdir = eventType === 'B2B' ? 'b2b' : 'mariages';
    
    // Parcourir récursivement tous les sous-dossiers
    function processDirectory(dirPath, targetDir) {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          // Récursif sur les sous-dossiers
          processDirectory(itemPath, targetDir);
        } else if (stat.isFile() && /\.(jpg|jpeg|png)$/i.test(item)) {
          // Copier le fichier
          const target = path.join(TARGET_BASE, slug, targetDir, item.toLowerCase());
          if (copyFile(itemPath, target)) {
            photoCount++;
          }
        }
      });
    }
    
    processDirectory(eventPath, targetSubdir);
  });
  
  console.log(`   ✅ ${photoCount} photos copiées pour ${slug}`);
}

/**
 * Traite les photos des galeries générales
 */
function processGalleryPhotos() {
  console.log('\n📚 Traitement des galeries générales...');
  
  // Galerie SÉMINAIRES & PRO
  const proGalleryPath = path.join(SOURCE_DIR, 'GALERIE Onglet SÉMINAIRES & PRO');
  if (fs.existsSync(proGalleryPath)) {
    const files = fs.readdirSync(proGalleryPath);
    
    files.forEach(file => {
      if (!/\.(jpg|jpeg|png)$/i.test(file)) return;
      
      // Détecter le lieu depuis le nom du fichier
      let targetSlug = null;
      if (/brulaire/i.test(file)) targetSlug = 'chateau-brulaire';
      else if (/corbe/i.test(file)) targetSlug = 'chateau-corbe';
      else if (/domaine/i.test(file)) targetSlug = 'domaine-nantais';
      else if (/dome/i.test(file)) targetSlug = 'le-dome';
      else if (/manoir|boulaie/i.test(file)) targetSlug = 'manoir-boulaie';
      
      if (targetSlug) {
        const source = path.join(proGalleryPath, file);
        const target = path.join(TARGET_BASE, targetSlug, 'b2b', file.toLowerCase());
        copyFile(source, target);
      } else {
        console.log(`   ⚠️  Impossible de déterminer le lieu: ${file}`);
      }
    });
  }
  
  // Galerie MARIAGES & PRIVÉS
  const mariagesGalleryPath = path.join(SOURCE_DIR, 'GALERIE Onglet MARIAGES & PRIVÉS');
  if (fs.existsSync(mariagesGalleryPath)) {
    const files = fs.readdirSync(mariagesGalleryPath);
    
    files.forEach(file => {
      if (!/\.(jpg|jpeg|png)$/i.test(file)) return;
      
      // Détecter le lieu depuis le nom du fichier
      let targetSlug = null;
      if (/brulaire|brûlaire/i.test(file)) targetSlug = 'chateau-brulaire';
      else if (/corbe/i.test(file)) targetSlug = 'chateau-corbe';
      else if (/domaine/i.test(file)) targetSlug = 'domaine-nantais';
      else if (/dome|dôme/i.test(file)) targetSlug = 'le-dome';
      else if (/manoir|boulaie/i.test(file)) targetSlug = 'manoir-boulaie';
      
      if (targetSlug) {
        const source = path.join(mariagesGalleryPath, file);
        const target = path.join(TARGET_BASE, targetSlug, 'mariages', file.toLowerCase());
        copyFile(source, target);
      } else {
        console.log(`   ⚠️  Impossible de déterminer le lieu: ${file}`);
      }
    });
  }
}

/**
 * Traite les photos d'en-tête (hero images)
 */
function processHeroPhotos() {
  console.log('\n🎨 Traitement des photos d\'en-tête...');
  
  const heroPath = path.join(SOURCE_DIR, 'EN-TÊTE SITE INTERNET');
  if (!fs.existsSync(heroPath)) {
    console.log('   ⚠️  Pas de dossier EN-TÊTE SITE INTERNET');
    return;
  }
  
  const files = fs.readdirSync(heroPath);
  
  files.forEach(file => {
    if (!/\.(jpg|jpeg|png)$/i.test(file)) return;
    
    // Détecter le lieu depuis le nom du fichier
    let targetSlug = null;
    if (/brulaire|brûlaire/i.test(file)) targetSlug = 'chateau-brulaire';
    else if (/corbe/i.test(file)) targetSlug = 'chateau-corbe';
    else if (/domaine/i.test(file)) targetSlug = 'domaine-nantais';
    else if (/dome|dôme/i.test(file)) targetSlug = 'le-dome';
    else if (/manoir|boulaie/i.test(file)) targetSlug = 'manoir-boulaie';
    
    if (targetSlug) {
      const source = path.join(heroPath, file);
      const ext = path.extname(file);
      const target = path.join(TARGET_BASE, targetSlug, `hero${ext.toLowerCase()}`);
      copyFile(source, target);
    } else {
      console.log(`   ⚠️  Impossible de déterminer le lieu: ${file}`);
    }
  });
}

/**
 * Génère un rapport de synthèse
 */
function generateReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 RAPPORT DE SYNTHÈSE');
  console.log('='.repeat(60));
  
  Object.values(VENUE_MAPPING).forEach(slug => {
    const venuePath = path.join(TARGET_BASE, slug);
    if (!fs.existsSync(venuePath)) {
      console.log(`\n❌ ${slug}: Dossier non créé`);
      return;
    }
    
    const countPhotosInDir = (dir) => {
      if (!fs.existsSync(dir)) return 0;
      return fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png)$/i.test(f)).length;
    };
    
    const heroCount = fs.existsSync(path.join(venuePath, 'hero.jpg')) ||
                      fs.existsSync(path.join(venuePath, 'hero.jpeg')) ||
                      fs.existsSync(path.join(venuePath, 'hero.png')) ? 1 : 0;
    const b2bCount = countPhotosInDir(path.join(venuePath, 'b2b'));
    const mariagesCount = countPhotosInDir(path.join(venuePath, 'mariages'));
    const galleryCount = countPhotosInDir(path.join(venuePath, 'gallery'));
    const total = heroCount + b2bCount + mariagesCount + galleryCount;
    
    console.log(`\n🏰 ${slug.toUpperCase()}`);
    console.log(`   Hero: ${heroCount} photo${heroCount > 1 ? 's' : ''}`);
    console.log(`   B2B: ${b2bCount} photo${b2bCount > 1 ? 's' : ''}`);
    console.log(`   Mariages: ${mariagesCount} photo${mariagesCount > 1 ? 's' : ''}`);
    console.log(`   Gallery: ${galleryCount} photo${galleryCount > 1 ? 's' : ''}`);
    console.log(`   TOTAL: ${total} photo${total > 1 ? 's' : ''}`);
  });
  
  console.log('\n' + '='.repeat(60));
}

// Exécution principale
console.log('🚀 Script d\'organisation des photos des lieux');
console.log('='.repeat(60));

// Créer le dossier venues si nécessaire
if (!fs.existsSync(TARGET_BASE)) {
  fs.mkdirSync(TARGET_BASE, { recursive: true });
  console.log(`✅ Créé: ${TARGET_BASE}`);
}

// Traiter chaque lieu
Object.entries(VENUE_MAPPING).forEach(([venueName, slug]) => {
  processVenuePhotos(venueName, slug);
});

// Traiter les galeries générales
processGalleryPhotos();

// Traiter les photos hero
processHeroPhotos();

// Générer le rapport
generateReport();

console.log('\n✅ Organisation terminée !');
console.log(`\n💡 Prochaines étapes :`);
console.log(`   1. Vérifier les photos dans public/venues/`);
console.log(`   2. Choisir les meilleures photos hero pour chaque lieu`);
console.log(`   3. Optimiser les images avec scripts/optimize-images.js`);
console.log(`   4. Mettre à jour Firestore avec les nouveaux chemins d'images`);
