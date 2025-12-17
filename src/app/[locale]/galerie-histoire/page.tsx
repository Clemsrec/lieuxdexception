import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import ScrollTimeline from '@/components/ScrollTimeline';
import { generateServiceMetadata } from '@/lib/smartMetadata';
import { generateUniversalStructuredData } from '@/lib/universalStructuredData';
import { getTranslations } from 'next-intl/server';

/**
 * Métadonnées SEO
 */
export const metadata: Metadata = generateServiceMetadata(
  'Histoire',
  'Découvrez l\'histoire de Lieux d\'Exception à travers notre timeline interactive depuis 2020 en Loire-Atlantique'
);

/**
 * Page Histoire
 * 
 * Timeline interactive horizontale avec scroll fluide présentant
 * l'évolution de Lieux d'Exception depuis 2020
 */
export default async function HistoirePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Navigation' });

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
      name: 'Histoire - Lieux d\'Exception',
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
        title={t('history')}
        subtitle="L'aventure Lieux d'Exception"
        description="Plus de 5 ans d'histoire, d'acquisitions et de passion pour l'événementiel haut de gamme. 
        Découvrez notre parcours à travers une timeline interactive."
        backgroundImage="/venues/chateau-corbe/b2b/corbe_vue_chateau_2.jpg"
      />

      {/* Timeline Interactive */}
      <ScrollTimeline events={events} />
      
    </main>
  );
}
