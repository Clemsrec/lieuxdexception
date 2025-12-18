#!/bin/bash

# Script de test du système de gestion des contenus
# Usage: ./scripts/test-page-contents.sh

echo "🧪 Test du système de gestion des contenus"
echo "==========================================="
echo ""

echo "📋 Étape 1/4 : Initialisation des contenus dans Firestore..."
node scripts/init-page-contents.js
if [ $? -eq 0 ]; then
  echo "✅ Contenus initialisés avec succès"
else
  echo "❌ Erreur lors de l'initialisation"
  exit 1
fi

echo ""
echo "📋 Étape 2/4 : Déploiement des règles Firestore..."
firebase deploy --only firestore:rules
if [ $? -eq 0 ]; then
  echo "✅ Règles déployées avec succès"
else
  echo "❌ Erreur lors du déploiement des règles"
  exit 1
fi

echo ""
echo "📋 Étape 3/4 : Vérification de l'API..."
echo "⏳ Démarrage du serveur de dev (Ctrl+C pour arrêter)..."
echo ""
echo "👉 Une fois le serveur démarré, testez :"
echo "   1. Dashboard admin : http://localhost:3002/admin/contenus"
echo "   2. Page publique : http://localhost:3002/mariages"
echo "   3. API directe : http://localhost:3002/api/admin/page-contents?pageId=homepage&locale=fr"
echo ""
echo "📋 Étape 4/4 : Checklist de validation"
echo "   [ ] Le dashboard /admin/contenus charge sans erreur"
echo "   [ ] Les 4 pages (Homepage, Contact, Mariages, B2B) sont listées"
echo "   [ ] Vous pouvez modifier un contenu et l'enregistrer"
echo "   [ ] Le message 'Contenu enregistré avec succès' s'affiche"
echo "   [ ] La page publique affiche le contenu modifié (après refresh)"
echo ""

# Démarrer le serveur
npm run dev
