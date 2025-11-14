# Règles de Layout CSS - Lieux d'Exception

## 📐 Principe de Base

**Une règle simple et universelle :**
- Tout le contenu utilise `.section-container` (max-width: 1536px)
- Header et Footer utilisent `.header-footer-container` (max-width: 1920px)
- **JAMAIS** de `max-w-*` Tailwind à l'intérieur des containers

## 🎯 Structure Globale

```css
/* Contenu des pages */
.section-container {
  max-width: 1536px;
  margin: 0 auto;
  padding: 2rem; /* 3rem sur tablet, 4rem sur desktop */
}

/* Header et Footer */
.header-footer-container {
  max-width: 1920px;
  margin: 0 auto;
  padding: 2rem; /* 3rem sur tablet, 4rem sur desktop */
}
```

## ✅ Utilisation Correcte

```tsx
// ✅ BON - Utilise le container sans limitation supplémentaire
<section className="section">
  <div className="section-container">
    <h2>Titre de section</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Contenu */}
    </div>
  </div>
</section>

// ✅ BON - Header/Footer
<header>
  <div className="header-footer-container">
    <nav>{/* Navigation */}</nav>
  </div>
</header>
```

## ❌ À Éviter

```tsx
// ❌ MAUVAIS - Ne pas ajouter de max-w-* à l'intérieur
<section className="section">
  <div className="section-container">
    <div className="max-w-6xl mx-auto"> {/* ⚠️ Limite inutile */}
      {/* Contenu */}
    </div>
  </div>
</section>

// ❌ MAUVAIS - Ne pas utiliser section-container pour header/footer
<header>
  <div className="section-container"> {/* ⚠️ Trop étroit */}
    {/* Navigation */}
  </div>
</header>
```

## 🎨 Exceptions (Rares)

**Seulement pour le contenu textuel nécessitant une meilleure lisibilité :**

```tsx
// ✅ Exception acceptable - Citation ou paragraphe long
<section className="section">
  <div className="section-container">
    <p className="max-w-3xl mx-auto text-center">
      « Citation longue qui bénéficie d'une largeur réduite pour la lisibilité... »
    </p>
  </div>
</section>
```

**Règle :** Max 768px (max-w-3xl) pour les citations, jamais pour les grilles/cards.

## 📱 Responsive Automatique

Les paddings s'adaptent automatiquement :
- **Mobile** : 2rem (32px)
- **Tablet (640px+)** : 3rem (48px)
- **Desktop (1024px+)** : 4rem (64px)

## 🚫 Max-Width à Supprimer

Si vous voyez ces classes dans le code, **supprimez-les** :
- `max-w-4xl`, `max-w-5xl`, `max-w-6xl`, `max-w-7xl`
- Sauf pour le texte long (`max-w-2xl`, `max-w-3xl`)

## 📋 Checklist

Avant de valider du code :
- [ ] Utilise `.section-container` pour le contenu
- [ ] Utilise `.header-footer-container` pour header/footer
- [ ] Pas de `max-w-*` sur les grilles ou cards
- [ ] `max-w-*` uniquement sur du texte long si nécessaire
