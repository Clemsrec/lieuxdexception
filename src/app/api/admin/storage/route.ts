import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from 'firebase-admin/storage';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import * as path from 'path';
import * as fs from 'fs';

/**
 * API Route pour gérer Firebase Storage
 * GET: Lister les fichiers/dossiers
 * POST: Upload fichier → voir /api/admin/upload
 * DELETE: Supprimer fichier → voir /api/admin/storage/delete
 */

// Initialiser Firebase Admin si pas déjà fait
function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  try {
    // Production: FIREBASE_CONFIG auto-injecté
    if (process.env.FIREBASE_CONFIG) {
      const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
      return initializeApp({
        projectId: firebaseConfig.projectId,
        storageBucket: 'lieux-d-exceptions.firebasestorage.app', // Bucket correct
      });
    }

    // Dev: Service account key
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccountPath = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      return initializeApp({
        credential: cert(serviceAccount),
        storageBucket: 'lieux-d-exceptions.firebasestorage.app', // Bucket correct
      });
    }

    throw new Error('Firebase Admin non configuré');
  } catch (error) {
    console.error('[Storage API] Erreur initialisation:', error);
    throw error;
  }
}

export interface StorageFile {
  name: string;
  path: string;
  url: string;
  size: number;
  contentType: string;
  updated: string;
  isImage: boolean;
  thumbnail?: string;
}

export interface StorageFolder {
  name: string;
  path: string;
  itemCount: number;
}

export interface StorageListResponse {
  files: StorageFile[];
  folders: StorageFolder[];
  currentPath: string;
  totalCount: number;
}

/**
 * GET /api/admin/storage
 * Liste les fichiers et dossiers d'un chemin donné
 * 
 * Query params:
 * - path: Chemin dans Storage (ex: "venues/chateau-le-dome")
 * - recursive: Si true, liste récursivement tous les fichiers
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const prefix = searchParams.get('path') || '';
    const recursive = searchParams.get('recursive') === 'true';

    const app = getAdminApp();
    const bucket = getStorage(app).bucket();

    console.log(`[Storage API] Listing files in: ${prefix || '/'} (recursive: ${recursive})`);

    // Lister les fichiers 
    const listOptions: any = { maxResults: 1000 };
    
    if (prefix) {
      listOptions.prefix = `${prefix}/`;
    }
    
    if (!recursive) {
      listOptions.delimiter = '/';
    }

    console.log(`[Storage API] Options de listing:`, listOptions);

    const [files, , apiResponse] = await bucket.getFiles(listOptions) as [any[], any, { prefixes?: string[] }];

    console.log(`[Storage API] Nombre de fichiers trouvés: ${files.length}`);
    console.log(`[Storage API] Prefixes (dossiers):`, apiResponse?.prefixes || []);

    const storageFiles: StorageFile[] = [];
    const folderSet = new Set<string>();

    // Traiter les dossiers depuis les prefixes Firebase
    if (!recursive && apiResponse?.prefixes) {
      for (const prefixPath of apiResponse.prefixes) {
        // Retirer le prefix actuel pour obtenir le nom du dossier
        let folderName = prefixPath;
        
        if (prefix) {
          // Si on a un prefix, retirer le prefix + "/" du début
          const prefixWithSlash = `${prefix}/`;
          if (prefixPath.startsWith(prefixWithSlash)) {
            folderName = prefixPath.substring(prefixWithSlash.length);
          }
        }
        
        // Retirer le "/" final
        folderName = folderName.replace(/\/$/, '');
        
        if (folderName) {
          folderSet.add(folderName);
          console.log(`[Storage API] Dossier détecté: ${folderName} (from ${prefixPath})`);
        }
      }
    }

    // Traiter les fichiers
    for (const file of files) {
      const filePath = file.name;
      console.log(`[Storage API] Processing file: ${filePath}`);

      try {
        // Récupérer les métadonnées du fichier
        const [metadata] = await file.getMetadata();
        
        // Générer l'URL de téléchargement signée (valide 7 jours)
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });

        const contentType = metadata.contentType || '';
        const isImage = contentType.startsWith('image/');

        storageFiles.push({
          name: path.basename(filePath),
          path: filePath,
          url,
          size: Number(metadata.size || 0),
          contentType,
          updated: metadata.updated || metadata.timeCreated || '',
          isImage,
          thumbnail: isImage ? url : undefined,
        });
      } catch (error) {
        console.error(`[Storage API] Erreur métadonnées pour ${filePath}:`, error);
      }
    }

    // Convertir les dossiers en tableau
    const storageFolders: StorageFolder[] = Array.from(folderSet).map(folderName => ({
      name: folderName,
      path: prefix ? `${prefix}/${folderName}` : folderName,
      itemCount: 0, // Compte non implémenté pour performances (nécessiterait une requête par dossier)
    }));

    // Trier : dossiers d'abord, puis fichiers par nom
    storageFolders.sort((a, b) => a.name.localeCompare(b.name));
    storageFiles.sort((a, b) => a.name.localeCompare(b.name));

    const response: StorageListResponse = {
      files: storageFiles,
      folders: storageFolders,
      currentPath: prefix,
      totalCount: storageFiles.length + storageFolders.length,
    };

    return NextResponse.json({
      success: true,
      data: response,
    });

  } catch (error: any) {
    console.error('[Storage API] Erreur listing:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors du listing des fichiers',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/storage
 * Rediriger vers /api/admin/upload pour l'upload de fichiers
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { success: false, error: 'Utilisez /api/admin/upload pour uploader des fichiers' },
    { status: 501 }
  );
}

/**
 * DELETE /api/admin/storage
 * Rediriger vers /api/admin/storage/delete pour la suppression
 */
export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { success: false, error: 'Utilisez /api/admin/storage/delete pour supprimer des fichiers' },
    { status: 501 }
  );
}
