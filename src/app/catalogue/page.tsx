import type { Metadata } from 'next';
import Link from 'next/link';
import { getVenues } from '@/lib/firestore';
import VenueCatalog from '@/components/VenueCatalog';

// ISR : Cache avec revalidation toutes les 30 minutes
export const revalidate = 1800;

/**
 * Métadonnées pour la page Catalogue
 * Présentation des lieux d'exception avec filtres interactifs
 */
export const metadata: Metadata = {
  title: 'Catalogue des Lieux | Lieux d\'Exception - Groupe Riou',
  description: 'Découvrez notre collection de lieux événementiels d\'exception en France. Filtres par capacité, localisation et type d\'événement.',
  keywords: 'catalogue lieux, événements, mariages, séminaires, châteaux, domaines',
};

/**
 * Page Catalogue - Présentation des lieux d'exception
 * 
 * Cette page affiche tous les lieux disponibles avec un système
 * de filtrage avancé pour les événements B2B et mariages.
 */
export default async function CataloguePage() {
  // Récupérer tous les lieux actifs
  const venues = await getVenues({ featured: true });

  return (
    <main className="min-h-screen">
      
      {/* Hero Section */}
      <section className="section-alt py-12 md:py-16">
        <div className="section-container">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-primary mb-6 animate-fade-in">
              Catalogue des Lieux d&apos;Exception
            </h1>
            <div className="accent-line" />
            <p className="text-lg md:text-xl text-secondary leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Découvrez notre sélection de {venues.length} lieux événementiels d&apos;exception en France, 
              parfaits pour vos événements professionnels et mariages.
            </p>
          </div>
        </div>
      </section>

      {/* Catalogue avec filtres */}
      <section className="section">
        <div className="section-container">
          <VenueCatalog venues={venues} />
        </div>
      </section>

      {/* Section contact */}
      <section className="section">
        <div className="section-container">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-primary mb-4">
              Besoin d&apos;aide pour choisir ?
            </h2>
            <p className="text-secondary text-base md:text-lg mb-6 md:mb-8">
              Nos experts sont là pour vous conseiller et vous aider à trouver 
              le lieu parfait pour votre événement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact" className="btn-primary">
                Demander un devis
              </Link>
              <a href="tel:0602037011" className="btn-secondary text-sm md:text-base">
                <span className="text-xs uppercase tracking-wider mr-2">Tel</span>
                06 02 03 70 11
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}