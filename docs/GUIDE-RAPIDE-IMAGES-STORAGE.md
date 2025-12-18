# Guide Rapide : Gestion des Images Storage

## 🚀 Utilisation Rapide

### 1. Sélectionner une image dans la gestion des contenus

**Page** : `/admin/contenus`

1. Sélectionnez la page à modifier (Homepage, Mariages, B2B, Contact)
2. Dans la section Hero, trouvez le champ "Image de fond Hero"
3. Cliquez sur **"Parcourir Storage"**
4. Naviguez dans les dossiers avec les breadcrumbs ou en cliquant sur les dossiers
5. Recherchez une image par nom si besoin
6. Cliquez sur l'image souhaitée → Elle se surligne en bleu
7. Cliquez sur **"Sélectionner"**
8. L'URL est automatiquement remplie et l'image s'affiche en prévisualisation
9. Sauvegardez les modifications

**Astuce** : Vous pouvez aussi saisir manuellement l'URL dans le champ si vous la connaissez.

---

### 2. Optimiser les images

**Page** : `/admin/galerie`

#### Vue d'ensemble

Le panneau d'optimisation s'affiche automatiquement en haut de la galerie avec :

- **Total** : Nombre total d'images
- **✓ Optimisées** : Images déjà en WebP < 500KB
- **⚠ À optimiser** : Images nécessitant une optimisation
- **💾 Économies** : Espace potentiel à récupérer

#### Optimiser toutes les images

1. Cliquez sur **"Optimiser tout (X)"** en haut à droite du panneau
2. Confirmez l'action
3. Les images sont optimisées une par une (affichage de la progression)
4. Une fois terminé, la page se rafraîchit automatiquement

#### Optimiser une image spécifique

1. Cliquez sur **"Afficher les images à optimiser"**
2. La liste détaillée s'affiche avec :
   - Miniature de l'image
   - Nom et taille actuelle
   - Recommandations (ex: "Convertir en WebP pour réduire de 30%")
   - Économies potentielles
3. Cliquez sur **"Optimiser"** sur l'image de votre choix
4. L'optimisation démarre (loader visible)
5. Une fois terminée, un ✓ vert s'affiche avec l'économie réalisée

---

## 🎯 Cas d'Usage

### Ajouter une nouvelle image de fond pour la homepage

```
1. Uploadez votre image dans Storage (/admin/galerie → Upload)
2. Allez dans /admin/contenus
3. Sélectionnez "Homepage"
4. Section Hero → Cliquez "Parcourir Storage"
5. Trouvez votre image → Sélectionner
6. Sauvegardez
```

### Convertir toutes les images d'un château en WebP

```
1. Allez dans /admin/galerie
2. Naviguez vers le dossier du château (ex: venues/chateau-le-dome)
3. Le panneau affiche les images non optimisées
4. Cliquez "Optimiser tout"
5. Patientez quelques secondes
6. ✓ Toutes les images sont maintenant en WebP
```

### Vérifier le poids d'une image avant de l'utiliser

```
1. /admin/galerie
2. Parcourez les dossiers
3. Passez la souris sur une image → Info affichée
OU
4. Regardez le panneau d'optimisation → Liste détaillée
```

---

## ✅ Bonnes Pratiques

### Nommage des fichiers

- **Utiliser des noms descriptifs** : `chateau-le-dome-hero.jpg` plutôt que `IMG_1234.jpg`
- **Pas d'espaces** : Utiliser `-` ou `_`
- **Minuscules** : Préférer `hero.jpg` à `HERO.jpg`

### Organisation des dossiers

```
/images
  /venues
    /chateau-le-dome
      hero.webp
      gallery-1.webp
      gallery-2.webp
    /chateau-de-la-corbe
      hero.webp
      ...
  /pages
    /homepage
      hero.webp
      section-1.webp
    /mariages
      hero.webp
```

### Formats recommandés

| Type d'image | Format | Qualité | Taille max |
|--------------|--------|---------|------------|
| Photos (hero, galerie) | **WebP** | 80% | 500 KB |
| Logos | **SVG** ou WebP | 80-100% | 50 KB |
| Icônes | **SVG** | - | 10 KB |
| Graphiques | **SVG** ou PNG | - | 100 KB |

### Dimensions recommandées

| Usage | Dimensions | Ratio |
|-------|-----------|-------|
| Hero desktop | 1920 x 1080 | 16:9 |
| Hero mobile | 768 x 1024 | 3:4 |
| Galerie (carte) | 800 x 600 | 4:3 |
| Thumbnail | 400 x 400 | 1:1 |
| Logo | 200 x 200 | 1:1 |

---

## 🔍 Comprendre les Recommandations

### "Convertir en WebP pour réduire de 25-35%"

**Signification** : Votre image est en JPEG ou PNG. En la convertissant en WebP, vous économiserez 25 à 35% d'espace sans perte visible de qualité.

**Action** : Cliquez sur "Optimiser"

---

### "Taille élevée (2.5 MB) : optimiser la compression"

**Signification** : Votre image est trop volumineuse pour le web (> 500 KB). Cela ralentit le chargement des pages.

**Action** : Optimisez pour réduire la taille. L'optimisation va compresser l'image et potentiellement la redimensionner si elle dépasse 1920px.

---

### "Image très volumineuse : vérifier les dimensions"

**Signification** : Votre image fait plus de 2 MB, probablement car elle est en très haute résolution (ex: 4K, 6K).

**Action** : 
1. Optimisez (réduction automatique à 1920px max)
2. OU uploadez une version déjà redimensionnée

---

### "Image déjà optimisée pour le web"

**Signification** : Votre image est en WebP et < 500 KB. Rien à faire !

**Action** : Aucune 😊

---

## ⚠️ Erreurs Courantes

### "Erreur lors de l'optimisation"

**Causes possibles** :
- Fichier corrompu
- Format non supporté (ex: TIFF)
- Problème de droits Storage

**Solution** :
1. Vérifiez le format du fichier (doit être JPG, PNG, WebP, ou SVG)
2. Réessayez
3. Si persistant, ré-uploadez le fichier

---

### "Image introuvable" (dans ImageInputField)

**Causes** :
- URL incorrecte
- Image supprimée de Storage
- Problème de droits d'accès

**Solution** :
1. Cliquez sur "Parcourir Storage" pour sélectionner une autre image
2. Vérifiez que l'image existe bien dans Storage

---

### "Accès refusé" (dans la galerie)

**Cause** : Vous n'êtes pas connecté avec un compte admin

**Solution** :
1. Vérifiez que vous êtes connecté sur Firebase Auth
2. Le compte doit avoir le custom claim `admin: true`
3. Contactez un administrateur pour obtenir les droits

---

## 📊 Statistiques et Monitoring

### Interpréter le panneau d'optimisation

```
┌─────────────────────────────────────────────┐
│ Total: 156 images • 45 MB                   │
│ ✓ Optimisées: 120 (77%)                     │
│ ⚠ À optimiser: 36 (23%)                     │
│ 💾 Économies: 15 MB                         │
│ Progress: ████████░░ 77%                    │
└─────────────────────────────────────────────┘
```

**Lecture** :
- **77% optimisées** : Très bon score ! 
- **15 MB d'économies** : En optimisant les 36 images restantes, vous économiserez 15 MB
- **Objectif** : Viser 90%+ d'optimisation

---

## 🛠️ Maintenance

### Routine mensuelle recommandée

1. **Aller dans /admin/galerie**
2. **Vérifier le panneau d'optimisation**
3. **Si < 80% optimisé** : Cliquer "Optimiser tout"
4. **Vérifier les dossiers** : Supprimer les images inutilisées

### Avant un déploiement majeur

1. **Optimiser toutes les images** (cible 95%+)
2. **Vérifier les dimensions** (pas d'images > 1920px inutilement)
3. **Nettoyer les doublons** (ex: `image-1.jpg` et `image-1-optimized.webp`)

---

## 💡 Astuces Pro

### Raccourcis clavier (dans le picker)

- **Échap** : Fermer le modal
- **Entrée** : Confirmer la sélection

### Prévisualisation rapide

Dans la galerie, **passez la souris** sur une image pour voir :
- Nom complet
- Taille du fichier

### Sélection multiple (à venir)

Fonctionnalité prévue pour V2.1 : Sélectionner plusieurs images et les optimiser en une fois.

---

## 📞 Besoin d'aide ?

1. **Documentation complète** : Voir `/docs/IMAGE-STORAGE-MANAGEMENT.md`
2. **Logs de débogage** : Console navigateur (F12)
3. **Support technique** : Contacter l'équipe dev

---

**Dernière mise à jour** : 18 décembre 2025
