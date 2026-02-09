import HeroSection from '@/components/HeroSection';
import ContactPageClient from '@/components/ContactPageClient';
import type { Metadata } from 'next';
import { STORAGE_IMAGES } from '@/lib/storage-assets';
import { getPageContent } from '@/lib/firestore';

/**
 * Métadonnées pour la page Contact
 */
export const metadata: Metadata = {
  title: 'Contact - Lieux d\'Exception',
  description: 'Contactez-nous pour organiser votre événement professionnel ou votre mariage dans l\'un de nos lieux d\'exception.',
  openGraph: {
    title: 'Contact - Lieux d\'Exception',
    description: 'Contactez-nous pour organiser votre événement professionnel ou votre mariage dans l\'un de nos lieux d\'exception.',
    type: 'website',
    siteName: 'Lieux d\'Exception',
    images: [
      {
        url: STORAGE_IMAGES.contactHero,
        width: 1200,
        height: 630,
        alt: 'Contactez Lieux d\'Exception',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact - Lieux d\'Exception',
    description: 'Contactez-nous pour organiser votre événement professionnel ou votre mariage dans l\'un de nos lieux d\'exception.',
    images: [STORAGE_IMAGES.contactHero],
  },
};

/**
 * Revalidation : 60 secondes
 * Les données Firestore sont rafraîchies toutes les minutes
 */
export const revalidate = 60;

/**
 * Page Contact - Server Component avec contenu dynamique Firestore
 */
export default async function ContactPage({ params }: { params: Promise<{ locale?: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam || 'fr';
  
  // Charger le contenu dynamique depuis Firestore
  const pageContent = await getPageContent('contact', locale === 'fr' ? 'fr' : 'en');
  
  // Log pour diagnostiquer
  console.log('🔍 [ContactPage] pageContent:', pageContent?.contactInfo ? `${pageContent.contactInfo.length} contacts` : 'pas de contactInfo');
  
  // Données par défaut si le contenu n'existe pas encore
  const defaultContactInfo = [
    {
      type: 'b2b',
      phone: '06 70 56 28 79',
      email: 'contact@lieuxdexception.com',
      description: 'Événements Professionnels',
    },
    {
      type: 'wedding',
      phone: '06 02 03 70 11',
      email: 'contact@lieuxdexception.com',
      description: 'Mariages & Événements Privés',
    },
  ];
  
  const contactInfo = pageContent?.contactInfo || defaultContactInfo;
  console.log('🔍 [ContactPage] contactInfo final:', contactInfo.length, 'contacts');
  const heroData = pageContent?.hero || {
    title: 'Contactez-Nous',
    subtitle: 'Notre équipe est à votre écoute pour concrétiser votre projet',
  };

  return (
    <main className="min-h-screen">
      <HeroSection
        title={heroData.title}
        subtitle={heroData.subtitle}
        backgroundImage="https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/images%2Fcontact-hero.jpg?alt=media"
      />

      <ContactPageClient contactInfo={contactInfo} />
    </main>
  );
}
