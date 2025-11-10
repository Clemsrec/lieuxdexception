/**
 * Composant de test Firebase - Lieux d'Exception
 * 
 * Ce composant vérifie la connexion à Firebase et affiche
 * le statut de la base de données Firestore.
 */

'use client';

import { useEffect, useState } from 'react';
import { testFirestoreConnection } from '@/lib/firestore';

interface ConnectionStatus {
  status: 'testing' | 'connected' | 'error';
  message: string;
  timestamp?: string;
}

/**
 * Composant pour tester la connexion Firebase
 */
export default function FirebaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'testing',
    message: 'Test de la connexion en cours...'
  });

  /**
   * Tester la connexion Firebase au montage du composant
   */
  useEffect(() => {
    const testConnection = async () => {
      try {
        const isConnected = await testFirestoreConnection();
        
        if (isConnected) {
          setConnectionStatus({
            status: 'connected',
            message: 'Connexion Firebase réussie !',
            timestamp: new Date().toLocaleString('fr-FR')
          });
        } else {
          setConnectionStatus({
            status: 'error',
            message: 'Échec de la connexion Firebase',
            timestamp: new Date().toLocaleString('fr-FR')
          });
        }
      } catch (error) {
        setConnectionStatus({
          status: 'error',
          message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          timestamp: new Date().toLocaleString('fr-FR')
        });
      }
    };

    testConnection();
  }, []);

  /**
   * Styles CSS conditionnels selon le statut
   */
  const getStatusStyles = () => {
    switch (connectionStatus.status) {
      case 'testing':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'connected':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  /**
   * Icône selon le statut
   */
  const getStatusIcon = () => {
    switch (connectionStatus.status) {
      case 'testing':
        return (
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        );
      case 'connected':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`p-4 border rounded-lg flex items-center space-x-3 ${getStatusStyles()}`}>
      {getStatusIcon()}
      <div className="flex-1">
        <h3 className="font-medium">Status Firebase</h3>
        <p className="text-sm">{connectionStatus.message}</p>
        {connectionStatus.timestamp && (
          <p className="text-xs opacity-75 mt-1">
            Testé le {connectionStatus.timestamp}
          </p>
        )}
      </div>
      
      {/* Informations de configuration */}
      <div className="text-right">
        <p className="text-xs font-mono">
          Projet: lieux-d-exceptions
        </p>
        <p className="text-xs font-mono">
          DB: lieuxdexception
        </p>
      </div>
    </div>
  );
}