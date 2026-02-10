'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, RefreshCw, Heart, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';

/**
 * Page Analytics simplifiée - Garde uniquement l'essentiel pour les pages publiques
 * - Statistiques des leads (données réelles Firestore)
 * - Graphique simple des leads par semaine
 * - Bouton refresh
 */

interface Lead {
  id: string;
  type: 'b2b' | 'marriage';
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

interface AnalyticsData {
  totalLeads: number;
  marriageLeads: number;
  b2bLeads: number;
  leadsThisMonth: number;
  leadsGrowth: number;
}

export default function AnalyticsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadAnalytics();
  }, []);

  /**
   * Charger les données analytics depuis Firestore
   */
  const loadAnalytics = async () => {
    if (!db) return;
    
    setLoading(true);
    try {
      const leadsSnapshot = await getDocs(
        query(collection(db, 'leads'), orderBy('createdAt', 'desc'))
      );
      
      const leadsData = leadsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Lead[];
      
      setLeads(leadsData);
      
      // Calculer les statistiques essentielles
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      
      const leadsThisMonth = leadsData.filter(lead => 
        lead.createdAt >= startOfMonth
      ).length;
      
      const leadsLastMonth = leadsData.filter(lead => 
        lead.createdAt >= startOfLastMonth && lead.createdAt <= endOfLastMonth
      ).length;
      
      const growth = leadsLastMonth > 0 
        ? ((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100 
        : leadsThisMonth > 0 ? 100 : 0;
      
      const analyticsData: AnalyticsData = {
        totalLeads: leadsData.length,
        marriageLeads: leadsData.filter(l => l.type === 'marriage').length,
        b2bLeads: leadsData.filter(l => l.type === 'b2b').length,
        leadsThisMonth,
        leadsGrowth: Math.round(growth),
      };
      
      setAnalytics(analyticsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Préparer les données pour le graphique des leads par semaine
   */
  const getWeeklyLeadsData = () => {
    if (!leads.length) return [];
    
    const weeklyData: Record<string, number> = {};
    const now = new Date();
    
    // 4 dernières semaines
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
      const weekEnd = new Date(weekStart.getTime() + (6 * 24 * 60 * 60 * 1000));
      const weekLabel = `S${4-i}`;
      
      const weekLeads = leads.filter(lead => 
        lead.createdAt >= weekStart && lead.createdAt <= weekEnd
      ).length;
      
      weeklyData[weekLabel] = weekLeads;
    }
    
    return Object.entries(weeklyData).map(([week, count]) => ({
      week,
      leads: count,
    }));
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
              Statistiques essentielles des leads et demandes de contact
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
                <p className="text-sm font-medium text-secondary mb-1">Total Leads</p>
                <p className="text-2xl font-bold text-primary">
                  {analytics?.totalLeads || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-accent" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary mb-1">Mariages</p>
                <p className="text-2xl font-bold text-primary">
                  {analytics?.marriageLeads || 0}
                </p>
              </div>
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary mb-1">Événements B2B</p>
                <p className="text-2xl font-bold text-primary">
                  {analytics?.b2bLeads || 0}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary mb-1">Ce mois</p>
                <p className="text-2xl font-bold text-primary">
                  {analytics?.leadsThisMonth || 0}
                </p>
                {analytics?.leadsGrowth !== undefined && (
                  <div className={`flex items-center gap-1 text-sm ${
                    analytics.leadsGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    {analytics.leadsGrowth >= 0 ? '+' : ''}{analytics.leadsGrowth}%
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Graphique Leads par semaine */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-primary mb-6">
            Leads par semaine (4 dernières semaines)
          </h2>
          
          {leads.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getWeeklyLeadsData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} leads`, '']}
                    labelStyle={{ color: '#1c1917' }}
                  />
                  <Bar dataKey="leads" fill="#C9A961" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-secondary">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </div>
    </div>
  );
}