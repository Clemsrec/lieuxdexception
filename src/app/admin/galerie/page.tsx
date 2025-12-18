'use client';

import { useState, useEffect, useCallback } from 'react';
import { Upload, FolderPlus, Trash2, Edit2, Grid3x3, List, Download, X, Check, AlertTriangle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import {
  listFiles,
  listFolders,
  uploadFile,
  deleteFile,
  deleteFolder,
  updateFileMetadata,
  renameFile,
  formatFileSize,
  type StorageFile,
  type StorageFolder,
} from '@/lib/storage';
import ImageOptimizationPanel from '@/components/admin/ImageOptimizationPanel';

type ViewMode = 'grid' | 'list';

interface EditingFile extends StorageFile {
  isEditing: boolean;
  editData: {
    alt: string;
    title: string;
    description: string;
  };
}

export default function GalerieAdminPage() {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [folders, setFolders] = useState<StorageFolder[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [editingFile, setEditingFile] = useState<EditingFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Charger les fichiers et dossiers
  const loadContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [filesData, foldersData] = await Promise.all([
        listFiles(currentPath),
        listFolders(currentPath),
      ]);
      setFiles(filesData);
      setFolders(foldersData);
    } catch (error: any) {
      console.error('Erreur chargement:', error);
      
      // Message d'erreur spécifique selon le type
      if (error?.code === 'storage/unauthorized') {
        setError('❌ Accès refusé. Veuillez vous connecter avec un compte administrateur.');
      } else if (error?.code === 'storage/retry-limit-exceeded') {
        setError('⚠️ Erreur de connexion à Firebase Storage. Vérifiez que vous êtes bien connecté.');
      } else {
        setError(`Erreur: ${error?.message || 'Erreur inconnue'}`);
      }
    } finally {
      setLoading(false);
    }
  }, [currentPath]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Drag & Drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        const path = currentPath ? `${currentPath}/${file.name}` : file.name;
        await uploadFile(file, path);
      }
      await loadContent();
      alert(`${acceptedFiles.length} fichier(s) uploadé(s) avec succès`);
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  }, [currentPath, loadContent]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'],
    },
  });

  // Navigation
  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath);
    setSelectedFiles(new Set());
  };

  const navigateUp = () => {
    const pathParts = currentPath.split('/');
    pathParts.pop();
    setCurrentPath(pathParts.join('/'));
    setSelectedFiles(new Set());
  };

  // Créer un dossier
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      // Pour créer un dossier dans Storage, on doit créer un fichier placeholder
      const folderPath = currentPath ? `${currentPath}/${newFolderName}` : newFolderName;
      const placeholder = new File([''], '.placeholder', { type: 'text/plain' });
      await uploadFile(placeholder, `${folderPath}/.placeholder`);
      
      setShowNewFolderModal(false);
      setNewFolderName('');
      await loadContent();
    } catch (error) {
      console.error('Erreur création dossier:', error);
      alert('Erreur lors de la création du dossier');
    }
  };

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

  // Supprimer un dossier
  const handleDeleteFolder = async (folderPath: string) => {
    if (!confirm(`Supprimer le dossier "${folderPath}" et tout son contenu ?`)) return;
    
    try {
      await deleteFolder(folderPath);
      await loadContent();
      alert('Dossier supprimé');
    } catch (error) {
      console.error('Erreur suppression dossier:', error);
      alert('Erreur lors de la suppression du dossier');
    }
  };

  // Éditer métadonnées
  const handleEditFile = (file: StorageFile) => {
    setEditingFile({
      ...file,
      isEditing: true,
      editData: {
        alt: file.customMetadata?.alt || '',
        title: file.customMetadata?.title || '',
        description: file.customMetadata?.description || '',
      },
    });
  };

  const handleSaveMetadata = async () => {
    if (!editingFile) return;
    
    try {
      await updateFileMetadata(editingFile.fullPath, editingFile.editData);
      setEditingFile(null);
      await loadContent();
      alert('Métadonnées mises à jour');
    } catch (error) {
      console.error('Erreur mise à jour métadonnées:', error);
      alert('Erreur lors de la mise à jour');
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
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map(f => f.fullPath)));
    }
  };

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      {/* Sidebar Dossiers */}
      <aside className="w-64 bg-white border-r border-stone-200 h-full flex-shrink-0 flex flex-col">
        <h2 className="text-lg font-semibold px-6 py-4 border-b border-stone-200">Dossiers</h2>
        
        <div className="flex-1 overflow-y-auto p-4">
        {/* Racine */}
        <button
          onClick={() => setCurrentPath('')}
          className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors ${
            currentPath === '' 
              ? 'bg-accent text-white' 
              : 'hover:bg-stone-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🏠</span>
            <span className="font-medium">Racine</span>
          </div>
        </button>
        
        {/* Liste des dossiers */}
        {loading ? (
          <div className="px-3 py-2 text-sm text-secondary">Chargement...</div>
        ) : (
          <div className="space-y-1">
            {folders.map((folder) => (
              <button
                key={folder.fullPath}
                onClick={() => navigateToFolder(folder.fullPath)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors group ${
                  currentPath === folder.fullPath
                    ? 'bg-accent text-white'
                    : 'hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">📁</span>
                  <span className="text-sm font-medium truncate">{folder.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header fixe */}
        <div className="bg-white border-b border-stone-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-display font-semibold text-primary">Gestionnaire de Galerie</h1>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3x3 className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-secondary mb-4">
            <button
              onClick={() => setCurrentPath('')}
              className="hover:text-accent transition-colors"
            >
              Racine
            </button>
            {currentPath.split('/').filter(Boolean).map((part, index, arr) => (
              <span key={index} className="flex items-center gap-2">
                <span>/</span>
                <button
                  onClick={() => {
                    const path = arr.slice(0, index + 1).join('/');
                    navigateToFolder(path);
                  }}
                  className="hover:text-accent transition-colors"
                >
                  {part}
                </button>
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
            
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="btn btn-secondary flex items-center gap-2"
            >
              <FolderPlus className="w-4 h-4" />
              Nouveau dossier
            </button>

            {currentPath && (
              <button
                onClick={navigateUp}
                className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50 transition-colors"
              >
                ← Retour
              </button>
            )}

            {selectedFiles.size > 0 && (
              <>
                <button
                  onClick={selectAll}
                  className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50 transition-colors"
                >
                  {selectedFiles.size === files.length ? 'Désélectionner tout' : 'Tout sélectionner'}
                </button>
                
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer ({selectedFiles.size})
                </button>
              </>
            )}
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto bg-stone-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Erreur */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-800 font-medium mb-2">Erreur Firebase Storage</p>
                    <p className="text-red-700 text-sm">{error}</p>
                    <p className="text-red-600 text-xs mt-2">
                      💡 Vérifiez que vous êtes connecté avec <strong>clement@nucom.fr</strong> dans Firebase Auth
                    </p>
                  </div>
                </div>
              </div>
            )}
        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-secondary">Chargement...</p>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {/* Panneau d'optimisation */}
            <div className="mb-6">
              <ImageOptimizationPanel
                files={files}
                currentPath={currentPath}
                onOptimizationComplete={loadContent}
              />
            </div>

            {/* Fichiers */}
            <div className="bg-white rounded-lg shadow-sm p-6">
            {files.length > 0 ? (
              <>
                <h2 className="text-lg font-semibold mb-3">Fichiers ({files.length})</h2>
                
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {files.map((file) => (
                      <div
                        key={file.fullPath}
                        className={`group relative rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                          selectedFiles.has(file.fullPath)
                            ? 'border-accent shadow-lg'
                            : 'border-stone-200 hover:border-accent/50'
                        }`}
                        onClick={() => toggleFileSelection(file.fullPath)}
                      >
                        {/* Image */}
                        <div className="aspect-square relative bg-stone-100">
                          <Image
                            src={file.url}
                            alt={file.customMetadata?.alt || file.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          />
                          
                          {selectedFiles.has(file.fullPath) && (
                            <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                                <Check className="w-5 h-5 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Info */}
                        <div className="p-2">
                          <p className="text-xs font-medium truncate">{file.name}</p>
                          <p className="text-xs text-secondary">{formatFileSize(file.size)}</p>
                        </div>
                        
                        {/* Actions */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditFile(file);
                            }}
                            className="p-1.5 rounded bg-accent text-white hover:bg-accent-dark"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          
                          <a
                            href={file.url}
                            download={file.name}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded bg-blue-500 text-white hover:bg-blue-600"
                          >
                            <Download className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-stone-200">
                    {files.map((file) => (
                      <div
                        key={file.fullPath}
                        className={`flex items-center gap-4 p-3 hover:bg-stone-50 transition-colors cursor-pointer ${
                          selectedFiles.has(file.fullPath) ? 'bg-accent/5' : ''
                        }`}
                        onClick={() => toggleFileSelection(file.fullPath)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFiles.has(file.fullPath)}
                          onChange={() => {}}
                          className="w-4 h-4"
                        />
                        
                        <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={file.url}
                            alt={file.customMetadata?.alt || file.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-sm text-secondary">{formatFileSize(file.size)}</p>
                          {file.customMetadata?.alt && (
                            <p className="text-xs text-secondary truncate">Alt: {file.customMetadata.alt}</p>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditFile(file);
                            }}
                            className="p-2 rounded hover:bg-stone-100"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          
                          <a
                            href={file.url}
                            download={file.name}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded hover:bg-stone-100"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              !loading && folders.length === 0 && (
                <div className="text-center py-12 text-secondary">
                  <p>Aucun fichier dans ce dossier</p>
                </div>
              )
            )}
            </div>
          </>
        )}
          </div>
        </div>


      {/* Modales */}
      {/* Modal: Upload */}
      {showUploadModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Upload d&apos;images</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 rounded hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Zone drag & drop */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 transition-colors cursor-pointer mb-4 ${
                isDragActive ? 'border-accent bg-accent/5' : 'border-stone-300 hover:border-accent/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <Upload className="w-16 h-16 mx-auto mb-4 text-accent" />
                <p className="text-lg font-medium mb-2">
                  {isDragActive ? 'Déposez les fichiers ici' : 'Glissez-déposez des images ici'}
                </p>
                <p className="text-sm text-secondary mb-4">
                  ou cliquez pour sélectionner des fichiers
                </p>
                <p className="text-xs text-secondary">
                  Formats acceptés : PNG, JPG, JPEG, WebP, GIF, SVG
                </p>
              </div>
            </div>
            
            {uploading && (
              <div className="text-center py-4">
                <p className="text-sm text-secondary">Upload en cours...</p>
              </div>
            )}
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal: Nouveau dossier */}
        {showNewFolderModal && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewFolderModal(false)}
          >
            <div 
              className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">Nouveau dossier</h3>
              
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Nom du dossier"
                className="w-full px-4 py-2 rounded-lg border border-stone-300 mb-4"
                autoFocus
              />
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowNewFolderModal(false);
                    setNewFolderName('');
                  }}
                  className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateFolder}
                  className="btn btn-primary"
                  disabled={!newFolderName.trim()}
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Édition métadonnées */}
        {editingFile && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingFile(null)}
          >
            <div 
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Éditer les métadonnées</h3>
                <button
                  onClick={() => setEditingFile(null)}
                  className="p-2 rounded hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Aperçu image */}
              <div className="mb-6 relative w-full h-64 rounded-lg overflow-hidden bg-stone-100">
                <Image
                  src={editingFile.url}
                  alt={editingFile.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>
              
              {/* Nom fichier */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nom du fichier</label>
                <p className="px-4 py-2 rounded-lg bg-stone-50 text-secondary">{editingFile.name}</p>
              </div>
              
              {/* Texte alternatif */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Texte alternatif (Alt)</label>
                <input
                  type="text"
                  value={editingFile.editData.alt}
                  onChange={(e) =>
                    setEditingFile({
                      ...editingFile,
                      editData: { ...editingFile.editData, alt: e.target.value },
                    })
                  }
                  placeholder="Description de l'image pour l'accessibilité"
                  className="w-full px-4 py-2 rounded-lg border border-stone-300"
                />
              </div>
              
              {/* Titre */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Titre</label>
                <input
                  type="text"
                  value={editingFile.editData.title}
                  onChange={(e) =>
                    setEditingFile({
                      ...editingFile,
                      editData: { ...editingFile.editData, title: e.target.value },
                    })
                  }
                  placeholder="Titre de l'image"
                  className="w-full px-4 py-2 rounded-lg border border-stone-300"
                />
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={editingFile.editData.description}
                  onChange={(e) =>
                    setEditingFile({
                      ...editingFile,
                      editData: { ...editingFile.editData, description: e.target.value },
                    })
                  }
                  placeholder="Description détaillée"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300"
                />
              </div>
              
              {/* Infos fichier */}
              <div className="mb-6 p-4 rounded-lg bg-stone-50 text-sm">
                <p className="mb-1"><strong>Taille :</strong> {formatFileSize(editingFile.size)}</p>
                <p className="mb-1"><strong>Type :</strong> {editingFile.contentType}</p>
                <p><strong>Chemin :</strong> {editingFile.fullPath}</p>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setEditingFile(null)}
                  className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveMetadata}
                  className="btn btn-primary"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
