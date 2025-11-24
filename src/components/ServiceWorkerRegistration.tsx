'use client';

import { useEffect } from 'react';

/**
 * Service Worker Registration
 * Enregistre firebase-messaging-sw.js pour les notifications push en background
 * 
 * Note: Désactivé en développement pour éviter les erreurs avec Turbopack
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Ne pas enregistrer en développement (évite erreurs avec Turbopack)
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚠️ Service Worker FCM désactivé en développement');
      return;
    }

    // Enregistrer uniquement côté client, en production, et si supporté
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js', { scope: '/' })
        .then((registration) => {
          console.log('✅ Service Worker FCM enregistré:', registration.scope);
          
          // Vérifier les mises à jour toutes les heures
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
        })
        .catch((error) => {
          // Erreur silencieuse pour ne pas polluer la console
          console.warn('Service Worker non disponible:', error.message);
        });
    }
  }, []);

  return null; // Composant invisible
}
