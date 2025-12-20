# 🎯 RÉCAPITULATIF OPTIMISATION LIGHTHOUSE - 19 Décembre 2025

## ✅ CE QUI EST FAIT

### 1. Images WebP Uploadées sur Firebase Storage
- ✅ `venues/chateau-brulaire/hero.webp` (924 KB au lieu de 3 927 KB)
- ✅ `logos/venues/dome-blanc.webp` (9.6 KB au lieu de 133 KB)
- ✅ `logos/venues/domaine-blanc.webp` (10.5 KB au lieu de 122 KB)
- ✅ `venues/domaine-nantais/mariages/domaine_cocktail_1.webp` (120 KB au lieu de 267 KB)

### 2. Code Mis à Jour
- ✅ `storage-assets.ts` : Logos `.png` → `.webp` + cache-busting `v=20251220`
- ✅ `PreloadHeroImages.tsx` créé pour améliorer LCP (-1 000 ms)
- ✅ `page.tsx` : Preload hero images ajouté

### 3. Firestore Vérifié
- ✅ Hero images déjà en WebP dans Firestore
- ✅ Logos chargés depuis `storage-assets.ts` (déjà WebP)

---

## 📊 GAINS ATTENDUS

| Asset | Avant | Après | Économie |
|-------|-------|-------|----------|
| Brûlaire hero | 3 927 KB | 924 KB | **-3 003 KB (-76%)** |
| Dôme logo | 133 KB | 9.6 KB | **-123 KB (-93%)** |
| Domaine logo | 122 KB | 10.5 KB | **-111 KB (-91%)** |
| Domaine cocktail | 267 KB | 120 KB | **-147 KB (-55%)** |
| **TOTAL** | **4 449 KB** | **1 064 KB** | **-3 385 KB (-76%)** |

### Impact Performance
- **LCP** : 1 330 ms → ~330 ms (-75%) grâce au preload
- **FCP** : ~100-200 ms plus rapide (logos légers)
- **Score Lighthouse** : +15-20 points estimés

---

## 🚀 POUR APPLIQUER LES GAINS

### Option 1 : Build & Deploy (RECOMMANDÉ)
```bash
npm run build
firebase deploy --only hosting
```

**Pourquoi** : Le serveur dev peut cacher les anciennes URLs. Un build frais garantit les nouvelles URLs WebP.

### Option 2 : Hard Refresh
```bash
# Sur le site en prod
Cmd + Shift + R (Mac) ou Ctrl + Shift + F5 (Windows)
```

**Pourquoi** : Force le navigateur à ignorer le cache et recharger toutes les ressources.

### Option 3 : Vider le cache CDN Firebase
```bash
# Dans la console Firebase Hosting
1. Aller sur https://console.firebase.google.com
2. Hosting > lieuxdexception.com
3. "Release history" > "Invalidate cache"
```

---

## 🔍 VÉRIFICATION

### 1. Vérifier que les WebP se chargent
```bash
# Devrait retourner HTTP/2 200 avec content-type: image/webp
curl -I "https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/logos%2Fvenues%2Fdome-blanc.webp?alt=media&v=20251220"
```

### 2. Tester le site
```bash
# Sur localhost:3001 après redémarrage
open http://localhost:3001
# Inspecter > Network > Filtrer "webp" > Recharger
```

### 3. Re-run Lighthouse
```bash
# Chrome DevTools > Lighthouse > Generate report
# Vérifier que les images WebP apparaissent
```

---

## 📝 FICHIERS MODIFIÉS

```
src/
  ├── lib/storage-assets.ts          ← URLs WebP + v=20251220
  ├── app/[locale]/page.tsx          ← Preload hero images
  ├── components/PreloadHeroImages.tsx  ← Nouveau composant
  └── app/api/admin/
      ├── update-webp-urls/route.ts  ← API mise à jour (0 updates = déjà OK)
      └── check-images-urls/route.ts ← API vérification

scripts/
  ├── optimize-lighthouse-images.js      ← Script optimisation (déjà run)
  ├── analyze-lighthouse-lcp.js         ← Analyse LCP
  └── manual-firestore-update-guide.js  ← Guide (pas besoin, déjà OK)

docs/
  └── OPTIMISATION-LIGHTHOUSE-20251220.md ← Documentation complète
```

---

## ✅ PROCHAINE ÉTAPE

**Faire un build production propre** :

```bash
# 1. Arrêter le serveur dev
# 2. Build
npm run build

# 3. Vérifier le build
npm run start

# 4. Tester localhost:3001 (build prod)
# 5. Si OK, déployer
firebase deploy --only hosting
```

Une fois déployé, les 3.3 MB d'économies seront effectifs ! 🎉
