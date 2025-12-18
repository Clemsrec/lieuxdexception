'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

/**
 * Props pour ContentSection
 */
interface ContentSectionProps {
  title?: string;
  content: string; // HTML
  className?: string;
  animateOnScroll?: boolean;
}

/**
 * Composant pour afficher une section de contenu éditable
 * 
 * @param title - Titre de la section (optionnel)
 * @param content - Contenu HTML de la section
 * @param className - Classes Tailwind additionnelles
 * @param animateOnScroll - Activer l'animation au scroll (défaut: true)
 */
export function ContentSection({
  title,
  content,
  className = '',
  animateOnScroll = true,
}: ContentSectionProps) {
  const Container = animateOnScroll ? motion.div : 'div';
  const animationProps = animateOnScroll
    ? {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-50px' },
        transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as any },
      }
    : {};

  return (
    <Container className={`space-y-4 ${className}`} {...animationProps}>
      {title && (
        <div
          className="text-2xl md:text-3xl font-display font-semibold text-primary mb-4 prose prose-lg"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      )}
      
      <div
        className="prose prose-lg max-w-none text-secondary leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Container>
  );
}

/**
 * Props pour FeatureCard
 */
interface FeatureCardProps {
  number: string; // "01", "02", etc.
  title: string;
  content: string; // HTML
  className?: string;
}

/**
 * Composant pour afficher une carte de fonctionnalité
 */
export function FeatureCard({ number, title, content, className = '' }: FeatureCardProps) {
  return (
    <div className={`h-full p-8 rounded-lg bg-charcoal-800 shadow-lg hover:shadow-2xl transition-all duration-500 border border-accent/20 flex flex-col text-center group ${className}`}>
      {/* Numéro dans un cercle doré */}
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-accent to-accent-dark text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
          <span className="font-display font-bold text-3xl drop-shadow-md">{number}</span>
        </div>
      </div>
      
      {/* Titre */}
      <h3 
        className="text-lg md:text-xl font-heading font-semibold mb-4 uppercase tracking-wider group-hover:opacity-80 transition-all duration-300 min-h-18 md:min-h-20 flex items-center justify-center"
        style={{ color: '#C9A961' }}
      >
        {title}
      </h3>
      
      {/* Ligne décorative */}
      <div className="w-16 h-0.5 bg-accent/60 mx-auto mb-6" />
      
      {/* Texte */}
      <div
        className="text-white/90 leading-relaxed text-sm md:text-base flex-1"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      {/* Point décoratif en bas */}
      <div className="mt-6 pt-6 border-t border-accent/20">
        <div className="w-2 h-2 rounded-full bg-accent/60 mx-auto" />
      </div>
    </div>
  );
}

/**
 * Props pour ContentBlock
 */
interface ContentBlockProps {
  title: string;
  subtitle?: string;
  content: string; // HTML
  image?: string;
  imageAlt?: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

/**
 * Composant pour afficher un bloc de contenu avec image
 */
export function ContentBlock({
  title,
  subtitle,
  content,
  image,
  imageAlt,
  ctaText,
  ctaLink,
  className = '',
}: ContentBlockProps) {
  return (
    <div className={`bg-stone-50 border border-stone/20 rounded-xl p-6 shadow-lg ${className}`}>
      {subtitle && (
        <p className="text-sm text-accent uppercase tracking-wider mb-2">{subtitle}</p>
      )}
      
      <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-accent">
        {title}
      </h3>
      
      <div
        className="text-secondary leading-relaxed prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      {ctaText && ctaLink && (
        <a
          href={ctaLink}
          className="inline-flex items-center gap-2 mt-4 text-accent hover:text-accent-dark transition-colors font-medium"
        >
          {ctaText} →
        </a>
      )}
    </div>
  );
}

/**
 * Props pour FinalCTA
 */
interface FinalCTAProps {
  title: string;
  subtitle?: string;
  content?: string; // HTML
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
  className?: string;
}

/**
 * Composant pour afficher le CTA final de page
 */
export function FinalCTA({
  title,
  subtitle,
  content,
  ctaText,
  ctaLink,
  backgroundImage,
  className = '',
}: FinalCTAProps) {
  return (
    <section className={`section relative overflow-hidden ${className}`}>
      {/* Image de fond */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-black/20 bg-linear-to-b from-black/10 to-black/30" />
        </div>
      )}

      <div className="container relative z-10">
        <div className="text-center rounded-2xl p-6 md:p-12 backdrop-blur-sm bg-black/30 border border-white/20">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white drop-shadow-lg">
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-white text-base md:text-lg mb-4 drop-shadow-md">
              {subtitle}
            </p>
          )}
          
          {content && (
            <div
              className="text-sm md:text-base text-white mb-8 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
          
          <a href={ctaLink} className="btn btn-primary inline-block">
            {ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
