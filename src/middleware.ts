/**
 * Middleware Next.js - i18n + Sécurité + Protection
 * 
 * Ce middleware gère :
 * - Détection automatique de la langue (Accept-Language header)
 * - Redirection vers /[locale]/...
 * - Headers de sécurité HTTP
 * - Protection routes admin/API avec authentification
 */

import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

/**
 * Routes protégées nécessitant une authentification
 */
const PROTECTED_ROUTES = ['/admin'];

/**
 * Routes API sensibles nécessitant une authentification
 */
const PROTECTED_API_ROUTES = ['/api/admin', '/api/venues/create', '/api/venues/update'];

/**
 * Middleware i18n next-intl
 * Configuration minimale pour éviter les boucles de redirection
 * - as-needed : ne force pas /fr sur la locale par défaut
 * - localeDetection: false : désactive la détection auto (évite redirects)
 */
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Ne force pas /fr, permet / pour français
  localeDetection: false, // Désactive détection auto (cause des redirects)
});

/**
 * Middleware principal - i18n + Sécurité + Authentification
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Bypass pour fichiers statiques et _next
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp|woff|woff2|ttf|eot)$/i)
  ) {
    return NextResponse.next();
  }
  
  // 2. Bypass i18n pour /api, /admin, /robots.txt, /sitemap.xml
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    const response = NextResponse.next();
    // Appliquer quand même les headers de sécurité
    applySecurityHeaders(response);
    
    // Protection API routes
    if (PROTECTED_API_ROUTES.some(route => pathname.startsWith(route))) {
      const authToken = request.cookies.get('auth-token');
      
      if (!authToken) {
        return NextResponse.json(
          { error: 'Authentification requise', code: 'UNAUTHORIZED' },
          { status: 401 }
        );
      }
      
      console.log(`[Security] ✅ Cookie auth présent (API): ${pathname}`);
    }
    
    // Protection admin routes
    if (pathname.startsWith('/admin') && pathname !== '/admin/connexion') {
      const authToken = request.cookies.get('auth-token');
      
      if (!authToken) {
        const loginUrl = new URL('/admin/connexion', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      console.log(`[Security] ✅ Cookie auth présent (admin): ${pathname}`);
    }
    
    return response;
  }
  
  // 3. Appliquer middleware i18n (détection langue + routing)
  const response = intlMiddleware(request);
  
  // 4. Appliquer headers de sécurité HTTP
  applySecurityHeaders(response);
  
  return response;
}

/**
 * Applique les headers de sécurité HTTP sur une réponse
 */
function applySecurityHeaders(response: NextResponse) {
  /**
   * Content Security Policy (CSP)
   * Protège contre XSS, injections de scripts, etc.
   * 
   * TODO: Remplacer 'unsafe-inline' par nonces pour renforcer sécurité XSS
   * Nécessite architecture Next.js 15 avec:
   * 1. Générer nonce aléatoire par requête (crypto.randomBytes)
   * 2. Passer nonce via headers → page props
   * 3. Utiliser <Script nonce={nonce}> pour scripts inline
   * 4. Configurer next.config.js avec experimental.csp
   * Complexité: Élevée (impact architecture + build time)
   */
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com https://r2cdn.perplexity.ai",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebase.google.com wss://*.firebaseio.com",
      "frame-src 'self' https://*.firebaseapp.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
      // NOTE: "require-trusted-types-for 'script'" temporairement désactivé
      // car incompatible avec Next.js 15 (bloque webpack runtime)
      // TODO: Réactiver après migration vers nonces CSP
    ].join('; ')
  );
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
}

/**
 * Configuration du matcher
 * Applique le middleware sur toutes les routes sauf API, admin, et fichiers statiques
 */
export const config = {
  matcher: [
    // Match toutes les routes SAUF API, admin, fichiers statiques
    '/((?!api|admin|_next|static|.*\\..*|favicon.ico|robots.txt|sitemap.xml).*)'
  ],
};
