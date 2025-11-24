import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { getMessaging } from 'firebase-admin/messaging';

/**
 * API Route : Envoi de notifications FCM
 * POST /api/notifications/send
 * 
 * Utilise Firebase Admin SDK pour envoyer des notifications
 * aux admins quand un nouveau lead arrive
 */

export async function POST(request: NextRequest) {
  try {
    // Vérifier authentification (sécurité)
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Vérifier Firebase Admin disponible
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Service d\'authentification non disponible' },
        { status: 503 }
      );
    }
    
    // Vérifier que l'utilisateur est admin
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
      if (!decodedToken.admin) {
        return NextResponse.json(
          { error: 'Accès réservé aux administrateurs' },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Récupérer le payload de la notification
    const body = await request.json();
    const { 
      fcmTokens, // Tableau de tokens FCM des destinataires
      title, 
      message, 
      type, 
      data,
      clickAction 
    } = body;

    // Validation
    if (!fcmTokens || !Array.isArray(fcmTokens) || fcmTokens.length === 0) {
      return NextResponse.json(
        { error: 'fcmTokens requis (array)' },
        { status: 400 }
      );
    }

    if (!title || !message) {
      return NextResponse.json(
        { error: 'title et message requis' },
        { status: 400 }
      );
    }

    // Préparer le message FCM
    const fcmMessage = {
      notification: {
        title,
        body: message,
        imageUrl: 'https://lieuxdexception.fr/logo/Logo_CLE_seule.png',
      },
      data: {
        type: type || 'info',
        clickAction: clickAction || '/admin/dashboard',
        timestamp: new Date().toISOString(),
        ...data,
      },
      webpush: {
        fcmOptions: {
          link: clickAction || '/admin/dashboard',
        },
        notification: {
          icon: '/logo/Logo_CLE_seule.png',
          badge: '/logo/Logo_CLE_seule.png',
          requireInteraction: true,
          tag: 'lieuxdexception-admin',
        },
      },
    };

    // Envoyer à tous les tokens (multicast)
    const messaging = getMessaging();
    const response = await messaging.sendEachForMulticast({
      tokens: fcmTokens,
      ...fcmMessage,
    });

    // Analyser les résultats
    const successCount = response.successCount;
    const failureCount = response.failureCount;
    const failedTokens: string[] = [];

    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        failedTokens.push(fcmTokens[idx]);
        console.error(`❌ Échec envoi au token ${fcmTokens[idx].substring(0, 20)}:`, resp.error);
      }
    });

    // TODO: Supprimer les tokens invalides de Firestore
    // if (failedTokens.length > 0) { ... }

    return NextResponse.json({
      success: true,
      successCount,
      failureCount,
      failedTokens,
      message: `${successCount} notification(s) envoyée(s) avec succès`,
    });

  } catch (error: any) {
    console.error('❌ Erreur envoi notifications FCM:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET : Tester la configuration FCM
 */
export async function GET() {
  try {
    const messaging = getMessaging();
    
    return NextResponse.json({
      configured: true,
      service: 'Firebase Cloud Messaging',
      apiVersion: 'V1',
      senderId: '886228169873',
    });
  } catch (error: any) {
    return NextResponse.json({
      configured: false,
      error: error.message,
    });
  }
}
