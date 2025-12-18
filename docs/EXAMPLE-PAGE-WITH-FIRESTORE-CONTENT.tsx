import { getPageContent } from '@/lib/firestore';
import HeroSection from '@/components/HeroSection';
import { ContentSection, FeatureCard, ContentBlock, FinalCTA } from '@/components/PageContentComponents';
import { motion } from 'framer-motion';

/**
 * EXEMPLE D'UTILISATION DU SYSTÈME DE GESTION DES CONTENUS
 * 
 * Ce fichier montre comment adapter une page existante pour charger
 * ses contenus depuis Firestore au lieu de les avoir en dur.
 * 
 * À FAIRE POUR CHAQUE PAGE :
 * 1. Importer getPageContent et les composants PageContentComponents
 * 2. Charger le contenu dans le Server Component
 * 3. Passer le contenu aux composants d'affichage
 * 4. Remplacer les textes hardcodés par les données de Firestore
 */

/**
 * Exemple : Page Homepage adaptée pour Firestore
 */
export default async function ExampleHomepage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Charger le contenu depuis Firestore
  const content = await getPageContent('homepage', locale);
  
  // Fallback si le contenu n'existe pas encore
  if (!content) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">
            Contenu non disponible
          </h1>
          <p className="text-secondary">
            Le contenu de cette page n&apos;a pas encore été créé.
            <br />
            Exécutez : <code className="bg-neutral-100 px-2 py-1 rounded">node scripts/init-page-contents.js</code>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section - Données depuis Firestore */}
      <HeroSection
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        description={content.hero.description}
        backgroundImage={content.hero.backgroundImage}
        buttons={content.hero.ctaText ? [
          { 
            label: content.hero.ctaText, 
            href: content.hero.ctaLink || '/contact', 
            primary: true 
          }
        ] : []}
      />

      {/* Sections de contenu */}
      {content.sections.filter((s: any) => s.visible).map((section: any, index: number) => (
        <section key={section.id} className={`section ${index % 2 === 0 ? 'bg-white' : 'bg-stone-50'}`}>
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <ContentSection
                title={section.title}
                content={section.content}
                animateOnScroll={true}
              />
            </div>
          </div>
        </section>
      ))}

      {/* Feature Cards (pour homepage) */}
      {content.featureCards && content.featureCards.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Lieux d&apos;Exception, une signature d&apos;émotion
              </h2>
              <div className="w-20 h-px bg-accent/40 mx-auto my-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {content.featureCards
                .filter((card: any) => card.visible)
                .sort((a: any, b: any) => a.order - b.order)
                .map((card: any) => (
                  <FeatureCard
                    key={card.id}
                    number={card.number}
                    title={card.title}
                    content={card.content}
                  />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Blocs de contenu (pour B2B) */}
      {content.blocks && content.blocks.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {content.blocks
                .filter((block: any) => block.visible)
                .sort((a: any, b: any) => a.order - b.order)
                .map((block: any) => (
                  <ContentBlock
                    key={block.id}
                    title={block.title}
                    subtitle={block.subtitle}
                    content={block.content}
                    image={block.image}
                    imageAlt={block.imageAlt}
                    ctaText={block.ctaText}
                    ctaLink={block.ctaLink}
                  />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      {content.finalCta && (
        <FinalCTA
          title={content.finalCta.title}
          subtitle={content.finalCta.subtitle}
          content={content.finalCta.content}
          ctaText={content.finalCta.ctaText}
          ctaLink={content.finalCta.ctaLink}
          backgroundImage={content.finalCta.backgroundImage}
        />
      )}
    </main>
  );
}
