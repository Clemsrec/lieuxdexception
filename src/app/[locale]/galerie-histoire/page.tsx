import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import VenueGallerySection from '@/components/VenueGallerySection';
import ScrollTimeline from '@/components/ScrollTimeline';
import { generateServiceMetadata } from '@/lib/smartMetadata';
import { generateUniversalStructuredData } from '@/lib/universalStructuredData';
import { getTranslations } from 'next-intl/server';
import { getB2BImages, getMariageImages, getRandomImages } from '@/lib/mariageImages';

/**
 * Métadonnées SEO
 */
export const metadata: Metadata = generateServiceMetadata(
  'Galerie & Histoire',
  'Découvrez l\'histoire de Lieux d\'Exception à travers notre timeline interactive et notre galerie de domaines prestigieux en Loire-Atlantique'
);

/**
 * Page Galerie & Histoire
 * 
 * Timeline interactive horizontale avec scroll fluide présentant
 * l'évolution de Lieux d'Exception depuis 2020
 */
export default async function GalerieHistoirePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Navigation' });

  // Charger les images B2B et Mariages depuis le système de fichiers
  const brulaire_b2b = await getB2BImages('chateau-brulaire');
  const brulaire_mariages = await getMariageImages('chateau-brulaire');
  const brulaire_all = [...brulaire_b2b, ...brulaire_mariages];
  
  const corbe_b2b = await getB2BImages('chateau-corbe');
  const corbe_mariages = await getMariageImages('chateau-corbe');
  const corbe_all = [...corbe_b2b, ...corbe_mariages];
  
  const nantais_b2b = await getB2BImages('domaine-nantais');
  const nantais_mariages = await getMariageImages('domaine-nantais');
  const nantais_all = [...nantais_b2b, ...nantais_mariages];
  
  const boulaie_b2b = await getB2BImages('manoir-boulaie');
  const boulaie_mariages = await getMariageImages('manoir-boulaie');
  const boulaie_all = [...boulaie_b2b, ...boulaie_mariages];
  
  const dome_mariages = await getMariageImages('le-dome');
  const dome_all = [...dome_mariages]; // Le Dôme n'a pas d'images B2B
  
  // Sélection aléatoire de 8 images max par lieu
  const brulaire_images = getRandomImages(brulaire_all, 8);
  const corbe_images = getRandomImages(corbe_all, 8);
  const nantais_images = getRandomImages(nantais_all, 8);
  const boulaie_images = getRandomImages(boulaie_all, 8);
  const dome_images = getRandomImages(dome_all, 8);

  // Événements de la timeline basés sur docs/timeline.md
  const events = [
    {
      year: '2020',
      month: 'Mai',
      title: 'LE DOMAINE NANTAIS',
      subtitle: 'Ouverture au public',
      description: 'Première pierre de l\'aventure Lieux d\'Exception. Le Domaine Nantais accueille ses premiers événements et pose les fondations de notre signature : des lieux de caractère au service d\'expériences mémorables.',
      image: '/venues/domaine-nantais/hero.jpg',
      imagePosition: 'bottom' as const,
      isMajor: true,
    },
    {
      year: '2021',
      title: 'LE DÔME',
      subtitle: 'Acquisition du lieu',
      description: 'Un projet singulier rejoint Lieux d\'Exception. Le Dôme est acquis avec une ambition forte : créer un espace événementiel atypique, immersif et résolument différenciant. Début des événements prévu en 2025.',
      image: '/venues/le-dome/hero.jpg',
      imagePosition: 'top' as const,
    },
    {
      year: '2023',
      title: 'LE MANOIR DE LA BOULAIE',
      subtitle: 'Acquisition & réhabilitation',
      description: 'Acquisition d\'un manoir de caractère nécessitant une rénovation complète. Deux années de travaux sont engagées pour redonner vie au lieu et le transformer en domaine événementiel d\'exception. Ouverture aux événements en 2025.',
      image: '/venues/manoir-boulaie/hero.jpg',
      imagePosition: 'bottom' as const,
    },
    {
      year: '2025',
      month: 'Sept',
      title: 'LE MANOIR DE LA BOULAIE',
      subtitle: 'Lancement des travaux d\'extension',
      description: 'Début des travaux d\'extension du manoir afin d\'enrichir l\'expérience proposée et d\'élargir les capacités d\'accueil. Fin des travaux prévue en avril 2026.',
      image: '/venues/manoir-boulaie/hero.jpg',
      imagePosition: 'top' as const,
    },
    {
      year: '2025',
      month: 'Sept',
      title: 'LE CHÂTEAU DE LA BRÛLAIRE',
      subtitle: 'Acquisition',
      description: 'Un nouveau château rejoint la collection Lieux d\'Exception. Un lieu emblématique, sélectionné pour son cachet, son potentiel et son adéquation avec notre vision.',
      image: '/venues/chateau-brulaire/hero.jpg',
      imagePosition: 'bottom' as const,
      isMajor: true,
    },
    {
      year: '2025',
      month: 'Déc',
      title: 'LE CHÂTEAU DE LA CORBE',
      subtitle: 'Acquisition',
      description: 'Dernière acquisition en date, le Château de la Corbe vient renforcer notre portefeuille de lieux exclusifs, dédiés aux mariages et aux événements professionnels haut de gamme.',
      image: '/venues/chateau-corbe/hero.jpg',
      imagePosition: 'top' as const,
      isMajor: true,
    },
  ];

  // Générer structured data
  const pageSchema = generateUniversalStructuredData({
    siteType: 'corporate',
    pageType: 'about',
    data: {
      name: 'Galerie & Histoire - Lieux d\'Exception',
      description: 'L\'histoire de Lieux d\'Exception à travers une timeline interactive'
    },
    url: 'https://lieuxdexception.fr/galerie-histoire'
  });

  return (
    <main className="min-h-screen bg-neutral-900">
      
      {/* Structured Data */}
      {pageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
        />
      )}

      {/* Hero Section */}
      <HeroSection
        title={t('gallery')}
        subtitle="L'aventure Lieux d'Exception"
        description="Plus de 5 ans d'histoire, d'acquisitions et de passion pour l'événementiel haut de gamme. 
        Découvrez notre parcours à travers une timeline interactive."
        backgroundImage="/venues/chateau-corbe/b2b/corbe_vue_chateau_2.jpg"
      />

      {/* Timeline Interactive */}
      <ScrollTimeline events={events} />

      {/* Galerie de photos - Tous les lieux */}
      <section className="bg-stone-200 py-16">
        <div className="container px-4">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center text-charcoal-800">
              Découvrez nos domaines en images
            </h2>
            <div className="w-20 h-px bg-accent/40 mx-auto my-6"></div>
            <div className="max-w-3xl mx-auto">
              <p className="text-secondary text-lg text-center">
                Une sélection d&apos;images de nos châteaux et domaines pour vos événements B2B et mariages d&apos;exception
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
      
    </main>
  );
}
