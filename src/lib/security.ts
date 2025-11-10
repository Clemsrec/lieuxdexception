/**
 * Utilitaires de Sécurité - Lieux d'Exception
 * 
 * Fonctions helper pour la sécurisation de l'application
 * (rate limiting, sanitization, hashing, etc.)
 */

import crypto from 'crypto';

// ===========================================
// RATE LIMITING (En Mémoire - Simple)
// ===========================================

/**
 * Store en mémoire pour le rate limiting
 * Note: En production, utiliser Redis ou Upstash
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Configuration du rate limiting
 */
export interface RateLimitConfig {
  /**
   * Nombre maximum de requêtes autorisées
   */
  maxRequests: number;
  
  /**
   * Fenêtre de temps en secondes
   */
  windowSeconds: number;
}

/**
 * Vérifie si une requête dépasse le rate limit
 * 
 * @param identifier - Identifiant unique (IP, user ID, etc.)
 * @param config - Configuration du rate limiting
 * @returns true si la limite est dépassée
 * 
 * @example
 * ```ts
 * if (isRateLimited(ip, { maxRequests: 10, windowSeconds: 60 })) {
 *   return Response.json({ error: 'Too many requests' }, { status: 429 });
 * }
 * ```
 */
export function isRateLimited(
  identifier: string,
  config: RateLimitConfig
): boolean {
  const now = Date.now();
  const key = `rl:${identifier}`;
  const entry = rateLimitStore.get(key);
  
  // Première requête ou fenêtre expirée
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + config.windowSeconds * 1000,
    });
    return false;
  }
  
  // Incrémenter le compteur
  entry.count++;
  
  // Vérifier la limite
  return entry.count > config.maxRequests;
}

/**
 * Nettoie le store de rate limiting (à appeler périodiquement)
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

// Nettoyage automatique toutes les 5 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}

// ===========================================
// SANITIZATION & VALIDATION
// ===========================================

/**
 * Échappe les caractères HTML pour prévenir XSS
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Supprime tous les tags HTML d'une chaîne
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Valide et normalise une adresse email
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Vérifie si une chaîne contient des caractères suspects
 */
export function hasSuspiciousContent(text: string): boolean {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /eval\(/i,
    /<iframe/i,
    /data:text\/html/i,
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(text));
}

// ===========================================
// HASHING & TOKENS
// ===========================================

/**
 * Génère un token aléatoire sécurisé
 * 
 * @param length - Longueur du token en bytes (défaut: 32)
 * @returns Token hexadécimal
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash un mot de passe avec SHA-256
 * Note: Pour production, utiliser bcrypt ou Argon2
 */
export function hashPassword(password: string, salt?: string): string {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, actualSalt, 10000, 64, 'sha512')
    .toString('hex');
  return `${actualSalt}:${hash}`;
}

/**
 * Vérifie un mot de passe hashé
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, originalHash] = hashedPassword.split(':');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return hash === originalHash;
}

/**
 * Génère un hash SHA-256 d'une chaîne
 */
export function sha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// ===========================================
// IP & GEOLOCATION
// ===========================================

/**
 * Extrait l'IP réelle d'une requête (gère les proxies)
 */
export function getRealIP(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') || // Cloudflare
    'unknown'
  );
}

/**
 * Vérifie si une IP est dans une liste noire
 */
export function isIPBlacklisted(ip: string, blacklist: string[]): boolean {
  return blacklist.includes(ip);
}

// ===========================================
// CSRF PROTECTION
// ===========================================

/**
 * Génère un token CSRF
 */
export function generateCSRFToken(): string {
  return generateToken(32);
}

/**
 * Vérifie un token CSRF
 * 
 * @param token - Token fourni par le client
 * @param sessionToken - Token stocké en session
 */
export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false;
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(sessionToken)
  );
}

// ===========================================
// LOGS DE SÉCURITÉ
// ===========================================

export interface SecurityLog {
  timestamp: Date;
  type: 'rate_limit' | 'suspicious_content' | 'auth_failure' | 'access_denied';
  ip: string;
  userAgent?: string;
  path?: string;
  details?: string;
}

/**
 * Log un événement de sécurité
 * En production, envoyer vers un service de logging (Sentry, LogRocket, etc.)
 */
export function logSecurityEvent(log: SecurityLog): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[SECURITY]', JSON.stringify(log, null, 2));
  }
  
  // TODO: En production, envoyer vers Sentry ou service de logs
  // await sendToSentry(log);
}

// ===========================================
// VALIDATIONS MÉTIER
// ===========================================

/**
 * Vérifie qu'une date est dans le futur (pour événements)
 */
export function isDateInFuture(date: Date | string): boolean {
  const eventDate = typeof date === 'string' ? new Date(date) : date;
  return eventDate > new Date();
}

/**
 * Vérifie qu'un nombre d'invités est réaliste
 */
export function isValidGuestCount(count: number): boolean {
  return count >= 10 && count <= 500;
}

/**
 * Vérifie qu'un budget est réaliste
 */
export function isValidBudget(budget: number, type: 'b2b' | 'wedding'): boolean {
  const minimums = {
    b2b: 1000, // Minimum 1000€ pour événement B2B
    wedding: 5000, // Minimum 5000€ pour mariage
  };
  
  return budget >= minimums[type] && budget <= 500000;
}

// ===========================================
// EXPORTS GROUPÉS
// ===========================================

export const security = {
  // Rate limiting
  isRateLimited,
  cleanupRateLimitStore,
  
  // Sanitization
  escapeHtml,
  stripHtml,
  normalizeEmail,
  hasSuspiciousContent,
  
  // Hashing
  generateToken,
  hashPassword,
  verifyPassword,
  sha256,
  
  // IP
  getRealIP,
  isIPBlacklisted,
  
  // CSRF
  generateCSRFToken,
  verifyCSRFToken,
  
  // Logging
  logSecurityEvent,
  
  // Validations
  isDateInFuture,
  isValidGuestCount,
  isValidBudget,
};

export default security;
