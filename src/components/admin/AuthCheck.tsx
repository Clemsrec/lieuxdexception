'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { AlertTriangle } from 'lucide-react';

/**
 * Composant pour vérifier et maintenir l'authentification admin
 * - Vérifie que l'utilisateur est connecté
 * - Rafraîchit automatiquement le token toutes les 50 minutes
 * - Affiche un avertissement si le token va expirer
 */
export default function AuthCheck() {
  const router = useRouter();
  const [tokenExpiresSoon, setTokenExpiresSoon] = useState(false);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Utilisateur déconnecté, rediriger vers login
        console.warn('[AuthCheck] Utilisateur non connecté, redirection...');
        router.push('/admin/login');
        return;
      }

      // Rafraîchir le token et le stocker dans le cookie
      const refreshToken = async () => {
        try {
          const idToken = await user.getIdToken(true); // Force refresh
          document.cookie = `auth-token=${idToken}; path=/; max-age=3600; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
          console.log('[AuthCheck] Token rafraîchi');
          setTokenExpiresSoon(false);
        } catch (error) {
          console.error('[AuthCheck] Erreur refresh token:', error);
        }
      };

      // Rafraîchir immédiatement
      await refreshToken();

      // Rafraîchir toutes les 50 minutes (avant expiration à 60 min)
      const refreshInterval = setInterval(refreshToken, 50 * 60 * 1000);

      // Avertir 5 minutes avant expiration
      const warningTimeout = setTimeout(() => {
        setTokenExpiresSoon(true);
      }, 55 * 60 * 1000);

      return () => {
        clearInterval(refreshInterval);
        clearTimeout(warningTimeout);
      };
    });

    return () => unsubscribe();
  }, [router]);

  if (tokenExpiresSoon) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-yellow-50 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        <span>Votre session va expirer. Enregistrez vos modifications.</span>
      </div>
    );
  }

  return null;
}
