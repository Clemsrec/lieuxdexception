# Images de Fond - Bonnes Pratiques Lisibilité

## ⚠️ Règle d'Or : LISIBILITÉ MAXIMALE

**Le texte doit TOUJOURS être parfaitement lisible**, quelle que soit la photo de fond.

---

## 1. Overlays Obligatoires

### ⚠️ RÈGLE CRITIQUE : Texte TOUJOURS Blanc

**Sur fond sombre (hero sections)** :
- ✅ `color: white` ou `text-white`
- ❌ **JAMAIS** `text-primary` (bleu invisible sur overlay sombre)
- ❌ **JAMAIS** `text-secondary` (gris invisible)

Les classes `.hero-title` et `.hero-subtitle` sont **automatiquement blanches**.

### Hero Sections (90vh)

```tsx
<section className="hero-section relative">
  <Image
    src="/images/photo.jpg"
    alt=""
    fill
    className="object-cover"
    priority
    sizes="100vw"
  />
  {/* L'overlay est automatique via .hero-section::before */}
  <div className="hero-content">
    <h1 className="hero-title">Titre</h1>
    <p className="hero-subtitle">Sous-titre</p>
  </div>
</section>
```

**Overlay CSS appliqué automatiquement** :
- **50% → 75%** de dégradé bleu marine
- **Text-shadow** automatique sur tout le contenu

### Sections CTA avec Photo

```tsx
<section className="section relative overflow-hidden">
  <Image
    src="/images/photo.jpg"
    alt=""
    fill
    className="object-cover"
    sizes="100vw"
  />
  <div className="absolute inset-0 bg-primary/80" /> {/* 80% opacité */}
  <div className="section-container relative z-10">
    <p style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)' }}>
      Texte avec ombre
    </p>
  </div>
</section>
```

**Overlay manuel recommandé** :
- **bg-primary/80** (80% opacité) pour texte important
- **bg-primary/70** (70% opacité) minimum acceptable
- **Toujours** ajouter `text-shadow` en plus

---

## 2. Niveaux d'Overlay Recommandés

| Type de Section | Opacité Overlay | Text-Shadow | Raison |
|----------------|-----------------|-------------|---------|
| **Hero principal** | 50% → 75% (dégradé) | ✅ Oui | Lisibilité maximale + impact visuel |
| **CTA avec citation** | 80% fixe | ✅ Oui | Texte doit être 100% lisible |
| **Section services** | 70% → 85% (dégradé) | ✅ Oui | Beaucoup de texte à lire |
| **Gallery hover** | 0% → 60% (au hover) | ❌ Non | Effet visuel uniquement |

---

## 3. Text-Shadow : Formule Magique

```css
text-shadow: 
  0 2px 20px rgba(0, 0, 0, 0.4),  /* Ombre proche pour définition */
  0 4px 40px rgba(0, 0, 0, 0.3);  /* Ombre diffuse pour profondeur */
```

**Pourquoi 2 ombres ?**
- **Première ombre** : Contour net du texte (lisibilité)
- **Deuxième ombre** : Halo diffus (contraste général)

### Utilisation en JSX

```tsx
{/* Inline style pour rapidité */}
<h1 style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)' }}>
  Titre Important
</h1>

{/* Ou classe CSS globale .hero-content (automatique) */}
<div className="hero-content">
  <h1>Titre avec text-shadow auto</h1>
</div>
```

---

## 4. Test de Lisibilité (Checklist)

Avant de valider une section avec image de fond :

### ✅ Test Obligatoires

1. **Test sur photo CLAIRE** (ciel bleu, mur blanc)
   - [ ] Texte parfaitement lisible
   - [ ] Contraste suffisant (min 4.5:1)

2. **Test sur photo SOMBRE** (intérieur sombre, forêt)
   - [ ] Texte toujours visible
   - [ ] Pas de fusion avec le fond

3. **Test luminosité écran réduite (50%)**
   - [ ] Texte encore lisible
   - [ ] Overlay assez foncé

4. **Test mobile (petit écran)**
   - [ ] Texte pas trop petit
   - [ ] Overlay uniforme sur toute largeur

### 🛠️ Outils de Test

```bash
# Test contraste WCAG
# https://webaim.org/resources/contrastchecker/

# Test avec différentes photos
# 1. Photo très claire → overlay doit être + sombre
# 2. Photo très sombre → overlay peut être + léger
# 3. Photo moyenne → overlay standard OK
```

---

## 5. Erreurs Courantes à Éviter

### ❌ Mauvaises Pratiques

```tsx
{/* MAUVAIS : Overlay trop léger */}
<div className="absolute inset-0 bg-primary/30" />
{/* Résultat : Texte illisible sur photo claire */}

{/* MAUVAIS : Pas de text-shadow */}
<p className="text-white">Texte sans ombre</p>
{/* Résultat : Texte fond dans l'image */}

{/* MAUVAIS : Texte bleu sur overlay sombre ⚠️ CRITIQUE */}
<h1 className="text-primary">Titre Invisible</h1>
{/* Résultat : Bleu marine invisible sur overlay bleu sombre */}

{/* MAUVAIS : Opacité uniforme */}
<div className="absolute inset-0 bg-black/50" />
{/* Résultat : Perte d'impact visuel */}
```

### ✅ Bonnes Pratiques

```tsx
{/* BON : Dégradé + text-shadow + BLANC */}
<section className="hero-section relative">
  <Image src="..." fill />
  <div className="hero-content">
    {/* Classes automatiquement blanches avec shadow */}
    <h1 className="hero-title">Parfaitement lisible</h1>
    <p className="hero-subtitle">Sous-titre visible</p>
    
    {/* Texte custom = ajouter text-white explicitement */}
    <p className="text-white/90">Description claire</p>
  </div>
</section>

{/* BON : CTA avec overlay fort + texte blanc */}
<section className="relative">
  <Image src="..." fill />
  <div className="absolute inset-0 bg-primary/80" />
  <div className="relative z-10">
    <p className="text-white" style={{ textShadow: '...' }}>
      Citation importante en BLANC
    </p>
  </div>
</section>
```

---

## 6. Classes CSS Pré-configurées

### `.hero-section`
✅ **Utiliser pour** : Pages principales (accueil, mariages, B2B)
- Overlay dégradé 50%→75% automatique
- Text-shadow sur tout le contenu
- Min-height 90vh

### `.image-bg-section`
✅ **Utiliser pour** : Sections secondaires avec photo
- Overlay dégradé 70%→85% automatique
- Z-index géré automatiquement

### Custom (inline)
✅ **Utiliser pour** : Cas spécifiques
```tsx
<div className="absolute inset-0 bg-primary/80" />
<p style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)' }}>
```

---

## 7. Workflow de Validation

### Avant de commit

```bash
# 1. Tester sur localhost avec vraies photos
npm run dev

# 2. Vérifier chaque section avec image
- Accueil (hero + CTA)
- Mariages (hero)
- Événements B2B (hero)

# 3. Tester responsive
- Desktop (1920px)
- Tablet (768px)
- Mobile (375px)

# 4. Tester luminosité
- 100% (plein soleil)
- 50% (intérieur)
- 25% (nuit)
```

### Checklist finale

- [ ] Tous les textes sur images ont un overlay min 70%
- [ ] Tous les titres ont un text-shadow
- [ ] Test contraste WCAG AA (4.5:1 minimum)
- [ ] Test mobile OK
- [ ] Aucun texte ne "disparaît" sur aucune photo

---

## 8. Exemples Réels du Site

### ✅ Parfait : Hero Accueil

```tsx
<section className="hero-section relative">
  <Image src="/images/Vue-chateau.jpg" fill priority />
  <div className="hero-content">
    {/* Classes automatiquement blanches */}
    <h1 className="hero-title">Lieux d'Exception</h1>
    <div className="accent-line" /> {/* Or lumineux auto */}
    <p className="hero-subtitle">La clé de vos moments uniques</p>
    
    {/* Texte custom = ajouter text-white */}
    <p className="text-white/90 text-lg">
      Des domaines où se mêlent beauté...
    </p>
  </div>
</section>
```
**Pourquoi c'est bien** :
- ✅ `.hero-title` et `.hero-subtitle` = blanc automatique
- ✅ `.accent-line` = or lumineux dans `.hero-content`
- ✅ Texte custom avec `text-white/90`
- ✅ Overlay + text-shadow appliqués automatiquement

### ✅ Parfait : CTA Émotion

```tsx
<section className="section relative overflow-hidden">
  <Image src="/images/table.jpg" fill />
  <div className="absolute inset-0 bg-primary/80" />
  <div className="section-container relative z-10">
    <p style={{ textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)' }}>
      « Citation importante »
    </p>
  </div>
</section>
```
**Pourquoi c'est bien** :
- ✅ Overlay 80% pour citation importante
- ✅ Text-shadow en plus pour sécurité
- ✅ Z-index géré manuellement

---

## Résumé Ultra-Court

**4 Règles d'Or** :

1. **Overlay minimum 70%** (Hero: 50%→75%, CTA: 80%)
2. **Text-shadow TOUJOURS** (2 ombres : proche + diffuse)
3. **Texte BLANC obligatoire** sur overlays sombres (❌ jamais text-primary)
4. **Tester sur 3 photos** (claire, sombre, moyenne)

**En cas de doute** : 
- Overlay PLUS SOMBRE plutôt que trop clair
- Texte TOUJOURS blanc sur fond avec photo
- Le luxe, c'est la lisibilité sans effort
