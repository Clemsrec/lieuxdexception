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
 *     { label: "Nous contacter", href: "/contact", primary: true },
 *     { label: "Voir nos lieux", href: "/catalogue", primary: false }
 *   ]}
 * />
 * ```
 */

import Image from 'next/image';
import Link from 'next/link';

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
          {/* Overlay gradient pour contraste texte (comme HeroCarousel) */}
          <div className="absolute inset-0 bg-linear-to-b from-primary/70 via-primary/50 to-primary/70 z-20" />
          {/* Overlay supplémentaire au centre pour le texte */}
          <div className="absolute inset-0 bg-primary/20 z-20" />
        </>
      ) : null}
      
      {/* Contenu en 2 colonnes */}
      <div className="hero-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center max-w-7xl w-full">
          
          {/* Colonne gauche - Titre */}
          <div className="flex items-center animate-fade-in">
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-white leading-tight"
              style={{ textShadow: '0 4px 30px rgba(0, 0, 0, 0.7)' }}
            >
              {title}
            </h1>
          </div>

          {/* Colonne droite - Sous-titre + Description + Boutons */}
          <div className="flex flex-col items-start space-y-4 lg:space-y-6">
            {subtitle && (
              <>
                <div className="w-20 h-px bg-white/40 animate-fade-in" style={{ animationDelay: '0.3s' }} />
                <p 
                  className="text-2xl md:text-3xl lg:text-4xl font-display italic text-white animate-fade-in"
                  style={{ animationDelay: '0.4s', textShadow: '0 2px 20px rgba(0, 0, 0, 0.7)' }}
                >
                  {subtitle}
                </p>
              </>
            )}
            
            {description && (
              <p 
                className="text-base md:text-lg lg:text-xl text-white/95 leading-relaxed animate-fade-in"
                style={{ animationDelay: '0.5s', textShadow: '0 2px 15px rgba(0, 0, 0, 0.6)' }}
              >
                {description}
              </p>
            )}

            {buttons.length > 0 && (
              <div 
                className="flex flex-col sm:flex-row gap-4 pt-2 animate-fade-in"
                style={{ animationDelay: '0.6s' }}
              >
                {buttons.map((button, index) => (
                  <Link
                    key={index}
                    href={button.href}
                    className={button.primary ? 'btn-primary' : 'btn-secondary'}
                    style={!button.primary ? { color: 'white', borderColor: 'white' } : undefined}
                  >
                    {button.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
