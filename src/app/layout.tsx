import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

/**
 * Métadonnées principales pour le site Lieux d'Exception
 * Site catalogue B2B du Groupe Riou présentant 5 lieux événementiels
 */
export const metadata: Metadata = {
  title: "Lieux d'Exception - Groupe Riou | Catalogue B2B",
  description: "Découvrez notre collection de 5 lieux événementiels d'exception en France. Séminaires, conférences, mariages et réceptions privées. Groupe Riou - Excellence événementielle.",
  keywords: "lieux événementiels, séminaires, mariages, groupe riou, événements professionnels, réceptions",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' }
    ],
  },
  authors: [{ name: "Groupe Riou" }],
  creator: "Groupe Riou",
  publisher: "Groupe Riou",
  openGraph: {
    title: "Lieux d'Exception - Groupe Riou",
    description: "Collection de 5 lieux événementiels d'exception en France",
    type: "website",
    locale: "fr_FR",
    siteName: "Lieux d'Exception",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lieux d'Exception - Groupe Riou",
    description: "Collection de 5 lieux événementiels d'exception en France",
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
};

/**
 * Layout racine de l'application Next.js
 * Définit la structure HTML de base, la navigation et les styles globaux
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {/* Enregistrement Service Worker pour FCM */}
        <ServiceWorkerRegistration />
        
        {/* Navigation principale */}
        <Navigation />
        
        {/* Contenu principal */}
        <main>
          {children}
        </main>
        
        {/* Footer principal */}
        <Footer />
      </body>
    </html>
  );
}