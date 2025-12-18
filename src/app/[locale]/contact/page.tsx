import HeroSection from '@/components/HeroSection';
import ContactPageClient from '@/components/ContactPageClient';
import type { Metadata } from 'next';

/**
 * Métadonnées pour la page Contact
 */
export const metadata: Metadata = {
  title: 'Contact - Lieux d\'Exception',
  description: 'Contactez-nous pour organiser votre événement professionnel ou votre mariage dans l\'un de nos lieux d\'exception.',
};

/**
 * Page Contact - Server Component
 */
export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <HeroSection
        title="Contactez-Nous"
        subtitle="Notre équipe est à votre écoute pour concrétiser votre projet"
        backgroundImage="https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/images%2Fcontact-hero.jpg?alt=media"
      />

      <ContactPageClient />
    </main>
  );
}
