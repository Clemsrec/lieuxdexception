/**
 * Layout dédié à l'espace admin
 * Design minimaliste et professionnel pour le backoffice
 * 
 * Note: La page /admin/connexion a son propre layout et n'est pas protégée
 */

'use client';

import { usePathname } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AuthCheck from '@/components/admin/AuthCheck';

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Ne pas protéger la page de connexion
  if (pathname === '/admin/connexion') {
    return <>{children}</>;
  }

  // Protéger toutes les autres pages admin
  return (
    <ProtectedRoute>
      <AuthCheck />
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
