'use client';

import { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
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

 // Nombre total de"pages" de carrousel
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
    <m.div
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
    </m.div>
   </div>

   {/* Flèches de navigation */}
   {venues.length > visibleCards && (
    <>
     {/* Flèche gauche */}
     <button
      onClick={goToPrev}
      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 lg:-translate-x-12 z-10 w-12 h-12 min-w-12 min-h-12 bg-white shadow-lg hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center group border-2 border-accent/20"
      aria-label="Lieu précédent"
     >
      <ChevronLeft className="w-6 h-6 text-primary group-hover:text-white" />
     </button>

     {/* Flèche droite */}
     <button
      onClick={goToNext}
      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 lg:translate-x-12 z-10 w-12 h-12 min-w-12 min-h-12 bg-white shadow-lg hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center group border-2 border-accent/20"
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
       <span className={`w-2 h-2 transition-all duration-300 ${index === currentIndex ? 'bg-accent w-8' : 'bg-accent/30 hover:bg-accent/50'}`} />
      </button>
     ))}
    </div>
   )}
  </div>
 );
}

/**
 * Card individuelle de venue (design luxe cohérent)
 */
function VenueCard({ venue, index }: { venue: Venue; index: number }) {
 return (
  <m.div
   className="h-full"
   initial={{ opacity: 0, y: 20 }}
   animate={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.4, delay: index * 0.1 }}
  >
   <Link
    href={`/lieux/${venue.slug}`}
    className="venue-card group overflow-hidden h-full flex flex-col bg-charcoal-800 shadow-lg hover:shadow-2xl transition-all duration-500 border border-accent/20"
   >
    {/* Image avec overlay gradient et numéro */}
    <m.div
     className="relative h-72 overflow-hidden shrink-0"
     whileHover={{ scale: 1.02 }}
     transition={{ duration: 0.4 }}
    >
     <Image
      src={getCardImage(venue)}
      alt={displayVenueName(venue.name)}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-110"
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
     />
     {/* Overlay gradient subtil */}
     <div className="absolute inset-0 bg-linear-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
     
     {/* Numéro dans cercle doré */}
     <div className="absolute bottom-4 left-4 w-14 h-14 bg-linear-to-br from-accent to-accent-dark border-2 border-white shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
      <span className="font-display font-bold text-2xl text-white drop-shadow-md">
       {index + 1}
      </span>
     </div>
    </m.div>

    {/* Contenu avec fond sombre */}
    <div className="p-6 md:p-8 flex-1 flex flex-col text-center bg-charcoal-800">
     {/* Titre avec ligne décorative */}
     <div className="mb-6 pb-4 border-b border-accent/20">
      <h3 className="font-display text-2xl md:text-3xl font-bold text-white italic leading-tight group-hover:text-accent transition-colors duration-300">
       {displayVenueName(venue.name)}
      </h3>
      <div className="w-12 h-0.5 bg-accent/60 mx-auto mt-3" />
     </div>

     {/* Icônes en grille horizontale avec fond */}
     <div className="grid grid-cols-3 gap-3 mb-6">
      {/* Distance */}
      <div className="flex flex-col items-center gap-2 p-3 bg-charcoal-700 border border-accent/20 hover:border-accent/40 transition-colors">
       <MapPin className="w-5 h-5 text-white" />
       <div className="text-xs uppercase tracking-wider text-white/80 leading-tight">
        <div className="font-semibold text-white text-sm">50 MIN</div>
        <div className="text-[10px]">DE PARIS</div>
       </div>
      </div>

      {/* Capacité */}
      <div className="flex flex-col items-center gap-2 p-3 bg-charcoal-700 border border-accent/20 hover:border-accent/40 transition-colors">
       <Users className="w-5 h-5 text-white" />
       <div className="text-xs uppercase tracking-wider text-white/80 leading-tight">
        <div className="font-semibold text-white text-sm">
         {venue.capacity?.min || 10}-{venue.capacity?.max || 200}
        </div>
        <div className="text-[10px]">PERS.</div>
       </div>
      </div>

      {/* Chambres */}
      <div className="flex flex-col items-center gap-2 p-3 bg-charcoal-700 border border-accent/20 hover:border-accent/40 transition-colors">
       <Bed className="w-5 h-5 text-white" />
       <div className="text-xs uppercase tracking-wider text-white/80 leading-tight">
        <div className="font-semibold text-white text-sm">{venue.capacity?.classroom || 24}</div>
        <div className="text-[10px]">CHAMBRES</div>
       </div>
      </div>
     </div>

     {/* Badges PRIVÉ / PRO élégants */}
     <div className="flex justify-center gap-4 mt-auto pt-6 border-t border-accent/10">
      <div className="px-4 py-2 bg-accent/5 border border-accent/20 text-xs font-semibold tracking-widest text-white hover:bg-accent transition-all duration-300 cursor-pointer">
       PRIVÉ
      </div>
      <div className="px-4 py-2 bg-accent/5 border border-accent/20 text-xs font-semibold tracking-widest text-white hover:bg-accent transition-all duration-300 cursor-pointer">
       PRO
      </div>
     </div>
    </div>
   </Link>
  </m.div>
 );
}
