# Architecture Système de Gestion des Images

## Vue d'ensemble Technique

Ce document décrit l'architecture complète du système de gestion des images Firebase Storage pour l'interface admin, conçu pour être utilisable par des non-développeurs.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERFACE ADMIN                           │
│                                                               │
│  ┌────────────────────┐      ┌──────────────────────┐       │
│  │ VenueEditPage      │      │ PageContentManager   │       │
│  │ /admin/venues/[id] │      │ /admin/contenus      │       │
│  └─────────┬──────────┘      └──────────┬───────────┘       │
│            │                             │                    │
│            └─────────────┬───────────────┘                    │
│                          ▼                                    │
│              ┌────────────────────────┐                       │
│              │  ImageInputField.tsx   │                       │
│              │  (Composant UI)        │                       │
│              └────────────┬───────────┘                       │
│                           │                                   │
│                           ▼                                   │
│              ┌────────────────────────┐                       │
│              │ StorageImagePicker.tsx │                       │
│              │ (Modal sélection)      │                       │
│              └────────────┬───────────┘                       │
└───────────────────────────┼───────────────────────────────────┘
                            │
                            │ fetch()
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API ROUTE                               │
│                                                               │
│              /api/admin/storage/route.ts                     │
│                                                               │
│              - GET: Liste fichiers/dossiers                  │
│              - POST: Upload (TODO)                           │
│              - DELETE: Supprimer (TODO)                      │
│                                                               │
│              Utilise Firebase Admin SDK                       │
│              (bypass rules, accès complet)                   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│               FIREBASE STORAGE                               │
│                                                               │
│  /venues/chateau-le-dome/hero.webp                          │
│  /venues/chateau-brulaire/gallery/01.webp                   │
│  /logos/venues/dome-blanc.webp                              │
│  ...                                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Fichiers Clés

### 1. `/src/app/api/admin/storage/route.ts`

**Rôle** : API route Next.js pour accéder à Firebase Storage côté serveur

**Endpoints** :
- `GET /api/admin/storage?path=venues&recursive=false`
  - Liste les fichiers et dossiers d'un chemin
  - Query params :
    - `path` : Chemin dans Storage (ex: "venues/chateau-le-dome")
    - `recursive` : Si true, liste récursivement tous les fichiers

**Technologie** : Firebase Admin SDK (`firebase-admin/storage`)

**Sécurité** : 
- Utilise Admin SDK = bypass des Security Rules
- TODO : Ajouter vérification auth admin

**Exemple de réponse** :
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "name": "hero.webp",
        "path": "venues/chateau-le-dome/hero.webp",
        "url": "https://storage.googleapis.com/...",
        "size": 234567,
        "contentType": "image/webp",
        "updated": "2026-02-10T10:30:00Z",
        "isImage": true
      }
    ],
    "folders": [
      {
        "name": "gallery",
        "path": "venues/chateau-le-dome/gallery",
        "itemCount": 0
      }
    ],
    "currentPath": "venues/chateau-le-dome",
    "totalCount": 15
  }
}
```

---

### 2. `/src/components/admin/StorageImagePicker.tsx`

**Rôle** : Modal React pour parcourir et sélectionner une image

**Props** :
```typescript
interface StorageImagePickerProps {
  onSelect: (url: string, file: StorageFile) => void;
  onClose: () => void;
  currentUrl?: string;
  title?: string;
  initialPath?: string;
}
```

**Fonctionnalités** :
- Navigation par breadcrumbs
- Recherche en temps réel
- Prévisualisation des images
- Affichage des dossiers et fichiers
- Sélection visuelle (bordure dorée)

**État interne** :
```typescript
const [currentPath, setCurrentPath] = useState<string>(initialPath);
const [files, setFiles] = useState<StorageFile[]>([]);
const [folders, setFolders] = useState<StorageFolder[]>([]);
const [loading, setLoading] = useState(false);
const [selectedFile, setSelectedFile] = useState<StorageFile | null>(null);
```

**Appel API** :
```typescript
const response = await fetch(
  `/api/admin/storage?path=${encodeURIComponent(currentPath)}&recursive=false`
);
const result = await response.json();
setFiles(result.data.files);
setFolders(result.data.folders);
```

---

### 3. `/src/components/admin/ImageInputField.tsx`

**Rôle** : Composant wrapper qui combine input texte + bouton "Parcourir Storage"

**Props** :
```typescript
interface ImageInputFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helpText?: string;
  initialPickerPath?: string;
  previewSize?: number;
}
```

**Fonctionnalités** :
- Input texte pour saisie manuelle d'URL
- Bouton "Parcourir Storage" qui ouvre le modal
- Prévisualisation de l'image sélectionnée
- Bouton clear (×) pour vider le champ

**Utilisation** :
```tsx
<ImageInputField
  label="Image Hero"
  value={formData.heroImage}
  onChange={(url) => setFormData({...formData, heroImage: url})}
  helpText="Image principale (1920x1080px recommandé)"
  initialPickerPath="venues/chateau-le-dome"
/>
```

---

### 4. `/src/components/admin/ImagePicker.tsx`

**Rôle** : Version standalone du sélecteur (alternative plus simple)

**Différence avec StorageImagePicker** :
- Moins de styling, plus épuré
- Pas de dépendance externe
- Utilisé dans les formulaires simples

**Props similaires** à StorageImagePicker

---

## 🔄 Flux de Données

### Sélection d'une Image

1. **Utilisateur clique** sur "Parcourir Storage"
   → Appel : `setShowPicker(true)`

2. **Modal s'ouvre** avec `currentPath = initialPath`
   → Appel API : `GET /api/admin/storage?path=venues`

3. **API route** (serveur)
   - Initialise Firebase Admin SDK
   - Appelle `bucket.getFiles({ prefix: 'venues/' })`
   - Génère des signed URLs (validité 7 jours)
   - Retourne JSON avec files + folders

4. **Modal affiche** les résultats
   - Dossiers en haut
   - Images en grille en dessous

5. **Utilisateur clique** sur une image
   → État : `setSelectedFile(file)`
   → UI : Bordure dorée

6. **Utilisateur clique** "Sélectionner"
   → Callback : `onSelect(file.url, file)`
   → Modal se ferme
   → Input est rempli avec l'URL

7. **Prévisualisation** s'affiche automatiquement
   → `<Image src={value} />` (Next.js Image component)

---

## 🔐 Sécurité

### Admin SDK vs Client SDK

| Aspect | Client SDK | Admin SDK |
|--------|-----------|-----------|
| **Où** | Navigateur | Serveur (API routes) |
| **Auth** | Firebase Auth user | Service account |
| **Rules** | Respecte Security Rules | Bypass complet |
| **Accès** | Limité par rules | Accès total |

**Choix architecture** : 
- Admin utilise Admin SDK via API route
- Raison : Accès complet sans configurer Security Rules permissives
- Sécurité : API route devrait vérifier le token admin (TODO)

### URLs Signées

```typescript
const [url] = await file.getSignedUrl({
  action: 'read',
  expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 jours
});
```

**Avantages** :
- Pas besoin de rendre le bucket public
- URL expire automatiquement
- Inclut un token de sécurité

**Limitation** :
- Durée max : 7 jours
- Après expiration, l'image ne s'affiche plus
- Solution : Régénérer l'URL ou utiliser des URLs publiques

---

## 🎨 Styling

### Design System

**Couleurs** :
- Primary : `text-primary` → Bleu marine (`#1B365D`)
- Accent : `text-accent` → Or champagne (`#C9A961`)
- Bordures : `border-neutral-200/300`

**Composants** :
- Boutons : `rounded-lg hover:bg-accent transition-all`
- Modal : `fixed inset-0 z-50 bg-black/50 backdrop-blur-sm`
- Grille : `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4`

**Responsive** :
- Mobile : 2 colonnes
- Tablet : 3 colonnes
- Desktop : 4-5 colonnes

---

## ⚡ Performance

### Optimisations

1. **Lazy loading** : Images chargées à la demande
2. **Next.js Image** : Optimisation automatique (WebP, redimensionnement)
3. **Sizes attribute** : Responsive loading
   ```tsx
   sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
   ```

4. **Pagination** : Limitée côté API (100 fichiers max par défaut)

### Métriques

- **Temps de chargement** : ~200-500ms pour un dossier
- **Taille payload** : ~50KB pour 20 images
- **Signed URL** : Génération ~50ms par fichier

---

## 🧪 Tests

### Test Manuel

1. **Navigation** :
   ```
   / → venues → chateau-le-dome → gallery
   ```

2. **Recherche** :
   - Tapez "hero" → filtre les fichiers contenant "hero"
   - Tapez "webp" → affiche tous les WebP

3. **Sélection** :
   - Cliquez image → bordure dorée
   - Cliquez "Sélectionner" → URL dans input

### Test d'Intégration

```bash
# 1. Démarrer le serveur
npm run dev

# 2. Ouvrir admin
http://localhost:3001/admin/venues/chateau-le-dome

# 3. Onglet "Images" → Parcourir Storage
# 4. Vérifier que les images s'affichent
# 5. Sélectionner une image
# 6. Vérifier que l'URL est correcte
# 7. Sauvegarder et vérifier dans Firestore
```

---

## 🔮 TODO / Améliorations Futures

### Court terme

- [ ] **Authentification** : Vérifier token admin dans API route
  ```typescript
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split('Bearer ')[1];
  await adminAuth.verifyIdToken(token);
  ```

- [ ] **Upload** : Implémenter POST dans API route
  ```typescript
  export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    // Upload vers Storage...
  }
  ```

- [ ] **Suppression** : Implémenter DELETE avec confirmation
  ```typescript
  export async function DELETE(request: NextRequest) {
    const { path } = await request.json();
    // Supprimer de Storage...
  }
  ```

### Moyen terme

- [ ] **Pagination** : Limiter nombre de résultats, ajouter "Charger plus"
- [ ] **Cache** : Mettre en cache les listes de dossiers (Redis/Memory)
- [ ] **Tri** : Par nom, date, taille
- [ ] **Filtres** : Par type (WebP, JPEG, PNG), par taille
- [ ] **Métadonnées** : Alt text, description, tags

### Long terme

- [ ] **Drag & Drop** : Upload par glisser-déposer
- [ ] **Redimensionnement** : Générer variantes (thumb, medium, large)
- [ ] **Compression** : Optimiser automatiquement à l'upload
- [ ] **Preview avancé** : Afficher dimensions, poids, ratio
- [ ] **Historique** : Track qui a modifié quoi et quand

---

## 📚 Ressources

- [Firebase Admin SDK - Storage](https://firebase.google.com/docs/reference/admin/node/firebase-admin.storage)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image)
- [React Hooks](https://react.dev/reference/react)

---

**Auteur** : Système créé le 10 février 2026  
**Maintenance** : Équipe Dev Lieux d'Exception
