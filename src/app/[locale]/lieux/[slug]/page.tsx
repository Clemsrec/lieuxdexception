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
import { STORAGE_IMAGES } from '@/lib/storage-assets';

// Mapping des logos en dur
const VENUE_LOGOS: Record<string, { blanc: string; dore: string }> = {
  'chateau-brulaire': { blanc: '/logos/brulaire-blanc.png', dore: '/logos/brulaire-dore.png' },
  'chateau-de-la-brulaire': { blanc: '/logos/brulaire-blanc.png', dore: '/logos/brulaire-dore.png' },
  'manoir-boulaie': { blanc: '/logos/boulaie-blanc.png', dore: '/logos/boulaie-dore.png' },
  'manoir-de-la-boulaie': { blanc: '/logos/boulaie-blanc.png', dore: '/logos/boulaie-dore.png' },
  'domaine-nantais': { blanc: '/logos/domaine-blanc.png', dore: '/logos/domaine-dore.png' },
  'le-dome': { blanc: '/logos/dome-blanc.png', dore: '/logos/dome-dore.png' },
};

// ISR : Cache avec revalidation toutes les 2 heures
// Revalidation toutes les 5 minutes (300s) pour équilibre perf/fraîcheur
export const revalidate = 300;

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

  // Images de la galerie depuis Firestore (Firebase Storage)
  const galleryImages = venue.images?.gallery || [];

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
        {/* Overlay gris-noir pour contraste texte */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        {/* Overlay gradient pour profondeur */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/40 z-10" />
        
        <div className="absolute inset-0 flex items-end z-20">
          <div className="container pb-16 w-full">
            <div>
              <div className="flex items-center gap-4 mb-4 text-white/90">
                {/* Breadcrumb "Retour au catalogue" supprimé - navigation via menu principal */}
                
                {/* Badges de statut */}
                {venue.displayStatus === 'Nouveau' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full text-sm font-medium">
                    ★ Nouveau
                  </span>
                )}
                {venue.displayStatus === 'Ouverture prochainement' && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
                    Bientôt disponible
                  </span>
                )}
              </div>
              
              <h1 className="text-5xl md:text-6xl font-display font-semibold text-white mb-4 animate-fade-in">
                {displayVenueName(venue.name)}
              </h1>
              
              {venue.tagline && (
                <p className="text-2xl text-white font-medium mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barre d'actions rapides */}
      <section className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-md">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-3 md:py-4 gap-3">
            <div className="flex gap-4 md:gap-6 overflow-x-auto w-full md:w-auto scrollbar-hide">
              <a href="#description" className="text-xs md:text-sm font-medium text-secondary hover:text-primary transition-colors whitespace-nowrap">
                Description
              </a>
              <a href="#espaces" className="text-xs md:text-sm font-medium text-secondary hover:text-primary transition-colors whitespace-nowrap">
                Espaces
              </a>
              <a href="#galerie" className="text-xs md:text-sm font-medium text-secondary hover:text-primary transition-colors whitespace-nowrap">
                Galerie
              </a>
              <a href="#contact" className="text-xs md:text-sm font-medium text-secondary hover:text-primary transition-colors whitespace-nowrap">
                Contact
              </a>
            </div>
            <Link href="/contact" className="btn btn-primary text-xs md:text-sm w-full md:w-auto">
              Contact & Devis
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
                <div className="bg-charcoal-800 border border-accent/20 p-8 rounded-xl">
                  <h3 className="text-2xl font-display font-semibold text-white mb-4">
                    Votre expérience
                  </h3>
                  <p className="text-white/90 leading-relaxed italic">
                    {venue.experienceText}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar informations clés */}
            <div className="lg:col-span-1">
              <div className="bg-charcoal-800 border border-accent/20 rounded-xl p-6 sticky top-32">
                {/* Logo centré */}
                {slug !== 'chateau-de-la-corbe' && VENUE_LOGOS[slug]?.blanc && (
                  <div className="flex justify-center mb-6">
                    <Image
                      src={VENUE_LOGOS[slug]?.blanc!}
                      alt={`Logo ${displayVenueName(venue.name)}`}
                      width={96}
                      height={96}
                      className="object-contain drop-shadow-lg"
                      unoptimized
                    />
                  </div>
                )}
                <h3 className="text-xl font-heading font-semibold text-white mb-6 text-center">
                  Informations pratiques
                </h3>
                
                <div className="space-y-6">
                  {/* Capacité enrichie */}
                  <div>
                    <div className="flex items-center gap-2 text-accent font-medium mb-3">
                      
                      Capacités
                    </div>
                    <div className="space-y-2 text-sm">
                      {venue.capacityDetails?.theater && (
                        <div className="flex justify-between">
                          <span className="text-white/80">Configuration théâtre</span>
                          <span className="font-semibold text-white">{venue.capacityDetails.theater} pers.</span>
                        </div>
                      )}
                      {venue.capacityDetails?.banquet && (
                        <div className="flex justify-between">
                          <span className="text-white/80">Banquet</span>
                          <span className="font-semibold text-white">{venue.capacityDetails.banquet} pers.</span>
                        </div>
                      )}
                      {venue.capacityDetails?.cocktail && (
                        <div className="flex justify-between">
                          <span className="text-white/80">Cocktail</span>
                          <span className="font-semibold text-white">{venue.capacityDetails.cocktail} pers.</span>
                        </div>
                      )}
                      {venue.capacityDetails?.cocktailPark && (
                        <div className="flex justify-between">
                          <span className="text-white/80">Cocktail parc</span>
                          <span className="font-semibold text-accent">Jusqu'à {venue.capacityDetails.cocktailPark} pers. !</span>
                        </div>
                      )}
                      {venue.capacityDetails?.uShape && (
                        <div className="flex justify-between">
                          <span className="text-white/80">Salle en U</span>
                          <span className="font-semibold text-white">{venue.capacityDetails.uShape} pers.</span>
                        </div>
                      )}
                      {venue.capacityDetails?.meeting && (
                        <div className="flex justify-between">
                          <span className="text-white/80">Réunion</span>
                          <span className="font-semibold text-white">{venue.capacityDetails.meeting} pers.</span>
                        </div>
                      )}
                      {venue.capacityDetails?.classroom && (
                        <div className="flex justify-between">
                          <span className="text-white/80">Rang d'école</span>
                          <span className="font-semibold text-white">{venue.capacityDetails.classroom} pers.</span>
                        </div>
                      )}
                      {/* Fallback si pas de capacityDetails */}
                      {!venue.capacityDetails && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-white/80">Minimum</span>
                            <span className="font-semibold text-white">{venue.capacityMin || 20} pers.</span>
                          </div>
                          {venue.capacitySeated && (
                            <div className="flex justify-between">
                              <span className="text-white/80">Dîner assis</span>
                              <span className="font-semibold text-white">{venue.capacitySeated} pers.</span>
                            </div>
                          )}
                          {venue.capacityStanding && (
                            <div className="flex justify-between">
                              <span className="text-white/80">Cocktail</span>
                              <span className="font-semibold text-white">{venue.capacityStanding} pers.</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Infrastructures */}
                  {(venue.rooms || venue.accommodationRooms || venue.parkingSpaces) && (
                    <div className="pt-4 border-t border-accent/20">
                      <div className="flex items-center gap-2 text-accent font-medium mb-3">
                        
                        Infrastructures
                      </div>
                      <div className="space-y-2 text-sm">
                        {venue.rooms && (
                          <div className="flex justify-between">
                            <span className="text-white/80">Salles disponibles</span>
                            <span className="font-semibold text-white">{venue.rooms}</span>
                          </div>
                        )}
                        {venue.accommodationRooms && (
                          <div className="flex justify-between">
                            <span className="text-white/80">Chambres</span>
                            <span className="font-semibold text-white">{venue.accommodationRooms}</span>
                          </div>
                        )}
                        {venue.parkingSpaces && (
                          <div className="flex justify-between">
                            <span className="text-white/80">Places parking</span>
                            <span className="font-semibold text-white">{venue.parkingSpaces}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Équipements */}
                  {venue.amenitiesList && venue.amenitiesList.length > 0 && (
                    <div className="pt-4 border-t border-accent/20">
                      <div className="flex items-center gap-2 text-accent font-medium mb-3">
                        
                        Équipements
                      </div>
                      <ul className="text-sm text-white/80 space-y-1 ml-6">
                        {venue.amenitiesList.slice(0, 6).map((amenity: string, i: number) => (
                          <li key={i}>• {amenity}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Contact rapide */}
                  <div className="pt-4 border-t border-accent/20">
                    <Link href="/contact" className="btn btn-primary w-full">
                      Contact & Devis
                    </Link>
                    {venue.contact?.phone && (
                      <a 
                        href={`tel:${venue.contact.phone}`}
                        className="btn btn-secondary w-full mt-3"
                      >
                        <span className="text-lg">✆</span>
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
                <div key={index} className="bg-charcoal-800 border border-accent/20 p-6 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center shrink-0">
                      
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-white mb-1">{space}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Salles détaillées */}
      {venue.detailedSpaces && venue.detailedSpaces.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container">
            <h2 className="text-3xl font-display font-semibold text-primary mb-8 text-center">
              Nos salles en détail
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venue.detailedSpaces.map((space, index) => (
                <div key={index} className="bg-charcoal-800 border border-accent/20 p-6 rounded-xl hover:border-accent transition-colors">
                  <h3 className="font-heading font-semibold text-white text-lg mb-3">
                    {space.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-display font-bold drop-shadow-md" style={{ color: '#C9A961' }}>{space.size}</span>
                    <span className="text-white/80">{space.unit}</span>
                  </div>
                  <div className="w-full h-px bg-accent/20 my-3" />
                  <p className="text-sm text-white/80">
                    Espace modulable pour vos événements
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Équipements & Services */}
      {(venue.equipment && venue.equipment.length > 0) || (venue.services && venue.services.length > 0) ? (
        <section className="section">
          <div className="container">
            <h2 className="text-3xl font-display font-semibold text-primary mb-12 text-center">
              Équipements & Services
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Équipements techniques */}
              {venue.equipment && venue.equipment.length > 0 && (
                <div className="bg-charcoal-800 border border-accent/20 p-8 rounded-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⚙️</span>
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-white">
                      Équipements techniques
                    </h3>
                  </div>
                  <ul className="grid grid-cols-1 gap-3">
                    {venue.equipment.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/90">
                        <div className="w-2 h-2 bg-accent rounded-full shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Services */}
              {venue.services && venue.services.length > 0 && (
                <div className="bg-charcoal-800 border border-accent/20 p-8 rounded-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">★</span>
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-white">
                      Services disponibles
                    </h3>
                  </div>
                  <ul className="grid grid-cols-1 gap-3">
                    {venue.services.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/90">
                        <div className="w-2 h-2 bg-accent rounded-full shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* Activités proposées */}
      {venue.activities && venue.activities.length > 0 && (
        <section className="section bg-primary/5">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-semibold text-primary mb-4">
                Activités proposées
              </h2>
              <p className="text-secondary text-lg max-w-2xl mx-auto">
                Prolongez votre événement avec des activités ludiques et fédératrices
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venue.activities.map((activity, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-neutral-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl text-accent">★</span>
                  </div>
                  <h3 className="font-heading font-semibold text-primary mb-2">
                    {activity}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Galerie photos */}
      {galleryImages && galleryImages.length > 0 && (
        <section id="galerie" className="section">
          <div className="container">
            <h2 className="text-3xl font-display font-semibold text-primary mb-8 text-center">
              Galerie photos
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((imageUrl, index) => (
                <div key={index} className="relative aspect-4/3 overflow-hidden rounded-lg group cursor-pointer">
                  <Image
                    src={imageUrl}
                    alt={`${displayVenueName(venue.name)} - Photo ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                    unoptimized
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
                  {/* Email Mariages */}
                  {venue.emailMariages && (
                    <div className="flex items-start gap-3">
                      
                      <div>
                        <div className="text-sm text-secondary mb-1">Email Mariages/Privés</div>
                        <a href={`mailto:${venue.emailMariages}`} className="text-primary font-medium hover:text-accent transition-colors break-all">
                          {venue.emailMariages}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Email B2B */}
                  {venue.emailB2B && (
                    <div className="flex items-start gap-3">
                      
                      <div>
                        <div className="text-sm text-secondary mb-1">Email Pro/B2B</div>
                        <a href={`mailto:${venue.emailB2B}`} className="text-primary font-medium hover:text-accent transition-colors break-all">
                          {venue.emailB2B}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Téléphone Mariages */}
                  {venue.phoneMariages && (
                    <div className="flex items-start gap-3">
                      
                      <div>
                        <div className="text-sm text-secondary mb-1">Téléphone Mariages/Privés</div>
                        <a href={`tel:${venue.phoneMariages.replace(/\s/g, '')}`} className="text-primary font-medium hover:text-accent transition-colors">
                          {venue.phoneMariages}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Téléphone B2B */}
                  {venue.phoneB2B && (
                    <div className="flex items-start gap-3">
                      
                      <div>
                        <div className="text-sm text-secondary mb-1">Téléphone Pro/B2B</div>
                        <a href={`tel:${venue.phoneB2B.replace(/\s/g, '')}`} className="text-primary font-medium hover:text-accent transition-colors">
                          {venue.phoneB2B}
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
              <div className="bg-charcoal-800 text-white p-8 rounded-xl border border-accent/20">
                <h3 className="text-2xl font-display font-semibold mb-4 text-accent">
                  Prêt à réserver ?
                </h3>
                <p className="text-neutral-200 mb-6 leading-relaxed">
                  Contactez-nous pour discuter de votre projet et obtenir un devis personnalisé pour {displayVenueName(venue.name)}.
                </p>
                <Link 
                  href="/contact" 
                  className="btn btn-primary w-full"
                >
                  Contact & Devis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Autres lieux */}
      <section className="section bg-neutral-800">
        <div className="container">
          <h2 className="text-3xl font-display font-semibold text-accent mb-8 text-center">
            Découvrez nos autres lieux
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {venues
              .filter(v => v.slug !== slug)
              .slice(0, 4)
              .map((otherVenue) => (
                <div
                  key={otherVenue.id}
                  className="group flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-neutral-700"
                >
                  {/* Image */}
                  <Link href={`/lieux/${otherVenue.slug}`} className="relative aspect-4/3 overflow-hidden">
                    <Image
                      src={otherVenue.images?.hero || otherVenue.heroImage || otherVenue.image || STORAGE_IMAGES.placeholder}
                      alt={otherVenue.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </Link>
                  
                  {/* Contenu */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Logo centré */}
                    {otherVenue.slug !== 'chateau-de-la-corbe' && VENUE_LOGOS[otherVenue.slug]?.blanc && (
                      <div className="flex justify-center mb-4">
                        <Image
                          src={VENUE_LOGOS[otherVenue.slug]?.blanc!}
                          alt={`Logo ${otherVenue.name}`}
                          width={64}
                          height={64}
                          className="object-contain drop-shadow-lg"
                          unoptimized
                        />
                      </div>
                    )}
                    <Link href={`/lieux/${otherVenue.slug}`}>
                      <h3 className="text-lg font-display font-semibold mb-3 transition-colors text-center" style={{ color: '#C9A961' }}>
                        {otherVenue.name}
                      </h3>
                    </Link>
                    
                    <p className="text-white/80 text-sm text-center line-clamp-2 mb-4">
                      {otherVenue.tagline || otherVenue.location}
                    </p>

                    <Link 
                      href={`/lieux/${otherVenue.slug}`}
                      className="mt-auto btn btn-secondary text-sm w-full"
                    >
                      Découvrir →
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

    </main>
  );
}
