/**
 * Configuration Next.js pour Lieux d'Exception
 * Compatible avec Firebase App Hosting et Turbopack
 * 
 * @type {import('next').NextConfig}
 */

// Configuration de base
const config = {
  // Output standalone pour Firebase App Hosting
  output: 'standalone',
  
  // Turbopack est activé via la commande `next dev --turbopack`
  // Pas de configuration spécifique nécessaire pour le build
  
  // Images optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Désactiver strictMode en production pour éviter les double-renders
  reactStrictMode: process.env.NODE_ENV === 'development',
  
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
        ],
      },
    ];
  },
};

module.exports = config;