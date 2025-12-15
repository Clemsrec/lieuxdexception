import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users } from 'lucide-react';
import { getVenues } from '@/lib/firestore';
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
export default async function Home() {
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
        title="Lieux d'Exception"
        subtitle="La clé de vos moments uniques"
        description="Des domaines où se mêlent beauté, sincérité et art de recevoir"
        buttons={[
          { label: "Découvrir nos lieux", href: "/catalogue", primary: true },
          { label: "Nous contacter", href: "/contact", primary: false }
        ]}
        carousel={
          <HeroCarousel 
            images={venues
              .filter(v => v.heroImage || v.images?.heroImage)
              .map(v => v.heroImage || v.images?.heroImage || v.images?.hero)
              .filter(Boolean)
              .slice(0, 5)}
            fallbackImages={[
              '/images/Vue-chateau.jpg',
              '/images/table.jpg',
              '/images/salle-seminaire.jpg',
            ]}
          />
        }
      />

      {/* Contenu principal géré par le composant client avec animations */}
      <HomeClient venues={venues} />

    </main>
  );
}
