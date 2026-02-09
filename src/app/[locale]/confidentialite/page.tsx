import type { Metadata } from 'next';
import { getPageContent } from '@/lib/firestore';

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
 * Revalidation : 60 secondes
 * Les données Firestore sont rafraîchies toutes les minutes
 */
export const revalidate = 60;

/**
 * Page Politique de Confidentialité
 * Contenu géré via Firestore
 */
export default async function ConfidentialitePage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 
 // Charger le contenu depuis Firestore
 const pageContent = await getPageContent('confidentialite', locale === 'fr' ? 'fr' : 'en');

 return (
  <main className="min-h-screen">
   <section className="section">
    <div className="container">
     {/* Header */}
     <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">{pageContent?.title || 'Politique de Confidentialité'}</h1>
      <p className="text-secondary">
       {pageContent?.subtitle || 'Protection et traitement de vos données personnelles - Conforme RGPD'}
      </p>
      {pageContent?.lastUpdated && (
       <p className="text-sm text-accent mt-2">
        Version en vigueur depuis le {new Date(pageContent.lastUpdated).toLocaleDateString('fr-FR')}
       </p>
      )}
     </div>

     {/* Contenu dynamique depuis Firestore */}
     <div className="max-w-content mx-auto">
      {pageContent?.content && (
       <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: pageContent.content }}
       />
      )}
      
      {/* Fallback si pas de contenu Firestore */}
      {!pageContent?.content && (
       <div className="text-center text-secondary">
        <p>Contenu en cours de mise à jour...</p>
        <p className="text-sm mt-2">Veuillez configurer le contenu de cette page depuis le dashboard admin.</p>
       </div>
      )}
     </div>
    </div>
   </section>
  </main>
 );
}