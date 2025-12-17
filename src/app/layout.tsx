/**
 * Layout racine minimal
 * Le vrai layout avec i18n est dans app/[locale]/layout.tsx
 * Ce layout ne fait rien, il laisse Next.js router vers [locale]
 */

import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="fr">
      <body className="antialiased m-0 p-0">{children}</body>
    </html>
  );
}