import { NextRequest } from 'next/server';
import { adminApp } from '@/lib/firebase-admin';
import { getStorage } from 'firebase-admin/storage';

/**
 * API pour uploader des fichiers vers Firebase Storage
 * Supporte les paths personnalisés et utilise l'Admin SDK
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin via cookie
    const authToken = request.cookies.get('auth-token')?.value;
    if (!authToken) {
      return Response.json({ error: 'Non authentifié - Reconnectez-vous' }, { status: 401 });
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string || '';
    
    if (!file) {
      return Response.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return Response.json({ error: 'Seules les images sont acceptées' }, { status: 400 });
    }

    // Vérifier la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ error: 'Fichier trop volumineux (max 10MB)' }, { status: 400 });
    }

    // Vérifier Firebase Admin
    if (!adminApp) {
      return Response.json({ error: 'Firebase Admin non initialisé' }, { status: 500 });
    }
    
    const bucket = getStorage(adminApp).bucket('lieux-d-exceptions.firebasestorage.app');

    // Générer le nom de fichier
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${timestamp}_${file.name}`;
    
    // Construire le path complet
    const fullPath = path ? `${path}/${fileName}` : fileName;
    
    // Créer le fichier dans le bucket
    const fileRef = bucket.file(fullPath);
    
    // Convertir le File en Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload le fichier
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString()
        }
      }
    });

    // Générer l'URL signée pour l'accès
    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 jours
    });

    return Response.json({
      success: true,
      file: {
        name: fileName,
        fullPath,
        url,
        size: file.size,
        contentType: file.type
      }
    });

  } catch (error) {
    console.error('Erreur upload:', error);
    return Response.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    );
  }
}