/**
 * API Route - Optimisation d'images
 * 
 * POST /api/admin/optimize-image
 * 
 * Optimise une image depuis Firebase Storage :
 * - Convertit en WebP
 * - Compresse l'image
 * - Redimensionne si nécessaire
 * - Re-upload dans Storage
 */

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { getStorage, ref, getDownloadURL, uploadBytes, getMetadata, deleteObject } from 'firebase/storage';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage as getAdminStorage } from 'firebase-admin/storage';

/**
 * Initialise Firebase Admin de manière lazy (seulement au runtime, pas au build)
 */
function getAdminStorageInstance() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }
  return getAdminStorage();
}

interface OptimizeImageRequest {
  /** Chemin complet du fichier dans Storage */
  filePath: string;
  /** Convertir en WebP ? */
  convertToWebP?: boolean;
  /** Qualité de compression (1-100, défaut: 80) */
  quality?: number;
  /** Largeur maximale (défaut: 1920) */
  maxWidth?: number;
  /** Hauteur maximale (défaut: 1920) */
  maxHeight?: number;
  /** Supprimer l'original après optimisation ? */
  deleteOriginal?: boolean;
}

interface OptimizeImageResponse {
  success: boolean;
  originalPath: string;
  optimizedPath: string;
  originalSize: number;
  optimizedSize: number;
  savings: number;
  savingsPercent: number;
  format: string;
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: OptimizeImageRequest = await request.json();
    const {
      filePath,
      convertToWebP = true,
      quality = 80,
      maxWidth = 1920,
      maxHeight = 1920,
      deleteOriginal = false,
    } = body;

    if (!filePath) {
      return NextResponse.json(
        { error: 'filePath requis' },
        { status: 400 }
      );
    }

    console.log('[Optimize Image] Début optimisation:', filePath);

    // 1. Télécharger l'image depuis Storage
    const adminStorage = getAdminStorageInstance();
    const bucket = adminStorage.bucket();
    const file = bucket.file(filePath);

    const [fileExists] = await file.exists();
    if (!fileExists) {
      return NextResponse.json(
        { error: 'Fichier introuvable dans Storage' },
        { status: 404 }
      );
    }

    const [fileBuffer] = await file.download();
    const [metadata] = await file.getMetadata();
    const originalSize = Number(metadata.size) || 0;

    console.log('[Optimize Image] Fichier téléchargé, taille:', originalSize);

    // 2. Optimiser l'image avec Sharp
    let sharpInstance = sharp(fileBuffer);

    // Obtenir les métadonnées de l'image
    const imageMetadata = await sharpInstance.metadata();
    console.log('[Optimize Image] Dimensions originales:', imageMetadata.width, 'x', imageMetadata.height);

    // Redimensionner si nécessaire
    if (imageMetadata.width && imageMetadata.width > maxWidth || 
        imageMetadata.height && imageMetadata.height > maxHeight) {
      sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
      console.log('[Optimize Image] Redimensionnement appliqué');
    }

    // Convertir selon le format demandé
    let optimizedBuffer: Buffer;
    let newExtension: string;
    
    if (convertToWebP) {
      optimizedBuffer = await sharpInstance
        .webp({ quality })
        .toBuffer();
      newExtension = 'webp';
      console.log('[Optimize Image] Conversion WebP effectuée');
    } else {
      // Garder le format original mais optimiser
      const originalFormat = imageMetadata.format || 'jpeg';
      
      if (originalFormat === 'png') {
        optimizedBuffer = await sharpInstance
          .png({ quality, compressionLevel: 9 })
          .toBuffer();
        newExtension = 'png';
      } else {
        // JPEG par défaut
        optimizedBuffer = await sharpInstance
          .jpeg({ quality, mozjpeg: true })
          .toBuffer();
        newExtension = 'jpg';
      }
      console.log('[Optimize Image] Optimisation format original:', originalFormat);
    }

    const optimizedSize = optimizedBuffer.length;
    const savings = originalSize - optimizedSize;
    const savingsPercent = Math.round((savings / originalSize) * 100);

    console.log('[Optimize Image] Taille optimisée:', optimizedSize, '- Économie:', savingsPercent, '%');

    // 3. Créer le nouveau chemin
    const pathParts = filePath.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const newFileName = `${fileNameWithoutExt}.${newExtension}`;
    
    // Si même extension, ajouter suffixe pour éviter écrasement
    const newFilePath = filePath.endsWith(`.${newExtension}`)
      ? filePath.replace(`.${newExtension}`, `-optimized.${newExtension}`)
      : pathParts.slice(0, -1).concat(newFileName).join('/');

    console.log('[Optimize Image] Nouveau chemin:', newFilePath);

    // 4. Upload du fichier optimisé
    const newFile = bucket.file(newFilePath);
    await newFile.save(optimizedBuffer, {
      metadata: {
        contentType: `image/${newExtension === 'jpg' ? 'jpeg' : newExtension}`,
        metadata: {
          optimized: 'true',
          originalPath: filePath,
          optimizedAt: new Date().toISOString(),
          originalSize: String(originalSize),
          optimizedSize: String(optimizedSize),
          savings: String(savingsPercent),
        },
      },
    });

    console.log('[Optimize Image] Fichier optimisé uploadé');

    // 5. Supprimer l'original si demandé
    if (deleteOriginal && filePath !== newFilePath) {
      await file.delete();
      console.log('[Optimize Image] Original supprimé');
    }

    // 6. Obtenir l'URL publique
    const [url] = await newFile.getSignedUrl({
      action: 'read',
      expires: '03-01-2500', // URL valide longtemps
    });

    const response: OptimizeImageResponse = {
      success: true,
      originalPath: filePath,
      optimizedPath: newFilePath,
      originalSize,
      optimizedSize,
      savings,
      savingsPercent,
      format: newExtension,
      url,
    };

    console.log('[Optimize Image] Succès:', response);

    return NextResponse.json(response);

  } catch (error) {
    console.error('[Optimize Image] Erreur:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'optimisation de l\'image',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}

/**
 * Batch optimization - Optimiser plusieurs images en une fois
 * 
 * POST /api/admin/optimize-image/batch
 */
export async function PUT(request: NextRequest) {
  try {
    const { filePaths, ...options }: { filePaths: string[] } & Partial<OptimizeImageRequest> = await request.json();

    if (!Array.isArray(filePaths) || filePaths.length === 0) {
      return NextResponse.json(
        { error: 'filePaths requis (tableau non vide)' },
        { status: 400 }
      );
    }

    console.log(`[Batch Optimize] Optimisation de ${filePaths.length} images...`);

    // Optimiser toutes les images en parallèle (max 5 à la fois pour éviter surcharge)
    const results: (OptimizeImageResponse | { error: string; filePath: string })[] = [];
    const batchSize = 5;

    for (let i = 0; i < filePaths.length; i += batchSize) {
      const batch = filePaths.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map(async (filePath) => {
          try {
            const response = await POST(
              new NextRequest(request.url, {
                method: 'POST',
                body: JSON.stringify({ filePath, ...options }),
              })
            );
            
            return await response.json();
          } catch (error) {
            return {
              error: error instanceof Error ? error.message : 'Erreur inconnue',
              filePath,
            };
          }
        })
      );

      results.push(...batchResults);
    }

    const successful = results.filter((r): r is OptimizeImageResponse => 'success' in r && r.success);
    const failed = results.filter(r => 'error' in r);

    return NextResponse.json({
      success: true,
      total: filePaths.length,
      successful: successful.length,
      failed: failed.length,
      results,
      totalSavings: successful.reduce((sum, r) => sum + r.savings, 0),
      averageSavingsPercent: successful.length > 0
        ? Math.round(successful.reduce((sum, r) => sum + r.savingsPercent, 0) / successful.length)
        : 0,
    });

  } catch (error) {
    console.error('[Batch Optimize] Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'optimisation batch' },
      { status: 500 }
    );
  }
}
