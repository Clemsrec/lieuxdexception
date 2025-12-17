/**
 * Context d'authentification Admin
 * Gère l'état de connexion et les infos utilisateur
 */

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';

interface AdminUser {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'user';
  isAdmin: boolean;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && db) {
        // Récupérer les infos depuis Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();

          // Récupérer les custom claims
          const idTokenResult = await firebaseUser.getIdTokenResult();
          const isAdmin = idTokenResult.claims.admin === true;

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            firstName: userData?.firstName,
            lastName: userData?.lastName,
            role: userData?.role || 'user',
            isAdmin,
          });
        } catch (error) {
          console.error('Erreur récupération user:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (auth) {
      await auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
