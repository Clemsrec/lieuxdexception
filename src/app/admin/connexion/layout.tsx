/**
 * Layout pour la page de connexion admin
 * Sans navigation pour des raisons de sécurité
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connexion Admin - Lieux d\'Exception',
  description: 'Connexion à l\'espace d\'administration',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConnexionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
