# Configuration Google Search Console

## Fichiers SEO Générés

### ✅ Sitemap.xml
- **URL** : https://lieuxdexception.com/sitemap.xml
- **Fichier source** : `src/app/sitemap.ts`
- **Type** : Dynamique (généré à chaque build)

#### Contenu du sitemap
Le sitemap inclut automatiquement :

**Pages statiques françaises** :
- Homepage (priority 1.0)
- `/catalogue` (priority 0.95)
- `/mariages` (priority 0.9)
- `/evenements-b2b` (priority 0.9)
- `/contact` (priority 0.7)
- Pages légales : `/cgv`, `/confidentialite`, `/mentions-legales`, `/cookies` (priority 0.3)

**Pages internationales** (en, de, es, it, pt) :
- `/{locale}` (priority 0.8)
- `/{locale}/mariages` (priority 0.75)
- `/{locale}/evenements-b2b` (priority 0.75)
- `/{locale}/catalogue` (priority 0.8)

**Pages dynamiques** :
- `/lieux/{slug}` pour TOUS les lieux actifs (priority 0.85)
- Utilise `updatedAt` de Firestore comme `lastModified`

### ✅ Robots.txt
- **URL** : https://lieuxdexception.com/robots.txt
- **Fichier source** : `src/app/robots.ts`

#### Configuration robots.txt

**Googlebot** (crawl immédiat) :
```
User-agent: Googlebot
Allow: /
Disallow: /admin
Disallow: /api/admin/
Disallow: /api/analytics/
Disallow: /api/leads/
Crawl-delay: 0
```

**Googlebot-Image** (spécifique images) :
```
User-agent: Googlebot-Image
Allow: /
Disallow: /admin
```

**Bingbot** (crawl modéré) :
```
User-agent: Bingbot
Allow: /
Disallow: /admin
Disallow: /api/admin/
Disallow: /api/analytics/
Disallow: /api/leads/
Crawl-delay: 1
```

**Autres bots** (crawl lent) :
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/
Disallow: /api/analytics/
Disallow: /api/leads/
Disallow: /api/fcm/
Disallow: /_next/static/
Crawl-delay: 2
```

**Sitemap** :
```
Sitemap: https://lieuxdexception.com/sitemap.xml
```

## Configuration Google Search Console

### 1. Ajouter le site
1. Aller sur [Google Search Console](https://search.google.com/search-console)
2. Cliquer sur **"Ajouter une propriété"**
3. Choisir **"Domaine"** et entrer : `lieuxdexception.com`

### 2. Vérifier la propriété

**Méthode recommandée : DNS (TXT record)**
```
Type: TXT
Host: @
Value: google-site-verification=XXXXXXXXXXXX
```
(Google fournira le code unique)

**Alternative : Fichier HTML**
- Télécharger le fichier `googleXXXXXXXXXX.html` fourni par Google
- Le placer dans `public/` du projet
- Déployer
- URL : `https://lieuxdexception.com/googleXXXXXXXXXX.html`

### 3. Soumettre le sitemap
1. Dans Google Search Console, aller dans **"Sitemaps"** (menu gauche)
2. Entrer l'URL : `https://lieuxdexception.com/sitemap.xml`
3. Cliquer sur **"Envoyer"**

Google commencera à crawler le site dans les 24-48h.

### 4. Paramètres additionnels

#### Taux d'exploration
- Par défaut : **"Laisser Google optimiser"** (recommandé)
- Si besoin : Réduire si le serveur est surchargé

#### Ciblage international
- **Pays cible** : France (principal)
- **hreflang** : Déjà implémenté dans `layout.tsx` (balises `<link rel="alternate">`)

#### URLs à supprimer
Si besoin de supprimer des URLs obsolètes :
1. **"Suppressions"** → **"Nouvelle demande"**
2. Entrer l'URL exacte
3. **Temporaire** : 6 mois (URL reste dans l'index après)
4. **Permanent** : Utiliser redirections 301 dans `next.config.js`

#### Core Web Vitals
Surveiller les métriques dans **"Expérience"** → **"Signaux Web essentiels"**
- LCP (Largest Contentful Paint) : < 2.5s ✅
- FID (First Input Delay) : < 100ms ✅
- CLS (Cumulative Layout Shift) : < 0.1 ✅

## Monitoring et Optimisation

### Alertes à configurer
1. **"Paramètres"** → **"Utilisateurs et autorisations"**
   - Ajouter `contact@lieuxdexception.com`
   - Activer notifications email

2. **Alertes importantes** :
   - Erreurs d'exploration (404, 500)
   - Problèmes de couverture (pages exclues)
   - Problèmes d'ergonomie mobile
   - Pénalités manuelles

### Rapports clés à suivre

#### 1. Couverture
- Pages indexées : Devrait être ~100 pages (lieux + statiques + locales)
- Erreurs : À corriger immédiatement
- Avertissements : À surveiller

#### 2. Performances
- **Requêtes** : Mots-clés générant du trafic
- **Impressions** : Apparitions dans les résultats Google
- **Clics** : Visites depuis Google
- **CTR** : Taux de clic (impressions → clics)
- **Position moyenne** : Objectif < 10 (première page)

#### 3. Liens
- **Liens externes** : Sites pointant vers lieuxdexception.com
- **Liens internes** : Navigation interne du site

#### 4. Ergonomie mobile
- Vérifier que toutes les pages sont **"Mobile-friendly"**
- Corriger erreurs (boutons trop petits, texte illisible, etc.)

## Structured Data (Schema.org)

Déjà implémenté dans `src/components/seo/`:
- **Organization** : Page d'accueil
- **BreadcrumbList** : Navigation
- **Place** : Pages lieux
- **Event** : Mariages et événements B2B

Vérifier dans Google Search Console :
- **"Améliorations"** → **"Données structurées"**
- Corriger les erreurs éventuelles

## Fichiers et URLs à vérifier

### ✅ URLs publiques (indexées)
- Homepage : `https://lieuxdexception.com/`
- Catalogue : `https://lieuxdexception.com/catalogue`
- Mariages : `https://lieuxdexception.com/mariages`
- B2B : `https://lieuxdexception.com/evenements-b2b`
- Contact : `https://lieuxdexception.com/contact`
- Lieux : `https://lieuxdexception.com/lieux/*`

### ❌ URLs bloquées (non indexées)
- Admin : `https://lieuxdexception.com/admin/*`
- API : `https://lieuxdexception.com/api/admin/*`
- Analytics API : `https://lieuxdexception.com/api/analytics/*`
- Leads API : `https://lieuxdexception.com/api/leads/*`
- FCM : `https://lieuxdexception.com/api/fcm/*`

## Commandes de test

### Tester sitemap localement
```bash
curl http://localhost:3002/sitemap.xml
```

### Tester robots.txt localement
```bash
curl http://localhost:3002/robots.txt
```

### Valider sitemap online
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- Entrer : `https://lieuxdexception.com/sitemap.xml`

### Tester robots.txt online
- [Google Robots Testing Tool](https://support.google.com/webmasters/answer/6062598)
- Ou dans Google Search Console : **"Paramètres"** → **"Outil de test du fichier robots.txt"**

## Maintenance

### Après ajout d'un nouveau lieu
1. Le sitemap se met à jour automatiquement au prochain build
2. Redéployer l'app : `firebase deploy --only hosting`
3. Dans Google Search Console :
   - **"Sitemaps"** → Resoumettre le sitemap (optionnel, Google détecte auto)
   - Ou **"Inspection d'URL"** → Entrer l'URL du nouveau lieu → **"Demander une indexation"**

### Après modification d'un lieu
1. Google re-crawlera selon `changeFrequency: 'weekly'`
2. Pour accélérer : **"Inspection d'URL"** → **"Demander une indexation"**

### Après ajout de pages statiques
1. Ajouter dans `src/app/sitemap.ts` (section `staticPages`)
2. Rebuild et redéployer
3. Resoumettre le sitemap dans Search Console

## Ressources

- [Documentation Next.js - Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Documentation Next.js - Robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Google Search Console](https://search.google.com/search-console)
- [Google - Comment fonctionne la recherche](https://developers.google.com/search/docs/fundamentals/how-search-works)
- [Schema.org](https://schema.org/)
