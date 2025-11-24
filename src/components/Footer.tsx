'use client';

import Link from 'next/link';
import Image from 'next/image';

/**
 * Composant Footer principal
 * 
 * Footer principal du site Lieux d'Exception avec :
 * - Informations sur le Groupe Riou
 * - Navigation principale
 * - Services proposés
 * - Coordonnées de contact
 * - Liens légaux et réseaux sociaux
 * - Design responsive et accessible
 */
export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border mt-16">
      <div className="header-footer-container py-12">
        
        {/* Contenu principal du footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Informations principales sur Lieux d'Exception */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity shrink-0">
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
              Le catalogue B2B du Groupe Riou présentant 5 lieux événementiels 
              d&apos;exception en France pour vos séminaires, mariages et événements corporate.
            </p>
            <p className="text-secondary text-sm font-medium">
              Excellence événementielle depuis 1995
            </p>
          </div>

          {/* Navigation principale */}
          <div>
            <h4 className="font-medium mb-4 text-foreground">Navigation</h4>
            <nav>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link 
                    href="/catalogue" 
                    className="text-secondary hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-secondary rounded-full mr-2 group-hover:bg-primary transition-colors"></span>
                    Catalogue des lieux
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/evenements-b2b" 
                    className="text-secondary hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-secondary rounded-full mr-2 group-hover:bg-primary transition-colors"></span>
                    Événements B2B
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/mariages" 
                    className="text-secondary hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-secondary rounded-full mr-2 group-hover:bg-primary transition-colors"></span>
                    Mariages d&apos;exception
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="text-secondary hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-secondary rounded-full mr-2 group-hover:bg-primary transition-colors"></span>
                    Contact & Devis
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Services et prestations */}
          <div>
            <h4 className="font-medium mb-4 text-foreground">Nos Services</h4>
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
              
              {/* Téléphone */}
              <div className="flex items-start">
                <span className="text-primary mr-2 mt-1 font-medium">Tel :</span>
                <div>
                  <p className="text-secondary">
                    <strong className="text-foreground">06 02 03 70 11</strong>
                  </p>
                  <p className="text-xs text-secondary/70">
                    Lun-Ven : 9h-18h
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <span className="text-primary mr-2 mt-1 font-medium">Email :</span>
                <div>
                  <a 
                    href="mailto:contact@lieuxdexception.com"
                    className="text-secondary hover:text-primary transition-colors"
                  >
                    <strong>contact@lieuxdexception.com</strong>
                  </a>
                  <p className="text-xs text-secondary/70">
                    Réponse sous 2h en journée
                  </p>
                </div>
              </div>

              {/* Localisation */}
              <div className="flex items-start">
                <span className="text-primary mr-2 mt-1">📍</span>
                <div>
                  <p className="text-secondary">
                    <strong className="text-foreground">Loire-Atlantique</strong><br />
                    Pays de la Loire<br />
                    France
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            {/* Copyright et mentions légales */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="text-secondary text-sm">
                © 2024 Groupe Riou - Lieux d&apos;Exception. Tous droits réservés.
              </p>
              <div className="flex flex-wrap gap-4 text-xs">
                <Link 
                  href="/mentions-legales" 
                  className="text-secondary hover:text-primary transition-colors"
                >
                  Mentions légales
                </Link>
                <Link 
                  href="/confidentialite" 
                  className="text-secondary hover:text-primary transition-colors"
                >
                  Confidentialité
                </Link>
                <Link 
                  href="/cookies" 
                  className="text-secondary hover:text-primary transition-colors"
                >
                  Cookies
                </Link>
                <Link 
                  href="/cgv" 
                  className="text-secondary hover:text-primary transition-colors"
                >
                  CGV
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