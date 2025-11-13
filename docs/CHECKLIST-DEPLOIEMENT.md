# ✅ Checklist de Déploiement - Lieux d'Exception
## Guide étape par étape pour déployer sur Firebase App Hosting

**Date** : 13 novembre 2025  
**Projet** : lieux-d-exceptions  
**Status** : 🟢 Prêt pour déploiement

---

## 📋 État Actuel de la Configuration

### ✅ Fichiers Vérifiés (Tous présents)

- [x] `apphosting.yaml` - Configuration Firebase App Hosting
- [x] `firebase.json` - Configuration Firebase (Firestore, Storage, Hosting)
- [x] `next.config.js` - Output standalone + images optimization
- [x] `tsconfig.json` - Alias `@/*` configuré
- [x] `package.json` - Toutes les dépendances présentes
- [x] `.gitignore` - Fichiers critiques non bloqués

### ✅ Fichiers Sources Vérifiés

- [x] `src/lib/firebase-admin.ts` - Admin SDK avec ADC
- [x] `src/lib/firebase-client.ts` - Client SDK
- [x] `src/lib/firestore.ts` - Services CRUD
- [x] `src/lib/validation.ts` - Schémas Zod
- [x] `src/lib/security.ts` - Rate limiting + sanitization
- [x] `src/components/ui/Icon.tsx` - Composant icônes Lucide
- [x] `src/components/VenueCatalog.tsx` - Catalogue de lieux
- [x] `src/middleware.ts` - Sécurité HTTP + protection routes
- [x] `firestore.rules` - Règles de sécurité Firestore

### ✅ Dépendances Installées

```
firebase@10.14.1           ✅
firebase-admin@13.6.0      ✅
next@15.5.6                ✅
react@18.3.1               ✅
lucide-react@0.552.0       ✅
zod@3.25.76                ✅
```

---

## 🚀 Étapes de Déploiement

### 1️⃣ Préparation Locale

```bash
# 1. S'assurer d'être sur la branche main
git checkout main
git pull origin main

# 2. Nettoyer le cache Next.js
rm -rf .next

# 3. Réinstaller les dépendances (optionnel si problème)
# rm -rf node_modules package-lock.json
# npm install

# 4. Tester le build en local
npm run build
```

**✅ Le build doit passer sans erreur !**

Si erreur, vérifier :
- Messages d'erreur TypeScript
- Imports manquants
- Fichiers référencés mais absents

---

### 2️⃣ Vérification Git

```bash
# Vérifier le statut
git status

# Ajouter tous les fichiers modifiés
git add .

# Commit avec message descriptif
git commit -m "fix: optimiser configuration pour Firebase App Hosting

- Ajouter hostname firebasestorage.app dans next.config.js
- Améliorer headers de sécurité HTTP
- Mettre à jour rapport Firebase App Hosting complet
- Tous les fichiers source présents et fonctionnels"

# Push vers GitHub
git push origin main
```

**⚠️ Important** : Firebase App Hosting peut se déployer automatiquement via GitHub !

---

### 3️⃣ Déploiement Firebase

#### Option A : Via Firebase CLI (Recommandé)

```bash
# 1. Se connecter à Firebase (si pas déjà fait)
firebase login

# 2. Sélectionner le projet
firebase use lieux-d-exceptions

# 3. Déployer les Firestore Rules EN PREMIER
firebase deploy --only firestore:rules

# 4. Déployer l'application
firebase deploy --only hosting

# 5. Voir les logs en temps réel
gcloud logging tail "resource.type=cloud_run_revision" --project=lieux-d-exceptions
```

#### Option B : Via GitHub CI/CD (Automatique)

Si configuré, le simple `git push` déclenche le déploiement automatique !

Vérifier dans GitHub : `Actions` → Voir le workflow en cours

---

### 4️⃣ Vérification Post-Déploiement

```bash
# 1. Tester l'URL de production
curl -I https://lieux-d-exceptions.web.app

# Doit retourner : HTTP/2 200

# 2. Vérifier les headers de sécurité
curl -I https://lieux-d-exceptions.web.app | grep -E "(X-Frame|Content-Security|X-Content-Type)"

# Doit afficher :
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Content-Security-Policy: ...

# 3. Tester dans le navigateur
open https://lieux-d-exceptions.web.app

# Vérifier :
# - Page d'accueil se charge
# - Images Firebase Storage s'affichent
# - Pas d'erreur console navigateur
# - Firestore se connecte (via FirebaseTest)
```

---

### 5️⃣ Tests Fonctionnels

**Page d'accueil** (`/`)
- [ ] Hero section s'affiche
- [ ] 4 domaines featured chargés depuis Firestore
- [ ] Images optimisées (format AVIF/WebP)
- [ ] Navigation fonctionnelle

**Catalogue** (`/catalogue`)
- [ ] Liste complète des lieux
- [ ] Filtres fonctionnent
- [ ] Nombre de résultats affiché
- [ ] Redirection vers fiches lieux

**Fiche lieu** (`/lieux/[slug]`)
- [ ] Données Firestore chargées
- [ ] Galerie images fonctionnelle
- [ ] Carte Google Maps (si activée)
- [ ] Formulaire de contact

**Formulaires**
- [ ] Validation Zod fonctionne
- [ ] Création Lead dans Firestore
- [ ] Messages d'erreur affichés
- [ ] Redirection après succès

---

## 🔍 Diagnostic en Cas d'Erreur

### Erreur : Module not found

```bash
# Vérifier que le fichier existe
ls -la src/components/ui/Icon.tsx

# Vérifier l'import
grep -r "Icon.tsx" src/

# Si manquant, le fichier est bien là, vérifier la case
# Linux est case-sensitive : icon.tsx ≠ Icon.tsx
```

### Erreur : Firebase not initialized

```bash
# Vérifier les variables d'environnement en production
# Firebase App Hosting injecte automatiquement :
# - FIREBASE_CONFIG
# - FIREBASE_WEBAPP_CONFIG

# Voir les logs Firebase
gcloud logging read "resource.type=cloud_run_revision" \
    --project=lieux-d-exceptions \
    --limit=50 \
    --format=json | grep -i firebase
```

### Erreur : Image optimization failed

```bash
# Vérifier next.config.js
cat next.config.js | grep -A 10 "images:"

# Doit inclure :
# hostname: 'firebasestorage.googleapis.com'
# hostname: 'lieux-d-exceptions.firebasestorage.app'
```

### Erreur : Firestore permission denied

```bash
# Vérifier les règles Firestore
firebase firestore:rules:list

# Redéployer les règles
firebase deploy --only firestore:rules

# Tester depuis la console Firebase
# https://console.firebase.google.com/project/lieux-d-exceptions/firestore
```

---

## 📊 Monitoring Post-Déploiement

### Dashboards à surveiller

1. **Firebase Console**
   - https://console.firebase.google.com/project/lieux-d-exceptions/overview

2. **Google Cloud Console**
   - https://console.cloud.google.com/home/dashboard?project=lieux-d-exceptions

3. **Firestore Metrics**
   - https://console.firebase.google.com/project/lieux-d-exceptions/firestore

4. **Cloud Run Logs**
   - https://console.cloud.google.com/run?project=lieux-d-exceptions

### Métriques importantes

- **Latence** : < 2 secondes (P95)
- **Erreurs** : < 0.1% des requêtes
- **Firestore reads** : Surveiller le quota
- **Cloud Run instances** : 0-4 instances (scale to zero)

---

## 🔐 Configuration Secrets (Si Premier Déploiement)

```bash
# Configurer automatiquement tous les secrets
./scripts/setup-secrets.sh

# Ou manuellement :
gcloud secrets list --project=lieux-d-exceptions

# Secrets requis :
# - firebase-api-key
# - firebase-service-account-private-key
# - firebase-service-account-email
# - firebase-project-id
```

**Voir** : `docs/DEPLOYMENT.md` pour détails complets

---

## 📝 Rollback en Cas de Problème

```bash
# 1. Lister les déploiements récents
firebase hosting:releases:list

# 2. Restaurer version précédente
firebase hosting:clone SOURCE_SITE_ID:SOURCE_VERSION SITE_ID

# 3. Vérifier le rollback
curl -I https://lieux-d-exceptions.web.app
```

---

## ✅ Checklist Finale

### Avant le Déploiement
- [x] `npm run build` passe en local
- [x] Tous les fichiers sources présents
- [x] Git repository à jour
- [x] Variables d'environnement configurées (dev)
- [x] Firestore Rules testées

### Pendant le Déploiement
- [ ] Firestore Rules déployées en premier
- [ ] Build Firebase App Hosting réussit
- [ ] Pas d'erreur dans les logs
- [ ] URL accessible

### Après le Déploiement
- [ ] Page d'accueil fonctionne
- [ ] Firestore connecté
- [ ] Images chargent
- [ ] Formulaires fonctionnels
- [ ] Headers de sécurité présents
- [ ] Monitoring configuré

---

## 🎯 Commandes Rapides

```bash
# Build local
npm run build

# Dev local
npm run dev

# Déployer rules
firebase deploy --only firestore:rules

# Déployer app
firebase deploy --only hosting

# Tout déployer
firebase deploy

# Voir logs
gcloud logging tail "resource.type=cloud_run_revision" --project=lieux-d-exceptions

# Tester URL
curl -I https://lieux-d-exceptions.web.app
```

---

## 📞 Support

- **Documentation** : `docs/DEPLOYMENT.md`
- **Rapport Firebase** : `RAPPORT-FIREBASE-APP-HOSTING.md`
- **Console Firebase** : https://console.firebase.google.com/project/lieux-d-exceptions
- **GitHub Repository** : https://github.com/Clemsrec/lieuxdexception

---

**🎉 Bonne chance pour le déploiement !**

**Date de création** : 13 novembre 2025  
**Maintainer** : Groupe Riou - Équipe Tech
