'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, RefreshCw, Home, Eye } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';

/**
 * Page Analytics Admin - Statistiques générales du site
 * - Statistiques des lieux actifs
 * - Statistiques générales du site
 * - Bouton refresh
 * 
 * Note: Les leads sont maintenant gérés exclusivement dans Odoo CRM
 */

interface AnalyticsData {
  totalVenues: number;
  activeVenues: number;
  marriageVenues: number;
  b2bVenues: number;
  lastUpdated: Date;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadAnalytics();
  }, []);

  /**
   * Charger les statistiques des lieux depuis Firestore
   */
  const loadAnalytics = async () => {
    if (!db) return;
    
    setLoading(true);
    try {
      // Charger les lieux depuis Firestore
      const venuesSnapshot = await getDocs(collection(db, 'venues'));
      
      const venuesData = venuesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Array<{
        id: string;
        isActive?: boolean;
        eventTypes?: string[];
        [key: string]: any;
      }>;
      
      // Calculer les statistiques des lieux
      const analyticsData: AnalyticsData = {
        totalVenues: venuesData.length,
        activeVenues: venuesData.filter(venue => venue.isActive === true).length,
        marriageVenues: venuesData.filter(venue => venue.eventTypes?.includes('marriage')).length,
        b2bVenues: venuesData.filter(venue => venue.eventTypes?.includes('b2b')).length,
        lastUpdated: new Date(),
      };
      
      setAnalytics(analyticsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-secondary">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Chargement des analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary mb-2">
              Analytics
            </h1>
            <p className="text-secondary">
              Statistiques des lieux d'exception
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <p className="text-sm text-secondary">
              Dernière mise à jour : {lastUpdated.toLocaleTimeString('fr-FR')}
            </p>
            <button
              onClick={loadAnalytics}
              className="btn-ghost btn-sm flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary mb-1">Total Lieux</p>
                <p className="text-2xl font-bold text-primary">
                  {analytics?.totalVenues || 0}
                </p>
              </div>
              <Home className="w-8 h-8 text-accent" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary mb-1">Lieux Actifs</p>
                <p className="text-2xl font-bold text-primary">
                  {analytics?.activeVenues || 0}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary mb-1">Mariages</p>
                <p className="text-2xl font-bold text-primary">
                  {analytics?.marriageVenues || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-pink-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary mb-1">Événements B2B</p>
                <p className="text-2xl font-bold text-primary">
                  {analytics?.b2bVenues || 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Gestion des Demandes de Contact
          </h2>
          <p className="text-secondary mb-4">
            Les demandes de contact (leads) sont maintenant gérées exclusivement dans <strong>Odoo CRM</strong>.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Accès Odoo :</strong> <a href="https://groupe-lr.odoo.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">https://groupe-lr.odoo.com</a>
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Toutes les demandes de contact sont automatiquement synchronisées vers Odoo dès leur soumission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}