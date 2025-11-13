/**
 * Configuration Next.js pour Lieux d'Exception
 * Compatible avec Firebase App Hosting
 * 
 * Dernière mise à jour : 13 novembre 2025
 * @type {import('next').NextConfig}
 */

const path = require('path');

// Configuration de base
const config = {
  // ✅ CRITIQUE : Output standalone pour Firebase App Hosting
  output: 'standalone',
  
  // Configuration webpack pour résoudre les aliases @ (nécessaire pour Firebase)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    return config;
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

module.exports = config;