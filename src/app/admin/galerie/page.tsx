'use client';

import { useState, useEffect, useCallback } from 'react';
import { Upload, Trash2, Grid3x3, RefreshCw, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import {
  listFiles,
  uploadFile,
  deleteFile,
  formatFileSize,
  type StorageFile,
} from '@/lib/storage';

/**
 * Page Galerie simplifiée - Garde uniquement l'essentiel
 * - Upload d'images par drag & drop
 * - Visualisation grid des images
 * - Suppression simple
 * - Actualisation
 */

export default function GalerieAdminPage() {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadContent();
  }, []);

  // Charger les fichiers
  const loadContent = useCallback(async () => {
    setLoading(true);
    try {
      const allFiles = await listFiles('');
      setFiles(allFiles.sort((a, b) => new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime()));
    } catch (error) {
      console.error('Erreur chargement fichiers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload des fichiers
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    
    try {
      // Upload tous les fichiers en parallèle
      await Promise.all(
        acceptedFiles.map((file) => {
          const path = `uploads/${Date.now()}-${file.name}`;
          return uploadFile(file, path);
        })
      );
      
      await loadContent();
      setShowUploadModal(false);
      alert(`${acceptedFiles.length} fichier(s) uploadé(s)`);
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  }, [loadContent]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
  });

  // Supprimer fichiers sélectionnés
  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;
    
    if (!confirm(`Supprimer ${selectedFiles.size} fichier(s) ?`)) return;
    
    try {
      await Promise.all(
        Array.from(selectedFiles).map((fullPath) => deleteFile(fullPath))
      );
      setSelectedFiles(new Set());
      await loadContent();
      alert('Fichiers supprimés');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  // Sélection
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

        {/* Barre d'outils */}
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

        {/* Grid des fichiers */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-secondary">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
              Chargement...
            </div>
          ) : files.length === 0 ? (
            <div className="p-8 text-center text-secondary">
              <Upload className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
              <p className="text-lg mb-2">Aucun fichier</p>
              <p>Uploadez des images pour commencer</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
              {files.map((file) => (
                <div
                  key={file.fullPath}
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