#!/bin/bash

###############################################################################
# Guide de Configuration des Secrets GitHub - Lieux d'Exception
#
# Ce script affiche les valeurs à copier dans les secrets GitHub
# 
# URL: https://github.com/Clemsrec/lieuxdexception/settings/secrets/actions
#
###############################################################################

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Configuration des Secrets GitHub - Lieux d'Exception"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Vérifier les fichiers nécessaires
if [ ! -f ".env.local" ]; then
    echo -e "${RED}✗ Fichier .env.local introuvable !${NC}"
    exit 1
fi

if [ ! -f "credentials/firebase-service-account.json" ]; then
    echo -e "${RED}✗ Fichier credentials/firebase-service-account.json introuvable !${NC}"
    exit 1
fi

# Charger .env.local
source .env.local

echo -e "${BLUE}📋 Accédez à :${NC}"
echo "   https://github.com/Clemsrec/lieuxdexception/settings/secrets/actions"
echo ""
echo -e "${YELLOW}⚠️  Cliquez sur 'New repository secret' pour chaque secret ci-dessous${NC}"
echo ""

# Secret 1: FIREBASE_API_KEY
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}Secret 1/4: FIREBASE_API_KEY${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Nom du secret (à copier) :"
echo "FIREBASE_API_KEY"
echo ""
echo "Valeur (à copier) :"
echo "$NEXT_PUBLIC_FIREBASE_API_KEY"
echo ""
read -p "Appuyez sur Entrée quand ce secret est ajouté..."

# Secret 2: FIREBASE_SERVICE_ACCOUNT
echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}Secret 2/4: FIREBASE_SERVICE_ACCOUNT${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Nom du secret (à copier) :"
echo "FIREBASE_SERVICE_ACCOUNT"
echo ""
echo "Valeur (tout le contenu JSON ci-dessous) :"
echo ""
cat credentials/firebase-service-account.json
echo ""
echo ""
read -p "Appuyez sur Entrée quand ce secret est ajouté..."

# Secret 3: GCP_WORKLOAD_IDENTITY_PROVIDER (optionnel mais recommandé)
echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}Secret 3/4: GCP_WORKLOAD_IDENTITY_PROVIDER${NC} ${YELLOW}(Optionnel)${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Nom du secret (à copier) :"
echo "GCP_WORKLOAD_IDENTITY_PROVIDER"
echo ""
echo "Valeur (format) :"
echo "projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/providers/PROVIDER_ID"
echo ""
echo -e "${YELLOW}Note: Si vous n'avez pas configuré Workload Identity Federation,"
echo "vous pouvez sauter ce secret. L'authentification se fera avec FIREBASE_SERVICE_ACCOUNT.${NC}"
echo ""
read -p "Appuyez sur Entrée pour continuer (ou Ctrl+C pour configurer plus tard)..."

# Secret 4: GCP_SERVICE_ACCOUNT (optionnel mais recommandé)
echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}Secret 4/4: GCP_SERVICE_ACCOUNT${NC} ${YELLOW}(Optionnel)${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Nom du secret (à copier) :"
echo "GCP_SERVICE_ACCOUNT"
echo ""
echo "Valeur (email du service account) :"
echo "firebase-adminsdk-fbsvc@lieux-d-exceptions.iam.gserviceaccount.com"
echo ""
echo -e "${YELLOW}Note: Utilisé avec Workload Identity. Si vous avez sauté le secret 3,"
echo "vous pouvez aussi sauter celui-ci.${NC}"
echo ""
read -p "Appuyez sur Entrée pour continuer..."

# Résumé
echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}✓ Configuration terminée !${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Secrets minimums requis :"
echo "  ✓ FIREBASE_API_KEY"
echo "  ✓ FIREBASE_SERVICE_ACCOUNT"
echo ""
echo "Secrets optionnels (pour Workload Identity) :"
echo "  • GCP_WORKLOAD_IDENTITY_PROVIDER"
echo "  • GCP_SERVICE_ACCOUNT"
echo ""
echo -e "${BLUE}Prochaines étapes :${NC}"
echo "  1. Déployer les règles Firebase :"
echo "     firebase deploy --only firestore:rules,storage"
echo ""
echo "  2. Pousser sur GitHub pour déclencher le déploiement :"
echo "     git push origin main"
echo ""

