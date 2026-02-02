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
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1920px"
            quality={75}
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
          
          {/* Titre principal - Utilise .title-hero (32px mobile / 48px desktop) */}
          <h1 
            className="title-hero text-white leading-tight"
            style={{ textShadow: '0 4px 30px rgba(0, 0, 0, 0.7)' }}
          >
            {title}
          </h1>

          {/* Ligne décorative */}
          <div className="w-20 h-px bg-white/40" />

          {/* Sous-titre - Plus grand que description (20px mobile / 24px desktop) */}
          {subtitle && (
            <p 
              className="text-xl md:text-2xl font-display italic text-white"
              style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.7)' }}
            >
              {subtitle}
            </p>
          )}
          
          {/* Description - Taille body standard (14px mobile / 18px desktop) */}
          {description && (
            <div 
              className="text-white/95 leading-relaxed"
              style={{ textShadow: '0 2px 15px rgba(0, 0, 0, 0.6)' }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

          {/* Boutons */}
          {buttons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 pt-6 md:pt-8">
              {buttons.map((button, index) => (
                <Link
                  key={index}
                  href={button.href}
                  className={button.primary ? 'btn btn-primary' : 'btn btn-secondary'}
                >
                  {button.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
