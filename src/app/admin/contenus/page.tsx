import { Metadata } from 'next';
import PageContentManager from '@/components/admin/PageContentManager';

/**
 * Métadonnées de la page de gestion des contenus
 */
export const metadata: Metadata = {
  title: 'Gestion des Contenus - Admin Lieux d\'Exception',
  description: 'Gérer les contenus des pages publiques (Homepage, Contact, Mariages, B2B, Histoire)',
};

/**
 * Page Admin - Gestion des Contenus
 * 
 * Cette page permet de gérer tous les contenus des pages publiques :
 * - Homepage
 * - Contact
 * - Mariages
 * - Événements B2B
 * - Histoire
 * 
 * Utilise un éditeur de texte riche (TipTap) pour éditer les contenus
 */
export default function ContenusPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Gestion des Contenus
          </h1>
          <p className="text-secondary">
            Modifiez les textes, images et contenus de toutes les pages publiques du site
          </p>
        </div>

        {/* Composant principal */}
        <PageContentManager />
      </div>
    </div>
  );
}
