/**
 * Layout racine minimal
 * Le vrai layout avec i18n est dans app/[locale]/layout.tsx
 * Ce layout ne fait rien, il laisse Next.js router vers [locale]
 */

import './globals.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { EB_Garamond, Bodoni_Moda } from 'next/font/google';

/**
 * Police EB Garamond - Police pour le texte body
 */
const ebGaramond = EB_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-garamond',
});

/**
 * Police Bodoni Moda - Police pour les titres
 */
const bodoniModa = Bodoni_Moda({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-bodoni',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="fr" className={`${ebGaramond.variable} ${bodoniModa.variable}`}>
      <head>
        <GoogleAnalytics />
      </head>
      <body className="antialiased m-0 p-0">{children}</body>
    </html>
  );
}