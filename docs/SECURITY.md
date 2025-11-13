# Guide de Sécurité & Déploiement - Lieux d'Exception

Ce guide documente toutes les mesures de sécurité implémentées dans le projet et comment les déployer en production.

## 📋 Table des Matières

1. [Sécurité Implémentée](#sécurité-implémentée)
2. [Déploiement Firebase Security Rules](#déploiement-firebase-security-rules)
3. [Configuration Next.js Middleware](#configuration-nextjs-middleware)
4. [Validation des Données](#validation-des-données)
5. [Rate Limiting](#rate-limiting)
6. [Headers de Sécurité](#headers-de-sécurité)
7. [Checklist de Sécurité](#checklist-de-sécurité)

---

## 🛡️ Sécurité Implémentée

### Couches de Protection

```
┌─────────────────────────────────────┐
│  Cloudflare / CDN (DDoS, WAF)       │  ← Couche 1: Infrastructure
├─────────────────────────────────────┤
│  Next.js Middleware (Headers, Auth) │  ← Couche 2: Application
├─────────────────────────────────────┤
│  API Routes (Rate Limit, Validation)│  ← Couche 3: Endpoints
├─────────────────────────────────────┤
│  Zod Validation (Data Integrity)    │  ← Couche 4: Données
├─────────────────────────────────────┤
│  Firestore Rules (Database Access)  │  ← Couche 5: Base de données
└─────────────────────────────────────┘
```

### Fichiers de Sécurité

- **`src/middleware.ts`** : Headers HTTP, protection routes admin, rate limiting basique
- **`src/lib/security.ts`** : Utilitaires (hashing, sanitization, tokens)
- **`src/lib/validation.ts`** : Schémas Zod pour validation des données
- **`firestore.rules`** : Règles de sécurité Firestore
- **`storage.rules`** : Règles de sécurité Firebase Storage

---

## 🚀 Déploiement Firebase Security Rules

### Prérequis

```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter
firebase login

# Initialiser le projet (si pas déjà fait)
firebase init
```

### Déploiement des Règles

#### 1. Déployer UNIQUEMENT Firestore Rules

```bash
firebase deploy --only firestore:rules
```

#### 2. Déployer UNIQUEMENT Storage Rules

```bash
firebase deploy --only storage
```

#### 3. Déployer TOUTES les règles

```bash
firebase deploy --only firestore:rules,storage
```

### Tester les Règles AVANT Déploiement

```bash
# Tester Firestore rules localement
firebase emulators:start --only firestore

# Tester avec des scénarios
npm run test:firestore-rules
```

### Vérification Post-Déploiement

1. **Console Firebase** : https://console.firebase.google.com/project/lieux-d-exceptions/firestore/rules
2. Vérifier que les règles sont actives
3. Tester un appel API non authentifié (doit échouer)
4. Tester un appel API authentifié admin (doit réussir)

---

## ⚙️ Configuration Next.js Middleware

### Headers de Sécurité HTTP Appliqués

Le middleware `/src/middleware.ts` applique automatiquement :

#### Content Security Policy (CSP)
- Bloque les scripts inline non autorisés
- Limite les sources de contenu (images, fonts, scripts)
- Protège contre XSS

#### Strict-Transport-Security (HSTS)
- Force HTTPS en production
- Durée : 1 an avec preload
- Inclut les sous-domaines

#### X-Frame-Options
- `DENY` : Empêche le clickjacking
- Bloque l'intégration en iframe

#### X-Content-Type-Options
- `nosniff` : Empêche le MIME sniffing

#### Permissions-Policy
- Désactive caméra, micro, géolocalisation
- Bloque FLoC (Privacy Sandbox)

### Routes Protégées

```typescript
// Routes nécessitant authentification
const PROTECTED_ROUTES = ['/admin'];

// API nécessitant authentification
const PROTECTED_API_ROUTES = [
  '/api/admin',
  '/api/venues/create',
  '/api/venues/update'
];
```

### Personnalisation

Modifier `src/middleware.ts` pour :
- Ajouter des routes protégées
- Ajuster les headers CSP selon vos besoins
- Activer/désactiver certaines protections

---

## ✅ Validation des Données

### Utilisation de Zod

Tous les formulaires et API doivent utiliser Zod pour valider les données :

```typescript
import { b2bFormSchema, validateData } from '@/lib/validation';

// Dans un API route
export async function POST(request: Request) {
  const body = await request.json();
  
  // Validation
  const result = validateData(b2bFormSchema, body);
  
  if (!result.success) {
    return Response.json(
      { error: 'Validation failed', details: result.errors },
      { status: 400 }
    );
  }
  
  // Données validées et typées
  const { data } = result;
  // ...
}
```

### Schémas Disponibles

- `quickContactSchema` : Formulaire contact rapide
- `b2bFormSchema` : Formulaire événement B2B
- `weddingFormSchema` : Formulaire mariage
- `leadSchema` : Création de lead
- `venueSchema` : Création/modification de lieu

### Sanitization Automatique

```typescript
import { sanitizeString, escapeHtml } from '@/lib/security';

const userInput = sanitizeString(req.body.message);
const safeHTML = escapeHtml(userInput);
```

---

## 🚦 Rate Limiting

### Configuration Actuelle

Le rate limiting est implémenté en mémoire (développement) :

```typescript
import { isRateLimited } from '@/lib/security';

// Dans un API route
const ip = getRealIP(request.headers);

if (isRateLimited(ip, { maxRequests: 10, windowSeconds: 60 })) {
  return Response.json(
    { error: 'Too many requests', retryAfter: 60 },
    { status: 429 }
  );
}
```

### Production : Upstash Redis

Pour la production, utiliser Upstash Redis :

```bash
# Installer
npm install @upstash/redis @upstash/ratelimit

# Variables d'environnement
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'),
});

const { success } = await ratelimit.limit(ip);
if (!success) {
  return Response.json({ error: 'Too many requests' }, { status: 429 });
}
```

### Limites Recommandées

| Endpoint | Limite | Fenêtre |
|----------|--------|---------|
| `/api/contact` | 3 req | 60s |
| `/api/leads` | 5 req | 60s |
| `/api/venues` (GET) | 30 req | 60s |
| `/api/admin/*` | 50 req | 60s |
| Routes publiques | 100 req | 60s |

---

## 🔐 Headers de Sécurité

### Test des Headers

Vérifier que les headers sont appliqués :

```bash
# Développement
curl -I http://localhost:3000

# Production
curl -I https://lieuxdexception.com
```

### Headers Attendus

```http
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-eval' ...
x-frame-options: DENY
x-content-type-options: nosniff
x-xss-protection: 1; mode=block
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), geolocation=()
strict-transport-security: max-age=31536000; includeSubDomains; preload
```

### Validation des Headers

Utiliser ces outils pour tester la sécurité :

- **SecurityHeaders.com** : https://securityheaders.com/?q=lieuxdexception.com
- **Mozilla Observatory** : https://observatory.mozilla.org/
- **SSL Labs** : https://www.ssllabs.com/ssltest/

---

## 📝 Checklist de Sécurité

### Avant Déploiement Production

- [ ] **Clés API Firebase régénérées** avec restrictions de domaine
- [ ] **Firestore Rules déployées** et testées
- [ ] **Storage Rules déployées** et testées
- [ ] **Variables d'environnement** configurées en production
- [ ] **HTTPS activé** avec certificat valide
- [ ] **HSTS préchargé** (après validation HTTPS stable)
- [ ] **Rate limiting Redis** configuré (Upstash)
- [ ] **Monitoring erreurs** actif (Sentry)
- [ ] **Logs centralisés** configurés
- [ ] **Backup automatique** Firestore activé

### Maintenance Régulière

#### Hebdomadaire
- [ ] Vérifier les logs de sécurité
- [ ] Auditer les tentatives d'accès non autorisées

#### Mensuel
- [ ] Rotation des clés API Firebase
- [ ] Audit des permissions Firestore
- [ ] Vérification des vulnérabilités npm (`npm audit`)
- [ ] Test des règles de sécurité

#### Trimestriel
- [ ] Audit de sécurité complet
- [ ] Révision des headers CSP
- [ ] Test de pénétration (optionnel)
- [ ] Mise à jour des dépendances

---

## 🚨 En Cas d'Incident

### Clé API Compromise

1. **Révoquer immédiatement** dans Console Firebase
2. Générer nouvelle clé avec restrictions strictes
3. Mettre à jour `.env.local` et `.env.production`
4. Redéployer l'application
5. Auditer les logs d'utilisation de l'ancienne clé

### Accès Non Autorisé Détecté

1. Bloquer l'IP dans Firestore Rules ou Cloudflare
2. Vérifier les logs Firebase pour l'étendue de la breach
3. Notifier l'équipe de sécurité
4. Changer tous les secrets (tokens, clés)
5. Investiguer la cause racine

### DDoS

1. Activer Cloudflare Bot Fight Mode
2. Réduire les limites de rate limiting
3. Activer CAPTCHA sur les formulaires
4. Contacter le support hébergeur si nécessaire

---

## 📞 Contacts Sécurité

- **Admin Projet** : admin@grouperiou.com
- **Firebase Support** : https://firebase.google.com/support
- **Vercel Support** : https://vercel.com/support

---

**Dernière mise à jour** : 11 novembre 2025  
**Version** : 1.0
