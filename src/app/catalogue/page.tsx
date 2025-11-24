import type { Metadata } from 'next';
import Link from 'next/link';
import { getVenues } from '@/lib/firestore';
import VenueCatalog from '@/components/VenueCatalog';
import HeroSection from '@/components/HeroSection';
import { generateCatalogueMetadata } from '@/lib/smartMetadata';
import { generateUniversalStructuredData, generateFAQSchema } from '@/lib/universalStructuredData';

// ISR : Cache avec revalidation toutes les 30 minutes
export const revalidate = 1800;

/**
 * Métadonnées SEO optimisées via système universel
 */
export const metadata: Metadata = generateCatalogueMetadata();

/**
 * Page Catalogue - Présentation des lieux d'exception
 * 
 * Cette page affiche tous les lieux disponibles avec un système
 * de filtrage avancé pour les événements B2B et mariages.
 */
export default async function CataloguePage() {
  // Récupérer tous les lieux actifs
  const venues = await getVenues({ featured: true });

  // Générer structured data
  const catalogueSchema = generateUniversalStructuredData({
    siteType: 'corporate',
    pageType: 'catalogue',
    data: { venues },
    url: 'https://lieuxdexception.fr/catalogue'
  });

  const faqSchema = generateFAQSchema('catalogue');

  return (
    <main className="min-h-screen">
      
      {/* Structured Data */}
      {catalogueSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogueSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      
      {/* Hero Section */}
      <HeroSection
        title="Catalogue des Lieux d'Exception"
        subtitle="Découvrez nos domaines"
        description={`Notre sélection de ${venues.length} lieux événementiels d'exception en France, parfaits pour vos événements professionnels et mariages.`}
        backgroundImage="/images/Vue-chateau.jpg"
        buttons={[
          { label: "Demander un devis", href: "/contact", primary: true },
          { label: "Appeler", href: "tel:0602037011", primary: false }
        ]}
      />

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