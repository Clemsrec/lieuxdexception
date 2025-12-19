const admin = require('firebase-admin');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const https = require('https');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'lieux-d-exceptions.firebasestorage.app'
  });
}

const bucket = admin.storage().bucket();

/**
 * Télécharge une image depuis une URL
 */
function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(outputPath);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

/**
 * Optimise une image logo
 */
async function optimizeLogo(inputPath, outputPath, targetWidth = 400) {
  const inputStats = fs.statSync(inputPath);
  console.log(`   📏 Taille actuelle: ${(inputStats.size / 1024).toFixed(1)} KB`);

  await sharp(inputPath)
    .resize(targetWidth, null, {
      withoutEnlargement: true,
      fit: 'inside'
    })
    .png({
      quality: 90,
      compressionLevel: 9,
      progressive: true
    })
    .toFile(outputPath);

  const outputStats = fs.statSync(outputPath);
  const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
  
  console.log(`   ✅ Nouvelle taille: ${(outputStats.size / 1024).toFixed(1)} KB (${savings}% d'économie)`);

  return {
    originalSize: inputStats.size,
    optimizedSize: outputStats.size,
    savings: parseFloat(savings)
  };
}

async function main() {
  console.log('🎨 Optimisation des logos Firebase Storage\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const tmpDir = path.join(__dirname, '../tmp-logos');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const logos = [
    { 
      storagePath: 'logos/venues/boulaie-blanc.png',
      url: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/logos%2Fvenues%2Fboulaie-blanc.png?alt=media',
      targetWidth: 400
    },
    { 
      storagePath: 'logos/venues/brulaire-blanc.png',
      url: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/logos%2Fvenues%2Fbrulaire-blanc.png?alt=media',
      targetWidth: 400
    },
    { 
      storagePath: 'logos/logo-lieux-exception-blanc.png',
      localPath: path.join(__dirname, '../public/logos/logo-lieux-exception-blanc-optimized.png'),
      targetWidth: 800
    }
  ];

  const results = [];

  for (const logo of logos) {
    console.log(`\n🔧 Traitement: ${path.basename(logo.storagePath)}`);
    
    try {
      let inputPath;
      
      // Si logo déjà optimisé localement (logo principal)
      if (logo.localPath) {
        inputPath = logo.localPath;
        console.log(`   📂 Utilisation locale: ${path.basename(inputPath)}`);
      } else {
        // Télécharger depuis Firebase Storage
        inputPath = path.join(tmpDir, path.basename(logo.storagePath));
        console.log(`   📥 Téléchargement...`);
        await downloadImage(logo.url, inputPath);
      }

      const outputPath = path.join(tmpDir, `optimized-${path.basename(logo.storagePath)}`);
      
      // Optimiser (sauf si déjà optimisé localement)
      if (!logo.localPath) {
        await optimizeLogo(inputPath, outputPath, logo.targetWidth);
      } else {
        // Copier le fichier déjà optimisé
        fs.copyFileSync(inputPath, outputPath);
        const stats = fs.statSync(outputPath);
        console.log(`   ✅ Déjà optimisé: ${(stats.size / 1024).toFixed(1)} KB`);
      }

      // Upload vers Firebase Storage
      console.log(`   ☁️  Upload vers Firebase Storage...`);
      await bucket.upload(outputPath, {
        destination: logo.storagePath,
        metadata: {
          contentType: 'image/png',
          cacheControl: 'public, max-age=31536000', // 1 an
        }
      });

      console.log(`   ✅ Upload terminé: ${logo.storagePath}`);

      // Supprimer fichiers temporaires
      if (!logo.localPath) fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);

      const stats = fs.statSync(logo.localPath || outputPath);
      results.push({
        name: path.basename(logo.storagePath),
        size: stats.size
      });

    } catch (error) {
      console.error(`   ❌ Erreur: ${error.message}`);
    }
  }

  // Nettoyer dossier temporaire
  if (fs.existsSync(tmpDir)) {
    fs.rmdirSync(tmpDir, { recursive: true });
  }

  console.log('\n\n📊 RÉSUMÉ');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ ${results.length} logos optimisés et uploadés sur Firebase Storage`);
  
  results.forEach(r => {
    console.log(`   • ${r.name}: ${(r.size / 1024).toFixed(1)} KB`);
  });

  console.log('\n✨ Les logos optimisés sont maintenant servis depuis Firebase Storage');
  console.log('⚡️ Cache activé: 1 an (max-age=31536000)\n');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
