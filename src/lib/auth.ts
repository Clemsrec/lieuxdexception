'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase-client';

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

export const authActions = {
  async signIn(email: string, password: string) {
    if (!auth) throw new Error('Auth non disponible');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Récupérer le token ID pour le middleware
    const idToken = await userCredential.user.getIdToken();
    
    // Stocker le token dans un cookie pour le middleware
    document.cookie = `auth-token=${idToken}; path=/; max-age=3600; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
    
    return userCredential;
  },

  async signUp(email: string, password: string) {
    if (!auth) throw new Error('Auth non disponible');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Récupérer le token ID
    const idToken = await userCredential.user.getIdToken();
    
    // Stocker le token
    document.cookie = `auth-token=${idToken}; path=/; max-age=3600; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
    
    return userCredential;
  },

  async signOut() {
    if (!auth) throw new Error('Auth non disponible');
    
    // Supprimer le cookie
    document.cookie = 'auth-token=; path=/; max-age=0';
    
    return signOut(auth);
  },
};