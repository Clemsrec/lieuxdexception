import type { Metadata } from 'next';
import Image from 'next/image';

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
    <div>
      
      {/* Hero Section */}
      <section className="hero-section relative">
        <Image
          src="/images/salle-seminaire.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="hero-content">
          <h1 className="hero-title">
            Événements Professionnels d&apos;Exception
          </h1>
          <div className="accent-line" />
          <p className="hero-subtitle">
            Et si vos événements professionnels devenaient… tout simplement exceptionnels ?
          </p>
          <p className="text-white/90 text-lg mb-4" style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.4)' }}>
            Implantés en Loire-Atlantique, nous transformons chaque moment d&apos;entreprise en une expérience rare, mémorable et profondément marquante.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary">
              Demander un devis
            </button>
            <button className="btn-secondary" style={{ color: 'white', borderColor: 'white' }}>
              Voir le catalogue
            </button>
          </div>
        </div>
      </section>

      <div className="section-container py-12">

      {/* Ce que nous vous offrons */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-8">
            Ce que nous vous offrons, c&apos;est l&apos;exception sous toutes ses formes
          </h2>
          <div className="accent-line" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Une émotion d'exception */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-primary flex items-center">
              <div className="w-20 h-px bg-accent/40 mr-4" />
              Une émotion d&apos;exception
            </h3>
            <p className="text-secondary leading-relaxed">
              Parce qu&apos;un séminaire, un lancement de produit ou un comité de direction ne devraient jamais laisser indifférent. 
              Chaque lieu est pensé comme support au service de votre message et de l&apos;expérience que vous souhaitez faire vivre. 
              Il devient un levier stratégique pour renforcer l&apos;impact de vos événements et suscite une véritable connexion émotionnelle.
            </p>
          </div>

          {/* Un service d'exception */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-primary flex items-center">
              <div className="w-20 h-px bg-accent/40 mr-4" />
              Un service d&apos;exception
            </h3>
            <p className="text-secondary leading-relaxed">
              Véritable soutien opérationnel aux entreprises, notre accompagnement est sur mesure : une expertise de plus de 20 ans en accueil et service événementiels, 
              des partenaires sélectionnés au fil des années, un coordinateur unique à la fois administratif et technique copilote avec vous l&apos;ensemble de votre projet 
              pour garantir efficacité, cohérence et tenue des objectifs.
            </p>
          </div>

          {/* Des lieux d'exception */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-primary flex items-center">
              <div className="w-20 h-px bg-accent/40 mr-4" />
              Des lieux d&apos;exception
            </h3>
            <p className="text-secondary leading-relaxed">
              Manoirs réhabilités, domaines confidentiels, espaces atypiques, parcs paysagés… Nos lieux offrent des conditions idéales pour accueillir vos réunions, 
              sublimer vos cocktails ou animer journées d&apos;équipe. Entièrement privatisables et modulables, ces lieux sont conçus pour s&apos;adapter à vos objectifs.
            </p>
          </div>
        </div>
      </section>

      {/* Types d'événements */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Tous vos événements professionnels
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Séminaires */}
          <div className="venue-card text-center">
            <div className="font-display text-6xl text-accent/20 font-light mb-6">I</div>
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
            <div className="font-display text-6xl text-accent/20 font-light mb-6">II</div>
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
            <div className="font-display text-6xl text-accent/20 font-light mb-6">III</div>
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
            <div className="font-display text-6xl text-accent/20 font-light mb-6">IV</div>
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

      {/* Une expérience d'exception pour vos équipes */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-8">
            Une expérience d&apos;exception pour vos équipes et vos clients
          </h2>
          <div className="accent-line" />
          <p className="text-secondary text-lg mt-6">
            Dans un environnement professionnel en constante évolution, il est essentiel de proposer des événements qui ont du sens et de l&apos;impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-subtle">
            <h3 className="text-xl font-semibold mb-4 text-primary">Marquer les esprits</h3>
            <p className="text-secondary leading-relaxed">
              Des lieux conçus pour <strong>marquer les esprits, valoriser votre image et créer une vraie connexion humaine.</strong>
            </p>
          </div>

          <div className="card-subtle">
            <h3 className="text-xl font-semibold mb-4 text-primary">Environnements propices</h3>
            <p className="text-secondary leading-relaxed">
              Des environnements propices à la <strong>cohésion, à la créativité ou à la prise de recul,</strong> loin des lieux standardisés.
            </p>
          </div>

          <div className="card-subtle">
            <h3 className="text-xl font-semibold mb-4 text-primary">Liberté totale</h3>
            <p className="text-secondary leading-relaxed">
              Une <strong>liberté totale de création :</strong> nos lieux sont ouverts aux formats les plus audacieux, des plus confidentiels aux plus immersifs.
            </p>
          </div>

          <div className="card-subtle">
            <h3 className="text-xl font-semibold mb-4 text-primary">Équipe passionnée</h3>
            <p className="text-secondary leading-relaxed">
              Une <strong>équipe de passionnés à vos côtés,</strong> qui aime repousser les limites du brief et aller au-delà des attentes initiales.
            </p>
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
            <div className="text-5xl text-primary/30 mb-4">◆</div>
            <h3 className="text-xl font-semibold mb-3">Excellence Garantie</h3>
            <p className="text-secondary">
              Lieux soigneusement sélectionnés pour leur prestige, 
              leur histoire et leurs services d&apos;exception.
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl text-accent/30 mb-4">✦</div>
            <h3 className="text-xl font-semibold mb-3">Service Complet</h3>
            <p className="text-secondary">
              De la planification à la réalisation, nos équipes 
              vous accompagnent pour un événement parfait.
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl text-secondary/30 mb-4">●</div>
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
              <div className="w-20 h-px bg-accent/40 mr-4" />
              Services Techniques
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
                <div>
                  <strong>Équipement audiovisuel complet</strong>
                  <p className="text-secondary text-sm">Vidéoprojecteurs, sonorisation, éclairage professionnel</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
                <div>
                  <strong>Connexion WiFi haut débit</strong>
                  <p className="text-secondary text-sm">Internet fibre pour tous vos besoins numériques</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
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
              <div className="w-20 h-px bg-accent/40 mr-4" />
              Services Logistiques
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
                <div>
                  <strong>Parking privatif</strong>
                  <p className="text-secondary text-sm">Stationnement sécurisé pour vos invités</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
                <div>
                  <strong>Accès privilégié</strong>
                  <p className="text-secondary text-sm">Entrées dédiées et signalétique personnalisée</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
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
          Êtes-vous prêt à vivre l&apos;exception ?
        </h2>
        <p className="text-secondary text-lg mb-2">
          <strong>Lieux d&apos;Exception, c&apos;est plus qu&apos;un service événementiel :</strong>
        </p>
        <p className="text-secondary text-lg mb-8">
          c&apos;est une promesse de singularité, une invitation à l&apos;émotion, une exigence de qualité.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="btn-primary">
            Nous contacter
          </button>
          <div className="text-sm text-secondary">
            <p><strong className="text-foreground">Téléphone :</strong> 06 02 03 70 11</p>
            <p><strong className="text-foreground">Email :</strong> contact@lieuxdexception.com</p>
          </div>
        </div>
      </section>

      </div>
    </div>
  );
}