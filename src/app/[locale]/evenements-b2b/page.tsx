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
  'Événements B2B et Séminaires',
  'Organisation complète de séminaires, conférences et événements corporate dans nos domaines d\'exception en Loire-Atlantique'
);

/**
 * Page Événements B2B
 * 
 * Cette page présente les services et solutions pour les événements
 * professionnels dans les 5 lieux d'exception du Groupe Riou.
 */
export default async function EvenementsB2BPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'B2B' });
  // Générer structured data
  const serviceSchema = generateUniversalStructuredData({
    siteType: 'corporate',
    pageType: 'service',
    data: {
      name: 'Événements B2B et Séminaires',
      description: 'Organisation d\'événements professionnels dans nos lieux d\'exception'
    },
    url: 'https://lieuxdexception.fr/evenements-b2b'
  });

  const faqSchema = generateFAQSchema('service');

  return (
    <main className="min-h-screen bg-neutral-900">
      
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
        backgroundImage="/images/salle-seminaire.jpg"
        buttons={[
          { label: t('requestQuote'), href: `/${locale}/contact`, primary: true }
        ]}
      />

      {/* Galerie de photos événements B2B - Toutes les images des dossiers b2b/ */}
      <section className="section bg-neutral-800">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              Des espaces pensés pour vos événements
            </h2>
            <div className="accent-line" />
            <p className="text-neutral-300 text-lg mt-6">
              Découvrez nos espaces dédiés aux événements professionnels à travers nos 5 domaines d'exception
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {/* Château de la Brûlaire - 22 images */}
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_1.jpg" alt="Château de la Brûlaire - Espace B2B" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_bar_2.jpg" alt="Château de la Brûlaire - Bar" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_bar_3.jpg" alt="Château de la Brûlaire - Bar" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_bar_4.jpg" alt="Château de la Brûlaire - Bar" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_bar_5.jpg" alt="Château de la Brûlaire - Bar" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_exterieur_1.jpg" alt="Château de la Brûlaire - Extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_exterieur_2.jpeg" alt="Château de la Brûlaire - Extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_exterieur_3.jpeg" alt="Château de la Brûlaire - Extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_exterieur_4.jpeg" alt="Château de la Brûlaire - Extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_orangerie_1.jpg" alt="Château de la Brûlaire - Orangerie" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_orangerie_2.jpg" alt="Château de la Brûlaire - Orangerie" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_orangerie_3.jpg" alt="Château de la Brûlaire - Orangerie" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_salon_1.jpg" alt="Château de la Brûlaire - Salon" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_salon_2.jpg" alt="Château de la Brûlaire - Salon" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_salon_6.jpg" alt="Château de la Brûlaire - Salon" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_salon_7.jpg" alt="Château de la Brûlaire - Salon" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_salon_8.jpg" alt="Château de la Brûlaire - Salon" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_salon_9.jpg" alt="Château de la Brûlaire - Salon" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_salon_10.jpg" alt="Château de la Brûlaire - Salon" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_salon_11.jpg" alt="Château de la Brûlaire - Salon" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_salon_12.jpg" alt="Château de la Brûlaire - Salon" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-brulaire/b2b/brulaire_seminaire_1.jpg" alt="Château de la Brûlaire - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>

            {/* Château de la Corbe - 28 images */}
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_1.jpg" alt="Château de la Corbe - Espace B2B" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_2.jpg" alt="Château de la Corbe - Espace B2B" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_3.jpg" alt="Château de la Corbe - Espace B2B" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_exterieur_1.jpg" alt="Château de la Corbe - Extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_exterieur_2.jpg" alt="Château de la Corbe - Extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_exterieur_orangerie_1.jpg" alt="Château de la Corbe - Orangerie extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_exterieur_orangerie_2.jpg" alt="Château de la Corbe - Orangerie extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_exterieur_orangerie_3.jpg" alt="Château de la Corbe - Orangerie extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_exterieur_orangerie_4.jpg" alt="Château de la Corbe - Orangerie extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_exterieur_orangerie_5.jpg" alt="Château de la Corbe - Orangerie extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_piscine_1.jpg" alt="Château de la Corbe - Piscine" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_piscine_2.jpg" alt="Château de la Corbe - Piscine" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_piscine_3.jpg" alt="Château de la Corbe - Piscine" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_salle_seminaire_1.jpg" alt="Château de la Corbe - Salle séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_salle_seminaire_2.jpg" alt="Château de la Corbe - Salle séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_salle_seminaire_3.jpg" alt="Château de la Corbe - Salle séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_salle_seminaire_4.jpg" alt="Château de la Corbe - Salle séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_salle_seminaire_5.jpg" alt="Château de la Corbe - Salle séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_seminaire_1.jpg" alt="Château de la Corbe - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_seminaire_2.jpg" alt="Château de la Corbe - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_seminaire_3.jpg" alt="Château de la Corbe - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_seminaire_4.jpg" alt="Château de la Corbe - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_seminaire_5.jpg" alt="Château de la Corbe - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_vue_chateau_1.jpg" alt="Château de la Corbe - Vue château" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_vue_chateau_2.jpg" alt="Château de la Corbe - Vue château" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_vue_chateau_3.jpg" alt="Château de la Corbe - Vue château" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_vue_chateau_4.jpg" alt="Château de la Corbe - Vue château" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/chateau-corbe/b2b/corbe_vue_chateau_5.jpg" alt="Château de la Corbe - Vue château" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>

            {/* Domaine Nantais - 10 images */}
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/b2b/domaine_1.png" alt="Domaine Nantais - Espace B2B" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/b2b/domaine_2.jpg" alt="Domaine Nantais - Espace B2B" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/b2b/domaine_accueil_cafe.jpg" alt="Domaine Nantais - Accueil café" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/b2b/domaine_cocktail_exterieur.png" alt="Domaine Nantais - Cocktail extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/b2b/domaine_salle_vide.jpg" alt="Domaine Nantais - Salle vide" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/b2b/domaine_salle_vide_2.jpg" alt="Domaine Nantais - Salle vide" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/b2b/domaine_seminaire_1.png" alt="Domaine Nantais - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/b2b/domaine_seminaire_2.png" alt="Domaine Nantais - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/b2b/domaine_seminaire_3.jpg" alt="Domaine Nantais - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/domaine-nantais/b2b/domaine_seminaire_4.jpg" alt="Domaine Nantais - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>

            {/* Manoir de la Boulaie - 15 images */}
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/b2b/boulaie_accueil_cafe.jpg" alt="Manoir de la Boulaie - Accueil café" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/b2b/boulaie_exterieur_1.jpg" alt="Manoir de la Boulaie - Extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/b2b/boulaie_exterieur_2.jpg" alt="Manoir de la Boulaie - Extérieur" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/b2b/boulaie_seminaire_1.png" alt="Manoir de la Boulaie - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/b2b/boulaie_seminaire_2.png" alt="Manoir de la Boulaie - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/b2b/boulaie_seminaire_3.jpg" alt="Manoir de la Boulaie - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/b2b/boulaie_seminaire_4.jpg" alt="Manoir de la Boulaie - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/b2b/boulaie_seminaire_5.jpg" alt="Manoir de la Boulaie - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/b2b/boulaie_seminaire_6.jpg" alt="Manoir de la Boulaie - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/b2b/boulaie_seminaire_7.jpg" alt="Manoir de la Boulaie - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/b2b/boulaie_seminaire_8.jpg" alt="Manoir de la Boulaie - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/b2b/boulaie_seminaire_9.jpg" alt="Manoir de la Boulaie - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/b2b/boulaie_seminaire_10.jpg" alt="Manoir de la Boulaie - Séminaire" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/b2b/manoir_1.jpg" alt="Manoir de la Boulaie - Espace B2B" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg group">
              <Image src="/venues/manoir-boulaie/b2b/manoir_2.jpg" alt="Manoir de la Boulaie - Espace B2B" fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw" />
            </div>
          </div>
        </div>
      </section>

      {/* Ce que nous vous offrons */}
      <section className="section bg-primary/95">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-white">
              {t('offer.title')}
            </h2>
            <div className="accent-line" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Une émotion d'éveil */}
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-white flex items-center">
                <div className="w-12 md:w-20 h-px bg-accent mr-3 md:mr-4 shrink-0" />
                {t('offer.pillar1.title')}
              </h3>
              <p className="text-neutral-200 leading-relaxed">
                {t('offer.pillar1.description')}
              </p>
            </div>

            {/* Un service d'excellence */}
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-white flex items-center">
                <div className="w-12 md:w-20 h-px bg-accent mr-3 md:mr-4 shrink-0" />
                {t('offer.pillar2.title')}
              </h3>
              <p className="text-neutral-200 leading-relaxed">
                {t('offer.pillar2.description')}
              </p>
            </div>

            {/* Des lieux inspirés */}
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-white flex items-center">
                <div className="w-12 md:w-20 h-px bg-accent mr-3 md:mr-4 shrink-0" />
                {t('offer.pillar3.title')}
              </h3>
              <p className="text-neutral-200 leading-relaxed">
                {t('offer.pillar3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Une expérience pour vos équipes */}
      <section className="section bg-neutral-800">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-white">
              Une expérience pour vos équipes et vos clients
            </h2>
            <div className="accent-line" />
            <p className="text-neutral-300 text-base md:text-lg mt-6">
              Dans un environnement professionnel en constante évolution, il est essentiel de proposer des événements qui ont du sens et de l&apos;impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-stone-50 border border-stone/20 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-accent">Marquer les esprits</h3>
              <p className="text-secondary leading-relaxed">
                Des lieux conçus pour <strong className="text-primary">marquer les esprits, valoriser votre image et créer une vraie connexion humaine.</strong>
              </p>
            </div>

            <div className="bg-stone-50 border border-stone/20 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-accent">Environnements propices</h3>
              <p className="text-secondary leading-relaxed">
                Des environnements propices à la <strong className="text-primary">cohésion, à la créativité ou à la prise de recul,</strong> loin des lieux standardisés.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone/20 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-accent">Liberté totale</h3>
              <p className="text-secondary leading-relaxed">
                Une <strong className="text-primary">liberté totale de création :</strong> nos lieux sont ouverts aux formats les plus audacieux, des plus confidentiels aux plus immersifs.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone/20 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-accent">Équipe passionnée</h3>
              <p className="text-secondary leading-relaxed">
                Une <strong className="text-primary">équipe de passionnés à vos côtés,</strong> qui aime repousser les limites du brief et aller au-delà des attentes initiales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-neutral-900">
        <div className="container">
          <div className="text-center bg-stone-50 rounded-2xl p-6 md:p-12 border-2 border-accent/40">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primary">
              Êtes-vous prêt à vivre cette expérience ?
            </h2>
            <p className="text-secondary text-base md:text-lg mb-2">
              <strong className="text-primary">Lieux d&apos;Exception, c&apos;est plus qu&apos;un service événementiel :</strong>
            </p>
            <p className="text-secondary text-base md:text-lg mb-8">
              c&apos;est une promesse de singularité, une invitation à l&apos;émotion, une exigence de qualité.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact" className="btn-primary">
                Nous contacter
              </Link>
              <div className="text-sm md:text-base text-secondary">
                <p><strong className="text-primary">Téléphone :</strong> <a href="tel:0602037011" className="hover:text-accent transition-colors">06 02 03 70 11</a></p>
                <p><strong className="text-primary">Email :</strong> <a href="mailto:contact@lieuxdexception.com" className="hover:text-accent transition-colors">contact@lieuxdexception.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
