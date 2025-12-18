/**
 * Composant StorageImagePicker
 * 
 * Modal de sélection d'images depuis Firebase Storage
 * Permet de parcourir les dossiers, prévisualiser les images et sélectionner une URL
 */

'use client';

import { useState, useEffect } from 'react';
import { X, Folder, Image as ImageIcon, ChevronRight, Search, Check } from 'lucide-react';
import Image from 'next/image';
import { listFiles, listFolders, formatFileSize, type StorageFile, type StorageFolder } from '@/lib/storage';

interface StorageImagePickerProps {
  /** Callback appelé lors de la sélection d'une image */
  onSelect: (url: string, file: StorageFile) => void;
  /** Callback pour fermer le modal */
  onClose: () => void;
  /** URL actuellement sélectionnée (pour l'afficher) */
  currentUrl?: string;
  /** Titre du modal */
  title?: string;
  /** Dossier initial à afficher */
  initialPath?: string;
}

/**
 * Composant modal de sélection d'images depuis Storage
 */
export default function StorageImagePicker({
  onSelect,
  onClose,
  currentUrl = '',
  title = 'Sélectionner une image depuis Storage',
  initialPath = '',
}: StorageImagePickerProps) {
  const [currentPath, setCurrentPath] = useState<string>(initialPath);
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [folders, setFolders] = useState<StorageFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charger les fichiers et dossiers du chemin actuel
   */
  useEffect(() => {
    loadContent();
  }, [currentPath]);

  /**
   * Charger le contenu du dossier
   */
  const loadContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const [filesData, foldersData] = await Promise.all([
        listFiles(currentPath),
        listFolders(currentPath),
      ]);

      // Filtrer uniquement les images
      const imageFiles = filesData.filter(file => 
        file.contentType?.startsWith('image/')
      );

      setFiles(imageFiles);
      setFolders(foldersData);
    } catch (err) {
      console.error('Erreur chargement Storage:', err);
      setError('Impossible de charger les images');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Naviguer vers un dossier
   */
  const navigateToFolder = (folder: StorageFolder) => {
    setCurrentPath(folder.fullPath);
    setSearchQuery('');
  };

  /**
   * Remonter d'un niveau
   */
  const navigateUp = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop();
    setCurrentPath(pathParts.join('/'));
  };

  /**
   * Filtrer les fichiers par recherche
   */
  const filteredFiles = searchQuery
    ? files.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : files;

  /**
   * Sélectionner une image
   */
  const handleSelectImage = (file: StorageFile) => {
    setSelectedFile(file);
  };

  /**
   * Confirmer la sélection
   */
  const handleConfirm = () => {
    if (selectedFile) {
      onSelect(selectedFile.url, selectedFile);
      onClose();
    }
  };

  /**
   * Breadcrumb du chemin actuel
   */
  const getBreadcrumbs = () => {
    if (!currentPath) return ['Racine'];
    return ['Racine', ...currentPath.split('/').filter(Boolean)];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-2xl font-display font-bold text-primary">{title}</h2>
            {currentUrl && (
              <p className="text-sm text-secondary mt-1">
                Actuellement : <span className="font-mono text-xs">{currentUrl}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6 text-secondary" />
          </button>
        </div>

        {/* Barre de recherche et navigation */}
        <div className="p-4 border-b border-neutral-200 space-y-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            {getBreadcrumbs().map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-4 h-4 text-secondary" />}
                <button
                  onClick={() => {
                    if (index === 0) {
                      setCurrentPath('');
                    } else {
                      const pathParts = currentPath.split('/').filter(Boolean);
                      setCurrentPath(pathParts.slice(0, index).join('/'));
                    }
                  }}
                  className={`${
                    index === getBreadcrumbs().length - 1
                      ? 'text-primary font-medium'
                      : 'text-secondary hover:text-primary'
                  } transition-colors`}
                >
                  {crumb}
                </button>
              </div>
            ))}
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une image..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Liste des dossiers */}
              {folders.length > 0 && !searchQuery && (
                <div>
                  <h3 className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">
                    Dossiers
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {folders.map((folder) => (
                      <button
                        key={folder.fullPath}
                        onClick={() => navigateToFolder(folder)}
                        className="flex flex-col items-center gap-2 p-4 border-2 border-neutral-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-all group"
                      >
                        <Folder className="w-12 h-12 text-accent group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-primary font-medium text-center line-clamp-2">
                          {folder.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Liste des images */}
              {filteredFiles.length > 0 ? (
                <div>
                  <h3 className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">
                    Images ({filteredFiles.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredFiles.map((file) => (
                      <button
                        key={file.fullPath}
                        onClick={() => handleSelectImage(file)}
                        className={`relative group border-2 rounded-lg overflow-hidden transition-all ${
                          selectedFile?.fullPath === file.fullPath
                            ? 'border-accent ring-2 ring-accent'
                            : 'border-neutral-200 hover:border-accent'
                        }`}
                      >
                        {/* Image */}
                        <div className="aspect-square relative bg-neutral-100">
                          <Image
                            src={file.url}
                            alt={file.customMetadata?.alt || file.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                          
                          {/* Overlay avec info */}
                          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                              <p className="text-xs font-medium truncate">{file.name}</p>
                              <p className="text-xs opacity-80">{formatFileSize(file.size)}</p>
                            </div>
                          </div>

                          {/* Icône de sélection */}
                          {selectedFile?.fullPath === file.fullPath && (
                            <div className="absolute top-2 right-2 bg-accent text-white rounded-full p-1">
                              <Check className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-secondary">
                  <ImageIcon className="w-16 h-16 mb-4 opacity-40" />
                  <p>{searchQuery ? 'Aucune image trouvée' : 'Aucune image dans ce dossier'}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer avec actions */}
        <div className="p-4 border-t border-neutral-200 flex items-center justify-between">
          <div className="text-sm text-secondary">
            {selectedFile ? (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>
                  Sélectionné : <span className="font-mono text-xs">{selectedFile.name}</span>
                  {' '}({formatFileSize(selectedFile.size)})
                </span>
              </div>
            ) : (
              <span>Sélectionnez une image</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentPath && (
              <button
                onClick={navigateUp}
                className="px-4 py-2 border border-neutral-300 text-secondary rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Dossier parent
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 text-secondary rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedFile}
              className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sélectionner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
