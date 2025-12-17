/**
 * Layout i18n racine pour toutes les routes localisées
 * Gère l'hydratation des traductions côté client via NextIntlClientProvider
 */

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { locales } from '@/i18n';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';

/**
 * Génération statique pour toutes les locales supportées
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Métadonnées SEO avec support multilingue
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Common.metadata' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico' },
      ],
      apple: '/apple-icon.png',
    },
    authors: [{ name: 'Groupe Riou' }],
    creator: 'Groupe Riou',
    publisher: 'Groupe Riou',
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale,
      siteName: 'Lieux d\'Exception',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      languages: {
        'fr': '/fr',
        'en': '/en',
        'es': '/es',
        'de': '/de',
        'it': '/it',
        'pt': '/pt',
      },
    },
  };
}

/**
 * Layout racine de l'application i18n
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Vérifier que la locale est valide
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Récupérer les messages pour la locale actuelle
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Enregistrement Service Worker pour FCM */}
      <ServiceWorkerRegistration />

      {/* Navigation globale */}
      <Navigation />

      {/* Contenu principal */}
      <main>{children}</main>

      {/* Footer principal */}
      <Footer />

      {/* Banner de consentement des cookies (RGPD) */}
      <CookieBanner />
    </NextIntlClientProvider>
  );
}
