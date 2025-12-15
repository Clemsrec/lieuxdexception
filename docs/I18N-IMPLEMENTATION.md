# Mise en Place i18n - Lieux d'Exception

## ✅ Configuration Terminée

### Architecture Implémentée

**Solution** : next-intl 4.6.0 avec Next.js 15.5.9  
**Détection automatique** : Via header `Accept-Language`  
**Langues supportées** : FR, EN, ES, DE, IT, PT

### Fichiers Créés

```
src/
├── i18n.ts                    # Configuration next-intl
├── middleware.ts              # Détection langue + sécurité (mis à jour)
messages/
├── fr.json                    # Traductions françaises (source)
├── en.json                    # Traductions anglaises
├── es.json                    # Traductions espagnoles  
├── de.json                    # Traductions allemandes
├── it.json                    # Traductions italiennes
└── pt.json                    # Traductions portugaises
```

### Comment Ça Marche ?

1. **Détection Automatique de Langue**
   - Le middleware lit le header `Accept-Language` du navigateur
   - Exemple : navigateur anglais → redirige vers `/en/`
   - Fallback vers `/fr/` si langue non supportée

2. **Routes Localisées**
   - Toutes les URLs incluent désormais la locale : `/{locale}/page`
   - Exemples :
     - `/fr/catalogue` (français)
     - `/en/catalogue` (anglais)
     - `/es/catalogue` (espagnol)

3. **Middleware Unifié**
   - Détection i18n (next-intl)
   - Headers de sécurité (CSP, HSTS, etc.)
   - Protection routes admin (avec locale)

## 🔄 Prochaines Étapes

### Phase 1 : Restructurer l'App
⚠️ **CRITIQUE** : Next.js App Router exige maintenant un dossier `[locale]`

```
src/app/
├── [locale]/                # Nouveau dossier pour routes localisées
│   ├── layout.tsx           # Layout avec IntlProvider
│   ├── page.tsx             # Homepage (déplacer depuis app/)
│   ├── catalogue/
│   ├── mariages/
│   ├── evenements-b2b/
│   ├── lieux/[slug]/
│   └── contact/
└── api/                     # API routes (PAS de locale)
```

**Actions requises** :
1. Créer `app/[locale]/layout.tsx` avec `NextIntlClientProvider`
2. Déplacer toutes les pages dans `app/[locale]/`
3. Adapter les imports/liens

### Phase 2 : Adapter les Composants

#### Navigation.tsx
```tsx
import { useTranslations } from 'next-intl';

export default function Navigation() {
  const t = useTranslations('Navigation');
  
  return (
    <Link href="/catalogue">{t('catalogue')}</Link>
    <Link href="/evenements-b2b">{t('b2b')}</Link>
    <Link href="/mariages">{t('weddings')}</Link>
  );
}
```

#### Footer.tsx
```tsx
const t = useTranslations('Footer');
return <h4>{t('navigation')}</h4>;
```

#### Pages
```tsx
// Server Component
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('Home');
  return <h1>{t('title')}</h1>;
}

// Client Component
'use client';
import { useTranslations } from 'next-intl';

export default function ClientPage() {
  const t = useTranslations('Home');
  return <h1>{t('title')}</h1>;
}
```

### Phase 3 : Contenus Dynamiques (Firestore)

Les **venues** ont besoin de traductions dynamiques dans Firestore :

```typescript
// Structure Firestore à ajouter
venues/{venueId}/
  name: "Domaine Nantais" // Non traduit (nom propre)
  i18n: {
    fr: {
      tagline: "À 10 minutes de Nantes...",
      description: "Au cœur d'un parc paysagé..."
    },
    en: {
      tagline: "10 minutes from Nantes...",
      description: "In the heart of a landscaped park..."
    }
  }
```

**Helper à créer** : `lib/i18n-firestore.ts`
```typescript
export async function getLocalizedVenue(venueId: string, locale: string) {
  const venue = await getVenueById(venueId);
  return {
    ...venue,
    tagline: venue.i18n?.[locale]?.tagline || venue.tagline,
    description: venue.i18n?.[locale]?.description || venue.description
  };
}
```

### Phase 4 : SEO Multilingue

Adapter les metadata :

```typescript
// app/[locale]/page.tsx
export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'Home' });
  
  return {
    title: t('title'),
    description: t('signature'),
    alternates: {
      canonical: `https://lieuxdexception.com/${params.locale}`,
      languages: {
        'fr': 'https://lieuxdexception.com/fr',
        'en': 'https://lieuxdexception.com/en',
        'es': 'https://lieuxdexception.com/es',
        'de': 'https://lieuxdexception.com/de',
        'it': 'https://lieuxdexception.com/it',
        'pt': 'https://lieuxdexception.com/pt'
      }
    }
  };
}
```

### Phase 5 : Sélecteur de Langue

Créer un composant pour changer manuellement de langue :

```tsx
// components/LanguageSwitcher.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, localeLabels } from '@/i18n';

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    // Remplacer la locale dans l'URL
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <select value={currentLocale} onChange={(e) => switchLocale(e.target.value)}>
      {locales.map(locale => (
        <option key={locale} value={locale}>
          {localeLabels[locale]}
        </option>
      ))}
    </select>
  );
}
```

## 📋 Checklist Déploiement

- [ ] Restructurer app/ vers app/[locale]/
- [ ] Adapter Navigation.tsx
- [ ] Adapter Footer.tsx
- [ ] Adapter toutes les pages (Home, Catalogue, B2B, Mariages)
- [ ] Créer helper `getLocalizedVenue()`
- [ ] Ajouter champs i18n dans Firestore venues
- [ ] Traduire contenus Firestore (via script ou admin)
- [ ] Adapter SEO metadata
- [ ] Créer LanguageSwitcher
- [ ] Tester détection automatique (Accept-Language)
- [ ] Tester changement manuel de langue
- [ ] Vérifier URLs canoniques et hreflang
- [ ] Build production
- [ ] Déployer

## 🔧 Commandes Utiles

```bash
# Build local
npm run build

# Dev server
npm run dev
# → Tester http://localhost:3002/fr/ et http://localhost:3002/en/

# Vérifier détection langue
curl -H "Accept-Language: en-US" http://localhost:3002/
# → Doit rediriger vers /en/

curl -H "Accept-Language: fr-FR" http://localhost:3002/
# → Doit rediriger vers /fr/
```

## 📝 Notes Importantes

### Routes Admin
Les routes admin sont désormais localisées aussi :
- `/fr/admin` (français)
- `/en/admin` (anglais)

Le middleware vérifie `pathnameWithoutLocale` pour la protection.

### API Routes
Les API routes **ne sont PAS localisées** :
- `/api/contact/submit` (pas de locale)
- `/api/admin/create-user` (pas de locale)

### Images et Assets
Les chemins d'images restent identiques (pas de traduction) :
- `/images/Vue-chateau.jpg`
- `/venues/domaine-nantais/image.webp`

### Dates et Nombres
next-intl gère automatiquement :
- Formats de dates (DD/MM/YYYY vs MM/DD/YYYY)
- Séparateurs nombres (1 000 vs 1,000)
- Devises (€ 1 200 vs €1,200.00)

## 🚀 Avantages

✅ **Détection automatique** : Pas besoin de sélecteur manuel  
✅ **URLs propres** : `/fr/mariages`, `/en/weddings`  
✅ **SEO optimisé** : hreflang automatique  
✅ **Performance** : Traductions chargées à la demande  
✅ **Maintenance** : Fichiers JSON centralisés  
✅ **Scalable** : Ajout de nouvelles langues facile

## ⚠️ Points d'Attention

- **Breaking change** : Toutes les URLs changent (redirection needed)
- **Firestore** : Besoin d'ajouter structure i18n pour contenus dynamiques
- **Admin** : Gérer interface pour traduire venues
- **Images** : Pas de traduction pour noms de fichiers (OK)
- **Forms** : Valider que validation Zod gère multi-langues

## 🔗 Ressources

- [next-intl Docs](https://next-intl-docs.vercel.app/)
- [Next.js i18n](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Traductions venues dans I18N-STRUCTURE.md](./I18N-STRUCTURE.md)
