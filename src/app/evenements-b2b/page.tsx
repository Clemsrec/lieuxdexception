import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

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
            Événements Professionnels
          </h1>
          <div className="accent-line" />
          <p className="hero-subtitle">
            Et si vos événements professionnels devenaient… tout simplement exceptionnels ?
          </p>
          <p className="text-white/90 text-lg mb-4" style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.4)' }}>
            Implantés en Loire-Atlantique, nous transformons chaque moment d&apos;entreprise en une expérience rare, mémorable et profondément marquante.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/contact" className="btn-primary">
              Demander un devis
            </Link>
            <Link href="/catalogue" className="btn-secondary" style={{ color: 'white', borderColor: 'white' }}>
              Voir le catalogue
            </Link>
          </div>
        </div>
      </section>

      <div className="section-container py-12">

      {/* Ce que nous vous offrons */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">
            Ce que nous vous offrons
          </h2>
          <div className="accent-line" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Une émotion d'éveil */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-primary flex items-center">
              <div className="w-12 md:w-20 h-px bg-accent/40 mr-3 md:mr-4 shrink-0" />
              Une émotion d’éveil
            </h3>
            <p className="text-secondary leading-relaxed">
              Parce qu&apos;un séminaire, un lancement de produit ou un comité de direction ne devraient jamais laisser indifférent. 
              Chaque lieu est pensé comme support au service de votre message et de l&apos;expérience que vous souhaitez faire vivre. 
              Il devient un levier stratégique pour renforcer l&apos;impact de vos événements et suscite une véritable connexion émotionnelle.
            </p>
          </div>

          {/* Un service d'excellence */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-primary flex items-center">
              <div className="w-12 md:w-20 h-px bg-accent/40 mr-3 md:mr-4 shrink-0" />
              Un service d’excellence
            </h3>
            <p className="text-secondary leading-relaxed">
              Véritable soutien opérationnel aux entreprises, notre accompagnement est sur mesure : une expertise de plus de 20 ans en accueil et service événementiels, 
              des partenaires sélectionnés au fil des années, un coordinateur unique à la fois administratif et technique copilote avec vous l&apos;ensemble de votre projet 
              pour garantir efficacité, cohérence et tenue des objectifs.
            </p>
          </div>

          {/* Des lieux inspirés */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-primary flex items-center">
              <div className="w-12 md:w-20 h-px bg-accent/40 mr-3 md:mr-4 shrink-0" />
              Des lieux inspirés
            </h3>
            <p className="text-secondary leading-relaxed">
              Manoirs réhabilités, domaines confidentiels, espaces atypiques, parcs paysagés… Nos lieux offrent des conditions idéales pour accueillir vos réunions, 
              sublimer vos cocktails ou animer journées d&apos;équipe. Entièrement privatisables et modulables, ces lieux sont conçus pour s&apos;adapter à vos objectifs.
            </p>
          </div>
        </div>
      </section>

      {/* Une expérience pour vos équipes */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8">
            Une expérience pour vos équipes et vos clients
          </h2>
          <div className="accent-line" />
          <p className="text-secondary text-base md:text-lg mt-6">
            Dans un environnement professionnel en constante évolution, il est essentiel de proposer des événements qui ont du sens et de l&apos;impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="card-subtle">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-primary">Marquer les esprits</h3>
            <p className="text-secondary leading-relaxed">
              Des lieux conçus pour <strong>marquer les esprits, valoriser votre image et créer une vraie connexion humaine.</strong>
            </p>
          </div>

          <div className="card-subtle">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-primary">Environnements propices</h3>
            <p className="text-secondary leading-relaxed">
              Des environnements propices à la <strong>cohésion, à la créativité ou à la prise de recul,</strong> loin des lieux standardisés.
            </p>
          </div>

          <div className="card-subtle">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-primary">Liberté totale</h3>
            <p className="text-secondary leading-relaxed">
              Une <strong>liberté totale de création :</strong> nos lieux sont ouverts aux formats les plus audacieux, des plus confidentiels aux plus immersifs.
            </p>
          </div>

          <div className="card-subtle">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-primary">Équipe passionnée</h3>
            <p className="text-secondary leading-relaxed">
              Une <strong>équipe de passionnés à vos côtés,</strong> qui aime repousser les limites du brief et aller au-delà des attentes initiales.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-primary/5 rounded-2xl p-6 md:p-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Êtes-vous prêt à vivre cette expérience ?
        </h2>
        <p className="text-secondary text-base md:text-lg mb-2">
          <strong>Lieux d&apos;Exception, c&apos;est plus qu&apos;un service événementiel :</strong>
        </p>
        <p className="text-secondary text-base md:text-lg mb-8">
          c&apos;est une promesse de singularité, une invitation à l&apos;émotion, une exigence de qualité.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/contact" className="btn-primary">
            Nous contacter
          </Link>
          <div className="text-sm md:text-base text-secondary">
            <p><strong className="text-foreground">Téléphone :</strong> <a href="tel:0602037011" className="hover:text-primary transition-colors">06 02 03 70 11</a></p>
            <p><strong className="text-foreground">Email :</strong> <a href="mailto:contact@lieuxdexception.com" className="hover:text-primary transition-colors">contact@lieuxdexception.com</a></p>
          </div>
        </div>
      </section>

      </div>
    </div>
  );
}