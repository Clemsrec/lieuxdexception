import type { Metadata } from 'next';
import Icon from '@/components/ui/Icon';

/**
 * Métadonnées pour la page Catalogue
 * Présentation des 5 lieux d'exception avec filtres interactifs
 */
export const metadata: Metadata = {
  title: 'Catalogue des Lieux | Lieux d\'Exception - Groupe Riou',
  description: 'Découvrez notre collection de 5 lieux événementiels d\'exception en France. Filtres par capacité, localisation et type d\'événement.',
  keywords: 'catalogue lieux, événements, mariages, séminaires, châteaux, domaines',
};

/**
 * Page Catalogue - Présentation des 5 lieux d'exception
 * 
 * Cette page affiche tous les lieux disponibles avec un système
 * de filtrage avancé pour les événements B2B et mariages.
 */
export default function CataloguePage() {
  return (
    <div className="section-container py-12">
      
      {/* Header de la page */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-balance mb-6">
          Catalogue des Lieux d&apos;Exception
        </h1>
        <p className="text-lg text-secondary max-w-3xl mx-auto">
          Découvrez notre sélection de 5 lieux événementiels d&apos;exception en France, 
          parfaits pour vos événements professionnels et mariages.
        </p>
      </div>

      {/* Filtres de recherche */}
      <div className="bg-muted rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Filtrer par vos critères</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Type d'événement */}
          <div>
            <label className="block text-sm font-medium mb-2">Type d&apos;événement</label>
            <select className="w-full p-2 border border-border rounded-lg bg-background">
              <option value="all">Tous les événements</option>
              <option value="b2b">Événements B2B</option>
              <option value="wedding">Mariages</option>
            </select>
          </div>

          {/* Capacité */}
          <div>
            <label className="block text-sm font-medium mb-2">Capacité</label>
            <select className="w-full p-2 border border-border rounded-lg bg-background">
              <option value="">Toutes capacités</option>
              <option value="50">Jusqu&apos;à 50 personnes</option>
              <option value="100">Jusqu&apos;à 100 personnes</option>
              <option value="200">Jusqu&apos;à 200 personnes</option>
              <option value="500">Plus de 200 personnes</option>
            </select>
          </div>

          {/* Région */}
          <div>
            <label className="block text-sm font-medium mb-2">Région</label>
            <select className="w-full p-2 border border-border rounded-lg bg-background">
              <option value="">Toutes les régions</option>
              <option value="ile-de-france">Île-de-France</option>
              <option value="provence">Provence-Alpes-Côte d&apos;Azur</option>
              <option value="bourgogne">Bourgogne-Franche-Comté</option>
              <option value="loire">Pays de la Loire</option>
              <option value="normandie">Normandie</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium mb-2">Budget (par jour)</label>
            <select className="w-full p-2 border border-border rounded-lg bg-background">
              <option value="">Tous budgets</option>
              <option value="5000">Jusqu&apos;à 5 000€</option>
              <option value="10000">Jusqu&apos;à 10 000€</option>
              <option value="15000">Jusqu&apos;à 15 000€</option>
              <option value="20000">Plus de 15 000€</option>
            </select>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-between items-center mt-6">
          <button className="text-secondary hover:text-foreground transition-colors">
            Réinitialiser les filtres
          </button>
          <button className="btn-primary">
            Appliquer les filtres
          </button>
        </div>
      </div>

      {/* Grille des lieux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        
        {/* Lieu 1 - Exemple */}
        <div className="venue-card group">
          <div className="relative mb-4 overflow-hidden rounded-lg">
            <div className="w-full h-64 bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Icon type="castle" size={80} className="opacity-50" />
            </div>
            <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
              Mis en avant
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Château de Exemple</h3>
          <p className="text-secondary text-sm mb-3">
            Région Île-de-France • Capacité 200 personnes
          </p>
          <p className="text-sm mb-4 line-clamp-3">
            Un château historique du XVIIIe siècle offrant un cadre majestueux 
            pour vos événements les plus prestigieux. Parfait pour les mariages 
            et événements corporate de luxe.
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
              Mariages
            </span>
            <span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-xs">
              Séminaires
            </span>
            <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs">
              Hébergement
            </span>
          </div>

          {/* Prix et CTA */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-secondary">À partir de</span>
              <div className="font-semibold text-lg">8 500€<span className="text-sm text-secondary">/jour</span></div>
            </div>
            <button className="btn-primary text-sm px-4 py-2">
              Découvrir
            </button>
          </div>
        </div>

        {/* Cartes de lieux supplémentaires */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="venue-card">
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center mb-4">
              <span className="text-secondary text-sm">
                Lieu {index + 2} - Photos à venir
              </span>
            </div>
            
            <h3 className="text-xl font-semibold mb-2">Lieu d&apos;Exception {index + 2}</h3>
            <p className="text-secondary text-sm mb-3">
              Région à définir • Capacité à définir
            </p>
            <p className="text-sm mb-4 text-secondary">
              Description détaillée du lieu à venir...
            </p>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary">Tarifs sur demande</span>
              <button className="btn-primary text-sm px-4 py-2">
                Bientôt disponible
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Section contact */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Besoin d&apos;aide pour choisir ?
        </h2>
        <p className="text-secondary mb-6 max-w-2xl mx-auto">
          Nos experts sont là pour vous conseiller et vous aider à trouver 
          le lieu parfait pour votre événement.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary">
            Demander un devis
          </button>
          <button className="border border-border px-6 py-2 rounded-lg hover:bg-muted transition-colors">
            Nous contacter
          </button>
        </div>
      </div>

    </div>
  );
}