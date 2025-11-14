'use client';

import { useState } from 'react';

/**
 * Types pour les différents formulaires de contact
 */
type FormType = 'b2b' | 'mariage' | 'rapide';

interface ContactFormSwitcherProps {
  /** Type de formulaire par défaut */
  defaultForm?: FormType;
}

/**
 * Composant ContactFormSwitcher
 * 
 * Permet de basculer entre différents types de formulaires :
 * - Formulaire B2B complet (événements professionnels)
 * - Formulaire mariage détaillé
 * - Formulaire de contact rapide
 * 
 * @param defaultForm - Type de formulaire affiché par défaut
 */
export default function ContactFormSwitcher({ defaultForm = 'b2b' }: ContactFormSwitcherProps) {
  const [activeForm, setActiveForm] = useState<FormType>(defaultForm);

  return (
    <div>
      
      {/* Sélecteur de formulaire */}
      <div className="flex bg-muted rounded-lg p-1 mb-8">
        <button
          onClick={() => setActiveForm('b2b')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeForm === 'b2b'
              ? 'bg-white shadow-sm text-primary'
              : 'text-secondary hover:text-foreground'
          }`}
        >
          Événement B2B
        </button>
        <button
          onClick={() => setActiveForm('mariage')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeForm === 'mariage'
              ? 'bg-white shadow-sm text-primary'
              : 'text-secondary hover:text-foreground'
          }`}
        >
          Mariage
        </button>
        <button
          onClick={() => setActiveForm('rapide')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeForm === 'rapide'
              ? 'bg-white shadow-sm text-primary'
              : 'text-secondary hover:text-foreground'
          }`}
        >
          Contact rapide
        </button>
      </div>

      {/* Formulaire B2B */}
      {activeForm === 'b2b' && (
        <form className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Organiser un événement professionnel</h3>
            <p className="text-secondary">
              Séminaires, conférences, lancements produit, team building...
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nom de l&apos;entreprise *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Votre entreprise"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Personne responsable *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Prénom Nom"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email professionnel *
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="contact@entreprise.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+33 1 XX XX XX XX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Type d&apos;événement *
              </label>
              <select className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required>
                <option value="">Sélectionner...</option>
                <option value="seminaire">Séminaire</option>
                <option value="conference">Conférence</option>
                <option value="lancement">Lancement produit</option>
                <option value="teambuilding">Team building</option>
                <option value="gala">Gala d&apos;entreprise</option>
                <option value="formation">Formation</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre de participants *
              </label>
              <select className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required>
                <option value="">Estimer...</option>
                <option value="10-30">10 à 30 personnes</option>
                <option value="30-50">30 à 50 personnes</option>
                <option value="50-100">50 à 100 personnes</option>
                <option value="100-200">100 à 200 personnes</option>
                <option value="200+">Plus de 200 personnes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Date souhaitée
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Budget approximatif
              </label>
              <select className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="">À définir</option>
                <option value="5000-10000">5 000€ - 10 000€</option>
                <option value="10000-20000">10 000€ - 20 000€</option>
                <option value="20000-50000">20 000€ - 50 000€</option>
                <option value="50000+">Plus de 50 000€</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Prestations souhaitées
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Location de salle',
                'Restauration',
                'Hébergement',
                'Audiovisuel',
                'Animation',
                'Transport'
              ].map((service) => (
                <label key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{service}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Détails de votre projet
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Décrivez votre événement, vos besoins spécifiques, vos contraintes..."
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-4 text-lg"
          >
            Demander un devis personnalisé
          </button>
        </form>
      )}

      {/* Formulaire Mariage */}
      {activeForm === 'mariage' && (
        <form className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Organiser votre mariage de rêve</h3>
            <p className="text-secondary">
              Célébrez votre union dans un cadre d&apos;exception
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Prénom de la mariée *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Prénom"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Prénom du marié *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Prénom"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email de contact *
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+33 6 XX XX XX XX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Date de mariage souhaitée *
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre d&apos;invités *
              </label>
              <select className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required>
                <option value="">Estimer...</option>
                <option value="50-80">50 à 80 invités</option>
                <option value="80-120">80 à 120 invités</option>
                <option value="120-150">120 à 150 invités</option>
                <option value="150-200">150 à 200 invités</option>
                <option value="200+">Plus de 200 invités</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Type de cérémonie
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                'Cérémonie laïque',
                'Cérémonie religieuse',
                'Réception uniquement'
              ].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="ceremonie"
                    className="mr-2 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Prestations souhaitées
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Location du lieu',
                'Restauration',
                'Hébergement invités',
                'Décoration florale',
                'Photographie',
                'Musique/DJ',
                'Animation',
                'Transport'
              ].map((service) => (
                <label key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{service}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Budget total estimé
            </label>
            <select className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
              <option value="">À définir</option>
              <option value="10000-20000">10 000€ - 20 000€</option>
              <option value="20000-35000">20 000€ - 35 000€</option>
              <option value="35000-50000">35 000€ - 50 000€</option>
              <option value="50000+">Plus de 50 000€</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Racontez-nous votre projet de mariage
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Décrivez l'ambiance souhaitée, vos inspirations, vos souhaits particuliers..."
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-4 text-lg flex items-center justify-center"
          >
            
            Demander un devis mariage
          </button>
        </form>
      )}

      {/* Formulaire rapide */}
      {activeForm === 'rapide' && (
        <form className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Contact rapide</h3>
            <p className="text-secondary">
              Une question ? Besoin d&apos;informations ? Nous vous répondons rapidement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Prénom et nom *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Votre nom complet"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Téléphone (optionnel)
            </label>
            <input
              type="tel"
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="+33 6 XX XX XX XX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Sujet de votre demande *
            </label>
            <select className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" required>
              <option value="">Choisir un sujet...</option>
              <option value="information">Demande d&apos;information</option>
              <option value="devis">Demande de devis</option>
              <option value="visite">Visite d&apos;un lieu</option>
              <option value="disponibilite">Vérifier une disponibilité</option>
              <option value="partenariat">Partenariat</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Votre message *
            </label>
            <textarea
              rows={5}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Écrivez votre message ici..."
              required
            />
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">💬 Besoin d&apos;une réponse immédiate ?</h4>
            <p className="text-sm text-secondary mb-3">
              Pour une réponse dans l&apos;heure, appelez-nous directement :
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="tel:+33123456789" 
                className="btn-primary text-center sm:flex-1 flex items-center justify-center"
              >
                
                01 23 45 67 89
              </a>
              <a 
                href="mailto:contact@lieuxdexception.fr" 
                className="border border-border px-4 py-2 rounded-lg hover:bg-muted-foreground/5 transition-colors text-center sm:flex-1"
              >
                ✉️ Email direct
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-4 text-lg"
          >
            Envoyer le message
          </button>
        </form>
      )}

    </div>
  );
}