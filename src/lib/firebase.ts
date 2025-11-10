import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

/**
 * Configuration Firebase pour Lieux d'Exception
 * 
 * Projet: lieux-d-exceptions (ID: 886228169873)
 * Organisation: nucom.fr
 * Application: Lieux d'Exception (B2B)
 * Database Firestore: lieuxdexception
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

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

/**
 * Configuration pour l'environnement de développement
 * Connexion à l'émulateur Firestore si disponible en développement
 */
if (process.env.NODE_ENV === 'development') {
  try {
    // Vérifier si l'émulateur n'est pas déjà connecté
    if (!('_delegate' in db) || !(db as any)._delegate._databaseId.database.includes('localhost')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
  } catch (error) {
    // L'émulateur n'est pas disponible, utiliser Firebase en ligne
    console.log('Émulateur Firestore non disponible, utilisation de Firebase en ligne');
  }
}

export default app;