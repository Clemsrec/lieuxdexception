/**
 * Composant VenueGallerySection - Galerie photos organisée par lieu
 * 
 * Affiche une galerie de photos pour un lieu spécifique avec possibilité de lien vers la page du lieu
 * 
 * @example
 * ```tsx
 * <VenueGallerySection
 *   venueName="Le Château de la Brûlaire"
 *   venueSlug="chateau-brulaire"
 *   images={[...]}
 *   locale="fr"
 * />
 * ```
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';

interface VenueGallerySectionProps {
  venueName: string;
  venueSlug: string;
  images: { src: string; alt: string }[];
  locale: string;
  bgColor?: 'white' | 'neutral-800' | 'stone-50';
}

export default function VenueGallerySection({
  venueName,
  venueSlug,
  images,
  locale,
  bgColor = 'neutral-800'
}: VenueGallerySectionProps) {
  const bgClass = bgColor === 'white' ? 'bg-white' : bgColor === 'stone-50' ? 'bg-stone-50' : 'bg-neutral-800';
  const textColor = bgColor === 'white' || bgColor === 'stone-50' ? 'text-charcoal-800' : 'text-white';
  const linkColor = bgColor === 'white' || bgColor === 'stone-50' ? 'text-accent hover:text-accent/80' : 'text-accent hover:text-white';
  const logoTheme = (bgColor === 'white' || bgColor === 'stone-50') ? 'dore' : 'blanc';
  const logoShadow = (bgColor === 'white' || bgColor === 'stone-50') ? 'drop-shadow-md' : 'drop-shadow-lg';
  const logoBg = (bgColor === 'white' || bgColor === 'stone-50') ? 'bg-neutral-800/10' : 'bg-white/10';
  
  // Mapping hardcodé des logos
  const logoMap: Record<string, { blanc: string; dore: string }> = {
    'chateau-brulaire': { blanc: '/logos/brulaire-blanc.png', dore: '/logos/brulaire-dore.png' },
    'manoir-boulaie': { blanc: '/logos/boulaie-blanc.png', dore: '/logos/boulaie-dore.png' },
    'domaine-nantais': { blanc: '/logos/domaine-blanc.png', dore: '/logos/domaine-dore.png' },
    'le-dome': { blanc: '/logos/dome-blanc.png', dore: '/logos/dome-dore.png' },
  };
  const logo = logoMap[venueSlug]?.[logoTheme] || null;

  return (
    <div className={`${bgClass} py-12`}>
      <div className="container px-4">
        {/* Header avec titre, logo et lien */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            {logo && (
              <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0">
                <Image
                  src={logo}
                  alt={`Logo ${venueName}`}
                  width={80}
                  height={80}
                  className={`object-contain ${logoShadow}`}
                  unoptimized
                />
              </div>
            )}
            <h3 className={`text-xl md:text-2xl font-display font-semibold ${textColor}`}>
              {venueName}
            </h3>
          </div>
          <Link 
            href={`/${locale}/lieux/${venueSlug}`}
            className={`btn btn-secondary text-sm w-full md:w-auto ${linkColor} border-current`}
          >
            Découvrir ce lieu →
          </Link>
        </div>

        {/* Grille photos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-3/4 overflow-hidden rounded-lg group cursor-pointer">
              <Image 
                src={image.src} 
                alt={image.alt} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-500" 
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw" 
              />
              {/* Overlay au hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
