# Palette de Couleurs Harmonisée - Lieux d'Exception

## 🎨 Philosophie du Design

Inspiré par la brochure PDF et les sites luxe comme domaineevenement.fr, ce système de couleurs privilégie :

- **Fond uniforme** : Beige pierre très clair (`#FAF8F5`) partout pour une cohérence visuelle
- **Nuances subtiles** : Variations délicates sur les cards, titres et sections
- **Contraste élégant** : Gris anthracite pour les textes, or champagne pour les accents
- **Profondeur progressive** : Ombres douces avec nuances bleu marine et or

---

## 🌟 Palette Principale

### 1. Bleu Marine (Primary) - `#1B365D`
**Usage** : Titres alternatifs, boutons secondaires, éléments de marque

```css
--color-primary: #1B365D
--color-primary-500: #1B365D     /* Principal */
--color-primary-400: #537AA8     /* Hover états */
--color-primary-600: #152B4A     /* Textes foncés */
--color-primary-700: #0F1F35     /* Overlays */
```

**Où l'utiliser :**
- Titres avec `.section-title-accent`
- Boutons outline (`.btn-secondary`)
- Logo et éléments de navigation
- Overlays sur images

---

### 2. Or Champagne (Accent) - `#C9A961`
**Usage** : Accents premium, boutons CTA, lignes décoratives

```css
--color-accent: #C9A961
--color-accent-500: #C9A961      /* Principal */
--color-accent-600: #B89445      /* Hover, titres italiques */
--color-accent-400: #D4BC86      /* Bordures subtiles */
--color-accent-200: #EBDFC7      /* Bordures très légères */
```

**Où l'utiliser :**
- Boutons CTA (`.btn-primary`)
- Mots en italique dans titres (`<em>`)
- Icônes (MapPin, Users, Bed)
- Badges (PRIVÉ/PRO)
- Lignes décoratives (`.accent-line`)

---

### 3. Gris Anthracite (Charcoal) - `#2A2A2A` ⭐ NOUVEAU
**Usage** : Textes principaux, titres sombres, contraste élégant

```css
--color-charcoal-700: #1F1F1F    /* Textes titres */
--color-charcoal-600: #2A2A2A    /* Textes longs */
--color-charcoal-500: #4A4A4A    /* Textes secondaires */
--color-charcoal-400: #757575    /* Textes muted */
```

**Où l'utiliser :**
- Titres principaux (`.section-title`)
- Corps de texte longs
- Navigation
- Labels et micro-copie

---

### 4. Beige Pierre (Stone) - Fonds et Surfaces
**Usage** : Fond principal, sections alternées, bordures

```css
/* Fonds principaux */
--background: #FAF8F5            /* Fond global du site */
--background-alt: #F3EFE6        /* Sections alternées */
--surface: #FFFFFF               /* Cards blanches */
--surface-muted: #FDFCFA         /* Cards beige très clair */

/* Bordures */
--border-light: #F3EFE6          /* Bordures subtiles */
--border: #ECE6D7                /* Bordures standard */
--border-accent: #EBDFC7         /* Bordures or clair */
```

**Où l'utiliser :**
- `body` : fond `#FAF8F5`
- `.section-alt` : fond `#F3EFE6`
- `.venue-card` : fond blanc avec bordure beige
- Séparateurs et dividers

---

## 🎯 Application par Composant

### Cards Venues (Carrousel)

```tsx
<div className="venue-card">  {/* bg-white, border beige clair */}
  <Image />  {/* h-64 */}
  <div className="p-6">
    <div className="text-lg text-secondary">Domaine</div>  {/* Gris charcoal */}
    <h3 className="text-primary italic">Nom</h3>  {/* Bleu marine */}
    <MapPin className="text-accent" />  {/* Or champagne */}
    <div className="text-accent">PRIVÉ</div>  {/* Or champagne */}
  </div>
</div>
```

**Couleurs utilisées :**
- Fond : `--surface` (blanc)
- Bordure : `--border-light` (beige clair)
- Ombre : Mélange bleu marine + or
- Titre "Domaine" : `--foreground-muted` (gris moyen)
- Nom château : `--primary` (bleu marine)
- Icônes : `--accent` (or champagne)
- Badges : `--accent` (or champagne)

---

### Sections

```tsx
{/* Fond global beige pierre */}
<body className="bg-stone-100">
  
  {/* Section standard (fond transparent = beige hérité) */}
  <section className="section">
    <h2 className="section-title">  {/* Charcoal #1F1F1F */}
      Titre avec <em>accent</em>  {/* Or #B89445 */}
    </h2>
  </section>
  
  {/* Section alternée (beige plus foncé) */}
  <section className="section section-alt">  {/* bg-[#F3EFE6] */}
    <h2 className="section-title-accent">  {/* Bleu marine */}
      Nos <em>Domaines</em>  {/* Or #B89445 */}
    </h2>
  </section>
  
</body>
```

**Hiérarchie des fonds :**
1. Body : `#FAF8F5` (beige pierre très clair)
2. Section standard : Transparent (hérite du body)
3. Section `.section-alt` : `#F3EFE6` (beige pierre clair)
4. Cards : `#FFFFFF` (blanc pur)

---

### Titres

**Titre principal (gris charcoal) :**
```tsx
<h2 className="section-title">
  5 <em>Domaines d'Exception</em>
</h2>
```
- Texte : `--color-charcoal-700` (`#1F1F1F`)
- `<em>` : `--color-accent-600` (`#B89445`)

**Titre avec accent bleu :**
```tsx
<h2 className="section-title-accent">
  Nos <em>Domaines</em> en Pays de la Loire
</h2>
```
- Texte : `--primary` (`#1B365D`)
- `<em>` : `--color-accent-600` (`#B89445`)

---

### Boutons

**CTA principal (or champagne) :**
```tsx
<button className="btn-primary">Nous contacter</button>
```
- Fond : Gradient `#C9A961` → `#B89445`
- Texte : Blanc
- Ombre : Or avec transparence

**Bouton secondaire (outline bleu) :**
```tsx
<button className="btn-secondary">En savoir plus</button>
```
- Bordure : `#1B365D` (bleu marine)
- Texte : `#1B365D`
- Hover : Fond bleu, texte blanc

---

## ✨ Ombres et Profondeur

### Ombres sur Cards

```css
/* État normal */
box-shadow: 
  0 2px 8px rgba(27, 54, 93, 0.04),   /* Bleu marine très léger */
  0 1px 3px rgba(0, 0, 0, 0.02);      /* Noir subtil */

/* Hover */
box-shadow:
  0 12px 32px rgba(27, 54, 93, 0.12), /* Bleu marine moyen */
  0 4px 12px rgba(201, 169, 97, 0.08); /* Or champagne */
```

**Effet :** Profondeur progressive avec mélange bleu + or = luxe

---

## 🎨 Palette Neutre Complète

```css
/* Blancs et beiges */
--color-stone-50: #FDFCFA     /* Presque blanc */
--color-stone-100: #FAF8F5    /* Fond global */
--color-stone-200: #F3EFE6    /* Section alt */
--color-stone-300: #ECE6D7    /* Bordures */
--color-stone-400: #E8DCC4    /* Beige pierre */

/* Gris chauds */
--color-neutral-50: #FAFAF9
--color-neutral-100: #F5F5F4
--color-neutral-200: #E7E5E4
--color-neutral-400: #A8A29E  /* Textes légers */
--color-neutral-600: #57534E  /* Textes standards */

/* Gris anthracites */
--color-charcoal-400: #757575 /* Muted */
--color-charcoal-500: #4A4A4A /* Secondaire */
--color-charcoal-600: #2A2A2A /* Principal */
--color-charcoal-700: #1F1F1F /* Titres */
```

---

## 📋 Checklist d'Utilisation

### ✅ À FAIRE
- Utiliser `#FAF8F5` comme fond global (body)
- Alterner `.section` (transparent) et `.section-alt` (`#F3EFE6`)
- Cards toujours blanches (`#FFFFFF`) avec bordure beige
- Titres en charcoal (`#1F1F1F`) ou bleu (`#1B365D`)
- Accents en or (`#C9A961`) pour icônes, badges, `<em>`
- Ombres avec mélange bleu + or

### ❌ À ÉVITER
- Fond blanc pur partout (perd la nuance luxe)
- Textes noirs purs (`#000000`) → Préférer charcoal (`#1F1F1F`)
- Trop de couleurs différentes dans une même card
- Bordures trop contrastées → Toujours beige/stone
- Ombres noires pures → Mélanger bleu marine + or

---

## 🎯 Exemples de Nuances

### Carte Interactive (Carrousel)
```
Fond global : #FAF8F5 (beige pierre)
  ↓
Section : transparent (beige hérité)
  ↓
Card : #FFFFFF (blanc)
  ↓
Bordure : #F3EFE6 (beige clair)
  ↓
Ombre : Bleu marine + Or
```

### Section Alternée
```
Fond global : #FAF8F5
  ↓
Section alt : #F3EFE6 (beige plus foncé)
  ↓
Card : #FFFFFF
  ↓
Titre : #1B365D (bleu)
  <em> : #B89445 (or)
```

---

## 🔧 Variables CSS Clés

```css
/* À utiliser dans Tailwind */
bg-[#FAF8F5]          /* Fond global */
bg-white              /* Cards */
text-charcoal-700     /* Titres */
text-primary          /* Titres accent */
text-accent-600       /* Italiques, badges */
border-stone-200      /* Bordures subtiles */
```

---

## 📱 Responsive

Les nuances restent identiques sur mobile/desktop. Seuls les espacements changent.

```tsx
<section className="section section-alt"> {/* Même couleur sur tous écrans */}
  <div className="section-container">
    {/* Padding adaptatif mais couleurs constantes */}
  </div>
</section>
```

---

**Résultat :** Design harmonisé, luxueux, avec transitions douces entre sections et cards. Le fond beige unifie le tout pendant que les nuances blanches et beige clair créent de la profondeur.
