'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { NotificationPrompt } from '@/components/admin/Notifications';
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import Link from 'next/link';
import { Castle, Mail, TrendingUp, Bell, BarChart3 } from 'lucide-react';

/**
 * Dashboard admin principal
 * - Stats globales (lieux, leads)
 * - Leads récents
 * - Graphiques GA4 (à intégrer)
 */

interface DashboardStats {
  totalVenues: number;
  totalLeads: number;
  leadsThisMonth: number;
  recentLeads: Array<{
    id: string;
    type: string;
    contactInfo: { firstName: string; lastName: string; email: string };
    createdAt: Date;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVenues: 0,
    totalLeads: 0,
    leadsThisMonth: 0,
    recentLeads: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!db) return;

    try {
      // 1. Compter les lieux
      const venuesSnapshot = await getDocs(collection(db, 'venues'));
      const totalVenues = venuesSnapshot.size;

      // 2. Compter les leads
      const leadsSnapshot = await getDocs(collection(db, 'leads'));
      const totalLeads = leadsSnapshot.size;

      // 3. Leads du mois en cours
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const leadsThisMonthSnapshot = await getDocs(
        query(
          collection(db, 'leads'),
          where('createdAt', '>=', Timestamp.fromDate(startOfMonth))
        )
      );
      const leadsThisMonth = leadsThisMonthSnapshot.size;

      // 4. Leads récents (5 derniers)
      const recentLeadsSnapshot = await getDocs(
        query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(5))
      );

      const recentLeads = recentLeadsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as any[];

      setStats({
        totalVenues,
        totalLeads,
        leadsThisMonth,
        recentLeads,
      });
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-8">
          {/* Prompt activation notifications */}
          <NotificationPrompt />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Lieux actifs"
              value={stats.totalVenues}
              icon={<Castle className="w-6 h-6" />}
              color="bg-primary"
              loading={loading}
            />
            <StatCard
              title="Leads totaux"
              value={stats.totalLeads}
              icon={<Mail className="w-6 h-6" />}
              color="bg-accent"
              loading={loading}
            />
            <StatCard
              title="Leads ce mois"
              value={stats.leadsThisMonth}
              icon={<TrendingUp className="w-6 h-6" />}
              color="bg-success"
              loading={loading}
            />
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
            <h2 className="text-xl font-heading font-semibold text-primary mb-4">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/venues"
                className="flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors"
              >
                <Castle className="w-8 h-8 text-accent" />
                <div>
                  <p className="font-medium text-primary">Gérer les lieux</p>
                  <p className="text-xs text-secondary">Ajouter, modifier, supprimer</p>
                </div>
              </Link>
              <Link
                href="/admin/leads"
                className="flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors"
              >
                <Mail className="w-8 h-8 text-accent" />
                <div>
                  <p className="font-medium text-primary">Voir les leads</p>
                  <p className="text-xs text-secondary">Contacts et demandes</p>
                </div>
              </Link>
              <Link
                href="/admin/analytics"
                className="flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors"
              >
                <BarChart3 className="w-8 h-8 text-accent" />
                <div>
                  <p className="font-medium text-primary">Statistiques</p>
                  <p className="text-xs text-secondary">Google Analytics 4</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Leads récents */}
          <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold text-primary">
                Leads récents
              </h2>
              <Link
                href="/admin/leads"
                className="text-sm text-accent hover:text-accent-dark transition-colors"
              >
                Voir tout →
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-8 text-secondary">Chargement...</div>
            ) : stats.recentLeads.length === 0 ? (
              <div className="text-center py-8 text-secondary">Aucun lead pour le moment</div>
            ) : (
              <div className="space-y-3">
                {stats.recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-primary">
                        {lead.contactInfo.firstName} {lead.contactInfo.lastName}
                      </p>
                      <p className="text-sm text-secondary">{lead.contactInfo.email}</p>
                      <p className="text-xs text-secondary mt-1">
                        Type: {lead.type === 'b2b' ? 'B2B' : 'Mariage'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-secondary">
                        {new Date(lead.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Placeholder Google Analytics */}
          <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
            <h2 className="text-xl font-heading font-semibold text-primary mb-4">
              Google Analytics 4
            </h2>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-12 text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-accent" />
              <p className="text-lg font-medium text-primary mb-2">
                Intégration GA4 à venir
              </p>
              <p className="text-secondary text-sm mb-4">
                Stats en temps réel, pages vues, taux de conversion
              </p>
              <Link href="/admin/analytics" className="btn btn-primary inline-block">
                Configurer GA4
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

// Composant carte statistique
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
}

function StatCard({ title, value, icon, color, loading }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-secondary mb-1">{title}</p>
          {loading ? (
            <div className="w-16 h-8 bg-neutral-200 animate-pulse rounded" />
          ) : (
            <p className="text-3xl font-bold text-primary">{value}</p>
          )}
        </div>
        <div className={`${color} text-white w-12 h-12 rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
