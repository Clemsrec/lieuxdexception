import { NextRequest } from 'next/server';
import { adminApp } from '@/lib/firebase-admin';
import { getStorage } from 'firebase-admin/storage';

/**
 * API pour supprimer des fichiers de Firebase Storage
 * Supporte la suppression multiple et utilise l'Admin SDK
 */
export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification admin via cookie
    const authToken = request.cookies.get('auth-token')?.value;
    if (!authToken) {
      return Response.json({ error: 'Non authentifié - Reconnectez-vous' }, { status: 401 });
    }
    
    const body = await request.json();
    const { files } = body;
    
    if (!files || !Array.isArray(files) || files.length === 0) {
      return Response.json({ error: 'Liste de fichiers requise' }, { status: 400 });
    }

    // Vérifier Firebase Admin
    if (!adminApp) {
      return Response.json({ error: 'Firebase Admin non initialisé' }, { status: 500 });
    }
    
    const bucket = getStorage(adminApp).bucket('lieux-d-exceptions.firebasestorage.app');

    const results = [];
    const errors = [];

    // Supprimer chaque fichier
    for (const filePath of files) {
      try {
        const fileRef = bucket.file(filePath);
        
        // Vérifier si le fichier existe
        const [exists] = await fileRef.exists();
        if (!exists) {
          errors.push(`Fichier non trouvé: ${filePath}`);
          continue;
        }
        
        // Supprimer le fichier
        await fileRef.delete();
        results.push({ path: filePath, success: true });
        
      } catch (error) {
        console.error(`Erreur suppression ${filePath}:`, error);
        errors.push(`Erreur suppression ${filePath}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        results.push({ path: filePath, success: false });
      }
    }

    const response = {
      success: errors.length === 0,
      deleted: results.filter(r => r.success).length,
      total: files.length,
      results,
      errors: errors.length > 0 ? errors : undefined
    };

    return Response.json(response, { 
      status: errors.length === 0 ? 200 : 207 // 207 Multi-Status si erreurs partielles
    });

  } catch (error) {
    console.error('Erreur suppression globale:', error);
    return Response.json(
      { error: 'Erreur lors de la suppression des fichiers' },
      { status: 500 }
    );
  }
}