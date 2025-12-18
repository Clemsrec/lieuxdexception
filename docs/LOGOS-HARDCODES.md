# Logos Hardcodés - Documentation

## 📍 Architecture

Les logos sont **100% hardcodés** directement dans les composants. Aucun helper centralisé, aucune base de données.

## 🗂️ Fichiers Physiques

Tous les logos sont dans `/public/logos/` :

```
/public/logos/
├── brulaire-blanc.png       (97 KB)   - Château de la Brûlaire (fond sombre)
├── brulaire-dore.png        (100 KB)  - Château de la Brûlaire (fond clair)
├── boulaie-blanc.png        (116 KB)  - Manoir de la Boulaie (fond sombre)
├── boulaie-dore.png         (129 KB)  - Manoir de la Boulaie (fond clair)
├── domaine-blanc.png        (122 KB)  - Domaine Nantais (fond sombre)
├── domaine-dore.png         (129 KB)  - Domaine Nantais (fond clair)
├── dome-blanc.png           (133 KB)  - Le Dôme (fond sombre)
├── dome-dore.png            (134 KB)  - Le Dôme (fond clair)
└── logo-lieux-exception-blanc.png (112 KB) - Logo principal
```

## 📦 Composants avec Logos Hardcodés

### 1. HomeClient.tsx
```typescript
const VENUE_LOGOS: Record<string, { blanc: string; dore: string }> = {
  'chateau-brulaire': { blanc: '/logos/brulaire-blanc.png', dore: '/logos/brulaire-dore.png' },
  'manoir-boulaie': { blanc: '/logos/boulaie-blanc.png', dore: '/logos/boulaie-dore.png' },
  'domaine-nantais': { blanc: '/logos/domaine-blanc.png', dore: '/logos/domaine-dore.png' },
  'le-dome': { blanc: '/logos/dome-blanc.png', dore: '/logos/dome-dore.png' },
};
```

### 2. VenueGallerySection.tsx
```typescript
const VENUE_LOGOS: Record<string, { blanc: string; dore: string }> = {
  'chateau-brulaire': { blanc: '/logos/brulaire-blanc.png', dore: '/logos/brulaire-dore.png' },
  'manoir-boulaie': { blanc: '/logos/boulaie-blanc.png', dore: '/logos/boulaie-dore.png' },
  'domaine-nantais': { blanc: '/logos/domaine-blanc.png', dore: '/logos/domaine-dore.png' },
  'le-dome': { blanc: '/logos/dome-blanc.png', dore: '/logos/dome-dore.png' },
};
```

### 3. VenuesMap.tsx
```typescript
const VENUE_LOGOS: Record<string, { blanc: string; dore: string }> = {
  'chateau-brulaire': { blanc: '/logos/brulaire-blanc.png', dore: '/logos/brulaire-dore.png' },
  'manoir-boulaie': { blanc: '/logos/boulaie-blanc.png', dore: '/logos/boulaie-dore.png' },
  'domaine-nantais': { blanc: '/logos/domaine-blanc.png', dore: '/logos/domaine-dore.png' },
  'le-dome': { blanc: '/logos/dome-blanc.png', dore: '/logos/dome-dore.png' },
};
```

### 4. Navigation.tsx
```tsx
<Image
  src="/logos/logo-lieux-exception-blanc.png"
  alt="Lieux d'Exception"
  width={180}
  height={60}
/>
```

## 🎨 Convention de Nommage

- **Blanc** (`-blanc.png`) : Pour fonds sombres (bg-neutral-800, bg-charcoal)
- **Doré** (`-dore.png`) : Pour fonds clairs (bg-white, bg-stone-50)

## 🏰 Lieux sans Logo

- **Château de la Corbe** : Pas de logo disponible (affiché uniquement avec texte)

## ✅ Avantages du Hardcodage

1. **Aucune dépendance base de données** - Pas de requête Firestore
2. **Versionnés Git** - Aucun risque de perte
3. **Performance optimale** - Pas de fetch dynamique
4. **Cache navigateur** - Fichiers statiques optimisés
5. **Simplicité** - Pas d'abstraction inutile

## 🔧 Ajouter un Nouveau Logo

1. **Créer les fichiers** :
   ```bash
   # Ajouter dans /public/logos/
   - [lieu]-blanc.png  # Pour fonds sombres
   - [lieu]-dore.png   # Pour fonds clairs
   ```

2. **Mettre à jour les composants** :
   ```typescript
   // Dans HomeClient.tsx, VenueGallerySection.tsx, VenuesMap.tsx
   const VENUE_LOGOS = {
     // ... existants
     'nouveau-lieu': { 
       blanc: '/logos/nouveau-lieu-blanc.png', 
       dore: '/logos/nouveau-lieu-dore.png' 
     },
   };
   ```

## 📊 Scripts de Vérification

```bash
# Vérifier que tous les logos existent
node scripts/verify-logos.js

# Rapport complet
node scripts/report-logos.js
```

## 🚫 Ce qui N'existe PLUS

- ~~`src/lib/logoHelper.ts`~~ (supprimé - inutile)
- ~~Fonction `getVenueLogo()`~~ (supprimée)
- ~~Helper centralisé~~ (supprimé)

Tous les logos sont maintenant **directement dans chaque composant** qui en a besoin.
