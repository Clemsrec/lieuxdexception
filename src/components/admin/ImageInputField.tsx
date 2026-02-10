/**
 * Composant ImageInputField
 * 
 * Champ d'input pour les images avec :
 * - Bouton pour ouvrir le StorageImagePicker
 * - Prévisualisation de l'image sélectionnée
 * - Possibilité de saisir une URL manuellement
 * - Bouton pour supprimer l'image
 */

'use client';

import { useState } from 'react';
import { Image as ImageIcon, Folder, X, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import StorageImagePicker, { type StorageFile } from './StorageImagePicker';

interface ImageInputFieldProps {
  /** Label du champ */
  label: string;
  /** Valeur actuelle (URL de l'image) */
  value: string;
  /** Callback lors du changement de valeur */
  onChange: (url: string) => void;
  /** Placeholder pour l'input */
  placeholder?: string;
  /** Texte d'aide affiché sous le champ */
  helpText?: string;
  /** Dossier initial à afficher dans le picker */
  initialPickerPath?: string;
  /** Taille de la prévisualisation (défaut: 200px) */
  previewSize?: number;
}

/**
 * Champ d'input pour sélectionner une image depuis Storage
 */
export default function ImageInputField({
  label,
  value,
  onChange,
  placeholder = '/images/exemple.jpg',
  helpText,
  initialPickerPath = '',
  previewSize = 200,
}: ImageInputFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [imageError, setImageError] = useState(false);

  /**
   * Gérer la sélection depuis le picker
   */
  const handleSelectImage = (url: string, file: StorageFile) => {
    onChange(url);
    setImageError(false);
  };

  /**
   * Supprimer l'image
   */
  const handleClearImage = () => {
    onChange('');
    setImageError(false);
  };

  /**
   * Vérifier si l'URL est valide
   */
  const isValidUrl = value && !imageError;

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="block text-sm font-medium text-primary">
        {label}
      </label>

      {/* Groupe input + boutons */}
      <div className="flex gap-2">
        {/* Input URL */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setImageError(false);
            }}
            className="w-full px-4 py-2 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent font-mono text-sm"
            placeholder={placeholder}
          />
          {value && (
            <button
              onClick={handleClearImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-neutral-100 transition-colors"
              title="Supprimer l'image"
            >
              <X className="w-4 h-4 text-secondary" />
            </button>
          )}
        </div>

        {/* Bouton ouvrir Storage */}
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-primary transition-all font-medium whitespace-nowrap"
          title="Parcourir Storage"
        >
          <Folder className="w-5 h-5" />
          Parcourir Storage
        </button>
      </div>

      {/* Texte d'aide */}
      {helpText && (
        <p className="text-xs text-secondary">{helpText}</p>
      )}

      {/* Prévisualisation de l'image */}
      {isValidUrl && (
        <div className="relative inline-block">
          <div 
            className="relative rounded-lg overflow-hidden border-2 border-neutral-200 bg-neutral-100"
            style={{ width: previewSize, height: previewSize }}
          >
            <Image
              src={value}
              alt="Prévisualisation"
              fill
              className="object-cover"
              sizes={`${previewSize}px`}
              onError={() => setImageError(true)}
            />
          </div>

          {/* Boutons overlay */}
          <div className="absolute top-2 right-2 flex gap-2">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-colors"
              title="Ouvrir dans un nouvel onglet"
            >
              <ExternalLink className="w-4 h-4 text-primary" />
            </a>
            <button
              type="button"
              onClick={handleClearImage}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-colors"
              title="Supprimer"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>

          {/* Info de l'image */}
          <div className="mt-2 text-xs text-secondary">
            <p className="font-mono truncate max-w-[200px]" title={value}>
              {value.split('/').pop()}
            </p>
          </div>
        </div>
      )}

      {/* Message d'erreur si l'image ne charge pas */}
      {value && imageError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <ImageIcon className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-medium">Image introuvable</p>
            <p className="text-xs mt-1">L&apos;URL ne semble pas valide ou l&apos;image n&apos;est pas accessible.</p>
          </div>
        </div>
      )}

      {/* Modal du picker */}
      {showPicker && (
        <StorageImagePicker
          onSelect={handleSelectImage}
          onClose={() => setShowPicker(false)}
          currentUrl={value}
          initialPath={initialPickerPath}
          title={`Sélectionner une image : ${label}`}
        />
      )}
    </div>
  );
}
