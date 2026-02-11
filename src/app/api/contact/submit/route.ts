import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { validateData, b2bFormSchema, weddingFormSchema, sanitizeString } from '@/lib/validation';
import { checkContactFormRateLimit, getClientIp } from '@/lib/rate-limit';
import { createB2BLeadInOdoo, createWeddingLeadInOdoo, isOdooConfigured } from '@/lib/odoo';

/**
 * API Route : Soumission formulaire de contact
 * POST /api/contact/submit
 * 
 * Sécurité :
 * - Rate limiting par IP (3 req/min via Upstash Redis)
 * - Validation stricte Zod
 * - Sanitization XSS
 * - Protection doublon email (24h)
 * - Honeypot anti-bot
 * 
 * Workflow :
 * 1. Sauvegarde lead en Firestore (rapide, toujours réussi)
 * 2. Synchronisation Odoo CRM (asynchrone, avec gestion d'erreur)
 * 3. Notification FCM aux admins
 */

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting par IP (3 soumissions/min max)
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkContactFormRateLimit(clientIp);
    
    if (!rateLimitResult.success) {
      console.warn(`[Security] Rate limit dépassé: ${clientIp}`);
      const resetIn = Math.ceil((rateLimitResult.reset * 1000 - Date.now()) / 1000);
      return NextResponse.json(
        { 
          error: 'Trop de requêtes',
          message: `Veuillez patienter ${Math.ceil(resetIn / 60)} minute(s) avant de réessayer.`,
          retryAfter: resetIn,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': resetIn.toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const body = await request.json();
    const { type, website, ...rawFormData } = body;

    // 2. Honeypot anti-bot (champ caché 'website')
    if (website) {
      console.warn('[Security] Bot détecté via honeypot:', { 
        ip: clientIp,
        website 
      });
      return NextResponse.json(
        { error: 'Erreur de validation' },
        { status: 400 }
      );
    }

    // 2.5. Nettoyer les chaînes vides AVANT validation (les convertir en undefined)
    const formData: any = { ...rawFormData };
    Object.keys(formData).forEach(key => {
      if (formData[key] === '' || formData[key] === null) {
        delete formData[key];
      }
      // Nettoyer aussi dans les sous-objets (bride, groom)
      if (typeof formData[key] === 'object' && formData[key] !== null && !Array.isArray(formData[key])) {
        Object.keys(formData[key]).forEach(subKey => {
          if (formData[key][subKey] === '' || formData[key][subKey] === null) {
            delete formData[key][subKey];
          }
        });
        // Supprimer l'objet parent s'il est vide
        if (Object.keys(formData[key]).length === 0) {
          delete formData[key];
        }
      }
    });

    // 3. Validation selon le type de formulaire
    let validationResult;
    if (type === 'b2b') {
      validationResult = validateData(b2bFormSchema, formData);
    } else if (type === 'mariage') {
      validationResult = validateData(weddingFormSchema, formData);
    } else {
      console.warn('[Security] Type formulaire invalide:', { type, ip: clientIp });
      return NextResponse.json(
        { error: 'Type de formulaire invalide' },
        { status: 400 }
      );
    }

    if (!validationResult.success) {
      console.warn('[Security] Validation Zod échouée:', {
        ip: clientIp,
        type,
        errors: validationResult.errors,
        receivedData: Object.keys(formData), // Log des clés reçues pour debug
      });
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.errors },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // 3. Sanitization XSS des champs texte libre
    if ((validatedData as any).message) {
      (validatedData as any).message = sanitizeString((validatedData as any).message);
    }
    if ((validatedData as any).requirements) {
      (validatedData as any).requirements = sanitizeString((validatedData as any).requirements);
    }
    if ((validatedData as any).company) {
      (validatedData as any).company = sanitizeString((validatedData as any).company);
    }

    // Vérifier doublon récent (même email dans les 24h)
    if (db) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const email = validatedData.email;

      const duplicateQuery = query(
        collection(db, 'leads'),
        where('email', '==', email),
        where('createdAt', '>=', Timestamp.fromDate(yesterday))
      );

      const duplicates = await getDocs(duplicateQuery);
      if (!duplicates.empty) {
        return NextResponse.json(
          { 
            error: 'Vous avez déjà envoyé une demande récemment',
            message: 'Nous vous contacterons sous 24-48h.'
          },
          { status: 429 }
        );
      }
    }

    // Créer le lead en Firestore
    const leadData = {
      type,
      ...validatedData,
      status: 'new',
      source: 'website_form',
      syncedToOdoo: false, // Sera mis à true après sync Odoo
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    let leadId = '';
    if (db) {
      const leadsCollection = collection(db, 'leads');
      const docRef = await addDoc(leadsCollection, leadData);
      leadId = docRef.id;
      console.log('✅ Lead sauvegardé dans Firestore:', leadId);
    }

    // Synchroniser avec Odoo CRM (mode synchrone avec timeout)
    try {
      console.log('🔄 Synchronisation Odoo en cours...');
      await Promise.race([
        syncLeadToOdoo(leadId, type, validatedData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout sync Odoo')), 8000)
        )
      ]);
      console.log('✅ Synchronisation Odoo réussie');
    } catch (error) {
      console.error('❌ Erreur sync Odoo:', error);
      // Continuer même si Odoo échoue - le lead est sauvé dans Firestore
    }

    // Envoyer notification FCM aux admins
    const leadNotifData = type === 'b2b' 
      ? {
          leadId,
          type,
          contactName: `${(validatedData as any).firstName} ${(validatedData as any).lastName}`,
          email: validatedData.email,
          company: (validatedData as any).company,
          eventDate: (validatedData as any).eventDate,
        }
      : {
          leadId,
          type,
          // Contact principal (firstName/lastName toujours présents)
          contactName: (validatedData as any).bride?.firstName && (validatedData as any).groom?.firstName
            ? `${(validatedData as any).bride.firstName} ${(validatedData as any).bride.lastName || ''} & ${(validatedData as any).groom.firstName} ${(validatedData as any).groom.lastName || ''}`
            : `${(validatedData as any).firstName} ${(validatedData as any).lastName}`,
          email: validatedData.email,
          company: undefined,
          eventDate: (validatedData as any).weddingDate,
        };

    await sendLeadNotificationToAdmins(leadNotifData);

    return NextResponse.json({
      success: true,
      message: 'Votre demande a été envoyée avec succès !',
      leadId,
    });

  } catch (error: any) {
    console.error('❌ Erreur soumission formulaire:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Envoie une notification push à tous les admins
 * quand un nouveau lead arrive
 */
async function sendLeadNotificationToAdmins(leadInfo: {
  leadId: string;
  type: string;
  contactName: string;
  email: string;
  company?: string;
  eventDate?: string;
}) {
  try {
    if (!db) return;

    // Récupérer tous les tokens FCM des admins
    const tokensSnapshot = await getDocs(
      query(collection(db, 'fcm_tokens'), where('active', '==', true))
    );

    const adminTokens = tokensSnapshot.docs.map(doc => doc.data().token);

    if (adminTokens.length === 0) {
      console.log('⚠️ Aucun token FCM actif pour notifier les admins');
      return;
    }

    // Préparer le message selon le type
    const isB2B = leadInfo.type === 'b2b';
    const title = isB2B 
      ? '🎯 Nouveau Lead B2B' 
      : '💒 Nouvelle Demande Mariage';
    
    let message = `${leadInfo.contactName}`;
    if (isB2B && leadInfo.company) {
      message += ` - ${leadInfo.company}`;
    }
    if (leadInfo.eventDate) {
      message += ` • ${leadInfo.eventDate}`;
    }
    message += ` • ${leadInfo.email}`;

    // Envoyer via l'API notifications
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/notifications/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: En production, utiliser un service account token
      },
      body: JSON.stringify({
        fcmTokens: adminTokens,
        title,
        message,
        type: 'new_lead',
        clickAction: `/admin/leads/${leadInfo.leadId}`,
        data: {
          leadId: leadInfo.leadId,
          leadType: leadInfo.type,
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (response.ok) {
      console.log('✅ Notification envoyée aux admins');
    } else {
      console.error('❌ Erreur envoi notification:', await response.text());
    }

  } catch (error) {
    console.error('❌ Erreur notification admins:', error);
    // Ne pas bloquer la création du lead si la notification échoue
  }
}

/**
 * Synchronise un lead Firestore avec Odoo CRM
 * Fonction asynchrone qui ne bloque pas la réponse utilisateur
 */
async function syncLeadToOdoo(
  leadId: string, 
  type: string, 
  validatedData: any
): Promise<void> {
  try {
    console.log(`🔄 Début syncLeadToOdoo pour ${type} (leadId: ${leadId})`);
    
    // Vérifier si Odoo est configuré
    if (!isOdooConfigured()) {
      console.warn('⚠️ Odoo non configuré, lead non synchronisé');
      throw new Error('Configuration Odoo manquante');
    }

    console.log('✅ Configuration Odoo validée');

    let odooResult;

    if (type === 'b2b') {
      console.log('🎯 Création lead B2B dans Odoo...');
      // Mapper les données B2B pour Odoo
      const odooLead = {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone || '',
        company: validatedData.company,
        position: validatedData.position,
        eventType: validatedData.eventType || 'Séminaire',
        eventDate: validatedData.eventDate,
        guestCount: validatedData.guestCount ? parseInt(validatedData.guestCount) : 0,
        budget: validatedData.budget,
        message: validatedData.message || validatedData.requirements || '',
        venues: validatedData.venues,
      };

      console.log('📋 Données B2B préparées:', JSON.stringify(odooLead, null, 2));
      odooResult = await createB2BLeadInOdoo(odooLead);
      console.log('📤 Résultat création B2B:', odooResult);

    } else if (type === 'mariage') {
      console.log('💒 Création lead Mariage dans Odoo...');
      // Mapper les données Mariage pour Odoo
      const odooLead = {
        // Nouveau schéma : firstName/lastName sont maintenant les champs principaux
        firstName: validatedData.firstName || validatedData.bride?.firstName || '',
        lastName: validatedData.lastName || validatedData.bride?.lastName || '',
        bride: validatedData.bride || {
          firstName: validatedData.firstName || '',
          lastName: validatedData.lastName || '',
        },
        groom: validatedData.groom || {
          firstName: '',
          lastName: '',
        },
        email: validatedData.email,
        phone: validatedData.phone || '',
        weddingDate: validatedData.weddingDate,
        guestCount: validatedData.guestCount ? parseInt(validatedData.guestCount) : 0,
        budget: validatedData.budget,
        message: validatedData.message || '',
        venues: validatedData.venues,
      };

      console.log('📋 Données Mariage préparées:', JSON.stringify(odooLead, null, 2));
      odooResult = await createWeddingLeadInOdoo(odooLead);
      console.log('📤 Résultat création Mariage:', odooResult);
    } else {
      console.error('Type de lead inconnu pour Odoo:', type);
      return;
    }

    // Mettre à jour Firestore avec l'ID Odoo
    if (odooResult.success && odooResult.leadId && db) {
      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, {
        odooId: odooResult.leadId,
        syncedToOdoo: true,
        lastSyncAt: Timestamp.now(),
      });
      console.log(`✅ Lead ${leadId} synchronisé avec Odoo (ID: ${odooResult.leadId})`);
    } else {
      console.error('❌ Échec synchronisation Odoo:', odooResult.error);
    }

  } catch (error) {
    console.error('❌ Erreur syncLeadToOdoo:', error);
    // Ne pas propager l'erreur (ne doit pas bloquer la création du lead)
  }
}
