# Gestion des Contenus de Pages

## Vue d'ensemble

Le système de gestion des contenus permet d'éditer facilement tous les textes et contenus des pages publiques du site depuis le dashboard admin, sans toucher au code.

## Pages gérées

- **Homepage** (`/`) : Page d'accueil avec présentation de la marque
- **Contact** (`/contact`) : Page de contact avec formulaires
- **Mariages** (`/mariages`) : Page dédiée aux mariages
- **Événements B2B** (`/evenements-b2b`) : Page dédiée aux événements professionnels

## Architecture

### Collection Firestore : `pageContents`

Chaque page a un document identifié par `{pageId}_{locale}` (ex: `homepage_fr`, `mariages_en`)

#### Structure d'un document

```typescript
{
  id: string;              // 'homepage', 'contact', 'mariages', 'b2b'
  pageName: string;        // Nom affiché
  locale: string;          // 'fr', 'en', 'es', 'de', 'it', 'pt'
  
  // Section Hero (en-tête de page)
  hero: {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
  };
  
  // Sections de contenu texte
  sections: Array<{
    id: string;
    title: string;
    content: string;       // HTML autorisé
    order: number;
    visible: boolean;
  }>;
  
  // Blocs de contenu avec images (pour B2B notamment)
  blocks: Array<{
    id: string;
    title: string;
    subtitle?: string;
    content: string;       // HTML autorisé
    image?: string;
    imageAlt?: string;
    ctaText?: string;
    ctaLink?: string;
    order: number;
    visible: boolean;
  }>;
  
  // Cartes de fonctionnalités (pour Homepage)
  featureCards: Array<{
    id: string;
    number: string;        // "01", "02", "03", "04"
    title: string;
    content: string;       // HTML autorisé
    order: number;
    visible: boolean;
  }>;
  
  // Informations de contact (pour page Contact)
  contactInfo: Array<{
    type: 'b2b' | 'wedding' | 'general';
    phone: string;
    email: string;
    description?: string;
  }>;
  
  // CTA final de page
  finalCta: {
    title: string;
    subtitle: string;
    content: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage?: string;
  } | null;
  
  // Métadonnées
  updatedAt: Timestamp;
  updatedBy: string;       // Email de l'admin
  version: number;         // Incrémenté à chaque modification
}
```

## Utilisation

### 1. Initialiser les contenus par défaut

La première fois, exécuter le script d'initialisation :

```bash
node scripts/init-page-contents.js
```

Ce script crée les 4 pages en français avec les contenus actuels.

### 2. Éditer les contenus depuis le dashboard

1. Se connecter au dashboard admin : `http://localhost:3002/admin/connexion`
2. Accéder à la page **Contenus** : `/admin/contenus`
3. Sélectionner la page à éditer (Homepage, Contact, Mariages, B2B)
4. Sélectionner la langue (fr, en, es, de, it, pt)
5. Modifier les contenus :
   - **Section Hero** : Titre, sous-titre, description, image de fond, bouton CTA
   - **Sections de contenu** : Ajouter/modifier/supprimer des sections de texte
   - **Cartes de fonctionnalités** (Homepage uniquement) : Cartes numérotées 01, 02, 03, 04
   - **Blocs de contenu** (B2B) : Blocs avec titre et contenu
6. Cliquer sur **Enregistrer les modifications**

### 3. HTML autorisé dans les contenus

Les champs de contenu supportent le HTML pour la mise en forme :

- `<p>` : Paragraphe
- `<strong>` : Texte en gras
- `<em>` : Texte en italique
- `<br/>` : Saut de ligne
- `<ul>` et `<li>` : Listes à puces
- `<a href="">` : Liens
- Classes Tailwind autorisées pour le style

**Exemple :**
```html
<p>Des lieux à forte identité, pensés pour créer un effet immédiat.</p>
<p><strong>Votre événement devient un moment de référence</strong>, qui valorise votre image et renforce l'adhésion de vos équipes et de vos clients.</p>
```

### 4. Versions et historique

- Chaque modification incrémente la `version` du contenu
- Le champ `updatedBy` indique qui a fait la dernière modification
- Le champ `updatedAt` indique la date de dernière modification

## API Routes

### GET `/api/admin/page-contents`

Récupérer le contenu d'une page :

```typescript
GET /api/admin/page-contents?pageId=homepage&locale=fr
```

Récupérer tous les contenus pour une locale :

```typescript
GET /api/admin/page-contents?locale=fr
```

### POST `/api/admin/page-contents`

Créer ou mettre à jour un contenu :

```typescript
POST /api/admin/page-contents
Body: {
  pageId: 'homepage',
  locale: 'fr',
  content: { /* PageContent object */ }
}
```

### DELETE `/api/admin/page-contents`

Supprimer un contenu :

```typescript
DELETE /api/admin/page-contents?pageId=homepage&locale=fr
```

## Services Firestore

### `getPageContent(pageId, locale)`

Récupère le contenu d'une page spécifique.

```typescript
import { getPageContent } from '@/lib/firestore';

const content = await getPageContent('homepage', 'fr');
```

### `getAllPageContents(locale)`

Récupère tous les contenus pour une locale donnée.

```typescript
import { getAllPageContents } from '@/lib/firestore';

const allContents = await getAllPageContents('fr');
```

### `upsertPageContent(pageId, locale, content, userEmail)`

Crée ou met à jour un contenu de page.

```typescript
import { upsertPageContent } from '@/lib/firestore';

await upsertPageContent('homepage', 'fr', contentData, 'admin@example.com');
```

### `deletePageContent(pageId, locale)`

Supprime un contenu de page.

```typescript
import { deletePageContent } from '@/lib/firestore';

await deletePageContent('homepage', 'fr');
```

## Règles de sécurité Firestore

```javascript
match /pageContents/{pageContentId} {
  // Lecture: Public (pour affichage des pages)
  allow read: if true;
  
  // Écriture: Admin uniquement
  allow create, update: if isAdmin() &&
    hasRequiredFields(['id', 'pageName', 'locale', 'hero', 'updatedAt', 'updatedBy', 'version']);
  
  // Suppression: Admin uniquement
  allow delete: if isAdmin();
}
```

## Internationalisation

Pour créer les contenus dans d'autres langues :

1. Aller sur `/admin/contenus`
2. Sélectionner la langue cible (ex: `en`)
3. Traduire tous les champs
4. Enregistrer

Les pages publiques chargeront automatiquement le contenu dans la langue de l'URL (`/en/`, `/es/`, etc.).

## Migration des pages existantes

### Étapes pour migrer une page

1. **Créer le contenu par défaut** dans Firestore (via script ou dashboard)
2. **Modifier le composant page** pour charger depuis Firestore
3. **Tester** que tout s'affiche correctement
4. **Supprimer** l'ancien contenu hardcodé

### Exemple de migration

**Avant (contenu hardcodé) :**

```tsx
export default function MariagesPage() {
  return (
    <main>
      <h1>Mariages d'Exception</h1>
      <p>Texte hardcodé...</p>
    </main>
  );
}
```

**Après (contenu depuis Firestore) :**

```tsx
import { getPageContent } from '@/lib/firestore';

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
      
      {content.sections.map(section => (
        <Section key={section.id} {...section} />
      ))}
    </main>
  );
}
```

## TODO / Améliorations futures

- [ ] Ajouter un éditeur WYSIWYG (TipTap, Quill) pour remplacer le HTML brut
- [ ] Prévisualisation en temps réel des modifications
- [ ] Upload d'images directement depuis l'éditeur
- [ ] Historique des versions avec possibilité de revenir en arrière
- [ ] Comparaison de versions (diff)
- [ ] Workflow de validation (brouillon → publié)
- [ ] Gestion des médias (images, vidéos) intégrée
- [ ] Export/Import de contenus au format JSON

## Support

Pour toute question ou problème :
- Consulter la documentation : `docs/`
- Vérifier les logs Firestore : `firebase functions:log`
- Contacter le développeur
