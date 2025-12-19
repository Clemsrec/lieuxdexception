import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { ensureAdminInitialized } from '@/lib/firebase-admin';

/**
 * API Route - Gestion des événements de timeline
 * 
 * GET: Récupérer tous les événements
 * POST: Créer ou mettre à jour un événement
 * DELETE: Supprimer un événement
 */

/**
 * GET - Récupérer tous les événements de timeline
 */
export async function GET(request: NextRequest) {
  try {
    ensureAdminInitialized();
    const db = getFirestore();
    
    const snapshot = await db.collection('timeline')
      .orderBy('order', 'asc')
      .get();
    
    const events = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      };
    });
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('[API] Erreur GET timeline-events:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des événements' },
      { status: 500 }
    );
  }
}

/**
 * POST - Créer ou mettre à jour un événement
 */
export async function POST(request: NextRequest) {
  try {
    ensureAdminInitialized();
    const db = getFirestore();
    const body = await request.json();
    
    // Validation basique
    if (!body.year || !body.title || !body.subtitle || !body.description || !body.image || !body.date) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants (year, title, subtitle, description, image, date)' },
        { status: 400 }
      );
    }
    
    const eventData: any = {
      year: body.year,
      month: body.month || '',
      date: body.date,
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      image: body.image,
      imagePosition: body.imagePosition || 'bottom',
      isMajor: body.isMajor || false,
      venue: body.venue || '',
      venueName: body.venueName || '',
      event: body.event || '',
      category: body.category || '',
      visible: body.visible !== undefined ? body.visible : true,
      order: body.order || 0,
      updatedAt: Timestamp.now(),
    };
    
    let eventId = body.id;
    
    if (eventId) {
      // Mise à jour
      await db.collection('timeline').doc(eventId).update(eventData);
    } else {
      // Création
      eventData.createdAt = Timestamp.now();
      const docRef = await db.collection('timeline').add(eventData);
      eventId = docRef.id;
    }
    
    return NextResponse.json({ 
      success: true, 
      id: eventId,
      message: body.id ? 'Événement mis à jour' : 'Événement créé'
    });
    
  } catch (error) {
    console.error('[API] Erreur POST timeline-events:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la sauvegarde de l\'événement' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Supprimer un événement
 */
export async function DELETE(request: NextRequest) {
  try {
    ensureAdminInitialized();
    const db = getFirestore();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'événement manquant' },
        { status: 400 }
      );
    }
    
    await db.collection('timeline').doc(id).delete();
    
    return NextResponse.json({ 
      success: true,
      message: 'Événement supprimé avec succès'
    });
    
  } catch (error) {
    console.error('[API] Erreur DELETE timeline-events:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression de l\'événement' },
      { status: 500 }
    );
  }
}
