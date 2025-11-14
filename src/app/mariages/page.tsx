import type { Metadata } from 'next';
import Image from 'next/image';

/**
 * Métadonnées pour la page Mariages
 * Page dédiée aux réceptions de mariage dans les lieux d'exception
 */
export const metadata: Metadata = {
  title: 'Mariages d\'Exception | Lieux d\'Exception - Groupe Riou',
  description: 'Célébrez votre mariage dans nos lieux d\'exception en France. Châteaux, domaines et espaces romantiques pour un jour unique.',
  keywords: 'mariage, réception, château, domaine, wedding, cérémonie, romantique',
};

/**
 * Page Mariages
 * 
 * Cette page présente les services et solutions pour les mariages
 * dans les 5 lieux d'exception du Groupe Riou.
 */
export default function MariagesPage() {
  return (
    <div>
      
      {/* Hero Section */}
      <section className="hero-section relative">
        <Image
          src="/images/table-seminaire.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="hero-content">
          <h1 className="hero-title">
            Mariages d&apos;Exception
          </h1>
          <div className="accent-line" />
          <p className="hero-subtitle">
            Parce que l&apos;émotion se vit pleinement lorsqu&apos;elle trouve son Lieu d&apos;Exception.
          </p>
          <p className="text-white/90 text-lg mb-4" style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.4)' }}>
            Des domaines où se mêlent beauté, sincérité et art de recevoir pour célébrer le plus beau jour de votre vie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary">
              Demander un devis mariage
            </button>
            <button className="btn-secondary" style={{ color: 'white', borderColor: 'white' }}>
              Voir nos lieux
            </button>
          </div>
        </div>
      </section>

      <div className="section-container py-12">

      {/* Lieux d'Exception, une signature d'émotion */}
      <section className="mb-16">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-8">
            Lieux d&apos;Exception, une signature d&apos;émotion
          </h2>
          <div className="accent-line" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="font-display text-5xl text-accent/30 font-light">01</div>
              <h3 className="text-xl font-semibold">Rencontres personnalisées</h3>
            </div>
            <p className="text-secondary leading-relaxed">
              Rencontres et échanges personnalisés pour comprendre vos envies et imaginer une réception à votre image.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="font-display text-5xl text-accent/30 font-light">02</div>
              <h3 className="text-xl font-semibold">Organisation & Coordination</h3>
            </div>
            <p className="text-secondary leading-relaxed">
              Accompagnement dans l&apos;organisation et la coordination de votre événement, du choix des espaces à la mise en scène du grand jour.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="font-display text-5xl text-accent/30 font-light">03</div>
              <h3 className="text-xl font-semibold">Réseau de partenaires sélectionnés</h3>
            </div>
            <p className="text-secondary leading-relaxed">
              Accès à un réseau de partenaires sélectionnés : traiteurs, décorateurs, fleuristes, photographes… tous choisis pour leur exigence et leur sens du service.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="font-display text-5xl text-accent/30 font-light">04</div>
              <h3 className="text-xl font-semibold">Mise à disposition exclusive</h3>
            </div>
            <p className="text-secondary leading-relaxed">
              Mise à disposition exclusive de domaines pour vos événements.
            </p>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="text-center bg-primary/5 rounded-2xl p-12">
        <h2 className="text-3xl font-semibold mb-4">
          Parce que l&apos;émotion se vit pleinement lorsqu&apos;elle trouve son Lieu d&apos;Exception
        </h2>
        <p className="text-secondary text-lg mb-8">
          Des domaines où se mêlent beauté, sincérité et art de recevoir.
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
