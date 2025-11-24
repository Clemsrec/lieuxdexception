'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  hasConsent, 
  acceptAllCookies, 
  rejectAllCookies, 
  saveConsent,
  getConsent,
  type CookieConsent 
} from '@/lib/cookies';

/**
 * Banner de consentement des cookies conforme RGPD
 * 
 * Affiche un banner en bas de page si l'utilisateur n'a pas encore donné son consentement.
 * Propose 3 options :
 * - Accepter tous les cookies
 * - Refuser tous (sauf essentiels)
 * - Personnaliser les préférences
 */
export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<Omit<CookieConsent, 'timestamp'>>({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = !hasConsent();
    setShowBanner(consent);
    
    // Charger les préférences actuelles si elles existent
    const currentConsent = getConsent();
    if (currentConsent) {
      setPreferences(currentConsent);
    }
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    rejectAllCookies();
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border-2 border-primary/20 rounded-lg shadow-2xl p-6">
          {!showSettings ? (
            // Vue simple (banner principal)
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Message */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  🍪 Respect de votre vie privée
                </h3>
                <p className="text-sm text-foreground leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site, 
                  analyser notre audience et vous proposer des contenus personnalisés. 
                  Vous pouvez accepter tous les cookies, les refuser ou personnaliser vos préférences.
                </p>
                <Link 
                  href="/cookies" 
                  className="text-sm text-primary hover:underline inline-block mt-2"
                >
                  En savoir plus sur notre politique des cookies →
                </Link>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-3 lg:shrink-0">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                >
                  Personnaliser
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                >
                  Refuser tout
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-md"
                >
                  Accepter tout
                </button>
              </div>
            </div>
          ) : (
            // Vue détaillée (paramètres)
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Paramètres des cookies
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-secondary hover:text-foreground transition-colors"
                  aria-label="Retour"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-foreground mb-6 leading-relaxed">
                Choisissez les catégories de cookies que vous souhaitez autoriser. 
                Les cookies essentiels sont nécessaires au fonctionnement du site et ne peuvent être désactivés.
              </p>

              {/* Options de cookies */}
              <div className="space-y-4 mb-6">
                {/* Cookies essentiels */}
                <div className="flex items-start justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">Cookies essentiels</span>
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        Obligatoire
                      </span>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed">
                      Nécessaires au fonctionnement du site (navigation, sécurité, formulaires). 
                      Ces cookies ne peuvent pas être désactivés.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-5 h-5 rounded border-2 border-primary/30 bg-primary/10 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Cookies analytiques */}
                <div className="flex items-start justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1 pr-4">
                    <div className="font-medium text-foreground mb-1">Cookies analytiques</div>
                    <p className="text-xs text-secondary leading-relaxed">
                      Nous permettent de mesurer l&apos;audience du site et d&apos;améliorer nos services 
                      (Google Analytics). Aucune donnée personnelle n&apos;est transmise à des tiers.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-gray-300 checked:bg-primary checked:border-primary cursor-pointer"
                    />
                  </div>
                </div>

                {/* Cookies marketing */}
                <div className="flex items-start justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1 pr-4">
                    <div className="font-medium text-foreground mb-1">Cookies marketing</div>
                    <p className="text-xs text-secondary leading-relaxed">
                      Utilisés pour vous proposer des publicités personnalisées et mesurer l&apos;efficacité 
                      de nos campagnes publicitaires (Facebook, Google Ads).
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-gray-300 checked:bg-primary checked:border-primary cursor-pointer"
                    />
                  </div>
                </div>

                {/* Cookies de préférences */}
                <div className="flex items-start justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1 pr-4">
                    <div className="font-medium text-foreground mb-1">Cookies de préférences</div>
                    <p className="text-xs text-secondary leading-relaxed">
                      Mémorisent vos préférences (langue, région, filtres de recherche) 
                      pour une expérience personnalisée.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.preferences}
                      onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-gray-300 checked:bg-primary checked:border-primary cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-2.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                >
                  Refuser tout
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-md"
                >
                  Enregistrer mes préférences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
