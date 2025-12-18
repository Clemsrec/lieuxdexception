# Sections 4 à 11 du Formulaire d'Édition Venue

**À insérer dans** : `src/app/admin/venues/[id]/page.tsx`  
**Après** : Section 3 (Capacités & Espaces)

---

```tsx
{/* ========================================= */}
{/* SECTION 4 : TARIFICATION */}
{/* ========================================= */}
<FormSection 
  title="IV · Tarification" 
  description="Tarifs et gamme de prix"
>
  <Select
    label="Gamme de prix"
    value={formData.priceRange}
    onChange={(value) => updateField('priceRange', value)}
    options={[
      { value: 'budget', label: '€ - Budget' },
      { value: 'mid-range', label: '€€ - Standard' },
      { value: 'premium', label: '€€€ - Premium' },
      { value: 'luxury', label: '€€€€ - Luxe' },
    ]}
  />
  
  <div className="border-t border-stone-200 pt-4">
    <h3 className="text-sm font-medium mb-4">Tarifs B2B / Séminaires</h3>
    <Grid cols={3}>
      <NumberInput
        label="Demi-journée"
        value={formData.pricing.b2b.halfDay}
        onChange={(value) => updateNestedField('pricing', 'b2b', {
          ...formData.pricing.b2b,
          halfDay: value,
        })}
        min={0}
        unit="€"
      />
      
      <NumberInput
        label="Journée complète"
        value={formData.pricing.b2b.fullDay}
        onChange={(value) => updateNestedField('pricing', 'b2b', {
          ...formData.pricing.b2b,
          fullDay: value,
        })}
        min={0}
        unit="€"
      />
      
      <NumberInput
        label="Soirée"
        value={formData.pricing.b2b.evening}
        onChange={(value) => updateNestedField('pricing', 'b2b', {
          ...formData.pricing.b2b,
          evening: value,
        })}
        min={0}
        unit="€"
      />
    </Grid>
  </div>
  
  <div className="border-t border-stone-200 pt-4">
    <h3 className="text-sm font-medium mb-4">Tarifs Mariage</h3>
    <Grid cols={3}>
      <NumberInput
        label="Réception"
        value={formData.pricing.wedding.reception}
        onChange={(value) => updateNestedField('pricing', 'wedding', {
          ...formData.pricing.wedding,
          reception: value,
        })}
        min={0}
        unit="€"
      />
      
      <NumberInput
        label="Cérémonie"
        value={formData.pricing.wedding.ceremony}
        onChange={(value) => updateNestedField('pricing', 'wedding', {
          ...formData.pricing.wedding,
          ceremony: value,
        })}
        min={0}
        unit="€"
      />
      
      <NumberInput
        label="Week-end"
        value={formData.pricing.wedding.weekend}
        onChange={(value) => updateNestedField('pricing', 'wedding', {
          ...formData.pricing.wedding,
          weekend: value,
        })}
        min={0}
        unit="€"
      />
    </Grid>
  </div>
</FormSection>

{/* ========================================= */}
{/* SECTION 5 : IMAGES & MÉDIAS */}
{/* ========================================= */}
<FormSection 
  title="V · Images & Médias" 
  description="Images principales et galerie"
  badge="TODO Upload"
>
  <TextInput
    label="Image Hero (URL)"
    value={formData.heroImage}
    onChange={(value) => updateField('heroImage', value)}
    type="url"
    placeholder="https://firebasestorage.googleapis.com/..."
    help="Image principale affichée en haut de la page du lieu"
    required
  />
  
  <TextInput
    label="Image Carte (URL)"
    value={formData.cardImage}
    onChange={(value) => updateField('cardImage', value)}
    type="url"
    placeholder="https://firebasestorage.googleapis.com/..."
    help="Image miniature affichée dans les listes et cartes"
    required
  />
  
  <TagInput
    label="Galerie (URLs)"
    tags={formData.gallery}
    onChange={(tags) => updateField('gallery', tags)}
    placeholder="Ajouter une URL d'image..."
    help="Images de la galerie du lieu (une URL par image)"
  />
  
  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <p className="text-sm text-yellow-800">
      <strong>TODO :</strong> Implémenter upload d'images via Firebase Storage avec prévisualisation et drag & drop.
    </p>
  </div>
</FormSection>

{/* ========================================= */}
{/* SECTION 6 : ÉQUIPEMENTS & SERVICES */}
{/* ========================================= */}
<FormSection 
  title="VI · Équipements & Services" 
  description="Équipements disponibles et services proposés"
>
  <TagInput
    label="Équipements"
    tags={formData.equipment}
    onChange={(tags) => updateField('equipment', tags)}
    placeholder="Ajouter un équipement..."
    help="Wifi, Vidéoprojecteur, Système son, etc."
    suggestions={[
      'Wifi',
      'Vidéoprojecteur',
      'Système son',
      'Écran de projection',
      'Micro sans fil',
      'Tableau blanc',
      'Climatisation',
      'Chauffage',
    ]}
  />
  
  <TagInput
    label="Services"
    tags={formData.services}
    onChange={(tags) => updateField('services', tags)}
    placeholder="Ajouter un service..."
    help="Parking, Traiteur, Accès PMR, etc."
    suggestions={[
      'Parking',
      'Cuisine traiteur équipée',
      'Accès PMR',
      'Service traiteur',
      'Décoration incluse',
      'Coordinateur événement',
      'Service bar',
    ]}
  />
  
  <TagInput
    label="Espaces & Aménagements"
    tags={formData.amenities}
    onChange={(tags) => updateField('amenities', tags)}
    placeholder="Ajouter un espace..."
    help="Orangerie, Terrasse, Parc, etc."
    suggestions={[
      'Parc',
      'Orangerie',
      'Terrasse',
      'Jardin',
      'Salle de réception',
      'Salle de réunion',
      'Chapelle',
      'Cour intérieure',
    ]}
  />
  
  <Grid cols={3}>
    <Checkbox
      label="Wifi"
      checked={formData.wifi}
      onChange={(checked) => updateField('wifi', checked)}
    />
    
    <Checkbox
      label="Audiovisuel"
      checked={formData.audioVisual}
      onChange={(checked) => updateField('audioVisual', checked)}
    />
    
    <Checkbox
      label="Accessibilité PMR"
      checked={formData.accessibility}
      onChange={(checked) => updateField('accessibility', checked)}
    />
  </Grid>
</FormSection>

{/* ========================================= */}
{/* SECTION 7 : HÉBERGEMENT & RESTAURATION */}
{/* ========================================= */}
<FormSection 
  title="VII · Hébergement & Restauration" 
  description="Options d'hébergement et restauration"
>
  <div className="border-b border-stone-200 pb-4">
    <h3 className="text-sm font-medium mb-4">Hébergement</h3>
    
    <NumberInput
      label="Nombre de chambres"
      value={formData.accommodationRooms}
      onChange={(value) => updateField('accommodationRooms', value)}
      min={0}
      help="Chambres disponibles sur place ou dans les environs"
    />
    
    <Grid cols={2}>
      <Checkbox
        label="Hébergement sur place"
        checked={formData.accommodation.onSite}
        onChange={(checked) => updateNestedField('accommodation', 'onSite', checked)}
      />
      
      <Checkbox
        label="Hébergement à proximité"
        checked={formData.accommodation.nearby}
        onChange={(checked) => updateNestedField('accommodation', 'nearby', checked)}
      />
    </Grid>
    
    <TextArea
      label="Détails hébergement"
      value={formData.accommodation.description}
      onChange={(value) => updateNestedField('accommodation', 'description', value)}
      placeholder="Décrivez les options d'hébergement disponibles"
      rows={3}
    />
  </div>
  
  <div className="border-b border-stone-200 pb-4">
    <h3 className="text-sm font-medium mb-4">Restauration / Traiteur</h3>
    
    <Grid cols={3}>
      <Checkbox
        label="Cuisine sur place"
        checked={formData.catering.inHouse}
        onChange={(checked) => updateNestedField('catering', 'inHouse', checked)}
      />
      
      <Checkbox
        label="Traiteur externe autorisé"
        checked={formData.catering.external}
        onChange={(checked) => updateNestedField('catering', 'external', checked)}
      />
      
      <Checkbox
        label="Partenaires disponibles"
        checked={formData.catering.partnersAvailable}
        onChange={(checked) => updateNestedField('catering', 'partnersAvailable', checked)}
      />
    </Grid>
    
    <TextArea
      label="Détails restauration"
      value={formData.catering.description}
      onChange={(value) => updateNestedField('catering', 'description', value)}
      placeholder="Décrivez les options de restauration et partenaires traiteurs"
      rows={3}
    />
  </div>
  
  <div>
    <h3 className="text-sm font-medium mb-4">Parking</h3>
    
    <Grid cols={2}>
      <Checkbox
        label="Parking disponible"
        checked={formData.parking.available}
        onChange={(checked) => updateNestedField('parking', 'available', checked)}
      />
      
      <NumberInput
        label="Nombre de places"
        value={formData.parking.spaces}
        onChange={(value) => updateNestedField('parking', 'spaces', value)}
        min={0}
      />
    </Grid>
    
    <TextArea
      label="Détails parking"
      value={formData.parking.description}
      onChange={(value) => updateNestedField('parking', 'description', value)}
      placeholder="Parking privé, public, distance, etc."
      rows={2}
    />
  </div>
</FormSection>

{/* ========================================= */}
{/* SECTION 8 : INFORMATIONS MARIAGE */}
{/* ========================================= */}
<FormSection 
  title="VIII · Informations Mariage" 
  description="Spécificités pour les mariages (conditionnel)"
  defaultOpen={formData.eventTypes.includes('mariage')}
>
  <div className="border-b border-stone-200 pb-4">
    <h3 className="text-sm font-medium mb-4">Cérémonie</h3>
    
    <Grid cols={2}>
      <Checkbox
        label="Cérémonie extérieure possible"
        checked={formData.ceremony.outdoor}
        onChange={(checked) => updateNestedField('ceremony', 'outdoor', checked)}
      />
      
      <Checkbox
        label="Cérémonie intérieure possible"
        checked={formData.ceremony.indoor}
        onChange={(checked) => updateNestedField('ceremony', 'indoor', checked)}
      />
    </Grid>
    
    <TextArea
      label="Détails cérémonie"
      value={formData.ceremony.description}
      onChange={(value) => updateNestedField('ceremony', 'description', value)}
      placeholder="Chapelle, jardin, orangerie, capacité, etc."
      rows={3}
    />
  </div>
  
  <TagInput
    label="Points forts (Highlights)"
    tags={formData.highlights}
    onChange={(tags) => updateField('highlights', tags)}
    placeholder="Ajouter un point fort..."
    help="Points forts du lieu pour les mariages"
    suggestions={[
      'Vue panoramique',
      'Parc arboré',
      'Architecture historique',
      'Chapelle privée',
      'Terrasse panoramique',
      'Jardins à la française',
    ]}
  />
  
  <TagInput
    label="Arguments de vente uniques"
    tags={formData.uniqueSellingPoints}
    onChange={(tags) => updateField('uniqueSellingPoints', tags)}
    placeholder="Ajouter un argument..."
    help="Ce qui rend ce lieu unique pour les mariages"
  />
  
  <TagInput
    label="Certifications & Labels"
    tags={formData.certifications}
    onChange={(tags) => updateField('certifications', tags)}
    placeholder="Ajouter une certification..."
    help="Labels qualité, certifications, récompenses"
    suggestions={[
      'Monuments Historiques',
      'Label Qualité',
      'Éco-responsable',
      'Mariages.net Excellence',
    ]}
  />
</FormSection>

{/* ========================================= */}
{/* SECTION 9 : CONTACTS */}
{/* ========================================= */}
<FormSection 
  title="IX · Contacts" 
  description="Coordonnées de contact"
  badge="Important"
>
  <div className="border-b border-stone-200 pb-4">
    <h3 className="text-sm font-medium mb-4">Contact B2B / Séminaires</h3>
    <Grid cols={2}>
      <TextInput
        label="Email B2B"
        value={formData.emailB2B}
        onChange={(value) => updateField('emailB2B', value)}
        type="email"
        placeholder="contact@chateau.fr"
        required
      />
      
      <TextInput
        label="Téléphone B2B"
        value={formData.phoneB2B}
        onChange={(value) => updateField('phoneB2B', value)}
        type="tel"
        placeholder="02 XX XX XX XX"
      />
    </Grid>
  </div>
  
  <div className="border-b border-stone-200 pb-4">
    <h3 className="text-sm font-medium mb-4">Contact Mariages</h3>
    <Grid cols={2}>
      <TextInput
        label="Email Mariages"
        value={formData.emailMariages}
        onChange={(value) => updateField('emailMariages', value)}
        type="email"
        placeholder="mariages@chateau.fr"
        required
      />
      
      <TextInput
        label="Téléphone Mariages"
        value={formData.phoneMariages}
        onChange={(value) => updateField('phoneMariages', value)}
        type="tel"
        placeholder="02 XX XX XX XX"
      />
    </Grid>
  </div>
  
  <div>
    <h3 className="text-sm font-medium mb-4">Web & Réseaux Sociaux</h3>
    <Grid cols={1}>
      <TextInput
        label="Site web"
        value={formData.contact.website}
        onChange={(value) => updateNestedField('contact', 'website', value)}
        type="url"
        placeholder="https://www.chateau.fr"
      />
      
      <TextInput
        label="Instagram"
        value={formData.contact.instagram}
        onChange={(value) => updateNestedField('contact', 'instagram', value)}
        placeholder="@chateauledome"
        help="Nom d'utilisateur Instagram (avec ou sans @)"
      />
      
      <TextInput
        label="Mariages.net"
        value={formData.contact.mariagesNet}
        onChange={(value) => updateNestedField('contact', 'mariagesNet', value)}
        type="url"
        placeholder="https://www.mariages.net/..."
      />
    </Grid>
  </div>
</FormSection>

{/* ========================================= */}
{/* SECTION 10 : SEO & MARKETING */}
{/* ========================================= */}
<FormSection 
  title="X · SEO & Marketing" 
  description="Optimisation SEO et données marketing"
>
  <div className="border-b border-stone-200 pb-4">
    <h3 className="text-sm font-medium mb-4">Métadonnées SEO</h3>
    
    <TextInput
      label="Titre SEO"
      value={formData.seo.title}
      onChange={(value) => updateNestedField('seo', 'title', value)}
      placeholder={`${formData.name} - ${formData.location} | Lieux d'Exception`}
      maxLength={60}
      help="Titre affiché dans les résultats Google (max 60 caractères)"
    />
    
    <TextArea
      label="Description SEO"
      value={formData.seo.description}
      onChange={(value) => updateNestedField('seo', 'description', value)}
      placeholder="Description optimisée pour les moteurs de recherche"
      rows={3}
      maxLength={160}
      help="Description affichée dans Google (max 160 caractères)"
    />
    
    <TagInput
      label="Mots-clés SEO"
      tags={formData.seo.keywords}
      onChange={(tags) => updateNestedField('seo', 'keywords', tags)}
      placeholder="Ajouter un mot-clé..."
      help="Mots-clés pour le référencement"
      suggestions={[
        'château mariage',
        'salle réception',
        'séminaire entreprise',
        'domaine prestige',
        'événement professionnel',
      ]}
    />
  </div>
  
  <div>
    <h3 className="text-sm font-medium mb-4">Marketing & Affichage</h3>
    
    <Grid cols={3}>
      <NumberInput
        label="Note moyenne"
        value={formData.rating}
        onChange={(value) => updateField('rating', value)}
        min={0}
        max={5}
        step={0.1}
        help="Note sur 5 étoiles"
      />
      
      <NumberInput
        label="Nombre d'avis"
        value={formData.reviewCount}
        onChange={(value) => updateField('reviewCount', value)}
        min={0}
      />
      
      <TextInput
        label="Statut d'affichage"
        value={formData.displayStatus}
        onChange={(value) => updateField('displayStatus', value)}
        placeholder="Nouveau, Populaire, etc."
        help="Badge affiché sur la carte"
      />
    </Grid>
    
    <TagInput
      label="Style du lieu"
      tags={formData.style}
      onChange={(tags) => updateField('style', tags)}
      placeholder="Ajouter un style..."
      help="Style architectural et ambiance"
      suggestions={[
        'historique',
        'élégant',
        'champêtre',
        'moderne',
        'romantique',
        'rustique',
        'contemporain',
      ]}
    />
  </div>
</FormSection>

{/* ========================================= */}
{/* SECTION 11 : PUBLICATION & PARAMÈTRES */}
{/* ========================================= */}
<FormSection 
  title="XI · Publication & Paramètres" 
  description="Paramètres de publication et métadonnées système"
  badge="Important"
>
  <CheckboxGroup
    label="Types d'événements"
    options={[
      { value: 'b2b', label: 'B2B / Séminaires' },
      { value: 'mariage', label: 'Mariages' },
      { value: 'seminaire', label: 'Séminaires' },
      { value: 'reception', label: 'Réceptions' },
      { value: 'gala', label: 'Galas' },
      { value: 'corporate', label: 'Événements Corporate' },
    ]}
    selected={formData.eventTypes}
    onChange={(selected) => updateField('eventTypes', selected)}
    columns={3}
  />
  
  <div className="border-t border-stone-200 pt-4">
    <Grid cols={3}>
      <Checkbox
        label="Lieu actif"
        checked={formData.active}
        onChange={(checked) => updateField('active', checked)}
        help="Visible sur le site public"
      />
      
      <Checkbox
        label="Mis en avant"
        checked={formData.featured}
        onChange={(checked) => updateField('featured', checked)}
        help="Affiché en priorité"
      />
      
      <Checkbox
        label="Privatisable"
        checked={formData.privatizable}
        onChange={(checked) => updateField('privatizable', checked)}
        help="Lieu entièrement privatisable"
      />
    </Grid>
  </div>
  
  <NumberInput
    label="Ordre d'affichage"
    value={formData.displayOrder}
    onChange={(value) => updateField('displayOrder', value)}
    min={0}
    help="Ordre de tri dans les listes (0 = premier)"
  />
</FormSection>
```

---

**Note** : Ce fichier contient uniquement du code de documentation à copier dans le composant admin réel. Il n'est pas destiné à être exécuté directement.
