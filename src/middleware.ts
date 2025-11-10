/**
 * Middleware Next.js - Sécurité et Protection
 * 
 * Ce middleware applique des headers de sécurité HTTP et protège
 * les routes sensibles (admin, API) avec authentification.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Routes protégées nécessitant une authentification
 */
const PROTECTED_ROUTES = ['/admin'];

/**
 * Routes API sensibles nécessitant une authentification
 */
const PROTECTED_API_ROUTES = ['/api/admin', '/api/venues/create', '/api/venues/update'];

/**
 * Middleware principal - Sécurité et authentification
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Créer une réponse avec headers de sécurité
  const response = NextResponse.next();
  
  // ===========================================
  // HEADERS DE SÉCURITÉ HTTP
  // ===========================================
  
  /**
   * Content Security Policy (CSP)
   * Protège contre XSS, injections de scripts, etc.
   */
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebase.google.com wss://*.firebaseio.com",
      "frame-src 'self' https://*.firebaseapp.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  );
  
  /**
   * X-Frame-Options
   * Protège contre le clickjacking
   */
  response.headers.set('X-Frame-Options', 'DENY');
  
  /**
   * X-Content-Type-Options
   * Empêche le MIME sniffing
   */
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  /**
   * X-XSS-Protection
   * Active la protection XSS du navigateur (legacy mais utile)
   */
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  /**
   * Referrer-Policy
   * Contrôle les informations envoyées dans le header Referer
   */
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  /**
   * Permissions-Policy
   * Contrôle l'accès aux fonctionnalités du navigateur
   */
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  /**
   * Strict-Transport-Security (HSTS)
   * Force HTTPS pour toutes les requêtes futures
   * Note: Activé uniquement en production
   */
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // ===========================================
  // PROTECTION DES ROUTES ADMIN
  // ===========================================
  
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    // TODO: Vérifier l'authentification via cookie/session
    // Pour l'instant, on laisse passer mais on log
    console.log(`[Security] Accès route protégée: ${pathname}`);
    
    // Vérification du cookie d'authentification
    const authToken = request.cookies.get('auth-token');
    
    if (!authToken) {
      // Redirection vers la page de login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      // return NextResponse.redirect(loginUrl); // Décommenter quand login est implémenté
    }
  }
  
  // ===========================================
  // PROTECTION DES ROUTES API
  // ===========================================
  
  if (PROTECTED_API_ROUTES.some(route => pathname.startsWith(route))) {
    // Vérification de l'authentification pour les API sensibles
    const authToken = request.cookies.get('auth-token');
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentification requise', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
    
    // TODO: Vérifier la validité du token
    console.log(`[Security] Accès API protégée: ${pathname}`);
  }
  
  // ===========================================
  // RATE LIMITING BASIQUE (en mémoire)
  // ===========================================
  
  // Note: Pour une vraie prod, utiliser Redis ou Upstash
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    console.log(`[API] ${request.method} ${pathname} from ${ip}`);
    
    // TODO: Implémenter rate limiting avec Redis
    // Pour l'instant, on log simplement
  }
  
  return response;
}

/**
 * Configuration du matcher
 * Définit les routes où le middleware s'applique
 */
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico (favicon)
     * - Fichiers publics (.svg, .png, .jpg, .jpeg, .gif, .webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
