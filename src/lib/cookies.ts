/**
 * Gestion des cookies et du consentement RGPD
 * 
 * Système complet de gestion des cookies conforme au RGPD avec :
 * - Stockage du consentement utilisateur
 * - Gestion des différentes catégories de cookies
 * - Helpers pour manipuler les cookies
 */

export type CookieCategory = 'essential' | 'analytics' | 'marketing' | 'preferences';

export interface CookieConsent {
  essential: boolean;      // Toujours true (obligatoires)
  analytics: boolean;      // Google Analytics, statistiques
  marketing: boolean;      // Publicité, remarketing
  preferences: boolean;    // Préférences utilisateur, langue
  timestamp: number;       // Date du consentement
}

/**
 * Nom du cookie de consentement
 */
const CONSENT_COOKIE_NAME = 'lde-cookie-consent';
const CONSENT_COOKIE_EXPIRY = 365; // 1 an

/**
 * Consentement par défaut (seulement cookies essentiels)
 */
export const defaultConsent: CookieConsent = {
  essential: true,
  analytics: false,
  marketing: false,
  preferences: false,
  timestamp: Date.now(),
};

/**
 * Définir un cookie
 */
export function setCookie(name: string, value: string, days: number): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secure}`;
}

/**
 * Récupérer un cookie
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
}

/**
 * Supprimer un cookie
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Sauvegarder le consentement utilisateur
 */
export function saveConsent(consent: Omit<CookieConsent, 'timestamp'>): void {
  const fullConsent: CookieConsent = {
    ...consent,
    essential: true, // Toujours true
    timestamp: Date.now(),
  };
  
  setCookie(CONSENT_COOKIE_NAME, JSON.stringify(fullConsent), CONSENT_COOKIE_EXPIRY);
  
  // Appliquer les changements immédiatement
  applyConsent(fullConsent);
}

/**
 * Récupérer le consentement utilisateur
 */
export function getConsent(): CookieConsent | null {
  const consentStr = getCookie(CONSENT_COOKIE_NAME);
  if (!consentStr) return null;
  
  try {
    return JSON.parse(consentStr) as CookieConsent;
  } catch {
    return null;
  }
}

/**
 * Vérifier si l'utilisateur a déjà donné son consentement
 */
export function hasConsent(): boolean {
  return getConsent() !== null;
}

/**
 * Vérifier si une catégorie de cookie est autorisée
 */
export function isCategoryAllowed(category: CookieCategory): boolean {
  const consent = getConsent();
  if (!consent) return category === 'essential'; // Seulement essentiels par défaut
  return consent[category];
}

/**
 * Appliquer le consentement (activer/désactiver les cookies selon les choix)
 */
function applyConsent(consent: CookieConsent): void {
  // Google Analytics
  if (consent.analytics) {
    enableGoogleAnalytics();
  } else {
    disableGoogleAnalytics();
  }
  
  // Marketing cookies
  if (!consent.marketing) {
    deleteMarketingCookies();
  }
  
  // Dispatch event pour notifier les composants
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: consent }));
  }
}

/**
 * Activer Google Analytics
 */
function enableGoogleAnalytics(): void {
  if (typeof window === 'undefined') return;
  
  // Réactiver GA si présent
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
    });
  }
}

/**
 * Désactiver Google Analytics
 */
function disableGoogleAnalytics(): void {
  if (typeof window === 'undefined') return;
  
  // Désactiver GA
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
    });
  }
  
  // Supprimer les cookies GA existants
  const gaCookies = ['_ga', '_gid', '_gat', '_gat_gtag'];
  gaCookies.forEach(name => {
    deleteCookie(name);
    // Essayer aussi avec le domaine
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
  });
}

/**
 * Supprimer tous les cookies marketing
 */
function deleteMarketingCookies(): void {
  // Liste des cookies marketing courants
  const marketingCookies = ['_fbp', '_fbc', 'fr', 'tr', 'ads', 'IDE', 'test_cookie'];
  marketingCookies.forEach(deleteCookie);
}

/**
 * Réinitialiser le consentement (afficher à nouveau le banner)
 */
export function resetConsent(): void {
  deleteCookie(CONSENT_COOKIE_NAME);
  
  // Supprimer tous les cookies non-essentiels
  disableGoogleAnalytics();
  deleteMarketingCookies();
  
  // Recharger la page pour réafficher le banner
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

/**
 * Accepter tous les cookies
 */
export function acceptAllCookies(): void {
  saveConsent({
    essential: true,
    analytics: true,
    marketing: true,
    preferences: true,
  });
}

/**
 * Refuser tous les cookies (sauf essentiels)
 */
export function rejectAllCookies(): void {
  saveConsent({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });
}

// Types pour Google Analytics (gtag)
declare global {
  interface Window {
    gtag?: (
      command: 'consent',
      action: 'default' | 'update',
      params: Record<string, string>
    ) => void;
  }
}
