# AUDIT CSS & LAYOUT - Lieux d'Exception

## 🔍 Problèmes Identifiés

### 1. **Couches CSS multiples et conflictuelles**

#### A. Classes de container en conflit
```css
/* globals.css - 3 classes différentes pour containers */
.section-container           /* max-width: 1536px */
.max-w-content              /* max-width: 1536px (doublon) */
.header-footer-container    /* max-width: 1920px */
```
**Problème** : Redondance, confusion sur quelle classe utiliser

#### B. Classes de section incohérentes
```css
.section               /* padding-top: 4-6rem */
.section-alt           /* background: #F3EFE6 */
.section-light         /* background: #FFFFFF */
```
**Problème** : Mixing de structure (padding) et de présentation (couleur)

#### C. Classes de padding forcées avec !important
```css
[class*="p-4"] { padding: 1.75rem !important; }
[class*="p-6"] { padding: 2rem !important; }
```
**Problème** : Override brutal des classes Tailwind, difficile à maintenir

---

### 2. **Couleurs hardcodées vs Variables**

#### Problème dans composants :
```tsx
// VenuesCarousel.tsx
className="bg-white"          // ❌ Hardcodé
className="text-primary"       // ✅ Variable

// HomeClient.tsx
className="bg-accent/40"       // ❌ Tailwind avec opacité
className="text-cursive-underline" // ❌ Classe custom non définie
```

**Incohérence** : Mélange de classes Tailwind natives + classes custom + variables CSS

---

### 3. **Structure Layout fragmentée**

#### layout.tsx - Minimaliste (BON)
```tsx
<html lang="fr">
  <body className="antialiased">
    <main>{children}</main>
    <Footer />
  </body>
</html>
```

#### HomeClient.tsx - Multiple sections wrapper
```tsx
<SectionReveal>          {/* Wrapper animation */}
  <section className="section">
    <div className="section-container">
      {/* Contenu */}
    </div>
  </section>
</SectionReveal>
```

**Problème** : 3 niveaux de wrapping pour chaque section (SectionReveal → section → container)

---

### 4. **Classes utilitaires manquantes**

```tsx
// Utilisé partout mais non défini dans globals.css :
.text-cursive-underline
.text-cursive-circled
```

---

### 5. **Système de fonds incohérent**

```css
/* Variables définies */
--background: #FAF8F5         /* Beige pierre */
--background-alt: #F3EFE6     /* Beige clair */
--surface: #FFFFFF            /* Blanc */

/* Mais utilisées de manière incohérente */
body { background-color: var(--background); }  /* ✅ OK */
.section { /* pas de background défini */ }    /* ⚠️ Hérite du body */
.section-alt { background: #F3EFE6; }          /* ❌ Hardcodé au lieu de var(--background-alt) */
```

---

## 🎯 Solution Proposée

### ARCHITECTURE SIMPLIFIÉE EN 3 COUCHES

```
LAYER 1: Design Tokens (@theme)
  ├─ Couleurs primaires, accent, charcoal, stone
  ├─ Espacements, typography, shadows
  └─ Variables CSS (:root)

LAYER 2: Base Components (CSS classes)
  ├─ Layout: .container, .section
  ├─ Typography: .title-xl, .title-lg, .subtitle
  ├─ Buttons: .btn-primary, .btn-secondary
  └─ Cards: .card, .card-hover

LAYER 3: Utility Classes (Tailwind)
  ├─ Spacing: p-6, mt-4, gap-8
  ├─ Colors: text-primary, bg-accent
  └─ Layout: grid, flex, items-center
```

---

## 📐 NOUVELLE STRUCTURE CSS PROPOSÉE

### 1. Design Tokens (existant, à conserver)
```css
@theme {
  --color-primary: #1B365D;
  --color-accent: #C9A961;
  --color-charcoal-700: #1F1F1F;
  --color-stone-100: #FAF8F5;
  /* etc. */
}

:root {
  --background: #FAF8F5;
  --surface: #FFFFFF;
  --foreground: var(--color-charcoal-700);
  /* etc. */
}
```

### 2. Layout System (À REFAIRE)

#### A. Containers
```css
/* UN SEUL container pour tout le contenu */
.container {
  max-width: 1536px;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container { padding-left: 2rem; padding-right: 2rem; }
}

@media (min-width: 1024px) {
  .container { padding-left: 3rem; padding-right: 3rem; }
}

/* Container large pour header/footer uniquement */
.container-wide {
  max-width: 1920px;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
}
```

#### B. Sections (SÉPARATION structure / présentation)
```css
/* STRUCTURE (spacing seulement) */
.section {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

@media (min-width: 768px) {
  .section {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
}

@media (min-width: 1024px) {
  .section {
    padding-top: 6rem;
    padding-bottom: 6rem;
  }
}

/* PRÉSENTATION (couleurs) - Classes séparées */
.bg-primary { background-color: var(--color-primary); }
.bg-accent { background-color: var(--color-accent); }
.bg-surface { background-color: var(--surface); }
.bg-alt { background-color: var(--background-alt); }
```

**Usage dans composants :**
```tsx
{/* Section standard (fond beige hérité du body) */}
<section className="section">
  <div className="container">
    ...
  </div>
</section>

{/* Section avec fond alternatif */}
<section className="section bg-alt">
  <div className="container">
    ...
  </div>
</section>

{/* Section avec fond blanc */}
<section className="section bg-surface">
  <div className="container">
    ...
  </div>
</section>
```

### 3. Typography System

```css
/* Titres principaux */
.title-hero {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 600;
  color: var(--foreground);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.title-xl {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  color: var(--foreground);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.title-lg {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;
  color: var(--foreground);
  line-height: 1.3;
}

/* Accents dans titres */
.title-xl em,
.title-lg em {
  font-style: italic;
  color: var(--color-accent-600);
}

/* Subtitle */
.subtitle {
  font-family: var(--font-body);
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--foreground-muted);
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto;
}
```

### 4. Components System

```css
/* Cards de base */
.card {
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
}

.card-hover {
  box-shadow: 0 2px 8px rgba(27, 54, 93, 0.04);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(27, 54, 93, 0.12),
              0 4px 12px rgba(201, 169, 97, 0.08);
  border-color: var(--border-accent);
}

/* Venue cards spécifiques */
.venue-card {
  @apply card card-hover;
  overflow: hidden;
}
```

### 5. Boutons

```css
/* Bouton principal (or champagne) */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 2rem;
  border-radius: var(--radius-md);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: pointer;
  white-space: nowrap;
}

.btn-primary {
  @apply btn;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-600) 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(201, 169, 97, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(201, 169, 97, 0.4);
}

.btn-secondary {
  @apply btn;
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.btn-secondary:hover {
  background: var(--primary);
  color: white;
}
```

---

## 🗑️ À SUPPRIMER

### Classes obsolètes / redondantes
```css
/* À SUPPRIMER */
.section-container          /* → Remplacer par .container */
.max-w-content             /* → Doublon, supprimer */
.header-footer-container   /* → Remplacer par .container-wide */
.section-title             /* → Remplacer par .title-xl */
.section-title-accent      /* → Remplacer par .title-xl */
.section-subtitle          /* → Remplacer par .subtitle */

/* Padding overrides à supprimer */
[class*="p-4"] { padding: ... !important; }
[class*="p-6"] { padding: ... !important; }
```

---

## 📝 PLAN D'ACTION

### Phase 1: Nettoyer globals.css
1. ✅ Garder @theme et :root (design tokens)
2. 🔄 Refactor Layout System (.container, .section)
3. 🔄 Refactor Typography (.title-xl, .subtitle)
4. 🔄 Refactor Components (.card, .btn)
5. 🗑️ Supprimer classes obsolètes

### Phase 2: Migrer les composants
1. HomeClient.tsx : Remplacer `.section-container` → `.container`
2. HomeClient.tsx : Remplacer `.section-title-accent` → `.title-xl`
3. VenuesCarousel.tsx : Utiliser variables CSS au lieu de hardcodé
4. Navigation.tsx : Utiliser `.container-wide`
5. Footer.tsx : Utiliser `.container-wide`

### Phase 3: Tester et valider
1. Vérifier rendu visuel identique
2. Vérifier responsive
3. Supprimer console.logs
4. Build production

---

## ✨ AVANTAGES DE LA NOUVELLE ARCHITECTURE

### Avant (problématique) :
```tsx
<SectionReveal>
  <section className="section section-alt">
    <div className="section-container">
      <h2 className="section-title-accent">
        Titre avec <em>accent</em>
      </h2>
    </div>
  </section>
</SectionReveal>
```

### Après (simplifié) :
```tsx
<section className="section bg-alt">
  <div className="container">
    <h2 className="title-xl text-center mb-8">
      Titre avec <em>accent</em>
    </h2>
  </div>
</section>
```

**Gains :**
- 1 niveau de nesting en moins (SectionReveal supprimé)
- Classes plus explicites (`.bg-alt` vs `.section-alt`)
- Réutilisable partout (`.container` vs `.section-container`)
- Tailwind utilities pour spacing (`.mb-8` vs `margin-bottom: var(--spacing-lg)`)

---

## 🎨 SYSTÈME DE COULEURS FINAL

```css
/* Body - Fond global beige */
body {
  background-color: var(--background); /* #FAF8F5 */
}

/* Sections */
.bg-alt {
  background-color: var(--background-alt); /* #F3EFE6 */
}

.bg-surface {
  background-color: var(--surface); /* #FFFFFF */
}

/* Cards */
.card {
  background: var(--surface); /* #FFFFFF */
  border: 1px solid var(--border-light); /* #F3EFE6 */
}

/* Textes */
.title-xl {
  color: var(--foreground); /* #1F1F1F charcoal */
}

.title-xl em {
  color: var(--color-accent-600); /* #B89445 or */
}

.subtitle {
  color: var(--foreground-muted); /* #57534E gris */
}
```

**Hiérarchie visuelle :**
```
Body: #FAF8F5 (beige pierre)
  ├─ Section: transparent (hérite #FAF8F5)
  ├─ Section.bg-alt: #F3EFE6 (beige clair)
  ├─ Section.bg-surface: #FFFFFF (blanc)
  └─ Card: #FFFFFF sur fond beige/alt
```

---

**Prêt pour phase 1 ?** Je peux créer le nouveau globals.css restructuré.
