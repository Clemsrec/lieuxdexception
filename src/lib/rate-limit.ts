/**
 * Rate Limiting avec Upstash Redis
 * 
 * Protection contre abus et attaques DDoS
 * Utilise un sliding window pour limiter les requêtes par IP
 * 
 * Configuration Upstash :
 * 1. Créer compte : https://upstash.com (gratuit)
 * 2. Créer base Redis
 * 3. Copier UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN
 * 4. Ajouter dans .env.local et Google Cloud Secret Manager
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Instance Redis Upstash
 * Configurée via variables d'environnement
 */
let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // Rate limiter avec sliding window
    // 10 requêtes par 10 secondes par IP
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
      analytics: true, // Activer analytics Upstash
      prefix: 'lieuxdexception:ratelimit',
    });

    console.log('[Rate Limit] ✅ Upstash Redis initialisé');
  } else {
    console.warn('[Rate Limit] ⚠️ UPSTASH_REDIS_REST_URL ou TOKEN manquant - Rate limiting désactivé');
  }
} catch (error) {
  console.error('[Rate Limit] ❌ Erreur initialisation Upstash:', error);
}

/**
 * Interface pour le résultat du rate limiting
 */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Timestamp en secondes
  pending: Promise<unknown>;
}

/**
 * Vérifie si une requête est autorisée selon le rate limit
 * 
 * @param identifier - Identifiant unique (IP, user ID, etc.)
 * @returns RateLimitResult avec success, limit, remaining, reset
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  // Si Upstash n'est pas configuré, permettre toutes les requêtes
  if (!ratelimit) {
    return {
      success: true,
      limit: Infinity,
      remaining: Infinity,
      reset: 0,
      pending: Promise.resolve(),
    };
  }

  try {
    const result = await ratelimit.limit(identifier);
    
    // Logger les tentatives bloquées
    if (!result.success) {
      console.warn(`[Rate Limit] 🚫 Bloqué: ${identifier} (${result.remaining}/${result.limit})`);
    }

    return result;
  } catch (error) {
    console.error('[Rate Limit] Erreur vérification:', error);
    
    // En cas d'erreur, permettre la requête (fail-open)
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
      pending: Promise.resolve(),
    };
  }
}

/**
 * Rate limiters spécialisés pour différents endpoints
 */

/**
 * Rate limit strict pour les formulaires de contact
 * 3 soumissions par minute par IP
 */
export async function checkContactFormRateLimit(ip: string): Promise<RateLimitResult> {
  if (!redis) {
    return {
      success: true,
      limit: Infinity,
      remaining: Infinity,
      reset: 0,
      pending: Promise.resolve(),
    };
  }

  const contactRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 m'),
    analytics: true,
    prefix: 'lieuxdexception:contact',
  });

  return contactRatelimit.limit(ip);
}

/**
 * Rate limit pour les tentatives de connexion
 * 5 tentatives par 5 minutes par IP
 */
export async function checkLoginRateLimit(ip: string): Promise<RateLimitResult> {
  if (!redis) {
    return {
      success: true,
      limit: Infinity,
      remaining: Infinity,
      reset: 0,
      pending: Promise.resolve(),
    };
  }

  const loginRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '5 m'),
    analytics: true,
    prefix: 'lieuxdexception:login',
  });

  return loginRatelimit.limit(ip);
}

/**
 * Rate limit pour les API admin
 * 30 requêtes par minute par utilisateur
 */
export async function checkAdminApiRateLimit(userId: string): Promise<RateLimitResult> {
  if (!redis) {
    return {
      success: true,
      limit: Infinity,
      remaining: Infinity,
      reset: 0,
      pending: Promise.resolve(),
    };
  }

  const adminRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    analytics: true,
    prefix: 'lieuxdexception:admin',
  });

  return adminRatelimit.limit(userId);
}

/**
 * Helper pour créer un Response 429 (Too Many Requests) standardisé
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  const resetDate = new Date(result.reset * 1000);
  const resetIn = Math.ceil((result.reset * 1000 - Date.now()) / 1000);

  return Response.json(
    {
      error: 'Trop de requêtes',
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Vous avez dépassé la limite de ${result.limit} requêtes. Réessayez dans ${resetIn} secondes.`,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      resetIn,
    },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toString(),
        'Retry-After': resetIn.toString(),
      },
    }
  );
}

/**
 * Reset manuel du rate limit pour un identifier (usage admin uniquement)
 */
export async function resetRateLimit(identifier: string): Promise<boolean> {
  if (!redis) {
    return false;
  }

  try {
    await redis.del(`lieuxdexception:ratelimit:${identifier}`);
    console.log(`[Rate Limit] ✅ Reset: ${identifier}`);
    return true;
  } catch (error) {
    console.error('[Rate Limit] Erreur reset:', error);
    return false;
  }
}

/**
 * Exporter l'instance Redis pour usage avancé
 */
export { redis };

/**
 * Extrait l'IP réelle d'une requête (gère proxies Cloudflare/Vercel/Firebase)
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  
  // Cloudflare
  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;
  
  // Vercel/Next.js/Firebase App Hosting
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',');
    return ips[0].trim();
  }
  
  // Fallback
  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) return xRealIp;
  
  return 'unknown';
}
