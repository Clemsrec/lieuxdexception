# Stratégie Typographique - Lieux d'Exception

## Police Unique : EB Garamond Regular (400)

**Une seule police pour tout le site** : EB Garamond Regular (weight 400)
- Élégance classique et luxe intemporel
- Lisibilité optimale sur tous supports
- Chargement performant (une seule graisse)

---

## Hiérarchie des Tailles (Mobile → Desktop)

### 1. `.title-hero` - Titres Hero Pages
**Usage** : Titre principal dans HeroSection (h1)  
**Taille** : `32px mobile` → `48px desktop`  
**Line-height** : 1.3  
**Exemple** : "Lieux d'Exception", "Mariages d'Exception"

```tsx
<h1 className="title-hero">Lieux d'Exception</h1>
```

---

### 2. `.title-xl` - Titres de Section Principaux
**Usage** : Titres de sections majeures (h2)  
**Taille** : `24px mobile` → `36px desktop`  
**Line-height** : 1.4  
**Exemples** : "Domaines d'Exception", "Nos Prestations", "Une aventure née de lieux & de passion"

```tsx
<h2 className="title-xl">Domaines d'Exception</h2>
<h2 className="title-xl"><em>Signature</em> d'émotion</h2>
```

**Variante avec italique** : Utiliser `<em>` pour mettre un mot en italique doré

---

### 3. `.title-lg` - Sous-titres de Section
**Usage** : Sous-titres importants, titres de sous-sections (h3)  
**Taille** : `20px mobile` → `28px desktop`  
**Line-height** : 1.5  
**Exemples** : Titres de blocs dans sections, intros de cartes groupées

```tsx
<h3 className="title-lg">Château de la Brûlaire</h3>
```

---

### 4. `.title-md` - Titres de Cartes/Composants
**Usage** : Titres de cartes individuelles, composants (h3/h4)  
**Taille** : `16px mobile` → `20px desktop`  
**Line-height** : 1.5  
**Exemples** : Titres de feature cards, noms de lieux dans grille

```tsx
<h4 className="title-md">Un accompagnement sur mesure</h4>
```

---

### 5. Body Text (défaut)
**Usage** : Texte de paragraphe principal  
**Taille** : `14px mobile` → `18px desktop`  
**Line-height** : 1.7  
**Classes** : Appliqué automatiquement à `<body>`, `.prose`, `.ProseMirror`

```tsx
<p>Texte de paragraphe standard avec bonne lisibilité</p>
```

---

### 6. `.subtitle` - Sous-titre Descriptif
**Usage** : Texte descriptif sous un titre, légende  
**Taille** : `14px mobile` → `16px desktop`  
**Line-height** : 1.7  
**Couleur** : `--foreground-muted` (gris)  
**Exemples** : Descriptions sous titres de section

```tsx
<p className="subtitle">Découvrez nos domaines d'exception</p>
```

---

### 7. Small Text (infos secondaires)
**Usage** : Labels, badges, infos complémentaires  
**Taille** : `12px` ou `14px` fixe  
**Classes Tailwind** : `text-xs` (12px) ou `text-sm` (14px)  
**Exemples** : Badges "PRIVÉ/PRO", capacités, distances

```tsx
<span className="text-xs uppercase tracking-wider">50 MIN DE PARIS</span>
```

---

## Règles d'Application

### ✅ À FAIRE
1. **Utiliser les classes sémantiques** (`.title-xl`, `.title-lg`, etc.) plutôt que Tailwind direct
2. **Respecter la hiérarchie** : Hero > XL > LG > MD > Body > Subtitle
3. **Une seule h1 par page** (dans HeroSection uniquement)
4. **Italique pour emphase** : `<em>mot</em>` dans les titres → couleur or automatique
5. **Responsive automatique** : Les classes incluent déjà les media queries

### ❌ À ÉVITER
1. **Ne PAS mélanger** classes custom et Tailwind pour les titres (choisir l'un ou l'autre)
2. **Ne PAS utiliser** `text-4xl`, `text-5xl` directement → préférer `.title-xl`
3. **Ne PAS oublier** les balises sémantiques HTML (`h1`, `h2`, `h3`, etc.)
4. **Ne PAS dépasser** 18px pour le body text (limite de lisibilité)

---

## Correspondance Tailwind → Classes Custom

| Tailwind | Classe Custom | Usage |
|----------|---------------|-------|
| `text-4xl md:text-5xl lg:text-6xl` | `.title-hero` | Hero h1 |
| `text-3xl md:text-4xl lg:text-5xl` | `.title-xl` | Section h2 |
| `text-2xl md:text-3xl` | `.title-lg` | Sous-section h3 |
| `text-xl md:text-2xl` | `.title-md` | Carte h4 |
| `text-base md:text-lg` | (body défaut) | Paragraphe |
| `text-sm md:text-base` | `.subtitle` | Sous-titre descriptif |

---

## Exemples d'Usage par Composant

### HeroSection
```tsx
<h1 className="title-hero">{title}</h1>  {/* 32px → 48px */}
<p className="text-xl md:text-2xl">{subtitle}</p>  {/* 20px → 24px */}
<div className="text-base md:text-lg">{description}</div>  {/* 16px → 18px */}
```

### Section Standard
```tsx
<h2 className="title-xl">Titre de Section</h2>  {/* 24px → 36px */}
<p className="subtitle">Sous-titre descriptif</p>  {/* 14px → 16px */}
<div className="prose">
  <p>Paragraphe de contenu</p>  {/* 14px → 18px */}
</div>
```

### Feature Card
```tsx
<div className="feature-card">
  <h4 className="title-md">Titre de la carte</h4>  {/* 16px → 20px */}
  <p>Description de la carte</p>  {/* 14px → 18px */}
</div>
```

### Venue Card
```tsx
<h3 className="title-lg">Château de la Brûlaire</h3>  {/* 20px → 28px */}
<div className="text-sm">
  <span>50 MIN DE PARIS</span>  {/* 14px */}
</div>
```

---

## Vérification sur Toutes les Pages

### Pages à Auditer
- ✅ Homepage (`/`)
- ✅ Mariages (`/mariages`)
- ✅ Événements B2B (`/evenements-b2b`)
- ✅ Pages lieux individuelles (`/lieux/[slug]`)
- ✅ Contact (`/contact`)
- ✅ Footer (toutes pages)

### Checklist par Page
1. [ ] Hero h1 utilise `.title-hero`
2. [ ] Sections h2 utilisent `.title-xl`
3. [ ] Sous-sections h3 utilisent `.title-lg` ou `.title-md`
4. [ ] Body text à 14px mobile / 18px desktop
5. [ ] Subtitles à 14px mobile / 16px desktop
6. [ ] Pas de Tailwind `text-*` mixé avec classes custom

---

## Notes Importantes

- **Font-weight** : Toujours 400 (Regular uniquement)
- **Font-family** : EB Garamond partout (--font-display, --font-heading, --font-body pointent tous vers --font-garamond)
- **Couleurs titres** : Défaut noir (`--foreground`), variante bleu primaire (`.text-primary`), italique or automatique (`<em>`)
- **Line-height** : Plus le texte est grand, plus la line-height est serrée (1.3 hero → 1.7 body)
- **Letter-spacing** : Léger (0.01em) pour tous les titres

---

## Migration en Cours

**Statut** : ✅ Classes CSS mises à jour  
**À faire** : Audit complet des composants pour remplacer Tailwind par classes custom

**Priorité** :
1. HeroSection (déjà fait dans code ci-dessus)
2. HomeClient (sections principales)
3. Navigation (si titres)
4. Footer (si titres)
5. Pages mariages/b2b
