/**
 * Configuration next-intl pour Lieux d'Exception
 * 
 * Gère 6 langues : FR, EN, ES, DE, IT, PT
 * Détection automatique via Accept-Language header
 * Fallback vers français par défaut
 */

import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Langues supportées
export const locales = ['fr', 'en', 'es', 'de', 'it', 'pt'] as const;
export type Locale = (typeof locales)[number];

// Langue par défaut
export const defaultLocale: Locale = 'fr';

// Labels des langues pour le sélecteur
export const localeLabels: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português'
};

// Flags emoji pour UI (optionnel)
export const localeFlags: Record<Locale, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  es: '🇪🇸',
  de: '🇩🇪',
  it: '🇮🇹',
  pt: '🇵🇹'
};

/**
 * Configuration next-intl pour chaque requête
 * Charge les messages JSON correspondant à la locale
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;
 
  // Ensure that a locale is set
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
