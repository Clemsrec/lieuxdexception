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
export async function getVenues(filters?: VenueFilters): Promise<Venue[]> {
  try {
    ensureAdminInitialized();
    
    let query = adminDb!.collection('venues').where('active', '==', true);
    
    // Appliquer les filtres
    if (filters?.eventType && filters.eventType !== 'all') {
      query = query.where('eventTypes', 'array-contains', 
        filters.eventType === 'b2b' ? 'b2b' : 'mariage');
    }
    
    if (filters?.region) {
      query = query.where('region', '==', filters.region);
    }
    
    if (filters?.featured) {
      query = query.where('featured', '==', true);
    }
    
    // Tri par ordre alphabétique
    query = query.orderBy('name', 'asc');
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Venue));
  } catch (error) {
    console.error('Erreur lors de la récupération des lieux:', error);
    throw new Error('Impossible de récupérer les lieux d\'exception');
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
      return { id: doc.id, ...doc.data() } as Venue;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du lieu:', error);
    throw new Error('Impossible de récupérer le lieu');
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
      return { id: doc.id, ...doc.data() } as Venue;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du lieu par slug:', error);
    throw new Error('Impossible de récupérer le lieu');
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
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Venue));
  } catch (error) {
    console.error('Erreur lors de la récupération des lieux mis en avant:', error);
    throw new Error('Impossible de récupérer les lieux mis en avant');
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
