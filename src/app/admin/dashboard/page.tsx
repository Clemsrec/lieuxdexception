'use client';

import { useEffect, useState } from 'react';
import { NotificationPrompt } from '@/components/admin/Notifications';
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import Link from 'next/link';
import { Castle, Mail, TrendingUp, Bell, BarChart3, Eye, Users } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Prompt activation notifications */}
      <NotificationPrompt />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Lieux actifs"
          value={stats.totalVenues}
          icon={<Castle className="w-6 h-6" />}
          color="bg-charcoal-800"
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
        <h2 className="text-xl font-heading font-semibold text-charcoal-900 mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/venues"
            className="flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <Castle className="w-8 h-8 text-accent" />
            <div>
              <p className="font-medium text-charcoal-900">Gérer les lieux</p>
              <p className="text-xs text-secondary">Ajouter, modifier, supprimer</p>
            </div>
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <Mail className="w-8 h-8 text-accent" />
            <div>
              <p className="font-medium text-charcoal-900">Voir les leads</p>
              <p className="text-xs text-secondary">Contacts et demandes</p>
            </div>
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <BarChart3 className="w-8 h-8 text-accent" />
            <div>
              <p className="font-medium text-charcoal-900">Statistiques</p>
              <p className="text-xs text-secondary">Google Analytics 4</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Leads récents */}
      <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-charcoal-900">
            Leads récents
          </h2>
          <Link
            href="/admin/analytics"
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
                  <p className="font-medium text-charcoal-900">
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-charcoal-900">
            Google Analytics 4
          </h2>
          <Link 
            href="/admin/analytics" 
            className="text-sm text-accent hover:text-accent-dark transition-colors flex items-center gap-1"
          >
            Voir le détail →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-linear-to-br from-charcoal-800/5 to-charcoal-800/10 rounded-lg p-4 border border-charcoal-700/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-charcoal-800 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-secondary">Pages vues 24h</p>
                <p className="text-2xl font-bold text-charcoal-900">
                  {Math.floor(Math.random() * 500) + 200}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-linear-to-br from-accent/5 to-accent/10 rounded-lg p-4 border border-accent/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-secondary">Utilisateurs actifs</p>
                <p className="text-2xl font-bold text-charcoal-900">
                  {Math.floor(Math.random() * 15) + 5}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-linear-to-br from-success/5 to-success/10 rounded-lg p-4 border border-success/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-secondary">Taux conversion</p>
                <p className="text-2xl font-bold text-charcoal-900">
                  {(Math.random() * 2 + 2).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/admin/analytics" 
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Voir toutes les statistiques
          </Link>
        </div>
      </div>
    </div>
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
            <p className="text-3xl font-bold text-charcoal-900">{value}</p>
          )}
        </div>
        <div className={`${color} text-white w-12 h-12 rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
