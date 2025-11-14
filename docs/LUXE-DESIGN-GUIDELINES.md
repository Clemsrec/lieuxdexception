# Guidelines Design Luxe - Lieux d'Exception

## Philosophie Design Luxe

Le luxe ne crie pas, il murmure. Notre design doit refléter l'élégance discrète et le raffinement absolu de nos lieux d'exception.

## Règles d'Or ✨

### 1. **Pas d'Icônes, Jamais**
- ❌ Pas d'icônes Lucide, Font Awesome, ou autres
- ✅ Typographie élégante et espacée
- ✅ Numérotation dorée (01, 02, 03...)
- ✅ Lignes décoratives subtiles
- ✅ Lettrines et ornements typographiques

**Pourquoi ?** Les icônes sont trop "corporate" et générique. Le vrai luxe passe par :
- La typographie exceptionnelle
- L'espace blanc généreux
- Les détails photographiques

### 2. **Espaces Généreux**
```css
/* Sections : 8rem (128px) entre chaque */
.section {
  padding-top: 8rem;
  padding-bottom: 8rem;
}

/* Marges internes : minimum 4rem (64px) */
/* Espacement entre éléments : minimum 2rem (32px) */
```

**Principe** : Plus d'espace = Plus de luxe

### 3. **Typographie Premium**

#### Hiérarchie
```
Hero Title:     72px (4.5rem) - Playfair Display
Section Title:  48px (3rem)   - Playfair Display  
Heading 3:      30px (1.875rem) - Montserrat
Body Large:     20px (1.25rem) - Inter
Body Regular:   16px (1rem)   - Inter
Body Small:     14px (0.875rem) - Inter
```

#### Letter-spacing
```css
h1, h2: letter-spacing: 0.02em;  /* Plus aéré */
h3, h4: letter-spacing: 0.01em;
body:   letter-spacing: 0.01em;
```

### 4. **Photographie d'Excellence**

#### Tailles d'Images
- **Hero**: Minimum 90vh, images haute résolution (min 2000px largeur)
- **Cards**: 400px hauteur minimum
- **Full-width sections**: Toujours en pleine largeur

#### Overlays pour Lisibilité MAXIMALE ⚠️
**CRITIQUE** : Le texte doit TOUJOURS être parfaitement lisible sur les photos.

```css
/* Hero sections - Overlay renforcé */
.hero-section::before {
  background: linear-gradient(
    180deg, 
    rgba(27, 54, 93, 0.5) 0%,   /* 50% en haut */
    rgba(27, 54, 93, 0.75) 100% /* 75% en bas */
  );
}

/* Sections CTA avec photo - Overlay très sombre */
.image-bg-section::after {
  background: linear-gradient(
    180deg, 
    rgba(27, 54, 93, 0.7) 0%,   /* 70% en haut */
    rgba(27, 54, 93, 0.85) 100% /* 85% en bas */
  );
}
```

**TOUJOURS ajouter text-shadow sur texte blanc** :
```css
.hero-content h1,
.hero-content p {
  text-shadow: 
    0 2px 20px rgba(0, 0, 0, 0.4),  /* Ombre proche */
    0 4px 40px rgba(0, 0, 0, 0.3);  /* Ombre diffuse */
}
```

#### Test de Lisibilité
✅ **Test obligatoire** : 
1. Texte lisible sur photo la plus CLAIRE
2. Texte lisible sur photo la plus SOMBRE
3. Texte lisible à 50% de luminosité écran
4. Contraste minimum 4.5:1 (WCAG AA)

#### Zoom au Hover
```css
/* Zoom lent et élégant */
transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
transform: scale(1.08); /* Pas plus de 1.1 */
```

### 5. **Palette de Couleurs Raffinée**

#### Couleurs Principales
- **Bleu Marine**: `#1B365D` (confiance, élégance)
- **Or Champagne**: `#C9A961` (luxe, prestige)
- **Beige Pierre**: `#E8DCC4` (douceur, naturel)

#### Utilisation
```css
/* 70% Neutre (blanc, beige) */
/* 20% Bleu Marine */
/* 10% Or Champagne (accents seulement) */
```

### 6. **Animations Subtiles**

#### Durées
```css
/* Transitions rapides : 0.3s */
/* Transitions standard : 0.5s */
/* Transitions lentes : 0.8s */
/* Hover images : 0.8s minimum */
```

#### Easing
```css
/* Toujours cubic-bezier(0.4, 0, 0.2, 1) */
/* Jamais ease-in-out basique */
```

### 7. **Détails Ornementaux**

#### Lignes Décoratives
```tsx
// Ligne dorée élégante
<div className="w-24 h-px bg-accent mx-auto my-8" />

// Double ligne
<div className="flex gap-2 justify-center my-8">
  <div className="w-12 h-px bg-accent" />
  <div className="w-12 h-px bg-accent" />
</div>
```

#### Numérotation Élégante
```tsx
<div className="font-display text-6xl text-accent/20 font-light">
  01
</div>
```

### 8. **Grilles et Compositions**

#### Asymétrie Élégante
```tsx
// ❌ Grilles uniformes 3x3
<div className="grid grid-cols-3 gap-8">

// ✅ Compositions asymétriques
<div className="grid grid-cols-12 gap-8">
  <div className="col-span-7">Large</div>
  <div className="col-span-5">Petit</div>
</div>
```

#### Espacement
```css
gap-8  /* 32px - minimum */
gap-12 /* 48px - standard */
gap-16 /* 64px - sections importantes */
```

## Exemples Concrets

### ❌ Design "Corporate" à Éviter

```tsx
// Trop d'icônes
<div className="flex items-center gap-2">
  <Icon type="phone" size={20} />
  <span>Téléphone</span>
</div>

// Espacements serrés
<section className="py-8">
  <h2 className="mb-4">Titre</h2>
</section>

// Cards uniformes et basiques
<div className="grid grid-cols-3 gap-4">
  <div className="p-4">...</div>
</div>
```

### ✅ Design Luxe à Privilégier

```tsx
// Typographie pure
<div className="text-center">
  <div className="text-sm uppercase tracking-wider text-accent mb-2">
    Contact
  </div>
  <div className="text-xl">06 02 03 70 11</div>
</div>

// Espacements généreux
<section className="py-24">
  <h2 className="mb-12">Titre</h2>
  <div className="h-px w-24 bg-accent mx-auto my-12" />
</section>

// Compositions sophistiquées
<div className="grid grid-cols-12 gap-16">
  <div className="col-span-8 p-16">
    <div className="font-display text-8xl text-accent/10 mb-8">01</div>
    <h3>Excellence</h3>
  </div>
</div>
```

## Checklist Design Luxe

### Avant Publication
- [ ] Aucune icône visible (sauf logo)
- [ ] Sections espacées de 8rem minimum
- [ ] Letter-spacing positif sur tous les titres
- [ ] Images haute résolution (> 1500px)
- [ ] Animations lentes (> 0.5s)
- [ ] Palette respectée (70/20/10)
- [ ] Hover effects subtils
- [ ] Overlays légers (< 60% opacité)
- [ ] Typographie hiérarchisée
- [ ] Espace blanc généreux

### Performance Luxe
- [ ] Images optimisées mais haute qualité
- [ ] Animations fluides (60fps)
- [ ] Pas de lags au scroll
- [ ] Chargement progressif élégant

## Inspiration Références

### Sites Luxe à Étudier
- Hôtels de Palace (Four Seasons, Ritz Paris)
- Maisons de Haute Couture (Dior, Hermès)
- Domaines viticoles premium (Château Margaux)
- Architecture de luxe (Zaha Hadid Architects)

### Principes Observés
1. **Espace blanc dominant** (60-70% de la page)
2. **Typographie comme héroïne** (pas d'icônes)
3. **Photographie d'art** (jamais stock photos)
4. **Animations imperceptibles** (jamais flashy)
5. **Couleurs sobres** (maximum 3 couleurs)

## Anti-Patterns Luxe

### Ce qui Détruit le Luxe ❌
- Icônes colorées partout
- Grilles uniformes et prévisibles
- Animations rapides et saccadées
- Couleurs vives et saturées
- Espacements serrés
- Trop de contenu sur une page
- CTAs agressifs ("ACHETER MAINTENANT !!!")
- Stock photos génériques

### Ce qui Crée le Luxe ✅
- Typographie comme design principal
- Compositions asymétriques sophistiquées
- Animations fluides et lentes
- Palette sobre et élégante
- Espaces généreux et respirants
- Contenu épuré et ciblé
- CTAs discrets ("Découvrir", "En savoir plus")
- Photographie d'auteur exclusive

---

**Principe Ultime** : Le luxe, c'est avoir assez confiance en son produit pour ne rien forcer. Le design doit être une invitation élégante, jamais une vente agressive.

**Signature** : "Où moins devient plus, et le silence parle plus fort que les mots."
