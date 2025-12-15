/**
 * Script pour définir les custom claims admin sur les utilisateurs Firebase
 * 
 * Utilisation :
 * npx tsx scripts/set-admin-claims.ts
 * 
 * SÉCURITÉ : Ce script nécessite les credentials Firebase Admin
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Initialiser Firebase Admin SDK
 */
function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  try {
    // Charger le service account depuis le fichier JSON
    const serviceAccountPath = path.resolve(__dirname, '../firebase-service-account.json');
    
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Service account introuvable: ${serviceAccountPath}`);
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    return initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
  } catch (error) {
    console.error('❌ Erreur initialisation Firebase Admin:', error);
    process.exit(1);
  }
}

/**
 * Définir le custom claim 'admin: true' sur un utilisateur
 */
async function setAdminClaim(email: string) {
  const auth = getAuth();

  try {
    // Récupérer l'utilisateur par email
    const user = await auth.getUserByEmail(email);

    // Définir les custom claims
    await auth.setCustomUserClaims(user.uid, {
      admin: true,
      role: 'admin',
      grantedAt: new Date().toISOString(),
    });

    console.log(`✅ ${email} est maintenant administrateur`);
    console.log(`   UID: ${user.uid}`);
    console.log(`   Custom claims: { admin: true, role: 'admin' }`);

    return user;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ Utilisateur introuvable: ${email}`);
      console.log(`   💡 Créez d'abord l'utilisateur avec /api/admin/create-first-user`);
    } else {
      console.error(`❌ Erreur pour ${email}:`, error.message);
    }
    return null;
  }
}

/**
 * Retirer le custom claim admin d'un utilisateur
 */
async function removeAdminClaim(email: string) {
  const auth = getAuth();

  try {
    const user = await auth.getUserByEmail(email);

    // Retirer les claims admin
    await auth.setCustomUserClaims(user.uid, {
      admin: false,
      role: 'user',
      revokedAt: new Date().toISOString(),
    });

    console.log(`🔴 Droits admin retirés pour ${email}`);
    return user;
  } catch (error: any) {
    console.error(`❌ Erreur pour ${email}:`, error.message);
    return null;
  }
}

/**
 * Lister tous les utilisateurs avec leurs claims
 */
async function listAllUsers() {
  const auth = getAuth();

  try {
    const listUsersResult = await auth.listUsers(100);

    console.log('\n📋 Liste des utilisateurs :\n');
    console.log('─'.repeat(80));

    listUsersResult.users.forEach((user) => {
      const isAdmin = user.customClaims?.admin === true;
      const statusIcon = isAdmin ? '🔐 ADMIN' : '👤 USER';

      console.log(`${statusIcon} ${user.email || 'Pas d\'email'}`);
      console.log(`   UID: ${user.uid}`);
      console.log(`   Créé: ${user.metadata.creationTime}`);
      if (user.customClaims) {
        console.log(`   Claims:`, JSON.stringify(user.customClaims, null, 2));
      }
      console.log('─'.repeat(80));
    });

    console.log(`\n✅ Total: ${listUsersResult.users.length} utilisateur(s)\n`);
  } catch (error: any) {
    console.error('❌ Erreur listage utilisateurs:', error.message);
  }
}

/**
 * Main - Exécution du script
 */
async function main() {
  console.log('🔥 Firebase Admin - Gestion des Custom Claims\n');

  // Initialiser Firebase Admin
  initializeFirebaseAdmin();

  // Arguments de ligne de commande
  const args = process.argv.slice(2);
  const command = args[0];
  const email = args[1];

  if (command === 'list') {
    // Lister tous les utilisateurs
    await listAllUsers();
  } else if (command === 'grant' && email) {
    // Accorder droits admin
    await setAdminClaim(email);
  } else if (command === 'revoke' && email) {
    // Révoquer droits admin
    await removeAdminClaim(email);
  } else {
    // Aide
    console.log('Usage:');
    console.log('  npx tsx scripts/set-admin-claims.ts list');
    console.log('  npx tsx scripts/set-admin-claims.ts grant <email>');
    console.log('  npx tsx scripts/set-admin-claims.ts revoke <email>');
    console.log('\nExemples:');
    console.log('  npx tsx scripts/set-admin-claims.ts grant admin@grouperiou.com');
    console.log('  npx tsx scripts/set-admin-claims.ts revoke user@example.com');
    console.log('  npx tsx scripts/set-admin-claims.ts list');
    console.log('\n💡 Assurez-vous que firebase-service-account.json existe à la racine\n');
  }
}

// Exécuter le script
main()
  .then(() => {
    console.log('\n✅ Script terminé\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  });
