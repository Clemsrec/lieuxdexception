'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authActions } from '@/lib/auth';
import Image from 'next/image';

/**
 * Page de connexion admin
 * Authentification Firebase avec email/password
 * Sécurisé avec validation, rate limiting, messages d'erreur clairs
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  /**
   * Reporte une activité suspecte aux admins (trop de tentatives échouées)
   */
  const reportSuspiciousActivity = async (email: string, attempts: number) => {
    try {
      await fetch('/api/admin/report-login-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          ip: 'client', // En production, récupérer l'IP côté serveur
          userAgent: navigator.userAgent,
          attempts,
        }),
      });
    } catch (error) {
      console.error('Erreur rapport sécurité:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation côté client
    if (!email || !email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    if (!password || password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    // Rate limiting côté client (max 5 tentatives)
    if (attempts >= 5) {
      setError('Trop de tentatives échouées. Veuillez attendre 5 minutes.');
      // Reporter l'incident aux admins
      reportSuspiciousActivity(email, attempts);
      return;
    }

    setLoading(true);

    try {
      await authActions.signIn(email, password);
      // Réinitialiser les tentatives en cas de succès
      setAttempts(0);
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error('Erreur connexion:', err);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Reporter aux admins si seuil critique atteint
      if (newAttempts >= 5) {
        reportSuspiciousActivity(email, newAttempts);
      }
      
      // Messages d'erreur en français (détaillés et sécurisés)
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('⚠️ Email ou mot de passe incorrect');
      } else if (err.code === 'auth/user-not-found') {
        setError('⚠️ Aucun compte trouvé avec cet email');
      } else if (err.code === 'auth/too-many-requests') {
        setError('🚫 Trop de tentatives échouées. Veuillez réessayer dans 5 minutes.');
      } else if (err.code === 'auth/invalid-email') {
        setError('⚠️ Format d\'email invalide');
      } else if (err.code === 'auth/network-request-failed') {
        setError('🌐 Erreur réseau. Vérifiez votre connexion internet.');
      } else if (err.code === 'auth/user-disabled') {
        setError('🚫 Ce compte a été désactivé. Contactez l\'administrateur.');
      } else {
        setError('❌ Erreur de connexion. Vérifiez vos identifiants.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-neutral-50 via-white to-neutral-100 px-6 py-8">
      <div className="w-full max-w-3xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <Image
              src="/logo/Logo_CLE_avec Texte.png"
              alt="Lieux d'Exception - Groupe Riou"
              width={280}
              height={100}
              className="mx-auto drop-shadow-sm"
              priority
            />
          </div>
          <h1 className="text-2xl font-heading font-semibold text-primary">
            Administration
          </h1>
          <p className="text-secondary mt-2">
            Connexion à l&apos;espace admin
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white px-8 py-10 md:px-12 md:py-12 rounded-2xl shadow-2xl border border-neutral-200">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                Adresse email *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(''); // Efface l'erreur lors de la saisie
                }}
                required
                autoComplete="email"
                spellCheck="false"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all outline-none"
                placeholder="admin@lieuxdexception.fr"
                disabled={loading}
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                Mot de passe *
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(''); // Efface l'erreur lors de la saisie
                  }}
                  required
                  autoComplete="current-password"
                  minLength={8}
                  className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all outline-none"
                  placeholder="Minimum 8 caractères"
                  disabled={loading}
                />
                {/* Bouton œil pour voir/cacher le mot de passe */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Indicateur tentatives si erreur */}
              {attempts > 0 && (
                <p className="text-xs text-secondary mt-1">
                  Tentative {attempts}/5
                </p>
              )}
            </div>

            {/* Message d'erreur amélioré */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-lg text-sm flex items-start gap-3 animate-shake">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="flex-1">{error}</span>
              </div>
            )}

            {/* Bouton connexion */}
            <button
              type="submit"
              disabled={loading || attempts >= 5}
              className="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </span>
              ) : attempts >= 5 ? (
                '🚫 Trop de tentatives'
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Info première connexion */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <p className="text-xs text-secondary text-center">
              <strong>Première connexion ?</strong><br />
              Contactez l&apos;administrateur système pour créer votre compte.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-secondary mt-6">
          Lieux d&apos;Exception © {new Date().getFullYear()} - Groupe Riou
        </p>
      </div>
    </div>
  );
}
