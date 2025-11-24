import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getVenues } from '@/lib/firestore';
import { generateHomeMetadata } from '@/lib/smartMetadata';
import { generateUniversalStructuredData, generateFAQSchema } from '@/lib/universalStructuredData';
import HeroCarousel from '@/components/HeroCarousel';
import HeroSection from '@/components/HeroSection';

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

      {/* Histoire et Philosophie */}
      <section className="section">
        <div className="section-container">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-primary mb-6 md:mb-8 animate-fade-in">
              Une aventure née de lieux & de passion
            </h2>
            <div className="w-20 h-px bg-accent/40 mb-6 md:mb-8" />
            <div className="text-secondary animate-fade-in space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed">
              <p>
                Tout commence par un lieu.
              </p>
              <p>
                Un domaine découvert, une émotion, l&apos;envie de partager sa beauté.
              </p>
              <p>
                Puis un second, un troisième… à chaque fois la même flamme, la même passion pour créer des souvenirs précieux.
              </p>
              <p>
                Peu à peu, ces lieux se sont reliés, unis par une même philosophie : révéler leur âme, unir les talents, sublimer chaque instant.
              </p>
              <p className="text-xl md:text-2xl font-medium text-primary mt-6 md:mt-8">
                Ainsi est née Lieux d&apos;Exception — une signature plus qu&apos;un nom, un fil conducteur entre des domaines d&apos;âme et des équipes passionnées, où chaque événement devient une histoire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Domaines */}
      <section className="section section-alt">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="section-title">Nos 5 Domaines d&apos;Exception</h2>
            <div className="accent-line" />
            <p className="section-subtitle">
              Chaque lieu est une invitation à célébrer vos moments les plus précieux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {venues.map((venue, index) => (
              <Link
                key={venue.id}
                href={venue.externalUrl || venue.url || venue.contact?.website || `/lieux/${venue.slug}`}
                {...(venue.externalUrl || venue.url || venue.contact?.website ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="venue-card animate-fade-in group overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-72 md:h-80 lg:h-96 overflow-hidden">
                  <Image
                    src={venue.cardImage || venue.images?.cardImage || venue.heroImage || venue.images?.hero || '/images/placeholder.jpg'}
                    alt={venue.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-display font-semibold text-primary group-hover:text-accent transition-colors leading-tight">
                      {venue.name}
                    </h3>
                    {venue.rating && (
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-accent text-sm">★</span>
                        <span className="text-sm font-medium">{venue.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  {venue.tagline && (
                    <p className="text-sm md:text-base font-medium mb-4 italic" style={{ color: 'var(--color-accent-dark)' }}>
                      {venue.tagline}
                    </p>
                  )}
                  
                  <p className="text-secondary text-sm md:text-base mb-6 line-clamp-2 leading-relaxed">
                    {venue.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-6 md:gap-8 text-sm md:text-base text-secondary mb-6">
                    <div>
                      <span className="text-accent uppercase tracking-wider text-xs block mb-1.5">Localisation</span>
                      <span>{venue.location || `${venue.address.city}, ${venue.address.region}`}</span>
                    </div>
                    <div>
                      <span className="text-accent uppercase tracking-wider text-xs block mb-1.5">Capacité</span>
                      <span>{venue.capacity?.min || venue.capacityMin || 0}-{venue.capacity?.seated || venue.capacitySeated || venue.capacity?.max || 0} pers.</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-primary font-medium text-sm md:text-base group-hover:text-accent transition-colors mt-auto pt-4 border-t border-stone/20">
                    {venue.externalUrl || venue.url || venue.contact?.website ? 'Visiter le site' : 'Découvrir ce lieu'}
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/catalogue" className="btn-primary">
              Voir tous nos lieux
            </Link>
          </div>
        </div>
      </section>

      {/* Nos Prestations - Lieux d'Exception, une signature d'émotion */}
      <section className="section">
        <div className="section-container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="section-title">Lieux d&apos;Exception, une signature d&apos;émotion</h2>
            <div className="accent-line" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <div className="font-display text-5xl md:text-6xl lg:text-7xl text-accent/20 font-light mb-4 md:mb-6">
                01
              </div>
              <h3 className="text-lg md:text-xl font-heading font-semibold mb-3 md:mb-4 letter-spacing-wide">Rencontres personnalisées</h3>
              <div className="w-12 md:w-16 h-px bg-accent/40 mx-auto mb-3 md:mb-4" />
              <p className="text-secondary leading-relaxed">
                Rencontres et échanges personnalisés pour comprendre vos envies et imaginer une réception à votre image.
              </p>
            </div>

            <div className="text-center">
              <div className="font-display text-5xl md:text-6xl lg:text-7xl text-accent/20 font-light mb-4 md:mb-6">
                02
              </div>
              <h3 className="text-lg md:text-xl font-heading font-semibold mb-3 md:mb-4 letter-spacing-wide">Organisation & Coordination</h3>
              <div className="w-12 md:w-16 h-px bg-accent/40 mx-auto mb-3 md:mb-4" />
              <p className="text-secondary leading-relaxed">
                Accompagnement dans l&apos;organisation et la coordination de votre événement, du choix des espaces à la mise en scène du grand jour.
              </p>
            </div>

            <div className="text-center">
              <div className="font-display text-5xl md:text-6xl lg:text-7xl text-accent/20 font-light mb-4 md:mb-6">
                03
              </div>
              <h3 className="text-lg md:text-xl font-heading font-semibold mb-3 md:mb-4 letter-spacing-wide">Réseau de partenaires</h3>
              <div className="w-12 md:w-16 h-px bg-accent/40 mx-auto mb-3 md:mb-4" />
              <p className="text-secondary leading-relaxed">
                Accès à un réseau de partenaires sélectionnés : traiteurs, décorateurs, fleuristes, photographes… tous choisis pour leur exigence et leur sens du service.
              </p>
            </div>

            <div className="text-center">
              <div className="font-display text-5xl md:text-6xl lg:text-7xl text-accent/20 font-light mb-4 md:mb-6">
                04
              </div>
              <h3 className="text-lg md:text-xl font-heading font-semibold mb-3 md:mb-4 letter-spacing-wide">Mise à disposition exclusive</h3>
              <div className="w-12 md:w-16 h-px bg-accent/40 mx-auto mb-3 md:mb-4" />
              <p className="text-secondary leading-relaxed">
                Mise à disposition exclusive de domaines pour vos événements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Émotion */}
      <section className="section relative overflow-hidden">
        <Image
          src="/images/table.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="section-container relative z-10">
          <div className="text-center">
            <p className="text-2xl md:text-3xl lg:text-4xl font-display italic text-white mb-4 md:mb-6" style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)' }}>
              Parce que l&apos;émotion se vit pleinement lorsqu&apos;elle trouve son Lieu d&apos;Exception.
            </p>
            <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 font-light uppercase tracking-wider">
              Des domaines où se mêlent beauté, sincérité et art de recevoir.
            </p>
            <Link href="/contact" className="btn-primary">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
