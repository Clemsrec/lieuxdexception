/**
 * API Admin - Gestion notifications
 * - PUT: Marquer notification comme lue
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * PUT /api/admin/notifications - Marquer notification comme lue
 */
export async function PUT(request: NextRequest) {
  try {
    const { notificationId, userId } = await request.json();

    if (!notificationId || !userId) {
      return NextResponse.json(
        { error: 'notificationId et userId requis' },
        { status: 400 }
      );
    }

    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin non initialisé' },
        { status: 500 }
      );
    }

    // Mettre à jour la notification dans Firestore
    await adminDb
      .collection('users')
      .doc(userId)
      .collection('notifications')
      .doc(notificationId)
      .update({
        read: true,
        readAt: Timestamp.now(),
      });

    return NextResponse.json({
      success: true,
      message: 'Notification marquée comme lue',
    });
  } catch (error: any) {
    console.error('Erreur marquer notification lue:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}
