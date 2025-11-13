import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Firebase Client SDK pour Lieux d'Exception
 * 
 * Utilisé côté client uniquement (navigateur) :
 * - Client Components ('use client')
 * - Authentification utilisateur
 * - Realtime listeners
 * 
 * Firebase App Hosting injecte automatiquement FIREBASE_WEBAPP_CONFIG
 */

let firebaseConfig: any = null;

try {
  if (process.env.NEXT_PUBLIC_FIREBASE_WEBAPP_CONFIG) {
    // Firebase App Hosting - config auto-injectée
    firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_WEBAPP_CONFIG);
    console.log('[Firebase Client] Config depuis FIREBASE_WEBAPP_CONFIG');
  } else if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    // Config JSON complète
    firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
    console.log('[Firebase Client] Config depuis NEXT_PUBLIC_FIREBASE_CONFIG');
  } else {
    // Variables d'env individuelles (dev local)
    firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    console.log('[Firebase Client] Config depuis variables d\'env');
  }
} catch (error) {
  console.error('[Firebase Client] Erreur parsing config:', error);
}

let clientApp: FirebaseApp | null = null;
let clientAuth: Auth | null = null;
let clientDb: Firestore | null = null;

if (firebaseConfig?.projectId && typeof window !== 'undefined') {
  try {
    clientApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    clientAuth = getAuth(clientApp);
    clientDb = getFirestore(clientApp);
    console.log('[Firebase Client] ✅ Initialisé');
  } catch (error) {
    console.error('[Firebase Client] ❌ Erreur:', error);
  }
}

export { clientAuth as auth, clientDb as db, clientApp as app };
export default clientApp;
