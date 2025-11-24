import type { Metadata } from 'next';

/**
 * Métadonnées pour la page Politique des Cookies
 */
export const metadata: Metadata = {
  title: 'Politique des Cookies | Lieux d\'Exception - Groupe Riou',
  description: 'Information sur l\'utilisation des cookies sur le site Lieux d\'Exception et gestion de vos préférences.',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Page Politique des Cookies
 * 
 * Informations sur l'utilisation des cookies et gestion des préférences
 */
export default function CookiesPage() {
  return (
    <main className="min-h-screen">
      <section className="section">
        <div className="section-container">
          {/* Header */}
          <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Politique des Cookies</h1>
        <p className="text-secondary">
          Information sur l&apos;utilisation des cookies et gestion de vos préférences
        </p>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto prose prose-lg">
        
        {/* Introduction */}
        <section className="mb-8">
          <div className="bg-primary/5 p-6 rounded-lg border border-primary/10">
            <h2 className="text-xl font-semibold mb-3 text-primary flex items-center">
              
              Qu&apos;est-ce qu&apos;un cookie ?
            </h2>
            <p className="text-sm">
              Un cookie est un petit fichier texte stocké sur votre appareil lors de votre visite sur notre site. 
              Il nous aide à améliorer votre expérience de navigation et à vous proposer du contenu personnalisé.
            </p>
          </div>
        </section>

        {/* Types de cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Types de cookies utilisés</h2>
          
          <div className="space-y-6">
            
            {/* Cookies essentiels */}
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-green-800 flex items-center">
                
                Cookies Essentiels (Obligatoires)
              </h3>
              <p className="text-sm text-green-700 mb-3">
                Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Sécurité :</strong> Protection contre les attaques CSRF
                </div>
                <div>
                  <strong>Session :</strong> Maintien de votre connexion
                </div>
                <div>
                  <strong>Préférences :</strong> Langue, devise, paramètres
                </div>
                <div>
                  <strong>Panier :</strong> Mémorisation de vos sélections
                </div>
              </div>
            </div>

            {/* Cookies analytiques */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-blue-800 flex items-center">
                
                Cookies Analytiques (Optionnels)
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Ces cookies nous aident à comprendre comment vous utilisez notre site pour l&apos;améliorer.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Google Analytics :</strong> Statistiques de visite
                </div>
                <div>
                  <strong>Hotjar :</strong> Cartes de chaleur et enregistrements
                </div>
                <div>
                  <strong>Performances :</strong> Temps de chargement des pages
                </div>
                <div>
                  <strong>Navigation :</strong> Pages les plus visitées
                </div>
              </div>
            </div>

            {/* Cookies marketing */}
            <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-purple-800 flex items-center">
                
                Cookies Marketing (Optionnels)
              </h3>
              <p className="text-sm text-purple-700 mb-3">
                Ces cookies permettent de vous proposer du contenu et des publicités personnalisés.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Facebook Pixel :</strong> Publicités ciblées
                </div>
                <div>
                  <strong>Google Ads :</strong> Remarketing
                </div>
                <div>
                  <strong>LinkedIn Insight :</strong> Audiences B2B
                </div>
                <div>
                  <strong>Personnalisation :</strong> Contenu adapté à vos intérêts
                </div>
              </div>
            </div>

            {/* Cookies fonctionnels */}
            <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-3 text-orange-800 flex items-center">
                
                Cookies Fonctionnels (Optionnels)
              </h3>
              <p className="text-sm text-orange-700 mb-3">
                Ces cookies améliorent les fonctionnalités et la personnalisation du site.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Chat en ligne :</strong> Service client intégré
                </div>
                <div>
                  <strong>Vidéos :</strong> Intégration YouTube/Vimeo
                </div>
                <div>
                  <strong>Cartes :</strong> Géolocalisation des lieux
                </div>
                <div>
                  <strong>Partage social :</strong> Boutons de partage
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gestion des cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Gestion de vos préférences</h2>
          
          {/* Bandeau de gestion */}
          <div className="bg-muted p-6 rounded-lg mb-6">
            <h3 className="font-medium mb-4 flex items-center">
              
              Centre de préférences des cookies
            </h3>
            <p className="text-sm mb-4">
              Vous pouvez à tout moment modifier vos préférences concernant les cookies optionnels :
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <button className="btn-primary">
                Gérer mes préférences
              </button>
              <button className="border border-border px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                Tout accepter
              </button>
            </div>
            
            <p className="text-xs text-secondary mt-2 flex items-center">
              
              Les cookies essentiels restent actifs pour le bon fonctionnement du site
            </p>
          </div>

          {/* Instructions navigateur */}
          <div className="space-y-4">
            <h3 className="font-medium">Configuration dans votre navigateur</h3>
            <p className="text-sm mb-4">
              Vous pouvez également gérer les cookies directement dans les paramètres de votre navigateur :
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="mb-2 flex justify-center">
                  
                </div>
                <h4 className="font-medium text-sm">Firefox</h4>
                <p className="text-xs text-secondary">Paramètres → Vie privée</p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="mb-2 flex justify-center">
                  
                </div>
                <h4 className="font-medium text-sm">Chrome</h4>
                <p className="text-xs text-secondary">Paramètres → Confidentialité</p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="mb-2 flex justify-center">
                  
                </div>
                <h4 className="font-medium text-sm">Safari</h4>
                <p className="text-xs text-secondary">Préférences → Confidentialité</p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg text-center">
                <div className="mb-2 flex justify-center">
                  
                </div>
                <h4 className="font-medium text-sm">Edge</h4>
                <p className="text-xs text-secondary">Paramètres → Cookies</p>
              </div>
            </div>
          </div>
        </section>

        {/* Durée de conservation */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Durée de conservation</h2>
          
          <div className="bg-muted p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-medium mb-2">Cookies de session</h3>
                <p>Supprimés à la fermeture du navigateur</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Cookies persistants</h3>
                <p>Conservés selon leur durée de vie spécifique :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Préférences : 1 an</li>
                  <li>Analytics : 24 mois</li>
                  <li>Marketing : 12 mois</li>
                  <li>Fonctionnels : 6 mois</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cookies tiers */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Cookies de partenaires tiers</h2>
          
          <p className="mb-4">
            Certains cookies sont déposés par nos partenaires pour améliorer nos services :
          </p>
          
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Google Analytics</h3>
              <p className="text-sm text-secondary mb-2">
                Analyse d&apos;audience et de performance du site
              </p>
              <a 
                href="https://policies.google.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline"
              >
                Politique de confidentialité Google →
              </a>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Facebook/Meta</h3>
              <p className="text-sm text-secondary mb-2">
                Pixel de conversion pour optimiser nos campagnes
              </p>
              <a 
                href="https://www.facebook.com/privacy/policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline"
              >
                Politique de confidentialité Meta →
              </a>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">LinkedIn</h3>
              <p className="text-sm text-secondary mb-2">
                Insight Tag pour le ciblage B2B
              </p>
              <a 
                href="https://www.linkedin.com/legal/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary text-sm hover:underline"
              >
                Politique de confidentialité LinkedIn →
              </a>
            </div>
          </div>
        </section>

        {/* Impact du refus */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Impact du refus des cookies</h2>
          
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="font-medium mb-3 text-yellow-800 flex items-center">
              
              Que se passe-t-il si vous refusez les cookies ?
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                
                <div>
                  <strong>Fonctionnalité de base :</strong> Le site reste utilisable pour la navigation et les demandes de contact
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                
                <div>
                  <strong>Expérience limitée :</strong> Certaines fonctionnalités avancées peuvent ne pas fonctionner optimalement
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                
                <div>
                  <strong>Personnalisation réduite :</strong> Le contenu ne sera pas adapté à vos préférences
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                
                <div>
                  <strong>Analytics désactivés :</strong> Nous ne pourrons pas améliorer le site basé sur votre usage
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mise à jour */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Mise à jour de cette politique</h2>
          <p className="mb-4">
            Cette politique des cookies peut être mise à jour pour refléter les changements dans notre utilisation des cookies 
            ou pour des raisons légales et réglementaires.
          </p>
          <p className="text-sm text-secondary">
            Nous vous informerons de tout changement significatif par un bandeau sur le site ou par email si vous êtes abonné à notre newsletter.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact</h2>
          <div className="bg-primary/5 p-6 rounded-lg border border-primary/10">
            <h3 className="font-medium mb-3">Questions sur les cookies ?</h3>
            <p className="text-sm mb-3">
              Pour toute question concernant notre utilisation des cookies, contactez-nous :
            </p>
            <div className="space-y-1 text-sm">
              <p className="flex items-center">
                
                Email : <a href="mailto:dpo@lieuxdexception.fr" className="text-primary hover:underline">dpo@lieuxdexception.fr</a>
              </p>
              <p className="flex items-center">
                
                Téléphone : +33 1 23 45 67 89
              </p>
              <p className="flex items-center">
                
                Courrier : DPO - Groupe Riou, 123 Avenue des Champs, 75008 Paris
              </p>
            </div>
          </div>
        </section>

        {/* Dernière mise à jour */}
        <section className="text-center pt-8 border-t border-border">
          <p className="text-sm text-secondary">
            Dernière mise à jour : 5 novembre 2024
          </p>
          <p className="text-xs text-secondary mt-2">
            Version 2.1 - Cette politique est mise à jour régulièrement
          </p>
        </section>
        </div>
        </div>
      </section>
    </main>
  );
}