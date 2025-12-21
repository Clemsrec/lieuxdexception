import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users } from 'lucide-react';
import { getVenues, getPageContent } from '@/lib/firestore';
import { getTranslations } from 'next-intl/server';
import { generateHomeMetadata } from '@/lib/smartMetadata';
import { generateUniversalStructuredData, generateFAQSchema } from '@/lib/universalStructuredData';
import HeroCarousel from '@/components/HeroCarousel';
import HeroSection from '@/components/HeroSection';
import HomeClient from '@/components/HomeClient';
import PreloadHeroImages from '@/components/PreloadHeroImages';

// ISR : Cache avec revalidation toutes les heures
// Revalidation toutes les 60 secondes pour forcer le rafraîchissement
export const revalidate = 60;

// Métadonnées SEO optimisées avec système universel
export const metadata: Metadata = generateHomeMetadata();

/**
 * Page d'accueil - Lieux d'Exception
 * 
 * Présentation de la marque et des lieux d'exception
 * Contenu basé sur la brochure officielle Lieux d'Exception
 */
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });
  
  // Récupérer TOUS les domaines
  const venues = await getVenues();

  // Récupérer le contenu de la page depuis Firestore (CMS)
  const pageContent = await getPageContent('homepage', locale === 'fr' ? 'fr' : 'en');
  
  // Préparer les images pour le carousel
  const carouselImages = venues
    .filter(v => v.images?.hero || v.heroImage || v.image)
    .map(v => v.images?.hero || v.heroImage || v.image)
    .filter((img): img is string => Boolean(img))
    .slice(0, 5);

  // Générer structured data pour la page d'accueil
  const organizationSchema = generateUniversalStructuredData({
    siteType: 'corporate',
    pageType: 'homepage',
    url: 'https://lieuxdexception.com'
  });

  const faqSchema = generateFAQSchema('homepage');

  return (
    <main className="min-h-screen">
      
      {/* Preload hero images pour améliorer LCP (-1 000 ms) */}
      <PreloadHeroImages images={carouselImages} />
      
      {/* Structured Data JSON-LD */}
      {organizationSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero Section avec carousel de photos réelles des châteaux */}
      <HeroSection
        title={pageContent?.hero?.title || t('title')}
        subtitle={pageContent?.hero?.subtitle || t('subtitle')}
        description={pageContent?.hero?.description || t('description')}
        buttons={pageContent?.hero?.buttons || [
          { label: t('contactButton'), href: `/${locale}/contact`, primary: true }
        ]}
        carousel={
          <HeroCarousel 
            images={carouselImages}
          />
        }
      />

      {/* Contenu principal géré par le composant client avec animations */}
      <HomeClient venues={venues} pageContent={pageContent} />

    </main>
  );
}
