# Guide Cache Busting - Lieux d'Exception

## Problème Résolu

**Symptôme** : Les clients voient l'ancienne version du site même après déploiement des mises à jour.

**Cause** : Cache navigateur trop agressif (1h pour homepage, 2h pour pages lieux) + pas de headers `Cache-Control` appropriés.

## Solutions Implémentées

### 1. Headers Cache-Control (next.config.js)

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate'
        },
      ],
    },
    // Images cachées 1 an (immutables)
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        },
      ],
    },
  ];
}
```

**Effet** : 
- Pages HTML : `max-age=0` force la revalidation à chaque visite
- Images/logos : `max-age=31536000` (1 an) car immutables
- `must-revalidate` force le navigateur à vérifier la fraîcheur

### 2. ISR Revalidation Agressive

**Avant** :
- Homepage : `revalidate = 3600` (1 heure)
- Pages lieux : `revalidate = 7200` (2 heures)

**Après** :
- Homepage : `revalidate = 60` (1 minute)
- Pages lieux : `revalidate = 300` (5 minutes)

**Fichiers modifiés** :
- `src/app/[locale]/page.tsx`
- `src/app/[locale]/lieux/[slug]/page.tsx`

### 3. Build ID Unique (Version-Based Cache Busting)

```javascript
generateBuildId: async () => {
  const { version } = require('./package.json');
  return `${version}-${Date.now()}`;
},
```

**Effet** : Chaque build génère un ID unique (ex: `1.1.0-1734270000000`), ce qui invalide automatiquement tous les assets `/_next/static/*`.

### 4. Service Worker Auto-Update

**Fichier** : `public/firebase-messaging-sw.js`

```javascript
const CACHE_VERSION = '1.1.0';

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force le nouveau SW immédiatement
});

self.addEventListener('activate', (event) => {
  // Nettoyer les anciens caches
  caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.filter((name) => name !== CACHE_VERSION)
        .map((name) => caches.delete(name))
    );
  }).then(() => self.clients.claim()); // Contrôle immédiat
});
```

**Effet** : À chaque déploiement avec nouvelle version, le service worker se met à jour automatiquement et nettoie les anciens caches.

## Workflow Déploiement

### Avant Chaque Déploiement

1. **Incrémenter la version** dans `package.json` :
   ```bash
   # Patch (1.1.0 → 1.1.1) pour bugfixes
   npm version patch
   
   # Minor (1.1.0 → 1.2.0) pour nouvelles features
   npm version minor
   
   # Major (1.1.0 → 2.0.0) pour breaking changes
   npm version major
   ```

2. **Mettre à jour CACHE_VERSION** dans `public/firebase-messaging-sw.js` :
   ```javascript
   const CACHE_VERSION = '1.1.1'; // Synchroniser avec package.json
   ```

3. **Build et vérifier** :
   ```bash
   npm run build
   # Vérifier dans .next/BUILD_ID que l'ID est unique
   cat .next/BUILD_ID
   ```

4. **Déployer** :
   ```bash
   firebase deploy --only hosting
   ```

### Forcer le Rafraîchissement Côté Client

Si un client voit encore l'ancienne version :

1. **Hard Refresh** :
   - Chrome/Edge : `Cmd + Shift + R` (macOS) ou `Ctrl + Shift + R` (Windows)
   - Safari : `Cmd + Option + R`

2. **Vider le cache** :
   - Chrome DevTools → Network → Disable cache (puis recharger)
   - Safari → Develop → Empty Caches

3. **Unregister Service Worker** (dernier recours) :
   - DevTools → Application → Service Workers → Unregister
   - Recharger la page

## Monitoring

### Vérifier les Headers

```bash
# Vérifier les headers en production
curl -I https://lieuxdexception.com | grep -i "cache-control"

# Devrait afficher :
# Cache-Control: public, max-age=0, must-revalidate
```

### Vérifier le Build ID

```bash
# Dans le build local
cat .next/BUILD_ID

# Exemple output :
# 1.1.0-1734270000000
```

### Logs Service Worker

Dans la console navigateur :
```javascript
navigator.serviceWorker.getRegistrations().then((registrations) => {
  registrations.forEach((reg) => {
    console.log('SW version:', reg.active?.scriptURL);
  });
});
```

## Temps de Propagation

Après déploiement, les clients verront la nouvelle version :

| Scénario | Délai |
|----------|-------|
| Nouveau visiteur | Immédiat |
| Visiteur récurrent (cache navigateur) | 0-60 secondes (homepage)<br>0-300 secondes (pages lieux) |
| Hard refresh forcé | Immédiat |
| Service Worker update | 1-5 minutes (auto) |

## Troubleshooting

### Problème : Client voit encore l'ancienne version après 10 minutes

**Solution** :
1. Vérifier que `package.json` version a été incrémentée
2. Vérifier que `CACHE_VERSION` dans SW a été mise à jour
3. Demander au client de faire hard refresh (`Cmd + Shift + R`)
4. Si persistant : vider le cache navigateur complet

### Problème : Images ne se chargent pas après déploiement

**Cause probable** : Path image incorrect ou fichier manquant

**Solution** :
1. Vérifier que l'image existe dans `public/images/`
2. Vérifier le path dans le code (pas de `/public/` dans le path)
3. Vérifier les permissions Firebase Storage si image remote

### Problème : Build ID identique entre deux builds

**Cause** : `package.json` version pas incrémentée

**Solution** :
```bash
npm version patch
npm run build
```

## Best Practices

1. **Toujours incrémenter la version** avant un déploiement
2. **Synchroniser CACHE_VERSION** avec `package.json`
3. **Tester en local** avec `npm run build && npm start`
4. **Vérifier les headers** après déploiement
5. **Documenter les breaking changes** dans CHANGELOG.md

## Impact Performance

### Avant (cache agressif)
- Homepage : Cache 1h → 1 requête/heure/utilisateur
- Pages lieux : Cache 2h → 1 requête/2h/utilisateur
- **Problème** : Mises à jour invisibles pendant 1-2h

### Après (cache optimal)
- Homepage : Revalidate 60s → Max 1 requête/minute (toujours frais)
- Pages lieux : Revalidate 300s → Max 1 requête/5min
- Assets (images) : Cache 1 an → 0 requête après première visite
- **Bénéfice** : Mises à jour visibles en 1-5 minutes max

## Références

- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [MDN Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [Service Worker Lifecycle](https://developer.chrome.com/docs/workbox/service-worker-lifecycle/)
