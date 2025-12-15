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
  'Événements B2B et Séminaires',
  'Organisation complète de séminaires, conférences et événements corporate dans nos domaines d\'exception en Loire-Atlantique'
);

/**
 * Page Événements B2B
 * 
 * Cette page présente les services et solutions pour les événements
 * professionnels dans les 5 lieux d'exception du Groupe Riou.
 */
export default async function EvenementsB2BPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'B2B' });
  // Générer structured data
  const serviceSchema = generateUniversalStructuredData({
    siteType: 'corporate',
    pageType: 'service',
    data: {
      name: 'Événements B2B et Séminaires',
      description: 'Organisation d\'événements professionnels dans nos lieux d\'exception'
    },
    url: 'https://lieuxdexception.fr/evenements-b2b'
  });

  const faqSchema = generateFAQSchema('service');

  return (
    <main className="min-h-screen bg-neutral-900">
      
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
        backgroundImage="/images/salle-seminaire.jpg"
        buttons={[
          { label: t('requestQuote'), href: `/${locale}/contact`, primary: true },
          { label: t('viewCatalog'), href: `/${locale}/catalogue`, primary: false }
        ]}
      />

      {/* Galerie de photos événements */}
      <section className="section bg-neutral-800">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              {t('gallery.title')}
            </h2>
            <div className="accent-line" />
            <p className="text-neutral-300 text-lg mt-6">
              {t('gallery.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="relative aspect-3/4 overflow-hidden rounded-lg">
              <Image
                src="/venues/manoir-de-la-boulaie/photo-2025-11-17-12-04-49-7-24.webp"
                alt={t('gallery.seminarRoom')}
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg">
              <Image
                src="/venues/chateau-de-la-brulaire/le-1825-la-table-domaine-de-la-brulaire-00008-08.webp"
                alt={t('gallery.receptionSpace')}
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg">
              <Image
                src="/venues/domaine-nantais/photo-2025-11-17-12-08-54-2-04.webp"
                alt={t('gallery.conferenceRoom')}
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-lg">
              <Image
                src="/venues/le-dome/whatsapp-image-2025-11-05-at-12-03-12-04.webp"
                alt={t('gallery.modernSpace')}
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ce que nous vous offrons */}
      <section className="section bg-primary/95">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-white">
              {t('offer.title')}
            </h2>
            <div className="accent-line" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Une émotion d'éveil */}
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-white flex items-center">
                <div className="w-12 md:w-20 h-px bg-accent mr-3 md:mr-4 shrink-0" />
                {t('offer.pillar1.title')}
              </h3>
              <p className="text-neutral-200 leading-relaxed">
                {t('offer.pillar1.description')}
              </p>
            </div>

            {/* Un service d'excellence */}
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-white flex items-center">
                <div className="w-12 md:w-20 h-px bg-accent mr-3 md:mr-4 shrink-0" />
                {t('offer.pillar2.title')}
              </h3>
              <p className="text-neutral-200 leading-relaxed">
                {t('offer.pillar2.description')}
              </p>
            </div>

            {/* Des lieux inspirés */}
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-white flex items-center">
                <div className="w-12 md:w-20 h-px bg-accent mr-3 md:mr-4 shrink-0" />
                {t('offer.pillar3.title')}
              </h3>
              <p className="text-neutral-200 leading-relaxed">
                {t('offer.pillar3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Une expérience pour vos équipes */}
      <section className="section bg-neutral-800">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-white">
              Une expérience pour vos équipes et vos clients
            </h2>
            <div className="accent-line" />
            <p className="text-neutral-300 text-base md:text-lg mt-6">
              Dans un environnement professionnel en constante évolution, il est essentiel de proposer des événements qui ont du sens et de l&apos;impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-neutral-900 border border-accent/30 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-accent">Marquer les esprits</h3>
              <p className="text-neutral-200 leading-relaxed">
                Des lieux conçus pour <strong>marquer les esprits, valoriser votre image et créer une vraie connexion humaine.</strong>
              </p>
            </div>

            <div className="bg-neutral-900 border border-accent/30 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-accent">Environnements propices</h3>
              <p className="text-neutral-200 leading-relaxed">
                Des environnements propices à la <strong>cohésion, à la créativité ou à la prise de recul,</strong> loin des lieux standardisés.
              </p>
            </div>

            <div className="bg-neutral-900 border border-accent/30 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-accent">Liberté totale</h3>
              <p className="text-neutral-200 leading-relaxed">
                Une <strong>liberté totale de création :</strong> nos lieux sont ouverts aux formats les plus audacieux, des plus confidentiels aux plus immersifs.
              </p>
            </div>

            <div className="bg-neutral-900 border border-accent/30 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-accent">Équipe passionnée</h3>
              <p className="text-neutral-200 leading-relaxed">
                Une <strong>équipe de passionnés à vos côtés,</strong> qui aime repousser les limites du brief et aller au-delà des attentes initiales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-neutral-900">
        <div className="container">
          <div className="text-center bg-primary rounded-2xl p-6 md:p-12 border-2 border-accent/40">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              Êtes-vous prêt à vivre cette expérience ?
            </h2>
            <p className="text-white/90 text-base md:text-lg mb-2">
              <strong>Lieux d&apos;Exception, c&apos;est plus qu&apos;un service événementiel :</strong>
            </p>
            <p className="text-white/90 text-base md:text-lg mb-8">
              c&apos;est une promesse de singularité, une invitation à l&apos;émotion, une exigence de qualité.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact" className="btn-primary">
                Nous contacter
              </Link>
              <div className="text-sm md:text-base text-white/90">
                <p><strong className="text-white">Téléphone :</strong> <a href="tel:0602037011" className="hover:text-accent transition-colors">06 02 03 70 11</a></p>
                <p><strong className="text-white">Email :</strong> <a href="mailto:contact@lieuxdexception.com" className="hover:text-accent transition-colors">contact@lieuxdexception.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
