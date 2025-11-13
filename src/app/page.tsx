import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import { getVenues } from '@/lib/firestore';

// Forcer le rendu dynamique pour éviter les erreurs Firebase au build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Lieux d\'Exception | La clé de vos moments uniques',
  description: 'Découvrez 5 domaines d\'exception en France pour vos mariages et événements professionnels. Châteaux, domaines et salles de prestige sélectionnés avec passion.',
  keywords: ['lieux d\'exception', 'mariages', 'événements B2B', 'châteaux', 'domaines', 'séminaires', 'réceptions'],
};

/**
 * Page d'accueil - Lieux d'Exception
 * 
 * Présentation de la marque et des 5 lieux d'exception
 */
export default async function Home() {
  // Récupérer les 4 domaines (featured)
  const venues = await getVenues({ featured: true });

  return (
    <main className="min-h-screen">
      
      {/* Hero Section */}
      <section className="hero-section">
        <Image
          src="/images/hero-home.jpg"
          alt="Lieux d'Exception"
          fill
          priority
          className="object-cover"
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
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Des domaines où se mêlent beauté, sincérité et art de recevoir
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
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
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-title animate-fade-in">
              Une aventure née de lieux & de passion
            </h2>
            <div className="accent-line" />
            <div className="section-subtitle animate-fade-in space-y-6">
              <p>
                Tout commence par un lieu. Un domaine découvert, une émotion, l&apos;envie de partager sa beauté.
              </p>
              <p>
                Puis un second, un troisième… à chaque fois la même flamme, la même passion pour créer des souvenirs précieux.
              </p>
              <p>
                Peu à peu, ces lieux se sont reliés, unis par une même philosophie : révéler leur âme, unir les talents, sublimer chaque instant.
              </p>
              <p className="text-lg font-medium text-primary">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
                        <Icon type="star" size={16} className="text-accent" aria-label="Note" />
                        <span className="text-sm font-medium">{venue.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-accent-dark text-sm font-medium mb-3">
                    {venue.tagline}
                  </p>
                  
                  <p className="text-secondary text-sm mb-4 line-clamp-2">
                    {venue.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-secondary mb-4">
                    <div className="flex items-center gap-1">
                      <Icon type="mapPin" size={14} aria-label="Localisation" />
                      {venue.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon type="users" size={14} aria-label="Capacité" />
                      {venue.capacityMin}-{venue.capacitySeated} pers.
                    </div>
                  </div>
                  
                  <div className="flex items-center text-primary font-medium group-hover:text-accent transition-colors">
                    Découvrir
                    <Icon type="externalLink" size={16} className="ml-2" aria-label="Voir plus" />
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

      {/* Nos Prestations */}
      <section className="section">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="section-title">Nos Prestations</h2>
            <div className="accent-line" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon type="users" size={32} className="text-accent" aria-label="Accompagnement" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">Accompagnement personnalisé</h3>
              <p className="text-secondary">
                Rencontres et échanges personnalisés pour comprendre vos envies et imaginer une réception à votre image
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon type="trophy" size={32} className="text-accent" aria-label="Partenaires" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">Réseau de partenaires</h3>
              <p className="text-secondary">
                Accès à un réseau de partenaires sélectionnés : traiteurs, décorateurs, fleuristes, photographes…
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon type="sparkles" size={32} className="text-accent" aria-label="Exclusivité" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">Exclusivité garantie</h3>
              <p className="text-secondary">
                Mise à disposition exclusive de nos domaines pour vos événements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Émotion */}
      <section className="section section-alt">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-3xl md:text-4xl font-display italic text-primary mb-8">
              « Parce que l&apos;émotion se vit pleinement lorsqu&apos;elle trouve son Lieu d&apos;Exception. »
            </p>
            <Link href="/contact" className="btn-primary">
              Commencer votre projet
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}