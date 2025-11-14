# Règles de Design CSS - Lieux d'Exception

## 🚨 Règles Critiques

### 1. Jamais de Débordement
**INTERDIT** : Aucun élément ne doit dépasser sa section, colonne ou conteneur parent.

```tsx
// ❌ MAUVAIS
<div className="w-[200%]">...</div>
<img style={{ width: '150vw' }} />

// ✅ BON
<div className="w-full max-w-full">...</div>
<img className="w-full h-auto object-cover" />
```

### 2. Logos : Taille Fixe et Max-Width
**OBLIGATOIRE** : Tous les logos doivent avoir une taille fixe avec `max-width` pour éviter les débordements.

```tsx
// ✅ Navigation et Footer
<Image
  src="/logo/Logo_CLE_avec Texte.png"
  alt="Lieux d'Exception"
  width={140}
  height={40}
  className="h-8 w-auto max-w-[140px]"
/>
```

### 3. Boutons : Jamais sur 2 Lignes
**OBLIGATOIRE** : Utiliser `whitespace-nowrap` sur tous les boutons CTA.

```tsx
// ❌ MAUVAIS - Le texte peut se couper
<button className="btn-primary">
  Demander un devis personnalisé
</button>

// ✅ BON - Le bouton reste sur une ligne
<button className="btn-primary">
  Demander un devis
</button>

// ✅ BON - Avec icônes, utiliser gap
<button className="btn-primary inline-flex items-center gap-2">
  <Icon type="mail" size={18} />
  Contact
</button>
```

**Classes par défaut des boutons** (définies dans `globals.css`) :
```css
.btn-primary, .btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  line-height: 1.2;
  padding: 0.875rem 2rem;
}
```

### 4. Containers : Respecter la Hiérarchie
**OBLIGATOIRE** : Utiliser les containers globaux définis dans `globals.css`.

```tsx
// Header et Footer (max-width: 1920px)
<nav className="...">
  <div className="header-footer-container">
    {/* Contenu */}
  </div>
</nav>

// Contenu des pages (max-width: 1536px)
<section className="section">
  <div className="section-container">
    {/* Contenu */}
  </div>
</section>
```

### 5. Marges Internes Cohérentes
**OBLIGATOIRE** : Utiliser les variables d'espacement définies.

```tsx
// ✅ Espacements standardisés
<section className="section"> {/* 5rem top/bottom */}
  <div className="section-container"> {/* 2rem padding horizontal */}
    <h2 className="section-title">...</h2> {/* margin-bottom standardisé */}
  </div>
</section>

// Mobile : 3rem top/bottom automatiquement
```

### 6. Flexbox : Toujours avec items-center
**OBLIGATOIRE** : Pour éviter les désalignements verticaux.

```tsx
// ❌ MAUVAIS - Les boutons peuvent se désaligner
<div className="flex flex-col sm:flex-row gap-4 justify-center">
  <button>...</button>
  <button>...</button>
</div>

// ✅ BON - Alignement vertical centré
<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
  <button>...</button>
  <button>...</button>
</div>
```

## 📐 Dimensions Standards

### Logos
- **Header/Footer** : `h-8` (32px) + `max-w-[140px]`
- **Mobile** : Même taille (pas de scaling excessif)

### Boutons
- **Desktop** : `padding: 0.875rem 2rem` (14px/32px)
- **Mobile** : `padding: 0.75rem 1.5rem` (12px/24px)
- **Font size** : `0.875rem` (14px) desktop, `0.8125rem` (13px) mobile
- **Toujours** : `white-space: nowrap`

### Icônes dans Boutons
- **Taille** : `18px` (size={18})
- **Espacement** : `gap-2` (8px)

### Sections
- **Padding vertical desktop** : `5rem` (80px)
- **Padding vertical mobile** : `3rem` (48px)
- **Padding horizontal** : `2rem` (32px) → `3rem` (48px) → `4rem` (64px) selon breakpoints

## 🎨 Classes Utilitaires Personnalisées

### Boutons
```css
.btn-primary          /* Bouton principal (or champagne) */
.btn-secondary        /* Bouton outline (bleu marine) */
```

### Containers
```css
.section-container           /* Contenu pages (1536px) */
.header-footer-container     /* Header/Footer (1920px) */
.section                     /* Section avec padding vertical */
.section-alt                 /* Section avec background alternatif */
```

### Typographie
```css
.section-title        /* Titre de section (5xl, centré) */
.section-subtitle     /* Sous-titre de section */
.hero-title           /* Titre hero (7xl) */
.hero-subtitle        /* Sous-titre hero */
```

### Cartes
```css
.venue-card           /* Carte de lieu avec hover */
```

## ⚠️ Anti-Patterns à Éviter

### ❌ NE JAMAIS FAIRE

```tsx
// 1. Override le padding des boutons
<button className="btn-primary text-lg px-8 py-3">...</button>

// 2. Utiliser w-screen ou w-[>100%]
<div className="w-screen">...</div>

// 3. Logos sans max-width
<Image src="..." className="h-12" />

// 4. Flex sans items-center
<div className="flex gap-4">...</div>

// 5. Texte long dans bouton sans nowrap
<button className="btn-primary">
  Demander un devis personnalisé pour votre événement
</button>

// 6. justify-center sans items-center sur flex-row
<div className="flex flex-row justify-center">...</div>
```

### ✅ TOUJOURS FAIRE

```tsx
// 1. Utiliser les classes par défaut
<button className="btn-primary">...</button>

// 2. Utiliser les containers appropriés
<div className="section-container">...</div>

// 3. Logos avec taille fixe
<Image src="..." className="h-8 w-auto max-w-[140px]" width={140} height={40} />

// 4. Flex avec alignement complet
<div className="flex gap-4 items-center">...</div>

// 5. Texte court et explicite
<button className="btn-primary">Demander un devis</button>

// 6. Flex-row avec items-center
<div className="flex flex-row justify-center items-center">...</div>
```

## 📱 Responsive Design

### Breakpoints Tailwind v4
```css
sm: 640px   /* Tablettes petites */
md: 768px   /* Tablettes */
lg: 1024px  /* Desktop petit */
xl: 1280px  /* Desktop */
2xl: 1536px /* Desktop large */
```

### Pattern Mobile-First
```tsx
// ✅ Mobile par défaut, puis desktop
<div className="flex flex-col sm:flex-row gap-4 items-center">
  <button className="btn-primary">...</button>
</div>

// Padding responsive automatique via containers
<div className="section-container">
  {/* 2rem → 3rem → 4rem selon viewport */}
</div>
```

## 🔍 Checklist Avant Commit

- [ ] Aucun élément ne déborde de son container
- [ ] Tous les logos ont `max-w-[...]`
- [ ] Tous les boutons utilisent `btn-primary` ou `btn-secondary` sans override
- [ ] Tous les flex-row ont `items-center`
- [ ] Tous les boutons ont du texte court (< 3 mots)
- [ ] Les containers utilisent `section-container` ou `header-footer-container`
- [ ] Les sections ont la classe `.section` pour le padding vertical
- [ ] Les images ont `w-full h-auto object-cover`
- [ ] Tester sur mobile (320px) et desktop (1920px)

## 🛠️ Outils de Debug

```tsx
// Ajouter temporairement pour voir les containers
<div className="border-2 border-red-500">...</div>

// Voir les débordements
<div className="overflow-hidden">...</div>

// Vérifier les flex
<div className="flex border border-blue-500">...</div>
```

## 📚 Ressources

- **Tailwind v4 Docs** : Configuration dans `globals.css` avec `@theme`
- **Variables CSS** : Définies dans `:root` de `globals.css`
- **Next.js Image** : Toujours avec `width`, `height`, et `className` pour sizing
- **Copilot Instructions** : `.github/copilot-instructions.md`

---

**Dernière mise à jour** : 13 novembre 2025  
**Mainteneur** : Équipe Dev Lieux d'Exception
