/**
 * Firebase Cloud Messaging Service Worker
 * Gère les notifications push en arrière-plan (app fermée ou en background)
 * 
 * ID de l'expéditeur : 886228169873
 * API V1 (recommandée)
 */

// Importer Firebase scripts depuis CDN (nécessaire pour Service Worker)
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Configuration Firebase (même que firebase-client.ts)
const firebaseConfig = {
  apiKey: "AIzaSyBqjqLpPb63-PdEDVGQvU80vdCg5pfFsWs",
  authDomain: "lieux-d-exceptions.firebaseapp.com",
  projectId: "lieux-d-exceptions",
  storageBucket: "lieux-d-exceptions.firebasestorage.app",
  messagingSenderId: "886228169873",
  appId: "1:886228169873:web:fde9c21f1ae23e50ecac41",
  measurementId: "G-30QHCE2G3K"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Récupérer l'instance messaging
const messaging = firebase.messaging();

/**
 * Gestion des messages en arrière-plan
 * S'exécute quand l'app n'est pas ouverte
 */
messaging.onBackgroundMessage((payload) => {
  console.log('[Service Worker] Message reçu en arrière-plan:', payload);

  const notificationTitle = payload.notification?.title || 'Lieux d\'Exception';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.icon || '/logo/Logo_CLE_seule.png',
    badge: '/logo/Logo_CLE_seule.png',
    tag: 'lieuxdexception-admin',
    requireInteraction: true,
    data: {
      url: payload.data?.clickAction || '/admin/dashboard',
      ...payload.data,
    },
  };

  // Afficher la notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

/**
 * Gestion du clic sur notification
 * Ouvre l'app et redirige vers la bonne page
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Clic sur notification:', event);
  
  event.notification.close();

  // URL de redirection (depuis les data de la notification)
  const urlToOpen = event.notification.data?.url || '/admin/dashboard';

  // Ouvrir ou focus sur l'app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Chercher si une fenêtre est déjà ouverte
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(urlToOpen);
            return;
          }
        }
        // Sinon, ouvrir nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

console.log('[Service Worker] Firebase Messaging SW chargé ✅');
