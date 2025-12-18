/**
 * Composant Navigation - Barre de navigation principale pour Lieux d'Exception
 * 
 * Ce composant utilise les nouvelles fonctionnalités de Tailwind v4 :
 * - Variables CSS personnalisées
 * - Classes composants définies dans globals.css
 * - Support natif du mode sombre
 * - Navigation responsive avec menu mobile
 * - Traductions i18n avec next-intl
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
import { useTranslations, useLocale } from 'next-intl';
import { getMainLogo } from '@/lib/storage-assets';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVenuesOpen, setIsVenuesOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const locale = useLocale();

  /**
   * Basculer l'état du menu mobile
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /**
   * Vérifier si un lien est actif
   * @param href - Le chemin du lien (sans locale)
   * @returns boolean - True si le lien est actif
   */
  const isActive = (href: string) => {
    const localizedPath = `/${locale}${href}`;
    if (href === '/') {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(localizedPath);
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
        <div className="flex items-center justify-between min-h-20 md:h-24 lg:h-28 pt-6 pb-4 md:py-4">
          
          {/* Logo */}
          <Link 
            href={`/${locale}`}
            className="flex items-center hover:opacity-80 transition-opacity shrink-0 ml-2 sm:ml-0"
          >
            <Image
              src={getMainLogo('white')}
              alt="Lieux d'Exception"
              width={180}
              height={53}
              priority
              className="w-auto h-8 md:h-14"
            />
          </Link>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Menu Nos Lieux avec dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsVenuesOpen(true)}
              onMouseLeave={() => setIsVenuesOpen(false)}
            >
              <button
                className="text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-1 py-2"
                aria-expanded={isVenuesOpen}
              >
                Nos Lieux
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown menu avec padding invisible pour éviter le gap */}
              {isVenuesOpen && (
                <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="w-64 bg-white rounded-lg shadow-xl border border-stone-200 py-2">
                    <Link
                      href={`/${locale}/lieux/chateau-brulaire`}
                      className="block px-4 py-2 text-sm text-charcoal-800 hover:bg-accent/10 hover:text-accent transition-colors"
                    >
                      Le Château de la Brûlaire
                    </Link>
                    <Link
                      href={`/${locale}/lieux/chateau-corbe`}
                      className="block px-4 py-2 text-sm text-charcoal-800 hover:bg-accent/10 hover:text-accent transition-colors"
                    >
                      Le Château de la Corbe
                    </Link>
                    <Link
                      href={`/${locale}/lieux/domaine-nantais`}
                      className="block px-4 py-2 text-sm text-charcoal-800 hover:bg-accent/10 hover:text-accent transition-colors"
                    >
                      Le Domaine Nantais
                    </Link>
                    <Link
                      href={`/${locale}/lieux/manoir-boulaie`}
                      className="block px-4 py-2 text-sm text-charcoal-800 hover:bg-accent/10 hover:text-accent transition-colors"
                    >
                      Le Manoir de la Boulaie
                    </Link>
                    <Link
                      href={`/${locale}/lieux/le-dome`}
                      className="block px-4 py-2 text-sm text-charcoal-800 hover:bg-accent/10 hover:text-accent transition-colors"
                    >
                      Le Dôme
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <Link 
              href={`/${locale}/evenements-b2b`}
              className={getLinkClasses('/evenements-b2b')}
            >
              {t('b2b')}
            </Link>
            <Link 
              href={`/${locale}/mariages`}
              className={getLinkClasses('/mariages')}
            >
              {t('weddings')}
            </Link>
            <Link 
              href={`/${locale}/galerie-histoire`}
              className={getLinkClasses('/galerie-histoire')}
            >
              {t('gallery')}
            </Link>
            <Link 
              href={`/${locale}/contact`}
              className="btn btn-primary"
            >
              {t('contact')}
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-3 rounded-lg text-white hover:bg-white/10 transition-colors min-w-12 min-h-12 flex items-center justify-center"
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
          <div className="md:hidden py-6 px-4 bg-charcoal-800 backdrop-blur-md border-t border-white/20 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {/* Section Nos Lieux */}
              <div className="border-b border-white/20 pb-4 mb-2">
                <p className="text-white/60 text-xs uppercase tracking-wider mb-3 px-2">Nos Lieux</p>
                <Link 
                  href={`/${locale}/lieux/chateau-brulaire`}
                  className="text-white hover:text-accent transition-colors min-h-12 flex items-center py-2 px-4 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Le Château de la Brûlaire
                </Link>
                <Link 
                  href={`/${locale}/lieux/chateau-corbe`}
                  className="text-white hover:text-accent transition-colors min-h-12 flex items-center py-2 px-4 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Le Château de la Corbe
                </Link>
                <Link 
                  href={`/${locale}/lieux/domaine-nantais`}
                  className="text-white hover:text-accent transition-colors min-h-12 flex items-center py-2 px-4 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Le Domaine Nantais
                </Link>
                <Link 
                  href={`/${locale}/lieux/manoir-boulaie`}
                  className="text-white hover:text-accent transition-colors min-h-12 flex items-center py-2 px-4 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Le Manoir de la Boulaie
                </Link>
                <Link 
                  href={`/${locale}/lieux/le-dome`}
                  className="text-white hover:text-accent transition-colors min-h-12 flex items-center py-2 px-4 text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Le Dôme
                </Link>
              </div>
              
              <Link 
                href={`/${locale}/evenements-b2b`}
                className="text-white hover:text-accent transition-colors min-h-12 flex items-center py-3 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('b2b')}
              </Link>
              <Link 
                href={`/${locale}/mariages`}
                className="text-white hover:text-accent transition-colors min-h-12 flex items-center py-3 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('weddings')}
              </Link>
              <Link 
                href={`/${locale}/galerie-histoire`}
                className="text-white hover:text-accent transition-colors min-h-12 flex items-center py-3 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('gallery')}
              </Link>
              <Link 
                href={`/${locale}/contact`}
                className="btn btn-primary w-fit mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('contact')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}