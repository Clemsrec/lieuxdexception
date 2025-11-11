# Configuration GitHub Secrets - Lieux d'Exception

Ce fichier documente les secrets à configurer dans GitHub pour le CI/CD.

## 🔐 Secrets à Configurer

Accéder à : `https://github.com/Clemsrec/lieuxdexception/settings/secrets/actions`

### Secrets Requis

| Nom du Secret | Description | Où le trouver |
|---------------|-------------|---------------|
| `FIREBASE_API_KEY` | Clé API Firebase pour le client | `.env.local` → `NEXT_PUBLIC_FIREBASE_API_KEY` |
| `FIREBASE_SERVICE_ACCOUNT` | JSON complet du service account | `credentials/firebase-service-account.json` (contenu entier) |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Provider Workload Identity | Console GCP → IAM → Workload Identity |
| `GCP_SERVICE_ACCOUNT` | Email du service account | `firebase-adminsdk-fbsvc@lieux-d-exceptions.iam.gserviceaccount.com` |

## 📝 Comment Ajouter les Secrets

### 1. FIREBASE_API_KEY

```bash
# Copier la valeur depuis .env.local
cat .env.local | grep NEXT_PUBLIC_FIREBASE_API_KEY
```

Dans GitHub:
- Nom: `FIREBASE_API_KEY`
- Valeur: Votre clé API (ex: `AIzaSy...`)

### 2. FIREBASE_SERVICE_ACCOUNT

```bash
# Copier tout le contenu du fichier JSON
cat credentials/firebase-service-account.json
```

Dans GitHub:
- Nom: `FIREBASE_SERVICE_ACCOUNT`
- Valeur: Coller tout le JSON (avec les accolades)

### 3. GCP_WORKLOAD_IDENTITY_PROVIDER (Optionnel mais recommandé)

Pour utiliser Workload Identity au lieu de clés de service account:

```bash
# Créer le pool Workload Identity
gcloud iam workload-identity-pools create "github-actions-pool" \
    --project="lieux-d-exceptions" \
    --location="global" \
    --display-name="GitHub Actions Pool"

# Créer le provider
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
    --project="lieux-d-exceptions" \
    --location="global" \
    --workload-identity-pool="github-actions-pool" \
    --display-name="GitHub Provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
    --issuer-uri="https://token.actions.githubusercontent.com"

# Obtenir le nom complet du provider
gcloud iam workload-identity-pools providers describe "github-provider" \
    --project="lieux-d-exceptions" \
    --location="global" \
    --workload-identity-pool="github-actions-pool" \
    --format="value(name)"
```

Le format sera :
```
projects/886228169873/locations/global/workloadIdentityPools/github-actions-pool/providers/github-provider
```

Dans GitHub:
- Nom: `GCP_WORKLOAD_IDENTITY_PROVIDER`
- Valeur: Le nom complet du provider ci-dessus

### 4. GCP_SERVICE_ACCOUNT

Dans GitHub:
- Nom: `GCP_SERVICE_ACCOUNT`
- Valeur: `firebase-adminsdk-fbsvc@lieux-d-exceptions.iam.gserviceaccount.com`

## ✅ Vérification

Après avoir ajouté tous les secrets:

1. **Vérifier dans GitHub**
   - Aller sur Settings → Secrets and variables → Actions
   - Tous les secrets doivent apparaître avec un cadenas 🔒

2. **Tester le workflow**
   - Faire un commit sur une branche de test
   - Ouvrir une Pull Request
   - Le workflow "Deploy to Firebase App Hosting" doit se lancer

3. **Vérifier les logs**
   - Onglet "Actions" dans GitHub
   - Vérifier qu'il n'y a pas d'erreur d'authentification

## 🔄 Rotation des Secrets

### Fréquence Recommandée
- **FIREBASE_API_KEY** : Tous les 90 jours
- **FIREBASE_SERVICE_ACCOUNT** : Tous les 180 jours

### Procédure de Rotation

```bash
# 1. Générer nouvelle clé API dans Console Firebase
# 2. Mettre à jour le secret dans GitHub
# 3. Tester avec un déploiement preview
# 4. Valider en production
# 5. Révoquer l'ancienne clé après 24h
```

## 🚨 En Cas de Compromission

1. **Révoquer immédiatement** la clé compromise
2. **Regénérer** une nouvelle clé
3. **Mettre à jour** le secret dans GitHub
4. **Redéployer** l'application
5. **Auditer** les logs pour détecter toute utilisation frauduleuse

## 📞 Support

Pour toute question sur la configuration des secrets:
- **Documentation GitHub Actions** : https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **Documentation Workload Identity** : https://cloud.google.com/iam/docs/workload-identity-federation
- **Support Firebase** : https://firebase.google.com/support

---

**Dernière mise à jour** : 11 novembre 2025
