/**
 * Audit Logger - Traçabilité des actions sensibles
 * 
 * Enregistre toutes les actions admin dans Firestore
 * pour assurer la traçabilité et la conformité (RGPD, sécurité)
 * 
 * Collections Firestore :
 * - audit_logs : Logs de toutes les actions admin
 * - security_logs : Logs de sécurité (tentatives connexion, accès refusés)
 */

import { addDoc, collection, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { adminDb } from '@/lib/firebase-admin';

/**
 * Types d'actions auditables
 */
export enum AuditAction {
  // Lieux
  VENUE_CREATE = 'venue_create',
  VENUE_UPDATE = 'venue_update',
  VENUE_DELETE = 'venue_delete',
  
  // Leads
  LEAD_UPDATE = 'lead_update',
  LEAD_DELETE = 'lead_delete',
  LEAD_EXPORT = 'lead_export',
  
  // Utilisateurs
  USER_CREATE = 'user_create',
  USER_UPDATE = 'user_update',
  USER_DELETE = 'user_delete',
  USER_GRANT_ADMIN = 'user_grant_admin',
  USER_REVOKE_ADMIN = 'user_revoke_admin',
  
  // Paramètres
  SETTINGS_UPDATE = 'settings_update',
  
  // Sécurité
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  LOGOUT = 'logout',
  ACCESS_DENIED = 'access_denied',
  
  // Système
  FIRESTORE_RULES_UPDATE = 'firestore_rules_update',
  BULK_OPERATION = 'bulk_operation',
}

/**
 * Niveaux de sévérité
 */
export enum AuditSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Interface pour un log d'audit
 */
export interface AuditLog {
  action: AuditAction;
  userId: string;
  userEmail: string;
  timestamp: Timestamp | ReturnType<typeof serverTimestamp>;
  severity: AuditSeverity;
  resourceType: string; // 'venue', 'lead', 'user', etc.
  resourceId?: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  before?: any; // État avant modification
  after?: any; // État après modification
}

/**
 * Logger une action admin dans Firestore (client-side)
 */
export async function logAuditAction(params: {
  action: AuditAction;
  userId: string;
  userEmail: string;
  severity?: AuditSeverity;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
  before?: any;
  after?: any;
}): Promise<string | null> {
  if (!db) {
    console.warn('[Audit] Firestore client non initialisé');
    return null;
  }

  try {
    const auditLog: AuditLog = {
      action: params.action,
      userId: params.userId,
      userEmail: params.userEmail,
      timestamp: Timestamp.now(),
      severity: params.severity || AuditSeverity.INFO,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      details: params.details,
      before: params.before,
      after: params.after,
    };

    const docRef = await addDoc(collection(db, 'audit_logs'), auditLog);
    
    console.log(`[Audit] ✅ ${params.action} loggé: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('[Audit] ❌ Erreur logging:', error);
    return null;
  }
}

/**
 * Logger une action admin depuis le serveur (API routes)
 * Utilise Firebase Admin SDK
 */
export async function logAuditActionServer(params: {
  action: AuditAction;
  userId: string;
  userEmail: string;
  severity?: AuditSeverity;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  before?: any;
  after?: any;
}): Promise<string | null> {
  if (!adminDb) {
    console.warn('[Audit] Firebase Admin non initialisé');
    return null;
  }

  try {
    const auditLog = {
      action: params.action,
      userId: params.userId,
      userEmail: params.userEmail,
      timestamp: serverTimestamp(),
      severity: params.severity || AuditSeverity.INFO,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      details: params.details,
      ip: params.ip,
      userAgent: params.userAgent,
      before: params.before,
      after: params.after,
    };

    const docRef = await adminDb.collection('audit_logs').add(auditLog);
    
    console.log(`[Audit] ✅ ${params.action} loggé (server): ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('[Audit] ❌ Erreur logging server:', error);
    return null;
  }
}

/**
 * Logger un événement de sécurité
 */
export async function logSecurityEvent(params: {
  type: 'failed_login' | 'brute_force' | 'unauthorized_access' | 'token_expired';
  email?: string;
  ip: string;
  userAgent?: string;
  severity: AuditSeverity;
  details?: Record<string, any>;
}): Promise<string | null> {
  if (!db) {
    console.warn('[Security] Firestore client non initialisé');
    return null;
  }

  try {
    const securityLog = {
      type: params.type,
      email: params.email,
      ip: params.ip,
      userAgent: params.userAgent,
      severity: params.severity,
      timestamp: Timestamp.now(),
      details: params.details,
    };

    const docRef = await addDoc(collection(db, 'security_logs'), securityLog);
    
    console.log(`[Security] ✅ ${params.type} loggé: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('[Security] ❌ Erreur logging:', error);
    return null;
  }
}

/**
 * Helper pour comparer avant/après et générer un diff
 */
export function generateDiff(before: any, after: any): Record<string, { before: any; after: any }> {
  const diff: Record<string, { before: any; after: any }> = {};

  // Parcourir les clés de l'objet "after"
  for (const key in after) {
    if (JSON.stringify(before?.[key]) !== JSON.stringify(after[key])) {
      diff[key] = {
        before: before?.[key],
        after: after[key],
      };
    }
  }

  // Vérifier les clés supprimées
  for (const key in before) {
    if (!(key in after)) {
      diff[key] = {
        before: before[key],
        after: undefined,
      };
    }
  }

  return diff;
}

/**
 * Hook React pour logger automatiquement les actions utilisateur
 * À utiliser dans les composants admin
 */
export function useAuditLog() {
  // Note: useAuth() est un hook client-side, pas utilisable côté serveur
  // Pour les logs d'audit, utiliser directement logAuditAction() avec les infos de session
  const logAction = async (params: {
    action: AuditAction;
    resourceType: string;
    resourceId?: string;
    details?: Record<string, any>;
  }) => {
    // Les infos utilisateur doivent être passées par l'appelant
    // (depuis le contexte d'auth côté client ou token JWT côté serveur)
    console.warn('useAuditLog: userId et userEmail doivent être fournis par l\'appelant');
    
    return logAuditAction({
      userId: 'anonymous',
      userEmail: 'system@lieuxdexception.com',
      ...params,
    });
  };

  return { logAction };
}

/**
 * Exemples d'utilisation
 */

// Exemple 1 : Logger la création d'un lieu
/*
await logAuditAction({
  action: AuditAction.VENUE_CREATE,
  userId: currentUser.uid,
  userEmail: currentUser.email,
  severity: AuditSeverity.INFO,
  resourceType: 'venue',
  resourceId: newVenue.id,
  details: {
    venueName: newVenue.name,
    location: newVenue.location,
  },
  after: newVenue,
});
*/

// Exemple 2 : Logger la modification d'un lead
/*
const diff = generateDiff(oldLead, updatedLead);

await logAuditAction({
  action: AuditAction.LEAD_UPDATE,
  userId: currentUser.uid,
  userEmail: currentUser.email,
  resourceType: 'lead',
  resourceId: leadId,
  details: {
    fieldsChanged: Object.keys(diff),
  },
  before: oldLead,
  after: updatedLead,
});
*/

// Exemple 3 : Logger tentative de connexion échouée
/*
await logSecurityEvent({
  type: 'failed_login',
  email: attemptedEmail,
  ip: userIp,
  userAgent: request.headers.get('user-agent'),
  severity: AuditSeverity.WARNING,
  details: {
    attempts: failedAttempts,
    reason: 'invalid_credentials',
  },
});
*/
