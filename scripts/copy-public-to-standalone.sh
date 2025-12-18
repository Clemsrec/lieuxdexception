#!/bin/bash
# Script pour copier les fichiers public après le build standalone
# Nécessaire pour Firebase App Hosting avec output: standalone

set -e

echo "📦 Copie des fichiers public/ vers .next/standalone/public/..."

# Créer le répertoire si nécessaire
mkdir -p .next/standalone/public

# Copier tous les fichiers du dossier public
cp -r public/* .next/standalone/public/

# CRITICAL: Aussi copier vers .next/static pour Next.js Image optimization
echo "📦 Copie vers .next/static/media/..."
mkdir -p .next/static/media
cp -r public/logos .next/static/media/ 2>/dev/null || true
cp -r public/venues .next/static/media/ 2>/dev/null || true
cp -r public/images .next/static/media/ 2>/dev/null || true

echo "✅ Fichiers public/ copiés avec succès!"
echo "📂 Contenu de .next/standalone/public/:"
ls -la .next/standalone/public/ | head -20
echo ""
echo "📂 Contenu de .next/static/media/:"
ls -la .next/static/media/ 2>/dev/null | head -10 || echo "Pas de media/"
