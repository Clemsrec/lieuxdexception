import { Metadata } from 'next';
import TimelineManager from '@/components/admin/TimelineManager';

/**
 * Métadonnées de la page de gestion de la timeline
 */
export const metadata: Metadata = {
  title: 'Gestion Timeline - Admin Lieux d\'Exception',
  description: 'Gérer les événements affichés sur la timeline de la page Histoire',
};

/**
 * Page Admin - Gestion de la Timeline
 * 
 * Cette page permet de gérer tous les événements de la timeline :
 * - Ajouter/modifier/supprimer des événements
 * - Changer l'ordre chronologique
 * - Gérer la visibilité
 * - Définir les événements majeurs
 */
export default function TimelinePage() {
  return <TimelineManager />;
}
