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
            sizes="100vw"
            quality={90}
          />
        </div>
      ))}
      
      {/* Overlay gradient pour contraste texte */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/70 via-primary/50 to-primary/70 z-20" />
      
      {/* Overlay supplémentaire au centre pour le texte */}
      <div className="absolute inset-0 bg-primary/20 z-20" />
      
      {/* Indicateurs de slides */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {displayImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
