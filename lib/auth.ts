'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    return signInWithEmailAndPassword(auth, email, password);
  },

  async signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  },

  async signOut() {
    return signOut(auth);
  },
};