'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { MapPin, Users, Instagram, ExternalLink } from 'lucide-react';
import { useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import type { Venue, PageContent } from '@/types/firebase';
import { STORAGE_IMAGES, STORAGE_LOGOS } from '@/lib/storage-assets';
import { displayVenueName } from '@/lib/formatVenueName';
import { getCardImage } from '@/lib/sharedVenueImages';
import { ContentSection, FeatureCard } from '@/components/PageContentComponents';

// Mapping des logos depuis Firebase Storage
const VENUE_LOGOS: Record<string, { blanc: string; dore: string }> = {
  'chateau-brulaire': { 
    blanc: STORAGE_LOGOS.venues.brulaireBlanc, 
    dore: STORAGE_LOGOS.venues.brulaireDore 
  },
  'chateau-de-la-brulaire': { 
    blanc: STORAGE_LOGOS.venues.brulaireBlanc, 
    dore: STORAGE_LOGOS.venues.brulaireDore 
  },
  'manoir-boulaie': { 
    blanc: STORAGE_LOGOS.venues.boulaieBlanc, 
    dore: STORAGE_LOGOS.venues.boulaieDore 
  },
  'manoir-de-la-boulaie': { 
    blanc: STORAGE_LOGOS.venues.boulaieBlanc, 
    dore: STORAGE_LOGOS.venues.boulaieDore 
  },
  'domaine-nantais': { 
    blanc: STORAGE_LOGOS.venues.domaineBlanc, 
    dore: STORAGE_LOGOS.venues.domaineDore 
  },
  'le-dome': { 
    blanc: STORAGE_LOGOS.venues.domeBlanc, 
    dore: STORAGE_LOGOS.venues.domeDore 
  },
};

// Liens sociaux par lieu
const venueSocialLinks: Record<string, { instagram: string; mariagesNet: string }> = {
  'chateau-brulaire': {
    instagram: 'https://www.instagram.com/chateaudelabrulaire/',
    mariagesNet: 'https://www.mariages.net/chateau-mariage/chateau-de-la-brulaire--e392833'
  },
  'chateau-corbe': {
    instagram: 'https://www.instagram.com/chateaudelacorbe/',
    mariagesNet: 'https://www.mariages.net/domaine-mariage/chateau-de-la-corbe--e403715'
  },
  'manoir-boulaie': {
    instagram: 'https://www.instagram.com/manoirdelaboulaie/',
    mariagesNet: 'https://www.mariages.net/domaine-mariage/manoir-de-la-boulaie--e349118'
  },
  'domaine-nantais': {
    instagram: 'https://www.instagram.com/domainenantais/',
    mariagesNet: 'https://www.mariages.net/domaine-mariage/domaine-nantais--e230388'
  },
  'le-dome': {
    instagram: 'https://www.instagram.com/_le_dome/',
    mariagesNet: 'https://www.mariages.net/salle-mariage/dome-nantais--e349120'
  }
};

// Import dynamique de la carte pour éviter les erreurs SSR avec Leaflet
const VenuesMap = dynamic(() => import('@/components/VenuesMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-muted rounded-lg flex items-center justify-center">
      <p className="text-secondary">Chargement de la carte...</p>
    </div>
  )
});

// Import du carrousel de venues
const VenuesCarousel = dynamic(() => import('@/components/VenuesCarousel'), {
  ssr: false
});

/**
 * Wrapper pour section reveal animations
 */
function SectionReveal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/**
 * Venue Card avec animations
 */
function VenueCardAnimated({ venue, index }: { venue: Venue; index: number }) {
  return (
    <motion.div
      className="h-full"
      variants={{
        hidden: { opacity: 0, y: 50 },
        show: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.7,
            ease: [0.4, 0, 0.2, 1]
          }
        }
      }}
    >
      <Link
        href={venue.externalUrl || venue.url || venue.contact?.website || `/lieux/${venue.slug}`}
        {...(venue.externalUrl || venue.url || venue.contact?.website ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="venue-card group overflow-hidden h-full flex flex-col bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 border border-stone/10"
      >
        {/* Image avec overlay gradient et numéro */}
        <div className="relative h-72 overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-[1.02]">
          <Image
            src={getCardImage(venue)}
            alt={displayVenueName(venue.name)}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 20vw"
          />
          {/* Overlay gradient subtil */}
          <div className="absolute inset-0 bg-linear-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Numéro dans cercle doré */}
          <div className="absolute bottom-4 left-4 w-14 h-14 rounded-full bg-linear-to-br from-accent to-accent-dark border-2 border-white shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
            <span className="font-display font-bold text-2xl text-white drop-shadow-md">{index + 1}</span>
          </div>
        </div>
        
        {/* Contenu avec fond dégradé subtil */}
        <div className="p-6 md:p-8 flex-1 flex flex-col text-center bg-linear-to-b from-white to-stone-50/30">
          {/* Titre avec ligne décorative */}
          <div className="mb-6 pb-4 border-b border-accent/20">
            <h3 className="font-display text-2xl md:text-3xl font-bold italic leading-tight group-hover:text-accent-light transition-colors duration-300" style={{ color: '#C9A961 !important' }}>
              {displayVenueName(venue.name)}
            </h3>
            <div className="w-12 h-0.5 bg-accent/40 mx-auto mt-3" />
          </div>

          {/* 3 icônes horizontales avec fond */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* Distance de Paris */}
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-stone-50/50 border border-stone/10 hover:border-accent/30 transition-colors">
              <MapPin className="w-5 h-5 text-accent" />
              <div className="text-xs uppercase tracking-wider text-secondary leading-tight">
                <div className="font-semibold text-primary text-sm">50 MIN</div>
                <div className="text-[10px]">DE PARIS</div>
              </div>
            </div>
            
            {/* Capacité */}
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-stone-50/50 border border-stone/10 hover:border-accent/30 transition-colors">
              <Users className="w-5 h-5 text-accent" />
              <div className="text-xs uppercase tracking-wider text-secondary leading-tight">
                <div className="font-semibold text-primary text-sm">{venue.capacity?.min || 10}-{venue.capacity?.max || venue.capacity?.seated || 200}</div>
                <div className="text-[10px]">PERS.</div>
              </div>
            </div>
            
            {/* Chambres */}
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-stone-50/50 border border-stone/10 hover:border-accent/30 transition-colors">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
              </svg>
              <div className="text-xs uppercase tracking-wider text-secondary leading-tight">
                <div className="font-semibold text-primary text-sm">{venue.capacity?.classroom || 24}</div>
                <div className="text-[10px]">CHAMBRES</div>
              </div>
            </div>
          </div>

          {/* Badges PRIVÉ / PRO élégants */}
          <div className="flex justify-center gap-4 mt-auto pt-6 border-t border-accent/10">
            <div className="px-4 py-2 rounded-full bg-accent/5 border border-accent/20 text-xs font-semibold tracking-widest text-accent hover:bg-accent hover:text-white transition-all duration-300 cursor-pointer">
              PRIVÉ
            </div>
            <div className="px-4 py-2 rounded-full bg-accent/5 border border-accent/20 text-xs font-semibold tracking-widest text-accent hover:bg-accent hover:text-white transition-all duration-300 cursor-pointer">
              PRO
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * Composant client pour la page d'accueil avec animations scroll
 * Séparé du server component principal pour optimiser les performances
 */

interface HomeClientProps {
  venues: Venue[];
  pageContent?: PageContent | null;
}

export default function HomeClient({ venues, pageContent }: HomeClientProps) {

  const locale = useLocale();
  const ctaRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"]
  });
  
  // Parallax subtil sur l'image CTA (10px max)
  const y = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <>
      {/* Histoire et Philosophie */}
      <SectionReveal>
        <section className="section bg-white">
          <div className="container">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-primary mb-4 md:mb-6">
                Une aventure née de <br></br><span className="text-cursive-underline">lieux</span> & de <span className="text-cursive-underline">passion</span>
              </h2>
              <motion.div 
                className="w-20 h-px bg-accent/40 mb-4 md:mb-5 mx-auto"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
              <motion.div 
                className="text-secondary space-y-3 md:space-y-4 text-base md:text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <p>Tout commence par un lieu.</p>
                <p>Un domaine découvert, une émotion, l&apos;envie de partager sa beauté.</p>
                <p>Puis un second, un troisième… à chaque fois la même flamme, <br></br>la même passion pour créer des souvenirs précieux.</p>
                <p>Peu à peu, ces lieux se sont reliés, unis par une même philosophie :<br></br>révéler leur âme, unir les talents, sublimer chaque instant.</p>
                <p className="text-xl md:text-2xl font-medium text-primary mt-5 md:mt-6">
                  Ainsi est née Lieux d&apos;Exception — une signature plus qu&apos;un nom, un fil conducteur entre des domaines d&apos;âme et des équipes passionnées, où chaque événement devient une histoire.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </SectionReveal>

      {/* Carrousel des Domaines (unique) */}
      <SectionReveal>
        <section className="section bg-stone-50">
          <div className="container">
            <motion.div 
              className="text-center mb-8 md:mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="title-xl text-center">
                <em>Domaines d&apos;Exception</em>
              </h2>
              <div className="accent-line" />
              <p className="subtitle text-center">
                Découvrez nos châteaux et domaines prestigieux en Pays de la Loire
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Grille de lieux - Ligne 1: Brûlaire, Corbe, Boulaie */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
                {venues
                  .filter(v => ['chateau-brulaire', 'chateau-corbe', 'manoir-boulaie'].includes(v.slug))
                  .sort((a, b) => {
                    const order = ['chateau-brulaire', 'chateau-corbe', 'manoir-boulaie'];
                    return order.indexOf(a.slug) - order.indexOf(b.slug);
                  })
                  .map((venue, index) => {
                    const socialLinks = venueSocialLinks[venue.slug];
                    return (
                      <div
                        key={venue.id}
                        className="group flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-neutral-800"
                      >
                        {/* Image */}
                        <Link href={`/${locale}/lieux/${venue.slug}`} className="relative aspect-4/3 overflow-hidden">
                          <Image
                            src={venue.images?.hero || venue.heroImage || venue.image || STORAGE_IMAGES.placeholder}
                            alt={venue.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </Link>
                        
                        {/* Contenu */}
                        <div className="p-6 flex-1 flex flex-col">
                          {/* Logo centré */}
                          {venue.slug !== 'chateau-de-la-corbe' && VENUE_LOGOS[venue.slug]?.blanc && (
                            <div className="flex justify-center mb-4">
                              <Image
                                src={VENUE_LOGOS[venue.slug]?.blanc!}
                                alt={`Logo ${venue.name}`}
                                width={96}
                                height={96}
                                className="object-contain drop-shadow-lg"
                                
                              />
                            </div>
                          )}
                          <Link href={`/${locale}/lieux/${venue.slug}`}>
                            <h3 className="text-xl md:text-2xl font-display font-semibold mb-3 transition-colors text-center" style={{ color: '#C9A961' }}>
                              {venue.name}
                            </h3>
                          </Link>
                          
                          <div className="flex items-center gap-2 text-white/90 text-sm md:text-base mb-2">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span>{venue.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-white/90 text-sm md:text-base mb-4">
                            <Users className="w-4 h-4 shrink-0" />
                            <span>Jusqu&apos;à {venue.capacitySeated} personnes</span>
                          </div>

                          {/* Contact */}
                          <div className="space-y-2 mb-4">
                            {venue.emailMariages && (
                              <a
                                href={`mailto:${venue.emailMariages}`}
                                className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors text-sm"
                              >
                                <span>✉</span>
                                <span>{venue.emailMariages}</span>
                              </a>
                            )}
                            {venue.phoneMariages && (
                              <a
                                href={`tel:${venue.phoneMariages.replace(/\s/g, '')}`}
                                className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors text-sm"
                              >
                                <span>☎</span>
                                <span>{venue.phoneMariages}</span>
                              </a>
                            )}
                          </div>

                          {/* Liens sociaux */}
                          {socialLinks && (
                            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
                              <a
                                href={socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors text-sm"
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`Instagram ${displayVenueName(venue.name)}`}
                              >
                                <Instagram className="w-4 h-4" />
                                <span>Instagram</span>
                              </a>
                              <a
                                href={socialLinks.mariagesNet}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors text-sm"
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`Mariages.net ${displayVenueName(venue.name)}`}
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>Mariages.net</span>
                              </a>
                            </div>
                          )}

                          <Link 
                            href={`/${locale}/lieux/${venue.slug}`}
                            className="mt-4 inline-flex items-center gap-2 font-medium group-hover:gap-3 transition-all"
                            style={{ color: '#C9A961' }}
                          >
                            Découvrir →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Grille de lieux - Ligne 2: Le Domaine Nantais, Le Dôme (centrés) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                {venues
                  .filter(v => ['domaine-nantais', 'le-dome'].includes(v.slug))
                  .sort((a, b) => {
                    const order = ['domaine-nantais', 'le-dome'];
                    return order.indexOf(a.slug) - order.indexOf(b.slug);
                  })
                  .map((venue, index) => {
                    const socialLinks = venueSocialLinks[venue.slug];
                    const displayIndex = index + 4; // 4 et 5 pour la deuxième ligne
                    return (
                      <div
                        key={venue.id}
                        className="group flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-neutral-800"
                      >
                        {/* Image */}
                        <Link href={`/${locale}/lieux/${venue.slug}`} className="relative aspect-4/3 overflow-hidden">
                          <Image
                            src={venue.images?.hero || venue.heroImage || venue.image || STORAGE_IMAGES.placeholder}
                            alt={venue.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </Link>
                        
                        {/* Contenu */}
                        <div className="p-6 flex-1 flex flex-col">
                          {/* Logo centré */}
                          {venue.slug !== 'chateau-de-la-corbe' && VENUE_LOGOS[venue.slug]?.blanc && (
                            <div className="flex justify-center mb-4">
                              <Image
                                src={VENUE_LOGOS[venue.slug]?.blanc!}
                                alt={`Logo ${venue.name}`}
                                width={96}
                                height={96}
                                className="object-contain drop-shadow-lg"
                                
                              />
                            </div>
                          )}
                          <Link href={`/${locale}/lieux/${venue.slug}`}>
                            <h3 className="text-xl md:text-2xl font-display font-semibold mb-3 transition-colors text-center" style={{ color: '#C9A961' }}>
                              {venue.name}
                            </h3>
                          </Link>
                          
                          <div className="flex items-center gap-2 text-white/90 text-sm md:text-base mb-2">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span>{venue.location}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-white/90 text-sm md:text-base mb-4">
                            <Users className="w-4 h-4 shrink-0" />
                            <span>Jusqu&apos;à {venue.capacitySeated} personnes</span>
                          </div>

                          {/* Contact */}
                          <div className="space-y-2 mb-4">
                            {venue.emailMariages && (
                              <a
                                href={`mailto:${venue.emailMariages}`}
                                className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors text-sm"
                              >
                                <span>✉</span>
                                <span>{venue.emailMariages}</span>
                              </a>
                            )}
                            {venue.phoneMariages && (
                              <a
                                href={`tel:${venue.phoneMariages.replace(/\s/g, '')}`}
                                className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors text-sm"
                              >
                                <span>☎</span>
                                <span>{venue.phoneMariages}</span>
                              </a>
                            )}
                          </div>

                          {/* Liens sociaux */}
                          {socialLinks && (
                            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
                              <a
                                href={socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors text-sm"
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`Instagram ${displayVenueName(venue.name)}`}
                              >
                                <Instagram className="w-4 h-4" />
                                <span>Instagram</span>
                              </a>
                              <a
                                href={socialLinks.mariagesNet}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-white/70 hover:text-accent transition-colors text-sm"
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`Mariages.net ${displayVenueName(venue.name)}`}
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>Mariages.net</span>
                              </a>
                            </div>
                          )}

                          <Link 
                            href={`/${locale}/lieux/${venue.slug}`}
                            className="mt-4 inline-flex items-center gap-2 font-medium group-hover:gap-3 transition-all"
                            style={{ color: '#C9A961' }}
                          >
                            Découvrir →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          </div>
        </section>
      </SectionReveal>

      {/* Nos Prestations */}
      <SectionReveal>
        <section className="section bg-white">
          <div className="container">
            <motion.div 
              className="text-center mb-8 md:mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="title-xl text-center">
                Lieux d&apos;Exception, une <em>signature</em> d&apos;émotion
              </h2>
              <div className="accent-line" />
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
            >
              {[
                {
                  number: "01",
                  title: "Un accompagnement sur mesure",
                  text: "Chaque projet débute par une immersion complète dans votre univers : comprendre votre histoire, vos envies et vos contraintes afin de concevoir un événement fidèle à votre image, sans compromis."
                },
                {
                  number: "02",
                  title: "Une orchestration fluide",
                  text: "De la sélection du lieu à la mise en scène finale, nous pilotons l'ensemble de l'organisation avec rigueur et précision. Bénéficiez d'un interlocuteur unique qui coordonne chaque étape pour un déroulé parfaitement maîtrisé."
                },
                {
                  number: "03",
                  title: "Un réseau de partenaires",
                  text: "Nous collaborons exclusivement avec des professionnels reconnus pour leur exigence, leur sens du détail et la qualité irréprochable de leurs prestations."
                },
                {
                  number: "04",
                  title: "Des lieux d'exception, en exclusivité",
                  text: "Nos lieux vous sont proposés en exclusivité, pour garantir intimité, sérénité et une expérience unique, loin des lieux standardisés."
                }
              ].map((item) => (
                <motion.div 
                  key={item.number}
                  className="h-full"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { 
                      opacity: 1, 
                      y: 0,
                      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                    }
                  }}
                >
                  <div className="h-full p-8 rounded-lg bg-charcoal-800 shadow-lg hover:shadow-2xl transition-all duration-500 border border-accent/20 flex flex-col text-center group">
                    {/* Numéro dans un cercle doré */}
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-accent to-accent-dark text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="font-display font-bold text-3xl drop-shadow-md">{item.number}</span>
                      </div>
                    </div>
                    
                    {/* Titre */}
                    <h3 
                      className="text-lg md:text-xl font-heading font-semibold mb-4 uppercase tracking-wider group-hover:opacity-80 transition-all duration-300 min-h-18 md:min-h-20 flex items-center justify-center"
                      style={{ color: '#C9A961' }}
                    >
                      {item.title}
                    </h3>
                    
                    {/* Ligne décorative */}
                    <div className="w-16 h-0.5 bg-accent/60 mx-auto mb-6" />
                    
                    {/* Texte */}
                    <p className="text-white/90 leading-relaxed text-sm md:text-base flex-1">
                      {item.text}
                    </p>
                    
                    {/* Point décoratif en bas */}
                    <div className="mt-6 pt-6 border-t border-accent/20">
                      <div className="w-2 h-2 rounded-full bg-accent/60 mx-auto" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </SectionReveal>

      {/* CTA Émotion avec parallax */}
      <SectionReveal>
        <section ref={ctaRef} className="section relative overflow-hidden mb-0">
        <motion.div style={{ y }} className="absolute inset-0">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/venues%2Fdomaine-nantais%2Fmariages%2Fdomaine_cocktail_5.jpg?alt=media"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-primary/80" />
        <motion.div 
          className="container relative z-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="text-center mx-auto">
            <p className="text-2xl md:text-3xl lg:text-4xl font-display italic text-white mb-3 md:mb-4" style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)' }}>
              Parce que l&apos;<span className="text-cursive-circled">émotion</span> se vit pleinement lorsqu&apos;elle trouve son Lieu d&apos;Exception.
            </p>
            <p className="text-lg md:text-xl text-white/90 mb-4 md:mb-6 font-light uppercase tracking-wider">
              Des domaines où se mêlent beauté, sincérité et art de recevoir.
            </p>
            <Link href={`/${locale}/contact`} className="btn btn-primary">
              Contact & Devis
            </Link>
          </div>
        </motion.div>
        </section>
      </SectionReveal>

      {/* Carte Interactive des Lieux */}
      <SectionReveal>
        <section className="section bg-alt mt-0">
          <div className="container">
            <motion.div 
              className="text-center mb-8 md:mb-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="title-xl text-center">
                Nos <em>Domaines</em> en Pays de la Loire
              </h2>
              <div className="accent-line" />
              <p className="subtitle text-center">
                Découvrez la localisation de nos châteaux et domaines d&apos;exception
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-xl overflow-hidden shadow-2xl border border-accent/20"
            >
              <VenuesMap venues={venues} />
            </motion.div>
          </div>
        </section>
      </SectionReveal>

      
    </>
  );
}
