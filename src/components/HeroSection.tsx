/**
 * Composant HeroSection - Section hero réutilisable pour toutes les pages
 * 
 * Layout en 2 colonnes :
 * - Gauche : Logo CLE + Titre
 * - Droite : Sous-titre, description, boutons
 * 
 * @example
 * ```tsx
 * <HeroSection
 *   title="Mariages d'Exception"
 *   subtitle="La clé de vos moments uniques"
 *   description="Des domaines où se mêlent beauté, sincérité et art de recevoir"
 *   backgroundImage="/images/hero.jpg"
 *   buttons={[
 *     { label: "Nous contacter", href: "/contact", primary: true }
 *   ]}
 * />
 * ```
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navigation from './Navigation';

interface HeroButton {
  label: string;
  href: string;
  primary?: boolean;
}

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  buttons?: HeroButton[];
  carousel?: React.ReactNode; // Pour la page d'accueil avec carousel
}

export default function HeroSection({
  title,
  subtitle,
  description,
  backgroundImage,
  buttons = [],
  carousel
}: HeroSectionProps) {
  return (
    <section className="hero-section relative">
      {/* Navigation intégrée dans le Hero */}
      <Navigation />
      
      {/* Background - Carousel ou Image statique */}
      {carousel ? (
        carousel
      ) : backgroundImage ? (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Overlay gris-noir pour contraste texte */}
          <div className="absolute inset-0 bg-black/40 z-20" />
          
          {/* Overlay gradient pour profondeur */}
          <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/40 z-20" />
        </>
      ) : null}
      
      {/* Contenu centré */}
      <div className="hero-content">
        <div className="flex flex-col items-center text-center w-full mx-auto space-y-6">
          
          {/* Titre principal */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-semibold text-white leading-tight"
            style={{ textShadow: '0 4px 30px rgba(0, 0, 0, 0.7)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {title}
          </motion.h1>

          {/* Ligne décorative */}
          <motion.div 
            className="w-20 h-px bg-white/40"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Sous-titre */}
          {subtitle && (
            <motion.p 
              className="text-xl md:text-2xl lg:text-3xl font-display italic text-white"
              style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.7)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              {subtitle}
            </motion.p>
          )}
          
          {/* Description */}
          {description && (
            <motion.p 
              className="text-base md:text-lg lg:text-xl text-white/95 leading-relaxed"
              style={{ textShadow: '0 2px 15px rgba(0, 0, 0, 0.6)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              {description}
            </motion.p>
          )}

          {/* Boutons */}
          {buttons.length > 0 && (
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-6 md:pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              {buttons.map((button, index) => (
                <Link
                  key={index}
                  href={button.href}
                  className={`${button.primary ? 'btn-primary' : 'btn-secondary'} min-h-[48px] flex items-center justify-center px-6 md:px-8`}
                  style={!button.primary ? { color: 'white', borderColor: 'white' } : undefined}
                >
                  {button.label}
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
