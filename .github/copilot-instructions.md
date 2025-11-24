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
- **INTERDICTION TOTALE** : Ne JAMAIS utiliser d'emojis dans les pages publiques (home, catalogue, lieux, mariages, etc.)
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

**Next.js 15** (App Router + Turbopack) + **TypeScript** + **Tailwind CSS v4** + **Firebase** (Firestore + Auth)

### Structure Critique

```
src/
├── app/                      # Pages Next.js avec App Router
│   ├── globals.css          # Tailwind v4 @theme config + variables CSS
│   └── [route]/page.tsx     # Server Components par défaut
├── components/
│   └── ui/Icon.tsx          # Composant icônes (remplace emojis)
├── lib/
│   ├── firebase.ts          # Config Firebase (1 instance partagée)
│   ├── firestore.ts         # Services CRUD Firestore (tous typés)
│   ├── validation.ts        # Schémas Zod + helpers sanitization
│   └── security.ts          # Hash, tokens, rate limiting
├── types/
│   └── firebase.ts          # Interfaces Venue, Lead, Analytics
└── middleware.ts            # Headers sécurité + protection admin
```

### Données Firebase (Firestore)
- **Collections** : `venues`, `leads`, `analytics`, `i18n`
- **Base de données** : `lieuxdexception` (région: europe-west1)
- **Accès** : Uniquement via `lib/firestore.ts` (pas d'accès direct depuis composants)

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

// ✅ Utiliser les services typés
import { getVenues, createLead } from '@/lib/firestore';

const venues = await getVenues({ eventType: 'b2b', region: 'pays-de-loire' });
const leadId = await createLead({ type: 'b2b', contactInfo: {...}, eventDetails: {...} });
```

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

// ✅ Icône Lucide avec accessibilité
import Icon from '@/components/ui/Icon';
<div><Icon type="church" size={24} aria-label="Mariage" /> Mariage</div>
```

### 5. Styles Tailwind v4

```tsx
// Variables CSS définies dans app/globals.css @theme
<div className="bg-primary text-white">  {/* var(--color-primary) */}
  <div className="section-container">   {/* classe custom définie */}
    <button className="btn-primary">    {/* classe custom définie */}
```

## Workflows Critiques

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
- `docs/migration-emojis-to-icons.md` : Mapping emojis → icônes Lucide
- `types/firebase.ts` : Toutes les interfaces de données Firestore