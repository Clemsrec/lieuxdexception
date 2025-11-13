import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Configuration Firebase pour Lieux d'Exception
 * 
 * Projet: lieux-d-exceptions (ID: 886228169873)
 * Organisation: nucom.fr
 * Application: Lieux d'Exception (B2B)
 * 
 * Note: Firebase App Hosting injecte automatiquement :
 * - FIREBASE_CONFIG (Admin SDK - côté serveur)
 * - FIREBASE_WEBAPP_CONFIG (Client SDK - côté navigateur)
 */

// Récupérer la config depuis les variables d'environnement
let firebaseConfig;

try {
  // Priorité 1 : FIREBASE_WEBAPP_CONFIG (Firebase App Hosting - client SDK)
  if (process.env.FIREBASE_WEBAPP_CONFIG) {
    firebaseConfig = JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
  }
  // Priorité 2 : FIREBASE_CONFIG (Firebase App Hosting - admin SDK)
  else if (process.env.FIREBASE_CONFIG) {
    firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
  }
  // Priorité 3 : NEXT_PUBLIC_FIREBASE_CONFIG (variable d'env complète)
  else if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
  }
  // Fallback : Variables d'environnement individuelles (dev local)
  else {
    firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
  }
} catch (error) {
  console.error('[Firebase] Erreur parsing config:', error);
  firebaseConfig = {};
}

// Vérifier que la config est valide (au minimum projectId)
const hasValidConfig = firebaseConfig?.projectId || firebaseConfig?.apiKey;

if (!hasValidConfig) {
  console.warn('[Firebase] Config manquante au build. Variables disponibles:', {
    hasWebappConfig: !!process.env.FIREBASE_WEBAPP_CONFIG,
    hasConfig: !!process.env.FIREBASE_CONFIG,
    hasPublicConfig: !!process.env.NEXT_PUBLIC_FIREBASE_CONFIG,
    hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

/**
 * Initialiser Firebase seulement si config valide
 * Évite les erreurs au build quand Firebase n'est pas encore disponible
 */
const app = hasValidConfig && getApps().length === 0 
  ? initializeApp(firebaseConfig) 
  : getApps()[0];

/**
 * Services Firebase exportés
 * - auth: Service d'authentification Firebase (null si pas de config)
 * - db: Base de données Firestore (null si pas de config)
 */
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export default app;