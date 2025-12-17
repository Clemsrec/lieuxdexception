import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import VenueGallerySection from '@/components/VenueGallerySection';
import { generateServiceMetadata } from '@/lib/smartMetadata';
import { generateUniversalStructuredData, generateFAQSchema } from '@/lib/universalStructuredData';
import { getTranslations } from 'next-intl/server';
import { getB2BImages, getRandomImages } from '@/lib/mariageImages';

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
 * professionnels dans les lieux d'exception du Groupe Riou.
 */
export default async function EvenementsB2BPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'B2B' });
  
  // Charger les images B2B dynamiquement depuis le filesystem
  const brulaire_all = await getB2BImages('chateau-brulaire');
  const corbe_all = await getB2BImages('chateau-corbe');
  const nantais_all = await getB2BImages('domaine-nantais');
  const boulaie_all = await getB2BImages('manoir-boulaie');
  const dome_all = await getB2BImages('le-dome');
  
  // Sélection aléatoire de 6 images max par lieu
  const brulaire_images = getRandomImages(brulaire_all, 6);
  const corbe_images = getRandomImages(corbe_all, 6);
  const nantais_images = getRandomImages(nantais_all, 6);
  const boulaie_images = getRandomImages(boulaie_all, 6);
  const dome_images = getRandomImages(dome_all, 6);
  
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
        backgroundImage="/venues/chateau-corbe/b2b/corbe_seminaire_1.jpg"
        buttons={[
          { label: t('requestQuote'), href: `/${locale}/contact`, primary: true }
        ]}
      />

      {/* Galerie de photos événements B2B - Organisée par lieu */}
      <section className="bg-neutral-900 py-16">
        <div className="container px-4">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white text-center">
              Nos espaces pensés pour vos événements professionnels
            </h2>
            <div className="w-20 h-px bg-accent/40 mx-auto my-6"></div>
            <div className="max-w-3xl mx-auto">
              <p className="text-neutral-300 text-lg text-center">
                Découvrez nos domaines d'exception, chacun avec son caractère unique et ses espaces dédiés aux événements B2B
              </p>
            </div>
          </div>
        </div>

        {/* Le Château de la Brûlaire */}
        <VenueGallerySection
          venueName="Le Château de la Brûlaire"
          venueSlug="chateau-brulaire"
          locale={locale}
          bgColor="neutral-800"
          images={brulaire_images}
        />

        {/* Le Château de la Corbe */}
        <VenueGallerySection
          venueName="Le Château de la Corbe"
          venueSlug="chateau-corbe"
          locale={locale}
          bgColor="white"
          images={corbe_images}
        />

        {/* Le Domaine Nantais */}
        <VenueGallerySection
          venueName="Le Domaine Nantais"
          venueSlug="domaine-nantais"
          locale={locale}
          bgColor="neutral-800"
          images={nantais_images}
        />

        {/* Le Manoir de la Boulaie */}
        <VenueGallerySection
          venueName="Le Manoir de la Boulaie"
          venueSlug="manoir-boulaie"
          locale={locale}
          bgColor="white"
          images={boulaie_images}
        />
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
        <div className="container px-4">
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
            
            <div className="flex flex-col gap-6 items-center max-w-2xl mx-auto">
              <Link href="/contact" className="btn btn-primary w-full sm:w-auto">
                Contact & Devis
              </Link>
              <div className="text-sm md:text-base text-secondary space-y-1">
                <p><strong className="text-primary">Téléphone Pro/B2B :</strong> <a href="tel:0670562879" className="hover:text-accent transition-colors">06 70 56 28 79</a></p>
                <p><strong className="text-primary">Email :</strong> <a href="mailto:contact@lieuxdexception.com" className="hover:text-accent transition-colors break-all">contact@lieuxdexception.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
