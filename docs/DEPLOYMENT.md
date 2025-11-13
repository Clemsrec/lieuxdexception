# Guide de Déploiement - Lieux d'Exception
## Firebase App Hosting avec Google Cloud Secret Manager

Ce guide vous accompagne pour déployer l'application de manière sécurisée en utilisant Google Cloud Secret Manager pour les credentials sensibles.

---

## 📋 Prérequis

### Outils Nécessaires

1. **gcloud CLI**
   ```bash
   # Installation macOS
   brew install google-cloud-sdk
   
   # Installation Linux
   curl https://sdk.cloud.google.com | bash
   
   # Vérification
   gcloud --version
   ```

2. **Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase --version
   ```

3. **jq** (pour traiter JSON)
   ```bash
   # macOS
   brew install jq
   
   # Linux
   sudo apt-get install jq
   ```

### Authentification

```bash
# Se connecter à Google Cloud
gcloud auth login

# Se connecter à Firebase
firebase login

# Configurer le projet
gcloud config set project lieux-d-exceptions
firebase use lieux-d-exceptions
```

---

## 🔐 Étape 1 : Configuration des Secrets

### Automatique (Recommandé)

Le script automatique crée tous les secrets nécessaires :

```bash
./scripts/setup-secrets.sh
```

Ce script va :
1. ✅ Lire votre `.env.local` et `credentials/firebase-service-account.json`
2. ✅ Créer les secrets dans Google Cloud Secret Manager
3. ✅ Configurer les permissions IAM pour App Hosting
4. ✅ Valider que tout est correctement configuré

### Manuel (Alternative)

Si vous préférez créer les secrets manuellement :

#### 1.1 Clé API Firebase (client-side)

```bash
gcloud secrets create firebase-api-key \
    --data-file=- \
    --replication-policy="automatic" \
    --project=lieux-d-exceptions <<< "VOTRE_CLE_API_ICI"
```

#### 1.2 Service Account Private Key (server-side)

```bash
cat credentials/firebase-service-account.json | jq -r '.private_key' | \
gcloud secrets create firebase-service-account-private-key \
    --data-file=- \
    --replication-policy="automatic" \
    --project=lieux-d-exceptions
```

#### 1.3 Service Account Email

```bash
cat credentials/firebase-service-account.json | jq -r '.client_email' | \
gcloud secrets create firebase-service-account-email \
    --data-file=- \
    --replication-policy="automatic" \
    --project=lieux-d-exceptions
```

#### 1.4 Project ID

```bash
gcloud secrets create firebase-project-id \
    --data-file=- \
    --replication-policy="automatic" \
    --project=lieux-d-exceptions <<< "lieux-d-exceptions"
```

---

## 🔑 Étape 2 : Configuration des Permissions IAM

Donner accès aux secrets au service account App Hosting :

```bash
PROJECT_ID="lieux-d-exceptions"
APP_HOSTING_SA="firebase-app-hosting-compute@${PROJECT_ID}.iam.gserviceaccount.com"

# Pour chaque secret
for SECRET in firebase-api-key firebase-service-account-private-key firebase-service-account-email firebase-project-id; do
    gcloud secrets add-iam-policy-binding $SECRET \
        --member="serviceAccount:${APP_HOSTING_SA}" \
        --role="roles/secretmanager.secretAccessor" \
        --project=$PROJECT_ID
done
```

---

## 🚀 Étape 3 : Déploiement sur Firebase App Hosting

### Méthode 1 : Via Firebase CLI

```bash
# Build de production local
npm run build

# Déploiement
firebase deploy --only hosting
```

### Méthode 2 : Via GitHub (CI/CD)

Le déploiement automatique se fait via GitHub Actions (voir section CI/CD).

---

## 🔍 Étape 4 : Vérification Post-Déploiement

### 4.1 Vérifier les Secrets

```bash
# Lister tous les secrets
gcloud secrets list --project=lieux-d-exceptions

# Vérifier les permissions d'un secret
gcloud secrets get-iam-policy firebase-api-key --project=lieux-d-exceptions
```

### 4.2 Tester l'Application

1. **Ouvrir l'URL de production**
   ```
   https://lieux-d-exceptions.web.app
   ```

2. **Vérifier la console du navigateur**
   - Aucune erreur Firebase
   - Connexion Firestore OK
   - Authentification fonctionnelle

3. **Tester les formulaires**
   - Formulaire de contact
   - Création de lead B2B
   - Création de lead Mariage

### 4.3 Vérifier les Logs

```bash
# Logs de l'application
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=lieux-exceptions" \
    --project=lieux-d-exceptions \
    --limit=50 \
    --format=json

# Logs d'accès aux secrets
gcloud logging read "resource.type=secretmanager.googleapis.com/Secret" \
    --project=lieux-d-exceptions \
    --limit=20
```

---

## 🔄 Mise à Jour des Secrets

### Mettre à Jour un Secret Existant

```bash
# Nouvelle version d'un secret
echo -n "NOUVELLE_VALEUR" | gcloud secrets versions add SECRET_NAME \
    --data-file=- \
    --project=lieux-d-exceptions
```

### Révoquer une Ancienne Version

```bash
# Lister les versions
gcloud secrets versions list firebase-api-key --project=lieux-d-exceptions

# Désactiver une version
gcloud secrets versions disable VERSION_NUMBER \
    --secret=firebase-api-key \
    --project=lieux-d-exceptions

# Détruire une version (IRRÉVERSIBLE)
gcloud secrets versions destroy VERSION_NUMBER \
    --secret=firebase-api-key \
    --project=lieux-d-exceptions
```

---

## 🐛 Dépannage

### Erreur : "Permission denied on secret"

**Cause** : Le service account App Hosting n'a pas accès au secret

**Solution** :
```bash
gcloud secrets add-iam-policy-binding SECRET_NAME \
    --member="serviceAccount:firebase-app-hosting-compute@lieux-d-exceptions.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" \
    --project=lieux-d-exceptions
```

### Erreur : "Secret not found"

**Cause** : Le secret n'existe pas ou mauvais nom

**Solution** :
```bash
# Vérifier les secrets existants
gcloud secrets list --project=lieux-d-exceptions

# Créer le secret manquant
./scripts/setup-secrets.sh
```

### Erreur : "NEXT_PUBLIC_FIREBASE_API_KEY is undefined"

**Cause** : Le secret n'est pas correctement injecté

**Solution** :
1. Vérifier que le secret existe dans Secret Manager
2. Vérifier `apphosting.yaml` (référence correcte)
3. Redéployer l'application

### L'application ne se connecte pas à Firebase

**Checklist** :
- [ ] Clé API valide et non révoquée
- [ ] Restrictions de domaine incluent le domaine de production
- [ ] Firestore Rules déployées
- [ ] Réseau : pas de blocage CORS

---

## 📊 Monitoring & Alertes

### Créer une Alerte pour Accès Non Autorisé aux Secrets

```bash
# Créer une métrique de log
gcloud logging metrics create unauthorized_secret_access \
    --description="Accès non autorisé aux secrets" \
    --log-filter='resource.type="secretmanager.googleapis.com/Secret"
    AND protoPayload.status.code!=0
    AND protoPayload.authenticationInfo.principalEmail!~".*@lieux-d-exceptions.iam.gserviceaccount.com"'
```

### Dashboard de Monitoring

Accéder aux dashboards :
- **Secret Manager** : https://console.cloud.google.com/security/secret-manager?project=lieux-d-exceptions
- **Logs** : https://console.cloud.google.com/logs?project=lieux-d-exceptions
- **Monitoring** : https://console.cloud.google.com/monitoring?project=lieux-d-exceptions

---

## 🔒 Bonnes Pratiques de Sécurité

### ✅ À FAIRE

- ✅ Utiliser Secret Manager pour TOUTES les données sensibles
- ✅ Rotation des secrets tous les 90 jours
- ✅ Principe du moindre privilège pour les permissions IAM
- ✅ Monitoring actif des accès aux secrets
- ✅ Logs centralisés et alertes configurées
- ✅ Secrets versionnés (garder anciennes versions 30 jours)

### ❌ À NE JAMAIS FAIRE

- ❌ Commiter des secrets dans Git
- ❌ Partager des secrets via email/Slack
- ❌ Utiliser les mêmes secrets dev/staging/prod
- ❌ Donner accès "Editor" ou "Owner" aux service accounts
- ❌ Laisser des secrets actifs non utilisés

---

## 📞 Support & Resources

### Documentation Officielle

- **Secret Manager** : https://cloud.google.com/secret-manager/docs
- **App Hosting** : https://firebase.google.com/docs/app-hosting
- **IAM Best Practices** : https://cloud.google.com/iam/docs/best-practices

### Commandes Utiles

```bash
# Vérifier la configuration du projet
gcloud config list

# Vérifier les APIs activées
gcloud services list --enabled --project=lieux-d-exceptions

# Vérifier les permissions IAM
gcloud projects get-iam-policy lieux-d-exceptions

# Coût estimé Secret Manager
gcloud billing accounts list
```

---

## 🎯 Checklist de Déploiement

### Avant le Déploiement

- [ ] `.env.local` configuré avec les bonnes valeurs
- [ ] `credentials/firebase-service-account.json` présent
- [ ] Build de production local réussi (`npm run build`)
- [ ] Tests locaux passés
- [ ] Firestore Rules déployées
- [ ] Storage Rules déployées

### Configuration Secrets

- [ ] Script `setup-secrets.sh` exécuté sans erreur
- [ ] Tous les secrets créés dans Secret Manager
- [ ] Permissions IAM configurées
- [ ] Secrets vérifiés dans la console GCP

### Déploiement

- [ ] `apphosting.yaml` vérifié
- [ ] Déploiement Firebase réussi
- [ ] URL de production accessible
- [ ] Firebase fonctionne sur la prod
- [ ] Formulaires testés
- [ ] Monitoring actif

### Post-Déploiement

- [ ] Logs vérifiés (pas d'erreurs)
- [ ] Performance acceptable (< 2s)
- [ ] SEO validé (meta tags OK)
- [ ] Documentation à jour
- [ ] Équipe informée

---

**Dernière mise à jour** : 11 novembre 2025  
**Version** : 1.0  
**Maintainer** : Groupe Riou - Équipe Tech
