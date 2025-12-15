import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * Métadonnées pour l'interface d'administration
 */
export const metadata: Metadata = {
  title: 'Administration | Lieux d\'Exception - Groupe Riou',
  description: 'Dashboard d\'administration pour la gestion des lieux, leads et analytics.',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Page Administration
 * 
 * Dashboard principal pour la gestion du back-office :
 * - Statistiques temps réel
 * - Gestion des leads
 * - Analytics et métriques
 * - Gestion de contenu
 */
export default function AdminPage() {
  return (
    <div className="section-container py-12">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Administration</h1>
          <p className="text-secondary">Gestion centralisée des lieux d&apos;exception</p>
        </div>
        
        {/* Actions rapides */}
        <div className="flex gap-3">
          <button className="btn-primary">
            Nouveau lieu
          </button>
          <button className="border border-border px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            Export données
          </button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        
        <div className="venue-card text-center">
          <div className="text-3xl font-bold text-primary mb-2">24</div>
          <p className="text-sm text-secondary">Leads ce mois</p>
          <div className="text-xs text-green-600 mt-1">+15% vs mois dernier</div>
        </div>

        <div className="venue-card text-center">
          <div className="text-3xl font-bold text-accent mb-2">5</div>
          <p className="text-sm text-secondary">Lieux actifs</p>
          <div className="text-xs text-secondary mt-1">Tous opérationnels</div>
        </div>

        <div className="venue-card text-center">
          <div className="text-3xl font-bold text-primary mb-2">68%</div>
          <p className="text-sm text-secondary">Taux conversion</p>
          <div className="text-xs text-green-600 mt-1">+5% vs mois dernier</div>
        </div>

        <div className="venue-card text-center">
          <div className="text-3xl font-bold text-secondary mb-2">1,247</div>
          <p className="text-sm text-secondary">Visiteurs ce mois</p>
          <div className="text-xs text-green-600 mt-1">+8% vs mois dernier</div>
        </div>
      </div>

      {/* Derniers leads */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Derniers leads reçus</h2>
        
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Événement</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                
                <tr className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">Sophie Martin</div>
                      <div className="text-sm text-secondary">sophie.martin@entreprise.com</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                      B2B
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">Séminaire - 50 pers.</td>
                  <td className="px-4 py-3 text-sm text-secondary">Il y a 2h</td>
                  <td className="px-4 py-3">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                      Nouveau
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:text-primary/80 text-sm">
                      Traiter
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">Pierre & Julie</div>
                      <div className="text-sm text-secondary">contact@pierreetjulie.fr</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-xs">
                      Mariage
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">Réception - 120 invités</td>
                  <td className="px-4 py-3 text-sm text-secondary">Il y a 4h</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      Contacté
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:text-primary/80 text-sm">
                      Suivre
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">Tech Corp</div>
                      <div className="text-sm text-secondary">events@techcorp.com</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                      B2B
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">Conférence - 200 pers.</td>
                  <td className="px-4 py-3 text-sm text-secondary">Hier</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Qualifié
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-primary hover:text-primary/80 text-sm">
                      Devis
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section Lieux */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Gestion des Lieux</h2>
        <p className="text-secondary mb-4">
          Cette section sera développée pour gérer les 5 lieux d&apos;exception.
        </p>
      </section>

      {/* Actions rapides */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="venue-card text-left hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                
              </div>
              <div>
                <h3 className="font-semibold">Analytics détaillés</h3>
                <p className="text-secondary text-sm">Voir les métriques complètes</p>
              </div>
            </div>
          </button>

          <button className="venue-card text-left hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                
              </div>
              <div>
                <h3 className="font-semibold">Campagnes email</h3>
                <p className="text-secondary text-sm">Gérer les communications</p>
              </div>
            </div>
          </button>

          <button className="venue-card text-left hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mr-3">
                
              </div>
              <div>
                <h3 className="font-semibold">Paramètres</h3>
                <p className="text-secondary text-sm">Configuration du site</p>
              </div>
            </div>
          </button>
        </div>
      </section>

    </div>
  );
}