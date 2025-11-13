import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Configuration Firebase pour Lieux d'Exception
 * 
 * Projet: lieux-d-exceptions (ID: 886228169873)
 * Organisation: nucom.fr
 * Application: Lieux d'Exception (B2B)
 * Database Firestore: lieuxdexception
 * 
 * Note: Firebase App Hosting injecte automatiquement FIREBASE_WEBAPP_CONFIG
 * qui contient la configuration complète client (apiKey, authDomain, etc).
 */

// Récupérer la config depuis FIREBASE_WEBAPP_CONFIG (App Hosting) ou variables d'env
let firebaseConfig;
if (process.env.FIREBASE_WEBAPP_CONFIG) {
  // Environnement Firebase App Hosting - config auto-injectée COMPLÈTE
  firebaseConfig = JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
} else {
  // Environnement local - utiliser les variables d'environnement
  firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

/**
 * Initialiser Firebase seulement s'il n'est pas déjà initialisé
 * Évite les erreurs de double initialisation
 */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

/**
 * Services Firebase exportés
 * - auth: Service d'authentification Firebase
 * - db: Base de données Firestore (lieuxdexception)
 */
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;