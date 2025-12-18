/**
 * Layout dédié à l'espace admin
 * Design minimaliste et professionnel pour le backoffice
 */

import { Metadata } from 'next';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AuthCheck from '@/components/admin/AuthCheck';

export const metadata: Metadata = {
  title: 'Administration - Lieux d\'Exception',
  description: 'Espace d\'administration',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AuthCheck />
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
