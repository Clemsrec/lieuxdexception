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
      // Sauvegarder le token en Firestore pour envoi de notifications
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
    const { db } = await import('./firebase-client');
    if (!db) {
      console.warn('⚠️ Firestore non disponible pour sauvegarde token FCM');
      return;
    }

    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    
    // Utiliser le token comme ID de document (évite les doublons)
    const tokenDoc = doc(db, 'fcm_tokens', token);
    
    await setDoc(tokenDoc, {
      token,
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      },
      createdAt: serverTimestamp(),
      lastUsed: serverTimestamp(),
    }, { merge: true }); // merge: true pour mettre à jour lastUsed si existe
    
    console.log('💾 Token FCM sauvegardé dans Firestore');
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
 * Envoie une notification à un token spécifique
 * Cette fonction appelle l'API route qui utilise Firebase Admin SDK
 */
export async function sendNotificationToToken(
  token: string,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tokens: [token],
        notification: {
          title: payload.title,
          body: payload.body,
          icon: payload.icon,
        },
        data: payload.data,
      }),
    });

    const result = await response.json();
    console.log('📤 Notification envoyée:', result);
    return result.success;
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
