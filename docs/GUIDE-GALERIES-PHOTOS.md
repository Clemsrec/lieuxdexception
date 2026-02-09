# Gestion des Galeries Photos des Lieux - Guide Utilisateur

## Vue d'ensemble

Le système de gestion des galeries permet aux administrateurs d'ajouter, organiser et supprimer facilement les photos des lieux directement depuis le dashboard, avec upload automatique vers Firebase Storage.

## Accès

**Dashboard Admin** → **Gestion des Lieux** → Sélectionner un lieu → Onglet **Images & Médias**

URL : `/admin/venues/[id]?tab=media`

## Fonctionnalités

### 1. Upload d'Images

**Méthodes d'ajout :**
- **Drag & Drop** : Glissez-déposez des images directement dans la zone d'upload
- **Sélection** : Cliquez sur la zone pour ouvrir le sélecteur de fichiers

**Formats acceptés :**
- PNG, JPG, JPEG, WEBP
- Taille maximale : 10MB par image
- Nombre illimité d'images

**Stockage automatique :**
Les images sont automatiquement uploadées dans Firebase Storage sous :
```
venues/{slug-du-lieu}/gallery/{timestamp}_{nom-fichier}
```

Exemple : `venues/chateau-brulaire/gallery/1738857600000_salle-reception.jpg`

### 2. Réorganiser les Images

**Drag & Drop :**
1. Cliquez et maintenez sur une image
2. Déplacez-la vers sa nouvelle position
3. Relâchez pour valider

**Ordre d'affichage :**
L'ordre dans le dashboard correspond à l'ordre d'affichage sur le site public.

### 3. Supprimer des Images

1. Survolez l'image à supprimer
2. Cliquez sur l'icône **Poubelle** (rouge)
3. Confirmez la suppression

⚠️ **Attention :** La suppression est **immédiate** après confirmation.

### 4. Numérotation

Chaque image affiche son numéro d'ordre dans le coin supérieur gauche pour faciliter l'organisation.

## Architecture Technique

### Structure Firestore

Les galeries sont stockées dans le document du lieu sous deux formats pour compatibilité :

```typescript
{
  // Format principal (utilisé par le site)
  images: {
    hero: "https://...",
    cardImage: "https://...",
    gallery: [
      "https://firebasestorage.googleapis.com/v0/b/.../gallery/image1.jpg",
      "https://firebasestorage.googleapis.com/v0/b/.../gallery/image2.jpg",
      // ...
    ]
  },
  
  // Format legacy (pour compatibilité avec ancien code)
  gallery: [ /* mêmes URLs */ ]
}
```

### Composant

**Fichier** : `src/components/admin/VenueGalleryManager.tsx`

**Props :**
```typescript
interface VenueGalleryManagerProps {
  venueSlug: string;      // Slug du lieu pour le path Storage
  images: string[];       // URLs actuelles de la galerie
  onChange: (images: string[]) => void;  // Callback de mise à jour
}
```

### Affichage Public

Les images de la galerie s'affichent automatiquement sur :
- **Page du lieu** (`/lieux/[slug]`) : Section "Galerie photos"
- **Pages thématiques** : 
  - `/mariages` : Galeries des lieux mariages
  - `/evenements-b2b` : Galeries des lieux B2B

Code d'affichage :
```typescript
const galleryImages = venue.images?.gallery || [];

{galleryImages && galleryImages.length > 0 && (
  <section id="galerie">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {galleryImages.map((imageUrl, index) => (
        <Image src={imageUrl} alt={`Photo ${index + 1}`} ... />
      ))}
    </div>
  </section>
)}
```

## Workflow Complet

### Ajouter une Galerie à un Nouveau Lieu

1. **Créer le lieu** dans `/admin/venues/new`
2. Remplir les **informations générales** (nom, slug obligatoires)
3. Aller à l'onglet **Images & Médias**
4. Ajouter **Image Hero** et **Image Carte** (URLs obligatoires)
5. **Uploader les images de la galerie** via drag & drop
6. **Réorganiser** si nécessaire
7. **Sauvegarder** le lieu

### Mettre à Jour une Galerie Existante

1. Aller dans **Gestion des Lieux**
2. Cliquer sur **Modifier** pour le lieu concerné
3. Aller à l'onglet **Images & Médias**
4. **Ajouter** de nouvelles images via upload
5. **Supprimer** les images obsolètes
6. **Réorganiser** l'ordre d'affichage
7. **Sauvegarder** les modifications

## Bonnes Pratiques

### Nommage des Fichiers
```
✅ Bon : salle-reception.jpg, exterieur-parc.jpg, chambre-suite.jpg
❌ Mauvais : IMG_1234.jpg, DSC_0001.jpg, photo.jpg
```

### Optimisation
- Privilégier le format **WEBP** (meilleure compression)
- Résolution recommandée : **1920x1280px** (ratio 3:2)
- Poids cible : **< 500KB par image**

### Organisation
1. **Première image** : Vue d'ensemble du lieu
2. **Images suivantes** : Salles principales → Espaces → Détails
3. **Dernières images** : Chambres, services, jardins

### Nombre d'Images
- **Minimum** : 10 images pour une présentation complète
- **Optimal** : 20-40 images
- **Maximum pratique** : 50 images (au-delà, temps de chargement)

## Dépannage

### Les images ne s'affichent pas sur le site
1. Vérifier que les URLs sont bien dans `images.gallery` (pas juste `gallery`)
2. Vider le cache du navigateur (Cmd+Shift+R)
3. Vérifier les **règles Storage** (doivent autoriser la lecture publique)

### Upload échoue
1. Vérifier la **taille du fichier** (< 10MB)
2. Vérifier le **format** (PNG, JPG, JPEG, WEBP)
3. Vérifier les **permissions admin** de l'utilisateur
4. Consulter la console DevTools pour les erreurs

### Images dans le désordre
- Utiliser le **drag & drop** pour réorganiser
- Les modifications sont **instantanées** dans le formulaire
- **Sauvegarder** pour appliquer les changements

## Support Technique

### Logs
- Console navigateur (F12) pour erreurs upload
- Firebase Console > Storage pour vérifier les fichiers
- Firestore Console pour vérifier les URLs enregistrées

### Scripts Utiles
```bash
# Vérifier les galeries dans Firestore
node scripts/check-galleries.js

# Lister les fichiers Storage d'un lieu
firebase storage:list venues/chateau-brulaire/gallery

# Nettoyer les images orphelines (non référencées)
# TODO: Créer script cleanup-orphaned-images.js
```

## Évolutions Futures

- [ ] Édition de métadonnées (alt text, title) par image
- [ ] Prévisualisation en grand format (lightbox)
- [ ] Bulk upload avec sélection multiple
- [ ] Détection automatique de doublons
- [ ] Génération automatique de thumbnails
- [ ] Import depuis URL externe
- [ ] Export de la galerie en ZIP

---

**Dernière mise à jour :** 9 février 2026  
**Version :** 2.0  
**Auteur :** Système de gestion de contenus dynamiques
