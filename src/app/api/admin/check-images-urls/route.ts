/**
 * API Route : Lister les images actuelles dans Firestore
 * GET /api/admin/check-images-urls
 */

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const venuesRef = adminDb!.collection('venues');
    const snapshot = await venuesRef.get();

    const venues = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        heroImage: data.heroImage || data.image || 'N/A',
        logo: data.logo || 'N/A',
        galleries: {
          mariages: data.galleries?.mariages?.slice(0, 2) || []
        }
      };
    });

    return NextResponse.json({
      success: true,
      count: venues.length,
      venues
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
