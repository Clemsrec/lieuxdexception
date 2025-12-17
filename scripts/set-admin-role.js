#!/usr/bin/env node

/**
 * Script pour assigner le rôle admin à un utilisateur via Custom Claims
 * Usage: node scripts/set-admin-role.js <uid>
 * 
 * Custom Claims Firebase Auth = Meilleur performance que collection Firestore
 * Le claim admin est accessible dans les Firestore Rules via request.auth.token.admin
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
const db = admin.firestore();

/**
 * Assigne le rôle admin à un utilisateur
 */
async function setAdminRole(uid) {
  try {
    console.log('\n🔐 ASSIGNATION RÔLE ADMIN\n');
    console.log('='.repeat(70));
    
    // Vérifier que l'utilisateur existe
    const user = await auth.getUser(uid);
    console.log(`\n✅ Utilisateur trouvé: ${user.email || user.phoneNumber || 'Pas d\'email'}`);
    console.log(`   UID: ${uid}`);
    
    // Assigner le custom claim admin
    await auth.setCustomUserClaims(uid, { admin: true, role: 'admin' });
    console.log('\n✅ Custom claim "admin: true" assigné avec succès');
    
    // Créer/mettre à jour le document dans la collection users (optionnel, pour backup)
    const userRef = db.collection('users').doc(uid);
    await userRef.set({
      uid: uid,
      email: user.email || null,
      role: 'admin',
      customClaims: { admin: true },
      updatedAt: admin.firestore.Timestamp.now(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log('✅ Document users/{uid} créé/mis à jour dans Firestore');
    
    // Vérifier le claim
    const userRecord = await auth.getUser(uid);
    console.log('\n📋 Custom Claims actuels:', JSON.stringify(userRecord.customClaims, null, 2));
    
    console.log('\n' + '='.repeat(70));
    console.log('\n✅ RÔLE ADMIN ASSIGNÉ AVEC SUCCÈS !');
    console.log('\n⚠️  IMPORTANT: L\'utilisateur doit se déconnecter/reconnecter pour que le claim soit actif\n');
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    process.exit(1);
  }
}

/**
 * Liste tous les admins
 */
async function listAdmins() {
  try {
    console.log('\n👥 LISTE DES ADMINS\n');
    console.log('='.repeat(70));
    
    const listUsersResult = await auth.listUsers(1000);
    const admins = listUsersResult.users.filter(user => user.customClaims?.admin === true);
    
    if (admins.length === 0) {
      console.log('\n⚠️  Aucun admin trouvé');
    } else {
      console.log(`\n✅ ${admins.length} admin(s) trouvé(s):\n`);
      admins.forEach(admin => {
        console.log(`   • ${admin.email || admin.phoneNumber || 'Pas d\'email'}`);
        console.log(`     UID: ${admin.uid}`);
        console.log(`     Claims: ${JSON.stringify(admin.customClaims)}\n`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    process.exit(1);
  }
}

/**
 * Retirer le rôle admin
 */
async function removeAdminRole(uid) {
  try {
    console.log('\n🔓 RETRAIT RÔLE ADMIN\n');
    console.log('='.repeat(70));
    
    // Retirer le custom claim
    await auth.setCustomUserClaims(uid, { admin: false, role: 'user' });
    console.log('\n✅ Custom claim "admin" retiré');
    
    // Mettre à jour Firestore
    const userRef = db.collection('users').doc(uid);
    await userRef.update({
      role: 'user',
      customClaims: { admin: false },
      updatedAt: admin.firestore.Timestamp.now()
    });
    
    console.log('✅ Document users/{uid} mis à jour');
    console.log('\n✅ RÔLE ADMIN RETIRÉ AVEC SUCCÈS !\n');
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    process.exit(1);
  }
}

// CLI
const args = process.argv.slice(2);
const command = args[0];
const uid = args[1];

if (command === 'grant' && uid) {
  setAdminRole(uid).then(() => process.exit(0));
} else if (command === 'revoke' && uid) {
  removeAdminRole(uid).then(() => process.exit(0));
} else if (command === 'list') {
  listAdmins().then(() => process.exit(0));
} else {
  console.log(`
Usage:
  node scripts/set-admin-role.js grant <uid>     Assigner le rôle admin
  node scripts/set-admin-role.js revoke <uid>    Retirer le rôle admin
  node scripts/set-admin-role.js list            Lister tous les admins

Exemple:
  node scripts/set-admin-role.js grant Uj2k2uJQahPawVOzaOkRjtYd89K2
  `);
  process.exit(1);
}
