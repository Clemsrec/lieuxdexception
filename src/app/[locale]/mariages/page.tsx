import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import { generateServiceMetadata } from '@/lib/smartMetadata';
import { generateUniversalStructuredData, generateFAQSchema } from '@/lib/universalStructuredData';
import { getTranslations } from 'next-intl/server';

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
 * dans les 5 lieux d'exception du Groupe Riou.
 */
export default async function MariagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Weddings' });
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
    <main className="min-h-screen bg-stone-light">
      
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
        backgroundImage="/images/table-seminaire.jpg"
        buttons={[
          { label: t('requestInfo'), href: `/${locale}/contact`, primary: true },
          { label: t('viewVenues'), href: `/${locale}/catalogue`, primary: false }
        ]}
      />

      {/* Galerie de photos */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              {t('gallery.title')}
            </h2>
            <div className="accent-line" />
            <p className="text-secondary text-lg mt-6">
              {t('gallery.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="relative aspect-4/3 overflow-hidden rounded-lg">
              <Image
                src="/venues/chateau-de-la-brulaire/ef0dc0f1-274d-49f6-bdf8-abd123a8eaa2-01.webp"
                alt="Château de la Brûlaire"
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
            <div className="relative aspect-4/3 overflow-hidden rounded-lg">
              <Image
                src="/venues/manoir-de-la-boulaie/image-17-nov-2025-18-29-07-01.webp"
                alt="Manoir de la Boulaie"
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
            <div className="relative aspect-4/3 overflow-hidden rounded-lg">
              <Image
                src="/venues/chateau-de-la-corbe/photo-2025-11-13-18-49-13-3-01.webp"
                alt="Château de la Corbe"
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
            <div className="relative aspect-4/3 overflow-hidden rounded-lg">
              <Image
                src="/venues/domaine-nantais/image-17-nov-2025-19-34-28-01.webp"
                alt="Domaine Nantais"
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
            <div className="relative aspect-4/3 overflow-hidden rounded-lg">
              <Image
                src="/venues/le-dome/whatsapp-image-2025-11-05-at-12-03-07-1-01.webp"
                alt="Le Dôme"
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
            <div className="relative aspect-4/3 overflow-hidden rounded-lg">
              <Image
                src="/venues/chateau-de-la-brulaire/img-0079-02.webp"
                alt="Détail château"
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/catalogue" className="btn-primary">
              Découvrir tous nos lieux
            </Link>
          </div>
        </div>
      </section>

      {/* Lieux d'Exception, une signature d'émotion */}
      <section className="section bg-stone/30">
        <div className="container">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8">
              Lieux d&apos;Exception, une signature d&apos;émotion
            </h2>
            <div className="accent-line" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-12">
            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="font-display text-4xl md:text-5xl text-accent/30 font-light shrink-0">01</div>
                <h3 className="text-lg md:text-xl font-semibold">Rencontres personnalisées</h3>
              </div>
              <p className="text-secondary leading-relaxed">
                Rencontres et échanges personnalisés pour comprendre vos envies et imaginer une réception à votre image.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="font-display text-4xl md:text-5xl text-accent/30 font-light shrink-0">02</div>
                <h3 className="text-lg md:text-xl font-semibold">Organisation & Coordination</h3>
              </div>
              <p className="text-secondary leading-relaxed">
                Accompagnement dans l&apos;organisation et la coordination de votre événement, du choix des espaces à la mise en scène du grand jour.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="font-display text-4xl md:text-5xl text-accent/30 font-light shrink-0">03</div>
                <h3 className="text-lg md:text-xl font-semibold">Réseau de partenaires sélectionnés</h3>
              </div>
              <p className="text-secondary leading-relaxed">
                Accès à un réseau de partenaires sélectionnés : traiteurs, décorateurs, fleuristes, photographes… tous choisis pour leur exigence et leur sens du service.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="font-display text-4xl md:text-5xl text-accent/30 font-light shrink-0">04</div>
                <h3 className="text-lg md:text-xl font-semibold">Mise à disposition exclusive</h3>
              </div>
              <p className="text-secondary leading-relaxed">
                Mise à disposition exclusive de domaines pour vos événements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-accent/5">
        <div className="container">
          <div className="text-center bg-accent/10 rounded-2xl p-6 md:p-12 border border-accent/20">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Parce que l&apos;émotion se vit pleinement lorsqu&apos;elle trouve son Lieu d&apos;Exception
            </h2>
            <p className="text-secondary text-base md:text-lg mb-8">
              Des domaines où se mêlent beauté, sincérité et art de recevoir.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact" className="btn-primary">
                Nous contacter
              </Link>
              <div className="text-sm md:text-base text-secondary">
                <p><strong className="text-foreground">Téléphone :</strong> <a href="tel:0602037011" className="hover:text-primary transition-colors">06 02 03 70 11</a></p>
                <p><strong className="text-foreground">Email :</strong> <a href="mailto:contact@lieuxdexception.com" className="hover:text-primary transition-colors">contact@lieuxdexception.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
