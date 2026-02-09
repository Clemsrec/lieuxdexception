/**
 * Composant de gestion de galerie pour les lieux
 * Permet d'uploader, réorganiser et supprimer des images
 */

'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Upload, X, GripVertical, Loader2, Trash2, Plus } from 'lucide-react';
import { uploadFile } from '@/lib/storage';

interface VenueGalleryManagerProps {
  venueSlug: string;
  images: string[];
  onChange: (images: string[]) => void;
}

export default function VenueGalleryManager({ 
  venueSlug, 
  images, 
  onChange 
}: VenueGalleryManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Upload d'images
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const newImages = [...images];

    try {
      for (const file of acceptedFiles) {
        const fileName = file.name;
        setUploadProgress(prev => ({ ...prev, [fileName]: 0 }));

        // Upload dans Firebase Storage sous venues/{slug}/gallery/
        const storagePath = `venues/${venueSlug}/gallery/${Date.now()}_${fileName}`;
        const uploadResult = await uploadFile(file, storagePath);

        // Ajouter l'URL à la galerie
        newImages.push(uploadResult.url);
        setUploadProgress(prev => ({ ...prev, [fileName]: 100 }));
      }

      onChange(newImages);
      setUploadProgress({});
    } catch (error) {
      console.error('Erreur upload galerie:', error);
      alert('Erreur lors de l\'upload des images');
    } finally {
      setUploading(false);
    }
  }, [venueSlug, images, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    multiple: true,
  });

  // Supprimer une image
  const handleRemoveImage = (index: number) => {
    if (!confirm('Supprimer cette image de la galerie ?')) return;
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  // Drag & Drop pour réorganiser
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const [removed] = newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, removed);

    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Zone d'upload */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          ${isDragActive 
            ? 'border-accent bg-accent/10' 
            : 'border-stone-300 hover:border-accent hover:bg-stone-50'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <p className="text-sm text-secondary">Upload en cours...</p>
            {Object.entries(uploadProgress).map(([filename, progress]) => (
              <div key={filename} className="text-xs text-secondary">
                {filename}: {progress}%
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-secondary" />
            <p className="text-sm text-primary font-medium">
              Glissez-déposez des images ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-secondary">
              PNG, JPG, JPEG, WEBP (max 10MB par image)
            </p>
          </div>
        )}
      </div>

      {/* Galerie actuelle */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-primary">
              Galerie ({images.length} {images.length === 1 ? 'image' : 'images'})
            </h4>
            <p className="text-xs text-secondary">
              Glissez pour réorganiser
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <div
                key={`${imageUrl}-${index}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  relative group rounded-lg overflow-hidden border-2
                  cursor-move transition-all
                  ${draggedIndex === index 
                    ? 'border-accent shadow-lg scale-105 opacity-50' 
                    : 'border-stone-200 hover:border-accent'
                  }
                `}
              >
                {/* Image */}
                <div className="relative aspect-4/3 bg-stone-100">
                  <Image
                    src={imageUrl}
                    alt={`Galerie ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized
                  />
                </div>

                {/* Overlay avec actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Numéro d'ordre */}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>

                {/* Poignée de drag */}
                <div className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info si vide */}
      {images.length === 0 && (
        <div className="text-center py-8 bg-stone-50 rounded-lg border border-stone-200">
          <p className="text-sm text-secondary">
            Aucune image dans la galerie. Ajoutez des images ci-dessus.
          </p>
        </div>
      )}
    </div>
  );
}
