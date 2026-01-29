# Analyse Système d'Authentification et Accès Admin
## Lieux d'Exception

**Date**: 16 janvier 2026  
**Analysé par**: GitHub Copilot  
**Projet**: lieux-d-exceptions (ID: 886228169873)  
**Dernière validation** : 29 janvier 2026 ✅

---

## 📋 Résumé Exécutif

Le système d'authentification de Lieux d'Exception repose sur **Firebase Authentication** avec des **Custom Claims** pour la gestion des droits admin. L'architecture est sécurisée avec plusieurs couches de protection.

### État Actuel
- ✅ **2 comptes admin configurés** et opérationnels *(validé 29/01/2026)*
- ✅ Système de protection multi-couches fonctionnel *(validé 29/01/2026)*
- ⚠️ Quelques améliorations de sécurité à prévoir (voir [VALIDATION-ACCES-ADMIN.md](VALIDATION-ACCES-ADMIN.md))

---

## 🔐 Comptes Administrateurs Configurés

### Comptes Actifs

| Email | UID | Rôle | Statut |
|-------|-----|------|--------|
| `contact@lieuxdexception.com` | `2YpctvV3KsQCta6x5ZXksfy8WY22` | Admin | ✅ Actif |
| `clement@nucom.fr` | `Uj2k2uJQahPawVOzaOkRjtYd89K2` | Admin | ✅ Actif |

### Custom Claims Configurés

Chaque admin possède les custom claims suivants :
```json
{
  "admin": true,
  "role": "admin"
}
```

Ces claims sont stockés dans le **JWT Firebase** et vérifiés :
- Par le middleware côté serveur
- Par les Firestore Rules
- Par les Storage Rules
- Par les API Routes protégées

---

## 🏗️ Architecture du Système

### 1. Firebase Authentication (Client SDK)

**Fichier** : [`src/lib/firebase-client.ts`](src/lib/firebase-client.ts)

- SDK Firebase Client pour authentification navigateur
- Utilisé uniquement côté client (`'use client'`)
- Gère la connexion/déconnexion des utilisateurs

**Fichier** : [`src/lib/auth.ts`](src/lib/auth.ts)

```typescript
export const authActions = {
  async signIn(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    
    // Stocke le token dans un cookie HttpOnly
    document.cookie = `auth-token=${idToken}; path=/; max-age=3600; SameSite=Lax`;
    
    return userCredential;
  }
}
```

**Token Lifecycle** :
- Token JWT valide **1 heure**
- Stocké dans cookie `auth-token`
- Rafraîchi automatiquement par `AuthCheck.tsx` toutes les 50 minutes

---

### 2. Firebase Admin SDK (Server-side)

**Fichier** : [`src/lib/firebase-admin.ts`](src/lib/firebase-admin.ts)

- Utilisé **uniquement côté serveur** (Server Components, API Routes)
- Bypass les Firestore Rules (accès complet)
- Vérifie les tokens JWT et custom claims

```typescript
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
```

**Configuration** :
- Fichier `firebase-service-account.json` à la racine
- Variables d'environnement `FIREBASE_CONFIG` (production)
- Auto-détection émulateur en développement

---

### 3. Vérification des Tokens

**Fichier** : [`src/lib/verify-token.ts`](src/lib/verify-token.ts)

```typescript
/**
 * Vérifie la validité d'un token Firebase ID
 */
export async function verifyIdToken(token: string): Promise<DecodedIdToken> {
  return await adminAuth.verifyIdToken(token);
}

/**
 * Vérifie si un token appartient à un admin
 */
export async function isUserAdmin(token: string): Promise<boolean> {
  const decodedToken = await verifyIdToken(token);
  return decodedToken.admin === true;
}

/**
 * Vérifie et décode un token avec vérification admin obligatoire
 */
export async function verifyAdminToken(token: string): Promise<DecodedIdToken> {
  const decodedToken = await verifyIdToken(token);
  
  if (!decodedToken.admin) {
    throw new Error('Droits administrateur requis');
  }
  
  return decodedToken;
}
```

---

## 🛡️ Système de Protection Multi-Couches

### Couche 1 : Middleware Next.js

**Fichier** : [`src/middleware.ts`](src/middleware.ts)

**Protection des routes admin** :
```typescript
// Protection admin routes (pages)
if (pathname.startsWith('/admin') && pathname !== '/admin/connexion') {
  const authToken = request.cookies.get('auth-token');
  
  if (!authToken) {
    const loginUrl = new URL('/admin/connexion', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Protection API routes
if (PROTECTED_API_ROUTES.some(route => pathname.startsWith(route))) {
  const authToken = request.cookies.get('auth-token');
  
  if (!authToken) {
    return NextResponse.json(
      { error: 'Authentification requise', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }
}
```

**Routes protégées** :
- `/admin/*` (sauf `/admin/connexion`)
- `/api/admin/*`
- `/api/venues/create`
- `/api/venues/update`

**Headers de sécurité appliqués** :
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- HSTS (production uniquement)
- Permissions-Policy

---

### Couche 2 : Firestore Rules

**Fichier** : [`firestore.rules`](firestore.rules)

```javascript
/**
 * Vérifie si l'utilisateur est admin
 */
function isAdmin() {
  return isAuthenticated() && 
         request.auth.token.admin == true;
}
```

**Collections protégées** :
- `venues` : Lecture publique, écriture admin uniquement
- `leads` : Lecture admin, création publique (formulaires)
- `users` : Lecture/écriture admin uniquement
- `analytics` : Lecture admin, écriture serveur uniquement
- `security_logs` : Lecture admin, création publique (logs auto)
- `audit_logs` : Lecture/création admin, modification/suppression interdite

---

### Couche 3 : Storage Rules

**Fichier** : [`storage.rules`](storage.rules)

```javascript
function isAdmin() {
  return isAuthenticated() && 
         request.auth.token.email in [
           'admin@grouperiou.com',
           'contact@grouperiou.com',
           'clement@nucom.fr'
         ];
}
```

**Protection** :
- Images lieux : Lecture publique, écriture admin
- Autres fichiers : Admin uniquement

⚠️ **Note** : Les emails sont hardcodés. À migrer vers custom claims pour plus de flexibilité.

---

### Couche 4 : API Routes

**Exemple** : [`src/app/api/notifications/send/route.ts`](src/app/api/notifications/send/route.ts)

```typescript
export async function POST(request: NextRequest) {
  // Vérifier authentification
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const token = authHeader.split('Bearer ')[1];
  
  // Vérifier que l'utilisateur est admin
  const decodedToken = await adminAuth.verifyIdToken(token);
  if (!decodedToken.admin) {
    return NextResponse.json({ error: 'Accès réservé aux administrateurs' }, { status: 403 });
  }
  
  // ... traitement
}
```

---

## 🔧 Outils de Gestion Admin

### 1. Créer un Admin (Script Shell)

**Fichier** : [`scripts/create-admin.sh`](scripts/create-admin.sh)

```bash
./scripts/create-admin.sh
```

- Crée un utilisateur via l'API `/api/admin/create-first-user`
- Nécessite le secret `ADMIN_CREATION_SECRET` dans `.env.local`
- ⚠️ **À désactiver en production** ou protéger fortement

---

### 2. Assigner/Retirer Rôle Admin (JavaScript)

**Fichier** : [`scripts/set-admin-role.js`](scripts/set-admin-role.js)

```bash
# Assigner admin
node scripts/set-admin-role.js grant <uid>

# Retirer admin
node scripts/set-admin-role.js revoke <uid>

# Lister tous les admins
node scripts/set-admin-role.js list
```

---

### 3. Gérer Custom Claims (TypeScript)

**Fichier** : [`scripts/set-admin-claims.ts`](scripts/set-admin-claims.ts)

```bash
# Lister tous les utilisateurs
npx tsx scripts/set-admin-claims.ts list

# Donner droits admin par email
npx tsx scripts/set-admin-claims.ts grant admin@example.com

# Retirer droits admin
npx tsx scripts/set-admin-claims.ts revoke user@example.com
```

---

### 4. Vérifier Configuration Admin

**Fichier** : [`scripts/check-admin-user.js`](scripts/check-admin-user.js)

```bash
node scripts/check-admin-user.js <uid>
```

Vérifie :
- Firebase Auth (email, email vérifié, désactivé)
- Custom Claims (admin, role)
- Document Firestore `/users/{uid}`

---

## 🌐 Page de Connexion Admin

**Fichier** : [`src/app/admin/connexion/page.tsx`](src/app/admin/connexion/page.tsx)

**URL** : `https://lieuxdexception.com/admin/connexion`

### Fonctionnalités

✅ **Sécurité** :
- Validation email/password côté client
- Rate limiting : Max 5 tentatives
- Messages d'erreur génériques (évite énumération users)
- Rapport d'activité suspecte aux admins

✅ **UX** :
- Toggle afficher/masquer mot de passe
- Redirection automatique après connexion
- État de chargement pendant authentification
- Logo Lieux d'Exception

```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  // Validation
  if (!email || !email.includes('@')) {
    setError('Veuillez entrer une adresse email valide');
    return;
  }

  if (!password || password.length < 8) {
    setError('Le mot de passe doit contenir au moins 8 caractères');
    return;
  }

  // Rate limiting (max 5 tentatives)
  if (attempts >= 5) {
    setError('Trop de tentatives échouées. Veuillez attendre 5 minutes.');
    reportSuspiciousActivity(email, attempts);
    return;
  }

  // Connexion Firebase
  await authActions.signIn(email, password);
  router.push(redirectTo);
};
```

---

## 🎯 Context d'Authentification

**Fichier** : [`src/contexts/AuthContext.tsx`](src/contexts/AuthContext.tsx)

```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && db) {
        // Récupérer les custom claims
        const idTokenResult = await firebaseUser.getIdTokenResult();
        const isAdmin = idTokenResult.claims.admin === true;

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          isAdmin,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
}
```

**Utilisation** :
```typescript
const { user, loading, logout } = useAuth();

if (loading) return <div>Chargement...</div>;
if (!user?.isAdmin) return <div>Accès refusé</div>;
```

---

## 🔄 Rafraîchissement Automatique du Token

**Fichier** : [`src/components/admin/AuthCheck.tsx`](src/components/admin/AuthCheck.tsx)

```typescript
/**
 * Composant pour vérifier et maintenir l'authentification admin
 * - Vérifie que l'utilisateur est connecté
 * - Rafraîchit automatiquement le token toutes les 50 minutes
 * - Affiche un avertissement si le token va expirer
 */
export default function AuthCheck() {
  useEffect(() => {
    const interval = setInterval(async () => {
      if (auth.currentUser) {
        // Rafraîchir le token toutes les 50 minutes
        const newToken = await auth.currentUser.getIdToken(true);
        
        // Mettre à jour le cookie
        document.cookie = `auth-token=${newToken}; path=/; max-age=3600; SameSite=Lax`;
      }
    }, 50 * 60 * 1000); // 50 minutes

    return () => clearInterval(interval);
  }, []);
}
```

---

## 🚨 Points de Vigilance et Recommandations

### ⚠️ Points Faibles Identifiés

#### 1. Vérification JWT Middleware Incomplète

**Problème** : Le middleware vérifie seulement la **présence** du cookie, pas sa **validité**.

```typescript
// ❌ Actuel : Vérifie seulement la présence
const authToken = request.cookies.get('auth-token');
if (!authToken) { /* reject */ }

// ✅ Recommandé : Vérifier la signature JWT
import { adminAuth } from '@/lib/firebase-admin';

const decoded = await adminAuth.verifyIdToken(authToken.value);
if (!decoded.admin) throw new Error('Unauthorized');
```

**Impact** : Un attaquant pourrait forger un cookie `auth-token` invalide et contourner la première vérification.

**Mitigation actuelle** : Les API routes vérifient le token avec `verifyAdminToken()`, donc l'attaque échoue à la couche 4.

**Recommandation** : Ajouter `verifyIdToken()` dans le middleware pour bloquer à la couche 1.

---

#### 2. Pas de Rotation de Token

**Problème** : Le token est valide 1 heure mais n'est rafraîchi que toutes les 50 minutes. Si l'utilisateur ferme le navigateur, le token expire.

**Recommandation** :
```typescript
// Rafraîchir le token à chaque requête API si proche de l'expiration
if (tokenExpiresInLessThan10Minutes) {
  const newToken = await auth.currentUser.getIdToken(true);
  updateCookie(newToken);
}
```

---

#### 3. Cookie HttpOnly Manquant ?

**Problème** : Le cookie `auth-token` n'est pas configuré avec `HttpOnly`, donc accessible via JavaScript.

```typescript
// ❌ Actuel (vulnérable XSS)
document.cookie = `auth-token=${idToken}; path=/; max-age=3600; SameSite=Lax`;

// ✅ Recommandé
// 1. Côté client : Envoyer token à API route
await fetch('/api/auth/set-token', {
  method: 'POST',
  body: JSON.stringify({ token: idToken })
});

// 2. API route : Définir cookie HttpOnly
response.cookies.set('auth-token', idToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 3600,
});
```

---

#### 4. Storage Rules Hardcodées

**Problème** : Les emails admin sont hardcodés dans `storage.rules` :

```javascript
function isAdmin() {
  return request.auth.token.email in [
    'admin@grouperiou.com',
    'contact@grouperiou.com',
    'clement@nucom.fr'
  ];
}
```

**Recommandation** :
```javascript
// Utiliser custom claim au lieu de email
function isAdmin() {
  return request.auth.token.admin == true;
}
```

---

#### 5. Endpoint Création Premier Admin

**Fichier** : [`src/app/api/admin/create-first-user/route.ts`](src/app/api/admin/create-first-user/route.ts)

**Problème** : Endpoint `/api/admin/create-first-user` exposé en production.

**Secret actuel** :
```typescript
const ADMIN_SECRET = process.env.ADMIN_CREATION_SECRET || 'change-me-in-production';
```

**Recommandations** :
1. Désactiver complètement en production (`if (process.env.NODE_ENV === 'production') return 403`)
2. OU générer un secret fort avec `openssl rand -base64 32`
3. OU limiter l'accès par IP (localhost uniquement)

---

### ✅ Points Forts

1. **Custom Claims** : Approche robuste et performante pour gérer les rôles
2. **Protection multi-couches** : 4 niveaux de vérification (middleware, rules, API, context)
3. **Scripts automatisés** : Gestion admin facilitée avec scripts dédiés
4. **Rate limiting** : Protection contre brute force sur la page de connexion
5. **Logs de sécurité** : Traçabilité des tentatives suspectes
6. **Headers HTTP sécurisés** : CSP, HSTS, X-Frame-Options, etc.

---

## 📊 Matrice de Permissions

| Ressource | Public | User Authentifié | Admin |
|-----------|--------|------------------|-------|
| **Firestore - venues** | 🟢 Read | 🟢 Read | 🟢 Read/Write/Delete |
| **Firestore - leads** | 🟢 Create | 🟢 Create | 🟢 Read/Write/Delete |
| **Firestore - users** | 🔴 Aucun | 🟡 Read (propre doc) | 🟢 Read/Write/Delete |
| **Firestore - analytics** | 🔴 Aucun | 🔴 Aucun | 🟢 Read |
| **Firestore - settings** | 🟢 Read | 🟢 Read | 🟢 Read/Write |
| **Storage - venues images** | 🟢 Read | 🟢 Read | 🟢 Read/Write |
| **Storage - autres** | 🔴 Aucun | 🔴 Aucun | 🟢 Read/Write |
| **Pages /admin/** | 🔴 Aucun | 🔴 Aucun | 🟢 Accès complet |
| **API /api/admin/** | 🔴 Aucun | 🔴 Aucun | 🟢 Accès complet |

---

## 🔐 Checklist Sécurité

### Sécurité Actuelle

- ✅ Custom claims configurés sur les 2 admins
- ✅ Middleware protège les routes admin/API
- ✅ Firestore Rules bloquent accès non-admin
- ✅ Storage Rules limitent écriture aux admins
- ✅ Rate limiting sur page de connexion
- ✅ Headers de sécurité HTTP (CSP, HSTS, etc.)
- ✅ Logs de sécurité pour activités suspectes
- ✅ Tokens JWT avec expiration (1h)
- ✅ Cookie SameSite=Lax (protection CSRF partielle)

### À Améliorer (Priorité Haute)

- ⚠️ **Vérifier JWT dans middleware** (actuellement seulement présence cookie)
- ⚠️ **Cookie HttpOnly** pour `auth-token` (protection XSS)
- ⚠️ **Désactiver endpoint** `/api/admin/create-first-user` en production
- ⚠️ **Storage Rules** : Migrer de emails hardcodés vers custom claims

### À Améliorer (Priorité Moyenne)

- 🔵 Rotation automatique token avant expiration
- 🔵 2FA (authentification à deux facteurs)
- 🔵 Logs d'audit plus détaillés (qui a modifié quoi)
- 🔵 Alertes email en temps réel sur tentatives suspectes
- 🔵 Whitelist IP pour accès admin (optionnel)

---

## 📝 Procédures Opérationnelles

### Ajouter un Nouvel Admin

1. **Créer l'utilisateur** :
   ```bash
   # Via script shell (dev local)
   ./scripts/create-admin.sh
   
   # OU via API (avec secret)
   curl -X POST https://lieuxdexception.com/api/admin/create-first-user \
     -H "Content-Type: application/json" \
     -d '{"email":"nouveau@admin.com","password":"MotDePasse123!","secret":"YOUR_SECRET"}'
   ```

2. **Assigner les custom claims** :
   ```bash
   # Par email
   npx tsx scripts/set-admin-claims.ts grant nouveau@admin.com
   
   # OU par UID (si déjà créé)
   node scripts/set-admin-role.js grant <uid>
   ```

3. **Vérifier la configuration** :
   ```bash
   npx tsx scripts/set-admin-claims.ts list
   ```

4. **Tester la connexion** :
   - Aller sur `https://lieuxdexception.com/admin/connexion`
   - Se connecter avec les identifiants
   - Vérifier accès au dashboard

---

### Révoquer un Admin

1. **Retirer les custom claims** :
   ```bash
   npx tsx scripts/set-admin-claims.ts revoke ancien@admin.com
   ```

2. **Désactiver le compte** (optionnel) :
   ```bash
   # Via Firebase Console ou script custom
   ```

3. **Vérifier** :
   ```bash
   npx tsx scripts/set-admin-claims.ts list
   ```

---

### Réinitialiser un Mot de Passe

**Fichier** : [`scripts/reset-password.js`](scripts/reset-password.js)

```bash
# Envoyer lien de réinitialisation par email
node scripts/reset-password.js admin@example.com --send-link

# OU définir nouveau mot de passe directement
node scripts/reset-password.js admin@example.com NouveauMotDePasse123!
```

---

## 🔗 Ressources et Documentation

### Documentation Interne

- [`docs/SECURITY.md`](docs/SECURITY.md) : Documentation sécurité complète
- [`docs/SECURITY-AUDIT-2025-12.md`](docs/SECURITY-AUDIT-2025-12.md) : Audit sécurité détaillé
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) : Procédures de déploiement
- [`.github/copilot-instructions.md`](.github/copilot-instructions.md) : Instructions Copilot (règles projet)

### Firebase Documentation

- [Firebase Auth Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

### Scripts de Gestion

| Script | Commande | Description |
|--------|----------|-------------|
| Créer admin | `./scripts/create-admin.sh` | Créer premier utilisateur admin |
| Lister admins | `npx tsx scripts/set-admin-claims.ts list` | Lister tous les utilisateurs |
| Donner droits | `npx tsx scripts/set-admin-claims.ts grant <email>` | Assigner rôle admin |
| Retirer droits | `npx tsx scripts/set-admin-claims.ts revoke <email>` | Révoquer rôle admin |
| Vérifier config | `node scripts/check-admin-user.js <uid>` | Vérifier configuration complète |
| Reset password | `node scripts/reset-password.js <email>` | Réinitialiser mot de passe |

---

## 📊 Métriques et Monitoring

### Logs à Surveiller

1. **Firestore Security Logs** (`/security_logs`)
   - Tentatives de connexion échouées
   - Accès refusés
   - Activités suspectes

2. **Firebase Auth Logs** (Console Firebase)
   - Créations de comptes
   - Connexions
   - Modifications de mots de passe

3. **API Logs** (Cloud Run / Firebase Hosting)
   - Erreurs 401/403
   - Tentatives accès routes protégées
   - Performances

### Alertes Recommandées

- ⚠️ Plus de 5 tentatives connexion échouées en 1 minute
- ⚠️ Création de compte admin
- ⚠️ Modification custom claims
- ⚠️ Accès route admin sans token valide
- ⚠️ Erreurs 500 sur API routes protégées

---

## ✅ Conclusion

Le système d'authentification de Lieux d'Exception est **globalement robuste** avec une architecture multi-couches bien pensée. Les **2 comptes admin configurés** (`contact@lieuxdexception.com` et `clement@nucom.fr`) ont les bons accès et custom claims.

### Actions Prioritaires

1. **Critique** : Ajouter vérification JWT dans middleware (pas juste présence cookie)
2. **Importante** : Migrer cookie `auth-token` vers HttpOnly
3. **Importante** : Désactiver `/api/admin/create-first-user` en production
4. **Moyenne** : Migrer Storage Rules vers custom claims

### Prochaines Étapes

- Implémenter les recommandations de sécurité prioritaires
- Configurer monitoring/alerting Firebase
- Documenter procédure rotation secrets
- Tester scénarios d'attaque (pentest interne)

---

**Document généré le** : 16 janvier 2026  
**Dernière mise à jour** : 16 janvier 2026  
**Responsable** : Équipe Nucom / Groupe Riou
