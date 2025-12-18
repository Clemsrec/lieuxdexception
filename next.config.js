/**
 * Configuration Next.js pour Lieux d'Exception
 * Compatible avec Firebase App Hosting
 * 
 * Dernière mise à jour : 15 décembre 2025
 * @type {import('next').NextConfig}
 */

const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

// Configuration de base
const config = {
  // ✅ CRITIQUE : Output standalone pour Firebase App Hosting
  output: 'standalone',
  
  // Build ID unique pour cache busting
  generateBuildId: async () => {
    const { version } = require('./package.json');
    return `${version}-${Date.now()}`;
  },
  
  // Images optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lieux-d-exceptions.firebasestorage.app',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90], // Qualités utilisées (75 par défaut, 90 pour images importantes)
  },
  
  // Désactiver strictMode (cause des problèmes avec Leaflet qui ne supporte pas le double-mount)
  reactStrictMode: false,
  
  // Compiler pour navigateurs modernes (ES2020+) - Évite polyfills inutiles
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Transpiler pour cible moderne uniquement
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    // Turbopack activé pour builds plus rapides
    turbo: {},
  },
  
  // Headers de sécurité et cache control
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Cache control pour forcer le rafraîchissement
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          },
        ],
      },
      // Images peuvent être cachées plus longtemps
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
      // Logos peuvent être cachés (minuscule pour correspondre au dossier réel)
      {
        source: '/logos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
      // Venues images peuvent être cachées
      {
        source: '/venues/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(config);