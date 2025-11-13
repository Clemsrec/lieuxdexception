/**
 * Composant Navigation - Barre de navigation principale pour Lieux d'Exception
 * 
 * Ce composant utilise les nouvelles fonctionnalités de Tailwind v4 :
 * - Variables CSS personnalisées
 * - Classes composants définies dans globals.css
 * - Support natif du mode sombre
 * - Navigation responsive avec menu mobile
 * 
 * @example
 * ```tsx
 * <Navigation />
 * ```
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  /**
   * Basculer l'état du menu mobile
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /**
   * Vérifier si un lien est actif
   * @param href - Le chemin du lien
   * @returns boolean - True si le lien est actif
   */
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  /**
   * Classes CSS pour les liens selon leur état actif
   * @param href - Le chemin du lien
   * @returns string - Classes CSS conditionnelles
   */
  const getLinkClasses = (href: string) => {
    const baseClasses = "transition-colors duration-200";
    const activeClasses = "text-primary font-medium";
    const inactiveClasses = "text-foreground/80 hover:text-primary";
    
    return `${baseClasses} ${isActive(href) ? activeClasses : inactiveClasses}`;
  };

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo/Logo_CLE_avec Texte.png"
              alt="Lieux d'Exception"
              width={180}
              height={50}
              priority
              className="h-10 w-auto"
            />
          </Link>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/catalogue" 
              className={getLinkClasses('/catalogue')}
            >
              Catalogue
            </Link>
            <Link 
              href="/evenements-b2b" 
              className={getLinkClasses('/evenements-b2b')}
            >
              Événements B2B
            </Link>
            <Link 
              href="/mariages" 
              className={getLinkClasses('/mariages')}
            >
              Mariages
            </Link>
            <Link 
              href="/comparer" 
              className={getLinkClasses('/comparer')}
            >
              Comparer
            </Link>
            <Link 
              href="/contact" 
              className={`btn-primary ${isActive('/contact') ? 'bg-primary/90' : ''}`}
            >
              Contact
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/catalogue" 
                className={getLinkClasses('/catalogue')}
                onClick={() => setIsMenuOpen(false)}
              >
                Catalogue des Lieux
              </Link>
              <Link 
                href="/evenements-b2b" 
                className={getLinkClasses('/evenements-b2b')}
                onClick={() => setIsMenuOpen(false)}
              >
                Événements B2B
              </Link>
              <Link 
                href="/mariages" 
                className={getLinkClasses('/mariages')}
                onClick={() => setIsMenuOpen(false)}
              >
                Mariages
              </Link>
              <Link 
                href="/comparer" 
                className={getLinkClasses('/comparer')}
                onClick={() => setIsMenuOpen(false)}
              >
                Comparer les domaines
              </Link>
              <Link 
                href="/contact" 
                className={`btn-primary w-fit ${isActive('/contact') ? 'bg-primary/90' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}