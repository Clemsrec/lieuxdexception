import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import VenueGallerySection from '@/components/VenueGallerySection';
import { generateServiceMetadata } from '@/lib/smartMetadata';
import { generateUniversalStructuredData, generateFAQSchema } from '@/lib/universalStructuredData';
import { getTranslations } from 'next-intl/server';
import { getMariageImages, getRandomImages } from '@/lib/mariageImages';

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
 * dans les lieux d'exception du Groupe Riou.
 * 
 * Les images sont chargées dynamiquement depuis /public/venues/[slug]/mariages
 * et randomisées à chaque chargement (6 photos max par lieu)
 */
export default async function MariagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Weddings' });
  
  // Charger les images depuis le système de fichiers
  const brulaire_all = await getMariageImages('chateau-brulaire');
  const corbe_all = await getMariageImages('chateau-corbe');
  const nantais_all = await getMariageImages('domaine-nantais');
  const boulaie_all = await getMariageImages('manoir-boulaie');
  const dome_all = await getMariageImages('le-dome');
  
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
      name: 'Mariages d\'Exception',
      description: 'Organisation complète de mariages dans nos domaines prestigieux'
    },
    url: 'https://lieuxdexception.fr/mariages'
  });

  const faqSchema = generateFAQSchema('service');

  return (
    <main className="min-h-screen bg-stone-200">
      
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
        backgroundImage="/venues/chateau-brulaire/mariages/mise-en-scene.jpg"
        buttons={[
          { label: t('requestInfo'), href: `/${locale}/contact`, primary: true }
        ]}
      />

      {/* Galerie de photos mariages - Organisée par lieu */}
      <section className="bg-stone-200 py-16">
        <div className="container px-4">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center">
              Nos domaines pour vos mariages d&apos;exception
            </h2>
            <div className="w-20 h-px bg-accent/40 mx-auto my-6"></div>
            <div className="max-w-3xl mx-auto">
              <p className="text-secondary text-lg text-center">
                Découvrez nos domaines de prestige, chacun avec son caractère unique pour célébrer votre jour le plus important
              </p>
            </div>
          </div>
        </div>

        {/* Le Château de la Brûlaire */}
        <VenueGallerySection
          venueName="Le Château de la Brûlaire"
          venueSlug="chateau-brulaire"
          locale={locale}
          bgColor="white"
          images={brulaire_images}
        />

        {/* Le Château de la Corbe */}
        <VenueGallerySection
          venueName="Le Château de la Corbe"
          venueSlug="chateau-corbe"
          locale={locale}
          bgColor="stone-50"
          images={corbe_images}
        />

        {/* Le Domaine Nantais */}
        <VenueGallerySection
          venueName="Le Domaine Nantais"
          venueSlug="domaine-nantais"
          locale={locale}
          bgColor="white"
          images={nantais_images}
        />

        {/* Le Manoir de la Boulaie */}
        <VenueGallerySection
          venueName="Le Manoir de la Boulaie"
          venueSlug="manoir-boulaie"
          locale={locale}
          bgColor="stone-50"
          images={boulaie_images}
        />

        {/* Le Dôme */}
        <VenueGallerySection
          venueName="Le Dôme"
          venueSlug="le-dome"
          locale={locale}
          bgColor="white"
          images={dome_images}
        />
      </section>

      {/* Lieux d'Exception, la signature de votre mariage */}
      <section className="section bg-stone">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-accent">
              Lieux d&apos;Exception, la signature de votre mariage
            </h2>
            <div className="w-20 h-px bg-accent/40 mx-auto my-6"></div>
            <div className="space-y-4 text-secondary text-base md:text-lg leading-relaxed mt-8">
              <p>Chaque histoire est unique.</p>
              <p>Votre mariage mérite un lieu et un accompagnement à la hauteur de ce moment rare.</p>
              <p>Chez Lieux d&apos;Exception, nous réunissons des domaines de caractère et un savoir-faire éprouvé pour créer des mariages élégants, sincères et profondément mémorables.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-12">
            {/* Card 01 */}
            <div className="bg-charcoal-800 rounded-xl p-6 md:p-8 border border-accent/20 shadow-lg">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="font-display text-4xl md:text-5xl font-light shrink-0" style={{ color: '#C9A961 !important' }}>01</div>
                <h3 className="text-lg md:text-xl font-semibold" style={{ color: '#C9A961 !important' }}>Une rencontre qui donne le ton</h3>
              </div>
              <p className="text-neutral-200 leading-relaxed">
                Dès notre première rencontre, nous prenons le temps de vous écouter.<br />
                Vos envies, vos priorités, vos contraintes : tout est intégré pour construire un mariage fidèle à votre histoire, sans pression ni format imposé.
              </p>
            </div>

            {/* Card 02 */}
            <div className="bg-charcoal-800 rounded-xl p-6 md:p-8 border border-accent/20 shadow-lg">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="font-display text-4xl md:text-5xl font-light shrink-0" style={{ color: '#C9A961 !important' }}>02</div>
                <h3 className="text-lg md:text-xl font-semibold" style={{ color: '#C9A961 !important' }}>Une organisation fluide, du début à la fin</h3>
              </div>
              <p className="text-neutral-200 leading-relaxed">
                Du choix du lieu à la mise en scène du jour J, nous orchestrons chaque étape avec précision.<br />
                Vous profitez pleinement des préparatifs, l&apos;esprit libre, en toute confiance.
              </p>
            </div>

            {/* Card 03 */}
            <div className="bg-charcoal-800 rounded-xl p-6 md:p-8 border border-accent/20 shadow-lg">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="font-display text-4xl md:text-5xl font-light shrink-0" style={{ color: '#C9A961 !important' }}>03</div>
                <h3 className="text-lg md:text-xl font-semibold" style={{ color: '#C9A961 !important' }}>Des partenaires fiables, pour une confiance totale</h3>
              </div>
              <p className="text-neutral-200 leading-relaxed">
                Chaque prestataire est sélectionné pour son professionnalisme, sa fiabilité et son sens du service.<br />
                Traiteurs, décorateurs, fleuristes, photographes… vous êtes entourés de professionnels sur lesquels vous pouvez compter, sans mauvaise surprise.
              </p>
            </div>

            {/* Card 04 */}
            <div className="bg-charcoal-800 rounded-xl p-6 md:p-8 border border-accent/20 shadow-lg">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="font-display text-4xl md:text-5xl font-light shrink-0" style={{ color: '#C9A961 !important' }}>04</div>
                <h3 className="text-lg md:text-xl font-semibold" style={{ color: '#C9A961 !important' }}>Des lieux exclusifs, pour une tranquillité absolue</h3>
              </div>
              <p className="text-neutral-200 leading-relaxed">
                Châteaux et domaines de caractère, entièrement privatisés pour votre mariage.<br />
                Vous profitez de votre journée en toute intimité, dans un cadre élégant et apaisant, sans contraintes extérieures.
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
              <Link href="/contact" className="btn btn-primary">
                Contact & Devis
              </Link>
              <div className="text-sm md:text-base text-white">
                <p><strong className="text-white">Téléphone Mariages :</strong> <a href="tel:0602037011" className="text-white/90 hover:text-accent transition-colors">06 02 03 70 11</a></p>
                <p><strong className="text-white">Email :</strong> <a href="mailto:contact@lieuxdexception.com" className="text-white/90 hover:text-accent transition-colors">contact@lieuxdexception.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
