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
    return signInWithEmailAndPassword(auth, email, password);
  },

  async signUp(email: string, password: string) {
    if (!auth) throw new Error('Auth non disponible');
    return createUserWithEmailAndPassword(auth, email, password);
  },

  async signOut() {
    if (!auth) throw new Error('Auth non disponible');
    return signOut(auth);
  },
};