/**
 * Script pour mettre à jour le mot de passe d'un utilisateur Firebase
 * Usage: node scripts/update-user-password.js <userId> <newPassword>
 */

const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('../firebase-service-account.json');

const app = initializeApp({ 
  credential: require('firebase-admin').credential.cert(serviceAccount) 
});
const auth = getAuth(app);

async function updateUserPassword(userId, newPassword) {
  try {
    // Validation
    if (!userId) {
      console.error('❌ Erreur: userId requis');
      console.log('\nUsage: node scripts/update-user-password.js <userId> <newPassword>');
      process.exit(1);
    }

    if (!newPassword) {
      console.error('❌ Erreur: nouveau mot de passe requis');
      console.log('\nUsage: node scripts/update-user-password.js <userId> <newPassword>');
      process.exit(1);
    }

    if (newPassword.length < 6) {
      console.error('❌ Erreur: le mot de passe doit contenir au moins 6 caractères');
      process.exit(1);
    }

    console.log('🔍 Récupération utilisateur...');
    
    // Récupérer l'utilisateur
    const user = await auth.getUser(userId);
    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Display Name: ${user.displayName || 'Non défini'}`);
    
    // Mettre à jour le mot de passe
    console.log('\n🔄 Mise à jour du mot de passe...');
    await auth.updateUser(userId, {
      password: newPassword
    });
    
    console.log('✅ Mot de passe mis à jour avec succès!');
    console.log('\n📝 Informations de connexion:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Nouveau mot de passe: ${newPassword}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.code === 'auth/user-not-found') {
      console.error('   → Utilisateur non trouvé avec cet UID');
    }
    process.exit(1);
  }
}

// Récupérer les arguments
const userId = process.argv[2];
const newPassword = process.argv[3];

updateUserPassword(userId, newPassword);
