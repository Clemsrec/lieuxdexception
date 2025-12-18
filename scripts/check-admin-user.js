/**
 * Script pour vérifier et configurer complètement un utilisateur admin
 * Vérifie Firebase Auth + Firestore + Custom Claims
 */

const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('../firebase-service-account.json');

const app = initializeApp({ 
  credential: require('firebase-admin').credential.cert(serviceAccount) 
});
const auth = getAuth(app);
const db = getFirestore(app);

async function checkAndFixAdmin(userId) {
  try {
    console.log('🔍 Vérification complète de l\'utilisateur...\n');
    
    // 1. Vérifier Firebase Auth
    console.log('📧 Firebase Auth:');
    const user = await auth.getUser(userId);
    console.log(`   Email: ${user.email}`);
    console.log(`   Email vérifié: ${user.emailVerified}`);
    console.log(`   Display Name: ${user.displayName || 'Non défini'}`);
    console.log(`   Désactivé: ${user.disabled}`);
    
    // 2. Vérifier Custom Claims
    console.log('\n🔑 Custom Claims:');
    const customClaims = user.customClaims || {};
    console.log(`   Admin: ${customClaims.admin || false}`);
    console.log(`   Role: ${customClaims.role || 'aucun'}`);
    
    // 3. Vérifier Firestore
    console.log('\n💾 Firestore:');
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log(`   Document existe: Oui`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Role: ${userData.role}`);
      console.log(`   Prénom: ${userData.firstName || 'Non défini'}`);
      console.log(`   Nom: ${userData.lastName || 'Non défini'}`);
    } else {
      console.log(`   Document existe: Non`);
    }
    
    // 4. Corriger si nécessaire
    console.log('\n🔧 Corrections nécessaires:');
    let needsFix = false;
    
    // Vérifier custom claims
    if (!customClaims.admin || customClaims.role !== 'admin') {
      console.log('   → Définir custom claims admin');
      await auth.setCustomUserClaims(userId, { admin: true, role: 'admin' });
      needsFix = true;
    }
    
    // Vérifier document Firestore
    if (!userDoc.exists) {
      console.log('   → Créer document Firestore');
      await db.collection('users').doc(userId).set({
        email: user.email,
        firstName: 'Admin',
        lastName: 'Lieux d\'Exception',
        role: 'admin',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      needsFix = true;
    } else {
      const userData = userDoc.data();
      if (userData.role !== 'admin') {
        console.log('   → Mettre à jour role Firestore');
        await db.collection('users').doc(userId).update({
          role: 'admin',
          updatedAt: FieldValue.serverTimestamp(),
        });
        needsFix = true;
      }
    }
    
    if (needsFix) {
      console.log('\n✅ Corrections appliquées!');
      console.log('\n⚠️  IMPORTANT: L\'utilisateur doit se déconnecter et se reconnecter');
      console.log('   pour que les custom claims soient pris en compte.\n');
    } else {
      console.log('   Aucune correction nécessaire\n');
    }
    
    // 5. Résumé final
    console.log('📋 Résumé de connexion:');
    console.log(`   URL: https://lieuxdexception.com/admin/connexion`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Mot de passe: (celui que vous avez défini)`);
    console.log(`   Status: ${needsFix ? 'Corrigé - Déconnectez-vous et reconnectez-vous' : 'OK'}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

const userId = process.argv[2] || 'Uj2k2uJQahPawVOzaOkRjtYd89K2';
checkAndFixAdmin(userId);
