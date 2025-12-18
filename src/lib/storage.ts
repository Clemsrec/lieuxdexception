/**
 * Firebase Storage Service
 * Gestion des images et fichiers dans Firebase Storage
 */

import { getStorage, ref, uploadBytes, deleteObject, listAll, getDownloadURL, getMetadata, updateMetadata, StorageReference } from 'firebase/storage';
import app from './firebase';

const storage = getStorage(app);

export interface StorageFile {
  name: string;
  fullPath: string;
  url: string;
  size: number;
  contentType?: string;
  customMetadata?: {
    alt?: string;
    title?: string;
    description?: string;
  };
  timeCreated: string;
  updated: string;
}

export interface StorageFolder {
  name: string;
  fullPath: string;
  prefix: string;
}

/**
 * Liste tous les fichiers dans un dossier Storage
 */
export async function listFiles(folderPath: string = ''): Promise<StorageFile[]> {
  const folderRef = ref(storage, folderPath);
  const result = await listAll(folderRef);
  
  const files = await Promise.all(
    result.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      const metadata = await getMetadata(itemRef);
      
      return {
        name: itemRef.name,
        fullPath: itemRef.fullPath,
        url,
        size: metadata.size,
        contentType: metadata.contentType,
        customMetadata: metadata.customMetadata as any,
        timeCreated: metadata.timeCreated,
        updated: metadata.updated,
      };
    })
  );
  
  return files;
}

/**
 * Liste tous les sous-dossiers dans un dossier Storage
 */
export async function listFolders(folderPath: string = ''): Promise<StorageFolder[]> {
  const folderRef = ref(storage, folderPath);
  const result = await listAll(folderRef);
  
  return result.prefixes.map((prefixRef) => ({
    name: prefixRef.name,
    fullPath: prefixRef.fullPath,
    prefix: prefixRef.fullPath,
  }));
}

/**
 * Upload un fichier vers Storage
 */
export async function uploadFile(
  file: File,
  path: string,
  metadata?: {
    alt?: string;
    title?: string;
    description?: string;
  }
): Promise<StorageFile> {
  const fileRef = ref(storage, path);
  
  const uploadMetadata = {
    contentType: file.type,
    customMetadata: metadata || {},
  };
  
  await uploadBytes(fileRef, file, uploadMetadata);
  const url = await getDownloadURL(fileRef);
  const fileMeta = await getMetadata(fileRef);
  
  return {
    name: fileRef.name,
    fullPath: fileRef.fullPath,
    url,
    size: fileMeta.size,
    contentType: fileMeta.contentType,
    customMetadata: fileMeta.customMetadata as any,
    timeCreated: fileMeta.timeCreated,
    updated: fileMeta.updated,
  };
}

/**
 * Supprime un fichier de Storage
 */
export async function deleteFile(fullPath: string): Promise<void> {
  const fileRef = ref(storage, fullPath);
  await deleteObject(fileRef);
}

/**
 * Met à jour les métadonnées d'un fichier
 */
export async function updateFileMetadata(
  fullPath: string,
  metadata: {
    alt?: string;
    title?: string;
    description?: string;
  }
): Promise<StorageFile> {
  const fileRef = ref(storage, fullPath);
  
  const newMetadata = {
    customMetadata: metadata,
  };
  
  await updateMetadata(fileRef, newMetadata);
  const url = await getDownloadURL(fileRef);
  const fileMeta = await getMetadata(fileRef);
  
  return {
    name: fileRef.name,
    fullPath: fileRef.fullPath,
    url,
    size: fileMeta.size,
    contentType: fileMeta.contentType,
    customMetadata: fileMeta.customMetadata as any,
    timeCreated: fileMeta.timeCreated,
    updated: fileMeta.updated,
  };
}

/**
 * Obtient les détails d'un fichier
 */
export async function getFileDetails(fullPath: string): Promise<StorageFile> {
  const fileRef = ref(storage, fullPath);
  const url = await getDownloadURL(fileRef);
  const metadata = await getMetadata(fileRef);
  
  return {
    name: fileRef.name,
    fullPath: fileRef.fullPath,
    url,
    size: metadata.size,
    contentType: metadata.contentType,
    customMetadata: metadata.customMetadata as any,
    timeCreated: metadata.timeCreated,
    updated: metadata.updated,
  };
}

/**
 * Supprime récursivement tous les fichiers d'un dossier
 * ATTENTION: Opération irréversible
 */
export async function deleteFolder(folderPath: string): Promise<void> {
  const folderRef = ref(storage, folderPath);
  const result = await listAll(folderRef);
  
  // Supprimer tous les fichiers
  await Promise.all(
    result.items.map((itemRef) => deleteObject(itemRef))
  );
  
  // Supprimer récursivement tous les sous-dossiers
  await Promise.all(
    result.prefixes.map((prefixRef) => deleteFolder(prefixRef.fullPath))
  );
}

/**
 * Renomme un fichier (copie + suppression de l'ancien)
 */
export async function renameFile(oldPath: string, newName: string): Promise<StorageFile> {
  // Note: Firebase Storage ne supporte pas le renommage direct
  // Il faut télécharger, ré-uploader avec nouveau nom, puis supprimer l'ancien
  
  const oldRef = ref(storage, oldPath);
  const url = await getDownloadURL(oldRef);
  const metadata = await getMetadata(oldRef);
  
  // Télécharger le fichier
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], newName, { type: metadata.contentType });
  
  // Nouveau chemin (même dossier, nouveau nom)
  const pathParts = oldPath.split('/');
  pathParts[pathParts.length - 1] = newName;
  const newPath = pathParts.join('/');
  
  // Upload avec nouveau nom
  const newFile = await uploadFile(file, newPath, metadata.customMetadata as any);
  
  // Supprimer l'ancien
  await deleteFile(oldPath);
  
  return newFile;
}

/**
 * Obtient la taille totale d'un dossier (en bytes)
 */
export async function getFolderSize(folderPath: string): Promise<number> {
  const files = await listFiles(folderPath);
  return files.reduce((total, file) => total + file.size, 0);
}

/**
 * Formate une taille en bytes vers une chaîne lisible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Analyse d'optimisation d'image
 */
export interface ImageOptimizationInfo {
  /** Taille actuelle du fichier */
  size: number;
  /** Taille formatée (ex: "2.5 MB") */
  sizeFormatted: string;
  /** Type MIME de l'image */
  contentType: string;
  /** Extension du fichier (jpg, png, webp, etc.) */
  extension: string;
  /** Est-ce que l'image est déjà optimisée ? */
  isOptimized: boolean;
  /** Devrait être convertie en WebP ? */
  shouldConvertToWebP: boolean;
  /** Est trop volumineuse ? (> 500KB pour le web) */
  isTooLarge: boolean;
  /** Économies potentielles estimées en % */
  potentialSavings: number;
  /** Recommandations d'optimisation */
  recommendations: string[];
}

/**
 * Analyse une image et retourne des recommandations d'optimisation
 */
export function analyzeImageOptimization(file: StorageFile): ImageOptimizationInfo {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const isWebP = extension === 'webp';
  const isPNG = extension === 'png';
  const isJPG = extension === 'jpg' || extension === 'jpeg';
  const isSVG = extension === 'svg';
  
  // Seuil de taille pour les images web (500KB)
  const WEB_SIZE_THRESHOLD = 500 * 1024;
  const isTooLarge = file.size > WEB_SIZE_THRESHOLD;
  
  // Vérifier si l'image est déjà optimisée
  const isOptimized = isWebP && file.size <= WEB_SIZE_THRESHOLD;
  
  // Recommandations
  const recommendations: string[] = [];
  let shouldConvertToWebP = false;
  let potentialSavings = 0;
  
  // SVG n'a pas besoin de conversion
  if (isSVG) {
    recommendations.push('Format SVG : déjà optimal pour les graphiques vectoriels');
  } else {
    // Recommander WebP si ce n'est pas déjà le cas
    if (!isWebP) {
      shouldConvertToWebP = true;
      recommendations.push('Convertir en WebP pour réduire la taille de 25-35%');
      
      // Estimation des économies
      if (isPNG) {
        potentialSavings = 30; // PNG → WebP : ~30% de réduction
      } else if (isJPG) {
        potentialSavings = 25; // JPG → WebP : ~25% de réduction
      }
    }
    
    // Recommander compression si trop volumineux
    if (isTooLarge) {
      recommendations.push(`Taille élevée (${formatFileSize(file.size)}) : optimiser la compression`);
      
      if (!shouldConvertToWebP) {
        potentialSavings = 20; // Compression seule : ~20%
      }
    }
    
    // Recommandation de dimensions
    if (file.size > 2 * 1024 * 1024) { // > 2MB
      recommendations.push('Image très volumineuse : vérifier les dimensions (max 1920px recommandé)');
    }
  }
  
  // Si déjà optimisé
  if (isOptimized) {
    recommendations.push('Image déjà optimisée pour le web');
  }
  
  return {
    size: file.size,
    sizeFormatted: formatFileSize(file.size),
    contentType: file.contentType || 'unknown',
    extension,
    isOptimized,
    shouldConvertToWebP,
    isTooLarge,
    potentialSavings,
    recommendations,
  };
}

/**
 * Obtenir toutes les images non optimisées dans un dossier
 */
export async function getUnoptimizedImages(folderPath: string = ''): Promise<{
  file: StorageFile;
  analysis: ImageOptimizationInfo;
}[]> {
  const files = await listFiles(folderPath);
  
  const imageFiles = files
    .filter(file => file.contentType?.startsWith('image/'))
    .map(file => ({
      file,
      analysis: analyzeImageOptimization(file),
    }))
    .filter(item => !item.analysis.isOptimized);
  
  return imageFiles;
}

/**
 * Statistiques d'optimisation pour un dossier
 */
export interface FolderOptimizationStats {
  /** Nombre total d'images */
  totalImages: number;
  /** Nombre d'images optimisées */
  optimizedImages: number;
  /** Nombre d'images à optimiser */
  unoptimizedImages: number;
  /** Taille totale des images */
  totalSize: number;
  /** Taille formatée */
  totalSizeFormatted: string;
  /** Économies potentielles totales (bytes) */
  potentialSavings: number;
  /** Économies formatées */
  potentialSavingsFormatted: string;
  /** Pourcentage d'optimisation */
  optimizationPercentage: number;
}

/**
 * Obtenir les statistiques d'optimisation d'un dossier
 */
export async function getFolderOptimizationStats(folderPath: string = ''): Promise<FolderOptimizationStats> {
  const files = await listFiles(folderPath);
  const imageFiles = files.filter(file => file.contentType?.startsWith('image/'));
  
  const analyses = imageFiles.map(file => analyzeImageOptimization(file));
  const optimizedCount = analyses.filter(a => a.isOptimized).length;
  const totalSize = imageFiles.reduce((sum, file) => sum + file.size, 0);
  
  // Calculer économies potentielles
  const potentialSavings = analyses.reduce((sum, analysis) => {
    return sum + (analysis.size * analysis.potentialSavings / 100);
  }, 0);
  
  return {
    totalImages: imageFiles.length,
    optimizedImages: optimizedCount,
    unoptimizedImages: imageFiles.length - optimizedCount,
    totalSize,
    totalSizeFormatted: formatFileSize(totalSize),
    potentialSavings,
    potentialSavingsFormatted: formatFileSize(potentialSavings),
    optimizationPercentage: imageFiles.length > 0 
      ? Math.round((optimizedCount / imageFiles.length) * 100)
      : 100,
  };
}
