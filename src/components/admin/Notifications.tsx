'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { 
  requestNotificationPermission, 
  listenToMessages, 
  getNotificationPermissionStatus,
  areNotificationsEnabled,
  type NotificationPayload 
} from '@/lib/fcm';

/**
 * Hook React pour gérer les notifications FCM
 * Gère automatiquement : permission, token, écoute messages
 */
export function useNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [token, setToken] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);

  // Vérifier support au montage
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true);
      setPermission(getNotificationPermissionStatus());
      setIsEnabled(areNotificationsEnabled());
    }
  }, []);

  // Demander permission
  const requestPermission = async () => {
    const fcmToken = await requestNotificationPermission();
    if (fcmToken) {
      setToken(fcmToken);
      setIsEnabled(true);
      setPermission('granted');
      return fcmToken;
    }
    return null;
  };

  // Écouter les messages (foreground)
  useEffect(() => {
    if (!isEnabled) return;

    const unsubscribe = listenToMessages((payload) => {
      setLastMessage(payload);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isEnabled]);

  return {
    isSupported,
    isEnabled,
    permission,
    token,
    lastMessage,
    requestPermission,
  };
}

/**
 * Composant UI pour activer les notifications
 * Affiche un bouton/banner si pas encore activé
 */
export function NotificationPrompt() {
  const { isSupported, isEnabled, permission, requestPermission } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Ne pas afficher si déjà activé ou non supporté ou dismissé
  if (!isSupported || isEnabled || permission === 'denied' || dismissed) {
    return null;
  }

  const handleEnable = async () => {
    setLoading(true);
    await requestPermission();
    setLoading(false);
  };

  return (
    <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6 flex items-start gap-4">
      {/* Icône cloche */}
      <div className="shrink-0">
        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>

      {/* Contenu */}
      <div className="flex-1">
        <h3 className="font-semibold text-charcoal-900 mb-1">
          Activer les notifications
        </h3>
        <p className="text-sm text-secondary mb-3">
          Recevez des alertes en temps réel pour les nouveaux leads et événements importants.
        </p>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleEnable}
            disabled={loading}
            className="btn btn-primary text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? 'Activation...' : (
              <>
                <Bell className="w-4 h-4" />
                Activer
              </>
            )}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-sm text-secondary hover:text-charcoal-900 px-4 py-2"
          >
            Plus tard
          </button>
        </div>
      </div>

      {/* Bouton fermer */}
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-secondary hover:text-charcoal-900"
        aria-label="Fermer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/**
 * Badge notification (compteur)
 * Affiche le nombre de notifications non lues
 */
export function NotificationBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {count > 9 ? '9+' : count}
    </span>
  );
}

/**
 * Liste de notifications (dropdown)
 * À intégrer dans le header admin
 */
interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  clickAction?: string;
}

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Bouton cloche */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-secondary hover:text-charcoal-900 transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <NotificationBadge count={unreadCount} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-neutral-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <h3 className="font-semibold text-charcoal-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="text-xs text-accent">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Liste */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-secondary">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-sm">Aucune notification</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={async () => {
                    // Marquer comme lu
                    if (!notif.read && user?.uid) {
                      try {
                        await fetch('/api/admin/notifications', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            notificationId: notif.id,
                            userId: user.uid,
                          }),
                        });
                      } catch (error) {
                        console.error('Erreur marquer notification lue:', error);
                      }
                    }
                    
                    // Rediriger si clickAction
                    if (notif.clickAction) {
                      window.location.href = notif.clickAction;
                    }
                    
                    setIsOpen(false);
                  }}
                  className={`w-full p-4 text-left border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${
                    !notif.read ? 'bg-accent/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notif.read && (
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-charcoal-900 text-sm mb-1">
                        {notif.title}
                      </p>
                      <p className="text-xs text-secondary line-clamp-2">
                        {notif.body}
                      </p>
                      <p className="text-xs text-secondary/60 mt-1">
                        {formatTimestamp(notif.timestamp)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-neutral-200">
              <button className="text-xs text-accent hover:text-accent-dark font-medium w-full text-center">
                Tout marquer comme lu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Formateur timestamp relatif
 */
function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}
