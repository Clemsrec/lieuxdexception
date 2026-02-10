'use client';

import { useEffect, useState } from 'react';
import { NotificationPrompt } from '@/components/admin/Notifications';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import Link from 'next/link';
import { Castle, Mail, TrendingUp, Bell, BarChart3, Eye, Users } from 'lucide-react';

/**
 * Dashboard admin principal
 * - Stats globales des lieux
 * - Actions rapides de gestion
 * - Lien vers Odoo pour les leads
 * 
 * Note: Les leads sont maintenant gérés exclusivement dans Odoo CRM
 */

interface DashboardStats {
  totalVenues: number;
  activeVenues: number;
  lastUpdated: Date;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVenues: 0,
    activeVenues: 0,
    lastUpdated: new Date(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!db) return;

    try {
      // Charger les statistiques des lieux
      const venuesSnapshot = await getDocs(collection(db, 'venues'));
      const venuesData = venuesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Array<{
        id: string;
        isActive?: boolean;
        [key: string]: any;
      }>;

      const totalVenues = venuesData.length;
      const activeVenues = venuesData.filter(venue => venue.isActive === true).length;

      setStats({
        totalVenues,
        activeVenues,
        lastUpdated: new Date(),
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Lieux"
          value={stats.totalVenues}
          icon={<Castle className="w-6 h-6" />}
          color="bg-charcoal-800"
          loading={loading}
        />
        <StatCard
          title="Lieux Actifs"
          value={stats.activeVenues}
          icon={<Eye className="w-6 h-6" />}
          color="bg-accent"
          loading={loading}
        />
        <StatCard
          title="Dernière MAJ"
          value={stats.lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-success"
          loading={loading}
          isString={true}
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
          <a
            href="https://groupe-lr.odoo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <Mail className="w-8 h-8 text-accent" />
            <div>
              <p className="font-medium text-charcoal-900">CRM Odoo</p>
              <p className="text-xs text-secondary">Leads et contacts</p>
            </div>
          </a>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <BarChart3 className="w-8 h-8 text-accent" />
            <div>
              <p className="font-medium text-charcoal-900">Statistiques</p>
              <p className="text-xs text-secondary">Analytics des lieux</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Gestion des Leads - Odoo CRM */}
      <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-charcoal-900">
            Gestion des Demandes de Contact
          </h2>
          <a
            href="https://groupe-lr.odoo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:text-accent-dark transition-colors"
          >
            Ouvrir Odoo CRM →
          </a>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-2">
                Toutes les demandes sont dans Odoo CRM
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Les formulaires de contact (B2B et Mariages) synchronisent automatiquement 
                tous les leads vers le CRM Odoo du Groupe LR.
              </p>
              <a
                href="https://groupe-lr.odoo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Accéder à Odoo CRM
              </a>
            </div>
          </div>
        </div>
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
  value: number | string;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
  isString?: boolean;
}

function StatCard({ title, value, icon, color, loading, isString = false }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-secondary mb-1">{title}</p>
          {loading ? (
            <div className="w-16 h-8 bg-neutral-200 animate-pulse rounded" />
          ) : (
            <p className={`${isString ? 'text-xl' : 'text-3xl'} font-bold text-charcoal-900`}>
              {value}
            </p>
          )}
        </div>
        <div className={`${color} text-white w-12 h-12 rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
