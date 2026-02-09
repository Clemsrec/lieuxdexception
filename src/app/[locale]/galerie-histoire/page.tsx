import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import ScrollTimeline from '@/components/ScrollTimeline';
import { generateServiceMetadata } from '@/lib/smartMetadata';
import { generateUniversalStructuredData } from '@/lib/universalStructuredData';
import { getTranslations } from 'next-intl/server';
import { getPageContent, getTimelineEvents } from '@/lib/firestore';

/**
 * Métadonnées SEO
 */
export const metadata: Metadata = generateServiceMetadata(
 'Histoire',
 'Découvrez l\'histoire de Lieux d\'Exception à travers notre timeline interactive depuis 2020 en Loire-Atlantique'
);

/**
 * Revalidation : 60 secondes
 * Les données Firestore sont rafraîchies toutes les minutes
 */
export const revalidate = 60;

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

 // Récupérer le contenu de la page depuis Firestore (CMS)
 const pageContent = await getPageContent('histoire', locale === 'fr' ? 'fr' : 'en');

 // Récupérer les événements de la timeline depuis Firestore
 const timelineEventsFromDb = await getTimelineEvents();
 
 // Événements de la timeline - Utiliser Firestore ou fallback sur données hardcodées
 const events = timelineEventsFromDb.length > 0 ? timelineEventsFromDb : [
  {
   year: '2020',
   month: 'Mai',
   title: 'LE DOMAINE NANTAIS',
   subtitle: '',
   description: 'Première pierre de l\'aventure Lieux d\'Exception. Le Domaine Nantais accueille ses premiers événements et pose les fondations de notre signature : des lieux de caractère au service d\'expériences mémorables.',
   image: '/venues/domaine-nantais/hero.webp',
   imagePosition: 'bottom' as const,
   isMajor: true,
  },
  {
   year: '2021',
   title: 'LE DÔME',
   subtitle: '',
   description: 'Un projet singulier rejoint Lieux d\'Exception. Le Dôme est acquis avec une ambition forte : créer un espace événementiel atypique, immersif et résolument différenciant.',
   image: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/venues%2Fle-dome%2Fmariages%2Fdome_interieur_1.jpg?alt=media',
   imagePosition: 'top' as const,
  },
  {
   year: '2023',
   title: 'LE MANOIR DE LA BOULAIE',
   subtitle: '',
   description: 'Autrefois un haut lieu de la gastronomie française, le Manoir de la Boulaie réouvre ses portes après deux années de rénovation complète pour vous faire vivre des événements d\'exception.',
   image: '/venues/manoir-boulaie/hero.webp',
   imagePosition: 'bottom' as const,
  },
  {
   year: '2025',
   month: 'Sept',
   title: 'LE MANOIR DE LA BOULAIE',
   subtitle: '',
   description: 'Début des travaux d\'extension du manoir afin d\'enrichir l\'expérience proposée et d\'élargir les capacités d\'accueil. Fin des travaux prévue en avril 2026.',
   image: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/venues%2Fmanoir-boulaie%2Fmariages%2Fboulaie_interieur_5.jpg?alt=media',
   imagePosition: 'top' as const,
  },
  {
   year: '2025',
   month: 'Sept',
   title: 'LE CHÂTEAU DE LA BRÛLAIRE',
   subtitle: '',
   description: 'Le Château de la Brûlaire rejoint la collection Lieux d\'Exception. Ancienne demeure de Bonaventure du Fou, ce lieu emblématique séduit par son architecture d\'inspiration louisianaise et ses orangeries authentiques. Jadis restaurant étoilé, il s\'apprête à accueillir vos événements d\'exception.',
   image: '/venues/chateau-brulaire/hero.webp',
   imagePosition: 'bottom' as const,
   isMajor: true,
  },
  {
   year: '2025',
   month: 'Déc',
   title: 'LE CHÂTEAU DE LA CORBE',
   subtitle: '',
   description: 'Dernière acquisition en date, le Château de la Corbe vient renforcer notre portefeuille de lieux exclusifs, dédiés aux mariages et aux événements professionnels haut de gamme.',
   image: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/venues%2Fchateau-corbe%2Fhero.jpg?alt=media',
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
  url: 'https://lieuxdexception.com/galerie-histoire'
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
    title={pageContent?.hero?.title || t('history')}
    subtitle={pageContent?.hero?.subtitle ||"L'aventure Lieux d'Exception"}
    description={pageContent?.hero?.description ||"Il y a des lieux que l'on visite. Et d'autres que l'on ressent. Depuis plus de cinq ans, Lieux d'Exception écrit une histoire faite de rencontres, de paris audacieux et de passions partagées autour de l'événementiel haut de gamme. Chaque acquisition est guidée par une même ambition : révéler l'âme de lieux rares et les transformer en scènes d'émotions inoubliables."}
    backgroundImage={pageContent?.hero?.backgroundImage ||"https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/venues%2Fchateau-corbe%2Fb2b%2Fcorbe_vue_chateau_2.jpg?alt=media"}
   />

   {/* Timeline Interactive */}
   <ScrollTimeline events={events} />
   
  </main>
 );
}
