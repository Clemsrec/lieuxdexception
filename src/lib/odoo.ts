import xmlrpc from 'xmlrpc';

/**
 * Service Odoo - Intégration CRM via XML-RPC API
 * 
 * Documentation : https://www.odoo.com/documentation/17.0/developer/reference/external_api.html
 * 
 * Architecture :
 * 1. Authentification via clé API
 * 2. Création leads dans crm.lead
 * 3. Gestion d'erreurs robuste (fallback si Odoo indisponible)
 * 
 * @module lib/odoo
 */

// Configuration depuis variables d'environnement
const ODOO_CONFIG = {
  url: process.env.ODOO_URL || '',
  db: process.env.ODOO_DB || '',
  username: process.env.ODOO_USERNAME || '',
  apiKey: process.env.ODOO_API_KEY || '',
};

/**
 * Vérifie si la configuration Odoo est complète
 */
export function isOdooConfigured(): boolean {
  return !!(
    ODOO_CONFIG.url &&
    ODOO_CONFIG.db &&
    ODOO_CONFIG.username &&
    ODOO_CONFIG.apiKey
  );
}

/**
 * Structure d'un lead B2B pour Odoo
 */
export interface OdooB2BLead {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  eventType: string;
  eventDate?: string;
  guestCount: number;
  budget?: string;
  message: string;
  venues?: string[];
}

/**
 * Structure d'un lead Mariage pour Odoo
 * bride/groom optionnels depuis simplification formulaire 2026-02
 */
export interface OdooWeddingLead {
  firstName?: string; // Contact principal (nouveau depuis simplification)
  lastName?: string;  // Contact principal (nouveau depuis simplification)
  bride?: {
    firstName?: string;
    lastName?: string;
  };
  groom?: {
    firstName?: string;
    lastName?: string;
  };
  email: string;
  phone: string;
  weddingDate?: string;
  guestCount: number;
  budget?: string;
  message: string;
  venues?: string[];
}

/**
 * Résultat de la création d'un lead Odoo
 */
export interface OdooLeadResult {
  success: boolean;
  leadId?: number;
  error?: string;
}

/**
 * Authentifie l'utilisateur sur Odoo et retourne son UID
 * 
 * @throws Error si l'authentification échoue
 */
async function authenticateOdoo(): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = `${ODOO_CONFIG.url}/xmlrpc/2/common`;
    console.log('🔍 Tentative authentification Odoo:', {
      url,
      db: ODOO_CONFIG.db,
      username: ODOO_CONFIG.username,
      apiKeyLength: ODOO_CONFIG.apiKey.length,
    });

    const client = xmlrpc.createClient({
      url,
      headers: {
        'User-Agent': 'Lieux d\'Exception Next.js App',
      },
    });

    client.methodCall(
      'authenticate',
      [ODOO_CONFIG.db, ODOO_CONFIG.username, ODOO_CONFIG.apiKey, {}],
      (error: any, value: any) => {
        if (error) {
          console.error('❌ Erreur authentification Odoo:', {
            error: error.message || error,
            code: error.code,
            faultString: error.faultString,
          });
          reject(error);
        } else if (!value) {
          console.error('❌ Authentification retourne valeur vide:', value);
          reject(new Error('Authentification Odoo échouée (UID vide)'));
        } else {
          console.log('✅ Authentification Odoo réussie, UID:', value);
          resolve(value);
        }
      }
    );
  });
}

/**
 * Crée un lead dans Odoo CRM
 * 
 * @param uid - User ID Odoo (obtenu via authenticate)
 * @param leadData - Données du lead à créer
 */
async function createOdooLead(uid: number, leadData: Record<string, any>): Promise<number> {
  return new Promise((resolve, reject) => {
    const client = xmlrpc.createClient({
      url: `${ODOO_CONFIG.url}/xmlrpc/2/object`,
      headers: {
        'User-Agent': 'Lieux d\'Exception Next.js App',
      },
    });

    client.methodCall(
      'execute_kw',
      [
        ODOO_CONFIG.db,
        uid,
        ODOO_CONFIG.apiKey,
        'crm.lead',
        'create',
        [leadData],
      ],
      (error: any, value: any) => {
        if (error) {
          console.error('❌ Erreur création lead Odoo:', error);
          reject(error);
        } else {
          console.log('✅ Lead créé dans Odoo, ID:', value);
          resolve(value);
        }
      }
    );
  });
}

/**
 * Crée un lead B2B dans Odoo CRM
 * 
 * @param lead - Données du lead B2B
 * @returns Résultat avec ID du lead créé ou erreur
 */
export async function createB2BLeadInOdoo(lead: OdooB2BLead): Promise<OdooLeadResult> {
  try {
    // Vérifier la configuration
    if (!isOdooConfigured()) {
      console.warn('⚠️ Configuration Odoo incomplète, lead non synchronisé');
      return {
        success: false,
        error: 'Configuration Odoo manquante',
      };
    }

    // Authentification
    const uid = await authenticateOdoo();

    // Préparer les données du lead
    const contactName = `${lead.firstName} ${lead.lastName}`;
    const leadName = lead.company 
      ? `Demande B2B - ${lead.company} (${contactName})`
      : `Demande B2B - ${contactName}`;

    const description = `
=== Demande d'Événement B2B ===

Contact: ${contactName}
Email: ${lead.email}
Téléphone: ${lead.phone}
${lead.company ? `Entreprise: ${lead.company}` : ''}
${lead.position ? `Poste: ${lead.position}` : ''}

Type d'événement: ${lead.eventType}
${lead.eventDate ? `Date souhaitée: ${lead.eventDate}` : ''}
Nombre de participants: ${lead.guestCount}
${lead.budget ? `Budget: ${lead.budget}` : ''}

${lead.venues && lead.venues.length > 0 ? `Lieux sélectionnés:\n${lead.venues.map(v => `- ${v}`).join('\n')}` : ''}

Message:
${lead.message}

---
Source: Site Web Lieux d'Exception
Date: ${new Date().toLocaleString('fr-FR')}
    `.trim();

    const leadData = {
      name: leadName,
      contact_name: contactName,
      email_from: lead.email,
      phone: lead.phone || '',
      partner_name: lead.company || '',
      function: lead.position || '',
      description: description, // Notes internes (onglet Description)
      priority: '1', // Marqueur haute priorité
      referred: 'Site Web Lieux d\'Exception', // Champ référent visible
      type: 'opportunity', // 'opportunity' ou 'lead' selon config Odoo
    };

    // Créer le lead
    const leadId = await createOdooLead(uid, leadData);

    return {
      success: true,
      leadId,
    };

  } catch (error: any) {
    console.error('❌ Erreur création lead B2B Odoo:', error);
    return {
      success: false,
      error: error.message || 'Erreur inconnue',
    };
  }
}

/**
 * Crée un lead Mariage dans Odoo CRM
 * 
 * @param lead - Données du lead mariage
 * @returns Résultat avec ID du lead créé ou erreur
 */
export async function createWeddingLeadInOdoo(lead: OdooWeddingLead): Promise<OdooLeadResult> {
  try {
    // Vérifier la configuration
    if (!isOdooConfigured()) {
      console.warn('⚠️ Configuration Odoo incomplète, lead non synchronisé');
      return {
        success: false,
        error: 'Configuration Odoo manquante',
      };
    }

    // Authentification
    const uid = await authenticateOdoo();

    // Construire le nom du contact (avec fallback sur firstName/lastName si bride/groom absents)
    const brideInfo = lead.bride?.firstName 
      ? `${lead.bride.firstName} ${lead.bride.lastName || ''}`
      : lead.firstName || '';
    const groomInfo = lead.groom?.firstName 
      ? `${lead.groom.firstName} ${lead.groom.lastName || ''}`
      : lead.lastName || '';
    
    const contactName = brideInfo && groomInfo 
      ? `${brideInfo} & ${groomInfo}`.trim()
      : (brideInfo || groomInfo || `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Contact anonyme');
    
    const leadName = `Demande Mariage - ${contactName}`;

    // Description adaptée au nouveau format
    let description = '=== Demande de Mariage ===\n\n';
    
    if (lead.bride?.firstName || lead.groom?.firstName) {
      if (lead.bride?.firstName) {
        description += `Mariée: ${lead.bride.firstName} ${lead.bride.lastName || ''}\n`;
      }
      if (lead.groom?.firstName) {
        description += `Marié: ${lead.groom.firstName} ${lead.groom.lastName || ''}\n`;
      }
    } else if (lead.firstName || lead.lastName) {
      description += `Contact: ${lead.firstName || ''} ${lead.lastName || ''}\n`;
    }
    
    description += `Email: ${lead.email}\n`;
    description += `Téléphone: ${lead.phone}\n\n`;
    description += `${lead.weddingDate ? `Date du mariage: ${lead.weddingDate}` : 'Date à définir'}\n`;
    description += `Nombre d'invités: ${lead.guestCount || 'Non spécifié'}\n`;
    
    if (lead.budget) {
      description += `Budget: ${lead.budget}\n`;
    }

    if (lead.venues && lead.venues.length > 0) {
      description += `\nLieux sélectionnés:\n${lead.venues.map(v => `- ${v}`).join('\n')}\n`;
    }

    description += `\nMessage:\n${lead.message}\n\n`;
    description += `---\nSource: Site Web Lieux d'Exception\nDate: ${new Date().toLocaleString('fr-FR')}`;

    const leadData = {
      name: leadName,
      contact_name: contactName,
      email_from: lead.email,
      phone: lead.phone || '',
      description: description.trim(), // Notes internes (onglet Description)
      priority: '2', // Priorité normale pour mariages
      referred: 'Site Web Lieux d\'Exception - Formulaire Mariages', // Champ référent visible
      type: 'opportunity', // 'opportunity' ou 'lead' selon config Odoo
    };

    // Créer le lead
    const leadId = await createOdooLead(uid, leadData);

    return {
      success: true,
      leadId,
    };

  } catch (error: any) {
    console.error('❌ Erreur création lead Mariage Odoo:', error);
    return {
      success: false,
      error: error.message || 'Erreur inconnue',
    };
  }
}

/**
 * Teste la connexion à Odoo
 * 
 * @returns true si connexion OK, false sinon
 */
export async function testOdooConnection(): Promise<boolean> {
  try {
    if (!isOdooConfigured()) {
      console.error('❌ Configuration Odoo incomplète');
      return false;
    }

    const uid = await authenticateOdoo();
    console.log('✅ Test connexion Odoo réussi, UID:', uid);
    return true;

  } catch (error) {
    console.error('❌ Test connexion Odoo échoué:', error);
    return false;
  }
}
