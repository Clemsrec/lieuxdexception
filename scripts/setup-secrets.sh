#!/bin/bash

###############################################################################
# Script de Configuration des Secrets Google Cloud - Lieux d'Exception
#
# Ce script crée et configure tous les secrets nécessaires dans
# Google Cloud Secret Manager pour le déploiement de l'application.
#
# Prérequis:
# - gcloud CLI installé et authentifié
# - Permissions "Secret Manager Admin" sur le projet
#
# Usage:
#   ./scripts/setup-secrets.sh
#
###############################################################################

set -e  # Exit on error

# Configuration
PROJECT_ID="lieux-d-exceptions"
REGION="europe-west1"

# Couleurs pour l'output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions helper
log_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

log_success() {
    echo -e "${GREEN}✓ ${NC}$1"
}

log_warning() {
    echo -e "${YELLOW}⚠ ${NC}$1"
}

log_error() {
    echo -e "${RED}✗ ${NC}$1"
}

# Vérifier que gcloud est installé
if ! command -v gcloud &> /dev/null; then
    log_error "gcloud CLI n'est pas installé. Installez-le: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

log_success "gcloud CLI détecté"

# Vérifier l'authentification
log_info "Vérification de l'authentification Google Cloud..."
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    log_error "Vous n'êtes pas authentifié. Exécutez: gcloud auth login"
    exit 1
fi

ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
log_success "Authentifié en tant que: $ACCOUNT"

# Configurer le projet
log_info "Configuration du projet: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Activer les APIs nécessaires
log_info "Activation des APIs Google Cloud..."
gcloud services enable secretmanager.googleapis.com --quiet
gcloud services enable firebaseapphosting.googleapis.com --quiet
log_success "APIs activées"

# Fonction pour créer ou mettre à jour un secret
create_or_update_secret() {
    local SECRET_NAME=$1
    local SECRET_VALUE=$2
    local DESCRIPTION=$3
    
    log_info "Traitement du secret: $SECRET_NAME"
    
    # Vérifier si le secret existe déjà
    if gcloud secrets describe $SECRET_NAME --project=$PROJECT_ID &> /dev/null; then
        log_warning "Secret '$SECRET_NAME' existe déjà. Mise à jour..."
        echo -n "$SECRET_VALUE" | gcloud secrets versions add $SECRET_NAME \
            --data-file=- \
            --project=$PROJECT_ID
        log_success "Secret '$SECRET_NAME' mis à jour"
    else
        log_info "Création du secret '$SECRET_NAME'..."
        echo -n "$SECRET_VALUE" | gcloud secrets create $SECRET_NAME \
            --data-file=- \
            --replication-policy="automatic" \
            --project=$PROJECT_ID \
            --labels=app=lieux-exceptions,env=production
        
        log_success "Secret '$SECRET_NAME' créé"
    fi
}

# Banner
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Configuration des Secrets - Lieux d'Exception"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Lire les valeurs depuis .env.local
log_info "Lecture des valeurs depuis .env.local..."

if [ ! -f ".env.local" ]; then
    log_error "Fichier .env.local introuvable !"
    log_info "Créez d'abord votre fichier .env.local avec les valeurs nécessaires."
    exit 1
fi

# Source le fichier .env.local
source .env.local

# Vérifier que les variables essentielles sont définies
if [ -z "$NEXT_PUBLIC_FIREBASE_API_KEY" ]; then
    log_error "NEXT_PUBLIC_FIREBASE_API_KEY n'est pas défini dans .env.local"
    exit 1
fi

log_success "Variables d'environnement chargées depuis .env.local"

# Lire le service account JSON
log_info "Lecture du service account..."
SERVICE_ACCOUNT_FILE="credentials/firebase-service-account.json"

if [ ! -f "$SERVICE_ACCOUNT_FILE" ]; then
    log_error "Fichier $SERVICE_ACCOUNT_FILE introuvable !"
    exit 1
fi

# Extraire les valeurs du service account JSON
FIREBASE_PRIVATE_KEY=$(cat $SERVICE_ACCOUNT_FILE | jq -r '.private_key')
FIREBASE_CLIENT_EMAIL=$(cat $SERVICE_ACCOUNT_FILE | jq -r '.client_email')
FIREBASE_PROJECT_ID=$(cat $SERVICE_ACCOUNT_FILE | jq -r '.project_id')

log_success "Service account chargé"

# Créer/Mettre à jour les secrets
echo ""
log_info "═══ Création/Mise à jour des secrets ═══"
echo ""

# Secret 1: Firebase API Key (côté client)
create_or_update_secret \
    "firebase-api-key" \
    "$NEXT_PUBLIC_FIREBASE_API_KEY" \
    "Firebase Web API Key pour le client"

# Secret 2: Firebase Service Account Private Key (côté serveur)
create_or_update_secret \
    "firebase-service-account-private-key" \
    "$FIREBASE_PRIVATE_KEY" \
    "Clé privée du service account Firebase"

# Secret 3: Firebase Service Account Email
create_or_update_secret \
    "firebase-service-account-email" \
    "$FIREBASE_CLIENT_EMAIL" \
    "Email du service account Firebase"

# Secret 4: Firebase Project ID
create_or_update_secret \
    "firebase-project-id" \
    "$FIREBASE_PROJECT_ID" \
    "ID du projet Firebase"

# Donner accès au service account App Hosting
log_info "Configuration des permissions IAM..."

APP_HOSTING_SERVICE_ACCOUNT="firebase-app-hosting-compute@${PROJECT_ID}.iam.gserviceaccount.com"

for SECRET_NAME in "firebase-api-key" "firebase-service-account-private-key" "firebase-service-account-email" "firebase-project-id"; do
    gcloud secrets add-iam-policy-binding $SECRET_NAME \
        --member="serviceAccount:${APP_HOSTING_SERVICE_ACCOUNT}" \
        --role="roles/secretmanager.secretAccessor" \
        --project=$PROJECT_ID \
        --quiet > /dev/null 2>&1 || true
done

log_success "Permissions IAM configurées"

# Résumé
echo ""
echo "═══════════════════════════════════════════════════════════"
log_success "Configuration des secrets terminée avec succès !"
echo "═══════════════════════════════════════════════════════════"
echo ""
log_info "Secrets créés/mis à jour:"
echo "  • firebase-api-key"
echo "  • firebase-service-account-private-key"
echo "  • firebase-service-account-email"
echo "  • firebase-project-id"
echo ""
log_info "Vous pouvez maintenant déployer l'application avec:"
echo "  firebase deploy --only hosting"
echo ""
log_info "Pour voir les secrets dans la console:"
echo "  https://console.cloud.google.com/security/secret-manager?project=$PROJECT_ID"
echo ""
