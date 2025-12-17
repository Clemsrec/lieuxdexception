'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, Users, Eye, Clock, MousePointer, Globe, 
  Smartphone, Monitor, RefreshCw, Calendar 
} from 'lucide-react';
import { collection, getDocs, query, where, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';

/**
 * Page Analytics Admin - Stats en temps réel
 * - Graphiques Recharts
 * - Stats GA4 (simulées pour le moment)
 * - Stats Firestore (leads, venues)
 */

interface AnalyticsData {
  // Stats temps réel
  activeUsers: number;
  pageViews24h: number;
  avgSessionDuration: string;
  bounceRate: number;
  
  // Stats par période
  dailyStats: Array<{ date: string; visitors: number; pageViews: number; leads: number }>;
  topPages: Array<{ page: string; views: number; percentage: number }>;
  deviceStats: Array<{ name: string; value: number }>;
  venueViews: Array<{ venue: string; views: number }>;
  
  // Leads
  leadsToday: number;
  leadsThisWeek: number;
  leadsThisMonth: number;
  leadsByType: Array<{ type: string; count: number; color: string }>;
}

const COLORS = {
  primary: '#1c1917', // charcoal-900
  accent: '#C9A961',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#44403c', // stone-700
};

const DEVICE_COLORS = ['#1c1917', '#44403c', '#78716c']; // charcoal-900, stone-700, stone-500

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    activeUsers: 0,
    pageViews24h: 0,
    avgSessionDuration: '0:00',
    bounceRate: 0,
    dailyStats: [],
    topPages: [],
    deviceStats: [],
    venueViews: [],
    leadsToday: 0,
    leadsThisWeek: 0,
    leadsThisMonth: 0,
    leadsByType: [],
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadAnalytics();
    // Refresh toutes les 60 secondes
    const interval = setInterval(() => {
      loadAnalytics();
      setLastUpdate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    if (!db) return;

    try {
      // 1. Stats Firestore réelles
      const leadsSnapshot = await getDocs(collection(db, 'leads'));
      const leads = leadsSnapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Array<{ createdAt: Date; type: string; [key: string]: any }>;

      // Leads par période
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const leadsToday = leads.filter(l => l.createdAt >= today).length;
      const leadsThisWeek = leads.filter(l => l.createdAt >= thisWeek).length;
      const leadsThisMonth = leads.filter(l => l.createdAt >= thisMonth).length;

      // Leads par type
      const b2bCount = leads.filter(l => l.type === 'b2b').length;
      const mariageCount = leads.filter(l => l.type === 'mariage').length;

      // 2. Stats journalières (30 derniers jours avec leads réels)
      const dailyStats = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        
        const leadsCount = leads.filter(
          l => l.createdAt >= dayStart && l.createdAt < dayEnd
        ).length;

        dailyStats.push({
          date: dateStr,
          visitors: Math.floor(Math.random() * 50) + 20, // Simulé
          pageViews: Math.floor(Math.random() * 200) + 50, // Simulé
          leads: leadsCount, // Réel
        });
      }

      // 3. Stats devices (simulées - à connecter GA4 plus tard)
      const deviceStats = [
        { name: 'Mobile', value: 65 },
        { name: 'Desktop', value: 30 },
        { name: 'Tablette', value: 5 },
      ];

      // 4. Top pages (simulées - à connecter GA4 plus tard)
      const topPages = [
        { page: '/fr', views: 1250, percentage: 35 },
        { page: '/fr/lieux/chateau-brulaire', views: 450, percentage: 13 },
        { page: '/fr/mariages', views: 380, percentage: 11 },
        { page: '/fr/evenements-b2b', views: 320, percentage: 9 },
        { page: '/fr/lieux/le-dome', views: 280, percentage: 8 },
      ];

      // 5. Vues par lieu (simulées - à connecter GA4 plus tard)
      const venueViews = [
        { venue: 'Château de la Brûlaire', views: 450 },
        { venue: 'Le Dôme', views: 280 },
        { venue: 'Manoir de la Boulaie', views: 220 },
        { venue: 'Domaine Nantais', views: 180 },
        { venue: 'Château de la Corbe', views: 150 },
      ];

      setAnalytics({
        // Stats temps réel (simulées)
        activeUsers: Math.floor(Math.random() * 15) + 5,
        pageViews24h: Math.floor(Math.random() * 500) + 200,
        avgSessionDuration: `${Math.floor(Math.random() * 3) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        bounceRate: Math.floor(Math.random() * 20) + 40,
        
        dailyStats,
        topPages,
        deviceStats,
        venueViews,
        
        // Leads réels
        leadsToday,
        leadsThisWeek,
        leadsThisMonth,
        leadsByType: [
          { type: 'B2B', count: b2bCount, color: COLORS.primary },
          { type: 'Mariage', count: mariageCount, color: COLORS.accent },
        ],
      });
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
              <p className="text-lg text-secondary">Chargement des statistiques...</p>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-charcoal-900 mb-2">
                Statistiques & Analytics
              </h1>
              <p className="text-secondary">
                Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
              </p>
            </div>
            <button
              onClick={() => {
                loadAnalytics();
                setLastUpdate(new Date());
              }}
              className="btn btn-secondary flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
          </div>

          {/* Stats Cards Temps Réel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Utilisateurs actifs"
              value={analytics.activeUsers}
              icon={<Users className="w-5 h-5" />}
              color="bg-success"
              subtitle="En ce moment"
            />
            <MetricCard
              title="Pages vues 24h"
              value={analytics.pageViews24h}
              icon={<Eye className="w-5 h-5" />}
              color="bg-charcoal-800"
              subtitle="Dernières 24h"
            />
            <MetricCard
              title="Durée moyenne"
              value={analytics.avgSessionDuration}
              icon={<Clock className="w-5 h-5" />}
              color="bg-accent"
              subtitle="Par session"
              isTime
            />
            <MetricCard
              title="Taux de rebond"
              value={`${analytics.bounceRate}%`}
              icon={<MousePointer className="w-5 h-5" />}
              color="bg-info"
              subtitle="Visiteurs 1 page"
              isPercent
            />
          </div>

          {/* Stats Leads */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-secondary">Leads aujourd&apos;hui</p>
                <Calendar className="w-5 h-5 text-success" />
              </div>
              <p className="text-3xl font-bold text-charcoal-900">{analytics.leadsToday}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-secondary">Leads 7 derniers jours</p>
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <p className="text-3xl font-bold text-charcoal-900">{analytics.leadsThisWeek}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-secondary">Leads ce mois</p>
                <Globe className="w-5 h-5 text-charcoal-900" />
              </div>
              <p className="text-3xl font-bold text-charcoal-900">{analytics.leadsThisMonth}</p>
            </div>
          </div>

          {/* Graphiques principaux */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique visiteurs & pages vues */}
            <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
              <h3 className="text-lg font-heading font-semibold text-charcoal-900 mb-4">
                Trafic 30 derniers jours
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.dailyStats}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#888" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#888" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="visitors" 
                    name="Visiteurs"
                    stroke={COLORS.primary} 
                    fillOpacity={1} 
                    fill="url(#colorVisitors)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pageViews" 
                    name="Pages vues"
                    stroke={COLORS.accent} 
                    fillOpacity={1} 
                    fill="url(#colorPageViews)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Graphique leads */}
            <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
              <h3 className="text-lg font-heading font-semibold text-charcoal-900 mb-4">
                Leads 30 derniers jours
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#888" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#888" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="leads" name="Leads" fill={COLORS.success} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Répartition */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leads par type */}
            <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
              <h3 className="text-lg font-heading font-semibold text-charcoal-900 mb-4">
                Leads par type
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analytics.leadsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.type}: ${((entry.percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.leadsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {analytics.leadsByType.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-secondary">{item.type}</span>
                    </div>
                    <span className="font-semibold text-charcoal-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Devices */}
            <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
              <h3 className="text-lg font-heading font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Par appareil
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analytics.deviceStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.deviceStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top pages */}
            <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
              <h3 className="text-lg font-heading font-semibold text-charcoal-900 mb-4">
                Pages les plus vues
              </h3>
              <div className="space-y-3">
                {analytics.topPages.slice(0, 5).map((page, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-secondary truncate flex-1">{page.page}</span>
                      <span className="font-semibold text-charcoal-900 ml-2">{page.views}</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-accent rounded-full h-2 transition-all"
                        style={{ width: `${page.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vues par lieu */}
          <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
            <h3 className="text-lg font-heading font-semibold text-charcoal-900 mb-4">
              Vues par lieu
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.venueViews} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#888" style={{ fontSize: '12px' }} />
                <YAxis dataKey="venue" type="category" stroke="#888" style={{ fontSize: '12px' }} width={150} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="views" fill={COLORS.primary} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Note GA4 */}
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Globe className="w-6 h-6 text-accent shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-charcoal-900 mb-2">
                  Google Analytics 4 configuré
                </h4>
                <p className="text-sm text-secondary mb-3">
                  ID de mesure: <code className="bg-white px-2 py-1 rounded text-accent font-mono">G-0ZM7ZL3PYB</code>
                </p>
                <p className="text-sm text-secondary">
                  Les données affichées combinent des statistiques réelles (leads Firestore) 
                  et des données simulées. Pour afficher les vraies données GA4, connectez l&apos;API Google Analytics Data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

// Composant carte métrique
interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle: string;
  isTime?: boolean;
  isPercent?: boolean;
}

function MetricCard({ title, value, icon, color, subtitle, isTime, isPercent }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-xs font-medium text-secondary mb-1">{title}</p>
          <p className="text-2xl font-bold text-charcoal-900">
            {isTime || isPercent ? value : typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </p>
        </div>
        <div className={`${color} text-white w-10 h-10 rounded-lg flex items-center justify-center shrink-0`}>
          {icon}
        </div>
      </div>
      <p className="text-xs text-secondary">{subtitle}</p>
    </div>
  );
}
