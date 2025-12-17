/**
 * Firebase Cloud Messaging (FCM) - Gestion des notifications push
 * ID de l'expéditeur : 886228169873
 * Utilise l'API V1 (recommandée)
 */

import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';
import { app } from './firebase-client';

let messaging: Messaging | null = null;

/**
 * Initialise Firebase Cloud Messaging
 * À appeler côté client uniquement
 */
export function initMessaging() {
  if (typeof window === 'undefined') {
    console.warn('FCM: Impossible d\'initialiser côté serveur');
    return null;
  }

  if (!messaging) {
    try {
      if (!app) {
        console.error('❌ Firebase app non initialisée');
        return null;
      }
      messaging = getMessaging(app);
      console.log('✅ FCM initialisé avec succès');
    } catch (error) {
      console.error('❌ Erreur initialisation FCM:', error);
    }
  }

  return messaging;
}

/**
 * Demande la permission notifications et récupère le token FCM
 * @returns Token FCM ou null si refusé/erreur
 */
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    // Vérifier si les notifications sont supportées
    if (!('Notification' in window)) {
      console.warn('⚠️ Notifications non supportées par ce navigateur');
      return null;
    }

    // Demander la permission
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.log('🚫 Permission notifications refusée');
      return null;
    }

    // Récupérer le token FCM
    const messagingInstance = initMessaging();
    if (!messagingInstance) return null;

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error('❌ NEXT_PUBLIC_FIREBASE_VAPID_KEY manquant dans .env.local');
      return null;
    }

    const token = await getToken(messagingInstance, { vapidKey });
    
    if (token) {
      console.log('✅ Token FCM obtenu:', token.substring(0, 20) + '...');
      // TODO: Sauvegarder le token en base Firestore (collection fcm_tokens)
      await saveFCMToken(token);
      return token;
    } else {
      console.warn('⚠️ Impossible de récupérer le token FCM');
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur demande permission notifications:', error);
    return null;
  }
}

/**
 * Sauvegarde le token FCM en base Firestore
 * Permet d'envoyer des notifications ciblées aux admins
 */
async function saveFCMToken(token: string): Promise<void> {
  try {
    // TODO: Implémenter sauvegarde en Firestore
    // Collection: fcm_tokens
    // Document: { token, userId, deviceInfo, createdAt, lastUsed }
    console.log('💾 Token FCM à sauvegarder:', token.substring(0, 20) + '...');
  } catch (error) {
    console.error('❌ Erreur sauvegarde token FCM:', error);
  }
}

/**
 * Écoute les messages FCM en temps réel (foreground)
 * Affiche les notifications quand l'app est ouverte
 */
export function listenToMessages(
  onMessageReceived: (payload: any) => void
): (() => void) | null {
  const messagingInstance = initMessaging();
  if (!messagingInstance) return null;

  const unsubscribe = onMessage(messagingInstance, (payload) => {
    console.log('📬 Nouveau message FCM reçu:', payload);
    
    // Afficher notification navigateur
    if (payload.notification) {
      const { title, body, icon } = payload.notification;
      new Notification(title || 'Lieux d\'Exception', {
        body: body || '',
        icon: icon || '/logo/Logo_CLE_seule.png',
        badge: '/logo/Logo_CLE_seule.png',
        tag: 'lieuxdexception-admin',
        requireInteraction: true, // Reste affichée jusqu'au clic
      });
    }

    // Callback custom
    onMessageReceived(payload);
  });

  return unsubscribe;
}

/**
 * Types de notifications supportées
 */
export enum NotificationType {
  NEW_LEAD = 'new_lead',           // Nouveau lead B2B/Mariage
  LEAD_UPDATE = 'lead_update',     // Lead mis à jour
  SYSTEM_ALERT = 'system_alert',   // Alerte système
}

/**
 * Payload notification standardisé
 */
export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  icon?: string;
  clickAction?: string; // URL de redirection au clic
}

/**
 * Envoie une notification à un token spécifique (côté serveur)
 * À utiliser dans les API routes avec Firebase Admin SDK
 */
export async function sendNotificationToToken(
  token: string,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    // TODO: Implémenter avec Firebase Admin SDK dans une API route
    // POST /api/notifications/send
    console.log('📤 Envoi notification au token:', token.substring(0, 20) + '...');
    console.log('📦 Payload:', payload);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi notification:', error);
    return false;
  }
}

/**
 * Vérifie si les notifications sont activées
 */
export function areNotificationsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  if (!('Notification' in window)) return false;
  return Notification.permission === 'granted';
}

/**
 * Récupère le statut des permissions notifications
 */
export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined') return 'denied';
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}
