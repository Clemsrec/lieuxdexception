# Images du Site - Lieux d'Exception

## Images à ajouter

### Page d'accueil
- **hero-home.jpg** (requis) - Image principale de la hero section
  - Dimensions recommandées : 1920x1080px minimum
  - Format : JPG optimisé (< 300KB)
  - Description : Paysage ou façade d'un des lieux d'exception

### Images des lieux
Les images des lieux sont stockées dans Firestore dans la structure :
```typescript
images: {
  hero: string;
  gallery: string[];
}
```

## Optimisation des images

Toutes les images doivent être optimisées avant upload :
- Compression WebP ou JPG moderne
- Dimensions appropriées (pas plus de 2560px de large)
- Taille de fichier < 500KB par image

## Utilisation avec Next.js Image

Next.js optimise automatiquement les images via le composant `<Image>` :
- Lazy loading automatique
- Responsive images
- Format WebP automatique si supporté par le navigateur
