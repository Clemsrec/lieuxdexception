import type { Metadata } from 'next';

/**
 * Métadonnées pour la page Politique de Confidentialité
 */
export const metadata: Metadata = {
  title: 'Politique de Confidentialité | Lieux d\'Exception - Groupe Riou',
  description: 'Politique de protection des données personnelles de Lieux d\'Exception, conforme au RGPD.',
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Page Politique de Confidentialité
 * 
 * Politique de protection des données personnelles conforme au RGPD
 */
export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen">
      <section className="section">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Politique de Confidentialité</h1>
            <p className="text-secondary">
              Protection et traitement de vos données personnelles - Conforme RGPD
            </p>
          </div>

          {/* Contenu */}
          <div className="max-w-content mx-auto">
        
        {/* Introduction */}
        <section className="mb-8">
          <div className="bg-primary/5 p-6 rounded-lg border border-primary/10 text-foreground">
            <h2 className="text-xl font-semibold mb-3 text-primary flex items-center gap-2">
              
              Votre vie privée nous tient à cœur
            </h2>
            <p className="text-sm">
              Le Groupe Riou s&apos;engage à protéger votre vie privée et vos données personnelles. 
              Cette politique vous explique comment nous collectons, utilisons et protégeons vos informations 
              dans le cadre de nos services événementiels.
            </p>
          </div>
        </section>

        {/* Responsable du traitement */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Responsable du traitement</h2>
          <div className="bg-muted p-6 rounded-lg">
            <p><strong>Groupe Riou SAS</strong></p>
            <p>123 Avenue des Champs, 75008 Paris, France</p>
            <p>Email : dpo@lieuxdexception.fr</p>
            <p>Téléphone : +33 1 23 45 67 89</p>
          </div>
        </section>

        {/* Données collectées */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Données personnelles collectées</h2>
          
          <h3 className="text-lg font-medium mb-3">Données d&apos;identification</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Numéro de téléphone</li>
            <li>Nom de l&apos;entreprise (pour les clients B2B)</li>
            <li>Fonction (pour les clients B2B)</li>
          </ul>

          <h3 className="text-lg font-medium mb-3">Données de l&apos;événement</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Type d&apos;événement (mariage, séminaire, conférence...)</li>
            <li>Date souhaitée</li>
            <li>Nombre de participants/invités</li>
            <li>Budget approximatif</li>
            <li>Prestations souhaitées</li>
            <li>Description du projet</li>
          </ul>

          <h3 className="text-lg font-medium mb-3">Données techniques</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Adresse IP</li>
            <li>Type de navigateur</li>
            <li>Pages visitées</li>
            <li>Temps de visite</li>
            <li>Source de traffic</li>
          </ul>
        </section>

        {/* Finalités du traitement */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Finalités du traitement</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                
                Gestion des demandes
              </h3>
              <ul className="text-sm space-y-1">
                <li>• Traitement des devis</li>
                <li>• Réponse aux demandes d&apos;information</li>
                <li>• Suivi commercial</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                
                Communication
              </h3>
              <ul className="text-sm space-y-1">
                <li>• Envoi de propositions</li>
                <li>• Newsletter (avec consentement)</li>
                <li>• Invitations événements</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                
                Gestion événements
              </h3>
              <ul className="text-sm space-y-1">
                <li>• Organisation des prestations</li>
                <li>• Coordination avec prestataires</li>
                <li>• Facturation et paiement</li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                
                Amélioration services
              </h3>
              <ul className="text-sm space-y-1">
                <li>• Analyses statistiques</li>
                <li>• Amélioration site web</li>
                <li>• Satisfaction client</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Base légale */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Base légale du traitement</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              
              <div>
                <strong>Exécution d&apos;un contrat :</strong> Organisation de votre événement
              </div>
            </div>
            <div className="flex items-start space-x-3">
              
              <div>
                <strong>Intérêt légitime :</strong> Prospection commerciale et amélioration de nos services
              </div>
            </div>
            <div className="flex items-start space-x-3">
              
              <div>
                <strong>Consentement :</strong> Newsletter et communications marketing (révocable à tout moment)
              </div>
            </div>
          </div>
        </section>

        {/* Destinataires */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Destinataires des données</h2>
          <p className="mb-4">
            Vos données personnelles peuvent être transmises aux destinataires suivants :
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Personnel autorisé du Groupe Riou :</strong> Équipes commerciales, événementielles et administratives</li>
            <li><strong>Prestataires de services :</strong> Traiteurs, photographes, musiciens, décorateurs (selon vos besoins)</li>
            <li><strong>Partenaires techniques :</strong> Hébergeur du site web, service de messagerie</li>
            <li><strong>Organismes légaux :</strong> Sur demande judiciaire ou administrative</li>
          </ul>
        </section>

        {/* Durée de conservation */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Durée de conservation</h2>
          <div className="bg-muted p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Prospects (sans contrat) :</strong><br />
                3 ans après le dernier contact
              </div>
              <div>
                <strong>Clients (avec contrat) :</strong><br />
                10 ans après la fin du contrat
              </div>
              <div>
                <strong>Données de navigation :</strong><br />
                13 mois maximum
              </div>
              <div>
                <strong>Newsletter :</strong><br />
                Jusqu&apos;à désinscription
              </div>
            </div>
          </div>
        </section>

        {/* Vos droits */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Vos droits</h2>
          <p className="mb-4">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                
                Droit d&apos;accès
              </h3>
              <p className="text-sm">Connaître les données que nous détenons sur vous</p>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                
                Droit de rectification
              </h3>
              <p className="text-sm">Corriger ou mettre à jour vos données</p>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                
                Droit d&apos;effacement
              </h3>
              <p className="text-sm">Supprimer vos données personnelles</p>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                
                Droit de limitation
              </h3>
              <p className="text-sm">Limiter le traitement de vos données</p>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                
                Droit à la portabilité
              </h3>
              <p className="text-sm">Récupérer vos données dans un format lisible</p>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                
                Droit d&apos;opposition
              </h3>
              <p className="text-sm">Vous opposer au traitement de vos données</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/10">
            <h3 className="font-medium mb-2">Comment exercer vos droits ?</h3>
            <p className="text-sm mb-2">Contactez notre Délégué à la Protection des Données :</p>
            <p className="text-sm flex items-center gap-2 mb-1">
              
              Email : <a href="mailto:dpo@lieuxdexception.fr" className="text-primary hover:underline">dpo@lieuxdexception.fr</a>
            </p>
            <p className="text-sm flex items-center gap-2">
              
              Courrier : DPO - Groupe Riou, 123 Avenue des Champs, 75008 Paris
            </p>
          </div>
        </section>

        {/* Sécurité */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Sécurité des données</h2>
          <p className="mb-4">
            Nous mettons en place les mesures techniques et organisationnelles appropriées pour protéger vos données :
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Chiffrement des données en transit (HTTPS)</li>
            <li>Accès restreint aux données personnelles</li>
            <li>Sauvegardes régulières et sécurisées</li>
            <li>Formation du personnel sur la protection des données</li>
            <li>Audits de sécurité réguliers</li>
          </ul>
        </section>

        {/* Transferts hors UE */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Transferts hors Union Européenne</h2>
          <p className="mb-4">
            Nos données sont principalement hébergées au sein de l&apos;Union Européenne. 
            Lorsque des transferts vers des pays tiers sont nécessaires (hébergement, outils de communication), 
            nous nous assurons qu&apos;ils offrent un niveau de protection adéquat.
          </p>
        </section>

        {/* Réclamation */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Droit de réclamation</h2>
          <p className="mb-4">
            Si vous estimez que le traitement de vos données personnelles constitue une violation de la réglementation, 
            vous avez le droit d&apos;introduire une réclamation auprès de la CNIL :
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <p><strong>CNIL</strong> - Commission Nationale de l&apos;Informatique et des Libertés</p>
            <p>3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07</p>
            <p>Téléphone : 01 53 73 22 22</p>
            <p>Site web : <a href="https://www.cnil.fr" className="text-primary hover:underline">www.cnil.fr</a></p>
          </div>
        </section>

        {/* Contact DPO */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
          <div className="bg-primary/5 p-6 rounded-lg border border-primary/10">
            <h3 className="font-medium mb-3">Pour toute question concernant cette politique :</h3>
            <p><strong>Délégué à la Protection des Données</strong></p>
            <p className="flex items-center gap-2">
              
              Email : dpo@lieuxdexception.fr
            </p>
            <p className="flex items-center gap-2">
              
              Téléphone : +33 1 23 45 67 89
            </p>
            <p className="flex items-center gap-2">
              
              Adresse : DPO - Groupe Riou, 123 Avenue des Champs, 75008 Paris
            </p>
          </div>
        </section>

        {/* Dernière mise à jour */}
        <section className="text-center pt-8 border-t border-border">
          <p className="text-sm text-secondary">
            Dernière mise à jour : 5 novembre 2024
          </p>
          <p className="text-xs text-secondary mt-2">
            Cette politique peut être mise à jour. La version en vigueur est toujours disponible sur cette page.
          </p>
        </section>
          </div>
        </div>
      </section>
    </main>
  );
}