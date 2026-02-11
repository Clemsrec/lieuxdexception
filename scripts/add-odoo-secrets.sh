#!/bin/bash

###############################################################################
# Script d'ajout des secrets Odoo via Firebase CLI
# 
# Prérequis: firebase CLI authentifié
# Usage: ./scripts/add-odoo-secrets.sh
###############################################################################

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔐 Configuration des secrets Odoo via Firebase CLI${NC}"
echo ""

# Vérifier que firebase CLI est installé
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI n'est pas installé.${NC}"
    echo "Installez-le: npm install -g firebase-tools"
    exit 1
fi

# Vérifier l'authentification
echo -e "${BLUE}ℹ${NC} Vérification de l'authentification Firebase..."
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠${NC} Authentification nécessaire"
    firebase login
fi

echo -e "${GREEN}✓${NC} Firebase CLI authentifié"
echo ""

# Lire les valeurs depuis .env.local
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ Fichier .env.local introuvable !${NC}"
    exit 1
fi

source .env.local

# Configurer les secrets via Firebase CLI
echo -e "${BLUE}[1/3]${NC} Configuration du secret ODOO_API_KEY..."
echo -n "$ODOO_API_KEY" | firebase apphosting:secrets:set ODOO_API_KEY

echo -e "${GREEN}✓${NC} Secret ODOO_API_KEY configuré"
echo ""

# Upstash Redis (optionnel)
if [ -n "$UPSTASH_REDIS_REST_URL" ]; then
    echo -e "${BLUE}[2/3]${NC} Configuration du secret UPSTASH_REDIS_REST_URL..."
    echo -n "$UPSTASH_REDIS_REST_URL" | firebase apphosting:secrets:set UPSTASH_REDIS_REST_URL
    echo -e "${GREEN}✓${NC} Secret UPSTASH_REDIS_REST_URL configuré"
    echo ""
fi

if [ -n "$UPSTASH_REDIS_REST_TOKEN" ]; then
    echo -e "${BLUE}[3/3]${NC} Configuration du secret UPSTASH_REDIS_REST_TOKEN..."
    echo -n "$UPSTASH_REDIS_REST_TOKEN" | firebase apphosting:secrets:set UPSTASH_REDIS_REST_TOKEN
    echo -e "${GREEN}✓${NC} Secret UPSTASH_REDIS_REST_TOKEN configuré"
    echo ""
fi

# Résumé
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}✓ Configuration terminée avec succès !${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Secrets configurés:"
echo "  ✓ ODOO_API_KEY"
[ -n "$UPSTASH_REDIS_REST_URL" ] && echo "  ✓ UPSTASH_REDIS_REST_URL"
[ -n "$UPSTASH_REDIS_REST_TOKEN" ] && echo "  ✓ UPSTASH_REDIS_REST_TOKEN"
echo ""
echo -e "${BLUE}📋 Prochaines étapes:${NC}"
echo "  1. Déployez l'application:"
echo "     git push origin main"
echo ""
echo "  2. Testez un formulaire sur:"
echo "     https://lieuxdexception.com/fr/contact"
echo ""
echo "  3. Vérifiez dans Odoo CRM:"
echo "     https://groupe-lr.odoo.com/web#menu_id=156&action=196"
echo ""

