import type { Metadata } from 'next';
import Icon from '@/components/ui/Icon';

/**
 * Métadonnées pour la page Événements B2B
 * Page dédiée aux événements professionnels dans les lieux d'exception
 */
export const metadata: Metadata = {
  title: 'Événements B2B | Lieux d\'Exception - Groupe Riou',
  description: 'Organisez vos séminaires, conférences et événements corporate dans nos lieux d\'exception. Solutions complètes pour entreprises.',
  keywords: 'événements B2B, séminaires, conférences, corporate, team building, réunions',
};

/**
 * Page Événements B2B
 * 
 * Cette page présente les services et solutions pour les événements
 * professionnels dans les 5 lieux d'exception du Groupe Riou.
 */
export default function EvenementsB2BPage() {
  return (
    <div className="section-container py-12">
      
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-balance mb-6">
          Événements B2B d&apos;Exception
        </h1>
        <p className="text-xl text-secondary max-w-4xl mx-auto mb-8">
          Transformez vos événements professionnels en expériences mémorables 
          dans nos lieux d&apos;exception soigneusement sélectionnés en France.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary text-lg px-8 py-3">
            Demander un devis
          </button>
          <button className="border border-border px-8 py-3 rounded-lg hover:bg-muted transition-colors">
            Voir le catalogue
          </button>
        </div>
      </div>

      {/* Types d'événements */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Tous vos événements professionnels
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Séminaires */}
          <div className="venue-card text-center">
            <div className="flex justify-center mb-4">
              <Icon type="barChart" size={40} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Séminaires</h3>
            <p className="text-secondary text-sm mb-4">
              Formations, réunions stratégiques et sessions de travail 
              dans un cadre inspirant.
            </p>
            <ul className="text-xs space-y-1 text-secondary">
              <li>• Salles équipées</li>
              <li>• Matériel audiovisuel</li>
              <li>• Pauses et restauration</li>
            </ul>
          </div>

                    {/* Conférences */}
          <div className="venue-card text-center">
            <div className="flex justify-center mb-4">
              <Icon type="mic" size={40} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Conférences</h3>
            <p className="text-secondary text-sm mb-4">
              Présentations, keynotes et événements de grande envergure 
              pour marquer les esprits.
            </p>
            <ul className="text-xs space-y-1 text-secondary">
              <li>• Amphithéâtres</li>
              <li>• Sonorisation pro</li>
              <li>• Streaming possible</li>
            </ul>
          </div>

          {/* Team Building */}
          <div className="venue-card text-center">
            <div className="flex justify-center mb-4">
              <Icon type="users2" size={40} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Team Building</h3>
            <p className="text-secondary text-sm mb-4">
              Renforcez la cohésion d&apos;équipe avec des activités 
              dans des lieux extraordinaires.
            </p>
            <ul className="text-xs space-y-1 text-secondary">
              <li>• Espaces extérieurs</li>
              <li>• Activités sur mesure</li>
              <li>• Animations</li>
            </ul>
          </div>

          {/* Événements Corporate */}
          <div className="venue-card text-center">
            <div className="flex justify-center mb-4">
              <Icon type="trophy" size={40} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Corporate</h3>
            <p className="text-secondary text-sm mb-4">
              Lancements produits, galas et célébrations d&apos;entreprise 
              de prestige.
            </p>
            <ul className="text-xs space-y-1 text-secondary">
              <li>• Salons de réception</li>
              <li>• Service traiteur</li>
              <li>• Décoration incluse</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="mb-16 bg-muted rounded-2xl p-8">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Pourquoi choisir nos lieux d&apos;exception ?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon type="target" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Excellence Garantie</h3>
            <p className="text-secondary">
              Lieux soigneusement sélectionnés pour leur prestige, 
              leur histoire et leurs services d&apos;exception.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon type="zap" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Service Complet</h3>
            <p className="text-secondary">
              De la planification à la réalisation, nos équipes 
              vous accompagnent pour un événement parfait.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon type="mapPin" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Emplacements Stratégiques</h3>
            <p className="text-secondary">
              Lieux accessibles dans toute la France, 
              adaptés à vos contraintes logistiques.
            </p>
          </div>
        </div>
      </section>

      {/* Services inclus */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Services inclus dans nos forfaits
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Services techniques */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 text-sm">
                <Icon type="zap" size={16} className="text-white" />
              </span>
              Services Techniques
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Icon type="check" size={16} className="text-primary mr-3 mt-1" />
                <div>
                  <strong>Équipement audiovisuel complet</strong>
                  <p className="text-secondary text-sm">Vidéoprojecteurs, sonorisation, éclairage professionnel</p>
                </div>
              </div>
              <div className="flex items-start">
                <Icon type="check" size={16} className="text-primary mr-3 mt-1" />
                <div>
                  <strong>Connexion WiFi haut débit</strong>
                  <p className="text-secondary text-sm">Internet fibre pour tous vos besoins numériques</p>
                </div>
              </div>
              <div className="flex items-start">
                <Icon type="check" size={16} className="text-primary mr-3 mt-1" />
                <div>
                  <strong>Support technique dédié</strong>
                  <p className="text-secondary text-sm">Assistance pendant tout votre événement</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Services logistiques */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <span className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center mr-3 text-sm">
                <Icon type="car" size={16} className="text-white" />
              </span>
              Services Logistiques
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Icon type="check" size={16} className="text-primary mr-3 mt-1" />
                <div>
                  <strong>Parking privatif</strong>
                  <p className="text-secondary text-sm">Stationnement sécurisé pour vos invités</p>
                </div>
              </div>
              <div className="flex items-start">
                <Icon type="check" size={16} className="text-primary mr-3 mt-1" />
                <div>
                  <strong>Accès privilégié</strong>
                  <p className="text-secondary text-sm">Entrées dédiées et signalétique personnalisée</p>
                </div>
              </div>
              <div className="flex items-start">
                <Icon type="check" size={16} className="text-primary mr-3 mt-1" />
                <div>
                  <strong>Restauration gastronomique</strong>
                  <p className="text-secondary text-sm">Pauses, déjeuners et dîners de prestige</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-primary/5 rounded-2xl p-12">
        <h2 className="text-3xl font-semibold mb-4">
          Prêt à organiser votre prochain événement ?
        </h2>
        <p className="text-secondary text-lg mb-8 max-w-2xl mx-auto">
          Contactez-nous dès maintenant pour discuter de votre projet 
          et recevoir une proposition personnalisée.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="btn-primary text-lg px-8 py-3">
            Demander un devis B2B
          </button>
          <div className="text-sm text-secondary">
            ou appelez-nous au <strong className="text-foreground">01 23 45 67 89</strong>
          </div>
        </div>
      </section>

    </div>
  );
}