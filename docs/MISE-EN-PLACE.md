# 🚀 Mise en Place des Nouvelles Fonctionnalités

## Résumé des Fonctionnalités Ajoutées

✅ **Carte Interactive Google Maps** - Visualisation géographique des 5 domaines  
✅ **Système de Filtres Avancés** - Filtrage par capacité, région, type, budget  
✅ **Comparateur de Lieux** - Comparaison détaillée jusqu'à 3 domaines  
✅ **Page Dédiée /comparer** - Interface complète de comparaison  
✅ **Navigation Mise à Jour** - Nouveau lien "Comparer"  
✅ **Structure de Données Étendue** - Nouveaux champs Firestore

## 📋 Checklist d'Installation

### 1. Vérifier les Fichiers Créés

- [ ] `src/components/InteractiveMap.tsx` - Carte Google Maps
- [ ] `src/components/VenueFilters.tsx` - Composant de filtres
- [ ] `src/components/VenueCatalog.tsx` - Catalogue avec filtrage
- [ ] `src/components/VenueComparator.tsx` - Comparateur de lieux
- [ ] `src/app/comparer/page.tsx` - Page de comparaison
- [ ] `src/types/firebase.ts` - Types mis à jour
- [ ] `src/components/Navigation.tsx` - Navigation mise à jour
- [ ] `public/marker-custom.svg` - Marker personnalisé
- [ ] `docs/NOUVELLES-FONCTIONNALITES.md` - Documentation
- [ ] `docs/GOOGLE-MAPS-SETUP.md` - Guide Google Maps
- [ ] `docs/firestore-example-data.json` - Données exemple

### 2. Installer les Dépendances

```bash
npm install
```

La dépendance `@react-google-maps/api` est déjà ajoutée dans `package.json`.

### 3. Configurer Google Maps API

**Étape 3.1 : Obtenir une clé API**

Suivre le guide détaillé : [`docs/GOOGLE-MAPS-SETUP.md`](./docs/GOOGLE-MAPS-SETUP.md)

En résumé :
1. Créer un projet sur [Google Cloud Console](https://console.cloud.google.com/)
2. Activer "Maps JavaScript API"
3. Créer une clé API
4. Restreindre la clé (domaines + APIs)

**Étape 3.2 : Ajouter la clé dans .env.local**

Créer/modifier `.env.local` à la racine :

```env
# Configuration Firebase existante
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# ... autres configs Firebase ...

# Nouvelle configuration Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_KEY=votre_clé_api_google_maps_ici
```

⚠️ **Important** : Ne jamais committer `.env.local` (déjà dans `.gitignore`)

### 4. Importer les Données Exemple

**Option A : Via script automatique** (recommandé)

```bash
node scripts/import-example-data.js
```

**Option B : Manuellement via Firebase Console**

1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionner le projet `lieux-d-exceptions`
3. Firestore Database → Données
4. Importer depuis `docs/firestore-example-data.json`

**Option C : Via émulateur local**

```bash
# Démarrer l'émulateur
firebase emulators:start --only firestore

# Dans un autre terminal
node scripts/import-example-data.js
```

### 5. Démarrer le Serveur de Développement

```bash
npm run dev
```

Ouvrir http://localhost:3002

### 6. Tester les Nouvelles Fonctionnalités

- [ ] **Page d'accueil** : Carte interactive visible (si ajoutée)
- [ ] **`/catalogue`** : Filtres fonctionnels, résultats se mettent à jour
- [ ] **`/comparer`** : Sélection de lieux, tableau comparatif s'affiche
- [ ] **Navigation** : Lien "Comparer" présent et fonctionnel
- [ ] **Mobile** : Version mobile de la carte (liste) fonctionne

## 🎯 Utilisation dans Vos Pages

### Ajouter la Carte sur la Page d'Accueil

**Fichier** : `src/app/page.tsx`

```tsx
import InteractiveMap from '@/components/InteractiveMap';
import { getVenues } from '@/lib/firestore';

export default async function HomePage() {
  const venues = await getVenues();

  return (
    <main>
      {/* ... sections existantes ... */}
      
      {/* Nouvelle section carte */}
      <section className="py-16 bg-gray-50">
        <div className="section-container">
          <h2 className="text-3xl font-bold text-center mb-4">
            Nos domaines en France
          </h2>
          <p className="text-center text-gray-600 mb-8">
            5 lieux d'exception répartis dans toute la France
          </p>
          <InteractiveMap venues={venues} />
        </div>
      </section>
    </main>
  );
}
```

### Remplacer le Catalogue par le Nouveau Système

**Fichier** : `src/app/catalogue/page.tsx`

```tsx
import VenueCatalog from '@/components/VenueCatalog';
import { getVenues } from '@/lib/firestore';

export default async function CataloguePage() {
  const venues = await getVenues();

  return (
    <main>
      <section className="py-12">
        <div className="section-container">
          <h1 className="text-4xl font-bold mb-2">Notre Catalogue</h1>
          <p className="text-gray-600 mb-8">
            Découvrez nos {venues.length} domaines d'exception
          </p>
          
          {/* Nouveau catalogue avec filtres */}
          <VenueCatalog venues={venues} />
        </div>
      </section>
    </main>
  );
}
```

## 📊 Prochaines Étapes

### Optimisations Recommandées

1. **Images Next.js** : Remplacer `<img>` par `<Image />`
   ```tsx
   import Image from 'next/image';
   <Image src={venue.image} width={400} height={300} alt={venue.name} />
   ```

2. **Données Réelles** : Enrichir Firestore avec vos 5 vrais domaines
   - Ajouter coordonnées GPS (`lat`, `lng`)
   - Compléter `priceRange`, `accommodationRooms`, `parking`
   - Ajouter `rating` et `reviewsCount`

3. **SEO** : Ajouter schema.org pour les lieux
   ```tsx
   <script type="application/ld+json">
     {JSON.stringify({
       "@context": "https://schema.org",
       "@type": "EventVenue",
       "name": venue.name,
       // ...
     })}
   </script>
   ```

### Améliorations Futures

- [ ] **Export PDF** : Générer PDF du comparateur
- [ ] **Favoris** : Système de favoris utilisateur
- [ ] **Partage** : Partager une comparaison par lien
- [ ] **Calendrier** : Afficher disponibilités sur la carte
- [ ] **Analytics** : Tracker utilisation filtres et comparateur

## 🐛 Résolution de Problèmes

### Carte ne s'affiche pas

**Symptôme** : Erreur "NEXT_PUBLIC_GOOGLE_MAPS_KEY is undefined"

**Solution** :
```bash
# 1. Vérifier .env.local
cat .env.local | grep GOOGLE_MAPS

# 2. Redémarrer le serveur
npm run dev
```

### Filtres ne fonctionnent pas

**Symptôme** : Aucun résultat avec filtres actifs

**Solution** : Vérifier que les données Firestore ont les champs requis :
- `capacity.max`
- `address.region`
- `eventTypes` (array)
- `pricing` ou `priceRange`

### Erreur de compilation TypeScript

**Symptôme** : Erreurs de types dans les composants

**Solution** :
```bash
# Vérifier les types
npx tsc --noEmit

# Si erreur "Property 'lat' does not exist"
# → Vérifier que types/firebase.ts est bien mis à jour
```

## 📚 Documentation

- **Guide complet** : [`docs/NOUVELLES-FONCTIONNALITES.md`](./docs/NOUVELLES-FONCTIONNALITES.md)
- **Google Maps Setup** : [`docs/GOOGLE-MAPS-SETUP.md`](./docs/GOOGLE-MAPS-SETUP.md)
- **Données exemple** : [`docs/firestore-example-data.json`](./docs/firestore-example-data.json)

## 🎓 Ressources Externes

- [React Google Maps API Docs](https://react-google-maps-api-docs.netlify.app/)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

## 🤝 Support

En cas de problème :

1. Vérifier la console navigateur pour erreurs JavaScript
2. Vérifier la console terminal pour erreurs serveur
3. Consulter [`docs/NOUVELLES-FONCTIONNALITES.md`](./docs/NOUVELLES-FONCTIONNALITES.md)
4. Vérifier les logs Firebase dans la console

---

**Date d'implémentation** : 11 novembre 2025  
**Version** : 1.0  
**Développé pour** : Groupe Riou - Lieux d'Exception
