/**
 * Hook personnalisé pour gérer les liens localisés avec next-intl
 * 
 * Génère automatiquement les URLs avec la locale actuelle pour éviter
 * les redirections inutiles et améliorer les performances.
 * 
 * @example
 * ```tsx
 * const { link, isActive } = useLocalizedLink();
 * 
 * <Link href={link('/catalogue')}>Catalogue</Link>
 * <Link className={isActive('/catalogue') ? 'active' : ''}>...</Link>
 * ```
 */

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

export function useLocalizedLink() {
  const locale = useLocale();
  const pathname = usePathname();

  /**
   * Génère un lien localisé
   * @param href - Le chemin relatif (ex: '/catalogue', '/contact')
   * @returns Le chemin complet avec locale (ex: '/fr/catalogue', '/en/contact')
   */
  const link = (href: string): string => {
    // Si le lien commence déjà par une locale, le retourner tel quel
    if (href.match(/^\/(fr|en|es|de|it|pt)\//)) {
      return href;
    }
    
    // Si c'est un lien externe, le retourner tel quel
    if (href.startsWith('http://') || href.startsWith('https://') || 
        href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
      return href;
    }
    
    // Ajouter la locale au début du chemin
    const cleanHref = href.startsWith('/') ? href : `/${href}`;
    return `/${locale}${cleanHref}`;
  };

  /**
   * Vérifie si un lien est actif
   * @param href - Le chemin relatif à vérifier
   * @returns true si le lien correspond au pathname actuel
   */
  const isActive = (href: string): boolean => {
    const localizedPath = link(href);
    
    // Page d'accueil
    if (href === '/' || href === '') {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    
    // Autres pages
    return pathname.startsWith(localizedPath);
  };

  /**
   * Retourne les classes CSS pour un lien selon son état actif
   * @param href - Le chemin relatif
   * @param activeClass - Classes CSS si actif
   * @param inactiveClass - Classes CSS si inactif
   * @returns Les classes CSS appropriées
   */
  const linkClass = (
    href: string,
    activeClass: string = 'active',
    inactiveClass: string = ''
  ): string => {
    return isActive(href) ? activeClass : inactiveClass;
  };

  return {
    link,
    isActive,
    linkClass,
    locale,
  };
}
