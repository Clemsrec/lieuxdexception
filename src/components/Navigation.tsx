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
    const activeClasses = "text-white font-semibold";
    const inactiveClasses = "text-white/90 hover:text-white";
    
    return `${baseClasses} ${isActive(href) ? activeClasses : inactiveClasses}`;
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container-wide">
        <div className="flex items-center justify-between h-20 md:h-24">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center hover:opacity-80 transition-opacity shrink-0"
          >
            <Image
              src="/logo/Logo_CLE_avec Texte.png"
              alt="Lieux d'Exception"
              width={120}
              height={35}
              priority
              className="h-7 w-auto max-w-[120px]"
              style={{ maxWidth: '120px', maxHeight: '35px', width: 'auto', height: 'auto', objectFit: 'contain' }}
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
              SÉMINAIRES & PRO
            </Link>
            <Link 
              href="/mariages" 
              className={getLinkClasses('/mariages')}
            >
              MARIAGES & PRIVÉS
            </Link>
            <Link 
              href="/galerie" 
              className={getLinkClasses('/galerie')}
            >
              Galerie
            </Link>
            <Link 
              href="/histoire" 
              className={getLinkClasses('/histoire')}
            >
              Histoire
            </Link>
            <Link 
              href="/contact" 
              className="btn-primary whitespace-nowrap"
            >
              Contact
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
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
          <div className="md:hidden py-4 bg-primary/95 backdrop-blur-md border-t border-white/20 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/catalogue" 
                className={getLinkClasses('/catalogue')}
                onClick={() => setIsMenuOpen(false)}
              >
                Catalogue
              </Link>
              <Link 
                href="/evenements-b2b" 
                className={getLinkClasses('/evenements-b2b')}
                onClick={() => setIsMenuOpen(false)}
              >
                SÉMINAIRES & PRO
              </Link>
              <Link 
                href="/mariages" 
                className={getLinkClasses('/mariages')}
                onClick={() => setIsMenuOpen(false)}
              >
                MARIAGES & PRIVÉS
              </Link>
              <Link 
                href="/galerie" 
                className={getLinkClasses('/galerie')}
                onClick={() => setIsMenuOpen(false)}
              >
                Galerie
              </Link>
              <Link 
                href="/histoire" 
                className={getLinkClasses('/histoire')}
                onClick={() => setIsMenuOpen(false)}
              >
                Histoire
              </Link>
              <Link 
                href="/contact" 
                className={`btn-primary w-fit whitespace-nowrap ${isActive('/contact') ? 'bg-primary/90' : ''}`}
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