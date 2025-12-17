'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Types pour les différents formulaires de contact
 */
type FormType = 'b2b' | 'prive';

interface ContactFormSwitcherProps {
  /** Type de formulaire par défaut */
  defaultForm?: FormType;
}

/**
 * Composant ContactFormSwitcher
 * 
 * Permet de basculer entre 2 types de formulaires :
 * - Formulaire B2B (événements professionnels: séminaires, team-buildings, etc.)
 * - Formulaire Privé (mariages et événements privés)
 * 
 * @param defaultForm - Type de formulaire affiché par défaut
 */
export default function ContactFormSwitcher({ defaultForm = 'b2b' }: ContactFormSwitcherProps) {
  const [activeForm, setActiveForm] = useState<FormType>(defaultForm);

  return (
    <div className="w-full max-w-content mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Sélecteur de type de contact */}
      <div className="flex gap-4 mb-8 mx-auto">
        <button
          onClick={() => setActiveForm('b2b')}
          className={`flex-1 py-4 px-6 rounded-xl text-base font-semibold transition-all border ${
            activeForm === 'b2b'
              ? 'bg-charcoal-800 text-[#C9A961]! shadow-lg border-accent/20'
              : 'bg-stone/30 text-secondary hover:bg-stone/50 border-stone'
          }`}
        >
          Événements professionnels
        </button>
        <button
          onClick={() => setActiveForm('prive')}
          className={`flex-1 py-4 px-6 rounded-xl text-base font-semibold transition-all border ${
            activeForm === 'prive'
              ? 'bg-charcoal-800 text-[#C9A961]! shadow-lg border-accent/20'
              : 'bg-stone/30 text-secondary hover:bg-stone/50 border-stone'
          }`}
        >
          Événements privés
        </button>
      </div>

      {/* Formulaire B2B - Événements professionnels */}
      {activeForm === 'b2b' && (
        <form className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-2">Événements professionnels</h3>
            <p className="text-secondary">
              Séminaires, team-buildings, conférences, soirées d&apos;entreprise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Société *
              </label>
              <motion.input
                type="text"
                className="w-full px-4 py-3 bg-white border-2 border-stone rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                placeholder="Nom de votre entreprise"
                required
                whileFocus={{ scale: 1.01, borderColor: 'var(--color-accent)' }}
                transition={{ duration: 0.2 }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Nom de l&apos;intervenant *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white border-2 border-stone rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                placeholder="Prénom Nom"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Poste de l&apos;intervenant *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white border-2 border-stone rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                placeholder="Votre fonction"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 bg-white border-2 border-stone rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                placeholder="+33 1 XX XX XX XX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-white border-2 border-stone rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                placeholder="contact@entreprise.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Date événement
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-white border-2 border-stone rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre de personnes *
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-white border-2 border-stone rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                placeholder="Estimer le nombre de participants"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Type d&apos;événement *
              </label>
              <select className="w-full px-4 py-3 bg-white border-2 border-stone rounded-lg focus:ring-2 focus:ring-accent focus:border-accent" required>
                <option value="">Sélectionner...</option>
                <option value="seminaire-journee">Séminaire journée</option>
                <option value="seminaire-residentiel">Séminaire résidentiel</option>
                <option value="soiree">Soirée d&apos;entreprise</option>
                <option value="grands-evenements">Grands événements</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              Besoins *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-stone text-accent focus:ring-accent"
                />
                <span className="text-sm">Déjeuner</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-stone text-accent focus:ring-accent"
                />
                <span className="text-sm">Dîner</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-stone text-accent focus:ring-accent"
                />
                <span className="text-sm">Cocktail</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-stone text-accent focus:ring-accent"
                />
                <span className="text-sm">Team building</span>
              </label>
              <label className="flex items-center col-span-2">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-stone text-accent focus:ring-accent"
                />
                <span className="text-sm">Sous-commission</span>
                <input
                  type="number"
                  className="ml-2 w-20 px-2 py-1 bg-white border-2 border-stone rounded text-sm"
                  placeholder="Qté"
                  min="0"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Commentaire / Message
            </label>
            <textarea
              rows={5}
              className="w-full px-4 py-3 bg-white border-2 border-stone rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              placeholder="Décrivez votre projet, vos besoins spécifiques, vos contraintes..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full text-lg"
          >
            Demander un devis
          </button>
        </form>
      )}

      {/* Formulaire Privé - Mariages et événements privés */}
      {activeForm === 'prive' && (
        <form className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-2">Événements privés</h3>
            <p className="text-secondary">
              Mariages, anniversaires, célébrations familiales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nom *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white border-2 border-stone rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                placeholder="Votre nom"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Prénom *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white border-2 border-stone rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                placeholder="Votre prénom"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-white border-2 border-stone rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
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
                className="w-full px-4 py-3 bg-white border-2 border-stone rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                placeholder="+33 6 XX XX XX XX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Date de l&apos;événement (Mois / Année) *
              </label>
              <input
                type="month"
                className="w-full px-4 py-3 bg-white border-2 border-stone rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre d&apos;invités approximatif *
              </label>
              <select className="w-full px-4 py-3 bg-white border-2 border-stone rounded-lg focus:ring-2 focus:ring-accent focus:border-accent" required>
                <option value="">Sélectionner...</option>
                <option value="0-70">0 - 70 personnes</option>
                <option value="70-100">70 - 100 personnes</option>
                <option value="100-130">100 - 130 personnes</option>
                <option value="130+">130+ personnes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              Lieux qui vous intéressent
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-stone text-accent focus:ring-accent"
                />
                <span className="text-sm">Le Manoir de la Boulaie</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-stone text-accent focus:ring-accent"
                />
                <span className="text-sm">Le Château de la Brûlaire</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-stone text-accent focus:ring-accent"
                />
                <span className="text-sm">Le Château de la Corbe</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-stone text-accent focus:ring-accent"
                />
                <span className="text-sm">Le Domaine Nantais</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-stone text-accent focus:ring-accent"
                />
                <span className="text-sm">Le Dôme</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Commentaire / Message
            </label>
            <textarea
              rows={5}
              className="w-full px-4 py-3 bg-white border-2 border-stone rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              placeholder="Parlez-nous de votre projet, de vos envies, de vos besoins spécifiques..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full text-lg"
          >
            Demander un devis
          </button>
        </form>
      )}

    </div>
  );
}
