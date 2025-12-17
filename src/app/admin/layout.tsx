/**
 * Layout dédié à l'espace admin
 * Design minimaliste et professionnel pour le backoffice
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administration - Lieux d\'Exception',
  description: 'Espace d\'administration',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
