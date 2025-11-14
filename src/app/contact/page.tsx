import type { Metadata } from 'next';
import ContactFormSwitcher from '@/components/ContactFormSwitcher';

/**
 * Métadonnées pour la page Contact
 * Page de contact principale avec formulaires B2B et mariage
 */
export const metadata: Metadata = {
  title: 'Contact | Lieux d\'Exception - Groupe Riou',
  description: 'Contactez Lieux d\'Exception pour organiser vos événements professionnels et mariages dans nos domaines prestigieux. Devis personnalisé et accompagnement sur-mesure.',
  keywords: ['contact lieux exception', 'devis mariage', 'événement entreprise', 'groupe riou contact'],
  openGraph: {
    title: 'Contact - Lieux d\'Exception',
    description: 'Organisez vos événements dans nos lieux d\'exception. Contactez-nous pour un devis personnalisé.',
  },
};

/**
 * Page Contact
 * 
 * Page principale de contact avec :
 * - Formulaires adaptatifs (B2B, mariage, contact rapide)
 * - Informations de contact
 * - Localisation des bureaux
 * - Call-to-action pour prise de contact directe
 */
export default function ContactPage() {
  return (
    <div className="section-container py-12">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
        <p className="text-xl text-secondary">
          Que ce soit pour un événement professionnel ou un mariage, 
          notre équipe vous accompagne pour créer des moments inoubliables.
        </p>
      </div>

      {/* Formulaires */}
      <section className="mb-16">
        <ContactFormSwitcher />
      </section>

      {/* Informations de contact */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coordonnées principales */}
          <div className="venue-card text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              
            </div>
            <h3 className="font-semibold mb-3">Appelez-nous</h3>
            <div className="space-y-2">
              <a 
                href="tel:+33602037011"
                className="block text-primary hover:text-primary/80 font-medium"
              >
                06 02 03 70 11
              </a>
              <p className="text-sm text-secondary">
                Du lundi au vendredi<br />
                9h - 18h
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="venue-card text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              
            </div>
            <h3 className="font-semibold mb-3">Écrivez-nous</h3>
            <div className="space-y-2">
              <a 
                href="mailto:contact@lieuxdexception.com"
                className="block text-primary hover:text-primary/80 font-medium"
              >
                contact@lieuxdexception.com
              </a>
              <p className="text-sm text-secondary">
                Réponse sous 2h<br />
                en journée
              </p>
            </div>
          </div>

          {/* Localisation */}
          <div className="venue-card text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              
            </div>
            <h3 className="font-semibold mb-3">Nous rencontrer</h3>
            <div className="space-y-2">
              <p className="font-medium">Lieux d&apos;Exception</p>
              <p className="text-sm text-secondary">
                Loire-Atlantique<br />
                Pays de la Loire<br />
                France
              </p>
            </div>
          </div>
        </div>
      </section>





    </div>
  );
}