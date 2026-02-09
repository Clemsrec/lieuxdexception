import type { Metadata } from 'next';
import { getPageContent } from '@/lib/firestore';

/**
 * Métadonnées pour les CGV
 */
export const metadata: Metadata = {
 title: 'Conditions Générales de Vente | Lieux d\'Exception - Groupe Riou',
 description: 'Conditions générales de vente pour la réservation de nos lieux d\'exception destinés aux événements d\'entreprise.',
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
 * Page Conditions Générales de Vente
 * Contenu géré via Firestore
 */
export default async function CGVPage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 
 // Charger le contenu depuis Firestore
 const pageContent = await getPageContent('cgv', locale === 'fr' ? 'fr' : 'en');

 return (
  <main className="min-h-screen">
   <section className="section">
    <div className="container">
     {/* Header */}
     <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">{pageContent?.title || 'Conditions Générales de Vente'}</h1>
      <p className="text-secondary">
       {pageContent?.subtitle || 'Conditions contractuelles pour la réservation de nos lieux d\'exception'}
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