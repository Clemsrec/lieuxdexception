import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getVenues } from '@/lib/firestore';

// ISR : Cache avec revalidation toutes les heures
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Lieux d\'Exception | La clé de vos moments uniques',
  description: 'Découvrez 5 domaines d\'exception en France pour vos mariages et événements professionnels. Châteaux, domaines et salles de prestige sélectionnés avec passion.',
  keywords: ['lieux d\'exception', 'mariages', 'événements B2B', 'châteaux', 'domaines', 'séminaires', 'réceptions'],
};

/**
 * Page d'accueil - Lieux d'Exception
 * 
 * Présentation de la marque et des 5 lieux d'exception
 * Contenu basé sur la brochure officielle Lieux d'Exception
 */
export default async function Home() {
  // Récupérer les domaines mis en avant
  const venues = await getVenues({ featured: true });

  return (
    <main className="min-h-screen">
      
      {/* Hero Section */}
      <section className="hero-section relative">
        <Image
          src="/images/Vue-chateau.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="hero-content">
          <h1 className="hero-title animate-fade-in">
            Lieux d&apos;Exception
          </h1>
          <div className="accent-line" />
          <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.2s' }}>
            La clé de vos moments uniques
          </p>
          <p className="text-white/90 text-lg mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Des domaines où se mêlent beauté, sincérité et art de recevoir
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link href="/catalogue" className="btn-primary">
              Découvrir nos lieux
            </Link>
            <Link href="/contact" className="btn-secondary" style={{ color: 'white', borderColor: 'white' }}>
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Histoire et Philosophie */}
      <section className="section">
        <div className="section-container">
          <div>
            <h2 className="section-title animate-fade-in">
              Une aventure née de lieux & de passion
            </h2>
            <div className="accent-line" />
            <div className="section-subtitle animate-fade-in space-y-6 text-lg">
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
              <p className="text-2xl font-medium text-primary mt-8">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {venues.map((venue, index) => (
              <Link
                key={venue.id}
                href={`/lieux/${venue.slug}`}
                className="venue-card animate-fade-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-80 overflow-hidden rounded-t-lg">
                  <Image
                    src={venue.images.hero}
                    alt={venue.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-display font-semibold text-primary group-hover:text-accent transition-colors">
                      {venue.name}
                    </h3>
                    {venue.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-accent text-sm">★</span>
                        <span className="text-sm font-medium">{venue.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  {venue.tagline && (
                    <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-accent-dark)' }}>
                      {venue.tagline}
                    </p>
                  )}
                  
                  <p className="text-secondary text-sm mb-4 line-clamp-2">
                    {venue.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-6 text-sm text-secondary mb-4">
                    <div>
                      <span className="text-accent uppercase tracking-wider text-xs block mb-1">Localisation</span>
                      <span>{venue.location || `${venue.address.city}, ${venue.address.region}`}</span>
                    </div>
                    <div>
                      <span className="text-accent uppercase tracking-wider text-xs block mb-1">Capacité</span>
                      <span>{venue.capacity?.min || venue.capacityMin || 0}-{venue.capacity?.seated || venue.capacitySeated || venue.capacity?.max || 0} pers.</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-primary font-medium group-hover:text-accent transition-colors">
                    Découvrir
                    <span className="ml-2">→</span>
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
          <div className="text-center mb-16">
            <h2 className="section-title">Lieux d&apos;Exception, une signature d&apos;émotion</h2>
            <div className="accent-line" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="font-display text-7xl text-accent/20 font-light mb-6">
                01
              </div>
              <h3 className="text-xl font-heading font-semibold mb-4 letter-spacing-wide">Rencontres personnalisées</h3>
              <div className="w-16 h-px bg-accent/40 mx-auto mb-4" />
              <p className="text-secondary leading-relaxed">
                Rencontres et échanges personnalisés pour comprendre vos envies et imaginer une réception à votre image.
              </p>
            </div>

            <div className="text-center">
              <div className="font-display text-7xl text-accent/20 font-light mb-6">
                02
              </div>
              <h3 className="text-xl font-heading font-semibold mb-4 letter-spacing-wide">Organisation & Coordination</h3>
              <div className="w-16 h-px bg-accent/40 mx-auto mb-4" />
              <p className="text-secondary leading-relaxed">
                Accompagnement dans l&apos;organisation et la coordination de votre événement, du choix des espaces à la mise en scène du grand jour.
              </p>
            </div>

            <div className="text-center">
              <div className="font-display text-7xl text-accent/20 font-light mb-6">
                03
              </div>
              <h3 className="text-xl font-heading font-semibold mb-4 letter-spacing-wide">Réseau de partenaires</h3>
              <div className="w-16 h-px bg-accent/40 mx-auto mb-4" />
              <p className="text-secondary leading-relaxed">
                Accès à un réseau de partenaires sélectionnés : traiteurs, décorateurs, fleuristes, photographes… tous choisis pour leur exigence et leur sens du service.
              </p>
            </div>

            <div className="text-center">
              <div className="font-display text-7xl text-accent/20 font-light mb-6">
                04
              </div>
              <h3 className="text-xl font-heading font-semibold mb-4 letter-spacing-wide">Mise à disposition exclusive</h3>
              <div className="w-16 h-px bg-accent/40 mx-auto mb-4" />
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
            <p className="text-3xl md:text-4xl font-display italic text-white mb-6" style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)' }}>
              Parce que l&apos;émotion se vit pleinement lorsqu&apos;elle trouve son Lieu d&apos;Exception.
            </p>
            <p className="text-xl text-white/90 mb-8 font-light uppercase tracking-wider">
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
