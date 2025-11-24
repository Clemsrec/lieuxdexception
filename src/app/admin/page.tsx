'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

/**
 * Page d'entrée admin - Redirige vers login ou dashboard
 * 
 * Si utilisateur non connecté → /admin/login
 * Si utilisateur connecté → /admin/dashboard
 */
export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Utilisateur connecté → dashboard
        router.push('/admin/dashboard');
      } else {
        // Non connecté → connexion
        router.push('/admin/connexion');
      }
    }
  }, [user, loading, router]);

  // Afficher loader pendant vérification
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-secondary">Redirection...</p>
      </div>
    </div>
  );
}
