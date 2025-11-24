import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';

/**
 * API Route : Rapport d'erreurs de connexion suspectes
 * POST /api/admin/report-login-error
 * 
 * Envoie une notification aux admins si trop de tentatives échouées
 * (protection contre attaques brute-force)
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, ip, userAgent, attempts } = body;

    // Validation minimale
    if (!email || !ip || typeof attempts !== 'number') {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    // Seuil de déclenchement d'alerte
    const ALERT_THRESHOLD = 5;

    // Si c'est une attaque potentielle (>=5 tentatives)
    if (attempts >= ALERT_THRESHOLD) {
      // Logger en Firestore
      if (db) {
        await addDoc(collection(db, 'security_logs'), {
          type: 'failed_login_attempts',
          email,
          ip,
          userAgent,
          attempts,
          timestamp: Timestamp.now(),
          severity: attempts >= 10 ? 'critical' : 'warning',
        });
      }

      // Notifier les admins
      await sendSecurityAlertToAdmins({
        email,
        ip,
        attempts,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: 'Alerte sécurité envoyée',
        alertSent: true,
      });
    }

    return NextResponse.json({
      success: true,
      alertSent: false,
    });

  } catch (error: any) {
    console.error('❌ Erreur rapport erreur connexion:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Envoie une alerte sécurité aux admins
 * En cas de tentatives de connexion suspectes
 */
async function sendSecurityAlertToAdmins(alertInfo: {
  email: string;
  ip: string;
  attempts: number;
  timestamp: string;
}) {
  try {
    if (!db) return;

    // Récupérer les tokens FCM des admins
    const tokensSnapshot = await getDocs(
      query(collection(db, 'fcm_tokens'), where('active', '==', true))
    );

    const adminTokens = tokensSnapshot.docs.map(doc => doc.data().token);

    if (adminTokens.length === 0) {
      console.log('⚠️ Aucun token FCM actif pour l\'alerte sécurité');
      return;
    }

    // Déterminer gravité
    const isCritical = alertInfo.attempts >= 10;
    const title = isCritical 
      ? '🚨 Alerte Sécurité Critique'
      : '⚠️ Tentatives de Connexion Suspectes';

    const message = `${alertInfo.attempts} tentatives échouées sur ${alertInfo.email}\nIP: ${alertInfo.ip}`;

    // Envoyer notification
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/notifications/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fcmTokens: adminTokens,
        title,
        message,
        type: 'system_alert',
        clickAction: '/admin/settings?tab=security',
        data: {
          alertType: 'failed_login',
          email: alertInfo.email,
          ip: alertInfo.ip,
          attempts: alertInfo.attempts.toString(),
          timestamp: alertInfo.timestamp,
          severity: isCritical ? 'critical' : 'warning',
        },
      }),
    });

    if (response.ok) {
      console.log('✅ Alerte sécurité envoyée aux admins');
    } else {
      console.error('❌ Erreur envoi alerte sécurité:', await response.text());
    }

  } catch (error) {
    console.error('❌ Erreur notification alerte sécurité:', error);
  }
}

/**
 * GET : Récupérer les logs sécurité récents
 */
export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ logs: [] });
    }

    // Récupérer les 50 derniers logs
    const logsQuery = query(
      collection(db, 'security_logs'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const logsSnapshot = await getDocs(logsQuery);
    const logs = logsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toISOString(),
    }));

    return NextResponse.json({ logs });

  } catch (error: any) {
    console.error('❌ Erreur récupération logs:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    );
  }
}
