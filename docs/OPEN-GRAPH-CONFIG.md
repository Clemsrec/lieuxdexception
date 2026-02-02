# Configuration Open Graph - Lieux d'Exception

## Résumé des Améliorations

**Date:** 2 février 2026  
**Objectif:** Assurer qu'une image Open Graph appropriée soit associée à chaque page du site pour un partage optimisé sur les réseaux sociaux.

## État Actuel ✅

### 1. Layout Principal (`src/app/[locale]/layout.tsx`)

**Image par défaut définie:**
```typescript
openGraph: {
  images: [{
    url: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/images%2FVue-chateau.jpg?alt=media',
    width: 1200,
    height: 630,
    alt: 'Lieux d\'Exception - Domaines prestigieux en Loire-Atlantique',
  }],
}
```

Cette image s'applique par défaut à **toutes les pages** qui n'ont pas de métadonnées spécifiques.

### 2. Homepage (`src/app/[locale]/page.tsx`)

**Fonction:** `generateHomeMetadata()` dans `lib/smartMetadata.ts`  
**Image:** `STORAGE_IMAGES.vueChateauGeneric` (Firebase Storage)  
**Taille:** 1200x630px (format recommandé)

### 3. Pages Lieux (`src/app/[locale]/lieux/[slug]/page.tsx`)

**Image dynamique:** Utilise l'image hero spécifique du lieu
```typescript
openGraph: {
  images: [{
    url: venue.images?.hero || venue.heroImage || venue.image || STORAGE_IMAGES.vueChateauGeneric,
    width: 1200,
    height: 630,
    alt: displayVenueName(venue.name),
  }],
}
```

**Fallback:** Si aucune image spécifique, utilise l'image par défaut.

### 4. Pages Mariages & B2B

**Fonction:** `generateServiceMetadata()` dans `lib/smartMetadata.ts`  
**Image:** `STORAGE_IMAGES.vueChateauGeneric`  
**Taille:** 1200x630px

### 5. Page Contact

**Image spécifique:** `STORAGE_IMAGES.contactHero`  
**Métadonnées complètes:**
```typescript
openGraph: {
  title: 'Contact - Lieux d\'Exception',
  description: '...',
  images: [{ url: STORAGE_IMAGES.contactHero, width: 1200, height: 630 }],
}
```

### 6. Page Histoire (Timeline)

**Fonction:** `generateServiceMetadata()` dans `lib/smartMetadata.ts`  
**Image:** `STORAGE_IMAGES.vueChateauGeneric`

### 7. Pages Légales (Mentions, Confidentialité, Cookies)

**Configuration:** `robots: { index: false, follow: false }`  
**Open Graph:** Non nécessaire (pages non indexées)

## Architecture

### Fichier Central: `lib/smartMetadata.ts`

```typescript
import { STORAGE_IMAGES } from '@/lib/storage-assets';

export function generateSmartMetadata(params: SmartMetadataParams): Metadata {
  // ...
  const finalImage = customMeta?.image || STORAGE_IMAGES.vueChateauGeneric;
  
  return {
    openGraph: {
      images: [{
        url: finalImage,
        width: 1200,
        height: 630,
        alt: finalTitle,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [finalImage],
    },
  };
}
```

### Stockage Images: `lib/storage-assets.ts`

Toutes les images Open Graph sont stockées sur **Firebase Storage** :
- ✅ Modification sans redéploiement
- ✅ Optimisation automatique
- ✅ CDN intégré
- ✅ Gestion centralisée

```typescript
export const STORAGE_IMAGES = {
  vueChateauGeneric: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/images%2FVue-chateau.jpg?alt=media',
  contactHero: 'https://firebasestorage.googleapis.com/v0/b/lieux-d-exceptions.firebasestorage.app/o/images%2Fcontact-hero.jpg?alt=media',
  // ...
};
```

## Twitter Cards

**Type:** `summary_large_image` (format optimal pour tous les types de contenu)  
**Configuration:** Identique à Open Graph pour cohérence  
**Taille recommandée:** 1200x630px

## Checklist de Validation ✅

- [x] Layout principal a image OG par défaut
- [x] Homepage a image OG spécifique
- [x] Pages lieux utilisent leur image hero
- [x] Pages services (mariages, B2B) ont image OG
- [x] Page contact a image OG spécifique
- [x] Page histoire a image OG
- [x] Pages légales exclues (robots: noindex)
- [x] Toutes les images depuis Firebase Storage
- [x] Twitter Cards configurés
- [x] Taille images: 1200x630px
- [x] Build production réussi (89 pages)

## Test de Partage

Pour tester les métadonnées Open Graph :

1. **Facebook Sharing Debugger:** https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator:** https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/

Entrer les URLs suivantes pour validation :
- Homepage: `https://lieuxdexception.com/fr`
- Lieu exemple: `https://lieuxdexception.com/fr/lieux/chateau-brulaire`
- Mariages: `https://lieuxdexception.com/fr/mariages`
- B2B: `https://lieuxdexception.com/fr/evenements-b2b`
- Contact: `https://lieuxdexception.com/fr/contact`

## Bonnes Pratiques

### Images Open Graph

1. **Taille recommandée:** 1200x630px (ratio 1.91:1)
2. **Taille min:** 600x315px
3. **Taille max:** 8 MB
4. **Format:** JPG ou PNG (WebP supporté par certains réseaux)
5. **Texte:** Éviter texte dans l'image (peut être coupé)

### Métadonnées Complètes

```typescript
openGraph: {
  title: string,           // Max 60 caractères
  description: string,     // Max 155 caractères
  type: 'website',         // Type de contenu
  siteName: string,        // Nom du site
  locale: string,          // Langue (fr_FR, en_US, etc.)
  images: [{
    url: string,           // URL absolue obligatoire
    width: 1200,
    height: 630,
    alt: string,           // Description image
  }],
}
```

## Maintenance Future

### Ajout d'une Nouvelle Page

1. Créer le fichier page dans `src/app/[locale]/[page]/page.tsx`
2. Ajouter métadonnées avec `generateSmartMetadata()` ou manuellement
3. Spécifier une image OG appropriée (via `customMeta.image`)
4. Tester avec les outils de validation

### Modification d'Images

1. Uploader nouvelle image sur Firebase Storage
2. Mettre à jour URL dans `lib/storage-assets.ts`
3. Pas besoin de redéployer l'app (avantage Firebase Storage)
4. Vider le cache des réseaux sociaux avec les debuggers

### Optimisation Images

- Compresser avant upload (TinyPNG, Squoosh)
- Format WebP pour meilleur ratio qualité/poids
- Toujours respecter ratio 1.91:1 (1200x630)
- Tester visuel sur mobile ET desktop

## Résolution de Problèmes

### Image n'apparaît pas lors du partage

1. Vérifier que l'URL est absolue (commence par `https://`)
2. Tester l'URL image directement dans le navigateur
3. Vider le cache avec Facebook Debugger ou Twitter Validator
4. Attendre 24-48h pour propagation complète

### Image coupée ou mal affichée

1. Vérifier ratio 1200x630 (1.91:1)
2. Éviter texte dans zones critiques (bordures)
3. Tester sur plusieurs réseaux sociaux
4. Privilégier composition centrée

## Références

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Facebook Sharing Best Practices](https://developers.facebook.com/docs/sharing/webmasters)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
