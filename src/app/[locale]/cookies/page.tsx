import type { Metadata } from 'next';
import { getPageContent } from '@/lib/firestore';
import CookieSettings from '@/components/CookieSettings';

/**
 * Métadonnées pour la page Politique des Cookies
 */
export const metadata: Metadata = {
 title: 'Politique des Cookies | Lieux d\'Exception',
 description: 'Information sur l\'utilisation des cookies sur le site Lieux d\'Exception et gestion de vos préférences.',
 robots: {
  index: false,
  follow: false,
 },
};

/**
 * Revalidation : 60 secondes
 * Les données Firestore sont rafraîchies toutes les minutes
 */
export const revalidate = 60;

/**
 * Page Politique des Cookies
 * Contenu géré via Firestore + composant CookieSettings
 */
export default async function CookiesPage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 
 // Charger le contenu depuis Firestore
 const pageContent = await getPageContent('cookies', locale === 'fr' ? 'fr' : 'en');

 return (
  <main className="min-h-screen">
   <section className="section">
    <div className="container">
     {/* Header */}
     <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">{pageContent?.title || 'Politique des Cookies'}</h1>
      <p className="text-secondary">
       {pageContent?.subtitle || 'Information sur l\'utilisation des cookies et gestion de vos préférences'}
      </p>
     </div>

     {/* Contenu dynamique depuis Firestore */}
     <div className="max-w-content mx-auto mb-12">
      {pageContent?.content && (
       <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: pageContent.content }}
       />
      )}
      
      {/* Fallback si pas de contenu Firestore */}
      {!pageContent?.content && (
       <div className="text-center text-secondary mb-8">
        <p>Contenu en cours de mise à jour...</p>
        <p className="text-sm mt-2">Veuillez configurer le contenu de cette page depuis le dashboard admin.</p>
       </div>
      )}
     </div>

     {/* Composant de gestion des cookies (fonctionnel) */}
     <div className="mt-12">
      <CookieSettings />
     </div>
    </div>
   </section>
  </main>
 );
}