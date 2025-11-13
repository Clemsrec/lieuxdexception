# Nouvelles Fonctionnalités - Lieux d'Exception

Ce document décrit les nouvelles fonctionnalités implémentées pour améliorer l'expérience utilisateur du site catalogue B2B.

## ✅ Fonctionnalités Implémentées

### 1. Carte Interactive Google Maps (`InteractiveMap`)

**Fichier** : `src/components/InteractiveMap.tsx`

**Description** : Carte interactive affichant les 5 lieux d'exception avec markers personnalisés et InfoWindow.

**Fonctionnalités** :
- ✅ Carte Google Maps centrée sur la France
- ✅ Markers personnalisés pour chaque lieu
- ✅ InfoWindow au clic avec image, nom, localisation, capacité
- ✅ Version responsive : carte sur desktop, liste sur mobile
- ✅ Lien vers site dédié de chaque lieu

**Utilisation** :
```tsx
import InteractiveMap from '@/components/InteractiveMap';
import { getVenues } from '@/lib/firestore';

const venues = await getVenues();
<InteractiveMap venues={venues} />
```

**Configuration requise** :
- Ajouter `NEXT_PUBLIC_GOOGLE_MAPS_KEY` dans `.env.local`
- Créer un fichier `/public/marker-custom.svg` pour les markers personnalisés

---

### 2. Système de Filtres Avancés (`VenueFilters` + `VenueCatalog`)

**Fichiers** :
- `src/components/VenueFilters.tsx` - Interface de filtrage
- `src/components/VenueCatalog.tsx` - Catalogue avec logique de filtrage

**Filtres disponibles** :
- ✅ **Capacité** : 50-100, 100-200, 200-300, 300+ personnes
- ✅ **Région** : Île-de-France, Pays de la Loire, Nouvelle-Aquitaine, etc.
- ✅ **Type d'événement** : Mariage, Séminaire, Conférence, Réception, Team Building
- ✅ **Budget** : < 5000€, 5000-10000€, 10000-20000€, > 20000€

**Fonctionnalités** :
- ✅ Filtrage temps réel côté client
- ✅ Compteur de résultats
- ✅ Bouton de réinitialisation des filtres
- ✅ Message si aucun résultat

**Utilisation** :
```tsx
import VenueCatalog from '@/components/VenueCatalog';

const venues = await getVenues();
<VenueCatalog venues={venues} />
```

---

### 3. Comparateur de Lieux (`VenueComparator`)

**Fichier** : `src/components/VenueComparator.tsx`

**Description** : Interface de comparaison permettant de sélectionner jusqu'à 3 domaines et de les comparer côte à côte.

**Fonctionnalités** :
- ✅ Sélection visuelle jusqu'à 3 lieux
- ✅ Tableau comparatif détaillé :
  - Localisation
  - Capacité maximale
  - Types d'événements
  - Tarifs journée B2B
  - Hébergement (nombre de chambres)
  - Traiteur sur place
  - Parking (nombre de places)
  - Matériel audiovisuel
  - WiFi
  - Accessibilité PMR
- ✅ Boutons d'action : "Voir le site" et "Demander un devis"
- ✅ Possibilité de retirer un lieu de la comparaison

**Utilisation** :
```tsx
import VenueComparator from '@/components/VenueComparator';

const venues = await getVenues();
<VenueComparator venues={venues} />
```

---

### 4. Page Comparer (`/comparer`)

**Fichier** : `src/app/comparer/page.tsx`

**Description** : Page dédiée au comparateur avec Hero section, instructions et CTA.

**Sections** :
- ✅ Hero avec titre et description
- ✅ Instructions en 3 étapes
- ✅ Comparateur intégré
- ✅ CTA contact et téléphone

**URL** : `/comparer`

**Métadonnées SEO** :
- Title: "Comparer nos domaines | Lieux d'Exception"
- Description optimisée pour le référencement
- Keywords pertinents

---

### 5. Navigation Mise à Jour

**Fichier** : `src/components/Navigation.tsx`

**Modifications** :
- ✅ Ajout du lien "Comparer" dans le menu desktop
- ✅ Ajout du lien "Comparer les domaines" dans le menu mobile
- ✅ States actifs pour le nouveau lien

---

### 6. Structure de Données Étendue

**Fichier** : `src/types/firebase.ts`

**Nouveaux champs ajoutés à l'interface `Venue`** :
- ✅ `lat`, `lng` : Coordonnées GPS simplifiées
- ✅ `location` : Format simplifié "Loire-Atlantique (44)"
- ✅ `priceRange` : Structure alternative pour budget min/max
- ✅ `capacitySeated`, `capacityStanding` : Capacités détaillées
- ✅ `accommodation`, `accommodationRooms` : Hébergement
- ✅ `catering`, `parking`, `audioVisual`, `wifi`, `accessibility` : Équipements individuels
- ✅ `image`, `gallery` : Raccourcis médias
- ✅ `email`, `phone`, `url`, `websiteUrl` : Contact simplifié
- ✅ `rating`, `reviewsCount` : Métriques SEO

**Compatibilité** : Les nouveaux champs sont optionnels et utilisent des valeurs par défaut issues des structures existantes.

---

## 📦 Dépendances Ajoutées

```json
{
  "@react-google-maps/api": "^2.19.3"
}
```

Installé via : `npm install @react-google-maps/api`

---

## ⚙️ Configuration Requise

### Variables d'environnement

Ajouter dans `.env.local` :

```env
# Google Maps API Key (obligatoire pour InteractiveMap)
NEXT_PUBLIC_GOOGLE_MAPS_KEY=votre_clé_api_google_maps
```

**Comment obtenir une clé API Google Maps** :
1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer ou sélectionner un projet
3. Activer l'API "Maps JavaScript API"
4. Créer des identifiants → Clé API
5. Restreindre la clé aux domaines autorisés (sécurité)

### Marker personnalisé

Créer le fichier `/public/marker-custom.svg` :

```svg
<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="18" fill="#3b82f6" stroke="white" stroke-width="3"/>
  <path d="M20 10 L20 30 M10 20 L30 20" stroke="white" stroke-width="3"/>
</svg>
```

---

## 🚀 Utilisation dans les Pages

### Page d'Accueil avec Carte

```tsx
// app/page.tsx
import InteractiveMap from '@/components/InteractiveMap';
import { getVenues } from '@/lib/firestore';

export default async function HomePage() {
  const venues = await getVenues();

  return (
    <main>
      {/* ... autres sections ... */}
      
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

### Page Catalogue avec Filtres

```tsx
// app/catalogue/page.tsx
import VenueCatalog from '@/components/VenueCatalog';
import { getVenues } from '@/lib/firestore';

export default async function CataloguePage() {
  const venues = await getVenues();

  return (
    <main>
      <section className="py-12">
        <div className="section-container">
          <h1 className="text-4xl font-bold mb-8">Notre Catalogue</h1>
          <VenueCatalog venues={venues} />
        </div>
      </section>
    </main>
  );
}
```

---

## 📝 Prochaines Étapes

### Optimisations à Faire

1. **Images Next.js** : Remplacer les balises `<img>` par `<Image />` de Next.js pour optimisation automatique
2. **Lazy Loading** : Charger Google Maps uniquement quand visible (Intersection Observer)
3. **Cache** : Implémenter cache pour les venues avec SWR ou React Query
4. **Animation** : Ajouter transitions lors du filtrage et de la sélection

### Améliorations Fonctionnelles

1. **Sauvegarde de comparaison** : Permettre de partager ou sauvegarder une comparaison
2. **Export PDF** : Générer un PDF du tableau comparatif
3. **Favoris** : Système de favoris pour marquer les lieux préférés
4. **Calendrier de disponibilité** : Afficher les disponibilités sur la carte

### Données à Ajouter

1. **Enrichir Firestore** :
   - Ajouter `lat`, `lng` pour chaque lieu existant
   - Compléter `priceRange`, `accommodationRooms`, `parking`
   - Ajouter `rating` et `reviewsCount`

2. **Créer marker personnalisé** : Design du fichier SVG marker-custom.svg

---

## 🐛 Debug & Troubleshooting

### Carte ne s'affiche pas

**Problème** : Erreur "NEXT_PUBLIC_GOOGLE_MAPS_KEY is undefined"

**Solution** :
1. Vérifier que `.env.local` contient la clé
2. Redémarrer le serveur dev : `npm run dev`
3. Vérifier que la clé est valide dans Google Cloud Console

### Filtres ne fonctionnent pas

**Problème** : Aucun résultat malgré les filtres

**Solution** :
1. Vérifier que les données Firestore ont les champs requis (`capacity.max`, `address.region`, `eventTypes`, `pricing`)
2. Vérifier la console pour les erreurs JavaScript
3. Tester avec `console.log(filteredVenues)` dans `handleFilterChange`

### Comparateur bloqué à 3 lieux

**Comportement normal** : Maximum 3 lieux pour une meilleure lisibilité du tableau.

**Pour modifier** : Changer `selectedVenues.length < 3` en `selectedVenues.length < N` dans `VenueComparator.tsx`

---

## 📊 Métriques de Succès

### Analytics à Suivre

- Nombre de visites sur `/comparer`
- Taux d'utilisation du comparateur (sélection > 0 lieux)
- Taux de conversion comparateur → demande de devis
- Filtres les plus utilisés
- Clics sur les markers de la carte

### KPIs Attendus

- **Engagement** : +30% temps sur le site
- **Conversion** : +15% demandes de devis
- **UX** : Réduction du taux de rebond sur catalogue

---

**Date de mise en place** : 11 novembre 2025  
**Version** : 1.0  
**Mainteneur** : Équipe Technique Groupe Riou
