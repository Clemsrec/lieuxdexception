# Structure i18n pour Lieux d'Exception

## Architecture multilingue

Le site supporte **6 langues** :
- 🇫🇷 Français (langue source)
- 🇬🇧 Anglais
- 🇪🇸 Espagnol
- 🇩🇪 Allemand
- 🇮🇹 Italien
- 🇵🇹 Portugais

## Structure Firestore

### Collection `i18n`

```
i18n/
├── pages/
│   ├── home/
│   │   ├── fr/
│   │   ├── en/
│   │   ├── es/
│   │   ├── de/
│   │   ├── it/
│   │   └── pt/
│   ├── mariages/
│   ├── evenements-b2b/
│   └── contact/
└── venues/
    ├── domaine-nantais/
    ├── le-dome/
    └── manoir-boulaie/
```

## Documents clés à traduire

### 1. Brochure Lieux d'Exception (Pages globales)

**Titre principal :**
- FR : "Lieux d'Exception - La clé de vos moments uniques"
- EN : "Exceptional Venues - The Key to Your Unique Moments"

**Philosophie :**
- FR : "Une aventure née de lieux & de passion"
- EN : "An Adventure Born of Places & Passion"

**Signature :**
- FR : "Parce que l'émotion se vit pleinement lorsqu'elle trouve son Lieu d'Exception"
- EN : "Because emotion is fully experienced when it finds its Exceptional Venue"

### 2. Événements B2B

**Accroche principale :**
- FR : "Et si vos événements professionnels devenaient… tout simplement exceptionnels ?"
- EN : "What if your professional events became… simply exceptional?"

**3 piliers :**
1. Une émotion d'exception / An Exceptional Emotion
2. Un service d'exception / An Exceptional Service
3. Des lieux d'exception / Exceptional Venues

### 3. Mariages

**Hero :**
- FR : "Parce que l'émotion se vit pleinement..."
- EN : "Because emotion is fully experienced..."

**4 prestations :**
1. Rencontres personnalisées / Personalized Meetings
2. Organisation & Coordination / Organization & Coordination
3. Réseau de partenaires / Network of Partners
4. Mise à disposition exclusive / Exclusive Availability

### 4. Le Domaine Nantais

**Tagline :**
- FR : "À 10 minutes de Nantes, dans un parc paysagé d'1 hectare"
- EN : "10 minutes from Nantes, in a landscaped 1-hectare park"

**Description courte :**
- FR : "Au cœur d'un parc paysagé d'1 hectare, le Le Domaine Nantais vous accueille..."
- EN : "In the heart of a landscaped 1-hectare park, the Le Domaine Nantais welcomes you..."

### 5. Le Dôme

**Tagline :**
- FR : "Un espace spectaculaire où tout devient possible"
- EN : "A Spectacular Space Where Everything Becomes Possible"

**Positionnement :**
- FR : "Le Dôme est votre toile blanche"
- EN : "The Dôme is your blank canvas"

### 6. Le Manoir de la Boulaie

**Tagline :**
- FR : "Charme historique et confort moderne, à 10 min de Nantes"
- EN : "Historic Charm and Modern Comfort, 10 minutes from Nantes"

**USP :**
- FR : "Accès direct à une plage privée au bord du lac"
- EN : "Direct access to a private beach by the lake"

## Implémentation technique

### Option 1 : Firestore i18n Collection

```typescript
// lib/i18n.ts
export async function getTranslation(key: string, lang: string = 'fr') {
  const doc = await db.collection('i18n').doc(key).collection(lang).doc('content').get();
  return doc.data();
}
```

### Option 2 : JSON statique avec next-intl

```
locales/
├── fr.json
├── en.json
├── es.json
├── de.json
├── it.json
└── pt.json
```

### Option 3 : Hybrid (recommandé)

- **Textes statiques** (navigation, labels) : JSON
- **Contenus dynamiques** (venues, pages) : Firestore

## Priorités de traduction

### Phase 1 : Essentiel (FR → EN)
1. ✅ Page d'accueil
2. ✅ Événements B2B
3. ✅ Mariages
4. ✅ 3 lieux (Domaine, Dôme, Manoir)
5. Navigation & Footer

### Phase 2 : Expansion (EN → ES, DE, IT, PT)
1. Traduction automatique + relecture native
2. Adaptation culturelle si nécessaire
3. SEO localisé

### Phase 3 : Optimisation
1. Glossaire terminologique
2. Cohérence multi-langues
3. A/B testing sur CTAs

## Workflow de traduction

1. **Export des textes FR** → CSV/JSON
2. **Traduction professionnelle** (ou DeepL + relecture)
3. **Import dans Firestore** via script
4. **Validation par natives**
5. **Mise en ligne progressive**

## Scripts utiles

### Créer structure i18n
```bash
node scripts/create-i18n-structure.js
```

### Exporter textes FR
```bash
node scripts/export-fr-to-csv.js
```

### Importer traductions
```bash
node scripts/import-translations.js --lang=en --file=translations-en.json
```

## Notes importantes

⚠️ **Ne pas traduire :**
- Noms de lieux (Le Domaine Nantais, Le Dôme, Le Manoir de la Boulaie)
- Coordonnées (téléphone, email)
- Noms propres

✅ **Adapter :**
- Formats de dates
- Devises (EUR, $, £)
- Unités (m², hectares)

## Budget estimé

- **Traduction FR → EN :** ~7500 mots × 0.12€ = 900€
- **5 autres langues :** ~7500 mots × 5 × 0.08€ = 3000€
- **Total :** ~4000€ pour traductions professionnelles

Alternative : DeepL API + relecture native = ~1500€
