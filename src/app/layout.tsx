/**
 * Layout racine - Redirige vers la locale par défaut
 * Toutes les pages sont maintenant dans app/[locale]/
 */

import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n';

export default function RootLayout() {
  // Redirection vers la locale par défaut
  redirect(`/${defaultLocale}`);
}