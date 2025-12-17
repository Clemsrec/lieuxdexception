'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * Carousel de photos pour la section hero
 * Défilement automatique toutes les 5 secondes avec transition fade
 * Overlay sombre pour garantir la lisibilité du texte
 */

interface HeroCarouselProps {
  images: string[];
  fallbackImages?: string[]; // Images de secours si aucune image venue
  interval?: number;
}

export default function HeroCarousel({ images, fallbackImages = [], interval = 5000 }: HeroCarouselProps) {
  // Utiliser les images venues ou fallback
  const displayImages = images.length > 0 ? images : fallbackImages;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (displayImages.length === 0) return; // Ne rien faire si pas d'images
    
    const timer = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
        setIsTransitioning(false);
      }, 800);
    }, interval);

    return () => clearInterval(timer);
  }, [displayImages.length, interval]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {displayImages.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex 
              ? 'opacity-100 z-10' 
              : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={image}
            alt=""
            fill
            className="object-cover"
            priority={index === 0}
            fetchPriority={index === 0 ? 'high' : undefined}
            loading={index === 0 ? undefined : 'lazy'}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1920px"
            quality={75}
          />
        </div>
      ))}
      
      {/* Overlay gris-noir pour contraste texte */}
      <div className="absolute inset-0 bg-black/40 z-20" />
      
      {/* Overlay gradient pour profondeur */}
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/40 z-20" />
      
      {/* Indicateurs de slides */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {displayImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 p-2 min-w-11 min-h-11 flex items-center justify-center ${
              index === currentIndex 
                ? 'bg-white/90' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
