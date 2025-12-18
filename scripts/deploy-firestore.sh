#!/bin/bash
# Script de déploiement des règles et index Firestore
# Usage: ./scripts/deploy-firestore.sh

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement Firestore - Lieux d'Exception"
echo "=============================================="
echo ""

# Vérifier que Firebase CLI est installé
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI n'est pas installé"
    echo "   Installer avec: npm install -g firebase-tools"
    exit 1
fi

# Vérifier que l'utilisateur est connecté
if ! firebase projects:list &> /dev/null; then
    echo "❌ Non connecté à Firebase"
    echo "   Se connecter avec: firebase login"
    exit 1
fi

echo "📋 Étape 1/3 : Vérification des fichiers..."
if [ ! -f "firestore.rules" ]; then
    echo "❌ Fichier firestore.rules introuvable"
    exit 1
fi
if [ ! -f "firestore.indexes.json" ]; then
    echo "❌ Fichier firestore.indexes.json introuvable"
    exit 1
fi
echo "✅ Fichiers trouvés"
echo ""

echo "📋 Étape 2/3 : Déploiement des règles Firestore..."
firebase deploy --only firestore:rules
echo "✅ Règles déployées"
echo ""

echo "📋 Étape 3/3 : Déploiement des index Firestore..."
firebase deploy --only firestore:indexes
echo "✅ Index déployés"
echo ""

echo "=============================================="
echo "✅ Déploiement Firestore terminé avec succès !"
echo ""
echo "📝 Prochaines étapes :"
echo "   1. Vérifier les règles : https://console.firebase.google.com/project/lieux-d-exceptions/firestore/rules"
echo "   2. Vérifier les index : https://console.firebase.google.com/project/lieux-d-exceptions/firestore/indexes"
echo "   3. Attendre que les index se construisent (peut prendre quelques minutes)"
echo ""
