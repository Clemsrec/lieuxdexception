/**
 * Page individuelle d'un lieu d'exception
 * Route dynamique : /lieux/[slug]
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getVenues } from '@/lib/firestore';
import { displayVenueName } from '@/lib/formatVenueName';

// ISR : Cache avec revalidation toutes les 2 heures
export const revalidate = 7200;

interface VenuePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Générer les métadonnées dynamiques
export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
  const { slug } = await params;
  const venues = await getVenues();
  const venue = venues.find(v => v.slug === slug);
  
  if (!venue) {
    return {
      title: 'Lieu non trouvé | Lieux d\'Exception',
    };
  }

  return {
    title: `${displayVenueName(venue.name)} | Lieux d'Exception`,
    description: venue.description,
    keywords: [venue.name, venue.location, 'mariage', 'événement', 'réception', 'château', 'domaine'],
  };
}

// Générer les routes statiques au build (SSG + ISR)
export async function generateStaticParams() {
  try {
    const venues = await getVenues({ featured: false }); // Tous les lieux
    return venues.map((venue) => ({
      slug: venue.slug,
    }));
  } catch (error) {
    console.error('[generateStaticParams] Erreur:', error);
    return []; // Retour vide en cas d'erreur, Next.js générera à la demande
  }
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { slug } = await params;
  const venues = await getVenues();
  const venue = venues.find(v => v.slug === slug);

  if (!venue) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      
      {/* Hero avec image */}
      <section className="relative h-[70vh] min-h-[500px]">
        <Image
          src={venue.images.hero}
          alt={displayVenueName(venue.name)}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/50 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container pb-16 w-full">
            <div>
              <div className="flex items-center gap-4 mb-4 text-white/90">
                <Link href="/catalogue" className="hover:text-white transition-colors flex items-center gap-2">
                  
                  Retour au catalogue
                </Link>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-display font-semibold text-white mb-4 animate-fade-in">
                {displayVenueName(venue.name)}
              </h1>
              
              {venue.tagline && (
                <p className="text-2xl text-accent-light font-medium mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  {venue.tagline}
                </p>
              )}
              
              <div className="flex flex-wrap gap-6 text-white/90 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2">
                  
                  <span>{venue.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  
                  <span>{venue.capacityMin || 20} - {venue.capacitySeated} personnes</span>
                </div>
                {venue.rating && (
                  <div className="flex items-center gap-2">
                    
                    <span>{venue.rating}/5 ({venue.reviewsCount} avis)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barre d'actions rapides */}
      <section className="sticky top-16 z-40 bg-white border-b border-neutral-200 shadow-md">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            <div className="flex gap-6">
              <a href="#description" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                Description
              </a>
              <a href="#espaces" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                Espaces
              </a>
              <a href="#galerie" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                Galerie
              </a>
              <a href="#contact" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                Contact
              </a>
            </div>
            <Link href="/contact" className="btn-primary btn-sm">
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

      {/* Description et expérience */}
      <section id="description" className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contenu principal */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-display font-semibold text-primary mb-6">
                  Découvrez {displayVenueName(venue.name)}
                </h2>
                <div className="prose prose-lg max-w-none text-secondary">
                  <p className="text-lg leading-relaxed">{venue.description}</p>
                </div>
              </div>

              {venue.experienceText && (
                <div className="bg-stone-light p-8 rounded-xl">
                  <h3 className="text-2xl font-display font-semibold text-primary mb-4">
                    Votre expérience
                  </h3>
                  <p className="text-secondary leading-relaxed italic">
                    {venue.experienceText}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar informations clés */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-neutral-200 rounded-xl p-6 sticky top-32">
                <h3 className="text-xl font-heading font-semibold text-primary mb-6">
                  Informations pratiques
                </h3>
                
                <div className="space-y-6">
                  {/* Capacité */}
                  <div>
                    <div className="flex items-center gap-2 text-accent-dark font-medium mb-2">
                      
                      Capacité
                    </div>
                    <ul className="text-sm text-secondary space-y-1 ml-6">
                      <li>• Minimum : {venue.capacityMin || 20} personnes</li>
                      <li>• Dîner assis : {venue.capacitySeated} personnes</li>
                      {venue.capacityStanding && (
                        <li>• Cocktail : {venue.capacityStanding} personnes</li>
                      )}
                    </ul>
                  </div>

                  {/* Équipements */}
                  {venue.amenitiesList && venue.amenitiesList.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-accent-dark font-medium mb-2">
                        
                        Équipements
                      </div>
                      <ul className="text-sm text-secondary space-y-1 ml-6">
                        {venue.amenitiesList.slice(0, 6).map((amenity: string, i: number) => (
                          <li key={i}>• {amenity}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Contact rapide */}
                  <div className="pt-4 border-t border-neutral-200">
                    <Link href="/contact" className="btn-primary w-full">
                      Demander un devis
                    </Link>
                    {venue.contact?.phone && (
                      <a 
                        href={`tel:${venue.contact.phone}`}
                        className="btn-secondary w-full inline-flex items-center gap-2 mt-3"
                      >
                        
                        {venue.contact.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Espaces disponibles */}
      {venue.spaces && venue.spaces.length > 0 && (
        <section id="espaces" className="section bg-alt">
          <div className="container">
            <h2 className="text-3xl font-display font-semibold text-primary mb-8 text-center">
              Espaces disponibles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venue.spaces.map((space: string, index: number) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-neutral-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                      
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-primary mb-1">{space}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Galerie photos */}
      {venue.images.gallery && venue.images.gallery.length > 0 && (
        <section id="galerie" className="section">
          <div className="container">
            <h2 className="text-3xl font-display font-semibold text-primary mb-8 text-center">
              Galerie photos
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {venue.images.gallery.map((image, index) => (
                <div key={index} className="relative aspect-4/3 overflow-hidden rounded-lg group cursor-pointer">
                  <Image
                    src={image}
                    alt={`${displayVenueName(venue.name)} - Photo ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact et coordonnées */}
      <section id="contact" className="section bg-alt">
        <div className="container">
          <div>
            <h2 className="text-3xl font-display font-semibold text-primary mb-8 text-center">
              Contactez-nous
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Coordonnées */}
              <div className="bg-white p-8 rounded-xl border border-neutral-200">
                <h3 className="text-xl font-heading font-semibold text-primary mb-6">
                  Informations de contact
                </h3>
                <div className="space-y-4">
                  {venue.contact?.phone && (
                    <div className="flex items-start gap-3">
                      
                      <div>
                        <div className="text-sm text-secondary mb-1">Téléphone</div>
                        <a href={`tel:${venue.contact.phone}`} className="text-primary font-medium hover:text-accent transition-colors">
                          {venue.contact.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {venue.contact?.email && (
                    <div className="flex items-start gap-3">
                      
                      <div>
                        <div className="text-sm text-secondary mb-1">Email</div>
                        <a href={`mailto:${venue.contact.email}`} className="text-primary font-medium hover:text-accent transition-colors break-all">
                          {venue.contact.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {venue.address && typeof venue.address === 'string' && (
                    <div className="flex items-start gap-3">
                      
                      <div>
                        <div className="text-sm text-secondary mb-1">Adresse</div>
                        <address className="text-primary font-medium not-italic">
                          {venue.address}
                        </address>
                      </div>
                    </div>
                  )}

                  {venue.contact?.instagram && (
                    <div className="flex items-start gap-3">
                      
                      <div>
                        <div className="text-sm text-secondary mb-1">Instagram</div>
                        <a 
                          href={`https://instagram.com/${venue.contact.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary font-medium hover:text-accent transition-colors"
                        >
                          {venue.contact.instagram}
                        </a>
                      </div>
                    </div>
                  )}

                  {venue.contact?.mariagesNet && (
                    <div className="pt-4 border-t border-neutral-200">
                      <a 
                        href={venue.contact.mariagesNet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-accent hover:text-accent-dark transition-colors font-medium"
                      >
                        
                        Voir sur Mariages.net
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-primary text-white p-8 rounded-xl">
                <h3 className="text-2xl font-display font-semibold mb-4">
                  Prêt à réserver ?
                </h3>
                <p className="text-white/90 mb-6 leading-relaxed">
                  Contactez-nous pour discuter de votre projet et obtenir un devis personnalisé pour {displayVenueName(venue.name)}.
                </p>
                <Link 
                  href="/contact" 
                  className="btn-primary w-full"
                  style={{ background: 'white', color: 'var(--primary)' }}
                >
                  Demander un devis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Autres lieux */}
      <section className="section">
        <div className="container">
          <h2 className="text-3xl font-display font-semibold text-primary mb-8 text-center">
            Découvrez nos autres lieux
          </h2>
          <div className="text-center">
            <Link href="/catalogue" className="btn-secondary">
              Voir tous nos domaines
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
