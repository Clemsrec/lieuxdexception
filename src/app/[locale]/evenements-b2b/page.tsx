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
  // Note: Le Dôme n'a pas encore d'images B2B disponibles
  
  // Sélection aléatoire de 6 images max par lieu
  const brulaire_images = getRandomImages(brulaire_all, 6);
  const corbe_images = getRandomImages(corbe_all, 6);
  const nantais_images = getRandomImages(nantais_all, 6);
  const boulaie_images = getRandomImages(boulaie_all, 6);
  
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

        {/* Une expérience qui engage vos équipes et vos clients */}
        <div className="container px-4 pb-16">
          <div className="text-center mb-12">
            <h3 className="text-xl md:text-2xl font-semibold mb-8 text-white">
              Une expérience qui engage vos équipes et vos clients
            </h3>
            <div className="w-20 h-px bg-accent/40 mx-auto my-6"></div>
            <p className="text-neutral-300 text-base md:text-lg mt-6 max-w-4xl mx-auto">
              Aujourd'hui, un événement professionnel ne doit plus seulement rassembler.<br />
              Il doit inspirer, aligner et produire de l'impact.<br />
              Chez Lieux d'Exception, nous concevons des expériences événementielles exclusives, portées par des lieux rares et un savoir-faire éprouvé, au service de vos enjeux stratégiques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-stone-50 border border-stone/20 rounded-xl p-6 shadow-lg">
              <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-accent">Marquer durablement les esprits</h4>
              <p className="text-secondary leading-relaxed">
                Des lieux à forte identité, pensés pour créer un effet immédiat. <strong className="text-primary">Votre événement devient un moment de référence, qui valorise votre image et renforce l'adhésion de vos équipes et de vos clients.</strong>
              </p>
            </div>

            <div className="bg-stone-50 border border-stone/20 rounded-xl p-6 shadow-lg">
              <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-accent">Des environnements qui déclenchent la performance</h4>
              <p className="text-secondary leading-relaxed">
                <strong className="text-primary">Cohésion, créativité, prise de recul, décisions stratégiques.</strong> Nos domaines offrent des cadres propices à l'échange et à la réflexion, loin des formats standardisés et impersonnels.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone/20 rounded-xl p-6 shadow-lg">
              <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-accent">Une liberté totale de création</h4>
              <p className="text-secondary leading-relaxed">
                Chaque lieu est privatisable, modulable et ouvert aux formats les plus exigeants. <strong className="text-primary">Séminaire confidentiel, expérience immersive ou événement d'envergure : nous adaptons l'espace à votre ambition, jamais l'inverse.</strong>
              </p>
            </div>

            <div className="bg-stone-50 border border-stone/20 rounded-xl p-6 shadow-lg">
              <h4 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-accent">Un savoir-faire qui sécurise votre projet</h4>
              <p className="text-secondary leading-relaxed">
                <strong className="text-primary">Plus de 20 ans d'expertise événementielle, un coordinateur dédié et un réseau de partenaires premium.</strong> Vous bénéficiez d'un pilotage précis, fluide et maîtrisé, du premier échange au jour J.
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

      {/* CTA Section */}
      <section className="section relative overflow-hidden mb-0">
        <div className="absolute inset-0">
          <Image
            src="/venues/manoir-boulaie/b2b/boulaie_seminaire_6.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
        </div>
        <div className="absolute inset-0 bg-neutral-900/60" />
        <div className="container relative z-10 px-4">
          <div className="text-center mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display italic text-white mb-6 md:mb-8" style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)' }}>
              Êtes-vous prêt à vivre cette expérience ?
            </h2>
            <p className="text-lg md:text-xl text-white/95 mb-3 font-light max-w-3xl mx-auto">
              Vous avez un objectif.
            </p>
            <p className="text-lg md:text-xl text-white/95 mb-8 font-light max-w-3xl mx-auto">
              Nous avons les lieux, l&apos;expertise et la méthode pour le transformer en expérience marquante.
            </p>
            
            <div className="flex flex-col gap-6 items-center max-w-2xl mx-auto">
              <Link href="/contact" className="btn btn-primary w-full sm:w-auto">
                Contact & Devis
              </Link>
              <div className="text-sm md:text-base text-white/90 space-y-1">
                <p><strong className="text-white">Téléphone Pro/B2B :</strong> <a href="tel:0670562879" className="hover:text-accent transition-colors">06 70 56 28 79</a></p>
                <p><strong className="text-white">Email :</strong> <a href="mailto:contact@lieuxdexception.com" className="hover:text-accent transition-colors break-all">contact@lieuxdexception.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
