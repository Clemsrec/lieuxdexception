/**
 * Vérification de tokens JWT Firebase
 * 
 * Utilisé pour sécuriser les routes admin et API
 * Vérifie l'authenticité du token et les custom claims (admin)
 */

import { adminAuth } from './firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

/**
 * Vérifie la validité d'un token Firebase ID
 * 
 * @param token - Token JWT Firebase
 * @returns DecodedIdToken avec claims utilisateur
 * @throws Error si token invalide ou expiré
 */
export async function verifyIdToken(token: string): Promise<DecodedIdToken> {
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth non initialisé');
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error: any) {
    // Logs détaillés pour debugging
    console.error('[Security] Token invalide:', {
      error: error.message,
      code: error.code,
    });
    
    // Messages d'erreur explicites
    if (error.code === 'auth/id-token-expired') {
      throw new Error('Token expiré');
    } else if (error.code === 'auth/invalid-id-token') {
      throw new Error('Token invalide');
    } else if (error.code === 'auth/id-token-revoked') {
      throw new Error('Token révoqué');
    }
    
    throw new Error('Authentification échouée');
  }
}

/**
 * Vérifie si un token appartient à un admin
 * 
 * @param token - Token JWT Firebase
 * @returns true si l'utilisateur a le custom claim admin: true
 */
export async function isUserAdmin(token: string): Promise<boolean> {
  try {
    const decodedToken = await verifyIdToken(token);
    
    // Vérifier le custom claim 'admin'
    return decodedToken.admin === true;
  } catch (error) {
    console.error('[Security] Erreur vérification admin:', error);
    return false;
  }
}

/**
 * Vérifie et décode un token avec vérification admin obligatoire
 * 
 * @param token - Token JWT Firebase
 * @returns DecodedIdToken si admin, sinon throw
 * @throws Error si non admin ou token invalide
 */
export async function verifyAdminToken(token: string): Promise<DecodedIdToken> {
  const decodedToken = await verifyIdToken(token);
  
  if (!decodedToken.admin) {
    throw new Error('Droits administrateur requis');
  }
  
  return decodedToken;
}

/**
 * Extrait le token du header Authorization
 * 
 * @param authHeader - Header "Authorization: Bearer <token>"
 * @returns Token sans le préfixe "Bearer ", ou null si invalide
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Enlever "Bearer "
}

/**
 * Interface pour les réponses d'erreur standardisées
 */
export interface AuthErrorResponse {
  error: string;
  code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'TOKEN_EXPIRED' | 'TOKEN_INVALID';
  message: string;
}

/**
 * Génère une réponse d'erreur d'authentification standardisée
 */
export function createAuthErrorResponse(
  error: Error | string,
  status: 401 | 403 = 401
): Response {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  const code = status === 403 ? 'FORBIDDEN' : 
               errorMessage.includes('expiré') ? 'TOKEN_EXPIRED' :
               errorMessage.includes('invalide') ? 'TOKEN_INVALID' :
               'UNAUTHORIZED';
  
  const response: AuthErrorResponse = {
    error: errorMessage,
    code,
    message: status === 403 
      ? 'Droits insuffisants pour accéder à cette ressource'
      : 'Authentification requise',
  };
  
  return Response.json(response, { status });
}
