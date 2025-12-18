/**
 * Services Firestore pour Lieux d'Exception
 * 
 * Ce fichier contient tous les services pour interagir avec la base de données
 * Firestore. Utilise l'Admin SDK côté serveur pour bypass les règles de sécurité.
 */

import { adminDb, ensureAdminInitialized } from './firebase-admin';
import type { Venue, Lead, VenueFilters, Analytics } from '@/types/firebase';

// =====================================
// SERVICES VENUES (Lieux d'Exception)
// =====================================

/**
 * Récupérer tous les lieux d'exception
 * @param filters Filtres optionnels pour la recherche
 * @returns Promise<Venue[]> Liste des lieux
 */
/**
 * Récupérer tous les lieux d'exception
 * @param filters Filtres optionnels pour la recherche
 * @param includeInactive Si true, inclut aussi les lieux inactifs (pour admin)
 * @param includeDeleted Si true, inclut aussi les lieux supprimés (soft delete)
 * @returns Promise<Venue[]> Liste des lieux
 */
export async function getVenues(
  filters?: VenueFilters, 
  includeInactive: boolean = false,
  includeDeleted: boolean = false
): Promise<Venue[]> {
  try {
    ensureAdminInitialized();
    
    // Pour l'admin, ne pas filtrer par 'active' pour voir tous les lieux
    let query = adminDb!.collection('venues');
    
    // NOTE: On ne filtre pas 'deleted' dans la query car ce champ n'existe pas dans les anciens lieux
    // Le filtrage se fera côté code après récupération
    
    // Filtrer par statut actif seulement si demandé (pour le site public)
    // IMPORTANT: Ne pas filtrer si includeInactive=true (admin)
    if (!includeInactive) {
      query = query.where('active', '==', true) as any;
    }
    
    // Appliquer les filtres
    if (filters?.eventType && filters.eventType !== 'all') {
      query = query.where('eventTypes', 'array-contains', 
        filters.eventType === 'b2b' ? 'b2b' : 'mariage') as any;
    }
    
    if (filters?.region) {
      query = query.where('region', '==', filters.region) as any;
    }
    
    if (filters?.featured !== undefined) {
      query = query.where('featured', '==', filters.featured) as any;
    }
    
    const snapshot = await query.get();
    console.log('🔥 [Firestore] Documents récupérés:', snapshot.size);
    
    // Convertir et trier côté code (évite les index composites Firestore)
    let venues = snapshot.docs.map(doc => {
      const data = doc.data();
      // Convertir les Timestamps Firestore en strings ISO pour la sérialisation
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : data.updatedAt,
        deletedAt: data.deletedAt?.toDate?.() ? data.deletedAt.toDate().toISOString() : data.deletedAt,
      } as Venue;
    });
    
    // Filtrer les lieux supprimés côté code (le champ 'deleted' peut ne pas exister)
    if (!includeDeleted) {
      venues = venues.filter(venue => !venue.deleted);
    }
    
    // Trier par displayOrder puis par nom
    return venues.sort((a, b) => {
      const orderA = a.displayOrder ?? 999;
      const orderB = b.displayOrder ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return (a.name || '').localeCompare(b.name || '');
    });
  } catch (error) {
    console.error('[Firestore] Erreur lors de la récupération des lieux:', error);
    // Retourner tableau vide en cas d'erreur (évite le crash de la page)
    return [];
  }
}

/**
 * Récupérer un lieu par son ID
 * @param id ID du lieu
 * @returns Promise<Venue | null> Le lieu ou null si non trouvé
 */
export async function getVenueById(id: string): Promise<Venue | null> {
  try {
    ensureAdminInitialized();
    
    const doc = await adminDb!.collection('venues').doc(id).get();
    if (doc.exists) {
      const data = doc.data()!;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as Venue;
    }
    return null;
  } catch (error) {
    console.error('[Firestore] Erreur lors de la récupération du lieu:', error);
    return null;
  }
}

/**
 * Récupérer un lieu par son slug
 * @param slug Slug du lieu (URL-friendly)
 * @returns Promise<Venue | null> Le lieu ou null si non trouvé
 */
export async function getVenueBySlug(slug: string): Promise<Venue | null> {
  try {
    ensureAdminInitialized();
    
    const snapshot = await adminDb!.collection('venues')
      .where('slug', '==', slug)
      .limit(1)
      .get();
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as Venue;
    }
    return null;
  } catch (error) {
    console.error('[Firestore] Erreur lors de la récupération du lieu par slug:', error);
    return null;
  }
}

/**
 * Récupérer les lieux mis en avant
 * @param maxResults Nombre maximum de résultats (défaut: 3)
 * @returns Promise<Venue[]> Liste des lieux mis en avant
 */
export async function getFeaturedVenues(maxResults: number = 3): Promise<Venue[]> {
  try {
    ensureAdminInitialized();
    
    const snapshot = await adminDb!.collection('venues')
      .where('featured', '==', true)
      .where('active', '==', true)
      .orderBy('name', 'asc')
      .limit(maxResults)
      .get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as Venue;
    });
  } catch (error) {
    console.error('[Firestore] Erreur lors de la récupération des lieux mis en avant:', error);
    return [];
  }
}

/**
 * Créer un nouveau lieu (admin uniquement)
 * @param venueData Données du lieu
 * @returns Promise<string> ID du lieu créé
 */
export async function createVenue(venueData: Omit<Venue, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    ensureAdminInitialized();
    
    const now = new Date().toISOString();
    const venue = {
      ...venueData,
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await adminDb!.collection('venues').add(venue);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création du lieu:', error);
    throw new Error('Impossible de créer le lieu');
  }
}

/**
 * Mettre à jour un lieu existant (admin uniquement)
 * @param venueId ID du lieu
 * @param updates Données à mettre à jour
 * @returns Promise<void>
 */
export async function updateVenue(venueId: string, updates: Partial<Venue>): Promise<void> {
  try {
    ensureAdminInitialized();
    
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // Supprimer les champs qui ne doivent pas être mis à jour
    delete (updateData as any).id;
    delete (updateData as any).createdAt;
    
    await adminDb!.collection('venues').doc(venueId).update(updateData);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du lieu:', error);
    throw new Error('Impossible de mettre à jour le lieu');
  }
}

/**
 * Supprimer un lieu (soft delete recommandé)
 * @param venueId ID du lieu
 * @param hardDelete Si true, suppression définitive. Sinon soft delete (recommandé)
 * @returns Promise<void>
 */
export async function deleteVenue(venueId: string, hardDelete: boolean = false): Promise<void> {
  try {
    ensureAdminInitialized();
    
    if (hardDelete) {
      // Suppression définitive (DANGEREUX - perte de données)
      await adminDb!.collection('venues').doc(venueId).delete();
    } else {
      // Soft delete (RECOMMANDÉ - conservation des données)
      await adminDb!.collection('venues').doc(venueId).update({
        active: false,
        deleted: true,
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du lieu:', error);
    throw new Error('Impossible de supprimer le lieu');
  }
}

/**
 * Restaurer un lieu supprimé (soft delete)
 * @param venueId ID du lieu
 * @returns Promise<void>
 */
export async function restoreVenue(venueId: string): Promise<void> {
  try {
    ensureAdminInitialized();
    
    await adminDb!.collection('venues').doc(venueId).update({
      deleted: false,
      deletedAt: null,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erreur lors de la restauration du lieu:', error);
    throw new Error('Impossible de restaurer le lieu');
  }
}

// =====================================
// SERVICES LEADS (Prospects)
// =====================================

/**
 * Créer un nouveau lead depuis un formulaire
 * @param leadData Données du lead
 * @returns Promise<string> ID du lead créé
 */
export async function createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    ensureAdminInitialized();
    
    const now = new Date().toISOString();
    const lead = {
      ...leadData,
      status: 'new' as const,
      syncedToOdoo: false,
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await adminDb!.collection('leads').add(lead);
    
    // TODO: Déclencher l'intégration Odoo ici
    // await syncLeadToOdoo(docRef.id, lead);
    
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création du lead:', error);
    throw new Error('Impossible de créer le lead');
  }
}

/**
 * Récupérer tous les leads avec pagination
 * @param page Page demandée (commence à 0)
 * @param pageSize Nombre d'éléments par page
 * @returns Promise<{leads: Lead[], hasMore: boolean}> Leads et indicateur de pagination
 */
export async function getLeads(page: number = 0, pageSize: number = 20): Promise<{leads: Lead[], hasMore: boolean}> {
  try {
    ensureAdminInitialized();
    
    let query = adminDb!.collection('leads')
      .orderBy('createdAt', 'desc')
      .limit(pageSize + 1); // +1 pour savoir s'il y a plus de résultats
    
    // Pagination avec startAfter si ce n'est pas la première page
    if (page > 0) {
      // TODO: Implémenter la pagination avec startAfter
      // Nécessite de stocker le dernier document de la page précédente
    }
    
    const snapshot = await query.get();
    const leads = snapshot.docs.slice(0, pageSize).map(doc => ({ id: doc.id, ...doc.data() } as Lead));
    const hasMore = snapshot.docs.length > pageSize;
    
    return { leads, hasMore };
  } catch (error) {
    console.error('Erreur lors de la récupération des leads:', error);
    throw new Error('Impossible de récupérer les leads');
  }
}

/**
 * Mettre à jour le statut d'un lead
 * @param leadId ID du lead
 * @param status Nouveau statut
 * @returns Promise<void>
 */
export async function updateLeadStatus(leadId: string, status: Lead['status']): Promise<void> {
  try {
    ensureAdminInitialized();
    
    await adminDb!.collection('leads').doc(leadId).update({
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du lead:', error);
    throw new Error('Impossible de mettre à jour le lead');
  }
}

// =====================================
// SERVICES ANALYTICS
// =====================================

/**
 * Enregistrer les métriques quotidiennes
 * @param date Date au format YYYY-MM-DD
 * @param metrics Métriques à enregistrer
 * @returns Promise<void>
 */
export async function saveAnalytics(date: string, metrics: Analytics['metrics']): Promise<void> {
  try {
    ensureAdminInitialized();
    
    await adminDb!.collection('analytics').doc(date).set({
      metrics,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des analytics:', error);
    throw new Error('Impossible de sauvegarder les analytics');
  }
}

// =====================================
// UTILITAIRES
// =====================================

/**
 * Tester la connexion à Firestore
 * @returns Promise<boolean> True si la connexion fonctionne
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    ensureAdminInitialized();
    
    // Tenter de lire une collection
    await adminDb!.collection('venues').limit(1).get();
    return true;
  } catch (error) {
    console.error('Erreur de connexion Firestore:', error);
    return false;
  }
}

/**
 * Formater une date ISO en date lisible
 * @param isoString Date au format ISO
 * @param locale Locale pour le formatage (défaut: 'fr-FR')
 * @returns string Date formatée
 */
export function formatDate(isoString: string, locale: string = 'fr-FR'): string {
  const date = new Date(isoString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// =====================================
// SERVICES PAGE CONTENTS (Contenus de Pages)
// =====================================

/**
 * Récupérer le contenu d'une page
 * @param pageId ID de la page ('homepage', 'contact', 'mariages', 'b2b')
 * @param locale Locale de la page (défaut: 'fr')
 * @returns Promise<PageContent | null> Le contenu de la page ou null si non trouvé
 */
export async function getPageContent(pageId: string, locale: string = 'fr'): Promise<any | null> {
  try {
    ensureAdminInitialized();
    
    const docId = `${pageId}_${locale}`;
    const doc = await adminDb!.collection('pageContents').doc(docId).get();
    
    if (!doc.exists) {
      console.warn(`[Firestore] Contenu de page non trouvé: ${docId}`);
      return null;
    }
    
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      updatedAt: data?.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : data?.updatedAt,
    };
  } catch (error) {
    console.error('[Firestore] Erreur lors de la récupération du contenu de page:', error);
    return null;
  }
}

/**
 * Récupérer tous les contenus de pages pour une locale donnée
 * @param locale Locale des pages (défaut: 'fr')
 * @returns Promise<PageContent[]> Liste des contenus de pages
 */
export async function getAllPageContents(locale: string = 'fr'): Promise<any[]> {
  try {
    ensureAdminInitialized();
    
    const snapshot = await adminDb!.collection('pageContents')
      .where('locale', '==', locale)
      .get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        updatedAt: data?.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : data?.updatedAt,
      };
    });
  } catch (error) {
    console.error('[Firestore] Erreur lors de la récupération des contenus de pages:', error);
    return [];
  }
}

/**
 * Créer ou mettre à jour le contenu d'une page
 * @param pageId ID de la page
 * @param locale Locale de la page
 * @param content Contenu de la page
 * @param userEmail Email de l'utilisateur qui met à jour
 * @returns Promise<string> ID du document
 */
export async function upsertPageContent(
  pageId: string,
  locale: string,
  content: any,
  userEmail: string
): Promise<string> {
  try {
    ensureAdminInitialized();
    
    const docId = `${pageId}_${locale}`;
    const now = new Date();
    
    // Récupérer le document existant pour obtenir la version
    const existingDoc = await adminDb!.collection('pageContents').doc(docId).get();
    const currentVersion = existingDoc.exists ? (existingDoc.data()?.version || 0) : 0;
    
    const pageContent = {
      id: pageId,
      pageName: content.pageName || pageId,
      locale,
      hero: content.hero || {},
      sections: content.sections || [],
      blocks: content.blocks || [],
      featureCards: content.featureCards || [],
      contactInfo: content.contactInfo || [],
      finalCta: content.finalCta || null,
      updatedAt: now,
      updatedBy: userEmail,
      version: currentVersion + 1,
    };
    
    await adminDb!.collection('pageContents').doc(docId).set(pageContent, { merge: true });
    
    console.log(`[Firestore] Contenu de page ${docId} mis à jour (version ${pageContent.version})`);
    return docId;
  } catch (error) {
    console.error('[Firestore] Erreur lors de la mise à jour du contenu de page:', error);
    throw new Error('Impossible de mettre à jour le contenu de la page');
  }
}

/**
 * Supprimer le contenu d'une page
 * @param pageId ID de la page
 * @param locale Locale de la page
 * @returns Promise<void>
 */
export async function deletePageContent(pageId: string, locale: string): Promise<void> {
  try {
    ensureAdminInitialized();
    
    const docId = `${pageId}_${locale}`;
    await adminDb!.collection('pageContents').doc(docId).delete();
    
    console.log(`[Firestore] Contenu de page ${docId} supprimé`);
  } catch (error) {
    console.error('[Firestore] Erreur lors de la suppression du contenu de page:', error);
    throw new Error('Impossible de supprimer le contenu de la page');
  }
}
