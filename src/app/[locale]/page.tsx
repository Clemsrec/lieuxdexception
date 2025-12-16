import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users } from 'lucide-react';
import { getVenues } from '@/lib/firestore';
import { getTranslations } from 'next-intl/server';
import { generateHomeMetadata } from '@/lib/smartMetadata';
import { generateUniversalStructuredData, generateFAQSchema } from '@/lib/universalStructuredData';
import HeroCarousel from '@/components/HeroCarousel';
import HeroSection from '@/components/HeroSection';
import HomeClient from '@/components/HomeClient';

// ISR : Cache avec revalidation toutes les heures
export const revalidate = 3600;

// Métadonnées SEO optimisées avec système universel
export const metadata: Metadata = generateHomeMetadata();

/**
 * Page d'accueil - Lieux d'Exception
 * 
 * Présentation de la marque et des 5 lieux d'exception
 * Contenu basé sur la brochure officielle Lieux d'Exception
 */
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });
  
  // Récupérer TOUS les domaines (5 châteaux)
  const venues = await getVenues();
  console.log('🏠 [page.tsx] Venues récupérées:', venues.length, venues.map(v => ({ id: v.id, name: v.name, lat: v.lat, lng: v.lng })));

  // Générer structured data pour la page d'accueil
  const organizationSchema = generateUniversalStructuredData({
    siteType: 'corporate',
    pageType: 'homepage',
    url: 'https://lieuxdexception.fr'
  });

  const faqSchema = generateFAQSchema('homepage');

  return (
    <main className="min-h-screen">
      
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
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
        buttons={[
          { label: t('contactButton'), href: `/${locale}/contact`, primary: true }
        ]}
        carousel={
          <HeroCarousel 
            images={venues
              .filter(v => v.heroImage || v.images?.heroImage || v.images?.hero || v.image)
              .map(v => v.images?.heroImage || v.images?.hero || v.heroImage || v.image)
              .filter((img): img is string => Boolean(img))
              .slice(0, 5)}
          />
        }
      />

      {/* Contenu principal géré par le composant client avec animations */}
      <HomeClient venues={venues} />

    </main>
  );
}
