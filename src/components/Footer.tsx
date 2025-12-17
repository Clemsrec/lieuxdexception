'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

/**
 * Composant Footer principal
 * 
 * Footer principal du site Lieux d'Exception avec :
 * - Informations sur le Groupe Riou
 * - Navigation principale
 * - Services proposés
 * - Coordonnées de contact
 * - Liens légaux et réseaux sociaux
 * - Traductions i18n
 * - Design responsive et accessible
 */
export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();

  return (
    <footer className="bg-muted border-t border-border mt-16">
      <div className="container-wide py-12">
        
        {/* Contenu principal du footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-8">
          
          {/* Informations principales sur Lieux d'Exception */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="inline-block mb-4 hover:opacity-80 transition-opacity shrink-0">
              <Image
                src="/logo/Logo_CLE_avec Texte.png"
                alt="Lieux d'Exception"
                width={140}
                height={40}
                className="h-8 w-auto max-w-[140px]"
                style={{ maxWidth: '140px', maxHeight: '40px', width: 'auto', height: 'auto', objectFit: 'contain' }}
              />
            </Link>
            <p className="text-secondary text-sm mb-4 leading-relaxed">
              5 lieux événementiels d&apos;exception en France pour vos séminaires, 
              mariages et événements corporate.
            </p>
          </div>

          {/* Navigation principale */}
          <div>
            <h4 className="font-medium mb-4 text-foreground">{t('navigation')}</h4>
            <nav>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link 
                    href={`/${locale}/evenements-b2b`}
                    className="text-secondary hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-secondary rounded-full mr-2 group-hover:bg-primary transition-colors"></span>
                    Séminaires & Pro
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${locale}/mariages`}
                    className="text-secondary hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-secondary rounded-full mr-2 group-hover:bg-primary transition-colors"></span>
                    Mariages & Privés
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${locale}/contact`}
                    className="text-secondary hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-secondary rounded-full mr-2 group-hover:bg-primary transition-colors"></span>
                    {t('contact')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Nos Lieux */}
          <div>
            <h4 className="font-medium mb-4 text-foreground">Nos Lieux</h4>
            <nav>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link 
                    href={`/${locale}/lieux/chateau-brulaire`}
                    className="text-secondary hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-secondary rounded-full mr-2 group-hover:bg-primary transition-colors"></span>
                    Le Château de la Brûlaire
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${locale}/lieux/chateau-corbe`}
                    className="text-secondary hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-secondary rounded-full mr-2 group-hover:bg-primary transition-colors"></span>
                    Le Château de la Corbe
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${locale}/lieux/domaine-nantais`}
                    className="text-secondary hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-secondary rounded-full mr-2 group-hover:bg-primary transition-colors"></span>
                    Le Domaine Nantais
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${locale}/lieux/manoir-boulaie`}
                    className="text-secondary hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-secondary rounded-full mr-2 group-hover:bg-primary transition-colors"></span>
                    Le Manoir de la Boulaie
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${locale}/lieux/le-dome`}
                    className="text-secondary hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-secondary rounded-full mr-2 group-hover:bg-primary transition-colors"></span>
                    Le Dôme
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Services et prestations */}
          <div>
            <h4 className="font-medium mb-4 text-foreground">{t('services')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="text-primary mr-2 mt-1 font-bold">•</span>
                <span className="text-secondary">Séminaires & Conférences</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2 mt-1 font-bold">•</span>
                <span className="text-secondary">Mariages & Réceptions</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2 mt-1 font-bold">•</span>
                <span className="text-secondary">Événements Corporate</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2 mt-1 font-bold">•</span>
                <span className="text-secondary">Hébergement & Restauration</span>
              </li>
            </ul>
          </div>

          {/* Contact et coordonnées */}
          <div>
            <h4 className="font-medium mb-4 text-foreground">Contact</h4>
            <div className="space-y-4 text-sm">
              
              {/* Téléphone Pro */}
              <div className="flex items-start">
                <span className="text-primary mr-2 mt-1 font-medium">•</span>
                <div>
                  <p className="text-xs text-secondary/70 mb-1">Événements Pro</p>
                  <a 
                    href="tel:0670562879"
                    className="text-secondary hover:text-primary transition-colors"
                  >
                    <strong className="text-foreground">06 70 56 28 79</strong>
                  </a>
                </div>
              </div>

              {/* Téléphone Mariages/Privés */}
              <div className="flex items-start">
                <span className="text-primary mr-2 mt-1 font-medium">•</span>
                <div>
                  <p className="text-xs text-secondary/70 mb-1">Mariages & Privés</p>
                  <a 
                    href="tel:0602037011"
                    className="text-secondary hover:text-primary transition-colors"
                  >
                    <strong className="text-foreground">06 02 03 70 11</strong>
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <span className="text-primary mr-2 mt-1 font-medium">•</span>
                <div>
                  <a 
                    href="mailto:contact@lieuxdexception.com"
                    className="text-secondary hover:text-primary transition-colors"
                  >
                    <strong>contact@lieuxdexception.com</strong>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Réseaux sociaux site-wide */}
          <div>
            <h4 className="font-medium mb-4 text-foreground">Réseaux</h4>
            <div className="space-y-2 text-sm">
              <a
                href="https://www.instagram.com/lieuxdexception/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors block"
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/in/lieux-d-exception-248b15353/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-primary transition-colors block"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            {/* Copyright et mentions légales */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="text-secondary text-sm">
                © 2024 Lieux d&apos;Exception. {t('allRightsReserved')}
              </p>
              <div className="flex flex-wrap gap-4 text-xs">
                <Link 
                  href={`/${locale}/mentions-legales`}
                  className="text-secondary hover:text-primary transition-colors"
                >
                  {t('legal')}
                </Link>
                <Link 
                  href={`/${locale}/confidentialite`}
                  className="text-secondary hover:text-primary transition-colors"
                >
                  {t('privacy')}
                </Link>
                <Link 
                  href={`/${locale}/cookies`}
                  className="text-secondary hover:text-primary transition-colors"
                >
                  {t('cookies')}
                </Link>
                <Link 
                  href={`/${locale}/cgv`}
                  className="text-secondary hover:text-primary transition-colors"
                >
                  {t('cgv')}
                </Link>
              </div>
            </div>

            {/* Accès admin discret */}
            <div>
              <Link
                href="/admin/connexion"
                className="text-secondary/40 hover:text-primary transition-colors text-xs"
                title="Administration"
              >
                ⚙️
              </Link>
            </div>
          </div>
        </div>

        {/* Back to top */}
        <div className="text-center pt-6">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-secondary hover:text-primary transition-colors text-sm group flex items-center mx-auto"
            aria-label="Retour en haut de page"
          >
            <span className="group-hover:animate-bounce mr-1">↑</span>
            <span>Retour en haut</span>
          </button>
        </div>
      </div>
    </footer>
  );
}