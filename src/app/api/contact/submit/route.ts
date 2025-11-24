import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { validateData, b2bFormSchema, weddingFormSchema } from '@/lib/validation';

/**
 * API Route : Soumission formulaire de contact
 * POST /api/contact/submit
 * 
 * Sauvegarde le lead en Firestore + envoie notification FCM aux admins
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...formData } = body;

    // Validation selon le type de formulaire
    let validationResult;
    if (type === 'b2b') {
      validationResult = validateData(b2bFormSchema, formData);
    } else if (type === 'mariage') {
      validationResult = validateData(weddingFormSchema, formData);
    } else {
      return NextResponse.json(
        { error: 'Type de formulaire invalide' },
        { status: 400 }
      );
    }

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.errors },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Vérifier doublon récent (même email dans les 24h)
    if (db) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const email = type === 'b2b' 
        ? validatedData.email 
        : validatedData.email;

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
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    let leadId = '';
    if (db) {
      const leadsCollection = collection(db, 'leads');
      const docRef = await addDoc(leadsCollection, leadData);
      leadId = docRef.id;
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
          contactName: `${(validatedData as any).bride.firstName} ${(validatedData as any).bride.lastName} & ${(validatedData as any).groom.firstName} ${(validatedData as any).groom.lastName}`,
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
