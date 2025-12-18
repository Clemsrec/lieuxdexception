/**
 * Composant ImageOptimizationPanel
 * 
 * Panneau d'optimisation d'images :
 * - Affiche les statistiques d'optimisation
 * - Liste les images à optimiser
 * - Permet de convertir en WebP
 * - Optimisation batch
 */

'use client';

import { useState, useEffect } from 'react';
import { Zap, TrendingDown, AlertCircle, CheckCircle, Loader, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import {
  analyzeImageOptimization,
  getFolderOptimizationStats,
  formatFileSize,
  type StorageFile,
  type ImageOptimizationInfo,
  type FolderOptimizationStats,
} from '@/lib/storage';

interface ImageOptimizationPanelProps {
  /** Liste des fichiers à analyser */
  files: StorageFile[];
  /** Chemin du dossier actuel */
  currentPath: string;
  /** Callback après optimisation */
  onOptimizationComplete?: () => void;
}

interface OptimizingState {
  filePath: string;
  status: 'pending' | 'optimizing' | 'success' | 'error';
  message?: string;
  savings?: number;
}

/**
 * Panneau d'optimisation d'images pour la galerie admin
 */
export default function ImageOptimizationPanel({
  files,
  currentPath,
  onOptimizationComplete,
}: ImageOptimizationPanelProps) {
  const [stats, setStats] = useState<FolderOptimizationStats | null>(null);
  const [analyses, setAnalyses] = useState<Map<string, ImageOptimizationInfo>>(new Map());
  const [optimizing, setOptimizing] = useState<Map<string, OptimizingState>>(new Map());
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Analyser les images au chargement
   */
  useEffect(() => {
    analyzeImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  /**
   * Analyser toutes les images
   */
  const analyzeImages = async () => {
    setLoading(true);
    
    // Analyser chaque image
    const newAnalyses = new Map<string, ImageOptimizationInfo>();
    const imageFiles = files.filter(f => f.contentType?.startsWith('image/'));
    
    imageFiles.forEach(file => {
      const analysis = analyzeImageOptimization(file);
      newAnalyses.set(file.fullPath, analysis);
    });
    
    setAnalyses(newAnalyses);
    
    // Calculer les stats
    const optimizedCount = Array.from(newAnalyses.values()).filter(a => a.isOptimized).length;
    const totalSize = imageFiles.reduce((sum, f) => sum + f.size, 0);
    const potentialSavings = Array.from(newAnalyses.values()).reduce((sum, a) => {
      return sum + (a.size * a.potentialSavings / 100);
    }, 0);
    
    setStats({
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
    });
    
    setLoading(false);
  };

  /**
   * Optimiser une image
   */
  const optimizeImage = async (file: StorageFile) => {
    const analysis = analyses.get(file.fullPath);
    if (!analysis) return;

    // Marquer comme en cours
    setOptimizing(prev => new Map(prev).set(file.fullPath, {
      filePath: file.fullPath,
      status: 'optimizing',
    }));

    try {
      const response = await fetch('/api/admin/optimize-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: file.fullPath,
          convertToWebP: analysis.shouldConvertToWebP,
          quality: 80,
          maxWidth: 1920,
          maxHeight: 1920,
          deleteOriginal: false, // Garder l'original par sécurité
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'optimisation');
      }

      const result = await response.json();

      // Marquer comme succès
      setOptimizing(prev => new Map(prev).set(file.fullPath, {
        filePath: file.fullPath,
        status: 'success',
        message: `Économie de ${result.savingsPercent}%`,
        savings: result.savings,
      }));

      // Rafraîchir après 1 seconde
      setTimeout(() => {
        if (onOptimizationComplete) {
          onOptimizationComplete();
        }
      }, 1000);

    } catch (error) {
      console.error('Erreur optimisation:', error);
      setOptimizing(prev => new Map(prev).set(file.fullPath, {
        filePath: file.fullPath,
        status: 'error',
        message: error instanceof Error ? error.message : 'Erreur inconnue',
      }));
    }
  };

  /**
   * Optimiser toutes les images non optimisées
   */
  const optimizeAll = async () => {
    const unoptimized = files.filter(f => {
      const analysis = analyses.get(f.fullPath);
      return analysis && !analysis.isOptimized;
    });

    if (unoptimized.length === 0) {
      alert('Toutes les images sont déjà optimisées');
      return;
    }

    if (!confirm(`Optimiser ${unoptimized.length} image(s) ? Cela peut prendre quelques minutes.`)) {
      return;
    }

    // Optimiser une par une pour éviter surcharge serveur
    for (const file of unoptimized) {
      await optimizeImage(file);
      // Attendre 500ms entre chaque pour ne pas surcharger
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const unoptimizedFiles = files.filter(f => {
    const analysis = analyses.get(f.fullPath);
    return analysis && !analysis.isOptimized;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!stats || stats.totalImages === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm">
      {/* Header avec statistiques */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-primary">
                Optimisation des Images
              </h2>
              <p className="text-sm text-secondary">
                Analysez et optimisez vos images pour améliorer les performances
              </p>
            </div>
          </div>
          
          {stats.unoptimizedImages > 0 && (
            <button
              onClick={optimizeAll}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
            >
              <Zap className="w-5 h-5" />
              Optimiser tout ({stats.unoptimizedImages})
            </button>
          )}
        </div>

        {/* Statistiques en grille */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total images */}
          <div className="p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-5 h-5 text-secondary" />
              <span className="text-sm text-secondary uppercase tracking-wider">Total</span>
            </div>
            <p className="text-2xl font-bold text-primary">{stats.totalImages}</p>
            <p className="text-xs text-secondary mt-1">{stats.totalSizeFormatted}</p>
          </div>

          {/* Images optimisées */}
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700 uppercase tracking-wider">Optimisées</span>
            </div>
            <p className="text-2xl font-bold text-green-700">{stats.optimizedImages}</p>
            <p className="text-xs text-green-600 mt-1">{stats.optimizationPercentage}% du total</p>
          </div>

          {/* Images à optimiser */}
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-orange-700 uppercase tracking-wider">À optimiser</span>
            </div>
            <p className="text-2xl font-bold text-orange-700">{stats.unoptimizedImages}</p>
            <p className="text-xs text-orange-600 mt-1">Nécessitent attention</p>
          </div>

          {/* Économies potentielles */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-700 uppercase tracking-wider">Économies</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">{stats.potentialSavingsFormatted}</p>
            <p className="text-xs text-blue-600 mt-1">Potentiel d&apos;économie</p>
          </div>
        </div>

        {/* Barre de progression */}
        {stats.totalImages > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-secondary">Progression d&apos;optimisation</span>
              <span className="font-medium text-primary">{stats.optimizationPercentage}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div
                className="bg-linear-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.optimizationPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Toggle détails */}
        {unoptimizedFiles.length > 0 && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-4 text-sm text-accent hover:text-accent-dark transition-colors flex items-center gap-2"
          >
            {showDetails ? 'Masquer' : 'Afficher'} les images à optimiser
            <AlertCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Liste des images à optimiser */}
      {showDetails && unoptimizedFiles.length > 0 && (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">
            Images nécessitant une optimisation
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {unoptimizedFiles.map(file => {
              const analysis = analyses.get(file.fullPath);
              const optimizingState = optimizing.get(file.fullPath);
              
              if (!analysis) return null;

              return (
                <div
                  key={file.fullPath}
                  className="flex items-center gap-4 p-4 border border-neutral-200 rounded-lg hover:border-accent/50 transition-colors"
                >
                  {/* Miniature */}
                  <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden bg-neutral-100">
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary truncate">{file.name}</p>
                    <p className="text-sm text-secondary">{analysis.sizeFormatted}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {analysis.recommendations.slice(0, 2).map((rec, i) => (
                        <span key={i} className="text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded">
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Potentiel d'économie */}
                  {analysis.potentialSavings > 0 && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        -{analysis.potentialSavings}%
                      </p>
                      <p className="text-xs text-secondary">
                        ~{formatFileSize(analysis.size * analysis.potentialSavings / 100)}
                      </p>
                    </div>
                  )}

                  {/* Bouton action */}
                  <div>
                    {optimizingState?.status === 'optimizing' ? (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Loader className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Optimisation...</span>
                      </div>
                    ) : optimizingState?.status === 'success' ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm">{optimizingState.message}</span>
                      </div>
                    ) : optimizingState?.status === 'error' ? (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm">Erreur</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => optimizeImage(file)}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition-all"
                      >
                        <Zap className="w-4 h-4" />
                        Optimiser
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
