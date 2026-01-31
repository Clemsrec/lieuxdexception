'use client';

import { useState, useEffect } from 'react';
import { 
 getConsent, 
 saveConsent, 
 resetConsent,
 type CookieConsent 
} from '@/lib/cookies';

/**
 * Composant de gestion des préférences de cookies
 * 
 * Permet à l'utilisateur de modifier ses préférences de cookies 
 * depuis la page /cookies
 */
export default function CookieSettings() {
 const [preferences, setPreferences] = useState<Omit<CookieConsent, 'timestamp'>>({
  essential: true,
  analytics: false,
  marketing: false,
  preferences: false,
 });
 const [saved, setSaved] = useState(false);
 const [consentDate, setConsentDate] = useState<string | null>(null);

 useEffect(() => {
  // Charger les préférences actuelles
  const currentConsent = getConsent();
  if (currentConsent) {
   setPreferences(currentConsent);
   setConsentDate(new Date(currentConsent.timestamp).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
   }));
  }
 }, []);

 const handleSave = () => {
  saveConsent(preferences);
  setSaved(true);
  
  // Mettre à jour la date
  setConsentDate(new Date().toLocaleDateString('fr-FR', {
   day: 'numeric',
   month: 'long',
   year: 'numeric',
  }));
  
  // Cacher le message après 3 secondes
  setTimeout(() => setSaved(false), 3000);
 };

 const handleReset = () => {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser vos préférences ? Le banner de consentement réapparaîtra.')) {
   resetConsent();
  }
 };

 return (
  <div className="bg-white border-2 border-primary/20 p-6">
   <h3 className="text-xl font-semibold text-foreground mb-4">
    ⚙️ Gérer mes préférences de cookies
   </h3>

   {consentDate && (
    <p className="text-sm text-secondary mb-6">
     Dernier consentement enregistré le {consentDate}
    </p>
   )}

   {/* Message de confirmation */}
   {saved && (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-sm">
     ✅ Vos préférences ont été enregistrées avec succès !
    </div>
   )}

   {/* Options de cookies */}
   <div className="space-y-4 mb-6">
    {/* Cookies essentiels */}
    <div className="flex items-start justify-between p-4 bg-muted border-2 border-green-200">
     <div className="flex-1 pr-4">
      <div className="flex items-center gap-2 mb-1">
       <span className="font-medium text-foreground">Cookies essentiels</span>
       <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 font-medium">
        Toujours actifs
       </span>
      </div>
      <p className="text-sm text-secondary leading-relaxed">
       Nécessaires au fonctionnement du site (navigation, sécurité, authentification). 
       Ces cookies ne peuvent pas être désactivés.
      </p>
     </div>
     <div className="flex items-center">
      <input
       type="checkbox"
       checked={true}
       disabled
       className="w-5 h-5 border-2 border-green-300 bg-green-100 cursor-not-allowed"
      />
     </div>
    </div>

    {/* Cookies analytiques */}
    <div className="flex items-start justify-between p-4 bg-muted border-2 border-gray-200">
     <div className="flex-1 pr-4">
      <div className="font-medium text-foreground mb-1">Cookies analytiques</div>
      <p className="text-sm text-secondary leading-relaxed">
       Nous aident à comprendre comment vous utilisez notre site pour l&apos;améliorer 
       (Google Analytics, mesure d&apos;audience).
      </p>
      <p className="text-xs text-secondary mt-2">
       <strong>Exemples :</strong> _ga, _gid, _gat (Google Analytics)
      </p>
     </div>
     <div className="flex items-center">
      <input
       type="checkbox"
       checked={preferences.analytics}
       onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
       className="w-5 h-5 border-2 border-gray-300 checked:bg-primary checked:border-primary cursor-pointer transition-colors"
      />
     </div>
    </div>

    {/* Cookies marketing */}
    <div className="flex items-start justify-between p-4 bg-muted border-2 border-gray-200">
     <div className="flex-1 pr-4">
      <div className="font-medium text-foreground mb-1">Cookies marketing</div>
      <p className="text-sm text-secondary leading-relaxed">
       Utilisés pour vous proposer des publicités personnalisées et suivre l&apos;efficacité 
       de nos campagnes (Facebook Pixel, Google Ads).
      </p>
      <p className="text-xs text-secondary mt-2">
       <strong>Exemples :</strong> _fbp, _fbc, fr (Facebook), ads, IDE (Google)
      </p>
     </div>
     <div className="flex items-center">
      <input
       type="checkbox"
       checked={preferences.marketing}
       onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
       className="w-5 h-5 border-2 border-gray-300 checked:bg-primary checked:border-primary cursor-pointer transition-colors"
      />
     </div>
    </div>

    {/* Cookies de préférences */}
    <div className="flex items-start justify-between p-4 bg-muted border-2 border-gray-200">
     <div className="flex-1 pr-4">
      <div className="font-medium text-foreground mb-1">Cookies de préférences</div>
      <p className="text-sm text-secondary leading-relaxed">
       Mémorisent vos choix et préférences pour vous offrir une expérience personnalisée 
       (langue, filtres de recherche, favoris).
      </p>
      <p className="text-xs text-secondary mt-2">
       <strong>Exemples :</strong> user-prefs, lang, filters
      </p>
     </div>
     <div className="flex items-center">
      <input
       type="checkbox"
       checked={preferences.preferences}
       onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
       className="w-5 h-5 border-2 border-gray-300 checked:bg-primary checked:border-primary cursor-pointer transition-colors"
      />
     </div>
    </div>
   </div>

   {/* Boutons d'action */}
   <div className="flex flex-col sm:flex-row gap-3">
    <button
     onClick={handleSave}
     className="px-6 py-3 text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors shadow-md"
    >
     Enregistrer mes préférences
    </button>
    <button
     onClick={handleReset}
     className="px-6 py-3 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 transition-colors"
    >
     Réinitialiser
    </button>
   </div>

   <p className="text-xs text-secondary mt-4 leading-relaxed">
    ℹ️ La modification de vos préférences prendra effet immédiatement. 
    Les cookies non autorisés seront supprimés de votre navigateur.
   </p>
  </div>
 );
}
