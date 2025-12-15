# Design System - Cheat Sheet 🎨

Guide de référence rapide pour développer sur Lieux d'Exception.

---

## 📐 Layout & Containers

```tsx
// Structure de base d'une page
<section className="section">           {/* Padding vertical automatique */}
  <div className="container">           {/* Max-width: 1536px */}
    {/* Contenu */}
  </div>
</section>

// Section avec fond alternatif
<section className="section bg-alt">    {/* Fond beige clair */}
  <div className="container">
    {/* Contenu */}
  </div>
</section>

// Section avec fond blanc
<section className="section bg-surface"> {/* Fond blanc pur */}
  <div className="container">
    {/* Contenu */}
  </div>
</section>

// Header/Footer (container plus large)
<header>
  <div className="container-wide">     {/* Max-width: 1920px */}
    {/* Navigation */}
  </div>
</header>
```

---

## 🎨 Couleurs

### Couleurs principales
```tsx
bg-primary      // Bleu marine #1B365D
bg-accent       // Or champagne #C9A961
bg-alt          // Beige clair #F3EFE6
bg-surface      // Blanc #FFFFFF

text-primary    // Bleu pour titres
text-accent     // Or pour accents
text-secondary  // Gris anthracite pour texte
```

### Variables CSS disponibles
```css
var(--primary)          /* #1B365D Bleu marine */
var(--accent)           /* #C9A961 Or champagne */
var(--background)       /* #FAF8F5 Beige pierre */
var(--background-alt)   /* #F3EFE6 Beige clair */
var(--surface)          /* #FFFFFF Blanc */
var(--foreground)       /* #1F1F1F Charcoal */
var(--border)           /* #ECE6D7 Bordure beige */
```

---

## ✍️ Typographie

### Classes de titres
```tsx
<h1 className="title-hero">        {/* 2.5-4rem - Grands hero */}
  Titre Hero
</h1>

<h2 className="title-xl">          {/* 2-3rem - Titres sections */}
  Titre Section
</h2>

<h3 className="title-lg">          {/* 1.5-2rem - Sous-titres */}
  Sous-titre
</h3>

<h4 className="title-md">          {/* 1.25-1.5rem - Cards */}
  Titre Card
</h4>

<p className="subtitle">           {/* 1-1.25rem - Descriptions */}
  Texte descriptif...
</p>

<span className="label-uppercase">  {/* 0.6875rem - Labels */}
  LABEL LUXE
</span>
```

### Accents dans titres
```tsx
<h2 className="title-xl">
  Notre <em>Collection</em>  {/* em = italique or */}
</h2>
```

### Effets typographiques
```tsx
<span className="text-cursive-underline">souligné</span>
<span className="text-cursive-circled">entouré</span>
```

---

## 🔘 Boutons

```tsx
// Bouton principal (gradient or)
<button className="btn-primary">
  Action Principale
</button>

// Bouton secondaire (outline bleu)
<button className="btn-secondary">
  Action Secondaire
</button>

// Avec Link
<Link href="/contact" className="btn-primary">
  Nous Contacter
</Link>
```

---

## 🎴 Cards

```tsx
// Card basique
<div className="card p-6">
  <h3 className="title-md mb-4">Titre</h3>
  <p>Contenu...</p>
</div>

// Card avec hover
<div className="card card-hover p-6">
  <h3 className="title-md mb-4">Titre</h3>
  <p>Contenu...</p>
</div>

// Venue card (optimisée pour lieux)
<div className="venue-card">
  <div className="relative h-64">
    <Image src="..." alt="..." fill className="object-cover" />
  </div>
  <div className="p-6">
    <h3 className="title-md">Nom du lieu</h3>
  </div>
</div>
```

---

## 🏷️ Badges

```tsx
<span className="badge badge-primary">
  Nouveau
</span>

<span className="badge badge-accent">
  Exclusif
</span>
```

---

## 📏 Éléments décoratifs

```tsx
// Ligne accent or (100px centrée)
<div className="accent-line" />

// Ligne diviseur grise
<div className="divider" />

// Ligne diviseur or
<div className="divider-accent" />
```

---

## 📝 Formulaires

```tsx
<form>
  <label className="form-label">
    Votre Nom
  </label>
  <input 
    type="text" 
    className="form-input"
    placeholder="Jean Dupont"
  />

  <label className="form-label">
    Message
  </label>
  <textarea 
    className="form-textarea"
    rows={5}
  />

  <button type="submit" className="btn-primary">
    Envoyer
  </button>
</form>
```

---

## 🎬 Animations

```tsx
// Avec Framer Motion
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
>
  {/* Contenu qui apparaît au scroll */}
</motion.div>

// Classes CSS utilitaires
<div className="animate-fade-in">...</div>
<div className="animate-slide-in">...</div>
```

---

## 📱 Breakpoints

```tsx
// Mobile-first approach
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  {/* 1 col mobile, 2 cols tablette, 4 cols desktop */}
</div>
```

### Points de rupture
- **Mobile** : < 640px (`sm`)
- **Tablette** : 640px - 1024px (`md`, `lg`)
- **Desktop** : ≥ 1024px (`xl`, `2xl`)

⚠️ **Ne JAMAIS utiliser 768px** - Utiliser uniquement 640px et 1024px

---

## 🖼️ Images

```tsx
import Image from 'next/image';

// Image optimisée Next.js
<Image
  src="/images/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  className="w-full h-auto object-cover"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>

// Image de fond avec overlay
<div className="relative h-screen">
  <Image
    src="/images/hero.jpg"
    alt=""
    fill
    className="object-cover"
    sizes="100vw"
  />
  <div className="absolute inset-0 bg-primary/70" />
  <div className="relative z-10">
    {/* Contenu par-dessus */}
  </div>
</div>
```

---

## 🎯 Hero Section

```tsx
<section className="hero-section">
  <Image
    src="/images/hero.jpg"
    alt=""
    fill
    className="object-cover"
    sizes="100vw"
    priority
  />
  
  {/* Overlay gradient */}
  <div className="absolute inset-0 bg-linear-to-t from-primary/90 to-primary/50" />
  
  {/* Contenu */}
  <div className="hero-content">
    <h1 className="hero-title">
      Titre Principal
    </h1>
    <p className="hero-subtitle">
      Sous-titre descriptif
    </p>
    <Link href="/contact" className="btn-primary">
      Découvrir
    </Link>
  </div>
</section>
```

---

## ⚡ Bonnes Pratiques

### ✅ À FAIRE
```tsx
// Séparer structure et présentation
<section className="section bg-alt">

// Utiliser les classes du design system
<h2 className="title-xl text-center mb-8">

// Container dans section
<section className="section">
  <div className="container">

// Accessibilité
<button className="btn-primary" aria-label="Envoyer le formulaire">
```

### ❌ À ÉVITER
```tsx
// Mélanger padding et couleur
<section className="section-alt"> ❌ Obsolète

// Padding inline custom
<div className="py-20 px-8"> ❌ Utiliser .section et .container

// Breakpoint 768px
@media (min-width: 768px) ❌ Utiliser 640px ou 1024px

// Texte directement dans section
<section className="section">
  <h2>Titre</h2> ❌ Manque .container
</section>
```

---

## 🚀 Exemple Complet

```tsx
export default function ExemplePage() {
  return (
    <main>
      {/* Hero */}
      <section className="hero-section">
        <Image src="/hero.jpg" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-primary/90 to-primary/50" />
        <div className="hero-content">
          <h1 className="hero-title">
            Bienvenue chez <em>Lieux d'Exception</em>
          </h1>
          <p className="hero-subtitle">
            Des domaines d'exception pour vos événements
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="section">
        <div className="container">
          <h2 className="title-xl text-center mb-8">
            Notre <em>Histoire</em>
          </h2>
          <div className="accent-line" />
          <p className="subtitle text-center mb-12">
            Une passion pour l'excellence
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card card-hover p-6">
              <div className="section-number">01</div>
              <h3 className="title-md mb-4">Innovation</h3>
              <p>Notre approche...</p>
            </div>
            {/* Autres cards... */}
          </div>
        </div>
      </section>

      {/* Section alternée */}
      <section className="section bg-alt">
        <div className="container">
          <h2 className="title-xl text-center mb-8">
            Nos <em>Services</em>
          </h2>
          {/* Contenu... */}
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container text-center">
          <h2 className="title-lg mb-6">
            Prêt à découvrir nos lieux ?
          </h2>
          <Link href="/catalogue" className="btn-primary">
            Voir le catalogue
          </Link>
        </div>
      </section>
    </main>
  );
}
```

---

## 📚 Documentation Complète

- **Design luxe** : `docs/LUXE-DESIGN-GUIDELINES.md`
- **Règles CSS** : `docs/CSS-DESIGN-RULES.md`
- **Migration** : `docs/MIGRATION-CSS-RESUME.md`
- **Palette** : `docs/PALETTE-COULEURS-HARMONISEE.md`

---

**Dernière mise à jour** : 14 décembre 2025  
**Version Design System** : 2.0
