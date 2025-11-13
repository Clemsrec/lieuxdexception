import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Firebase Admin SDK pour Lieux d'Exception
 * 
 * Utilisé côté serveur uniquement :
 * - Server Components
 * - API Routes
 * - Server Actions
 * 
 * Firebase App Hosting injecte automatiquement FIREBASE_CONFIG
 * qui contient le projectId et les credentials nécessaires.
 * 
 * Documentation: https://firebase.google.com/docs/admin/setup
 */

let adminApp: App | null = null;

function initializeAdminApp() {
  // Éviter la double initialisation
  if (getApps().length > 0) {
    return getApps()[0];
  }

  try {
    // En production (Firebase App Hosting), FIREBASE_CONFIG est auto-injecté
    if (process.env.FIREBASE_CONFIG) {
      const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
      
      console.log('[Firebase Admin] Initialisation avec FIREBASE_CONFIG auto-injecté');
      
      // Firebase App Hosting configure automatiquement les credentials ADC
      // (Application Default Credentials) - pas besoin de service account JSON
      return initializeApp({
        projectId: firebaseConfig.projectId,
        storageBucket: firebaseConfig.storageBucket,
        databaseURL: firebaseConfig.databaseURL,
      });
    }
    
    // En développement local, utiliser le service account
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      console.log('[Firebase Admin] Initialisation avec FIREBASE_SERVICE_ACCOUNT');
      
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
        storageBucket: `${serviceAccount.project_id}.appspot.com`,
      });
    }
    
    // Fallback : Initialisation avec projectId seulement (nécessite ADC configuré)
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.log('[Firebase Admin] Initialisation avec projectId uniquement (ADC)');
      
      return initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }

    throw new Error('Firebase Admin: Aucune configuration trouvée');
    
  } catch (error) {
    console.error('[Firebase Admin] ❌ Erreur d\'initialisation:', error);
    throw error;
  }
}

// Initialiser l'app
try {
  adminApp = initializeAdminApp();
  console.log('[Firebase Admin] ✅ Initialisé avec succès');
} catch (error) {
  console.error('[Firebase Admin] Configuration manquante:', {
    hasFirebaseConfig: !!process.env.FIREBASE_CONFIG,
    hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT,
    hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    nodeEnv: process.env.NODE_ENV,
  });
}

/**
 * Services Firebase Admin exportés
 * Utiliser uniquement côté serveur !
 */
export const adminAuth = adminApp ? getAuth(adminApp) : null;
export const adminDb = adminApp ? getFirestore(adminApp) : null;

export { adminApp };

/**
 * Fonction utilitaire pour vérifier que Firebase Admin est initialisé
 */
export function ensureAdminInitialized() {
  if (!adminApp || !adminAuth || !adminDb) {
    throw new Error(
      'Firebase Admin non initialisé. Vérifier FIREBASE_CONFIG ou FIREBASE_SERVICE_ACCOUNT'
    );
  }
  return { adminApp, adminAuth, adminDb };
}
