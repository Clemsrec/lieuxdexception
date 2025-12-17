Idée complémentaires :
Ah parfait ! Alors concentrons-nous sur les **fonctionnalités concrètes à intégrer** dans votre site catalogue B2B pour surpasser le concurrent, maintenant que vous avez déjà commencé le développement ! 🚀

## Fonctionnalités à intégrer au site catalogue B2B

### 1. **Carte interactive (Page d'accueil)**

**Implémentation avec Google Maps API :**

```jsx
// components/InteractiveMap.jsx
'use client';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

const mapStyles = {
  height: "500px",
  width: "100%"
};

const InteractiveMap = ({ venues }) => {
  const [selected, setSelected] = useState(null);
  
  const center = {
    lat: 47.0, // Centre France
    lng: 2.0
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={6}
        center={center}
      >
        {venues.map((venue) => (
          <Marker
            key={venue.id}
            position={{ lat: venue.lat, lng: venue.lng }}
            onClick={() => setSelected(venue)}
            icon={{
              url: '/marker-custom.svg', // Marker personnalisé
              scaledSize: { width: 40, height: 40 }
            }}
          />
        ))}
        
        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
          >
            <div className="p-2">
              <img src={selected.image} className="w-48 h-32 object-cover rounded mb-2" />
              <h3 className="font-bold">{selected.name}</h3>
              <p className="text-sm text-gray-600">{selected.location}</p>
              <p className="text-sm">Capacité: {selected.capacity}</p>
              <a 
                href={selected.url} 
                className="text-blue-600 text-sm hover:underline mt-2 inline-block"
              >
                Découvrir ce lieu →
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default InteractiveMap;
```

**Layout de la section :**
```jsx
// app/[locale]/page.jsx - Section carte
<section className="py-16 bg-gray-50">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-4">
      {t('catalog.mapTitle')} {/* "Nos domaines en France" */}
    </h2>
    <p className="text-center text-gray-600 mb-8">
      {t('catalog.mapSubtitle')} {/* "5 lieux d'exception..." */}
    </p>
    <InteractiveMap venues={venues} />
  </div>
</section>
```

---

### 2. **Système de filtres avancés**

**Interface de filtrage :**

```jsx
// components/VenueFilters.jsx
'use client';
import { useState } from 'react';

const VenueFilters = ({ onFilterChange, venues }) => {
  const [filters, setFilters] = useState({
    capacity: '',
    region: '',
    eventType: '',
    budget: ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-bold mb-4">Filtrer les domaines</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Capacité */}
        <div>
          <label className="block text-sm font-medium mb-2">Capacité</label>
          <select 
            className="w-full border rounded-lg p-2"
            value={filters.capacity}
            onChange={(e) => handleFilterChange('capacity', e.target.value)}
          >
            <option value="">Toutes capacités</option>
            <option value="50-100">50-100 personnes</option>
            <option value="100-200">100-200 personnes</option>
            <option value="200-300">200-300 personnes</option>
            <option value="300+">300+ personnes</option>
          </select>
        </div>

        {/* Région */}
        <div>
          <label className="block text-sm font-medium mb-2">Région</label>
          <select 
            className="w-full border rounded-lg p-2"
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
          >
            <option value="">Toutes régions</option>
            <option value="ile-de-france">Île-de-France</option>
            <option value="pays-de-loire">Pays de la Loire</option>
            <option value="nouvelle-aquitaine">Nouvelle-Aquitaine</option>
            <option value="provence">Provence-Alpes-Côte d'Azur</option>
          </select>
        </div>

        {/* Type d'événement */}
        <div>
          <label className="block text-sm font-medium mb-2">Type d'événement</label>
          <select 
            className="w-full border rounded-lg p-2"
            value={filters.eventType}
            onChange={(e) => handleFilterChange('eventType', e.target.value)}
          >
            <option value="">Tous types</option>
            <option value="mariage">Mariage</option>
            <option value="seminaire">Séminaire</option>
            <option value="conference">Conférence</option>
            <option value="cocktail">Cocktail</option>
            <option value="team-building">Team Building</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium mb-2">Budget</label>
          <select 
            className="w-full border rounded-lg p-2"
            value={filters.budget}
            onChange={(e) => handleFilterChange('budget', e.target.value)}
          >
            <option value="">Tous budgets</option>
            <option value="0-5000">- de 5 000€</option>
            <option value="5000-10000">5 000€ - 10 000€</option>
            <option value="10000-20000">10 000€ - 20 000€</option>
            <option value="20000+">+ de 20 000€</option>
          </select>
        </div>
      </div>

      {/* Reset button */}
      <button 
        className="mt-4 text-blue-600 hover:text-blue-800"
        onClick={() => {
          setFilters({ capacity: '', region: '', eventType: '', budget: '' });
          onFilterChange({ capacity: '', region: '', eventType: '', budget: '' });
        }}
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
};

export default VenueFilters;
```

**Logique de filtrage :**

```jsx
// components/VenueCatalog.jsx
'use client';
import { useState } from 'react';
import VenueFilters from './VenueFilters';
import VenueCard from './VenueCard';

const VenueCatalog = ({ venues }) => {
  const [filteredVenues, setFilteredVenues] = useState(venues);

  const handleFilterChange = (filters) => {
    let filtered = [...venues];

    // Filtre capacité
    if (filters.capacity) {
      const [min, max] = filters.capacity.split('-').map(v => 
        v === '+' ? Infinity : parseInt(v)
      );
      filtered = filtered.filter(v => 
        v.capacity >= min && (max ? v.capacity <= max : true)
      );
    }

    // Filtre région
    if (filters.region) {
      filtered = filtered.filter(v => v.region === filters.region);
    }

    // Filtre type événement
    if (filters.eventType) {
      filtered = filtered.filter(v => 
        v.eventTypes.includes(filters.eventType)
      );
    }

    // Filtre budget
    if (filters.budget) {
      const [min, max] = filters.budget.split('-').map(v => 
        v === '+' ? Infinity : parseInt(v)
      );
      filtered = filtered.filter(v => 
        v.priceRange.min >= min && (max ? v.priceRange.max <= max : true)
      );
    }

    setFilteredVenues(filtered);
  };

  return (
    <div>
      <VenueFilters onFilterChange={handleFilterChange} venues={venues} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.length > 0 ? (
          filteredVenues.map(venue => (
            <VenueCard key={venue.id} venue={venue} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucun domaine ne correspond à vos critères.
            </p>
            <button 
              onClick={() => handleFilterChange({})}
              className="mt-4 text-blue-600 hover:underline"
            >
              Voir tous les domaines
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueCatalog;
```

---

### 3. **Comparateur de lieux**

**Interface de comparaison :**

```jsx
// components/VenueComparator.jsx
'use client';
import { useState } from 'react';

const VenueComparator = ({ venues }) => {
  const [selectedVenues, setSelectedVenues] = useState([]);

  const toggleVenue = (venue) => {
    if (selectedVenues.find(v => v.id === venue.id)) {
      setSelectedVenues(selectedVenues.filter(v => v.id !== venue.id));
    } else if (selectedVenues.length < 3) {
      setSelectedVenues([...selectedVenues, venue]);
    }
  };

  return (
    <div>
      {/* Sélection des lieux */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">
          Sélectionnez jusqu'à 3 domaines à comparer
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {venues.map(venue => (
            <button
              key={venue.id}
              onClick={() => toggleVenue(venue)}
              className={`p-4 border-2 rounded-lg transition ${
                selectedVenues.find(v => v.id === venue.id)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              disabled={selectedVenues.length >= 3 && !selectedVenues.find(v => v.id === venue.id)}
            >
              <img 
                src={venue.image} 
                className="w-full h-24 object-cover rounded mb-2"
                alt={venue.name}
              />
              <p className="font-medium text-sm">{venue.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tableau comparatif */}
      {selectedVenues.length >= 2 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left font-medium">Critères</th>
                {selectedVenues.map(venue => (
                  <th key={venue.id} className="p-4 text-center">
                    <img 
                      src={venue.image} 
                      className="w-full h-32 object-cover rounded mb-2"
                      alt={venue.name}
                    />
                    <p className="font-bold">{venue.name}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Localisation" values={selectedVenues.map(v => v.location)} />
              <CompareRow label="Capacité max" values={selectedVenues.map(v => `${v.capacity} pers.`)} />
              <CompareRow label="Type d'événements" values={selectedVenues.map(v => v.eventTypes.join(', '))} />
              <CompareRow label="Tarif journée" values={selectedVenues.map(v => `${v.priceRange.min}-${v.priceRange.max}€`)} />
              <CompareRow label="Hébergement" values={selectedVenues.map(v => v.accommodation ? '✅ Oui' : '❌ Non')} />
              <CompareRow label="Traiteur sur place" values={selectedVenues.map(v => v.catering ? '✅ Oui' : '❌ Non')} />
              <CompareRow label="Parking" values={selectedVenues.map(v => `${v.parking} places`)} />
              
              {/* Boutons CTA */}
              <tr>
                <td className="p-4 font-medium">Action</td>
                {selectedVenues.map(venue => (
                  <td key={venue.id} className="p-4 text-center">
                    <a 
                      href={venue.url}
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2"
                    >
                      Voir le site
                    </a>
                    <br />
                    <a 
                      href={`/contact?venue=${venue.id}`}
                      className="inline-block border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
                    >
                      Demander un devis
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const CompareRow = ({ label, values }) => (
  <tr className="border-t">
    <td className="p-4 font-medium bg-gray-50">{label}</td>
    {values.map((value, idx) => (
      <td key={idx} className="p-4 text-center">{value}</td>
    ))}
  </tr>
);

export default VenueComparator;
```

---

### 4. **Structure de données Firestore**

```javascript
// firestore structure
venues: {
  venue_1: {
    id: "venue_1",
    name: "Château de...",
    slug: "chateau-de-...",
    region: "pays-de-loire",
    location: "Loire-Atlantique (44)",
    lat: 47.2173,
    lng: -1.5534,
    
    // Capacités
    capacity: 200,
    capacitySeated: 150,
    capacityStanding: 200,
    
    // Types d'événements acceptés
    eventTypes: ["mariage", "seminaire", "conference", "cocktail"],
    
    // Tarification
    priceRange: {
      min: 5000,
      max: 15000,
      currency: "EUR"
    },
    
    // Équipements
    accommodation: true,
    accommodationRooms: 12,
    catering: true,
    parking: 50,
    audioVisual: true,
    wifi: true,
    accessibility: true,
    
    // Médias
    image: "/venues/venue1/main.jpg",
    gallery: [
      "/venues/venue1/photo1.jpg",
      "/venues/venue1/photo2.jpg",
    ],
    
    // URLs
    url: "https://venue1.grouperiou.com",
    websiteUrl: "https://venue1.grouperiou.com",
    
    // Contact
    email: "contact@venue1.com",
    phone: "+33 X XX XX XX XX",
    
    // SEO
    featured: true,
    rating: 4.8,
    reviewsCount: 124
  }
}
```

---

### 5. **Page dédiée au comparateur**

```jsx
// app/[locale]/comparer/page.jsx
import VenueComparator from '@/components/VenueComparator';
import { getVenues } from '@/lib/firestore';

export default async function ComparePage({ params: { locale } }) {
  const venues = await getVenues();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Comparez nos domaines
        </h1>
        <p className="text-xl text-gray-600">
          Trouvez le lieu idéal pour votre événement en comparant nos Domaines d'Exception
        </p>
      </div>
      
      <VenueComparator venues={venues} />
    </div>
  );
}
```

---

### 6. **Optimisation mobile de la carte**

```jsx
// components/InteractiveMap.jsx - Version mobile optimisée
'use client';
import { useState, useEffect } from 'react';

const InteractiveMap = ({ venues }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  if (isMobile) {
    // Version liste sur mobile
    return (
      <div className="space-y-4">
        {venues.map(venue => (
          <div key={venue.id} className="bg-white rounded-lg shadow p-4 flex gap-4">
            <img 
              src={venue.image} 
              className="w-24 h-24 object-cover rounded"
              alt={venue.name}
            />
            <div className="flex-1">
              <h3 className="font-bold">{venue.name}</h3>
              <p className="text-sm text-gray-600">{venue.location}</p>
              <p className="text-sm">Capacité: {venue.capacity}</p>
              <a 
                href={venue.url}
                className="text-blue-600 text-sm hover:underline mt-1 inline-block"
              >
                Découvrir →
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Version carte desktop
  return <GoogleMap ... />;
};
```

---

## Navigation suggérée pour le site catalogue

```
Header:
- Accueil
- Nos Domaines (avec dropdown des 5 lieux)
- Événements B2B
- Mariages
- Comparer les domaines  👈 NOUVEAU
- Contact

Footer:
- Liens vers les 5 sites dédiés
- Carte interactive (mini version)
- Réseaux sociaux
- Mentions légales
```

---

## Checklist d'implémentation

### Cette semaine (priorité haute)
- [ ] Intégrer Google Maps API
- [ ] Créer la carte interactive avec markers
- [ ] Implémenter les filtres (capacité, région, type, budget)
- [ ] Créer la page comparateur
- [ ] Tester responsive mobile/desktop

### Semaine prochaine
- [ ] Affiner le design du comparateur
- [ ] Ajouter animations au hover des markers
- [ ] Optimiser le chargement de la carte
- [ ] Tests utilisateurs

---

Vous voulez que je vous aide à implémenter une de ces fonctionnalités en particulier ? Ou vous avez besoin d'ajustements sur le code proposé ?