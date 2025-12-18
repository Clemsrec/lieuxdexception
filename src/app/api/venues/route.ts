import { NextRequest, NextResponse } from 'next/server';
import { getVenues } from '@/lib/firestore';

/**
 * GET /api/venues - Récupérer tous les lieux (admin voir tous, public voir actifs)
 */
export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de requête
    const searchParams = request.nextUrl.searchParams;
    const eventType = searchParams.get('eventType') as 'b2b' | 'mariage' | 'all' | null;
    const region = searchParams.get('region');
    const featured = searchParams.get('featured');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    // Construire les filtres
    const filters: any = {};
    if (eventType && eventType !== 'all') {
      filters.eventType = eventType;
    }
    if (region) {
      filters.region = region;
    }
    if (featured !== null) {
      filters.featured = featured === 'true';
    }
    
    // Récupérer les lieux depuis Firestore
    // Pour l'admin, inclure les inactifs (includeInactive=true)
    const venues = await getVenues(
      Object.keys(filters).length > 0 ? filters : undefined,
      includeInactive
    );
    
    return NextResponse.json({
      success: true,
      venues,
      count: venues.length,
    });
  } catch (error: any) {
    console.error('[API] Erreur récupération lieux:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des lieux',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
