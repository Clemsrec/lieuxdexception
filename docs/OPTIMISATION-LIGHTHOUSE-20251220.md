# 🚀 Optimisation Lighthouse - 19 Décembre 2025

## ✅ Optimisations Réalisées

### 📊 Résumé Global
- **Économies totales** : 3.23 MB (-75.6%)
- **Images optimisées** : 4
- **Formats** : JPG/PNG → WebP
- **Cache-busting** : v=20251220

---

## 📝 Détails par Image

### 1️⃣ Château de la Brûlaire - Hero ⭐ PRIORITÉ
**Avant** :
- Fichier : `venues/chateau-brulaire/hero.jpg`
- Taille : 3 926 KB (3.8 MB!)
- Dimensions : 5120x3241px (affiché en 1335x889px)
- Format : JPG

**Après** :
- Fichier : `venues/chateau-brulaire/hero.webp`
- Taille : 924 KB
- Dimensions : 2000px max width
- Format : WebP quality 85
- **Économie : 3 002 KB (-76.5%)**

**Impact Lighthouse** :
- LCP amélioré (image hero chargée 3.8x plus vite)
- Économies estimées Lighthouse : 3 732.9 KB

---

### 2️⃣ Domaine Nantais - Cocktail
**Avant** :
- Fichier : `venues/domaine-nantais/mariages/domaine_cocktail_1.jpg`
- Taille : 187 KB
- Format : JPG

**Après** :
- Fichier : `venues/domaine-nantais/mariages/domaine_cocktail_1.webp`
- Taille : 120 KB
- Format : WebP quality 85
- **Économie : 67 KB (-36.1%)**

**Impact Lighthouse** :
- Économies estimées : 199.5 KB

---

### 3️⃣ Logos Venues - Dôme & Domaine

#### Logo Dôme Blanc
**Avant** :
- Fichier : `logos/venues/dome-blanc.png`
- Taille : 133 KB
- Dimensions : 2469x1479px (affiché en 96x96px!)

**Après** :
- Fichier : `logos/venues/dome-blanc.webp`
- Taille : 10 KB
- Dimensions : 200px max width
- **Économie : 123 KB (-92.7%)**

#### Logo Domaine Blanc
**Avant** :
- Fichier : `logos/venues/domaine-blanc.png`
- Taille : 122 KB
- Dimensions : 2469x1479px (affiché en 96x96px!)

**Après** :
- Fichier : `logos/venues/domaine-blanc.webp`
- Taille : 11 KB
- Dimensions : 200px max width
- **Économie : 111 KB (-91.4%)**

**Impact Lighthouse** :
- Économies estimées : 255 KB (132.7 + 122.1)

---

## 🔧 Modifications Code

### Fichiers Modifiés
1. ✅ `src/lib/storage-assets.ts`
   - Logos Dôme/Domaine : `.png` → `.webp`
   - Cache-busting : `v=20251219` → `v=20251220`

### Fichiers Uploadés Firebase Storage
1. ✅ `venues/chateau-brulaire/hero.webp`
2. ✅ `venues/domaine-nantais/mariages/domaine_cocktail_1.webp`
3. ✅ `logos/venues/dome-blanc.webp`
4. ✅ `logos/venues/domaine-blanc.webp`

---

## ⚠️ Images Non Trouvées

### Dôme Mariages
**Problème** : 
```
❌ No such object: venues/chateau-le-dome/mariages/dome_interieur_1.jpg
```

**Action requise** :
- Vérifier le chemin exact dans Firebase Storage
- Lighthouse signale `244 KB` pour cette image
- Économies potentielles : 95.8 KB

**Commande de recherche** :
```bash
# Lister tous les fichiers dome_interieur*
gsutil ls -r gs://lieux-d-exceptions.firebasestorage.app/venues/chateau-le-dome/mariages/
```

---

## 📋 Actions Manuelles Requises

### 1. Mettre à jour Firestore venues
Les images hero/galleries doivent pointer vers les nouvelles URLs WebP :

```javascript
// Château Brûlaire
await db.collection('venues').doc('chateau-brulaire').update({
  heroImage: 'venues/chateau-brulaire/hero.webp'  // .jpg → .webp
});

// Domaine Nantais
await db.collection('venues').doc('domaine-nantais').update({
  'galleries.mariages': [...updated with .webp]
});
```

### 2. Build & Deploy
```bash
npm run build
firebase deploy --only hosting
```

### 3. Vérifications Post-Déploiement
- [ ] Vérifier que hero Brûlaire s'affiche correctement
- [ ] Vérifier que logos Dôme/Domaine s'affichent
- [ ] Hard refresh (Cmd+Shift+R) pour force cache reload
- [ ] Re-run Lighthouse pour confirmer les gains

---

## 🎯 Gains Lighthouse Estimés

### Before
| Image | Taille | Économies |
|-------|--------|-----------|
| Brûlaire hero.jpg | 3 926 KB | 3 732.9 KB |
| dome_interieur_1.jpg | 244 KB | 95.8 KB |
| domaine_cocktail.jpg | 266 KB | 199.5 KB |
| dome-blanc.png | 133 KB | 132.7 KB |
| domaine-blanc.png | 122 KB | 122.1 KB |
| **TOTAL** | **4 691 KB** | **4 283 KB** |

### After (réalisé)
- **Économies réelles** : 3 230 KB
- **% d'économie** : 75.6%
- **Images restantes** : dome_interieur_1.jpg (244 KB)

---

## 🔄 Prochaines Optimisations

### Priorité 1 : Trouver dome_interieur_1.jpg
- Rechercher le fichier dans Firebase Storage
- Convertir en WebP
- **Économies** : ~96 KB

### Priorité 2 : Autres Hero Images
Lighthouse identifie aussi :
- `domaine-nantais/hero.webp` : 201 KB → 148 KB possible (-53 KB)
- `manoir-boulaie/hero.webp` : 176 KB → 124 KB possible (-52 KB)
- `chateau-corbe/hero.jpg` : 213 KB → 169 KB possible (-44 KB)

**Économies additionnelles** : ~150 KB

### Priorité 3 : OpenStreetMap Tiles
- **Problème** : 770 KB de tiles OSM (hors contrôle)
- **Solution** : Implémenter un CDN proxy pour tiles
- **Économies** : ~580 KB

---

## 📈 Impact Performance Estimé

### Métriques Lighthouse
- **LCP** (Largest Contentful Paint) : 
  - Hero Brûlaire : -3 MB = chargement 3-4x plus rapide
  - Impact : LCP devrait passer de ~4s à <2s
  
- **FCP** (First Contentful Paint) :
  - Logos 234 KB → 21 KB (-91%)
  - Impact : FCP ~100-200ms plus rapide

- **TBT** (Total Blocking Time) :
  - Réduction des parsers/décodeurs d'images
  - Impact : ~50-100ms gagné

### Score Lighthouse Estimé
- **Avant** : Performance ~70-80
- **Après** : Performance ~85-95
- **Gain** : +15 points

---

## ✅ Checklist Finale

- [x] Script d'optimisation créé
- [x] Images optimisées et uploadées
- [x] storage-assets.ts mis à jour
- [ ] Firestore venues mis à jour (manuel)
- [ ] Build production
- [ ] Deploy
- [ ] Test visuel sur site
- [ ] Lighthouse re-run
- [ ] Documenter les gains réels
