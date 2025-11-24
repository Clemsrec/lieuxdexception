import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db as clientDb } from '@/lib/firebase-client';

/**
 * API pour synchroniser un lead vers Odoo
 * 
 * POST /api/odoo/sync-lead
 * Body: { leadId, leadData }
 * 
 * Intégration avec Odoo via API REST
 * Documentation: https://www.odoo.com/documentation/16.0/developer/reference/external_api.html
 */

interface OdooConfig {
  url: string;
  db: string;
  username: string;
  apiKey: string;
}

// Configuration Odoo depuis variables d'environnement
const odooConfig: OdooConfig = {
  url: process.env.ODOO_URL || '',
  db: process.env.ODOO_DB || '',
  username: process.env.ODOO_USERNAME || '',
  apiKey: process.env.ODOO_API_KEY || '',
};

// Vérifier si Odoo est configuré
const isOdooConfigured = () => {
  return !!(odooConfig.url && odooConfig.db && odooConfig.username && odooConfig.apiKey);
};

/**
 * Authentification Odoo et récupération de l'uid
 */
async function authenticateOdoo(): Promise<number | null> {
  try {
    const response = await fetch(`${odooConfig.url}/web/session/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        params: {
          db: odooConfig.db,
          login: odooConfig.username,
          password: odooConfig.apiKey,
        },
      }),
    });

    const data = await response.json();
    return data.result?.uid || null;
  } catch (error) {
    console.error('[Odoo] Erreur authentification:', error);
    return null;
  }
}

/**
 * Créer un lead/opportunité dans Odoo
 */
async function createOdooLead(leadData: any, sessionId: number): Promise<boolean> {
  try {
    const odooLeadData = {
      name: `${leadData.eventDetails?.eventType || 'Événement'} - ${leadData.contactInfo.firstName} ${leadData.contactInfo.lastName}`,
      contact_name: `${leadData.contactInfo.firstName} ${leadData.contactInfo.lastName}`,
      email_from: leadData.contactInfo.email,
      phone: leadData.contactInfo.phone,
      description: `
Type d'événement: ${leadData.type === 'b2b' ? 'B2B/Séminaire' : 'Mariage'}
Date souhaitée: ${leadData.eventDetails?.eventDate || 'Non spécifiée'}
Nombre d'invités: ${leadData.eventDetails?.guestCount || 'Non spécifié'}
Budget: ${leadData.eventDetails?.budget || 'Non spécifié'}
Message: ${leadData.message || 'Aucun message'}

Source: Site web Lieux d'Exception
      `.trim(),
      type: 'opportunity',
      stage_id: 1, // Stage "Nouveau" par défaut (à adapter selon votre config Odoo)
    };

    const response = await fetch(`${odooConfig.url}/web/dataset/call_kw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        params: {
          model: 'crm.lead',
          method: 'create',
          args: [odooLeadData],
          kwargs: {},
        },
      }),
    });

    const data = await response.json();
    return !!data.result;
  } catch (error) {
    console.error('[Odoo] Erreur création lead:', error);
    return false;
  }
}

/**
 * Endpoint principal de synchronisation
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier configuration Odoo
    if (!isOdooConfigured()) {
      return NextResponse.json(
        { 
          error: 'Odoo non configuré',
          message: 'Configurez les variables d\'environnement ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_API_KEY'
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { leadId, leadData } = body;

    if (!leadData) {
      return NextResponse.json(
        { error: 'Données du lead manquantes' },
        { status: 400 }
      );
    }

    // 1. Authentification Odoo
    const sessionId = await authenticateOdoo();
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Échec authentification Odoo' },
        { status: 500 }
      );
    }

    // 2. Créer le lead dans Odoo
    const success = await createOdooLead(leadData, sessionId);

    if (!success) {
      return NextResponse.json(
        { error: 'Échec création lead dans Odoo' },
        { status: 500 }
      );
    }

    // 3. Logger la synchronisation dans Firestore (optionnel)
    if (clientDb && leadId) {
      await addDoc(collection(clientDb, 'odoo_sync_logs'), {
        leadId,
        syncedAt: Timestamp.now(),
        status: 'success',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Lead synchronisé avec Odoo',
      leadId,
    });

  } catch (error: any) {
    console.error('[Odoo] Erreur sync:', error);
    return NextResponse.json(
      { error: 'Erreur synchronisation Odoo', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET: Vérifier l'état de la configuration Odoo
 */
export async function GET() {
  return NextResponse.json({
    configured: isOdooConfigured(),
    url: odooConfig.url ? '✓' : '✗',
    db: odooConfig.db ? '✓' : '✗',
    username: odooConfig.username ? '✓' : '✗',
    apiKey: odooConfig.apiKey ? '✓' : '✗',
  });
}
