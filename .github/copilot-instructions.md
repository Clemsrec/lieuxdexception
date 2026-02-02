# Instructions Copilot pour Lieux d'Exception

## Règles Fondamentales ⚠️

### Langue et Documentation
- **Tout en français** : Code, commentaires, documentation, messages d'erreur
- **JSDoc obligatoire** : Chaque fonction/composant doit avoir sa documentation
- **Expliquer le "pourquoi"** : Les commentaires expliquent les décisions, pas juste ce que fait le code
- **Maintenir la doc à jour** : Mettre à jour les commentaires lors des modifications

### Interface Utilisateur 🎨
- **ZÉRO ICÔNE dans l'interface** : Bannir complètement TOUTES les icônes du site (JSX, templates, textes UI)
- **❌ Icon.tsx SUPPRIMÉ** : Ne JAMAIS utiliser `<Icon type="..." />` ou importer de bibliothèque d'icônes
- **Typographie luxe uniquement** : Utiliser symboles Unicode (★ ● ◆ ✦ → •), chiffres romains (I, II, III), numérotation (01, 02, 03)
- **Lignes décoratives** : `<div className="w-20 h-px bg-accent/40" />` pour séparer les sections
- **Accessibilité** : Labels uppercase avec `tracking-wider` pour remplacer icônes visuelles
- **Voir `docs/LUXE-DESIGN-GUIDELINES.md`** pour le design luxe sans icônes

### Layout Dashboard Admin 🎛️
- **Sans header/footer public** : Le dashboard admin ne doit PAS inclure Navigation.tsx ni Footer.tsx
- **Header indépendant** : Créer un header admin distinct dans le layout du dashboard
- **Layout dédié** : Utiliser `app/admin/layout.tsx` pour wrapper toutes les pages admin
- **Navigation admin** : Sidebar ou top nav spécifique au dashboard (liens admin uniquement)

### Emojis - Règle Stricte 🚫
- **INTERDICTION TOTALE** : Ne JAMAIS utiliser d'émojis dans les pages publiques (home, lieux, mariages, etc.)
- **INTERDICTION DASHBOARD** : Ne JAMAIS utiliser d'emojis dans l'interface admin/dashboard
- **EXCEPTION UNIQUE** : Emojis autorisés UNIQUEMENT pour les notifications/alertes système (⚠️ ❌ ✅ 🚫)
  - Messages d'erreur : `❌ Erreur de connexion`
  - Alertes : `⚠️ Attention, trop de tentatives`
  - Succès : `✅ Enregistré avec succès`
  - Bloqué : `🚫 Accès refusé`
- **PRÉFÉRER LUCIDE ICONS** : Pour toute icône fonctionnelle, utiliser la bibliothèque Lucide React
  ```tsx
  import { AlertTriangle, CheckCircle, XCircle, Lock } from 'lucide-react';
  <AlertTriangle className="w-5 h-5 text-yellow-500" />
  ```
- **Design luxe** : Les emojis cassent l'esthétique haut de gamme du site

### Responsive Design 📱
- **TOUJOURS VÉRIFIER** : Chaque composant/page DOIT être responsive avant commit
- **Mobile-First obligatoire** : Partir du mobile (375px) puis adapter tablet/desktop
- **Touch Targets (WCAG AA)** :
  - Minimum **48px × 48px** sur mobile pour tous les boutons/liens
  - Minimum **44px × 44px** sur desktop
  - Classe `.btn` intègre déjà `min-height: 48px` mobile, `44px` desktop
- **Breakpoints standardisés** :
  - `sm: 640px` (phablet/petit tablet)
  - `md: 768px` (tablet portrait)
  - `lg: 1024px` (tablet landscape/petit desktop)
  - `xl: 1280px` (desktop standard)
  - `2xl: 1536px` (grand écran)
- **Grilles fluides** : Toujours mobile→desktop (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`)
- **Gap responsive** : `gap-4 md:gap-6 lg:gap-8` (espacement progressif)
- **Typographie fluide** : Utiliser `clamp()` ou classes responsive (`text-2xl md:text-3xl lg:text-4xl`)
- **Images** : Toujours ajouter `sizes` attribute pour responsive loading
  ```tsx
  <Image sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
  ```
- **Test requis** : Vérifier visuellement sur 375px, 768px, 1024px, 1440px avant push

### Qualité du Code
- **JAMAIS INVENTER DE DONNÉES** : Ni fausses données, ni faux texte, ni contenu placeholder
  - Si donnée manquante → Demander au client ou laisser vide avec TODO
  - Si texte manquant → Ne pas générer de lorem ipsum ou texte fictif
  - Si image manquante → Utiliser placeholder avec TODO explicite
- **Données réelles uniquement** : Pas de mocks, utiliser Firebase/Firestore
- **Pas de solutions temporaires** : Implémenter directement la version définitive
- **Validation Zod stricte** : Tous les inputs utilisateur passent par `lib/validation.ts`
- **TypeScript strict** : Pas de `any`, typage complet avec types de `types/firebase.ts`

## Architecture et Stack

**Next.js 15** (App Router + Turbopack) + **TypeScript** + **Tailwind CSS v4** + **Firebase** (Firestore + Auth + FCM)

### Structure Critique

```
src/
├── app/                      # Pages Next.js avec App Router
│   ├── globals.css          # Tailwind v4 @theme config + variables CSS
│   ├── layout.tsx           # Layout racine (Footer, CookieBanner, ServiceWorker)
│   ├── page.tsx             # Homepage (Server Component)
│   ├── admin/               # Dashboard admin (layout dédié, pas de Nav/Footer public)
│   ├── mariages/            # Page dédiée mariages
│   ├── evenements-b2b/      # Page dédiée B2B
│   ├── evenements-b2b/      # Page dédiée B2B
│   ├── mariages/            # Page dédiée mariages
│   ├── lieux/[slug]/        # Pages dynamiques par lieu
│   └── api/                 # API routes (rate-limited, validées Zod)
├── components/
│   ├── Navigation.tsx       # Nav principale (states actifs)
│   ├── ContactFormSwitcher.tsx # Formulaires adaptatifs B2B/Mariage
│   ├── admin/               # Composants dashboard
│   ├── seo/                 # SEO components (metadata, structured data)
│   └── ui/                  # Composants réutilisables (PAS d'Icon.tsx !)
├── lib/
│   ├── firebase.ts          # Config Firebase Client SDK (auto-detect émulateur)
│   ├── firebase-admin.ts    # Firebase Admin SDK (bypass rules, server-only)
│   ├── firestore.ts         # Services CRUD via Admin SDK (tous typés)
│   ├── validation.ts        # Schémas Zod + helpers sanitization
│   ├── security.ts          # Hash, tokens, rate limiting in-memory (dev)
│   ├── rate-limit.ts        # Upstash Redis rate limiting (prod)
│   ├── auth.ts              # Auth helpers (login, logout, session)
│   └── fcm.ts               # Firebase Cloud Messaging (notifications)
├── types/
│   └── firebase.ts          # Interfaces Venue, Lead, Analytics (types complets)
├── middleware.ts            # Headers sécurité + protection admin + CSP
└── scripts/                 # Scripts utilitaires (voir section Scripts Essentiels)
```

### Données Firebase (Firestore)
- **Collections** : `venues`, `leads`, `analytics`, `i18n`, `users`
- **Projet** : `lieux-d-exceptions` (ID: 886228169873)
- **Base de données** : `lieuxdexception` (région: europe-west1)
- **Accès** : Uniquement via `lib/firestore.ts` (pas d'accès direct depuis composants)
- **Admin SDK** : Server-only dans `lib/firebase-admin.ts` (bypass rules Firestore)

### Client vs Server Components
- **Par défaut** : Server Component (pas de "use client")
- **Client Component nécessaire si** :
  - Hooks React (useState, useEffect, useContext)
  - Event handlers (onClick, onChange)
  - Browser APIs (localStorage, window)
  - Composants interactifs (formulaires, modals, carousels)
- **Exemple** : `page.tsx` Server → charge données → passe à `<ClientComponent />` pour interactivité

## Patterns Essentiels

### 1. Composants Next.js

```typescript
// Server Component par défaut (pas de "use client")
export default async function VenuePage({ params }: { params: { id: string } }) {
  const venue = await getVenueById(params.id);
  return <VenueDetails venue={venue} />;
}

// Client Component seulement si hooks/interactivité
'use client';
export default function ContactForm() {
  const [data, setData] = useState<B2BForm>({});
  // ...
}
```

### 2. Accès Firestore (TOUJOURS via lib/firestore.ts)

```typescript
// ❌ JAMAIS d'accès direct dans composants
import { collection, getDocs } from 'firebase/firestore';

// ✅ Utiliser les services typés (Admin SDK côté serveur)
import { getVenues, createLead } from '@/lib/firestore';

// Dans Server Component (page.tsx, layout.tsx)
const venues = await getVenues({ eventType: 'b2b', region: 'pays-de-loire' });

// Dans API route
const leadId = await createLead({ type: 'b2b', contactInfo: {...}, eventDetails: {...} });
```

**IMPORTANT** : 
- `lib/firestore.ts` utilise **Admin SDK** (`firebase-admin`) = bypass rules, server-only
- `lib/firebase.ts` = Client SDK pour auth navigateur uniquement
- Jamais d'import `firebase/firestore` dans composants → toujours passer par services

### 3. Validation Zod (OBLIGATOIRE pour formulaires)

```typescript
import { b2bFormSchema, validateData } from '@/lib/validation';

// Dans un API route
const result = validateData(b2bFormSchema, await request.json());
if (!result.success) {
  return Response.json({ errors: result.errors }, { status: 400 });
}
const { data } = result; // data est typé automatiquement
```

### 4. Icônes (remplacement emojis)

```tsx
// ❌ Pas d'emoji dans JSX
<div>💒 Mariage</div>

// ✅ Lucide Icons pour fonctionnalités (notifications, admin)
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
<AlertTriangle className="w-5 h-5 text-yellow-500" aria-label="Attention" />

// ✅ Typographie luxe pour interface publique
<div className="text-accent text-2xl">★</div>  {/* Symbole unicode */}
<div className="font-display text-accent">I</div>  {/* Chiffre romain */}
<div className="w-20 h-px bg-accent/40" />  {/* Ligne décorative */}
```

### 5. Styles Tailwind v4

```tsx
// Variables CSS définies dans app/globals.css @theme
<div className="bg-primary text-white">  {/* var(--color-primary) */}
  <div className="section-container">   {/* classe custom définie */}
    <button className="btn-primary">    {/* classe custom définie */}
```

## Workflows Critiques

### Scripts Essentiels

```bash
# Gestion des lieux (venues)
node scripts/import-venues.js           # Importer lieux depuis JSON
node scripts/activate-venues.js         # Activer/désactiver lieux
node scripts/check-venues.js            # Vérifier données lieux
node scripts/update-venue-urls.js       # Mettre à jour slugs/URLs

# Gestion admin
./scripts/create-admin.sh               # Créer compte admin
npx tsx scripts/set-admin-claims.ts grant <email>  # Donner droits admin

# Images et médias
node scripts/optimize-images.js         # Optimiser images lieux
node scripts/check-dome-images.js       # Vérifier images Château Le Dôme

# Sécurité et secrets
./scripts/setup-secrets.sh              # Configurer secrets Google Cloud
./scripts/test-security.sh              # Tester headers sécurité

# Tests et validation
node scripts/check-filters-data.js      # Vérifier données filtres
./scripts/test-fcm-notification.sh      # Tester notifications FCM
```

### Développement Local

```bash
# Démarrage avec Turbopack (ultra rapide)
npm run dev

# Tests Firestore avec émulateur (optionnel)
firebase emulators:start --only firestore
# → App détecte automatiquement l'émulateur sur localhost:8080
```

### Déploiement Production

```bash
# 1. Build local (vérifier que ça compile)
npm run build

# 2. Déployer Firestore Rules AVANT l'app
firebase deploy --only firestore:rules

# 3. Déployer l'application
firebase deploy --only hosting
# OU via GitHub push → CI/CD automatique

# 4. Vérifier les secrets Google Cloud
./scripts/setup-secrets.sh  # Configure les secrets automatiquement
```

**Secrets Management** : Utilise Google Cloud Secret Manager (voir `docs/DEPLOYMENT.md`)
- API keys, service account keys stockés dans Secret Manager
- `apphosting.yaml` référence les secrets de manière sécurisée
- **Jamais** de secrets dans `.env.local` committé (fichier dans `.gitignore`)

### Ajouter une Nouvelle Collection Firestore

1. **Définir l'interface** dans `types/firebase.ts` :
```typescript
export interface NewCollection {
  id: string;
  field: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

2. **Créer services** dans `lib/firestore.ts` :
```typescript
const newCollection = collection(db, 'newCollection');

export async function getNewItems(): Promise<NewCollection[]> {
  const snapshot = await getDocs(query(newCollection));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewCollection));
}
```

3. **Mettre à jour** `firestore.rules` :
```javascript
match /newCollection/{docId} {
  allow read: if true;
  allow write: if request.auth.token.admin == true;
}
```

4. **Déployer** : `firebase deploy --only firestore:rules`

## Sécurité et Validation

### Headers HTTP (middleware.ts)
Le middleware applique automatiquement des headers de sécurité :
- **CSP** : Bloque scripts inline, limite les sources de contenu
- **HSTS** : Force HTTPS en production (max-age 1 an)
- **X-Frame-Options** : DENY (anti-clickjacking)
- **Permissions-Policy** : Désactive caméra/micro/géolocation

### Routes Protégées
```typescript
// Middleware protège automatiquement :
PROTECTED_ROUTES = ['/admin']
PROTECTED_API_ROUTES = ['/api/admin', '/api/venues/create', '/api/venues/update']

// Vérifier auth :
const authToken = request.cookies.get('auth-token');
// TODO: Implémenter vérification JWT quand auth est ready
```

### Validation Stricte
```typescript
// Tous les formulaires DOIVENT utiliser Zod
import { validateData, sanitizeString } from '@/lib/validation';
Responsive & Accessibilité
- **VÉRIFICATION OBLIGATOIRE** : Avant chaque commit, valider le responsive mobile/tablet/desktop
- **Touch targets** : Minimum 48px mobile, 44px desktop (WCAG AA)
- **Grilles fluides** : Toujours `grid-cols-1` mobile puis `sm:`, `md:`, `lg:` pour adapter
- **Espacement progressif** : `gap-4 md:gap-6 lg:gap-8`, `p-4 md:p-6 lg:p-8`
- **Typographie fluide** : `text-xl md:text-2xl lg:text-3xl` ou `clamp(1rem, 2vw, 1.5rem)`
- **Images sizes** : Toujours spécifier pour Next.js Image optimization
- **Test visuel requis** : 375px, 768px, 1024px, 1440px minimum

### 
// API route pattern :
const body = await request.json();
const result = validateData(b2bFormSchema, body);
if (!result.success) {
  return Response.json({ errors: result.errors }, { status: 400 });
}
// result.data est typé et validé ✅
```

### Rate Limiting
```typescript
// Production : Utiliser Upstash Redis (voir docs/SECURITY.md)
// Dev : Rate limiting en mémoire (lib/security.ts)
const ip = request.headers.get('x-forwarded-for') || 'unknown';
if (isRateLimited(ip, { maxRequests: 5, windowSeconds: 60 })) {
  return Response.json({ error: 'Trop de requêtes' }, { status: 429 });
}
```

## Points Critiques à Retenir

### Performance
- **Turbopack** : Dev ultra-rapide, pas besoin de webpack config
- **Server Components** : Par défaut, ajouter 'use client' seulement si nécessaire
- **Lazy loading** : Images optimisées automatiquement par Next.js
- **Bundle size** : Tree-shaking automatique pour Lucide icons

### Firebase Spécifique
- **Une seule instance** : `getApps().length === 0` évite double init (voir `lib/firebase.ts`)
- **Émulateur auto-detect** : En dev, connecte automatiquement à localhost:8080 si disponible
- **Timestamps** : Toujours utiliser `Timestamp.now()` de Firestore, jamais `new Date()`
- **Transactions** : Utiliser transactions Firestore pour opérations critiques (éviter race conditions)

### Tailwind CSS v4
- **Pas de tailwind.config.js** : Configuration via `@theme` dans `globals.css`
- **Variables CSS** : `var(--primary)`, `var(--background)` définies dans `:root`
- **Classes custom** : `.btn-primary`, `.venue-card`, `.section-container` déjà définies
- **Dark mode** : Auto via `@media (prefers-color-scheme: dark)`
- **Design tokens** : Palette complète dans `@theme` (primary, accent, charcoal, stone, neutral)

### Next.js 15 Spécifique
- **Output mode** : `standalone` pour Firebase App Hosting (voir `next.config.js`)
- **App Router** : Routes dans `app/`, pas de `pages/`
- **Metadata** : Utiliser `export const metadata: Metadata` dans page.tsx
- **Server Actions** : Pas encore implémenté (utiliser API routes)
- **Image Optimization** : Remote patterns pour Firebase Storage configurés

### Debugging
```bash
# Voir les logs Firebase en temps réel
firebase functions:log --only hosting

# Tester les règles Firestore localement
firebase emulators:start --only firestore
# Puis tester avec UI : http://localhost:4000

# Vérifier les headers de sécurité
curl -I http://localhost:3002 | grep -i "content-security\|x-frame"
```

### Documentation Essentielle
- `docs/DEPLOYMENT.md` : Déploiement + secrets Google Cloud
- `docs/SECURITY.md` : Sécurité + Firestore Rules + Rate limiting
- `docs/DESIGN-SYSTEM-CHEATSHEET.md` : Guide rapide design system (patterns, classes, exemples)
- `docs/AUDIT-DESIGN-SYSTEM.md` : Audit complet conformité composants
- `docs/LUXE-DESIGN-GUIDELINES.md` : Principes design luxe sans icônes
- `docs/MIGRATION-CSS-RESUME.md` : Historique migration CSS v2.0
- `types/firebase.ts` : Toutes les interfaces de données Firestore