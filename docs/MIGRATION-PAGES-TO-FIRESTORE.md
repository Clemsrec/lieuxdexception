# Guide de Migration des Pages vers Firestore

## Résumé Rapide

Ce guide explique comment migrer une page existante du site pour qu'elle charge ses contenus depuis Firestore au lieu de les avoir en dur dans le code.

## Étapes de Migration

### 1. Initialiser les contenus dans Firestore

```bash
# Première fois uniquement
node scripts/init-page-contents.js
```

Ce script crée les 4 pages (homepage, contact, mariages, b2b) avec leurs contenus par défaut.

### 2. Modifier la page pour charger depuis Firestore

**Avant :**
```tsx
// src/app/[locale]/mariages/page.tsx
export default function MariagesPage() {
  return (
    <main>
      <HeroSection
        title="Mariages d'Exception"
        subtitle="Célébrez votre union dans un cadre d'exception"
        description="Des lieux prestigieux..."
      />
      
      <section>
        <h2>Notre approche</h2>
        <p>Texte hardcodé...</p>
      </section>
    </main>
  );
}
```

**Après :**
```tsx
// src/app/[locale]/mariages/page.tsx
import { getPageContent } from '@/lib/firestore';
import { ContentSection, FeatureCard, FinalCTA } from '@/components/PageContentComponents';

export default async function MariagesPage({ params }) {
  const { locale } = await params;
  
  // Charger le contenu depuis Firestore
  const content = await getPageContent('mariages', locale);
  
  if (!content) {
    return <div>Contenu non disponible</div>;
  }

  return (
    <main>
      {/* Hero depuis Firestore */}
      <HeroSection
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        description={content.hero.description}
        backgroundImage={content.hero.backgroundImage}
      />
      
      {/* Sections depuis Firestore */}
      {content.sections.filter(s => s.visible).map(section => (
        <section key={section.id}>
          <ContentSection
            title={section.title}
            content={section.content}
          />
        </section>
      ))}
      
      {/* Feature Cards depuis Firestore */}
      {content.featureCards.filter(c => c.visible).map(card => (
        <FeatureCard
          key={card.id}
          number={card.number}
          title={card.title}
          content={card.content}
        />
      ))}
      
      {/* CTA Final depuis Firestore */}
      {content.finalCta && (
        <FinalCTA {...content.finalCta} />
      )}
    </main>
  );
}
```

### 3. Tester

1. Démarrer le serveur : `npm run dev`
2. Accéder à la page : `http://localhost:3002/mariages`
3. Vérifier que le contenu s'affiche correctement
4. Accéder au dashboard : `http://localhost:3002/admin/contenus`
5. Modifier un texte et enregistrer
6. Recharger la page publique et vérifier que le changement est visible

### 4. Déployer

```bash
# Déployer les règles Firestore
firebase deploy --only firestore:rules

# Déployer l'application
firebase deploy --only hosting
```

## Composants Disponibles

### `ContentSection`

Pour afficher une section de texte simple :

```tsx
<ContentSection
  title="Titre de la section"
  content="<p>Contenu HTML...</p>"
  animateOnScroll={true}
/>
```

### `FeatureCard`

Pour afficher une carte numérotée (01, 02, 03...) :

```tsx
<FeatureCard
  number="01"
  title="Titre de la carte"
  content="<p>Contenu...</p>"
/>
```

### `ContentBlock`

Pour afficher un bloc de contenu avec image (style B2B) :

```tsx
<ContentBlock
  title="Titre du bloc"
  subtitle="Sous-titre optionnel"
  content="<p>Contenu...</p>"
  image="/path/to/image.jpg"
  imageAlt="Description"
  ctaText="En savoir plus"
  ctaLink="/lien"
/>
```

### `FinalCTA`

Pour afficher le CTA final de page :

```tsx
<FinalCTA
  title="Titre du CTA"
  subtitle="Sous-titre"
  content="<p>Texte additionnel...</p>"
  ctaText="Contactez-nous"
  ctaLink="/contact"
  backgroundImage="/path/to/bg.jpg"
/>
```

## Checklist de Migration

- [ ] Exécuter `node scripts/init-page-contents.js`
- [ ] Importer `getPageContent` et les composants
- [ ] Remplacer `export default function` par `export default async function`
- [ ] Ajouter `const content = await getPageContent(pageId, locale);`
- [ ] Remplacer les props hardcodées par `content.hero.*`, `content.sections`, etc.
- [ ] Tester en local que tout fonctionne
- [ ] Modifier les contenus depuis `/admin/contenus` pour vérifier
- [ ] Déployer sur Firebase

## Pages à Migrer

- [x] Structure Firestore créée
- [x] API Routes créées
- [x] Dashboard admin créé
- [ ] Homepage (`/`)
- [ ] Contact (`/contact`)
- [ ] Mariages (`/mariages`)
- [ ] Événements B2B (`/evenements-b2b`)

## Support

Voir le fichier complet d'exemple : `docs/EXAMPLE-PAGE-WITH-FIRESTORE-CONTENT.tsx`
Voir la documentation complète : `docs/PAGE-CONTENTS-MANAGEMENT.md`
