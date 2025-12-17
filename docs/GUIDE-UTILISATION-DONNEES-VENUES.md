# 🎯 Guide d'utilisation des nouvelles données venues sur les pages publiques

## 📊 Nouvelles données disponibles

### Données structurelles
- `rooms` : nombre de salles
- `accommodationRooms` : nombre de chambres
- `detailedSpaces[]` : liste des salles avec `{name, size, unit}`
- `totalSurfaceRooms` : surface totale (m²)

### Capacités détaillées
- `capacityDetails.meeting` : capacité réunion
- `capacityDetails.uShape` : capacité salle en U
- `capacityDetails.theater` : capacité théâtre
- `capacityDetails.cabaret` : capacité cabaret
- `capacityDetails.classroom` : capacité rang d'école
- `capacityDetails.banquet` : capacité banquet
- `capacityDetails.cocktail` : capacité cocktail
- `capacityDetails.cocktailPark` : capacité cocktail dans le parc (Château Corbe)

### Services & Équipements
- `equipment[]` : liste des équipements techniques
- `activities[]` : liste des activités proposées
- `services[]` : liste des services disponibles
- `parkingSpaces` : nombre de places de parking

### Statuts
- `status` : "Nouveau", "Ouverture prochainement", etc.
- `privatizable` : boolean
- `renovationDate` : date de rénovation

---

## 🎨 Recommandations d'affichage par page

### 1. **Page individuelle du lieu** (`/[locale]/lieux/[slug]`)

#### A. Hero section - Ajouter badges de statut
```tsx
{venue.status === 'Nouveau' && (
  <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full text-sm font-medium">
    ★ Nouveau
  </span>
)}
{venue.status === 'Ouverture prochainement' && (
  <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
    Bientôt disponible
  </span>
)}
```

#### B. Sidebar "Informations pratiques" - ENRICHIR
```tsx
{/* Remplacer la section Capacité actuelle par : */}
<div>
  <div className="flex items-center gap-2 text-accent-dark font-medium mb-3">
    <Users className="w-5 h-5" />
    Capacités
  </div>
  <div className="space-y-2 text-sm">
    {venue.capacityDetails?.theater && (
      <div className="flex justify-between">
        <span className="text-secondary">Configuration théâtre</span>
        <span className="font-semibold text-primary">{venue.capacityDetails.theater} pers.</span>
      </div>
    )}
    {venue.capacityDetails?.banquet && (
      <div className="flex justify-between">
        <span className="text-secondary">Banquet</span>
        <span className="font-semibold text-primary">{venue.capacityDetails.banquet} pers.</span>
      </div>
    )}
    {venue.capacityDetails?.cocktail && (
      <div className="flex justify-between">
        <span className="text-secondary">Cocktail</span>
        <span className="font-semibold text-primary">{venue.capacityDetails.cocktail} pers.</span>
      </div>
    )}
    {venue.capacityDetails?.cocktailPark && (
      <div className="flex justify-between">
        <span className="text-secondary">Cocktail parc</span>
        <span className="font-semibold text-accent">Jusqu'à {venue.capacityDetails.cocktailPark} pers. !</span>
      </div>
    )}
  </div>
</div>

{/* Ajouter section Salles & Hébergement */}
{(venue.rooms || venue.accommodationRooms) && (
  <div className="pt-4 border-t border-neutral-200">
    <div className="flex items-center gap-2 text-accent-dark font-medium mb-3">
      <Building className="w-5 h-5" />
      Infrastructures
    </div>
    <div className="space-y-2 text-sm">
      {venue.rooms && (
        <div className="flex justify-between">
          <span className="text-secondary">Salles disponibles</span>
          <span className="font-semibold text-primary">{venue.rooms}</span>
        </div>
      )}
      {venue.accommodationRooms && (
        <div className="flex justify-between">
          <span className="text-secondary">Chambres</span>
          <span className="font-semibold text-primary">{venue.accommodationRooms}</span>
        </div>
      )}
      {venue.parkingSpaces && (
        <div className="flex justify-between">
          <span className="text-secondary">Places parking</span>
          <span className="font-semibold text-primary">{venue.parkingSpaces}</span>
        </div>
      )}
    </div>
  </div>
)}
```

#### C. Nouvelle section "Espaces détaillés" (après "Espaces disponibles")
```tsx
{venue.detailedSpaces && venue.detailedSpaces.length > 0 && (
  <section className="section bg-neutral-50">
    <div className="container">
      <h2 className="text-3xl font-display font-semibold text-primary mb-8 text-center">
        Nos salles en détail
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venue.detailedSpaces.map((space, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-neutral-200 hover:border-accent transition-colors">
            <h3 className="font-heading font-semibold text-primary text-lg mb-2">
              {space.name}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-accent">{space.size}</span>
              <span className="text-secondary">{space.unit}</span>
            </div>
            {/* Ajouter capacités si disponibles dans capacityDetails */}
          </div>
        ))}
      </div>
    </div>
  </section>
)}
```

#### D. Nouvelle section "Équipements & Services"
```tsx
{(venue.equipment?.length > 0 || venue.services?.length > 0) && (
  <section className="section">
    <div className="container">
      <h2 className="text-3xl font-display font-semibold text-primary mb-12 text-center">
        Équipements & Services
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Équipements techniques */}
        {venue.equipment && venue.equipment.length > 0 && (
          <div className="bg-white p-8 rounded-xl border border-neutral-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-primary">
                Équipements techniques
              </h3>
            </div>
            <ul className="grid grid-cols-1 gap-3">
              {venue.equipment.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-secondary">
                  <div className="w-2 h-2 bg-accent rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Services */}
        {venue.services && venue.services.length > 0 && (
          <div className="bg-white p-8 rounded-xl border border-neutral-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-primary">
                Services disponibles
              </h3>
            </div>
            <ul className="grid grid-cols-1 gap-3">
              {venue.services.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-secondary">
                  <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </section>
)}
```

#### E. Nouvelle section "Activités" (si B2B/Team-building)
```tsx
{venue.activities && venue.activities.length > 0 && (
  <section className="section bg-primary/5">
    <div className="container">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-display font-semibold text-primary mb-4">
          Activités proposées
        </h2>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          Prolongez votre événement avec des activités ludiques et fédératrices
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venue.activities.map((activity, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-neutral-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              ★
            </div>
            <h3 className="font-heading font-semibold text-primary mb-2">
              {activity}
            </h3>
          </div>
        ))}
      </div>
    </div>
  </section>
)}
```

---

### 2. **Cartes de lieux dans le catalogue** (`/[locale]/catalogue`)

#### Ajouter badges et infos clés sur les cards
```tsx
<div className="venue-card">
  {/* Badge statut en haut à droite */}
  {venue.status && (
    <div className="absolute top-4 right-4 z-10">
      <span className="px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full shadow-lg">
        {venue.status}
      </span>
    </div>
  )}
  
  {/* Image... */}
  
  {/* Infos rapides en bas de card */}
  <div className="flex items-center gap-4 text-xs text-secondary mt-2">
    {venue.rooms && (
      <span className="flex items-center gap-1">
        <Building className="w-3 h-3" />
        {venue.rooms} salles
      </span>
    )}
    {venue.accommodationRooms && (
      <span className="flex items-center gap-1">
        <Bed className="w-3 h-3" />
        {venue.accommodationRooms} chambres
      </span>
    )}
    {venue.capacityDetails?.theater && (
      <span className="flex items-center gap-1">
        <Users className="w-3 h-3" />
        jusqu'à {venue.capacityDetails.theater}
      </span>
    )}
  </div>
</div>
```

---

### 3. **Homepage** (`/[locale]/page.tsx`)

#### Section "Lieux d'Exception" - Ajouter capacités dans aperçu
```tsx
{venues.slice(0, 3).map(venue => (
  <div key={venue.id} className="venue-preview">
    {/* Image... */}
    <h3>{venue.name}</h3>
    <p className="text-sm text-secondary mb-3">{venue.tagline}</p>
    
    {/* Nouvelles données */}
    <div className="flex items-center gap-4 text-xs text-secondary">
      {venue.capacityDetails?.banquet && (
        <span>{venue.capacityDetails.banquet} pers. banquet</span>
      )}
      {venue.rooms && <span>• {venue.rooms} salles</span>}
      {venue.accommodationRooms && <span>• {venue.accommodationRooms} chambres</span>}
    </div>
  </div>
))}
```

---

### 4. **Pages B2B & Mariages**

#### Mettre en avant les capacités professionnelles
```tsx
{/* Page B2B - Section "Nos lieux pour vos événements" */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {venues.filter(v => v.eventTypes?.includes('b2b')).map(venue => (
    <div key={venue.id} className="bg-white p-6 rounded-xl">
      <h3 className="text-xl font-semibold mb-4">{venue.name}</h3>
      
      {/* Configurations professionnelles */}
      {venue.capacityDetails && (
        <div className="space-y-2 mb-4">
          {venue.capacityDetails.theater && (
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Configuration théâtre</span>
              <span className="font-semibold">{venue.capacityDetails.theater} pers.</span>
            </div>
          )}
          {venue.capacityDetails.uShape && (
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Salle en U</span>
              <span className="font-semibold">{venue.capacityDetails.uShape} pers.</span>
            </div>
          )}
          {venue.capacityDetails.classroom && (
            <div className="flex justify-between text-sm">
              <span className="text-secondary">Rang d'école</span>
              <span className="font-semibold">{venue.capacityDetails.classroom} pers.</span>
            </div>
          )}
        </div>
      )}
      
      {/* Équipements B2B essentiels */}
      {venue.equipment && (
        <div className="flex flex-wrap gap-2">
          {venue.equipment.slice(0, 4).map((eq, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">
              {eq}
            </span>
          ))}
        </div>
      )}
    </div>
  ))}
</div>
```

---

## 🎯 Priorités d'implémentation

### Haute priorité (impact UX immédiat)
1. ✅ **Page individuelle** : Ajouter capacités détaillées, salles, équipements, activités
2. ✅ **Cartes catalogue** : Badges statut, infos rapides (salles/chambres)
3. ✅ **Sidebar** : Enrichir "Informations pratiques"

### Moyenne priorité
4. Section "Espaces détaillés" avec superficies
5. Section "Équipements & Services" complète
6. Badges statut sur homepage

### Basse priorité
7. Filtres avancés dans catalogue (par nb salles, chambres, équipements)
8. Comparateur de lieux
9. Calculateur de capacité (selon type d'événement)

---

## 📝 Types TypeScript à ajouter

```typescript
// Dans types/firebase.ts

export interface DetailedSpace {
  name: string;
  size: number;
  unit: string; // "m²"
}

export interface CapacityDetails {
  meeting?: number;
  uShape?: number;
  theater?: number;
  cabaret?: number;
  classroom?: number;
  banquet?: number;
  cocktail?: number;
  cocktailPark?: number; // Pour grands espaces extérieurs
}

export interface Venue {
  // ... existing fields
  
  // Nouvelles propriétés
  rooms?: number;
  accommodationRooms?: number;
  accommodationDetails?: string;
  detailedSpaces?: DetailedSpace[];
  capacityDetails?: CapacityDetails;
  equipment?: string[];
  activities?: string[];
  services?: string[];
  parkingSpaces?: number;
  status?: 'Nouveau' | 'Ouverture prochainement' | string;
  privatizable?: boolean;
  renovationDate?: string;
  totalSurfaceRooms?: number;
}
```

---

## 🔍 SEO & Structured Data

Enrichir le structured data avec les nouvelles infos :

```typescript
// Dans lib/universalStructuredData.ts

const venueSchema = {
  "@type": "EventVenue",
  "name": venue.name,
  "maximumAttendeeCapacity": venue.capacityDetails?.banquet || venue.capacitySeated,
  "amenityFeature": [
    ...(venue.equipment?.map(eq => ({
      "@type": "LocationFeatureSpecification",
      "name": eq
    })) || []),
    ...(venue.services?.map(serv => ({
      "@type": "LocationFeatureSpecification",
      "name": serv
    })) || [])
  ],
  "containsPlace": venue.detailedSpaces?.map(space => ({
    "@type": "Room",
    "name": space.name,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": space.size,
      "unitCode": "MTK" // mètres carrés
    }
  }))
};
```

---

## ✨ Exemples visuels de différenciation

### Le Château de la Corbe (5000 pers. parc)
- **Badge spécial** : "Capacité exceptionnelle jusqu'à 5000 personnes"
- **Mise en avant** : Idéal pour méga team-building, festivals corporate

### Le Manoir de la Boulaie (11 salles)
- **Badge** : "11 espaces modulables"
- **Mise en avant** : Parfait pour événements multi-ateliers

### Le Domaine Nantais (Récent 2025)
- **Badge** : "Rénové en 2025"
- **Mise en avant** : Design moderne, équipements neufs

---

## 📊 Analytics recommandées

Tracker quelles données sont les plus consultées :
- Clics sur "Capacités détaillées"
- Consultation section "Équipements"
- Filtres utilisés dans le catalogue

Cela permettra d'optimiser l'affichage dans le temps.
