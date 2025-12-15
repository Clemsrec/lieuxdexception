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
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90], // Qualités utilisées (75 par défaut, 90 pour images importantes)
  },
  
  // Désactiver strictMode (cause des problèmes avec Leaflet qui ne supporte pas le double-mount)
  reactStrictMode: false,
  
  // Headers de sécurité (déjà dans middleware.ts mais bon de les avoir ici aussi)
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
        ],
      },
    ];
  },
};

module.exports = withNextIntl(config);