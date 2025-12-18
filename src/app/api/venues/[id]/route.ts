import { NextRequest, NextResponse } from 'next/server';
import { getVenueById, updateVenue, deleteVenue } from '@/lib/firestore';

/**
 * GET /api/venues/[id] - Récupérer un lieu par son ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const venue = await getVenueById(id);
    
    if (!venue) {
      return NextResponse.json(
        { success: false, error: 'Lieu non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      venue,
    });
  } catch (error: any) {
    console.error('[API] Erreur récupération lieu:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération du lieu',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/venues/[id] - Mettre à jour un lieu
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const updates = await request.json();
    
    // Mettre à jour le lieu dans Firestore
    await updateVenue(id, updates);
    
    // Récupérer le lieu mis à jour
    const updatedVenue = await getVenueById(id);
    
    return NextResponse.json({
      success: true,
      venue: updatedVenue,
      message: 'Lieu mis à jour avec succès',
    });
  } catch (error: any) {
    console.error('[API] Erreur mise à jour lieu:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la mise à jour du lieu',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/venues/[id] - Supprimer un lieu (soft delete par défaut)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Vérifier que le lieu existe
    const venue = await getVenueById(id);
    if (!venue) {
      return NextResponse.json(
        { success: false, error: 'Lieu non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier si hard delete demandé via query param (DANGEREUX)
    const searchParams = request.nextUrl.searchParams;
    const hardDelete = searchParams.get('hardDelete') === 'true';
    
    // Supprimer le lieu (soft delete par défaut)
    await deleteVenue(id, hardDelete);
    
    return NextResponse.json({
      success: true,
      message: hardDelete 
        ? `Lieu "${venue.name}" supprimé définitivement`
        : `Lieu "${venue.name}" désactivé (soft delete)`,
      softDelete: !hardDelete,
    });
  } catch (error: any) {
    console.error('[API] Erreur suppression lieu:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la suppression du lieu',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
