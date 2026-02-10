'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, authActions } from '@/lib/auth';
import { NotificationList } from '@/components/admin/Notifications';
import Image from 'next/image';
import { LayoutDashboard, Castle, Mail, BarChart3, Settings, Zap, Users, Image as ImageIcon, FileText, Clock } from 'lucide-react';

/**
 * Layout admin avec sidebar navigation
 */
interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    try {
      await authActions.signOut();
      router.push('/admin/connexion');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Lieux',
      href: '/admin/venues',
      icon: Castle,
    },
    {
      label: 'Contenus',
      href: '/admin/contenus',
      icon: FileText,
    },
    {
      label: 'Timeline',
      href: '/admin/timeline',
      icon: Clock,
    },
    {
      label: 'Galerie',
      href: '/admin/galerie',
      icon: ImageIcon,
    },
    {
      label: 'Assets',
      href: '/admin/assets',
      icon: Settings,
    },
    {
      label: 'Utilisateurs',
      href: '/admin/users',
      icon: Users,
    },
    {
      label: 'Statistiques',
      href: '/admin/analytics',
      icon: BarChart3,
    },
  ];

  return (
    <div className="h-screen bg-neutral-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-charcoal-900 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } flex flex-col h-full shrink-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          {sidebarOpen ? (
            <div>
              <h2 className="text-xl font-heading font-semibold">Admin</h2>
              <p className="text-xs text-white/70 mt-1">Lieux d&apos;Exception</p>
            </div>
          ) : (
            <Zap className="w-6 h-6" />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-neutral-200 text-charcoal-900 font-medium'
                    : 'hover:bg-white/10 text-white/90 hover:text-white'
                }`}
              >
                <IconComponent className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User info + déconnexion */}
        <div className="p-4 border-t border-white/10">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-xs text-white/70">Connecté en tant que</p>
              <p className="text-sm font-medium truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white/90 hover:text-white"
          >
            <span className="text-xl">🚪</span>
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>

        {/* Toggle sidebar */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 border-t border-white/10 hover:bg-white/10 transition-colors text-white/70 hover:text-white text-center"
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 px-8 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-heading font-semibold text-charcoal-900">
              {menuItems.find((item) => item.href === pathname)?.label || 'Administration'}
            </h1>
            <div className="flex items-center gap-4">
              {/* Cloche notifications */}
              <NotificationList notifications={[]} />
              
              <Link
                href="/fr"
                target="_blank"
                className="text-sm text-secondary hover:text-charcoal-900 transition-colors"
              >
                Voir le site →
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
