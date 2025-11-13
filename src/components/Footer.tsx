'use client';

import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';

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
      <div className="section-container py-12">
        
        {/* Contenu principal du footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Informations principales sur Lieux d'Exception */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
              <Image
                src="/logo/Logo_CLE_avec Texte.png"
                alt="Lieux d'Exception"
                width={180}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-secondary text-sm mb-4 leading-relaxed">
              Le catalogue B2B du Groupe Riou présentant 5 lieux événementiels 
              d&apos;exception en France pour vos séminaires, mariages et événements corporate.
            </p>
            <p className="text-secondary text-sm font-medium">
              Excellence événementielle depuis 1995
            </p>
            
            {/* Logo ou badge qualité */}
            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-xs text-primary font-medium flex items-center">
                <Icon type="trophy" size={14} className="text-primary mr-2" aria-label="Certification" />
                Membre du réseau Châteaux & Hôtels Collection
              </p>
            </div>
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
                <span className="text-primary mr-2 mt-1">🏢</span>
                <div>
                  <span className="text-secondary block">Séminaires & Conférences</span>
                  <span className="text-xs text-secondary/70">10 à 500 participants</span>
                </div>
              </li>
              <li className="flex items-start">
                <Icon type="heart" size={16} className="text-primary mr-2 mt-1" aria-label="Mariages" />
                <div>
                  <span className="text-secondary block">Mariages & Réceptions</span>
                  <span className="text-xs text-secondary/70">50 à 300 invités</span>
                </div>
              </li>
              <li className="flex items-start">
                <Icon type="target" size={16} className="text-primary mr-2 mt-1" aria-label="Événements corporate" />
                <div>
                  <span className="text-secondary block">Événements Corporate</span>
                  <span className="text-xs text-secondary/70">Team building, galas</span>
                </div>
              </li>
              <li className="flex items-start">
                <Icon type="building" size={16} className="text-primary mr-2 mt-1" aria-label="Hébergement" />
                <div>
                  <span className="text-secondary block">Hébergement & Restauration</span>
                  <span className="text-xs text-secondary/70">Service complet</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact et coordonnées */}
          <div>
            <h4 className="font-medium mb-4 text-foreground">Contact</h4>
            <div className="space-y-4 text-sm">
              
              {/* Téléphone */}
              <div className="flex items-start">
                <Icon type="phone" size={16} className="text-primary mr-2 mt-1" aria-label="Téléphone" />
                <div>
                  <p className="text-secondary">
                    <strong className="text-foreground">01 23 45 67 89</strong>
                  </p>
                  <p className="text-xs text-secondary/70">
                    Lun-Ven : 9h-18h
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <Icon type="mail" size={16} className="text-primary mr-2 mt-1" aria-label="Email" />
                <div>
                  <a 
                    href="mailto:contact@lieuxdexception.fr"
                    className="text-secondary hover:text-primary transition-colors"
                  >
                    <strong>contact@lieuxdexception.fr</strong>
                  </a>
                  <p className="text-xs text-secondary/70">
                    Réponse sous 2h en journée
                  </p>
                </div>
              </div>

              {/* Adresse */}
              <div className="flex items-start">
                <Icon type="mapPin" size={16} className="text-primary mr-2 mt-1" aria-label="Adresse" />
                <div>
                  <p className="text-secondary">
                    <strong className="text-foreground">Groupe Riou</strong><br />
                    123 Avenue des Champs<br />
                    75008 Paris, France
                  </p>
                </div>
              </div>

              {/* CTA urgence */}
              <div className="mt-4 p-3 bg-accent/5 rounded-lg border border-accent/10">
                <p className="text-xs text-accent font-medium mb-1 flex items-center">
                  <Icon type="zap" size={12} className="text-accent mr-1" aria-label="Urgence" />
                  Événement en urgence ?
                </p>
                <a 
                  href="tel:+33612345678"
                  className="text-xs text-accent hover:text-accent/80 transition-colors font-medium"
                >
                  06 12 34 56 78 (7j/7)
                </a>
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

            {/* Réseaux sociaux et certifications */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              
              {/* Réseaux sociaux */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-secondary">Suivez-nous :</span>
                <div className="flex gap-2">
                  <a 
                    href="https://linkedin.com/company/groupe-riou" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-secondary/10 hover:bg-primary/10 rounded-full flex items-center justify-center transition-colors group"
                    aria-label="LinkedIn Groupe Riou"
                  >
                    <Icon type="briefcase" size={14} className="group-hover:text-primary transition-colors" aria-label="LinkedIn" />
                  </a>
                  <a 
                    href="https://instagram.com/lieuxdexception" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-secondary/10 hover:bg-primary/10 rounded-full flex items-center justify-center transition-colors group"
                    aria-label="Instagram Lieux d'Exception"
                  >
                    <Icon type="instagram" size={14} className="group-hover:text-primary transition-colors" aria-label="Instagram" />
                  </a>
                  <a 
                    href="https://facebook.com/lieuxdexception" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-secondary/10 hover:bg-primary/10 rounded-full flex items-center justify-center transition-colors group"
                    aria-label="Facebook Lieux d'Exception"
                  >
                    <Icon type="facebook" size={14} className="group-hover:text-primary transition-colors" aria-label="Facebook" />
                  </a>
                </div>
              </div>

              {/* Certifications */}
              <div className="flex items-center gap-2 text-xs text-secondary">
                <Icon type="trophy" size={14} className="text-secondary" aria-label="Certification" />
                <span>Certifié Qualité Tourisme</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to top */}
        <div className="text-center pt-6">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-secondary hover:text-primary transition-colors text-sm group flex items-center"
            aria-label="Retour en haut de page"
          >
            <Icon type="arrowUp" size={16} className="group-hover:animate-bounce mr-1" aria-label="Flèche vers le haut" />
            <span>Retour en haut</span>
          </button>
        </div>
      </div>

      {/* Section légale */}
      <div className="border-t border-border bg-muted/30">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-sm text-secondary">
                © 2024 Lieux d&apos;Exception - Groupe Riou. Tous droits réservés.
              </p>
              <p className="text-xs text-secondary/70 mt-1">
                SIRET : 12345678901234 | RCS Paris B 123 456 789
              </p>
            </div>

            {/* Liens légaux */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-4 text-sm text-secondary">
              <Link 
                href="/mentions-legales" 
                className="hover:text-primary transition-colors"
              >
                Mentions légales
              </Link>
              <Link 
                href="/confidentialite" 
                className="hover:text-primary transition-colors"
              >
                Confidentialité
              </Link>
              <Link 
                href="/cookies" 
                className="hover:text-primary transition-colors"
              >
                Cookies
              </Link>
              <Link 
                href="/cgv" 
                className="hover:text-primary transition-colors"
              >
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}