# Fix Logos en Production (App Hosting)

## 🔴 Problème Initial

Les logos ne s'affichaient pas en production sur App Hosting alors qu'ils fonctionnaient en local.

## 🔍 Cause Racine

Avec `output: 'standalone'` dans Next.js, le dossier `public/` n'est **PAS automatiquement copié** dans `.next/standalone/`.

Firebase App Hosting déploie uniquement le contenu de `.next/standalone/`, donc les fichiers static (logos, images) étaient absents en production.

## ✅ Solution Implémentée

### 1. Script de copie post-build

**Fichier** : `scripts/copy-public-to-standalone.sh`

```bash
#!/bin/bash
mkdir -p .next/standalone/public
cp -r public/* .next/standalone/public/
```

### 2. Modification package.json

```json
"scripts": {
  "build": "next build --no-lint && bash scripts/copy-public-to-standalone.sh"
}
```

Le script s'exécute automatiquement après chaque build.

### 3. Fix headers cache

**Avant** : `/Logos/:path*` (majuscule)
**Après** : `/logos/:path*` (minuscule, comme le dossier réel)

Ajout header cache pour `/venues/:path*` également.

## 📦 Vérification

Après `npm run build`, le dossier `.next/standalone/public/` contient :

```
.next/standalone/public/
├── logos/
│   ├── brulaire-blanc.png
│   ├── brulaire-dore.png
│   ├── boulaie-blanc.png
│   ├── boulaie-dore.png
│   ├── domaine-blanc.png
│   ├── domaine-dore.png
│   ├── dome-blanc.png
│   ├── dome-dore.png
│   └── logo-lieux-exception-blanc.png
├── venues/
└── images/
```

## 🚀 Déploiement

```bash
npm run build              # Build + copie public/
firebase deploy --only hosting
```

Ou via GitHub push (CI/CD automatique).

## ⚠️ Important

Ce fix est **permanent** et s'applique à tous les déploiements App Hosting tant que `output: 'standalone'` est utilisé.

## 📝 Fichiers Modifiés

- ✅ `scripts/copy-public-to-standalone.sh` (nouveau)
- ✅ `package.json` (script build modifié)
- ✅ `next.config.js` (headers cache corrigés)
- ✅ `.firebaseappignore` (optimisation déploiement)

## 🔗 Références

- [Next.js Standalone Output](https://nextjs.org/docs/advanced-features/output-file-tracing)
- [Firebase App Hosting Docs](https://firebase.google.com/docs/app-hosting)
