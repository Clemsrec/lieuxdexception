/**
 * Page Admin - Gestion des Assets (Logos et Images Système)
 * 
 * Permet de visualiser et gérer tous les assets du site depuis Firebase Storage
 */

'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Download, ExternalLink, Copy, Check, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { STORAGE_LOGOS, STORAGE_IMAGES, getMainLogo } from '@/lib/storage-assets';

export default function AssetsPage() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  /**
   * Copier une URL dans le presse-papiers
   */
  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Erreur copie:', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Gestion des Assets
          </h1>
          <p className="text-secondary">
            Visualisez et gérez tous les logos et images système du site depuis Firebase Storage
          </p>
        </div>

        {/* Section Logos Principaux */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm mb-6">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Logos Principaux
            </h2>
            <p className="text-sm text-secondary mt-1">
              Logos utilisés dans la navigation et le footer
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Logo Blanc */}
              <AssetCard
                title="Logo Principal (Blanc)"
                description="Navigation header"
                url={STORAGE_LOGOS.mainWhite}
                imageUrl={STORAGE_LOGOS.mainWhite}
                usage="getMainLogo('white')"
                onCopy={copyToClipboard}
                copied={copiedUrl === STORAGE_LOGOS.mainWhite}
              />

              {/* Logo Couleur */}
              <AssetCard
                title="Logo Principal (Couleur)"
                description="Footer et autres sections"
                url={STORAGE_LOGOS.mainColor}
                imageUrl={STORAGE_LOGOS.mainColor}
                usage="getMainLogo('color')"
                onCopy={copyToClipboard}
                copied={copiedUrl === STORAGE_LOGOS.mainColor}
              />

              {/* Logo Compact */}
              <AssetCard
                title="Logo Compact"
                description="Version mobile/icône"
                url={STORAGE_LOGOS.compact}
                imageUrl={STORAGE_LOGOS.compact}
                usage="STORAGE_LOGOS.compact"
                onCopy={copyToClipboard}
                copied={copiedUrl === STORAGE_LOGOS.compact}
              />
            </div>
          </div>
        </div>

        {/* Section Logos Châteaux */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm mb-6">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Logos des Châteaux
            </h2>
            <p className="text-sm text-secondary mt-1">
              Logos individuels pour chaque lieu (variantes blanc et doré)
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(STORAGE_LOGOS.venues).map(([key, url]) => {
                const venueName = key
                  .replace(/Blanc$/, '')
                  .replace(/Dore$/, '')
                  .replace(/([A-Z])/g, ' $1')
                  .trim();
                const variant = key.endsWith('Blanc') ? 'Blanc' : 'Doré';

                return (
                  <AssetCard
                    key={key}
                    title={`${venueName} (${variant})`}
                    description={`Logo ${variant.toLowerCase()}`}
                    url={url}
                    imageUrl={url}
                    usage={`STORAGE_LOGOS.venues.${key}`}
                    onCopy={copyToClipboard}
                    copied={copiedUrl === url}
                    compact
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Section Images Système */}
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Images Système
            </h2>
            <p className="text-sm text-secondary mt-1">
              Images de fond, placeholders et images décoratives
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(STORAGE_IMAGES).map(([key, url]) => {
                const title = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())
                  .trim();

                return (
                  <AssetCard
                    key={key}
                    title={title}
                    description="Image système"
                    url={url}
                    imageUrl={url}
                    usage={`STORAGE_IMAGES.${key}`}
                    onCopy={copyToClipboard}
                    copied={copiedUrl === url}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>💡 Comment utiliser :</strong> Importez <code className="px-2 py-1 bg-blue-100 rounded">STORAGE_LOGOS</code> ou <code className="px-2 py-1 bg-blue-100 rounded">STORAGE_IMAGES</code> depuis <code className="px-2 py-1 bg-blue-100 rounded">@/lib/storage-assets</code> dans vos composants.
          </p>
          <p className="text-sm text-blue-900 mt-2">
            <strong>🔄 Mise à jour :</strong> Pour changer un asset, uploadez le nouveau fichier dans <Link href="/admin/galerie" className="underline">la galerie Storage</Link> puis mettez à jour l&apos;URL dans <code className="px-2 py-1 bg-blue-100 rounded">storage-assets.ts</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Composant carte d'asset
 */
interface AssetCardProps {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  usage: string;
  onCopy: (url: string) => void;
  copied: boolean;
  compact?: boolean;
}

function AssetCard({ title, description, url, imageUrl, usage, onCopy, copied, compact = false }: AssetCardProps) {
  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden hover:border-accent/50 transition-colors">
      {/* Prévisualisation */}
      <div className={`relative bg-neutral-100 flex items-center justify-center ${compact ? 'h-32' : 'h-48'}`}>
        <div className="relative w-full h-full p-4">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain"
            sizes={compact ? '200px' : '400px'}
          />
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-medium text-primary text-sm mb-1">{title}</h3>
        <p className="text-xs text-secondary mb-3">{description}</p>

        {/* Code d'utilisation */}
        <div className="mb-3">
          <code className="text-xs bg-neutral-100 px-2 py-1 rounded block overflow-x-auto">
            {usage}
          </code>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCopy(url)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
            title="Copier l'URL"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-green-600" />
                <span className="text-green-600">Copié</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copier URL
              </>
            )}
          </button>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border border-neutral-300 rounded hover:bg-neutral-50 transition-colors"
            title="Ouvrir dans un nouvel onglet"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
