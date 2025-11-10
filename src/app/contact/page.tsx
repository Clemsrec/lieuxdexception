import type { Metadata } from 'next';
import ContactFormSwitcher from '@/components/ContactFormSwitcher';
import Icon from '@/components/ui/Icon';

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
        <p className="text-xl text-secondary max-w-2xl mx-auto">
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
              <Icon type="phone" size={20} />
            </div>
            <h3 className="font-semibold mb-3">Appelez-nous</h3>
            <div className="space-y-2">
              <a 
                href="tel:+33123456789"
                className="block text-primary hover:text-primary/80 font-medium"
              >
                01 23 45 67 89
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
              <Icon type="mail" size={20} />
            </div>
            <h3 className="font-semibold mb-3">Écrivez-nous</h3>
            <div className="space-y-2">
              <a 
                href="mailto:contact@lieuxdexception.fr"
                className="block text-primary hover:text-primary/80 font-medium"
              >
                contact@lieuxdexception.fr
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
              <Icon type="mapPin" size={20} />
            </div>
            <h3 className="font-semibold mb-3">Nous rencontrer</h3>
            <div className="space-y-2">
              <p className="font-medium">Groupe Riou</p>
              <p className="text-sm text-secondary">
                123 Avenue des Champs<br />
                75008 Paris<br />
                France
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section équipe */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Une équipe dédiée à votre projet</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Nos experts vous accompagnent de A à Z pour faire de votre événement un succès.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Contact B2B */}
          <div className="venue-card text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👔</span>
            </div>
            <h3 className="font-semibold mb-2">Événements B2B</h3>
            <p className="text-sm text-secondary mb-3">
              Spécialiste des événements professionnels
            </p>
            <a 
              href="mailto:b2b@lieuxdexception.fr"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              b2b@lieuxdexception.fr
            </a>
          </div>

          {/* Contact Mariage */}
          <div className="venue-card text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon type="heart" size={24} />
            </div>
            <h3 className="font-semibold mb-2">Mariages</h3>
            <p className="text-sm text-secondary mb-3">
              Wedding planner et coordination
            </p>
            <a 
              href="mailto:mariages@lieuxdexception.fr"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              mariages@lieuxdexception.fr
            </a>
          </div>

          {/* Support technique */}
          <div className="venue-card text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon type="settings" size={24} />
            </div>
            <h3 className="font-semibold mb-2">Support technique</h3>
            <p className="text-sm text-secondary mb-3">
              Audiovisuel et logistique
            </p>
            <a 
              href="mailto:support@lieuxdexception.fr"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              support@lieuxdexception.fr
            </a>
          </div>
        </div>
      </section>

      {/* Call-to-action urgence */}
      <section className="bg-primary text-white p-8 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">
          ⚡ Événement en urgence ?
        </h2>
        <p className="text-primary-foreground/90 mb-6 max-w-xl mx-auto">
          Besoin d&apos;organiser un événement dans les prochaines semaines ? 
          Notre équipe d&apos;urgence est disponible 7j/7.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="tel:+33612345678"
            className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            📱 Urgence : 06 12 34 56 78
          </a>
          <a 
            href="mailto:urgence@lieuxdexception.fr"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors border border-primary-400"
          >
            ⚡ urgence@lieuxdexception.fr
          </a>
        </div>
        <p className="text-xs text-primary-foreground/70 mt-4">
          Disponible 7j/7 de 8h à 22h
        </p>
      </section>

    </div>
  );
}