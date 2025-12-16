'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { MapPin, Users } from 'lucide-react';
import { useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import type { Venue } from '@/types/firebase';
import { displayVenueName } from '@/lib/formatVenueName';
import { getCardImage } from '@/lib/sharedVenueImages';

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
        className="venue-card group overflow-hidden h-full flex flex-col bg-white"
      >
        {/* Image avec numéro */}
        <motion.div 
          className="relative h-64 overflow-hidden shrink-0"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={getCardImage(venue.id || venue.slug)}
            alt={displayVenueName(venue.name)}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 20vw"
          />
          {/* Numéro dans cercle */}
          <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white border-2 border-accent flex items-center justify-center">
            <span className="font-display font-bold text-xl text-primary">{index + 1}</span>
          </div>
        </motion.div>
        
        {/* Contenu */}
        <div className="p-6 flex-1 flex flex-col text-center">
          {/* Titre en 2 lignes */}
          <div className="mb-6">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-primary italic">
              {displayVenueName(venue.name)}
            </h3>
          </div>

          {/* 3 icônes horizontales */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Distance de Paris */}
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-6 h-6 text-accent" />
              <div className="text-xs uppercase tracking-wider text-secondary">
                <div className="font-semibold text-primary">50 MIN</div>
                <div>DE PARIS</div>
              </div>
            </div>
            
            {/* Capacité */}
            <div className="flex flex-col items-center gap-2">
              <Users className="w-6 h-6 text-accent" />
              <div className="text-xs uppercase tracking-wider text-secondary">
                <div className="font-semibold text-primary">{venue.capacity?.min || 10}-{venue.capacity?.max || venue.capacity?.seated || 200}</div>
                <div>PERS.</div>
              </div>
            </div>
            
            {/* Chambres */}
            <div className="flex flex-col items-center gap-2">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
              </svg>
              <div className="text-xs uppercase tracking-wider text-secondary">
                <div className="font-semibold text-primary">{venue.capacity?.classroom || 24} CHAMBRES</div>
                <div>+ GÎTES</div>
              </div>
            </div>
          </div>

          {/* Badges PRIVÉ / PRO */}
          <div className="flex justify-center gap-6 mt-auto pt-4 border-t border-stone/20">
            <div className="text-sm font-medium tracking-widest text-accent hover:text-accent-dark transition-colors cursor-pointer">
              PRIVÉ
            </div>
            <div className="text-sm font-medium tracking-widest text-accent hover:text-accent-dark transition-colors cursor-pointer">
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
}

export default function HomeClient({ venues }: HomeClientProps) {
  console.log('🎨 [HomeClient] Venues reçues:', venues.length, venues);
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
        <section className="section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-primary mb-4 md:mb-6">
                Une aventure née de <span className="text-cursive-underline">lieux</span> & de <span className="text-cursive-underline">passion</span>
              </h2>
              <motion.div 
                className="w-20 h-px bg-accent/40 mb-4 md:mb-5"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
              <motion.div 
                className="text-secondary space-y-3 md:space-y-4 text-base md:text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <p>Tout commence par un lieu.</p>
                <p>Un domaine découvert, une émotion, l&apos;envie de partager sa beauté.</p>
                <p>Puis un second, un troisième… à chaque fois la même flamme, la même passion pour créer des souvenirs précieux.</p>
                <p>Peu à peu, ces lieux se sont reliés, unis par une même philosophie : révéler leur âme, unir les talents, sublimer chaque instant.</p>
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
        <section className="section">
          <div className="container">
            <motion.div 
              className="text-center mb-8 md:mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="title-xl text-center">
                5 <em>Domaines d&apos;Exception</em>
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
              <VenuesCarousel venues={venues} autoPlayInterval={6000} />
            </motion.div>
          </div>
        </section>
      </SectionReveal>

      {/* Nos Prestations */}
      <SectionReveal>
        <section className="section">
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
                  title: "Rencontres personnalisées",
                  text: "Rencontres et échanges personnalisés pour comprendre vos envies et imaginer une réception à votre image."
                },
                {
                  number: "02",
                  title: "Organisation & Coordination",
                  text: "Accompagnement dans l'organisation et la coordination de votre événement, du choix des espaces à la mise en scène du grand jour."
                },
                {
                  number: "03",
                  title: "Réseau de partenaires",
                  text: "Accès à un réseau de partenaires sélectionnés : traiteurs, décorateurs, fleuristes, photographes… tous choisis pour leur exigence et leur sens du service."
                },
                {
                  number: "04",
                  title: "Mise à disposition exclusive",
                  text: "Mise à disposition exclusive de domaines pour vos événements."
                }
              ].map((item) => (
                <motion.div 
                  key={item.number}
                  className="text-center"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { 
                      opacity: 1, 
                      y: 0,
                      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                    }
                  }}
                >
                  <div className="section-number">{item.number}</div>
                  <h3 className="text-lg md:text-xl font-heading font-semibold mb-2 md:mb-3 uppercase tracking-wider">{item.title}</h3>
                  <div className="w-12 md:w-16 h-px bg-accent/40 mx-auto mb-2 md:mb-3" />
                  <p className="text-secondary leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </SectionReveal>

      {/* CTA Émotion avec parallax */}
      <SectionReveal>
        <section ref={ctaRef} className="section relative overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0">
          <Image
            src="/images/table.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
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
            <Link href={`/${locale}/contact`} className="btn-primary">
              Nous contacter
            </Link>
          </div>
        </motion.div>
        </section>
      </SectionReveal>

      {/* Carte Interactive des Lieux */}
      <SectionReveal>
        <section className="section bg-alt">
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
