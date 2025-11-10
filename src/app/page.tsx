import FirebaseTest from '@/components/FirebaseTest';
import Icon from '@/components/ui/Icon';

/**
 * Page d'accueil - Lieux d'Exception
 * 
 * Site catalogue B2B du Groupe Riou présentant 5 lieux événementiels
 * d'exception en France pour événements professionnels et mariages.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full space-y-8">
        
        {/* Header principal */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-balance mb-8">
            Bienvenue sur Lieux d&apos;Exception
          </h1>
          <p className="text-center text-lg text-secondary mb-8">
            Catalogue B2B du Groupe Riou - 5 lieux événementiels d&apos;exception en France
          </p>
        </div>

        {/* Test de connexion Firebase */}
        <FirebaseTest />
        
        {/* Grille des services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Événements B2B */}
          <div className="venue-card">
            <h2 className="text-xl font-semibold mb-2">Événements B2B</h2>
            <p className="text-secondary mb-4">
              Séminaires, conférences et événements professionnels dans des lieux d&apos;exception
            </p>
            <ul className="text-sm text-secondary space-y-1">
              <li>• Séminaires d&apos;entreprise</li>
              <li>• Conférences et formations</li>
              <li>• Team building</li>
              <li>• Événements corporate</li>
            </ul>
          </div>
          
          {/* Mariages */}
          <div className="venue-card">
            <h2 className="text-xl font-semibold mb-2">Mariages</h2>
            <p className="text-secondary mb-4">
              Réceptions de mariage dans des cadres exceptionnels et romantiques
            </p>
            <ul className="text-sm text-secondary space-y-1">
              <li>• Cérémonies personnalisées</li>
              <li>• Réceptions privées</li>
              <li>• Week-ends de mariage</li>
              <li>• Services sur mesure</li>
            </ul>
          </div>
          
          {/* Catalogue interactif */}
          <div className="venue-card">
            <h2 className="text-xl font-semibold mb-2">5 Lieux d&apos;Exception</h2>
            <p className="text-secondary mb-4">
              Découvrez notre collection soigneusement sélectionnée en France
            </p>
            <ul className="text-sm text-secondary space-y-1">
              <li>• Châteaux historiques</li>
              <li>• Domaines viticoles</li>
              <li>• Lieux contemporains</li>
              <li>• Espaces atypiques</li>
            </ul>
          </div>
          
        </div>

        {/* Fonctionnalités techniques */}
        <div className="mt-12 p-6 bg-muted rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Fonctionnalités Disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Icon type="target" size={16} className="mr-2" aria-label="Ciblage" />
                Ciblage
              </h4>
              <ul className="space-y-1 text-secondary">
                <li>• Filtres par capacité et budget</li>
                <li>• Recherche géographique</li>
                <li>• Tri par type d&apos;événement</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">📝 Génération de Leads</h4>
              <ul className="space-y-1 text-secondary">
                <li>• Formulaires qualifiés B2B/Mariage</li>
                <li>• Intégration Odoo automatique</li>
                <li>• Suivi des conversions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🌍 Multilingue</h4>
              <ul className="space-y-1 text-secondary">
                <li>• 6 langues disponibles</li>
                <li>• SEO optimisé par langue</li>
                <li>• Détection automatique</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Icon type="barChart" size={16} />
                Administration
              </h4>
              <ul className="space-y-1 text-secondary">
                <li>• Dashboard temps réel</li>
                <li>• Analytics intégrés</li>
                <li>• Gestion de contenu</li>
              </ul>
            </div>
          </div>
        </div>
        
      </div>
    </main>
  );
}