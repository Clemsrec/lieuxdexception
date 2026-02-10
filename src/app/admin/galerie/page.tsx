'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { Upload, RefreshCw, Trash2, X, Grid3x3, FolderOpen, ArrowLeft, Folder } from 'lucide-react';

interface StorageFile {
  name: string;
  fullPath: string;
  url?: string;
  size?: number;
  timeCreated?: string;
  contentType?: string;
  isFolder?: boolean;
}

interface FileItem {
  name: string;
  fullPath: string;
  url: string;
  size: number;
  timeCreated: string;
  contentType: string;
}

/**
 * Page Galerie avec navigation dans Firebase Storage
 * - Navigation par dossiers 
 * - Upload d'images par drag & drop
 * - Visualisation grid des images  
 * - Suppression multiple
 * - Utilise la nouvelle API /api/admin/storage avec Admin SDK
 */
export default function GalerieAdminPage() {
  const [allItems, setAllItems] = useState<StorageFile[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Charger le contenu du dossier actuel
  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/storage?path=${encodeURIComponent(currentPath)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Storage API response:', data);
      
      // Combiner les dossiers et fichiers de l'API
      let allStorageItems: StorageFile[] = [];
      
      // Ajouter les dossiers (avec isFolder: true)
      if (data.data?.folders) {
        const folders = data.data.folders.map((folder: any, index: number) => ({
          name: folder.name,
          fullPath: folder.path || `folder-${index}`,
          isFolder: true
        }));
        allStorageItems = allStorageItems.concat(folders);
      }
      
      // Ajouter les fichiers (avec isFolder: false)  
      if (data.data?.files) {
        const files = data.data.files.map((file: any, index: number) => ({
          ...file,
          fullPath: file.fullPath || file.name || `file-${index}`,
          isFolder: false
        }));
        allStorageItems = allStorageItems.concat(files);
      }
      
      setAllItems(allStorageItems);
      
      // Filtrer seulement les fichiers images avec URL pour la grille
      const imageFiles = allStorageItems.filter((item: StorageFile) => 
        !item.isFolder && 
        item.url && 
        item.contentType?.startsWith('image/')
      ) as FileItem[];
      
      setFiles(imageFiles);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setAllItems([]);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [currentPath]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Formatage taille fichier
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Navigation dans les dossiers
  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath);
    setSelectedFiles(new Set()); // Reset sélection
  };

  const navigateBack = () => {
    if (currentPath === '') return;
    
    // Remonter d'un niveau
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop();
    const parentPath = pathParts.join('/');
    setCurrentPath(parentPath);
    setSelectedFiles(new Set());
  };

  // Breadcrumb pour navigation
  const getBreadcrumbs = () => {
    if (currentPath === '') return ['Racine'];
    
    const parts = currentPath.split('/').filter(Boolean);
    return ['Racine', ...parts];
  };

  // Upload de fichiers avec notre API existante (à adapter si nécessaire)
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (uploading) return;
    
    setUploading(true);
    
    try {
      // Pour l'instant, on upload dans le dossier courant
      // L'API /api/admin/upload supporte déjà les paths via formData.get('path')
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', currentPath); // Ajout du path courant
        
        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
      }
      
      // Recharger après upload
      await loadContent();
      setShowUploadModal(false);
      
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  }, [uploading, currentPath, loadContent]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    disabled: uploading
  });

  // Suppression des fichiers sélectionnés
  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;
    
    if (!confirm(`Supprimer ${selectedFiles.size} fichier(s) ?`)) {
      return;
    }
    
    try {
      const filesToDelete = Array.from(selectedFiles);
      
      // Appeler API de suppression (à créer si nécessaire)
      const response = await fetch('/api/admin/storage/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: filesToDelete }),
      });
      
      if (!response.ok) {
        throw new Error('Échec de la suppression');
      }
      
      setSelectedFiles(new Set());
      await loadContent();
      
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const toggleFileSelection = (fullPath: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fullPath)) {
      newSelected.delete(fullPath);
    } else {
      newSelected.add(fullPath);
    }
    setSelectedFiles(newSelected);
  };

  const selectAll = () => {
    setSelectedFiles(new Set(files.map(f => f.fullPath)));
  };

  const clearSelection = () => {
    setSelectedFiles(new Set());
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary mb-2">
              Galerie
            </h1>
            <p className="text-secondary">
              Gérer les images et médias du site
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={loadContent}
              className="btn-ghost flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Images
            </button>
          </div>
        </div>

        {/* Navigation Breadcrumb */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2">
            {currentPath !== '' && (
              <button
                onClick={navigateBack}
                className="btn-ghost btn-sm flex items-center gap-1 mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
            )}
            
            <nav className="flex items-center gap-1 text-sm">
              {getBreadcrumbs().map((crumb, index) => (
                <span key={index} className="flex items-center gap-1">
                  {index > 0 && <span className="text-neutral-400">/</span>}
                  <span className={index === getBreadcrumbs().length - 1 ? 'font-medium text-primary' : 'text-secondary'}>
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          </div>
        </div>

        {/* Dossiers du niveau actuel */}
        {allItems.some(item => item.isFolder) && (
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Dossiers
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {allItems
                .filter(item => item.isFolder)
                .map((folder, index) => (
                  <button
                    key={`folder-${folder.fullPath || folder.name || index}`}
                    onClick={() => navigateToFolder(folder.fullPath)}
                    className="p-4 border border-neutral-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-colors text-left"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Folder className="w-8 h-8 text-accent" />
                      <span className="text-sm font-medium text-primary truncate w-full text-center">
                        {folder.name}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Barre d'outils pour les fichiers */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-secondary">
                  {files.length} fichier(s) • {selectedFiles.size} sélectionné(s)
                </span>
                
                {selectedFiles.size > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearSelection}
                      className="btn-ghost btn-sm"
                    >
                      Désélectionner
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      className="btn-ghost btn-sm text-red-600 hover:bg-red-50 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={selectAll}
                className="btn-ghost btn-sm flex items-center gap-2"
              >
                <Grid3x3 className="w-4 h-4" />
                Tout sélectionner
              </button>
            </div>
          </div>
        )}

        {/* Grid des fichiers images */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-secondary">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
              Chargement...
            </div>
          ) : files.length === 0 ? (
            <div className="p-8 text-center text-secondary">
              <Upload className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p className="text-lg mb-2">Aucun fichier image</p>
              <p>Uploadez des images ou naviguez dans un dossier contenant des images</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
              {files.map((file, index) => (
                <div
                  key={`file-${file.fullPath || file.name || index}`}
                  className={`relative group cursor-pointer rounded-lg border-2 transition-all ${
                    selectedFiles.has(file.fullPath)
                      ? 'border-accent bg-accent/10'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                  onClick={() => toggleFileSelection(file.fullPath)}
                >
                  <div className="aspect-square relative overflow-hidden rounded-md">
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                    
                    {/* Overlay sélection */}
                    {selectedFiles.has(file.fullPath) && (
                      <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Info fichier */}
                  <div className="p-3">
                    <p className="text-xs font-medium text-primary truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-secondary">
                      {formatFileSize(file.size)}
                    </p>
                    <p className="text-xs text-secondary">
                      {new Date(file.timeCreated).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Upload */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary">
                  Upload Images
                  {currentPath && (
                    <span className="text-sm text-secondary block">
                      dans /{currentPath}
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-neutral-400 hover:text-neutral-600"
                  disabled={uploading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragActive
                    ? 'border-accent bg-accent/5'
                    : 'border-neutral-300 hover:border-accent'
                } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
                
                {uploading ? (
                  <p className="text-primary">Upload en cours...</p>
                ) : isDragActive ? (
                  <p className="text-primary">Déposez les fichiers ici</p>
                ) : (
                  <div>
                    <p className="text-primary mb-2">
                      Glissez-déposez des images ici, ou cliquez pour sélectionner
                    </p>
                    <p className="text-sm text-secondary">
                      Formats acceptés : JPG, PNG, GIF, WebP
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="btn-ghost"
                  disabled={uploading}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}