'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getGalleryImages } from '@/lib/sharedVenueImages';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

/**
 * Galerie photos lightbox pour pages lieux
 * Affichage en grille + lightbox plein écran avec navigation
 */

interface VenueGalleryProps {
  images?: string[]; // Chemins des images originales (optionnel)
  venueName: string;
  /**
   * Optionally specify a category to prefer: 'mariages' or 'seminaires'
   * This will look for images under the two gallery folders if `images` is empty.
   */
  category?: 'mariages' | 'seminaires';
  /**
   * Optional slug (filename) to match images. If omitted, slug is generated from `venueName`.
   */
  venueSlug?: string;
}

export default function VenueGallery({ images, venueName, category, venueSlug }: VenueGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // If images are provided, use them. Otherwise try to build image URLs
  // from the two gallery folders whose files are named after the château.
  const buildSlug = (input: string) => {
    return input
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const slug = venueSlug || buildSlug(venueName || 'venue');

  const galleryFolders = [
    'GALERIE Onglet MARIAGES & PRIVÉS',
    'GALERIE Onglet SÉMINAIRES & PRO'
  ];

  const exts = ['webp', 'jpg', 'jpeg', 'png'];

  const candidateImages: string[] = [];

  // If a category is specified, prefer that folder first
  const orderedFolders = category === 'mariages'
    ? [galleryFolders[0], galleryFolders[1]]
    : category === 'seminaires'
    ? [galleryFolders[1], galleryFolders[0]]
    : galleryFolders;

  for (const folder of orderedFolders) {
    for (const ext of exts) {
      const path = `/${encodeURIComponent(folder)}/${encodeURIComponent(slug)}.${ext}`;
      candidateImages.push(path);
    }
  }

  const displayImages = (images && images.length > 0) ? images : candidateImages;

  if (!displayImages || displayImages.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Désactiver scroll
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = ''; // Réactiver scroll
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  // Gestion clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  return (
    <>
      {/* Grille de photos */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08
            }
          }
        }}
      >
        {displayImages.map((image, index) => (
          <motion.button
            key={image}
            onClick={() => openLightbox(index)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-stone/20 cursor-pointer"
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              show: { 
                opacity: 1, 
                scale: 1,
                transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
              }
            }}
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={image}
              alt={`${venueName} - Photo ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            
            {/* Overlay au hover */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors duration-300 flex items-center justify-center">
              <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Numéro de la photo */}
            <div className="absolute bottom-2 right-2 bg-primary/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {index + 1}/{displayImages.length}
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Lightbox plein écran */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-2xl"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
          {/* Bouton fermer */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
            aria-label="Fermer la galerie"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Compteur */}
          <div className="absolute top-4 left-4 z-50 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium">
              {currentIndex + 1} / {displayImages.length}
          </div>

          {/* Image courante */}
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
            <div className="relative max-w-content max-h-full w-full h-full">
              <div className="flex flex-col items-center justify-center w-full h-full">
                <Image
                  src={displayImages[currentIndex]}
                  alt={`${venueName} - Photo ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                  quality={95}
                />
                <div className="absolute bottom-8 text-white text-sm bg-black/50 px-3 py-1 rounded">
                  {venueName}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation précédent */}
          {displayImages.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-colors"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Navigation suivant */}
          {displayImages.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-colors"
              aria-label="Photo suivante"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Miniatures en bas */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 overflow-x-auto max-w-full px-4 scrollbar-hide">
            {displayImages.map((image, index) => (
              <button
                key={image}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-16 h-16 shrink-0 rounded overflow-hidden transition-all ${
                  index === currentIndex 
                    ? 'ring-2 ring-accent scale-110' 
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                <Image
                  src={image}
                  alt={`${venueName} - Photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
