#!/usr/bin/env node

/**
 * Script pour réinitialiser le mot de passe d'un utilisateur Firebase
 * Usage: 
 *   node scripts/reset-password.js <email> <nouveau-mot-de-passe>
 *   node scripts/reset-password.js <email> --send-link (envoie un email)
 * 
 * Utilise Firebase Admin SDK pour bypass les règles de sécurité
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialiser Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieuxdexception.firebaseio.com'
  });
}

const auth = admin.auth();

/**
 * Définir un nouveau mot de passe directement
 */
async function setPassword(email, newPassword) {
  try {
    console.log('\n🔑 RÉINITIALISATION MOT DE PASSE\n');
    console.log('='.repeat(70));
    
    // Récupérer l'utilisateur par email
    const user = await auth.getUserByEmail(email);
    console.log(`\n✅ Utilisateur trouvé: ${user.email}`);
    console.log(`   UID: ${user.uid}`);
    
    // Validation du mot de passe
    if (newPassword.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères');
    }
    
    // Définir le nouveau mot de passe
    await auth.updateUser(user.uid, {
      password: newPassword
    });
    
    console.log('\n✅ MOT DE PASSE MIS À JOUR AVEC SUCCÈS !');
    console.log(`\nVous pouvez maintenant vous connecter avec :`);
    console.log(`   Email: ${email}`);
    console.log(`   Mot de passe: ${newPassword}`);
    console.log('\n💡 Recommandation: Changez ce mot de passe après la première connexion\n');
    console.log('='.repeat(70) + '\n');
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    process.exit(1);
  }
}

/**
 * Générer un lien de réinitialisation de mot de passe
 */
async function sendPasswordResetLink(email) {
  try {
    console.log('\n📧 ENVOI LIEN DE RÉINITIALISATION\n');
    console.log('='.repeat(70));
    
    // Vérifier que l'utilisateur existe
    const user = await auth.getUserByEmail(email);
    console.log(`\n✅ Utilisateur trouvé: ${user.email}`);
    console.log(`   UID: ${user.uid}`);
    
    // Générer le lien de réinitialisation
    const link = await auth.generatePasswordResetLink(email);
    
    console.log('\n✅ LIEN DE RÉINITIALISATION GÉNÉRÉ !\n');
    console.log('🔗 Copiez ce lien et ouvrez-le dans votre navigateur :\n');
    console.log(link);
    console.log('\n💡 Ce lien expire dans 1 heure');
    console.log('\n='.repeat(70) + '\n');
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    process.exit(1);
  }
}

// CLI
const args = process.argv.slice(2);
const email = args[0];
const passwordOrFlag = args[1];

if (!email) {
  console.log(`
Usage:
  # Définir un mot de passe directement
  node scripts/reset-password.js <email> <nouveau-mot-de-passe>
  
  # Générer un lien de réinitialisation (recommandé)
  node scripts/reset-password.js <email> --send-link

Exemples:
  node scripts/reset-password.js clement@nucom.fr MonNouveauMotDePasse123!
  node scripts/reset-password.js clement@nucom.fr --send-link
  `);
  process.exit(1);
}

if (passwordOrFlag === '--send-link') {
  sendPasswordResetLink(email).then(() => process.exit(0));
} else if (passwordOrFlag) {
  setPassword(email, passwordOrFlag).then(() => process.exit(0));
} else {
  console.error('\n❌ ERREUR: Veuillez fournir un mot de passe ou --send-link\n');
  process.exit(1);
}
