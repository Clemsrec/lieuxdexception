# CHARTE GRAPHIQUE - Domaines événementiels & Châteaux (Tailwind v4)

## CONFIGURATION TAILWIND V4

### Installation et setup

```bash
npm install tailwindcss@next @tailwindcss/typography
```

### Structure des fichiers

```
src/
├── app/
│   └── globals.css
├── styles/
│   ├── theme.css
│   └── components.css
└── tailwind.config.ts
```

---

## THEME.CSS (Design Tokens Tailwind v4)

```css
/* src/styles/theme.css */

@import "tailwindcss";

@theme {
  /* COULEURS PRIMAIRES */
  --color-primary-50: #f0f4f8;
  --color-primary-100: #d9e2ec;
  --color-primary-200: #b3c5d9;
  --color-primary-300: #8da8c6;
  --color-primary-400: #6b8bb3;
  --color-primary-500: #4a6ea0;
  --color-primary-600: #3a5780;
  --color-primary-700: #2a4060;
  --color-primary-800: #1b365d; /* Couleur principale */
  --color-primary-900: #142844;
  --color-primary-950: #0d1a2b;

  /* COULEURS ACCENT (Or champagne) */
  --color-accent-50: #faf8f3;
  --color-accent-100: #f5f0e6;
  --color-accent-200: #ebe1cd;
  --color-accent-300: #e1d2b4;
  --color-accent-400: #d7c39b;
  --color-accent-500: #c9a961; /* Or champagne principal */
  --color-accent-600: #b89445;
  --color-accent-700: #9a7b34;
  --color-accent-800: #7c6229;
  --color-accent-900: #5e491f;

  /* COULEURS SECONDAIRES */
  --color-nature-50: #f5f7f4;
  --color-nature-100: #e8ede6;
  --color-nature-200: #d1dbc9;
  --color-nature-300: #b9c9ac;
  --color-nature-400: #a4b79a;
  --color-nature-500: #8b9d83; /* Vert sauge */
  --color-nature-600: #6f7e68;
  --color-nature-700: #535f4e;
  --color-nature-800: #374035;

  --color-stone-50: #fdfcfb;
  --color-stone-100: #faf8f5;
  --color-stone-200: #f3efe6;
  --color-stone-300: #ece6d7;
  --color-stone-400: #e8dcc4; /* Beige pierre */
  --color-stone-500: #d4c8b0;
  --color-stone-600: #b8a88e;

  --color-wedding-50: #f8f5f5;
  --color-wedding-100: #f0e9e9;
  --color-wedding-200: #e1d3d3;
  --color-wedding-300: #d2bdbd;
  --color-wedding-400: #c3a7a7;
  --color-wedding-500: #7d4f50; /* Bordeaux discret */
  --color-wedding-600: #6a4244;

  /* NEUTRALS */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #d4d4d4;
  --color-neutral-400: #a3a3a3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #2c2c2c; /* Gris anthracite */
  --color-neutral-900: #171717;
  --color-neutral-950: #0a0a0a;

  /* BACKGROUNDS */
  --color-background: #fafaf8; /* Blanc cassé */
  --color-background-alt: #f5f5f3;

  /* SPACING (système 4px) */
  --spacing-xs: 0.25rem;    /* 4px */
  --spacing-sm: 0.5rem;     /* 8px */
  --spacing-md: 1rem;       /* 16px */
  --spacing-lg: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;       /* 32px */
  --spacing-2xl: 3rem;      /* 48px */
  --spacing-3xl: 4rem;      /* 64px */
  --spacing-4xl: 6rem;      /* 96px */
  --spacing-5xl: 8rem;      /* 128px */

  /* TYPOGRAPHY */
  --font-display: 'Playfair Display', ui-serif, Georgia, serif;
  --font-sans: 'Montserrat', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;

  /* FONT SIZES */
  --font-size-xs: 0.75rem;      /* 12px */
  --font-size-sm: 0.875rem;     /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;     /* 18px */
  --font-size-xl: 1.25rem;      /* 20px */
  --font-size-2xl: 1.5rem;      /* 24px */
  --font-size-3xl: 1.875rem;    /* 30px */
  --font-size-4xl: 2.25rem;     /* 36px */
  --font-size-5xl: 3rem;        /* 48px */
  --font-size-6xl: 3.75rem;     /* 60px */
  --font-size-7xl: 4.5rem;      /* 72px */

  /* LINE HEIGHTS */
  --leading-none: 1;
  --leading-tight: 1.1;
  --leading-snug: 1.3;
  --leading-normal: 1.5;
  --leading-relaxed: 1.7;
  --leading-loose: 2;

  /* LETTER SPACING */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;

  /* BORDER RADIUS */
  --radius-none: 0;
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;

  /* SHADOWS */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-accent: 0 4px 12px rgba(201, 169, 97, 0.3);
  --shadow-accent-lg: 0 8px 24px rgba(201, 169, 97, 0.4);

  /* TRANSITIONS */
  --transition-fast: 150ms;
  --transition-base: 200ms;
  --transition-slow: 300ms;
  --transition-slower: 500ms;

  /* BREAKPOINTS (Tailwind v4 natifs) */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;

  /* Z-INDEX */
  --z-0: 0;
  --z-10: 10;
  --z-20: 20;
  --z-30: 30;
  --z-40: 40;
  --z-50: 50;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 1000;
  --z-tooltip: 1100;
}

/* GRADIENTS CUSTOM */
@layer utilities {
  .bg-gradient-hero {
    background: linear-gradient(135deg, theme('colors.primary.800') 0%, #2c4a7c 100%);
  }

  .bg-gradient-premium {
    background: linear-gradient(135deg, theme('colors.accent.500') 0%, theme('colors.accent.600') 100%);
  }

  .bg-gradient-overlay {
    background: linear-gradient(180deg, rgba(27,54,93,0) 0%, rgba(27,54,93,0.85) 100%);
  }

  .bg-gradient-overlay-light {
    background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%);
  }
}
```

---

## COMPONENTS.CSS (Composants réutilisables)

```css
/* src/styles/components.css */

@layer components {
  
  /* ========== BOUTONS ========== */
  
  .btn {
    @apply inline-flex items-center justify-center gap-2 
           font-sans font-semibold text-base tracking-wide
           rounded-md transition-all duration-base
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-primary {
    @apply btn bg-gradient-premium text-white
           shadow-accent hover:shadow-accent-lg
           hover:-translate-y-0.5
           focus-visible:ring-accent-500;
    padding: 0.875rem 2rem; /* 14px 32px */
  }

  .btn-secondary {
    @apply btn bg-transparent text-primary-800 
           border-2 border-primary-800
           hover:bg-primary-800 hover:text-white
           focus-visible:ring-primary-800;
    padding: 0.875rem 2rem;
  }

  .btn-ghost {
    @apply btn bg-transparent text-accent-500
           hover:text-accent-600 underline
           focus-visible:ring-accent-500;
    padding: 0.5rem 1rem; /* 8px 16px */
  }

  .btn-sm {
    @apply text-sm;
    padding: 0.5rem 1.5rem; /* 8px 24px */
  }

  .btn-lg {
    @apply text-lg;
    padding: 1rem 2.5rem; /* 16px 40px */
  }

  /* ========== CARDS ========== */

  .card {
    @apply bg-white rounded-lg shadow-md 
           transition-all duration-base
           hover:shadow-xl hover:-translate-y-1;
  }

  .venue-card {
    @apply card overflow-hidden;
  }

  .venue-card__image {
    @apply w-full h-60 object-cover;
  }

  .venue-card__content {
    @apply p-6;
  }

  .venue-card__title {
    @apply font-display text-2xl font-semibold text-primary-800 mb-2;
  }

  .venue-card__location {
    @apply text-sm text-neutral-600 mb-4 flex items-center gap-2;
  }

  .venue-card__features {
    @apply flex flex-wrap gap-4 mb-5;
  }

  .venue-card__feature {
    @apply flex items-center gap-1.5 text-sm text-neutral-700;
  }

  .venue-card__price {
    @apply text-accent-500 font-semibold text-lg mb-4;
  }

  /* ========== FORMULAIRES ========== */

  .form-field {
    @apply mb-6;
  }

  .form-label {
    @apply block font-sans font-medium text-sm text-primary-800 mb-2;
  }

  .form-input {
    @apply w-full px-4 py-3 
           border border-neutral-300 rounded-md
           font-body text-base text-neutral-800
           transition-colors duration-base
           focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20
           disabled:bg-neutral-100 disabled:cursor-not-allowed
           placeholder:text-neutral-400;
  }

  .form-select {
    @apply form-input appearance-none bg-no-repeat bg-right pr-10
           cursor-pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%232c2c2c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-position: right 0.75rem center;
    background-size: 1.25rem;
  }

  .form-textarea {
    @apply form-input resize-y min-h-[120px];
  }

  .form-checkbox {
    @apply w-4 h-4 text-accent-500 bg-white border-neutral-300 rounded
           focus:ring-2 focus:ring-accent-500/20
           cursor-pointer;
  }

  .form-input--error {
    @apply border-red-500 focus:border-red-500 focus:ring-red-500/20;
  }

  .form-error {
    @apply text-red-600 text-xs mt-1;
  }

  .form-hint {
    @apply text-neutral-600 text-xs mt-1;
  }

  /* ========== NAVIGATION ========== */

  .header {
    @apply sticky top-0 z-sticky
           bg-white/95 backdrop-blur-md
           border-b border-primary-800/10
           transition-all duration-base;
  }

  .header__container {
    @apply max-w-7xl mx-auto px-6 
           flex items-center justify-between
           h-20;
  }

  .header--scrolled {
    @apply shadow-md;
    height: 4rem; /* 64px */
  }

  .header__logo {
    @apply h-12 transition-all duration-base;
  }

  .header--scrolled .header__logo {
    @apply h-10;
  }

  .header__nav {
    @apply hidden lg:flex items-center gap-8;
  }

  .header__nav-link {
    @apply font-sans font-medium text-sm tracking-wider uppercase
           text-primary-800 
           transition-colors duration-base
           relative
           hover:text-accent-500
           focus:outline-none focus-visible:text-accent-500;
  }

  .header__nav-link::after {
    @apply absolute bottom-0 left-0 w-0 h-0.5 
           bg-accent-500
           transition-all duration-base;
    content: '';
    bottom: -0.5rem;
  }

  .header__nav-link:hover::after,
  .header__nav-link--active::after {
    @apply w-full;
  }

  .header__cta {
    @apply hidden lg:block;
  }

  .header__mobile-toggle {
    @apply lg:hidden flex items-center justify-center
           w-10 h-10 text-primary-800
           hover:text-accent-500
           transition-colors duration-base;
  }

  /* ========== HERO SECTIONS ========== */

  .hero {
    @apply relative h-[90vh] min-h-[600px]
           flex items-center justify-center
           overflow-hidden;
  }

  .hero__background {
    @apply absolute inset-0 w-full h-full object-cover
           transition-transform duration-slower;
  }

  .hero__overlay {
    @apply absolute inset-0 bg-gradient-overlay;
  }

  .hero__content {
    @apply relative z-10 text-center px-6 max-w-4xl mx-auto;
  }

  .hero__title {
    @apply font-display text-6xl lg:text-7xl font-bold 
           text-white mb-6
           tracking-tight leading-tight;
  }

  .hero__subtitle {
    @apply font-body text-xl lg:text-2xl text-white/90 mb-8
           leading-relaxed;
  }

  .hero__cta-group {
    @apply flex flex-col sm:flex-row gap-4 justify-center items-center;
  }

  /* ========== SECTIONS ========== */

  .section {
    @apply py-16 lg:py-24;
  }

  .section--alt {
    @apply bg-stone-400;
  }

  .section__container {
    @apply max-w-7xl mx-auto px-6;
  }

  .section__header {
    @apply text-center mb-12 lg:mb-16;
  }

  .section__title {
    @apply font-display text-4xl lg:text-5xl font-bold 
           text-primary-800 mb-4
           tracking-tight leading-tight;
  }

  .section__subtitle {
    @apply font-body text-lg lg:text-xl text-neutral-600
           max-w-3xl mx-auto
           leading-relaxed;
  }

  /* ========== GRILLES ========== */

  .grid-venues {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8;
  }

  .grid-features {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
  }

  /* ========== FILTRES ========== */

  .filters {
    @apply bg-white p-6 rounded-lg shadow-md mb-8
           sticky top-24 z-30;
  }

  .filters__grid {
    @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4;
  }

  .filters__reset {
    @apply mt-4 text-accent-500 hover:text-accent-600 
           text-sm font-medium underline
           transition-colors duration-base;
  }

  /* ========== BADGES ========== */

  .badge {
    @apply inline-flex items-center gap-1.5
           px-3 py-1 rounded-full
           text-xs font-medium
           transition-colors duration-base;
  }

  .badge--primary {
    @apply bg-primary-100 text-primary-800;
  }

  .badge--accent {
    @apply bg-accent-100 text-accent-800;
  }

  .badge--nature {
    @apply bg-nature-100 text-nature-800;
  }

  /* ========== FOOTER ========== */

  .footer {
    @apply bg-primary-900 text-white pt-16 pb-8;
  }

  .footer__container {
    @apply max-w-7xl mx-auto px-6;
  }

  .footer__grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12;
  }

  .footer__title {
    @apply font-sans font-semibold text-lg mb-4 text-accent-500;
  }

  .footer__link {
    @apply text-white/80 hover:text-accent-500
           transition-colors duration-base
           block mb-2;
  }

  .footer__bottom {
    @apply border-t border-white/10 pt-8
           flex flex-col md:flex-row justify-between items-center gap-4
           text-sm text-white/60;
  }

  /* ========== BREADCRUMB ========== */

  .breadcrumb {
    @apply flex items-center gap-2 text-sm text-neutral-600 mb-6;
  }

  .breadcrumb__link {
    @apply hover:text-accent-500 transition-colors duration-base;
  }

  .breadcrumb__separator {
    @apply text-neutral-400;
  }

  /* ========== TABLES (Comparateur) ========== */

  .comparison-table {
    @apply w-full bg-white rounded-lg shadow-lg overflow-hidden;
  }

  .comparison-table__header {
    @apply bg-neutral-50;
  }

  .comparison-table__header th {
    @apply p-4 text-center font-semibold text-primary-800;
  }

  .comparison-table__row {
    @apply border-t border-neutral-200;
  }

  .comparison-table__label {
    @apply p-4 font-medium bg-neutral-50 text-primary-800;
  }

  .comparison-table__cell {
    @apply p-4 text-center;
  }

  /* ========== ANIMATIONS ========== */

  .fade-in-up {
    animation: fadeInUp 0.8s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .image-zoom-wrapper {
    @apply overflow-hidden rounded-lg;
  }

  .image-zoom {
    @apply transition-transform duration-slow hover:scale-105;
  }

  /* ========== SKELETON LOADING ========== */

  .skeleton {
    @apply bg-stone-400 animate-pulse rounded;
  }

  .skeleton--text {
    @apply h-4 w-full;
  }

  .skeleton--title {
    @apply h-8 w-3/4;
  }

  .skeleton--image {
    @apply h-48 w-full;
  }
}
```

---

## GLOBALS.CSS

```css
/* src/app/globals.css */

@import "../styles/theme.css";
@import "../styles/components.css";

/* ========== BASE STYLES ========== */

@layer base {
  * {
    @apply border-neutral-300;
  }

  html {
    @apply scroll-smooth antialiased;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-background text-neutral-800 font-body;
  }

  h1, h2 {
    @apply font-display;
  }

  h3, h4, h5, h6 {
    @apply font-sans;
  }

  h1 {
    @apply text-6xl font-bold tracking-tight leading-tight text-primary-800;
  }

  h2 {
    @apply text-4xl font-semibold tracking-tight leading-tight text-primary-800;
  }

  h3 {
    @apply text-2xl font-semibold text-primary-800;
  }

  h4 {
    @apply text-xl font-semibold text-primary-800;
  }

  p {
    @apply leading-relaxed;
  }

  a {
    @apply transition-colors duration-base;
  }

  strong, b {
    @apply font-semibold;
  }

  /* Focus visible pour accessibilité */
  *:focus-visible {
    @apply outline-none ring-2 ring-accent-500 ring-offset-2;
  }

  /* Skip to content */
  .skip-to-content {
    @apply absolute -top-10 left-0 z-[10000]
           bg-primary-800 text-white px-4 py-2
           focus:top-0;
  }
}

/* ========== UTILITIES ========== */

@layer utilities {
  /* Container personnalisé */
  .container-custom {
    @apply w-full mx-auto px-6;
  }

  @media (min-width: 640px) {
    .container-custom {
      @apply px-8;
    }
  }

  @media (min-width: 1024px) {
    .container-custom {
      @apply max-w-7xl;
    }
  }

  /* Aspect ratios images */
  .aspect-venue {
    @apply aspect-[4/3];
  }

  .aspect-hero {
    @apply aspect-[16/9];
  }

  /* Text gradients */
  .text-gradient-premium {
    @apply bg-gradient-premium bg-clip-text text-transparent;
  }

  /* Responsive text sizing */
  .text-responsive-xl {
    @apply text-3xl lg:text-4xl xl:text-5xl;
  }

  .text-responsive-2xl {
    @apply text-4xl lg:text-5xl xl:text-6xl;
  }

  .text-responsive-3xl {
    @apply text-5xl lg:text-6xl xl:text-7xl;
  }
}

/* ========== PRINT STYLES ========== */

@media print {
  @page {
    margin: 2cm;
  }

  header, footer, nav, .no-print {
    display: none !important;
  }

  a[href]:after {
    content: " (" attr(href) ")";
  }
}

/* ========== REDUCED MOTION ========== */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## TAILWIND.CONFIG.TS

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Les variables CSS de theme.css sont automatiquement disponibles
      // Ajouts spécifiques si nécessaire
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
        body: ['var(--font-body)'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'skeleton-pulse': 'skeletonPulse 1.5s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        skeletonPulse: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
```

---

## LAYOUT.TSX (avec fonts)

```tsx
// src/app/layout.tsx
import { Playfair_Display, Montserrat, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700'],
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${montserrat.variable} ${inter.variable}`}>
      <body>
        <a href="#main-content" className="skip-to-content">
          Aller au contenu principal
        </a>
        {children}
      </body>
    </html>
  )
}
```

---

## EXEMPLES D'UTILISATION

### Exemple 1: Hero Section

```tsx
// components/Hero.tsx
export default function Hero() {
  return (
    <section className="hero">
      <img 
        src="/hero-chateau.jpg" 
        alt="Château vue extérieure"
        className="hero__background"
      />
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1 className="hero__title">
          5 Domaines d'Exception en France
        </h1>
        <p className="hero__subtitle">
          Pour vos séminaires et mariages de prestige
        </p>
        <div className="hero__cta-group">
          <button className="btn-primary">
            Événements B2B
          </button>
          <button className="btn-secondary">
            Mariages
          </button>
        </div>
      </div>
    </section>
  )
}
```

### Exemple 2: Venue Card

```tsx
// components/VenueCard.tsx
import { MapPin, Users, Star } from 'lucide-react'

interface VenueCardProps {
  venue: {
    name: string
    location: string
    image: string
    capacity: number
    rating: number
    priceFrom: number
  }
}

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <div className="venue-card">
      <img 
        src={venue.image} 
        alt={venue.name}
        className="venue-card__image"
      />
      <div className="venue-card__content">
        <h3 className="venue-card__title">{venue.name}</h3>
        
        <div className="venue-card__location">
          <MapPin className="w-4 h-4" />
          {venue.location}
        </div>

        <div className="venue-card__features">
          <div className="venue-card__feature">
            <Users className="w-4 h-4" />
            {venue.capacity} personnes
          </div>
          <div className="venue-card__feature">
            <Star className="w-4 h-4 fill-accent-500 text-accent-500" />
            {venue.rating}/5
          </div>
        </div>

        <p className="venue-card__price">
          À partir de {venue.priceFrom}€
        </p>

        <button className="btn-primary w-full">
          Découvrir
        </button>
      </div>
    </div>
  )
}
```

### Exemple 3: Formulaire de contact

```tsx
// components/ContactForm.tsx
'use client'
import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    message: ''
  })

  return (
    <form className="space-y-6">
      <div className="form-field">
        <label htmlFor="name" className="form-label">
          Nom complet
        </label>
        <input 
          type="text"
          id="name"
          name="name"
          className="form-input"
          placeholder="Jean Dupont"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>

      <div className="form-field">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input 
          type="email"
          id="email"
          name="email"
          className="form-input"
          placeholder="jean.dupont@example.com"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>

      <div className="form-field">
        <label htmlFor="eventType" className="form-label">
          Type d'événement
        </label>
        <select 
          id="eventType"
          name="eventType"
          className="form-select"
          value={formData.eventType}
          onChange={(e) => setFormData({...formData, eventType: e.target.value})}
        >
          <option value="">Sélectionnez...</option>
          <option value="mariage">Mariage</option>
          <option value="seminaire">Séminaire</option>
          <option value="conference">Conférence</option>
          <option value="cocktail">Cocktail</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="message" className="form-label">
          Message
        </label>
        <textarea 
          id="message"
          name="message"
          className="form-textarea"
          placeholder="Décrivez votre projet..."
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
        />
      </div>

      <button type="submit" className="btn-primary w-full">
        Envoyer la demande
      </button>
    </form>
  )
}
```

### Exemple 4: Navigation avec Dropdown

```tsx
// components/Header.tsx
'use client'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        <img 
          src="/logo.svg" 
          alt="Groupe Riou"
          className="header__logo"
        />

        <nav className="header__nav">
          <a href="/" className="header__nav-link">
            Accueil
          </a>
          
          <div className="relative group">
            <button className="header__nav-link flex items-center gap-1">
              Nos Domaines
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-base">
              <a href="/domaine1" className="block px-4 py-3 hover:bg-stone-400 text-neutral-800 hover:text-accent-500">
                Château de...
              </a>
              <a href="/domaine2" className="block px-4 py-3 hover:bg-stone-400 text-neutral-800 hover:text-accent-500">
                Domaine de...
              </a>
              {/* etc */}
            </div>
          </div>

          <a href="/evenements-b2b" className="header__nav-link">
            Événements B2B
          </a>
          <a href="/mariages" className="header__nav-link">
            Mariages
          </a>
          <a href="/comparer" className="header__nav-link">
            Comparer
          </a>
          <a href="/contact" className="header__nav-link">
            Contact
          </a>
        </nav>

        <div className="header__cta">
          <button className="btn-primary btn-sm">
            Demander un devis
          </button>
        </div>

        <button 
          className="header__mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}
```

---

## CHECKLIST D'IMPLÉMENTATION

### Phase 1: Setup
- [ ] Installer Tailwind v4 et dépendances
- [ ] Créer theme.css avec toutes les variables
- [ ] Créer components.css avec les composants
- [ ] Configurer les fonts Google (Playfair, Montserrat, Inter)
- [ ] Tester le build

### Phase 2: Composants de base
- [ ] Header avec navigation
- [ ] Footer
- [ ] Boutons (primary, secondary, ghost)
- [ ] Cards (venue, feature)
- [ ] Formulaires (inputs, select, textarea)

### Phase 3: Sections spécifiques
- [ ] Hero avec parallax
- [ ] Grille de domaines avec filtres
- [ ] Comparateur
- [ ] Témoignages carrousel
- [ ] CTA sections

### Phase 4: Responsive
- [ ] Tester mobile (320px à 768px)
- [ ] Tester tablette (768px à 1024px)
- [ ] Tester desktop (1024px+)
- [ ] Menu hamburger mobile

### Phase 5: Performance
- [ ] Lazy loading images
- [ ] Optimisation fonts
- [ ] Animations performantes
- [ ] Tests Lighthouse

Cette configuration Tailwind v4 est prête à l'emploi et totalement alignée avec votre stack Next.js 15 + Firebase.