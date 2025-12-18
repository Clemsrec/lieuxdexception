#!/bin/bash
# Script pour copier les fichiers public après le build standalone
# Nécessaire pour Firebase App Hosting avec output: standalone

set -e

echo "📦 Copie des fichiers public/ vers .next/standalone/public/..."

# Créer le répertoire si nécessaire
mkdir -p .next/standalone/public

# Copier tous les fichiers du dossier public
cp -r public/* .next/standalone/public/

echo "✅ Fichiers public/ copiés avec succès!"
echo "📂 Contenu de .next/standalone/public/:"
ls -la .next/standalone/public/ | head -20
