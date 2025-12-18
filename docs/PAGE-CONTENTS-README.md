# 📝 Système de Gestion des Contenus de Pages

## Vue d'ensemble

Système complet pour gérer tous les contenus des pages publiques (Homepage, Contact, Mariages, B2B) depuis le dashboard admin, sans toucher au code.

## 🎯 Fonctionnalités

✅ **Édition complète des contenus** : Textes, titres, descriptions, images, CTA  
✅ **Multilingue** : Support de 6 langues (fr, en, es, de, it, pt)  
✅ **Interface admin intuitive** : Dashboard dédié avec formulaires clairs  
✅ **HTML supporté** : Mise en forme riche (gras, italique, listes, liens)  
✅ **Versioning** : Chaque modification crée une nouvelle version  
✅ **Sécurisé** : Lecture publique, écriture admin uniquement  
✅ **Composants réutilisables** : ContentSection, FeatureCard, ContentBlock, FinalCTA  

## 📁 Fichiers Créés

### Backend
- `src/types/firebase.ts` : Interfaces TypeScript pour PageContent
- `src/lib/firestore.ts` : Services CRUD (getPageContent, upsertPageContent, etc.)
- `src/app/api/admin/page-contents/route.ts` : API Routes GET/POST/DELETE
- `firestore.rules` : Règles de sécurité pour collection pageContents

### Frontend Admin
- `src/app/admin/contenus/page.tsx` : Page de gestion des contenus
- `src/components/admin/PageContentManager.tsx` : Interface d'édition complète
- `src/components/admin/AdminLayout.tsx` : Navigation mise à jour (lien Contenus)

### Frontend Public
- `src/components/PageContentComponents.tsx` : Composants d'affichage (ContentSection, FeatureCard, etc.)

### Scripts & Documentation
- `scripts/init-page-contents.js` : Initialisation des contenus par défaut
- `docs/PAGE-CONTENTS-MANAGEMENT.md` : Documentation complète du système
- `docs/MIGRATION-PAGES-TO-FIRESTORE.md` : Guide de migration des pages
- `docs/EXAMPLE-PAGE-WITH-FIRESTORE-CONTENT.tsx` : Exemple d'utilisation

## 🚀 Démarrage Rapide

### 1. Initialiser les contenus

```bash
node scripts/init-page-contents.js
```

Ce script crée les 4 pages en français avec les contenus par défaut.

### 2. Accéder au dashboard

```bash
npm run dev
```

Puis aller sur : `http://localhost:3002/admin/contenus`

### 3. Éditer un contenu

1. Sélectionner la page (Homepage, Contact, Mariages, B2B)
2. Sélectionner la langue (fr par défaut)
3. Modifier les contenus :
   - **Hero** : Titre, sous-titre, description, image, CTA
   - **Sections** : Ajouter/modifier/supprimer des sections de texte
   - **Feature Cards** (Homepage) : Cartes numérotées 01, 02, 03, 04
   - **Blocs** (B2B) : Blocs de contenu avec titre et texte
4. Cliquer sur **Enregistrer les modifications**

### 4. Voir les changements

Recharger la page publique correspondante pour voir les modifications.

## 📋 Structure de Données

### Collection Firestore : `pageContents`

Document ID : `{pageId}_{locale}` (ex: `homepage_fr`)

```typescript
{
  id: 'homepage',
  pageName: 'Page d\'Accueil',
  locale: 'fr',
  
  hero: {
    title: string,
    subtitle: string,
    description: string,
    backgroundImage?: string,
    ctaText?: string,
    ctaLink?: string,
  },
  
  sections: Array<{
    id: string,
    title: string,
    content: string,  // HTML
    order: number,
    visible: boolean,
  }>,
  
  featureCards: Array<{
    id: string,
    number: string,   // "01", "02"
    title: string,
    content: string,  // HTML
    order: number,
    visible: boolean,
  }>,
  
  blocks: Array<{
    id: string,
    title: string,
    content: string,  // HTML
    order: number,
    visible: boolean,
  }>,
  
  finalCta: {
    title: string,
    subtitle: string,
    content: string,
    ctaText: string,
    ctaLink: string,
    backgroundImage?: string,
  },
  
  updatedAt: Timestamp,
  updatedBy: string,
  version: number,
}
```

## 🔧 Utilisation dans les Pages

### Exemple : Page Mariages

```tsx
import { getPageContent } from '@/lib/firestore';
import { ContentSection, FeatureCard, FinalCTA } from '@/components/PageContentComponents';

export default async function MariagesPage({ params }) {
  const { locale } = await params;
  const content = await getPageContent('mariages', locale);
  
  return (
    <main>
      <HeroSection
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        description={content.hero.description}
      />
      
      {content.sections.filter(s => s.visible).map(section => (
        <ContentSection key={section.id} {...section} />
      ))}
      
      {content.featureCards.filter(c => c.visible).map(card => (
        <FeatureCard key={card.id} {...card} />
      ))}
      
      {content.finalCta && <FinalCTA {...content.finalCta} />}
    </main>
  );
}
```

## 🌐 Multilingue

Pour créer le contenu dans une autre langue :

1. Aller sur `/admin/contenus`
2. Sélectionner la langue cible (ex: `en`)
3. Traduire tous les champs
4. Enregistrer

Les pages publiques chargeront automatiquement le bon contenu selon l'URL (`/en/`, `/es/`, etc.).

## 🔒 Sécurité

### Règles Firestore

```javascript
match /pageContents/{pageContentId} {
  // Lecture publique
  allow read: if true;
  
  // Écriture admin uniquement
  allow create, update, delete: if isAdmin();
}
```

### API Routes

- `GET /api/admin/page-contents` : Récupérer les contenus
- `POST /api/admin/page-contents` : Créer/modifier (admin requis)
- `DELETE /api/admin/page-contents` : Supprimer (admin requis)

## 📦 Services Disponibles

```typescript
// Récupérer le contenu d'une page
const content = await getPageContent('homepage', 'fr');

// Récupérer tous les contenus pour une locale
const allContents = await getAllPageContents('fr');

// Créer ou mettre à jour
await upsertPageContent('homepage', 'fr', contentData, 'admin@example.com');

// Supprimer
await deletePageContent('homepage', 'fr');
```

## 🎨 Composants Réutilisables

### ContentSection
```tsx
<ContentSection
  title="Titre"
  content="<p>HTML...</p>"
  animateOnScroll={true}
/>
```

### FeatureCard
```tsx
<FeatureCard
  number="01"
  title="Titre"
  content="<p>HTML...</p>"
/>
```

### ContentBlock
```tsx
<ContentBlock
  title="Titre"
  content="<p>HTML...</p>"
  image="/path/to/image.jpg"
/>
```

### FinalCTA
```tsx
<FinalCTA
  title="Titre"
  ctaText="Contactez-nous"
  ctaLink="/contact"
  backgroundImage="/bg.jpg"
/>
```

## ✅ Migration des Pages Existantes

Voir le guide complet : `docs/MIGRATION-PAGES-TO-FIRESTORE.md`

**Checklist :**
- [x] Structure Firestore créée
- [x] API Routes créées
- [x] Dashboard admin créé
- [x] Composants d'affichage créés
- [ ] Migrer Homepage
- [ ] Migrer Contact
- [ ] Migrer Mariages
- [ ] Migrer B2B

## 📚 Documentation

- `docs/PAGE-CONTENTS-MANAGEMENT.md` : Documentation complète
- `docs/MIGRATION-PAGES-TO-FIRESTORE.md` : Guide de migration
- `docs/EXAMPLE-PAGE-WITH-FIRESTORE-CONTENT.tsx` : Exemple complet

## 🐛 Troubleshooting

### Le contenu ne s'affiche pas

```bash
# Vérifier que les contenus existent dans Firestore
node scripts/init-page-contents.js
```

### Erreur 401 Non authentifié

Vérifier que vous êtes bien connecté au dashboard admin.

### Les modifications ne s'affichent pas

1. Vérifier que la sauvegarde a bien fonctionné (message de succès)
2. Recharger la page publique (cache ISR de 60 secondes)
3. Vérifier la version dans le dashboard

## 🔮 Améliorations Futures

- [ ] Éditeur WYSIWYG (TipTap, Quill)
- [ ] Prévisualisation en temps réel
- [ ] Upload d'images directement depuis l'éditeur
- [ ] Historique des versions avec rollback
- [ ] Workflow brouillon → publié
- [ ] Comparaison de versions (diff)

## 📞 Support

Pour toute question :
- Consulter la documentation dans `docs/`
- Vérifier les logs : `firebase functions:log`
- Voir l'exemple complet : `docs/EXAMPLE-PAGE-WITH-FIRESTORE-CONTENT.tsx`
