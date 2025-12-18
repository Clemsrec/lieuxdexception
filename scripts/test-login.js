/**
 * Script pour tester la connexion Firebase Auth
 */

const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyBpSVfonXBg3NGJGGwRg5IHFLv8ukdDOfg",
  authDomain: "lieux-d-exceptions.firebaseapp.com",
  projectId: "lieux-d-exceptions",
  storageBucket: "lieux-d-exceptions.appspot.com",
  messagingSenderId: "886228169873",
  appId: "1:886228169873:web:f3ae5c3d0d2c9f6e8b4a1e",
  measurementId: "G-0ZM7ZL3PYB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testLogin(email, password) {
  try {
    console.log('🔐 Test de connexion...');
    console.log(`   Email: ${email}`);
    console.log(`   Mot de passe: ${'*'.repeat(password.length)}\n`);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Connexion réussie!');
    console.log(`   UID: ${user.uid}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Email vérifié: ${user.emailVerified}\n`);
    
    // Récupérer le token avec claims
    const idTokenResult = await user.getIdTokenResult();
    console.log('🔑 Custom Claims:');
    console.log(`   Admin: ${idTokenResult.claims.admin || false}`);
    console.log(`   Role: ${idTokenResult.claims.role || 'aucun'}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur de connexion:');
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}\n`);
    
    // Suggestions selon l'erreur
    if (error.code === 'auth/invalid-credential') {
      console.log('💡 Suggestions:');
      console.log('   - Vérifiez que le mot de passe est correct');
      console.log('   - Utilisez: node scripts/update-user-password.js <uid> <nouveauMDP>');
    } else if (error.code === 'auth/too-many-requests') {
      console.log('💡 Compte temporairement verrouillé. Attendez quelques minutes.');
    }
    
    process.exit(1);
  }
}

const email = process.argv[2] || 'clement@nucom.fr';
const password = process.argv[3] || 'AdminLieux2024';

testLogin(email, password);
