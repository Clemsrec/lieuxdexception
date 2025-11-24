'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

/**
 * Composant pour protéger les routes admin
 * Redirige vers /admin/login si non authentifié
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export default function ProtectedRoute({ children, loadingComponent }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/connexion');
    }
  }, [user, loading, router]);

  // Afficher loader pendant vérification auth
  if (loading) {
    return (
      loadingComponent || (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-secondary">Vérification des accès...</p>
          </div>
        </div>
      )
    );
  }

  // Si pas d'utilisateur, ne rien afficher (redirection en cours)
  if (!user) {
    return null;
  }

  // Utilisateur authentifié, afficher contenu protégé
  return <>{children}</>;
}
