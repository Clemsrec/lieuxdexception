import type { Metadata } from 'next';
import { getPageContent } from '@/lib/firestore';

/**
 * Métadonnées pour la page Mentions Légales
 */
export const metadata: Metadata = {
 title: 'Mentions Légales | Lieux d\'Exception - Groupe Riou',
 description: 'Mentions légales du site Lieux d\'Exception, informations sur l\'éditeur, l\'hébergeur et les conditions d\'utilisation.',
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
 * Page Mentions Légales
 * Contenu géré via Firestore
 */
export default async function MentionsLegalesPage({
 params,
}: {
 params: Promise<{ locale: string }>;
}) {
 const { locale } = await params;
 
 // Charger le contenu depuis Firestore
 const pageContent = await getPageContent('mentions-legales', locale === 'fr' ? 'fr' : 'en');

 return (
  <main className="min-h-screen">
   <section className="section">
    <div className="container">
     {/* Header */}
     <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">{pageContent?.title || 'Mentions Légales'}</h1>
      <p className="text-secondary">
       {pageContent?.subtitle || 'Informations légales obligatoires du site Lieux d\'Exception'}
      </p>
      {pageContent?.lastUpdated && (
       <p className="text-sm text-accent mt-2">
        Dernière mise à jour : {new Date(pageContent.lastUpdated).toLocaleDateString('fr-FR')}
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