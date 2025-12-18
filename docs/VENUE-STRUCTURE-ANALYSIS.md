# RAPPORT D'ANALYSE COMPLÈTE - STRUCTURE VENUES

## 📊 Vue d'ensemble

- **Total de champs trouvés** : 140 champs uniques
- **Nombre de venues analysées** : 5
- **Taux de complétude moyen** : ~65% (certains champs présents dans seulement 20-40% des lieux)

---

## 🗂️ CATÉGORISATION DES CHAMPS

### 1. INFORMATIONS DE BASE (6 champs - 100% présents)

| Champ | Type | Usage | Priorité |
|-------|------|-------|----------|
| `name` | string | Nom complet du lieu | ⭐⭐⭐ CRITIQUE |
| `slug` | string | URL-friendly identifier | ⭐⭐⭐ CRITIQUE |
| `tagline` | string | Accroche courte | ⭐⭐⭐ CRITIQUE |
| `description` | string | Description complète | ⭐⭐⭐ CRITIQUE |
| `shortDescription` | string | Description courte (40%) | ⭐⭐ IMPORTANT |
| `experienceText` | string | Texte expérience client (60%) | ⭐⭐ IMPORTANT |

**Recommandation** : Tous obligatoires dans le formulaire d'édition.

---

### 2. LOCALISATION (11 champs)

#### Champs simples (100% présents)
- `location` : string - Format "Département (XX)"
- `region` : string - Slug région (60%)

#### Objet `address` (100% présent mais incomplet)
```typescript
{
  street: string,        // 20%
  city: string,          // 20%
  postalCode: string,    // 20%
  department: string,    // 20%
  region: string,        // 20%
  country: string,       // 20%
  coordinates: {         // 20%
    lat: number,
    lng: number
  }
}
```

#### Coordonnées racine (100%)
- `lat` : number
- `lng` : number

**⚠️ PROBLÈME** : Duplication `address.coordinates` vs `lat/lng` racine. Seulement 20% ont l'objet address complet.

**Recommandation** : 
1. Utiliser `lat/lng` en racine (présent partout)
2. Formulaire : champs séparés pour adresse (rue, ville, CP, pays)
3. Générer automatiquement le champ `location` depuis département

---

### 3. CAPACITÉS (15 champs)

#### Champs simples (100% présents)
- `capacitySeated` : number - Capacité assis
- `capacityStanding` : number - Capacité debout

#### Champs optionnels
- `capacityMin` : number (60%)
- `capacityMax` : number - via `capacity.max` (80%)

#### Objet `capacity` (80%)
```typescript
{
  min: number,
  max: number,
  cocktail: number,    // 20%
  seated: number,      // 20%
  theater: number,     // 20%
  classroom: number    // 20%
}
```

#### Objet `capacityDetails` (80%)
```typescript
{
  meeting: number,
  uShape: number,
  theater: number,
  cabaret: number,
  classroom: number | null,
  banquet: number,
  cocktail: number | null
}
```

**⚠️ PROBLÈME** : Triple duplication (champs racine, `capacity`, `capacityDetails`).

**Recommandation** : Formulaire avec sections :
- **Capacités générales** : `capacityMin`, `capacityMax`, `capacitySeated`, `capacityStanding`
- **Configurations détaillées** (optionnel) : Theater, U-Shape, Banquet, Cocktail, Classroom, Meeting

---

### 4. TARIFICATION (11 champs)

#### Champ simple
- `priceRange` : string - "premium" | "mid-range" | etc. (60%)

#### Objet `pricing` (80%)
```typescript
{
  b2b: {
    halfDay: number,
    fullDay: number,
    evening: number
  },
  wedding: {
    reception: number,
    ceremony: number,
    weekend: number
  },
  currency: string  // "EUR"
}
```

**Recommandation** : Formulaire avec :
- Gamme de prix (select: Premium, Standard, Budget)
- Tarifs B2B : Demi-journée, Journée complète, Soirée
- Tarifs Mariage : Réception, Cérémonie, Week-end
- Devise (défaut EUR)

---

### 5. IMAGES (13 champs)

#### Champs simples (100% présents)
- `heroImage` : string - Image hero principale
- `cardImage` : string - Image carte/thumbnail
- `gallery` : string[] - Galerie d'images
- `image` : string - Alias de heroImage

#### Objet `images` (100% mais incomplet)
```typescript
{
  hero: string,         // 20%
  heroImage: string,    // 20%
  cardImage: string,    // 20%
  thumbnail: string,    // 20%
  gallery: string[]     // 20%
}
```

#### Autres
- `heroImages` : string[] (20%)
- `featuredImage` : string (20%)

**⚠️ PROBLÈME** : Multiples alias et duplications.

**Recommandation** : Formulaire avec :
- **Image Hero** : Upload/sélecteur depuis Firebase Storage
- **Image Carte** : Upload/sélecteur (thumbnail liste)
- **Galerie** : Upload multiple + drag & drop pour réorganiser
- Stocker dans `images.hero`, `images.cardImage`, `images.gallery`

---

### 6. SEO (4 champs - 80%)

```typescript
seo: {
  title: string,
  description: string,
  keywords: string[]
}
```

**Recommandation** : Section SEO avec auto-génération :
- Titre : Généré depuis `name` + type + région
- Description : Généré depuis `shortDescription`
- Keywords : Tags suggérés (lieu, type événement, région)

---

### 7. SERVICES & ÉQUIPEMENTS (18 champs)

#### Arrays simples
- `amenities` : string[] (60%) - "Parc", "Orangerie", etc.
- `amenitiesList` : string[] (40%)
- `equipment` : string[] (80%) - "Wifi", "Vidéoprojecteur", etc.
- `services` : string[] (60%) - "Parking", "Cuisine traiteur", etc.
- `spaces` : string[] (60%) - Liste des espaces disponibles

#### Objet `features` (40%)
```typescript
{
  espaces: string[],
  equipements: string[],
  services: string[]
}
```

#### Array d'objets `detailedSpaces` (80%)
```typescript
[{
  name: string,
  size: number,
  unit: string  // "m²"
}]
```

**⚠️ PROBLÈME** : Duplication `amenities` vs `amenitiesList`, `equipment` éparpillé.

**Recommandation** : Formulaire avec :
- **Équipements** : Checkboxes (Wifi, Vidéoprojecteur, Son, etc.)
- **Services** : Checkboxes (Parking, Traiteur, PMR, etc.)
- **Espaces disponibles** : Liste dynamique avec nom + taille (m²)

---

### 8. CONTACTS (13 champs)

#### Champs racine (100%)
- `emailB2B` : string
- `emailMariages` : string
- `phoneB2B` : string
- `phoneMariages` : string

#### Champs legacy
- `email` : string (100%)
- `phone` : string (40%)

#### Objet `contact` (100% mais incomplet)
```typescript
{
  email: string,           // 20%
  phone: string,           // 20%
  emailMariages: string,   // 20%
  phoneMariages: string,   // 20%
  website: string,         // 20%
  instagram: string,       // 20%
  mariagesNet: string      // 20%
}
```

#### URLs externes
- `externalUrl` : string (100%)
- `url` : string (100%)
- `websiteUrl` : string (40%)

**⚠️ PROBLÈME** : Trop de duplications.

**Recommandation** : Formulaire avec :
- **B2B** : Email, Téléphone
- **Mariages** : Email, Téléphone
- **Web** : Site web principal
- **Réseaux sociaux** : Instagram, Mariages.net

---

### 9. MÉTADONNÉES SYSTÈME (7 champs - 100%)

- `active` : boolean - Lieu actif/inactif
- `featured` : boolean - Mis en avant
- `displayOrder` : number - Ordre d'affichage
- `createdAt` : Timestamp
- `updatedAt` : string
- `deleted` : boolean (à ajouter)
- `deletedAt` : string (à ajouter)

**Recommandation** : 
- `active` et `featured` dans un onglet "Publication"
- `displayOrder` pour réorganiser la liste
- Dates en lecture seule

---

### 10. CHAMPS ADDITIONNELS IMPORTANTS (32 champs)

#### Hébergement
- `accommodationRooms` : number (100%) - Nombre de chambres
- `accommodationDetails` : string (40%)
- `accommodation` : object (60%)
  ```typescript
  {
    onSite: boolean,
    nearby: boolean,
    description: string
  }
  ```

#### Restauration
- `catering` : object (60%)
  ```typescript
  {
    inHouse: boolean,
    external: boolean,
    partnersAvailable: boolean,
    description: string
  }
  ```

#### Cérémonie (mariages)
- `ceremony` : object (20%)
  ```typescript
  {
    outdoor: boolean,
    indoor: boolean,
    description: string
  }
  ```

#### Stationnement
- `parking` : object (60%)
  ```typescript
  {
    available: boolean,
    spaces: number,
    description: string
  }
  ```
- `parkingSpaces` : number (20%)

#### Accessibilité & Services
- `accessibility` : boolean (40%) - PMR
- `audioVisual` : boolean (40%)
- `wifi` : boolean (40%)
- `privatizable` : boolean (20%)

#### Marketing
- `rating` : number (100%) - Note moyenne
- `reviewCount` / `reviewsCount` : number (40%/60%)
- `highlights` : string[] (40%) - Points forts
- `uniqueSellingPoints` : string[] (20%)
- `certifications` : string[] (20%)
- `displayStatus` / `status` : string (40%/60%) - "Nouveau", etc.
- `style` : string[] (20%) - ["historique", "elegant", "champetre"]

#### Divers
- `activities` : string[] (60%) - Activités disponibles
- `rooms` : number (80%) - Nombre de salles
- `totalSurfaceRooms` : number (20%)
- `renovationDate` : string (20%)
- `longDescription` : string (40%)

---

## 🎯 RECOMMANDATIONS POUR LE FORMULAIRE D'ÉDITION

### STRUCTURE PROPOSÉE (Tabs/Sections)

#### ✅ 1. INFORMATIONS GÉNÉRALES (Obligatoire)
- Nom du lieu **\***
- Slug (URL) **\*** - Auto-généré avec édition manuelle
- Tagline (accroche) **\***
- Description courte
- Description complète **\***
- Texte expérience client

#### ✅ 2. LOCALISATION
- Adresse complète (rue, ville, CP, département, pays)
- Coordonnées GPS (lat/lng) - Avec sélecteur carte
- Région (select)

#### ✅ 3. CAPACITÉS & ESPACES
- **Capacités générales**
  - Min/Max personnes
  - Capacité assis
  - Capacité debout
  
- **Configurations spécifiques** (optionnel)
  - Theater, U-Shape, Banquet, Cocktail, Classroom, Meeting
  
- **Espaces détaillés** (liste dynamique)
  - Nom espace + Taille (m²)

#### ✅ 4. TARIFICATION
- Gamme de prix (Premium/Standard/Budget)
- **Tarifs B2B**
  - Demi-journée
  - Journée complète
  - Soirée
- **Tarifs Mariage**
  - Réception
  - Cérémonie
  - Week-end

#### ✅ 5. IMAGES & MÉDIAS
- Image Hero **\*** - Upload Firebase Storage
- Image Carte (thumbnail) **\***
- Galerie (multi-upload + drag & drop pour ordre)

#### ✅ 6. ÉQUIPEMENTS & SERVICES
- **Équipements** (checkboxes)
  - Wifi, Vidéoprojecteur, Son, Écran, Micro, etc.
  
- **Services** (checkboxes)
  - Parking (+ nombre de places), Cuisine traiteur, Accès PMR, etc.
  
- **Espaces** (tags)
  - Orangerie, Terrasse, Parc, Salle de réunion, etc.

#### ✅ 7. HÉBERGEMENT & RESTAURATION
- **Hébergement**
  - Nombre de chambres
  - Sur place (oui/non)
  - À proximité (oui/non)
  - Détails
  
- **Restauration/Traiteur**
  - En interne (oui/non)
  - Externe autorisé (oui/non)
  - Partenaires disponibles (oui/non)
  - Description

#### ✅ 8. INFORMATIONS MARIAGE (conditionnel)
- **Cérémonie**
  - Extérieur (oui/non)
  - Intérieur (oui/non)
  - Description
  
- Points forts mariage (liste)
- Certifications

#### ✅ 9. CONTACTS
- **B2B**
  - Email
  - Téléphone
  
- **Mariages**
  - Email
  - Téléphone
  
- **Web & Réseaux**
  - Site web
  - Instagram
  - Mariages.net

#### ✅ 10. SEO & MARKETING
- **SEO**
  - Titre (auto-généré + éditable)
  - Description meta
  - Keywords (tags)
  
- **Marketing**
  - Note/Rating
  - Nombre d'avis
  - Points forts (highlights)
  - Statut d'affichage ("Nouveau", etc.)
  - Style (tags: historique, élégant, champêtre)

#### ✅ 11. PUBLICATION & PARAMÈTRES
- Types d'événements (checkboxes: B2B, Mariage, Séminaire, Réception)
- Actif (oui/non)
- Mis en avant (oui/non)
- Ordre d'affichage (nombre)
- Dates (lecture seule: créé le, modifié le)

---

## 🔴 PROBLÈMES IDENTIFIÉS

### 1. Duplications massives
- `capacity` vs `capacityDetails` vs champs racine
- `images.hero` vs `heroImage` vs `image`
- `email` vs `contact.email` vs `emailB2B`
- `address.coordinates` vs `lat/lng` racine

**Solution** : Normaliser lors de la sauvegarde (créer getters/setters)

### 2. Champs incomplets (20-40%)
- `address` complet (seulement 20%)
- `shortDescription` (40%)
- `seo` (80%)

**Solution** : Rendre ces champs optionnels mais recommandés

### 3. Incohérences de nommage
- `reviewCount` vs `reviewsCount`
- `status` vs `displayStatus`
- `url` vs `externalUrl` vs `websiteUrl`

**Solution** : Choisir une convention et migrer progressivement

---

## ✅ PROCHAINES ÉTAPES

1. **Créer le formulaire d'édition complet** avec toutes les sections ci-dessus
2. **Normaliser les données** à la sauvegarde (mapper vers les bons champs)
3. **Validation** avec Zod pour tous les champs
4. **Migration progressive** des anciens champs vers la nouvelle structure
5. **Documentation** des champs utilisés vs deprecated

---

## 📋 CHAMPS À AJOUTER AU FORMULAIRE (PAR PRIORITÉ)

### ⭐⭐⭐ CRITIQUE (Toujours présents dans Firebase)
- name, slug, tagline, description, location
- heroImage, cardImage, gallery
- capacitySeated, capacityStanding
- emailB2B, emailMariages, phoneB2B, phoneMariages
- active, featured, displayOrder, eventTypes

### ⭐⭐ IMPORTANT (60-80%)
- shortDescription, experienceText
- lat, lng, region
- pricing (b2b + wedding)
- equipment, amenities, services
- accommodationRooms
- seo

### ⭐ OPTIONNEL (20-40%)
- capacity détails (configurations spécifiques)
- address complet
- catering, parking, ceremony
- highlights, uniqueSellingPoints, certifications
- accommodationDetails, longDescription
