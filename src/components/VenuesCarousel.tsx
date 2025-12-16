'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Users, Bed, ChevronLeft, ChevronRight } from 'lucide-react';
import { Venue } from '@/types/firebase';
import { displayVenueName } from '@/lib/formatVenueName';
import { getCardImage } from '@/lib/sharedVenueImages';

/**
 * Carrousel de venues avec défilement automatique et navigation par flèches
 * Affiche 3 cards à la fois sur desktop, défilement fluide
 */

interface VenuesCarouselProps {
  venues: Venue[];
  autoPlayInterval?: number; // Intervalle en ms pour le défilement auto (défaut: 6000ms)
}

export default function VenuesCarousel({ 
  venues, 
  autoPlayInterval = 6000 
}: VenuesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Nombre de cards visibles (responsive)
  const visibleCards = 3; // Desktop: 3, on gérera le responsive dans le CSS

  // Nombre total de "pages" de carrousel
  const totalPages = Math.ceil(venues.length / visibleCards);

  // Navigation
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  const goToPage = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (!isPaused && venues.length > visibleCards) {
      const interval = setInterval(goToNext, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [isPaused, venues.length, visibleCards, autoPlayInterval, goToNext]);

  // Calculer les venues visibles pour la page actuelle
  const startIndex = currentIndex * visibleCards;
  const visibleVenues = venues.slice(startIndex, startIndex + visibleCards);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carrousel */}
      <div className="overflow-hidden">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {visibleVenues.map((venue, index) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              index={startIndex + index}
            />
          ))}
        </motion.div>
      </div>

      {/* Flèches de navigation */}
      {venues.length > visibleCards && (
        <>
          {/* Flèche gauche */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 lg:-translate-x-12 z-10 w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-white shadow-lg hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center group border-2 border-accent/20"
            aria-label="Lieu précédent"
          >
            <ChevronLeft className="w-6 h-6 text-primary group-hover:text-white" />
          </button>

          {/* Flèche droite */}
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 lg:translate-x-12 z-10 w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-white shadow-lg hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center group border-2 border-accent/20"
            aria-label="Lieu suivant"
          >
            <ChevronRight className="w-6 h-6 text-primary group-hover:text-white" />
          </button>
        </>
      )}

      {/* Indicateurs de pagination (dots) */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`min-w-11 min-h-11 flex items-center justify-center transition-all duration-300 ${index === currentIndex ? '' : ''}`}
              aria-label={`Aller à la page ${index + 1}`}
            >
              <span className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-accent w-8' : 'bg-accent/30 hover:bg-accent/50'}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Card individuelle de venue (même design que la version redesignée)
 */
function VenueCard({ venue, index }: { venue: Venue; index: number }) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        href={`/lieux/${venue.slug}`}
        className="venue-card group overflow-hidden h-full flex flex-col bg-white hover:shadow-xl transition-all duration-300"
      >
        {/* Image avec badge numéroté */}
        <motion.div
          className="relative h-64 overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={getCardImage(venue.id || venue.slug)}
            alt={displayVenueName(venue.name)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Badge numéroté */}
          <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white border-2 border-accent flex items-center justify-center shadow-md">
            <span className="font-display font-bold text-xl text-primary">
              {index + 1}
            </span>
          </div>
        </motion.div>

        {/* Contenu */}
        <div className="p-6 flex-1 flex flex-col text-center">
          {/* Titre sur deux lignes */}
            <div className="mb-6">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-primary italic">
              {displayVenueName(venue.name)}
            </h3>
          </div>

          {/* Icônes en grille horizontale */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Distance */}
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-6 h-6 text-accent" />
              <div className="text-xs uppercase tracking-wider font-medium">
                <div className="font-semibold text-primary">50 MIN</div>
                <div className="text-neutral-600">DE PARIS</div>
              </div>
            </div>

            {/* Capacité */}
            <div className="flex flex-col items-center gap-2">
              <Users className="w-6 h-6 text-accent" />
              <div className="text-xs uppercase tracking-wider font-medium">
                <div className="font-semibold text-primary">
                  {venue.capacity?.min || 10}-{venue.capacity?.max || 200}
                </div>
                <div className="text-neutral-600">PERS.</div>
              </div>
            </div>

            {/* Chambres */}
            <div className="flex flex-col items-center gap-2">
              <Bed className="w-6 h-6 text-accent" />
              <div className="text-xs uppercase tracking-wider font-medium">
                <div className="font-semibold text-primary">24</div>
                <div className="text-neutral-600">CHAMBRES</div>
              </div>
            </div>
          </div>

          {/* Badges PRIVÉ / PRO */}
          <div className="flex justify-center gap-6 mt-auto pt-4 border-t border-accent/20">
            <div className="text-sm font-medium tracking-widest text-accent">
              PRIVÉ
            </div>
            <div className="text-sm font-medium tracking-widest text-accent">
              PRO
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
