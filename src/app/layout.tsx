/**
 * Layout racine minimal
 * Le vrai layout avec i18n est dans app/[locale]/layout.tsx
 * Ce layout ne fait rien, il laisse Next.js router vers [locale]
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}