'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * Composant ImagePicker - Sélecteur d'images depuis Firebase Storage
 * 
 * Permet aux utilisateurs non-développeurs de :
 * - Parcourir les dossiers Storage
 * - Visualiser les images disponibles
 * - Sélectionner une image avec aperçu
 * - Filtrer par nom de fichier
 * 
 * Usage:
 * <ImagePicker
 *   currentValue="/venues/chateau-le-dome/hero.jpg"
 *   onSelect={(url) => setFormData({...formData, heroImage: url})}
 * />
 */

interface StorageFile {
  name: string;
  path: string;
  url: string;
  size: number;
  contentType: string;
  updated: string;
  isImage: boolean;
  thumbnail?: string;
}

interface StorageFolder {
  name: string;
  path: string;
  itemCount: number;
}

interface ImagePickerProps {
  /** URL actuelle (pour afficher la sélection courante) */
  currentValue?: string;
  /** Callback appelé lors de la sélection d'une image */
  onSelect: (url: string, path: string) => void;
  /** Chemin initial dans Storage (ex: "venues") */
  initialPath?: string;
  /** Afficher seulement les images (true par défaut) */
  imagesOnly?: boolean;
  /** Classe CSS personnalisée */
  className?: string;
}

export default function ImagePicker({
  currentValue,
  onSelect,
  initialPath = '',
  imagesOnly = true,
  className = '',
}: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [folders, setFolders] = useState<StorageFolder[]>([]);
  const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Charger les fichiers du chemin actuel
  const loadFiles = async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/admin/storage?path=${encodeURIComponent(path)}&recursive=false`
      );
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des fichiers');
      }

      const data = await response.json();
      
      if (data.success) {
        setFiles(data.data.files.filter((f: StorageFile) => 
          imagesOnly ? f.isImage : true
        ));
        setFolders(data.data.folders);
        setCurrentPath(path);
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (err: any) {
      console.error('[ImagePicker] Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger au montage et quand le chemin change
  useEffect(() => {
    if (isOpen) {
      loadFiles(currentPath);
    }
  }, [isOpen]);

  // Naviguer vers un dossier
  const navigateToFolder = (folderPath: string) => {
    loadFiles(folderPath);
    setSearchQuery('');
  };

  // Naviguer vers le parent
  const navigateUp = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/');
    loadFiles(parentPath);
    setSearchQuery('');
  };

  // Filtrer les fichiers selon la recherche
  const filteredFiles = searchQuery
    ? files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : files;

  // Sélectionner et fermer
  const handleSelect = () => {
    if (selectedFile) {
      onSelect(selectedFile.url, selectedFile.path);
      setIsOpen(false);
      setSelectedFile(null);
    }
  };

  // Breadcrumbs pour afficher le chemin
  const pathSegments = currentPath ? currentPath.split('/') : [];

  return (
    <div className={className}>
      {/* Bouton pour ouvrir le picker */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition text-sm"
      >
        Parcourir Storage
      </button>

      {/* Aperçu de l'image actuelle */}
      {currentValue && !isOpen && (
        <div className="mt-2 p-2 border border-neutral-300 rounded">
          <p className="text-xs text-neutral-600 mb-1">Image actuelle :</p>
          <div className="relative w-full h-32 bg-neutral-100 rounded overflow-hidden">
            <Image
              src={currentValue}
              alt="Aperçu"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <p className="text-xs text-neutral-500 mt-1 truncate">{currentValue}</p>
        </div>
      )}

      {/* Modal du picker */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-heading text-primary">
                Sélectionner une image
              </h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedFile(null);
                }}
                className="text-neutral-400 hover:text-neutral-600 text-2xl leading-none"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            {/* Breadcrumbs + Search */}
            <div className="p-4 border-b border-neutral-200 space-y-3">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <button
                  onClick={() => loadFiles('')}
                  className="text-primary hover:underline font-medium"
                >
                  Racine
                </button>
                {pathSegments.map((segment, index) => {
                  const segmentPath = pathSegments.slice(0, index + 1).join('/');
                  return (
                    <span key={segmentPath} className="flex items-center gap-2">
                      <span className="text-neutral-400">/</span>
                      <button
                        onClick={() => loadFiles(segmentPath)}
                        className="text-primary hover:underline"
                      >
                        {segment}
                      </button>
                    </span>
                  );
                })}
              </div>

              {/* Bouton remonter + Search */}
              <div className="flex gap-2">
                {currentPath && (
                  <button
                    onClick={navigateUp}
                    className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded hover:bg-neutral-200 transition text-sm"
                  >
                    ← Remonter
                  </button>
                )}
                <input
                  type="text"
                  placeholder="Rechercher un fichier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-neutral-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-neutral-600">Chargement...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded p-4 text-center">
                  <p className="text-red-700">❌ {error}</p>
                  <button
                    onClick={() => loadFiles(currentPath)}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    Réessayer
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Dossiers */}
                  {folders.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-neutral-700 mb-2">
                        Dossiers ({folders.length})
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {folders.map((folder) => (
                          <button
                            key={folder.path}
                            onClick={() => navigateToFolder(folder.path)}
                            className="p-3 border-2 border-neutral-300 rounded hover:border-primary hover:bg-primary/5 transition text-left"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">📁</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-800 truncate">
                                  {folder.name}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fichiers */}
                  {filteredFiles.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-medium text-neutral-700 mb-2">
                        Fichiers ({filteredFiles.length})
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {filteredFiles.map((file) => (
                          <button
                            key={file.path}
                            onClick={() => setSelectedFile(file)}
                            className={`group relative border-2 rounded overflow-hidden transition ${
                              selectedFile?.path === file.path
                                ? 'border-accent ring-2 ring-accent/30'
                                : 'border-neutral-300 hover:border-primary'
                            }`}
                          >
                            {/* Image */}
                            <div className="relative w-full aspect-square bg-neutral-100">
                              {file.thumbnail ? (
                                <Image
                                  src={file.thumbnail}
                                  alt={file.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full text-4xl">
                                  📄
                                </div>
                              )}
                              
                              {/* Overlay sélection */}
                              {selectedFile?.path === file.path && (
                                <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                                  <span className="text-4xl">✓</span>
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="p-2 bg-white">
                              <p className="text-xs font-medium text-neutral-800 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-neutral-500">
                                {(file.size / 1024).toFixed(0)} KB
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : searchQuery ? (
                    <div className="text-center py-8 text-neutral-500">
                      <p>Aucun fichier trouvé pour « {searchQuery} »</p>
                    </div>
                  ) : files.length === 0 && folders.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500">
                      <p>Ce dossier est vide</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                {selectedFile ? (
                  <div className="text-sm">
                    <p className="font-medium text-neutral-800 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {selectedFile.path}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500">
                    Aucune image sélectionnée
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded hover:bg-neutral-50 transition text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSelect}
                  disabled={!selectedFile}
                  className={`px-4 py-2 rounded transition text-sm font-medium ${
                    selectedFile
                      ? 'bg-accent text-white hover:bg-accent/90'
                      : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  Sélectionner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
