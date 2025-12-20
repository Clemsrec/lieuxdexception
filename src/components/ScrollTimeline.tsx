/**
 * Composant ScrollTimeline - Timeline horizontale interactive premium
 * 
 * Fonctionnalités :
 * - Scroll horizontal fluide avec Lenis
 * - Animations progressives avec Framer Motion
 * - Blur/Fade automatique sur cartes non centrées
 * - Parallax multi-couches
 * - Compteur animé pour les années
 * - Cursor custom
 * - Progress bar et navigation dots
 * - Particules pour événements majeurs
 * - Hover effects premium
 */

'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { m, useSpring } from 'framer-motion';
import Lenis from 'lenis';

interface TimelineEvent {
  year: string;
  month?: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  imagePosition?: 'top' | 'bottom';
  isMajor?: boolean;
}

export default function ScrollTimeline({ events }: { events: TimelineEvent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  
  const smoothProgress = useSpring(scrollProgress, { stiffness: 100, damping: 30 });

  // Smooth scroll avec Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Gestion du scroll et des animations
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !timelineRef.current) return;

      const container = containerRef.current;
      const timeline = timelineRef.current;
      
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const windowHeight = window.innerHeight;
      
      let progress = 0;
      // Le scroll commence quand la timeline est sticky (rect.top = 0)
      // et se termine quand on a scrollé toute la hauteur utile
      if (rect.top <= 0 && rect.top > -(containerHeight - windowHeight)) {
        progress = Math.max(0, Math.min(1, -rect.top / (containerHeight - windowHeight)));
      } else if (rect.top <= -(containerHeight - windowHeight)) {
        progress = 1;
      }
      
      setScrollProgress(progress);
      
      // Calcul de l'index actif
      const spacing = 600;
      const currentIndex = Math.round((progress * (timeline.scrollWidth - window.innerWidth)) / spacing);
      setActiveIndex(Math.min(Math.max(0, currentIndex), events.length - 1));
      
      // Translation horizontale avec marges égales gauche/droite pour centrage parfait
      const maxScroll = timeline.scrollWidth - window.innerWidth;
      // Ajouter un offset pour centrer la première étape au début
      const initialOffset = window.innerWidth / 2 - 275; // Centrer la première étape
      const translateX = initialOffset - (progress * maxScroll);
      
      timeline.style.transform = `translateX(${translateX}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [events.length]);

  // Cursor custom
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const generateCurvePath = () => {
    const spacing = 600;
    const amplitude = 80;
    let path = `M 100 300`;
    
    events.forEach((_, index) => {
      const x = 100 + (index + 1) * spacing;
      const y = 300 + Math.sin(index * 0.8) * amplitude;
      const controlX1 = 100 + (index + 0.5) * spacing;
      const controlY1 = 300 + Math.sin((index - 0.5) * 0.8) * amplitude;
      const controlX2 = 100 + (index + 0.7) * spacing;
      const controlY2 = 300 + Math.sin((index + 0.3) * 0.8) * amplitude;
      
      path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${x} ${y}`;
    });
    
    return path;
  };

  // Jump to section
  const scrollToEvent = (index: number) => {
    const targetProgress = index / (events.length - 1);
    const containerHeight = containerRef.current?.offsetHeight || 0;
    const targetScroll = window.scrollY + (containerRef.current?.getBoundingClientRect().top || 0) + 
                        (targetProgress * containerHeight);
    
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  return (
    <>
      {/* Cursor custom - Desktop uniquement */}
      <m.div
        className="fixed w-8 h-8 border-2 border-accent/50 rounded-full pointer-events-none z-50 mix-blend-difference hidden lg:block"
        animate={{
          x: cursorPos.x - 16,
          y: cursorPos.y - 16,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-40 hidden lg:block">
        <m.div
          className="h-full bg-accent"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Navigation dots - Desktop uniquement */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-4 hidden lg:flex">
        {events.map((event, index) => (
          <m.button
            key={index}
            onClick={() => scrollToEvent(index)}
            className="relative group"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className={`w-3 h-3 rounded-full transition-all border-2 ${
              activeIndex === index 
                ? 'bg-accent border-accent scale-150' 
                : 'bg-white/30 border-charcoal-800/50'
            }`} />
            
            {/* Tooltip */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white text-charcoal-800 px-3 py-1 rounded text-sm hidden md:block shadow-lg">
              {event.month} {event.year}
            </div>
          </m.button>
        ))}
      </div>

      <div 
        ref={containerRef}
        className="relative w-full lg:h-[3000vh] lg:pb-32"
      >
        {/* Desktop: Scroll horizontal */}
        <div className="sticky top-0 h-screen overflow-hidden bg-neutral-900 hidden lg:block">
          <div
            ref={timelineRef}
            className="relative h-full will-change-transform"
            style={{ 
              width: `${events.length * 600 + 1200}px`, // +1200px de marge à droite pour centrer la dernière étape
            }}
          >
            {/* SVG ligne avec gradient animé */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ minWidth: '100%' }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#C9A961', stopOpacity: 0.3 }} />
                  <stop offset={`${scrollProgress * 100}%`} style={{ stopColor: '#C9A961', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#e5e7eb', stopOpacity: 0.3 }} />
                </linearGradient>
                
                {/* Glow effect */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <path
                d={generateCurvePath()}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#glow)"
              />
            </svg>

            {/* Événements */}
            {events.map((event, index) => {
              const x = 100 + index * 600;
              const y = 300 + Math.sin(index * 0.8) * 80;
              const isBottom = event.imagePosition === 'bottom' || index % 2 === 1;
              const isActive = activeIndex === index;
              const distance = Math.abs(activeIndex - index);
              
              // Calcul opacité et blur basé sur la distance
              const opacity = Math.max(0.3, 1 - distance * 0.3);
              const blur = distance * 2;
              const scale = isActive ? 1 : Math.max(0.85, 1 - distance * 0.1);
              
              return (
                <m.div
                  key={index}
                  className="absolute"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity,
                    scale,
                    filter: `blur(${blur}px)`,
                    x: '-50%',
                    y: isActive ? '-50%' : (isBottom ? '-45%' : '-55%'),
                  }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                >
                  {/* Particules animées selon l'événement */}
                  {isActive && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Feu d'artifice pour événements majeurs */}
                      {event.isMajor && [...Array(20)].map((_, i) => (
                        <m.div
                          key={`circle-${i}`}
                          className="absolute w-2 h-2 bg-accent rounded-full"
                          initial={{
                            x: 0,
                            y: 0,
                            opacity: 1,
                          }}
                          animate={{
                            x: Math.cos(i * 18 * Math.PI / 180) * 100,
                            y: Math.sin(i * 18 * Math.PI / 180) * 100,
                            opacity: 0,
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 2,
                            ease: 'easeOut',
                          }}
                        />
                      ))}
                      
                      {/* Étoiles scintillantes pour 2021 et 2023 */}
                      {!event.isMajor && (index === 1 || index === 2) && [...Array(8)].map((_, i) => (
                        <m.div
                          key={`star-${i}`}
                          className="absolute w-1 h-1 bg-accent"
                          style={{
                            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                            left: `${Math.random() * 100 - 50}px`,
                            top: `${Math.random() * 100 - 50}px`,
                          }}
                          initial={{
                            opacity: 0,
                            scale: 0,
                          }}
                          animate={{
                            opacity: [0, 1, 1, 0],
                            scale: [0, 1.5, 1.5, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.25,
                            ease: 'easeInOut',
                          }}
                        />
                      ))}
                      
                      {/* Spirales pour Sept 2025 */}
                      {index === 3 && [...Array(6)].map((_, i) => (
                        <m.div
                          key={`spiral-${i}`}
                          className="absolute w-1.5 h-1.5 bg-accent rounded-full"
                          initial={{
                            x: 0,
                            y: 0,
                            opacity: 1,
                          }}
                          animate={{
                            x: Math.cos((i * 60) * Math.PI / 180) * 80,
                            y: Math.sin((i * 60) * Math.PI / 180) * 80,
                            opacity: 0,
                          }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            repeatDelay: 2.5,
                            delay: i * 0.2,
                            ease: 'easeOut',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Point sur la ligne */}
                  <m.div 
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-10"
                    animate={{
                      scale: isActive ? 1.5 : 1,
                      boxShadow: isActive 
                        ? '0 0 20px rgba(201,169,97,0.8)' 
                        : '0 0 0px rgba(201,169,97,0)',
                    }}
                  >
                    <div className="w-4 h-4 bg-accent border-4 border-neutral-700 rounded-full" />
                  </m.div>
                  
                  {/* Contenu avec parallax */}
                  <m.div 
                    className={`relative ${isBottom ? 'top-12' : 'bottom-12'}`}
                    style={{ width: '350px' }}
                    animate={{
                      y: isActive ? 0 : (isBottom ? 10 : -10),
                    }}
                  >
                    {isBottom ? (
                      <>
                        <m.div 
                          className="text-center mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <h3 className="text-xs uppercase tracking-wider mb-1" style={{ color: '#C9A961' }}>
                            {event.title}
                          </h3>
                          {event.subtitle && (
                            <p className="text-xs text-white/60">{event.subtitle}</p>
                          )}
                        </m.div>
                        
                        {/* Image avec parallax et hover effect */}
                        <m.div 
                          className="relative w-full h-64 mx-auto mb-4 cursor-pointer"
                          whileHover={{ scale: 1.05, rotate: 2 }}
                          animate={{
                            y: isActive ? 0 : 20,
                          }}
                        >
                          <div 
                            className="absolute inset-0 overflow-hidden shadow-2xl rounded-2xl"
                          >
                            <m.div
                              className="relative w-full h-full"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                            >
                              <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover"
                                sizes="350px"
                              />
                            </m.div>
                          </div>
                          
                          {/* Glow effect sur hover */}
                          <m.div
                            className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                          />
                        </m.div>
                        
                        <m.div 
                          className="text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                        >
                          {/* Année */}
                          <div className="text-5xl md:text-6xl font-bold mb-2" style={{ color: '#C9A961' }}>
                            {event.month && <span className="text-2xl md:text-3xl mr-2" style={{ color: '#C9A961' }}>{event.month}</span>}
                            {event.year}
                          </div>
                          <p className="text-sm text-white/80 max-w-xs mx-auto">{event.description}</p>
                        </m.div>
                      </>
                    ) : (
                      <>
                        <m.div 
                          className="text-center mb-4"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="text-5xl md:text-6xl font-bold mb-2" style={{ color: '#C9A961' }}>
                            {event.month && <span className="text-2xl md:text-3xl mr-2" style={{ color: '#C9A961' }}>{event.month}</span>}
                            {event.year}
                          </div>
                          <h3 className="text-xs uppercase tracking-wider mb-1" style={{ color: '#C9A961' }}>
                            {event.title}
                          </h3>
                          {event.subtitle && (
                            <p className="text-xs text-white/60">{event.subtitle}</p>
                          )}
                        </m.div>
                        
                        <m.div 
                          className="relative w-full h-64 mx-auto mb-4 cursor-pointer"
                          whileHover={{ scale: 1.05, rotate: -2 }}
                          animate={{
                            y: isActive ? 0 : -20,
                          }}
                        >
                          <div 
                            className="absolute inset-0 overflow-hidden shadow-2xl rounded-2xl"
                          >
                            <m.div
                              className="relative w-full h-full"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                            >
                              <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover"
                                sizes="350px"
                              />
                            </m.div>
                          </div>
                          
                          <m.div
                            className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                          />
                        </m.div>
                        
                        <m.div 
                          className="text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                        >
                          <p className="text-sm text-white/80 max-w-xs mx-auto">{event.description}</p>
                        </m.div>
                      </>
                    )}
                  </m.div>
                </m.div>
              );
            })}
          </div>
        </div>
        
        {/* Mobile/Tablet: Layout vertical simple */}
        <div className="lg:hidden bg-neutral-900 py-16 px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            {events.map((event, index) => (
              <m.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Ligne verticale avec point */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-accent/30">
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-4 bg-accent border-4 border-neutral-700 rounded-full" />
                </div>
                
                {/* Contenu */}
                <div className="pl-12">
                  {/* Date */}
                  <div className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#C9A961' }}>
                    {event.month && <span className="text-xl md:text-2xl mr-2" style={{ color: '#C9A961' }}>{event.month}</span>}
                    {event.year}
                  </div>
                  
                  {/* Titre */}
                  <h3 className="text-sm uppercase tracking-wider mb-2" style={{ color: '#C9A961' }}>
                    {event.title}
                  </h3>
                  {event.subtitle && (
                    <p className="text-xs text-white/60 mb-4">{event.subtitle}</p>
                  )}
                  
                  {/* Image */}
                  <div className="relative w-full h-64 mb-4 rounded-xl overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-white/80">{event.description}</p>
                  
                  {/* Particules légères pour événements majeurs */}
                  {event.isMajor && (
                    <div className="flex gap-2 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <m.div
                          key={i}
                          className="w-2 h-2 bg-accent rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
