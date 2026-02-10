# Guide de Gestion des Images - Admin

## 📸 Vue d'ensemble

Le système de gestion des images permet aux administrateurs non-développeurs de facilement parcourir, sélectionner et gérer toutes les images stockées dans Firebase Storage, directement depuis l'interface admin.

---

## 🎯 Où utiliser le sélecteur d'images

### 1. **Gestion des Lieux** (`/admin/venues/[id]`)

Dans l'onglet "Images" de chaque lieu :

1. Cliquez sur **"Parcourir Storage"**
2. Naviguez dans les dossiers (ex: `venues/chateau-le-dome`)
3. Sélectionnez une image
4. L'URL est automatiquement remplie
5. Un aperçu s'affiche immédiatement
6. Cliquez sur "Sauvegarder" pour enregistrer

**Images disponibles** :
- **Image Hero** : Grande image en haut de la page du lieu (recommandé : 1920x1080px)
- **Image Carte** : Miniature pour les listes (recommandé : 800x600px)

---

### 2. **Gestion des Contenus de Pages** (`/admin/contenus`)

Pour modifier les images des sections Hero de chaque page publique :

1. Sélectionnez la page (Homepage, Mariages, B2B, etc.)
2. Dans la section Hero, trouvez le champ image
3. Cliquez sur **"Parcourir Storage"**
4. Naviguez et sélectionnez votre image
5. Sauvegardez les modifications

---

## 🗂️ Organisation des Images dans Storage

```
Firebase Storage
├── venues/                    # Images des lieux
│   ├── chateau-le-dome/
│   │   ├── hero.webp         # Image principale
│   │   ├── gallery/          # Galerie photos
│   │   └── mariages/         # Photos mariages
│   ├── chateau-brulaire/
│   └── ...
├── logos/                     # Logos des lieux
│   └── venues/
│       ├── dome-blanc.webp
│       └── ...
└── images/                    # Autres images du site
    ├── hero/
    └── ...
```

---

## 🔍 Fonctionnalités du Sélecteur

### Navigation
- **Breadcrumbs** : Cliquez sur n'importe quel dossier parent pour remonter rapidement
- **Bouton "Remonter"** : Remonte d'un niveau dans l'arborescence
- **Dossiers cliquables** : Double-cliquez pour entrer dans un sous-dossier

### Recherche
- Tapez le nom du fichier dans la barre de recherche
- La recherche est instantanée et insensible à la casse
- Efface automatiquement lors de la navigation

### Sélection
- **Cliquez sur une image** pour la sélectionner (bordure dorée)
- **Aperçu** : Le nom et la taille s'affichent au survol
- **Confirmation** : Cliquez sur "Sélectionner" pour valider

---

## ✅ Bonnes Pratiques

### Format des Images
- **WebP recommandé** : Plus léger, meilleure performance
- **JPEG/PNG acceptés** : Mais plus lourds
- Utilisez `/admin/galerie` pour optimiser les images existantes

### Nommage
- Utilisez des noms descriptifs : `hero-chateau-dome.webp`
- Évitez les espaces, accents : `chateau_le_dome.webp` ✅ / `château le dôme.jpg` ❌
- Numérotez si série : `gallery-01.webp`, `gallery-02.webp`

### Taille des Fichiers
- **Hero** : < 500 KB idéalement
- **Carte/Galerie** : < 200 KB
- **Optimisation** : Utilisez l'outil d'optimisation dans `/admin/galerie`

### Organisation
- **Respectez l'arborescence** : Chaque lieu a son dossier
- **Sous-dossiers par type** : `mariages/`, `gallery/`, `spaces/`
- **Ne supprimez pas** les images encore utilisées sur le site

---

## 🛠️ Résolution de Problèmes

### L'image ne s'affiche pas
1. **Vérifiez l'URL** : Elle doit commencer par `https://firebasestorage.googleapis.com/`
2. **Rechargez** : Parfois le cache doit être vidé (Ctrl+F5)
3. **Format invalide** : Seuls JPEG, PNG, WebP sont supportés

### Le dossier est vide
1. **Vérifiez le chemin** : Regardez le breadcrumb en haut
2. **Pas d'images** : Le dossier peut contenir uniquement des sous-dossiers
3. **Permissions** : Contactez un développeur si erreur persistante

### L'image est floue/pixelisée
1. **Résolution trop basse** : Uploadez une version haute résolution
2. **Compression excessive** : Ré-uploadez avec moins de compression
3. **Mauvais ratio** : Respectez les dimensions recommandées

---

## 📝 Workflow Complet : Ajouter une Nouvelle Image

### Étape 1 : Upload dans Storage
1. Allez dans la console Firebase : [Firebase Console](https://console.firebase.google.com)
2. Projet : `lieux-d-exceptions`
3. Storage → Naviguez vers le bon dossier
4. Cliquez "Upload" et sélectionnez votre image

### Étape 2 : Optimiser (optionnel mais recommandé)
1. Allez dans `/admin/galerie`
2. Naviguez vers le dossier où vous avez uploadé
3. Si l'image n'est pas en WebP ou > 500KB, cliquez "Optimiser"

### Étape 3 : Affecter à un Lieu/Page
1. Allez dans `/admin/venues/[id]` ou `/admin/contenus`
2. Cliquez "Parcourir Storage"
3. Trouvez votre image (elle sera dans le dossier où vous avez uploadé)
4. Sélectionnez et sauvegardez

---

## 🔐 Sécurité

- **Accès Admin uniquement** : Le sélecteur d'images utilise Firebase Admin SDK
- **URLs signées** : Les images sont servies avec des tokens sécurisés (validité 7 jours)
- **Pas de suppression** : Pour éviter les erreurs, la suppression n'est pas disponible dans l'interface
  - Pour supprimer : passez par la console Firebase directement

---

## 💡 Astuces

### Gain de temps
- **Chemin initial** : Le sélecteur s'ouvre directement dans `venues/` pour les lieux
- **Saisie manuelle** : Si vous connaissez l'URL, collez-la directement dans le champ
- **Raccourci breadcrumb** : Cliquez "Racine" pour revenir au début instantanément

### Performance
- **Images optimisées** : Le site charge 2-3x plus vite avec du WebP
- **Lazy loading** : Les images se chargent uniquement quand l'utilisateur scroll
- **CDN Firebase** : Distribution mondiale automatique

---

## 🆘 Support

En cas de problème :
1. **Rechargez la page** (Ctrl+R ou Cmd+R)
2. **Vérifiez la console** : Ouvrez les outils développeur (F12) → onglet Console
3. **Contactez le support technique** avec une capture d'écran de l'erreur

---

**Dernière mise à jour** : 10 février 2026  
**Version système** : 2.0 (API route avec Firebase Admin SDK)
