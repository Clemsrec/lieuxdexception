import type { Metadata } from 'next';
import Icon from '@/components/ui/Icon';

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
    <div className="section-container py-12">
      
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-balance mb-6">
          Mariages d&apos;Exception
        </h1>
        <p className="text-xl text-secondary max-w-4xl mx-auto mb-8">
          Célébrez le plus beau jour de votre vie dans l&apos;un de nos lieux d&apos;exception. 
          Des châteaux historiques aux domaines romantiques, créez des souvenirs inoubliables.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="btn-primary text-lg px-8 py-3">
            Demander un devis mariage
          </button>
          <button className="border border-border px-8 py-3 rounded-lg hover:bg-muted transition-colors">
            Voir nos lieux
          </button>
        </div>
      </div>

      {/* Types de cérémonies */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Tous types de cérémonies
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Mariage civil */}
          <div className="venue-card text-center">
            <div className="mb-4 flex justify-center">
              <Icon type="building" size={48} className="text-primary" aria-label="Mariage civil" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Mariage Civil</h3>
            <p className="text-secondary text-sm mb-4">
              Cérémonies officielles dans des cadres d&apos;exception 
              avec tous les services administratifs.
            </p>
            <ul className="text-xs space-y-1 text-secondary">
              <li>• Salles de cérémonie officielles</li>
              <li>• Accompagnement administratif</li>
              <li>• Témoins et invités</li>
            </ul>
          </div>

          {/* Mariage religieux */}
          <div className="venue-card text-center">
            <div className="mb-4 flex justify-center">
              <Icon type="church" size={48} className="text-primary" aria-label="Mariage religieux" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Mariage Religieux</h3>
            <p className="text-secondary text-sm mb-4">
              Partenariats avec des lieux de culte proches 
              et organisation complète de la cérémonie.
            </p>
            <ul className="text-xs space-y-1 text-secondary">
              <li>• Églises et chapelles partenaires</li>
              <li>• Coordination avec officiant</li>
              <li>• Décoration florale</li>
            </ul>
          </div>

          {/* Cérémonie symbolique */}
          <div className="venue-card text-center">
            <div className="mb-4 flex justify-center">
              <Icon type="flower" size={48} className="text-primary" aria-label="Cérémonie symbolique" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Cérémonie Symbolique</h3>
            <p className="text-secondary text-sm mb-4">
              Créez votre propre rituel dans des décors 
              naturels exceptionnels et personnalisés.
            </p>
            <ul className="text-xs space-y-1 text-secondary">
              <li>• Espaces extérieurs romantiques</li>
              <li>• Cérémonie sur mesure</li>
              <li>• Officiant de cérémonie</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Styles de réception */}
      <section className="mb-16 bg-muted rounded-2xl p-8">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Styles de réception adaptés à vos envies
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Réception assise */}
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Icon type="chefHat" size={24} className="text-primary" aria-label="Dîner assis" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Dîner Assis</h3>
              <p className="text-secondary mb-4">
                Repas gastronomique dans nos salles à manger d&apos;exception, 
                avec service à la française et menu dégustation.
              </p>
              <ul className="text-sm space-y-1">
                <li className="flex items-center"><Icon type="check" size={16} className="text-primary mr-2" aria-label="Inclus" /> Menu sur mesure avec chef étoilé</li>
                <li className="flex items-center"><Icon type="check" size={16} className="text-primary mr-2" aria-label="Inclus" /> Service personnel expérimenté</li>
                <li className="flex items-center"><Icon type="check" size={16} className="text-primary mr-2" aria-label="Inclus" /> Accord mets et vins</li>
                <li className="flex items-center"><Icon type="check" size={16} className="text-primary mr-2" aria-label="Inclus" /> Tables rondes ou rectangulaires</li>
              </ul>
            </div>
          </div>

          {/* Cocktail dinatoire */}
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
              <Icon type="wine" size={24} className="text-accent" aria-label="Cocktail dinatoire" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Cocktail Dinatoire</h3>
              <p className="text-secondary mb-4">
                Formule conviviale dans nos jardins et terrasses, 
                parfaite pour des célébrations décontractées.
              </p>
              <ul className="text-sm space-y-1">
                <li className="flex items-center"><Icon type="check" size={16} className="text-primary mr-2" aria-label="Inclus" /> Buffets gastronomiques variés</li>
                <li className="flex items-center"><Icon type="check" size={16} className="text-primary mr-2" aria-label="Inclus" /> Espaces intérieurs et extérieurs</li>
                <li className="flex items-center"><Icon type="check" size={16} className="text-primary mr-2" aria-label="Inclus" /> Animations musicales</li>
                <li className="flex items-center"><Icon type="check" size={16} className="text-primary mr-2" aria-label="Inclus" /> Bars mobiles premium</li>
              </ul>
            </div>
          </div>

          {/* Brunch de mariage */}
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
              <Icon type="sun" size={24} className="text-secondary" aria-label="Brunch de mariage" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Brunch de Mariage</h3>
              <p className="text-secondary mb-4">
                Célébration matinale dans nos espaces lumineux, 
                idéale pour les mariages intimes et familiaux.
              </p>
              <ul className="text-sm space-y-1">
                <li className="flex items-center"><Icon type="check" size={16} className="text-primary mr-2" aria-label="Inclus" /> Buffet brunch raffiné</li>
                <li className="flex items-center"><Icon type="check" size={16} className="text-primary mr-2" aria-label="Inclus" /> Terrasses avec vue panoramique</li>
                <li className="flex items-center"><Icon type="check" size={16} className="text-primary mr-2" aria-label="Inclus" /> Ambiance décontractée</li>
                <li className="flex items-center"><Icon type="check" size={16} className="text-primary mr-2" aria-label="Inclus" /> Activités pour enfants</li>
              </ul>
            </div>
          </div>

          {/* Week-end complet */}
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Icon type="castle" size={24} className="text-primary" aria-label="Week-end complet" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Week-end Complet</h3>
              <p className="text-secondary mb-4">
                Privatisation complète du lieu pour un mariage 
                sur plusieurs jours avec hébergement inclus.
              </p>
              <ul className="text-sm space-y-1">
                <li className="flex items-center"><Icon type="check" size={16} className="text-primary mr-2" aria-label="Inclus" /> Privatisation exclusive du domaine</li>
                <li className="flex items-center"><Icon type="check" size={16} className="text-primary mr-2" aria-label="Inclus" /> Hébergement pour tous les invités</li>
                <li className="flex items-center"><Icon type="check" size={16} className="text-primary mr-2" aria-label="Inclus" /> Activités sur 2-3 jours</li>
                <li className="flex items-center"><Icon type="check" size={16} className="text-primary mr-2" aria-label="Inclus" /> Conciergerie personnalisée</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services inclus */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Nos services mariage tout inclus
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon type="flower" size={24} className="text-primary" aria-label="Décoration florale" />
            </div>
            <h3 className="font-semibold mb-2">Décoration Florale</h3>
            <p className="text-secondary text-sm">
              Compositions sur mesure par nos fleuristes partenaires
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon type="camera" size={24} className="text-primary" aria-label="Photographie" />
            </div>
            <h3 className="font-semibold mb-2">Photographie</h3>
            <p className="text-secondary text-sm">
              Photographes professionnels pour immortaliser votre journée
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon type="music" size={24} className="text-primary" aria-label="Animation musicale" />
            </div>
            <h3 className="font-semibold mb-2">Animation Musicale</h3>
            <p className="text-secondary text-sm">
              DJ, groupes live et sonorisation pour tous vos moments
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon type="car" size={24} className="text-primary" aria-label="Transport" />
            </div>
            <h3 className="font-semibold mb-2">Transport</h3>
            <p className="text-secondary text-sm">
              Navettes et véhicules de prestige pour les mariés et invités
            </p>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="mb-16 bg-linear-to-r from-primary/5 to-accent/5 rounded-2xl p-8">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Ils nous ont fait confiance
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-background rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                <Icon type="heart" size={20} className="text-primary" aria-label="Témoignage" />
              </div>
              <div>
                <h4 className="font-semibold">Sophie & Thomas</h4>
                <p className="text-secondary text-sm">Mariage au Château de Exemple - Juin 2024</p>
              </div>
            </div>
            <p className="text-secondary italic">
              &quot;Un mariage de rêve dans un cadre exceptionnel ! L&apos;équipe du Groupe Riou 
              a rendu notre journée absolument parfaite. Tous nos invités étaient émerveillés 
              par la beauté du lieu et la qualité du service.&quot;
            </p>
          </div>

          <div className="bg-background rounded-xl p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mr-4">
                <Icon type="sparkles" size={20} className="text-accent" aria-label="Excellence" />
              </div>
              <div>
                <h4 className="font-semibold">Marie & Pierre</h4>
                <p className="text-secondary text-sm">Mariage au Domaine de Exemple - Septembre 2024</p>
              </div>
            </div>
            <p className="text-secondary italic">
              &quot;Une organisation sans faille et une attention aux détails remarquable. 
              Le coordinateur mariage nous a accompagnés tout au long des préparatifs. 
              Une expérience inoubliable !&quot;
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-primary/5 rounded-2xl p-12">
        <h2 className="text-3xl font-semibold mb-4">
          Commencez à planifier votre mariage de rêve
        </h2>
        <p className="text-secondary text-lg mb-8 max-w-3xl mx-auto">
          Rencontrez notre équipe spécialisée dans l&apos;organisation de mariages d&apos;exception. 
          Nous vous accompagnons de A à Z pour créer la célébration parfaite.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <button className="btn-primary text-lg px-8 py-3">
            Demander un devis mariage
          </button>
          <button className="border border-border px-8 py-3 rounded-lg hover:bg-muted transition-colors">
            Visiter nos lieux
          </button>
        </div>
        
        <div className="text-sm text-secondary">
          <p>Consultation gratuite • Devis personnalisé sous 48h</p>
          <p className="mt-1">Téléphone : <strong className="text-foreground">01 23 45 67 89</strong> | Email : <strong className="text-foreground">mariages@lieuxdexception.fr</strong></p>
        </div>
      </section>

    </div>
  );
}