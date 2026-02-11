'use client';

import { useState, FormEvent, useEffect } from 'react';
import { m } from 'framer-motion';

/**
 * Types pour les différents formulaires de contact
 */
type FormType = 'b2b' | 'prive';

interface ContactFormSwitcherProps {
 /** Type de formulaire par défaut */
 defaultForm?: FormType;
 /** Type de formulaire initial depuis URL (passé par le parent) */
 initialForm?: FormType | null;
}

interface FormState {
 loading: boolean;
 success: boolean;
 error: string | null;
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
export default function ContactFormSwitcher({ defaultForm = 'b2b', initialForm }: ContactFormSwitcherProps) {
 const [activeForm, setActiveForm] = useState<FormType>(initialForm || defaultForm);
 const [formState, setFormState] = useState<FormState>({
  loading: false,
  success: false,
  error: null,
 });

 /**
  * Mettre à jour le formulaire actif si initialForm change
  */
 useEffect(() => {
  if (initialForm) {
   setActiveForm(initialForm);
  }
 }, [initialForm]);

 /**
  * Soumission formulaire B2B
  */
 const handleB2BSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setFormState({ loading: true, success: false, error: null });

  const form = e.currentTarget;
  const formData = new FormData(form);

  // Vérifier honeypot
  if (formData.get('website')) {
   setFormState({ loading: false, success: false, error: 'Erreur de validation' });
   return;
  }

  // Collecter les besoins cochés
  const needs: string[] = [];
  if (formData.get('dejeuner')) needs.push('Déjeuner');
  if (formData.get('diner')) needs.push('Dîner');
  if (formData.get('cocktail')) needs.push('Cocktail');
  if (formData.get('teambuilding')) needs.push('Team building');
  const subCommission = formData.get('subcommission-qty');
  if (formData.get('subcommission') && subCommission) {
   needs.push(`Sous-commission (${subCommission})`);
  }

  const payload = {
   type: 'b2b',
   firstName: formData.get('firstName'),
   lastName: formData.get('lastName'),
   email: formData.get('email'),
   phone: formData.get('phone'),
   company: formData.get('company'),
   position: formData.get('position')?.toString().trim() || undefined,
   eventType: formData.get('eventType'),
   // N'envoyer que si non-vide (undefined > chaîne vide)
   eventDate: formData.get('eventDate')?.toString().trim() || undefined,
   guestCount: formData.get('guestCount')?.toString().trim() || undefined,
   message: `${formData.get('message') || ''}\n\nBesoins: ${needs.join(', ')}`,
   acceptPrivacy: true,
  };

  try {
   const response = await fetch('/api/contact/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
   });

   const data = await response.json();

   if (!response.ok) {
    throw new Error(data.error || 'Erreur lors de l\'envoi');
   }

   setFormState({ loading: false, success: true, error: null });
   form.reset();
  } catch (error: any) {
   setFormState({
    loading: false,
    success: false,
    error: error.message || 'Une erreur est survenue',
   });
  }
 };

 /**
  * Soumission formulaire Privé/Mariage
  */
 const handlePriveSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setFormState({ loading: true, success: false, error: null });

  const form = e.currentTarget;
  const formData = new FormData(form);

  // Vérifier honeypot
  if (formData.get('website')) {
   setFormState({ loading: false, success: false, error: 'Erreur de validation' });
   return;
  }

  // Collecter les lieux cochés
  const venues: string[] = [];
  if (formData.get('venue-boulaie')) venues.push('Le Manoir de la Boulaie');
  if (formData.get('venue-brulaire')) venues.push('Le Château de la Brûlaire');
  if (formData.get('venue-corbe')) venues.push('Le Château de la Corbe');
  if (formData.get('venue-nantais')) venues.push('Le Domaine Nantais');
  if (formData.get('venue-dome')) venues.push('Le Dôme');

  const payload: any = {
   type: 'mariage',
   firstName: formData.get('firstName'),
   lastName: formData.get('lastName'),
   email: formData.get('email'),
   phone: formData.get('phone'),
   // N'envoyer que si non-vide (undefined > chaîne vide)
   weddingDate: formData.get('eventDate')?.toString().trim() || undefined,
   guestCount: formData.get('guestCount')?.toString().trim() || undefined,
   message: `${formData.get('message') || ''}\n\nLieux intéressants: ${venues.join(', ')}`,
   acceptPrivacy: true,
  };

  try {
   const response = await fetch('/api/contact/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
   });

   const data = await response.json();

   if (!response.ok) {
    throw new Error(data.error || 'Erreur lors de l\'envoi');
   }

   setFormState({ loading: false, success: true, error: null });
   form.reset();
  } catch (error: any) {
   setFormState({
    loading: false,
    success: false,
    error: error.message || 'Une erreur est survenue',
   });
  }
 };

 return (
  <div className="w-full max-w-content mx-auto px-4 sm:px-6 lg:px-8">
   
   {/* Sélecteur de type de contact */}
   <div className="flex gap-4 mb-8 mx-auto">
    <button
     onClick={() => setActiveForm('b2b')}
     className={`flex-1 py-4 px-6 text-base font-semibold transition-all border ${
      activeForm === 'b2b'
       ? 'bg-charcoal-800 text-[#C9A961]! shadow-lg border-accent/20'
       : 'bg-stone/30 text-secondary hover:bg-stone/50 border-stone'
     }`}
    >
     Événements professionnels
    </button>
    <button
     onClick={() => setActiveForm('prive')}
     className={`flex-1 py-4 px-6 text-base font-semibold transition-all border ${
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
    <form onSubmit={handleB2BSubmit} className="space-y-6">
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
       <input
        type="text"
        name="company"
        className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent transition-all"
        placeholder="Nom de votre entreprise"
        required
        disabled={formState.loading}
       />
      </div>

      <div>
       <label className="block text-sm font-medium mb-2">
        Prénom de l&apos;intervenant *
       </label>
       <input
        type="text"
        name="firstName"
        className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent"
        placeholder="Prénom"
        required
        disabled={formState.loading}
       />
      </div>

      <div>
       <label className="block text-sm font-medium mb-2">
        Nom de l&apos;intervenant *
       </label>
       <input
        type="text"
        name="lastName"
        className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent"
        placeholder="Nom"
        required
        disabled={formState.loading}
       />
      </div>

      <div>
       <label className="block text-sm font-medium mb-2">
        Poste de l&apos;intervenant
       </label>
       <input
        type="text"
        name="position"
        className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent"
        placeholder="Votre fonction"
        disabled={formState.loading}
       />
      </div>

      <div>
       <label className="block text-sm font-medium mb-2">
        Téléphone *
       </label>
       <input
        type="tel"
        name="phone"
        className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent"
        placeholder="+33 1 XX XX XX XX"
        required
        disabled={formState.loading}
       />
      </div>

      <div>
       <label className="block text-sm font-medium mb-2">
        Email *
       </label>
       <input
        type="email"
        name="email"
        className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent"
        placeholder="contact@entreprise.com"
        required
        disabled={formState.loading}
       />
      </div>

      <div>
       <label className="block text-sm font-medium mb-2">
        Date événement
       </label>
       <input
        type="date"
        name="eventDate"
        className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent"
        disabled={formState.loading}
       />
      </div>

      <div>
       <label className="block text-sm font-medium mb-2">
        Nombre de personnes *
       </label>
       <input
        type="number"
        name="guestCount"
        min="10"
        max="500"
        className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent"
        placeholder="Estimer le nombre de participants"
        required
        disabled={formState.loading}
       />
      </div>

      <div>
       <label className="block text-sm font-medium mb-2">
        Type d&apos;événement *
       </label>
       <select
        name="eventType"
        className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent"
        required
        disabled={formState.loading}
       >
        <option value="">Sélectionner...</option>
        <option value="seminar">Séminaire</option>
        <option value="conference">Conférence</option>
        <option value="team_building">Team building</option>
        <option value="corporate">Soirée d&apos;entreprise</option>
       </select>
      </div>
     </div>

     <div>
      <label className="block text-sm font-medium mb-3">
       Besoins
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
       <label className="flex items-center">
        <input
         type="checkbox"
         name="dejeuner"
         className="mr-2 border-stone text-accent focus:ring-accent"
         disabled={formState.loading}
        />
        <span className="text-sm">Déjeuner</span>
       </label>
       <label className="flex items-center">
        <input
         type="checkbox"
         name="diner"
         className="mr-2 border-stone text-accent focus:ring-accent"
         disabled={formState.loading}
        />
        <span className="text-sm">Dîner</span>
       </label>
       <label className="flex items-center">
        <input
         type="checkbox"
         name="cocktail"
         className="mr-2 border-stone text-accent focus:ring-accent"
         disabled={formState.loading}
        />
        <span className="text-sm">Cocktail</span>
       </label>
       <label className="flex items-center">
        <input
         type="checkbox"
         name="teambuilding"
         className="mr-2 border-stone text-accent focus:ring-accent"
         disabled={formState.loading}
        />
        <span className="text-sm">Team building</span>
       </label>
       <label className="flex items-center col-span-2">
        <input
         type="checkbox"
         name="subcommission"
         className="mr-2 border-stone text-accent focus:ring-accent"
         disabled={formState.loading}
        />
        <span className="text-sm">Sous-commission</span>
        <input
         type="number"
         name="subcommission-qty"
         className="ml-2 w-20 px-2 py-1 bg-white border-2 border-stone text-sm"
         placeholder="Qté"
         min="0"
         disabled={formState.loading}
        />
       </label>
      </div>
     </div>

     <div>
      <label className="block text-sm font-medium mb-2">
       Commentaire / Message
      </label>
      <textarea
       name="message"
       rows={5}
       className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent"
       placeholder="Décrivez votre projet, vos besoins spécifiques, vos contraintes..."
       disabled={formState.loading}
      />
     </div>

     {/* Honeypot anti-bot (champ caché) */}
     <input
      type="text"
      name="website"
      id="website-b2b"
      autoComplete="off"
      tabIndex={-1}
      aria-hidden="true"
      className="absolute -left-[9999px] w-1 h-1 opacity-0 pointer-events-none"
      placeholder="Laissez ce champ vide"
     />

     {formState.success && (
      <div className="p-4 bg-green-50 border-2 border-green-500 text-green-800">
       ✅ Votre demande a été envoyée avec succès ! Nous vous contacterons sous 24-48h.
      </div>
     )}

     {formState.error && (
      <div className="p-4 bg-red-50 border-2 border-red-500 text-red-800">
       ❌ {formState.error}
      </div>
     )}

     <button
      type="submit"
      disabled={formState.loading}
      className="btn btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
     >
      {formState.loading ? 'Envoi en cours...' : 'Demander un devis'}
     </button>
    </form>
   )}

   {/* Formulaire Privé - Mariages et événements privés */}
   {activeForm === 'prive' && (
    <form onSubmit={handlePriveSubmit} className="space-y-6">
     <div className="text-center mb-8">
      <h3 className="text-2xl font-semibold mb-2">Événements privés</h3>
      <p className="text-secondary">
       Mariages, anniversaires, célébrations familiales
      </p>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
       <label className="block text-sm font-medium mb-2">
        Prénom *
       </label>
       <input
        type="text"
        name="firstName"
        className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent"
        placeholder="Votre prénom"
        required
        disabled={formState.loading}
       />
      </div>

      <div>
       <label className="block text-sm font-medium mb-2">
        Nom *
       </label>
       <input
        type="text"
        name="lastName"
        className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent"
        placeholder="Votre nom"
        required
        disabled={formState.loading}
       />
      </div>

      <div>
       <label className="block text-sm font-medium mb-2">
        Email *
       </label>
       <input
        type="email"
        name="email"
        className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent"
        placeholder="votre@email.com"
        required
        disabled={formState.loading}
       />
      </div>

      <div>
       <label className="block text-sm font-medium mb-2">
        Téléphone *
       </label>
       <input
        type="tel"
        name="phone"
        className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent"
        placeholder="+33 6 XX XX XX XX"
        required
        disabled={formState.loading}
       />
      </div>

      <div>
       <label className="block text-sm font-medium mb-2">
        Date de l&apos;événement (Mois / Année)
       </label>
       <input
        type="month"
        name="eventDate"
        className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent"
        disabled={formState.loading}
       />
      </div>

      <div>
       <label className="block text-sm font-medium mb-2">
        Nombre d&apos;invités approximatif
       </label>
       <select
        name="guestCount"
        className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent"
        disabled={formState.loading}
       >
        <option value="">Sélectionner (optionnel)...</option>
        <option value="50">0 - 70 personnes</option>
        <option value="85">70 - 100 personnes</option>
        <option value="115">100 - 130 personnes</option>
        <option value="150">130+ personnes</option>
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
         name="venue-boulaie"
         className="mr-2 border-stone text-accent focus:ring-accent"
         disabled={formState.loading}
        />
        <span className="text-sm">Le Manoir de la Boulaie</span>
       </label>
       <label className="flex items-center">
        <input
         type="checkbox"
         name="venue-brulaire"
         className="mr-2 border-stone text-accent focus:ring-accent"
         disabled={formState.loading}
        />
        <span className="text-sm">Le Château de la Brûlaire</span>
       </label>
       <label className="flex items-center">
        <input
         type="checkbox"
         name="venue-corbe"
         className="mr-2 border-stone text-accent focus:ring-accent"
         disabled={formState.loading}
        />
        <span className="text-sm">Le Château de la Corbe</span>
       </label>
       <label className="flex items-center">
        <input
         type="checkbox"
         name="venue-nantais"
         className="mr-2 border-stone text-accent focus:ring-accent"
         disabled={formState.loading}
        />
        <span className="text-sm">Le Domaine Nantais</span>
       </label>
       <label className="flex items-center">
        <input
         type="checkbox"
         name="venue-dome"
         className="mr-2 border-stone text-accent focus:ring-accent"
         disabled={formState.loading}
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
       name="message"
       rows={5}
       className="w-full px-4 py-3 bg-white border-2 border-stone focus:ring-2 focus:ring-accent focus:border-accent"
       placeholder="Parlez-nous de votre projet, de vos envies, de vos besoins spécifiques..."
       disabled={formState.loading}
      />
     </div>

     {/* Honeypot anti-bot (champ caché) */}
     <input
      type="text"
      name="website"
      id="website-prive"
      autoComplete="off"
      tabIndex={-1}
      aria-hidden="true"
      className="absolute -left-[9999px] w-1 h-1 opacity-0 pointer-events-none"
      placeholder="Laissez ce champ vide"
     />

     {formState.success && (
      <div className="p-4 bg-green-50 border-2 border-green-500 text-green-800">
       ✅ Votre demande a été envoyée avec succès ! Nous vous contacterons sous 24-48h.
      </div>
     )}

     {formState.error && (
      <div className="p-4 bg-red-50 border-2 border-red-500 text-red-800">
       ❌ {formState.error}
      </div>
     )}

     <button
      type="submit"
      disabled={formState.loading}
      className="btn btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
     >
      {formState.loading ? 'Envoi en cours...' : 'Demander un devis'}
     </button>
    </form>
   )}

  </div>
 );
}
