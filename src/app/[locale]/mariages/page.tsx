import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import { generateServiceMetadata } from '@/lib/smartMetadata';
import { generateUniversalStructuredData, generateFAQSchema } from '@/lib/universalStructuredData';
import { getTranslations } from 'next-intl/server';

/**
 * Métadonnées SEO optimisées via système universel
 */
export const metadata: Metadata = generateServiceMetadata(
  'Mariages d\'Exception',
  'Célébrez votre mariage dans nos domaines prestigieux en Loire-Atlantique. Organisation complète et accompagnement personnalisé pour un jour unique.'
);

/**
 * Page Mariages
 * 
 * Cette page présente les services et solutions pour les mariages
 * dans les 5 lieux d'exception du Groupe Riou.
 */
export default async function MariagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Weddings' });
  // Générer structured data
  const serviceSchema = generateUniversalStructuredData({
    siteType: 'corporate',
    pageType: 'service',
    data: {
      name: 'Mariages d\'Exception',
      description: 'Organisation complète de mariages dans nos domaines prestigieux'
    },
    url: 'https://lieuxdexception.fr/mariages'
  });

  const faqSchema = generateFAQSchema('service');

  return (
    <main className="min-h-screen bg-stone-light">
      
      {/* Structured Data */}
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
        title={t('title')}
        subtitle={t('hero')}
        description={t('description')}
        backgroundImage="/images/table-seminaire.jpg"
        buttons={[
          { label: t('requestInfo'), href: `/${locale}/contact`, primary: true }
        ]}
      />

      {/* Galerie de photos mariages - Toutes les images des dossiers mariages/ */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Nos domaines pour vos mariages d&apos;exception
            </h2>
            <div className="accent-line" />
            <p className="text-secondary text-lg mt-6">
              Découvrez nos espaces dédiés aux mariages à travers nos 5 domaines d&apos;exception
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {/* Château de la Brûlaire - 20 images */}
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/brulaire.jpg" alt="Château de la Brûlaire - Mariage" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/brulaire_chambre_1.jpg" alt="Château de la Brûlaire - Chambre" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/brulaire_chambre_2.jpg" alt="Château de la Brûlaire - Chambre" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/brulaire_chambre_3.jpg" alt="Château de la Brûlaire - Chambre" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/brulaire_chambre_4.jpg" alt="Château de la Brûlaire - Chambre" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/brulaire_chambre_5.jpg" alt="Château de la Brûlaire - Chambre" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/brulaire_chambre_6.jpg" alt="Château de la Brûlaire - Chambre" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/brulaire_chambre_7.jpg" alt="Château de la Brûlaire - Chambre" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/brulaire_chambre_8.jpg" alt="Château de la Brûlaire - Chambre" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/brulaire_chambre_9.jpg" alt="Château de la Brûlaire - Chambre" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/brulaire_chambre_19.jpg" alt="Château de la Brûlaire - Chambre" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/mise-en-scene.jpg" alt="Château de la Brûlaire - Mise en scène" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/mise-en-scene.1.jpg" alt="Château de la Brûlaire - Mise en scène" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/mise-en-scene.2.jpg" alt="Château de la Brûlaire - Mise en scène" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/mise-en-scene.3.jpg" alt="Château de la Brûlaire - Mise en scène" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/mise-en-scene.4.jpg" alt="Château de la Brûlaire - Mise en scène" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/mise-en-scene.5.jpg" alt="Château de la Brûlaire - Mise en scène" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/mise-en-scene.6.jpg" alt="Château de la Brûlaire - Mise en scène" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/mariages/mise-en-scene.7.jpg" alt="Château de la Brûlaire - Mise en scène" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>

            {/* Château de la Corbe - 13 images */}
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/mariages/corbe_1.jpg" alt="Château de la Corbe - Mariage" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/mariages/corbe_2.jpg" alt="Château de la Corbe - Mariage" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/mariages/corbe_3.jpg" alt="Château de la Corbe - Mariage" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/mariages/corbe_ceremonie_1.jpg" alt="Château de la Corbe - Cérémonie" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/mariages/corbe_ceremonie_2.jpg" alt="Château de la Corbe - Cérémonie" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/mariages/corbe_orangerie_1.jpg" alt="Château de la Corbe - Orangerie" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/mariages/corbe_orangerie_2.jpg" alt="Château de la Corbe - Orangerie" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/mariages/corbe_orangerie_3.jpg" alt="Château de la Corbe - Orangerie" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/mariages/corbe_orangerie_4.jpg" alt="Château de la Corbe - Orangerie" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/mariages/corbe_orangerie_5.jpg" alt="Château de la Corbe - Orangerie" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/mariages/corbe_orangerie_6.jpg" alt="Château de la Corbe - Orangerie" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/mariages/corbe_vue_d_ensemble_1.jpg" alt="Château de la Corbe - Vue d'ensemble" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/mariages/corbe_vue_d_ensemble_2.jpg" alt="Château de la Corbe - Vue d'ensemble" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>

            {/* Domaine Nantais - 12 images */}
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/mariages/domaine_nantais_1.jpg" alt="Domaine Nantais - Mariage" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/mariages/domaine_nantais_2.jpg" alt="Domaine Nantais - Mariage" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/mariages/domaine_cocktail_1.jpg" alt="Domaine Nantais - Cocktail" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/mariages/domaine_cocktail_2.jpg" alt="Domaine Nantais - Cocktail" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/mariages/domaine_cocktail_3.jpg" alt="Domaine Nantais - Cocktail" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/mariages/domaine_cocktail_4.jpg" alt="Domaine Nantais - Cocktail" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/mariages/domaine_cocktail_5.jpg" alt="Domaine Nantais - Cocktail" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/mariages/domaine_exterieur_1.jpg" alt="Domaine Nantais - Extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/mariages/domaine_exterieur_2.png" alt="Domaine Nantais - Extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/mariages/domaine_salle_1.jpg" alt="Domaine Nantais - Salle" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/mariages/domaine_salle_2.jpeg" alt="Domaine Nantais - Salle" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/mariages/domaine_salle_3.jpeg" alt="Domaine Nantais - Salle" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>

            {/* Manoir de la Boulaie - 13 images */}
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/mariages/manoir_boulaie_1.jpg" alt="Manoir de la Boulaie - Mariage" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/mariages/manoir_boulaie_2.jpg" alt="Manoir de la Boulaie - Mariage" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/mariages/boulaie_exterieur_1.jpg" alt="Manoir de la Boulaie - Extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/mariages/boulaie_exterieur_2.jpg" alt="Manoir de la Boulaie - Extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/mariages/boulaie_facade_1.jpg" alt="Manoir de la Boulaie - Façade" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/mariages/boulaie_facade_2.jpg" alt="Manoir de la Boulaie - Façade" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/mariages/boulaie_interieur_1.jpg" alt="Manoir de la Boulaie - Intérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/mariages/boulaie_interieur_2.jpg" alt="Manoir de la Boulaie - Intérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/mariages/boulaie_interieur_3.jpg" alt="Manoir de la Boulaie - Intérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/mariages/boulaie_interieur_4.jpg" alt="Manoir de la Boulaie - Intérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/mariages/boulaie_interieur_5.jpg" alt="Manoir de la Boulaie - Intérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/mariages/boulaie_interieur_6.jpg" alt="Manoir de la Boulaie - Intérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>

            {/* Le Dôme - 5 images */}
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/le-dome/mariages/dome.jpg" alt="Le Dôme - Mariage" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/le-dome/mariages/dome_exterieur_1.jpg" alt="Le Dôme - Extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/le-dome/mariages/dome_interieur_1.jpg" alt="Le Dôme - Intérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/le-dome/mariages/dome_interieur_2.jpg" alt="Le Dôme - Intérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/le-dome/mariages/dome_interieur_3.jpg" alt="Le Dôme - Intérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
          </div>
        </div>
      </section>

      {/* Lieux d'Exception, une signature d'émotion */}
      <section className="section bg-stone/30">
        <div className="container">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-accent">
              Lieux d&apos;Exception, une signature d&apos;émotion
            </h2>
            <div className="accent-line" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-12">
            {/* Card 01 */}
            <div className="bg-charcoal-800 rounded-xl p-6 md:p-8 border border-accent/20 shadow-lg">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="font-display text-4xl md:text-5xl font-light shrink-0" style={{ color: '#C9A961 !important' }}>01</div>
                <h3 className="text-lg md:text-xl font-semibold" style={{ color: '#C9A961 !important' }}>Rencontres personnalisées</h3>
              </div>
              <p className="text-neutral-200 leading-relaxed">
                Rencontres et échanges personnalisés pour comprendre vos envies et imaginer une réception à votre image.
              </p>
            </div>

            {/* Card 02 */}
            <div className="bg-charcoal-800 rounded-xl p-6 md:p-8 border border-accent/20 shadow-lg">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="font-display text-4xl md:text-5xl font-light shrink-0" style={{ color: '#C9A961 !important' }}>02</div>
                <h3 className="text-lg md:text-xl font-semibold" style={{ color: '#C9A961 !important' }}>Organisation & Coordination</h3>
              </div>
              <p className="text-neutral-200 leading-relaxed">
                Accompagnement dans l&apos;organisation et la coordination de votre événement, du choix des espaces à la mise en scène du grand jour.
              </p>
            </div>

            {/* Card 03 */}
            <div className="bg-charcoal-800 rounded-xl p-6 md:p-8 border border-accent/20 shadow-lg">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="font-display text-4xl md:text-5xl font-light shrink-0" style={{ color: '#C9A961 !important' }}>03</div>
                <h3 className="text-lg md:text-xl font-semibold" style={{ color: '#C9A961 !important' }}>Réseau de partenaires sélectionnés</h3>
              </div>
              <p className="text-neutral-200 leading-relaxed">
                Accès à un réseau de partenaires sélectionnés : traiteurs, décorateurs, fleuristes, photographes… tous choisis pour leur exigence et leur sens du service.
              </p>
            </div>

            {/* Card 04 */}
            <div className="bg-charcoal-800 rounded-xl p-6 md:p-8 border border-accent/20 shadow-lg">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="font-display text-4xl md:text-5xl font-light shrink-0" style={{ color: '#C9A961 !important' }}>04</div>
                <h3 className="text-lg md:text-xl font-semibold" style={{ color: '#C9A961 !important' }}>Mise à disposition exclusive</h3>
              </div>
              <p className="text-neutral-200 leading-relaxed">
                Mise à disposition exclusive de domaines pour vos événements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section avec image de fond */}
      <section className="section relative overflow-hidden">
        {/* Image de fond */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/venues/chateau-corbe/mariages/corbe_orangerie_3.jpg"
            alt="Mariage d'exception"
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
          {/* Overlay très léger */}
          <div className="absolute inset-0 bg-black/20 bg-linear-to-b from-black/10 to-black/30" />
        </div>

        <div className="container relative z-10">
          <div className="text-center rounded-2xl p-6 md:p-12 backdrop-blur-sm bg-black/30 border border-white/20">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white drop-shadow-lg">
              Parce que l&apos;émotion se vit pleinement lorsqu&apos;elle trouve son Lieu d&apos;Exception
            </h2>
            <p className="text-white text-base md:text-lg mb-8 drop-shadow-md">
              Des domaines où se mêlent beauté, sincérité et art de recevoir.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact" className="btn-primary">
                Nous contacter
              </Link>
              <div className="text-sm md:text-base text-white">
                <p><strong className="text-white">Téléphone :</strong> <a href="tel:0602037011" className="text-white/90 hover:text-accent transition-colors">06 02 03 70 11</a></p>
                <p><strong className="text-white">Email :</strong> <a href="mailto:contact@lieuxdexception.com" className="text-white/90 hover:text-accent transition-colors">contact@lieuxdexception.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
