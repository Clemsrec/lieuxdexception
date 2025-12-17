# Audit Sécurité - Lieux d'Exception
**Date:** 17 décembre 2025  
**Statut Global:** ✅ **BON** (quelques améliorations recommandées)

---

## 🛡️ Headers de Sécurité HTTP

### ✅ Headers Actifs (middleware.ts)

| Header | Valeur | Statut | Impact |
|--------|--------|--------|--------|
| **Content-Security-Policy** | Configuré avec restrictions | ⚠️ **PARTIEL** | Bloque XSS mais `unsafe-inline` présent |
| **X-Frame-Options** | `DENY` | ✅ **EXCELLENT** | Protection clickjacking totale |
| **X-Content-Type-Options** | `nosniff` | ✅ **EXCELLENT** | Empêche MIME sniffing |
| **X-XSS-Protection** | `1; mode=block` | ✅ **BON** | Protection XSS navigateurs anciens |
| **Strict-Transport-Security** | `max-age=31536000` (prod) | ✅ **EXCELLENT** | Force HTTPS 1 an + preload |
| **Referrer-Policy** | `strict-origin-when-cross-origin` | ✅ **BON** | Limite fuite d'informations |
| **Permissions-Policy** | Désactive caméra/micro/géo | ✅ **EXCELLENT** | Minimise surface d'attaque |
| **Cross-Origin-Opener-Policy** | `same-origin` | ✅ **EXCELLENT** | Protection timing attacks |

### ⚠️ CSP : Points Faibles Identifiés

**Directive actuelle :**
```
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
```

**Problèmes :**
- ❌ `unsafe-inline` : Autorise scripts/styles inline (risque XSS)
- ❌ `unsafe-eval` : Autorise `eval()` (nécessaire pour Next.js dev)

**Recommandations :**
1. **Court terme** : Ajouter `nonce` ou `hash` pour scripts critiques
2. **Moyen terme** : Migrer vers `strict-dynamic` + nonces
3. **Long terme** : Trusted Types API (déjà activé : `require-trusted-types-for 'script'`)

**TODO ajouté dans middleware.ts** pour architecture nonces (complexe Next.js 15)

---

## 🔐 Validation & Sanitization (Formulaires)

### ✅ Schémas Zod Complets (lib/validation.ts)

| Champ | Validation | Sanitization | Statut |
|-------|-----------|--------------|--------|
| **Email** | Regex + `.email()` + max 100 chars | `.toLowerCase()` + `.trim()` | ✅ **EXCELLENT** |
| **Téléphone** | Regex FR `/^(?:\+|00)33\|0\s*[1-9]...$/` | Normalise format (supprime espaces/tirets) | ✅ **EXCELLENT** |
| **Nom/Prénom** | Regex lettres + accents + tirets | `.trim()` | ✅ **BON** |
| **Message** | Min 10 / Max 2000 chars | `.trim()` | ✅ **BON** |
| **Date événement** | `futureDateSchema` (bloque dates passées) | N/A | ✅ **EXCELLENT** |
| **Nombre invités** | `int().min(20).max(500)` | N/A | ✅ **BON** |
| **Budget** | `number().min(0)` | N/A | ✅ **BON** |
| **Consentement** | `z.literal(true)` (obligatoire RGPD) | N/A | ✅ **EXCELLENT** |

### ✅ API Route Sécurisée (api/contact/submit/route.ts)

**Protections actives :**
1. ✅ **Validation stricte Zod** : Toutes les données passent par `validateData()`
2. ✅ **Protection doublon** : Vérifie même email dans les 24h
3. ✅ **Timestamps Firestore** : Utilise `Timestamp.now()` (pas `new Date()`)
4. ✅ **Sanitization XSS** : Fonction `sanitizeString()` disponible (non utilisée pour l'instant - Zod suffit)

**Code :**
```typescript
// 1. Validation type
if (type !== 'b2b' && type !== 'mariage') {
  return NextResponse.json({ error: 'Type invalide' }, { status: 400 });
}

// 2. Validation Zod
const validationResult = validateData(b2bFormSchema, formData);
if (!validationResult.success) {
  return NextResponse.json({ 
    error: 'Données invalides', 
    details: validationResult.errors 
  }, { status: 400 });
}

// 3. Protection doublon (24h)
const duplicateQuery = query(
  collection(db, 'leads'),
  where('email', '==', email),
  where('createdAt', '>=', Timestamp.fromDate(yesterday))
);
```

### ⚠️ Améliorations Recommandées

1. **Appliquer `sanitizeString()` sur champs texte libre**
   ```typescript
   // Avant insertion Firestore
   leadData.message = sanitizeString(validatedData.message);
   leadData.requirements = sanitizeString(validatedData.requirements);
   ```

2. **Ajouter validation honeypot** (anti-bot)
   ```typescript
   // Champ caché dans formulaire
   if (formData.website) { // Champ honeypot
     return NextResponse.json({ error: 'Bot détecté' }, { status: 400 });
   }
   ```

3. **Logger tentatives suspectes**
   ```typescript
   if (!validationResult.success) {
     console.warn('[Security] Validation failed:', {
       ip: request.headers.get('x-forwarded-for'),
       errors: validationResult.errors
     });
   }
   ```

---

## 🚨 Rate Limiting

### ⚠️ STATUT : INCOMPLET

**Actuel :**
- ✅ Protection doublon email (24h) dans API route
- ❌ **Pas de rate limiting par IP** (vulnérable DDoS)
- ❌ **Upstash Redis non configuré** (mentionné dans docs mais non déployé)

**Risques :**
- 🔴 **Attaque brute force** : Soumission massive formulaires
- 🔴 **DDoS applicatif** : Spam API `/api/contact/submit`
- 🟡 **Coûts Firebase** : Écritures Firestore non limitées

**Solutions Recommandées :**

**Option 1 : Rate Limiting In-Memory (Dev/Petit Trafic)**
```typescript
// lib/rate-limit-simple.ts
const requests = new Map<string, number[]>();

export function isRateLimited(ip: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const userRequests = requests.get(ip) || [];
  
  // Nettoyer anciennes requêtes
  const recentRequests = userRequests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return true; // Bloqué
  }
  
  recentRequests.push(now);
  requests.set(ip, recentRequests);
  return false;
}

// Dans API route
const ip = request.headers.get('x-forwarded-for') || 'unknown';
if (isRateLimited(ip, 5, 60000)) { // 5 req/min
  return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
}
```

**Option 2 : Upstash Redis (Production Recommandé)**
```typescript
// lib/rate-limit-upstash.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 req/min
  analytics: true,
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
  return { success, limit, reset, remaining };
}
```

**Option 3 : Cloudflare Rate Limiting (Gratuit)**
- Activer Rate Limiting Rules dans Cloudflare dashboard
- Rule : `/api/contact/submit` → 10 req/min par IP
- Avantage : Protection edge (avant Next.js)

**RECOMMANDATION URGENTE :** Implémenter **Option 1 immédiatement** + migrer vers **Option 2** en production.

---

## 🔥 Firestore Security Rules

### ✅ Rules Strictes (firestore.rules)

**Collection `venues` (lieux) :**
```firerules
allow read: if true; // Public (site vitrine)
allow create, update, delete: if isAdmin(); // Admin uniquement
```
✅ **BON** : Lecture publique OK, écriture admin seulement

**Collection `leads` (prospects) :**
```firerules
allow read: if isAdmin(); // Données sensibles
allow create: if hasRequiredFields(...) && // Validation côté Firestore
              request.resource.data.type in ['b2b', 'wedding'] &&
              request.resource.data.contactInfo.email.matches('.*@.*\\..*');
allow update, delete: if isAdmin();
```
✅ **EXCELLENT** : Double validation (Zod + Firestore Rules)

**Collection `analytics` :**
```firerules
allow read: if isAdmin();
allow write: if false; // Admin SDK uniquement
```
✅ **EXCELLENT** : Sécurité maximale

**Collection `users` (admins) :**
```firerules
allow read: if isAuthenticated() && request.auth.uid == userId;
allow write: if false; // Admin SDK uniquement
```
✅ **EXCELLENT** : Utilisateur voit uniquement son profil

### ✅ Protection Custom Claims Admin

**Configuration :**
```typescript
// scripts/set-admin-claims.ts
await admin.auth().setCustomUserClaims(uid, { admin: true });
```

**Vérification dans rules :**
```firerules
function isAdmin() {
  return request.auth.token.admin == true;
}
```
✅ **EXCELLENT** : Impossible de s'auto-promouvoir admin

---

## 🔒 Authentification Admin

### ✅ Protection Routes (middleware.ts)

**Routes protégées :**
```typescript
PROTECTED_ROUTES = ['/admin'];
PROTECTED_API_ROUTES = ['/api/admin', '/api/venues/create', '/api/venues/update'];
```

**Vérification cookie :**
```typescript
const authToken = request.cookies.get('auth-token');
if (!authToken) {
  return NextResponse.redirect('/admin/connexion');
}
```

### ⚠️ Points Faibles Identifiés

1. ❌ **Pas de vérification JWT** : Le middleware vérifie seulement la présence du cookie, pas sa validité
   ```typescript
   // TODO: Vérifier signature JWT
   const decoded = await admin.auth().verifyIdToken(authToken.value);
   if (!decoded.admin) throw new Error('Unauthorized');
   ```

2. ❌ **Pas de rotation token** : Token jamais refresh
3. ❌ **HttpOnly cookie?** : À vérifier si le cookie est HttpOnly (empêche XSS)

**Recommandations :**
```typescript
// lib/auth-middleware.ts
import { admin } from '@/lib/firebase-admin';

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.admin === true;
  } catch (error) {
    console.error('[Auth] Token invalide:', error);
    return false;
  }
}

// Dans middleware.ts
const isValid = await verifyAdminToken(authToken.value);
if (!isValid) {
  return NextResponse.redirect('/admin/connexion');
}
```

---

## 🌐 CORS & External Resources

### ✅ Configuration Correcte

**CSP `connect-src` :**
```
connect-src 'self' https://*.googleapis.com https://*.firebaseio.com
```
✅ Limite aux domaines Firebase/Google uniquement

**CSP `frame-src` :**
```
frame-src 'self' https://*.firebaseapp.com
```
✅ Empêche iframe externes malveillants

**CSP `img-src` :**
```
img-src 'self' data: https: blob:
```
⚠️ **PERMISSIF** : `https:` autorise toutes les images HTTPS (nécessaire pour Firebase Storage)

---

## 📊 Données Sensibles

### ✅ Protection RGPD

**Consentement explicite :**
```typescript
acceptPrivacy: z.literal(true), // Obligatoire
acceptMarketing: z.boolean().default(false), // Optionnel
```

**Droit à l'oubli :**
```firerules
allow delete: if isAdmin(); // Admin peut supprimer leads
```

**Minimisation données :**
- ✅ Pas de stockage carte bancaire
- ✅ Pas de données biométriques
- ✅ Pas de geolocalisation GPS utilisateurs

### ⚠️ Recommandations RGPD

1. **Ajouter champ `deletedAt`** (soft delete)
   ```typescript
   // Au lieu de supprimer définitivement
   await updateDoc(leadRef, { 
     deletedAt: Timestamp.now(),
     email: '[DELETED]', // Anonymisation
   });
   ```

2. **Log accès données admin**
   ```typescript
   // Collection audit_logs
   await addDoc(collection(db, 'audit_logs'), {
     adminId: currentUser.uid,
     action: 'read_lead',
     leadId: leadId,
     timestamp: Timestamp.now(),
   });
   ```

---

## 🚀 Score de Sécurité Global

| Catégorie | Score | Détails |
|-----------|-------|---------|
| **Headers HTTP** | 85/100 | CSP unsafe-inline (-10), pas de nonces (-5) |
| **Validation Formulaires** | 95/100 | Zod strict, sanitization partielle (-5) |
| **Firestore Rules** | 100/100 | Règles restrictives + double validation |
| **Authentification** | 70/100 | Cookie auth faible (-20), pas JWT verify (-10) |
| **Rate Limiting** | 40/100 | Seulement doublon email, pas IP limiting (-60) |
| **RGPD** | 90/100 | Consentement OK, soft delete manquant (-10) |

**SCORE TOTAL : 80/100** ⭐⭐⭐⭐☆

---

## 📋 Plan d'Action Prioritaire

### 🔴 URGENT (À faire sous 1 semaine)

1. **Implémenter Rate Limiting par IP**
   - Script : `scripts/add-rate-limiting.ts`
   - Lib : `lib/rate-limit-simple.ts` (in-memory)
   - API : Modifier `api/contact/submit/route.ts`

2. **Vérifier JWT dans middleware admin**
   - Utiliser `admin.auth().verifyIdToken()`
   - Vérifier custom claim `admin: true`

### 🟡 IMPORTANT (À faire sous 1 mois)

3. **Ajouter sanitization XSS stricte**
   - Appliquer `sanitizeString()` sur tous champs texte
   - Utiliser DOMPurify côté client si affichage HTML

4. **Implémenter honeypot anti-bot**
   - Champ caché `website` dans formulaires
   - Bloquer si rempli (bot détecté)

5. **Migrer vers Upstash Redis**
   - Rate limiting distribué (production)
   - Configuration : `UPSTASH_REDIS_REST_URL`

### 🟢 AMÉLIORATION (À faire sous 3 mois)

6. **CSP Nonces**
   - Architecture Next.js 15 avec `experimental.csp`
   - Générer nonce par requête
   - Passer via headers → `<Script nonce={nonce}>`

7. **Audit Logs Admin**
   - Collection `audit_logs` Firestore
   - Logger toutes actions sensibles (read/update/delete leads)

8. **Tests Sécurité Automatisés**
   - OWASP ZAP scan
   - Snyk dependency scan
   - Firebase Security Rules tests (`firebase emulators:exec`)

---

## 🛠️ Scripts Utiles

**Tester Firestore Rules :**
```bash
firebase emulators:start --only firestore
npm run test:rules # (créer ce script)
```

**Scanner dépendances vulnérables :**
```bash
npm audit
npm audit fix
```

**Tester headers sécurité :**
```bash
curl -I https://lieuxdexception.fr | grep -i "content-security\|x-frame\|strict-transport"
```

**Scanner SSL :**
```bash
openssl s_client -connect lieuxdexception.fr:443 -servername lieuxdexception.fr
```

---

## 📚 Références

- [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- [Firebase Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Zod Documentation](https://zod.dev/)
- [Upstash Redis Rate Limiting](https://upstash.com/docs/redis/features/ratelimiting)

---

**Conclusion :** Le site a une **base solide** (validation Zod, Firestore Rules strictes, headers HTTP). Les **points critiques** à corriger immédiatement sont :
1. Rate limiting par IP
2. Vérification JWT admin
3. Sanitization XSS stricte

Avec ces 3 correctifs, le score passerait de **80/100 à 95/100** ✅
