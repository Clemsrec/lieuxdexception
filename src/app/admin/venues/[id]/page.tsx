'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, FileText, MapPin, Users, Euro, Image as ImageIcon, Settings, Award, Mail, Search, Tag } from 'lucide-react';
import Link from 'next/link';
import {
  FormSection,
  TextInput,
  TextArea,
  NumberInput,
  Select,
  Checkbox,
  TagInput,
  CheckboxGroup,
  Grid
} from '@/components/admin/VenueFormSections';
import VenueGalleryManager from '@/components/admin/VenueGalleryManager';

/**
 * Interface complète pour les données du formulaire Venue
 * Basée sur l'analyse de 140 champs Firestore
 */
interface VenueFormData {
  // === INFORMATIONS GÉNÉRALES ===
  name: string;
  slug: string;
  tagline: string;
  description: string;
  shortDescription: string;
  experienceText: string;
  longDescription: string;
  
  // === LOCALISATION ===
  location: string;
  region: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    department: string;
    region: string;
    country: string;
  };
  lat: number | undefined;
  lng: number | undefined;
  
  // === CAPACITÉS ===
  capacityMin: number | undefined;
  capacityMax: number | undefined;
  capacitySeated: number | undefined;
  capacityStanding: number | undefined;
  rooms: number | undefined;
  totalSurfaceRooms: number | undefined;
  
  // Configurations spécifiques
  capacityDetails: {
    meeting: number | undefined;
    uShape: number | undefined;
    theater: number | undefined;
    cabaret: number | undefined;
    classroom: number | undefined;
    banquet: number | undefined;
    cocktail: number | undefined;
  };
  
  // Espaces détaillés
  detailedSpaces: Array<{
    name: string;
    size: number;
    unit: string;
  }>;
  
  // === TARIFICATION ===
  priceRange: string;
  pricing: {
    b2b: {
      halfDay: number | undefined;
      fullDay: number | undefined;
      evening: number | undefined;
    };
    wedding: {
      reception: number | undefined;
      ceremony: number | undefined;
      weekend: number | undefined;
    };
    currency: string;
  };
  
  // === IMAGES ===
  heroImage: string;
  cardImage: string;
  gallery: string[];
  
  // === ÉQUIPEMENTS & SERVICES ===
  amenities: string[];
  equipment: string[];
  services: string[];
  
  // === HÉBERGEMENT & RESTAURATION ===
  accommodationRooms: number | undefined;
  accommodation: {
    onSite: boolean;
    nearby: boolean;
    description: string;
  };
  catering: {
    inHouse: boolean;
    external: boolean;
    partnersAvailable: boolean;
    description: string;
  };
  
  // === ACCESSIBILITÉ & ÉQUIPEMENTS ===
  accessibility: boolean;
  audioVisual: boolean;
  wifi: boolean;
  parking: {
    available: boolean;
    spaces: number | undefined;
    description: string;
  };
  
  // === INFORMATIONS MARIAGE ===
  ceremony: {
    outdoor: boolean;
    indoor: boolean;
    description: string;
  };
  highlights: string[];
  uniqueSellingPoints: string[];
  certifications: string[];
  
  // === CONTACTS ===
  emailB2B: string;
  phoneB2B: string;
  emailMariages: string;
  phoneMariages: string;
  contact: {
    website: string;
    instagram: string;
    mariagesNet: string;
  };
  
  // === SEO & MARKETING ===
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  rating: number | undefined;
  reviewCount: number | undefined;
  displayStatus: string;
  style: string[];
  
  // === MÉTADONNÉES SYSTÈME ===
  active: boolean;
  featured: boolean;
  displayOrder: number | undefined;
  eventTypes: string[];
  privatizable: boolean;
}

/**
 * Valeurs par défaut pour un nouveau lieu ou champs manquants
 */
const DEFAULT_VENUE_DATA: VenueFormData = {
  name: '',
  slug: '',
  tagline: '',
  description: '',
  shortDescription: '',
  experienceText: '',
  longDescription: '',
  location: '',
  region: '',
  address: {
    street: '',
    city: '',
    postalCode: '',
    department: '',
    region: '',
    country: 'France',
  },
  lat: undefined,
  lng: undefined,
  capacityMin: undefined,
  capacityMax: undefined,
  capacitySeated: undefined,
  capacityStanding: undefined,
  rooms: undefined,
  totalSurfaceRooms: undefined,
  capacityDetails: {
    meeting: undefined,
    uShape: undefined,
    theater: undefined,
    cabaret: undefined,
    classroom: undefined,
    banquet: undefined,
    cocktail: undefined,
  },
  detailedSpaces: [],
  priceRange: 'mid-range',
  pricing: {
    b2b: {
      halfDay: undefined,
      fullDay: undefined,
      evening: undefined,
    },
    wedding: {
      reception: undefined,
      ceremony: undefined,
      weekend: undefined,
    },
    currency: 'EUR',
  },
  heroImage: '',
  cardImage: '',
  gallery: [],
  amenities: [],
  equipment: [],
  services: [],
  accommodationRooms: undefined,
  accommodation: {
    onSite: false,
    nearby: false,
    description: '',
  },
  catering: {
    inHouse: false,
    external: false,
    partnersAvailable: false,
    description: '',
  },
  accessibility: false,
  audioVisual: false,
  wifi: false,
  parking: {
    available: false,
    spaces: undefined,
    description: '',
  },
  ceremony: {
    outdoor: false,
    indoor: false,
    description: '',
  },
  highlights: [],
  uniqueSellingPoints: [],
  certifications: [],
  emailB2B: '',
  phoneB2B: '',
  emailMariages: '',
  phoneMariages: '',
  contact: {
    website: '',
    instagram: '',
    mariagesNet: '',
  },
  seo: {
    title: '',
    description: '',
    keywords: [],
  },
  rating: undefined,
  reviewCount: undefined,
  displayStatus: '',
  style: [],
  active: true,
  featured: false,
  displayOrder: undefined,
  eventTypes: [],
  privatizable: false,
};

type TabId = 'general' | 'location' | 'capacity' | 'pricing' | 'media' | 'amenities' | 'wedding' | 'contact' | 'seo' | 'settings';

const TABS = [
  { id: 'general' as TabId, label: 'Général', icon: FileText },
  { id: 'location' as TabId, label: 'Localisation', icon: MapPin },
  { id: 'capacity' as TabId, label: 'Capacités', icon: Users },
  { id: 'pricing' as TabId, label: 'Tarifs', icon: Euro },
  { id: 'media' as TabId, label: 'Médias', icon: ImageIcon },
  { id: 'amenities' as TabId, label: 'Services', icon: Tag },
  { id: 'wedding' as TabId, label: 'Mariage', icon: Award },
  { id: 'contact' as TabId, label: 'Contact', icon: Mail },
  { id: 'seo' as TabId, label: 'SEO', icon: Search },
  { id: 'settings' as TabId, label: 'Paramètres', icon: Settings },
];

export default function VenueEditPage() {
  const params = useParams();
  const router = useRouter();
  const venueId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [formData, setFormData] = useState<VenueFormData>(DEFAULT_VENUE_DATA);
  
  // Charger les données du lieu depuis l'API
  useEffect(() => {
    const loadVenue = async () => {
      try {
        const response = await fetch(`/api/venues/${venueId}`);
        if (response.ok) {
          const { venue } = await response.json();
          
          // Mapper les données Firestore vers le formulaire (gérer les duplications)
          setFormData({
            // Informations générales
            name: venue.name || '',
            slug: venue.slug || '',
            tagline: venue.tagline || '',
            description: venue.description || '',
            shortDescription: venue.shortDescription || '',
            experienceText: venue.experienceText || '',
            longDescription: venue.longDescription || '',
            
            // Localisation
            location: venue.location || '',
            region: venue.region || '',
            address: venue.address || DEFAULT_VENUE_DATA.address,
            lat: venue.lat,
            lng: venue.lng,
            
            // Capacités
            capacityMin: venue.capacity?.min ?? venue.capacityMin,
            capacityMax: venue.capacity?.max ?? venue.capacityMax,
            capacitySeated: venue.capacitySeated,
            capacityStanding: venue.capacityStanding,
            rooms: venue.rooms,
            totalSurfaceRooms: venue.totalSurfaceRooms,
            capacityDetails: venue.capacityDetails || DEFAULT_VENUE_DATA.capacityDetails,
            detailedSpaces: venue.detailedSpaces || [],
            
            // Tarification
            priceRange: venue.priceRange || 'mid-range',
            pricing: venue.pricing || DEFAULT_VENUE_DATA.pricing,
            
            // Images
            heroImage: venue.heroImage || venue.image || '',
            cardImage: venue.cardImage || '',
            gallery: venue.gallery || [],
            
            // Services
            amenities: venue.amenities || [],
            equipment: venue.equipment || [],
            services: venue.services || [],
            
            // Hébergement
            accommodationRooms: venue.accommodationRooms,
            accommodation: venue.accommodation || DEFAULT_VENUE_DATA.accommodation,
            catering: venue.catering || DEFAULT_VENUE_DATA.catering,
            
            // Accessibilité
            accessibility: venue.accessibility || false,
            audioVisual: venue.audioVisual || false,
            wifi: venue.wifi || false,
            parking: venue.parking || DEFAULT_VENUE_DATA.parking,
            
            // Mariage
            ceremony: venue.ceremony || DEFAULT_VENUE_DATA.ceremony,
            highlights: venue.highlights || [],
            uniqueSellingPoints: venue.uniqueSellingPoints || [],
            certifications: venue.certifications || [],
            
            // Contacts
            emailB2B: venue.emailB2B || venue.email || '',
            phoneB2B: venue.phoneB2B || venue.phone || '',
            emailMariages: venue.emailMariages || '',
            phoneMariages: venue.phoneMariages || '',
            contact: venue.contact || DEFAULT_VENUE_DATA.contact,
            
            // SEO
            seo: venue.seo || DEFAULT_VENUE_DATA.seo,
            rating: venue.rating,
            reviewCount: venue.reviewCount ?? venue.reviewsCount,
            displayStatus: venue.displayStatus || venue.status || '',
            style: venue.style || [],
            
            // Métadonnées
            active: venue.active ?? true,
            featured: venue.featured || false,
            displayOrder: venue.displayOrder,
            eventTypes: venue.eventTypes || [],
            privatizable: venue.privatizable || false,
          });
        } else {
          alert('❌ Lieu non trouvé');
          router.push('/admin/venues');
        }
      } catch (error) {
        console.error('Erreur chargement:', error);
        alert('❌ Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    
    loadVenue();
  }, [venueId, router]);
  
  // Sauvegarder les modifications
  const handleSave = async () => {
    // Validation basique
    if (!formData.name || !formData.slug || !formData.tagline || !formData.description) {
      alert('❌ Veuillez remplir tous les champs obligatoires (nom, slug, tagline, description)');
      return;
    }
    
    setSaving(true);
    try {
      // Préparer les données pour Firestore (normaliser les structures)
      const venueData = {
        // Informations générales
        name: formData.name,
        slug: formData.slug,
        tagline: formData.tagline,
        description: formData.description,
        shortDescription: formData.shortDescription,
        experienceText: formData.experienceText,
        longDescription: formData.longDescription,
        
        // Localisation
        location: formData.location,
        region: formData.region,
        address: formData.address,
        lat: formData.lat,
        lng: formData.lng,
        
        // Capacités (stocker dans capacity ET champs racine pour compatibilité)
        capacity: {
          min: formData.capacityMin,
          max: formData.capacityMax,
        },
        capacityMin: formData.capacityMin,
        capacityMax: formData.capacityMax,
        capacitySeated: formData.capacitySeated,
        capacityStanding: formData.capacityStanding,
        rooms: formData.rooms,
        totalSurfaceRooms: formData.totalSurfaceRooms,
        capacityDetails: formData.capacityDetails,
        detailedSpaces: formData.detailedSpaces,
        
        // Tarification
        priceRange: formData.priceRange,
        pricing: formData.pricing,
        
        // Images (stocker dans images ET champs racine)
        heroImage: formData.heroImage,
        cardImage: formData.cardImage,
        gallery: formData.gallery,
        images: {
          hero: formData.heroImage,
          cardImage: formData.cardImage,
          gallery: formData.gallery,
        },
        
        // Services
        amenities: formData.amenities,
        equipment: formData.equipment,
        services: formData.services,
        
        // Hébergement
        accommodationRooms: formData.accommodationRooms,
        accommodation: formData.accommodation,
        catering: formData.catering,
        
        // Accessibilité
        accessibility: formData.accessibility,
        audioVisual: formData.audioVisual,
        wifi: formData.wifi,
        parking: formData.parking,
        
        // Mariage
        ceremony: formData.ceremony,
        highlights: formData.highlights,
        uniqueSellingPoints: formData.uniqueSellingPoints,
        certifications: formData.certifications,
        
        // Contacts (stocker dans contact ET champs racine)
        emailB2B: formData.emailB2B,
        phoneB2B: formData.phoneB2B,
        emailMariages: formData.emailMariages,
        phoneMariages: formData.phoneMariages,
        contact: {
          ...formData.contact,
          email: formData.emailB2B,
          phone: formData.phoneB2B,
          emailMariages: formData.emailMariages,
          phoneMariages: formData.phoneMariages,
        },
        
        // SEO
        seo: formData.seo,
        rating: formData.rating,
        reviewCount: formData.reviewCount,
        displayStatus: formData.displayStatus,
        style: formData.style,
        
        // Métadonnées
        active: formData.active,
        featured: formData.featured,
        displayOrder: formData.displayOrder,
        eventTypes: formData.eventTypes,
        privatizable: formData.privatizable,
      };
      
      const response = await fetch(`/api/venues/${venueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venueData),
      });
      
      if (response.ok) {
        alert('✅ Lieu mis à jour avec succès');
        router.push('/admin/venues');
      } else {
        const error = await response.json();
        alert(`❌ Erreur lors de la sauvegarde: ${error.message || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };
  
  // Helper pour mettre à jour formData facilement
  const updateField = <K extends keyof VenueFormData>(
    field: K,
    value: VenueFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const updateNestedField = <
    K extends keyof VenueFormData,
    NK extends keyof VenueFormData[K]
  >(
    field: K,
    nestedField: NK,
    value: VenueFormData[K][NK]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] as object),
        [nestedField]: value,
      },
    }));
  };
  
  // Auto-génération du slug depuis le nom
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/venues"
                className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-heading font-bold text-charcoal-900">
                  Éditer le lieu
                </h1>
                <p className="text-sm text-secondary mt-0.5">{formData.name || 'Nouveau lieu'}</p>
              </div>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Onglets (non-sticky) */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap
                    border-b-2 hover:text-accent hover:border-accent/30
                    ${activeTab === tab.id 
                      ? 'border-accent text-accent bg-accent/5' 
                      : 'border-transparent text-secondary'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Contenu des onglets */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-6">
        
        {/* ========================================= */}
        {/* ONGLET GÉNÉRAL */}
        {/* ========================================= */}
        {activeTab === 'general' && (
        <FormSection 
          title="I · Informations générales" 
          description="Informations principales du lieu"
          badge="Obligatoire"
        >
          <TextInput
            label="Nom du lieu"
            value={formData.name}
            onChange={(value) => {
              updateField('name', value);
              // Auto-générer le slug si vide
              if (!formData.slug) {
                updateField('slug', generateSlug(value));
              }
            }}
            placeholder="ex: Château Le Dôme"
            required
            maxLength={100}
          />
          
          <TextInput
            label="Slug (URL)"
            value={formData.slug}
            onChange={(value) => updateField('slug', generateSlug(value))}
            help={`URL du lieu : /lieux/${formData.slug || 'slug'}`}
            required
            maxLength={100}
          />
          
          <TextInput
            label="Tagline (Accroche)"
            value={formData.tagline}
            onChange={(value) => updateField('tagline', value)}
            placeholder="ex: Un château d'exception pour vos événements"
            required
            maxLength={150}
          />
          
          <TextArea
            label="Description courte"
            value={formData.shortDescription}
            onChange={(value) => updateField('shortDescription', value)}
            placeholder="Description courte pour les cartes et aperçus (2-3 phrases)"
            rows={3}
            maxLength={250}
          />
          
          <TextArea
            label="Description complète"
            value={formData.description}
            onChange={(value) => updateField('description', value)}
            placeholder="Description détaillée du lieu, son histoire, ses atouts..."
            required
            rows={8}
            maxLength={2000}
          />
          
          <TextArea
            label="Texte expérience client"
            value={formData.experienceText}
            onChange={(value) => updateField('experienceText', value)}
            placeholder="Décrivez l'expérience client unique offerte par ce lieu"
            rows={4}
            maxLength={1000}
          />
          
          <TextArea
            label="Description longue (optionnel)"
            value={formData.longDescription}
            onChange={(value) => updateField('longDescription', value)}
            placeholder="Description très détaillée pour la page du lieu"
            rows={6}
            maxLength={3000}
          />
        </FormSection>
        )}
        
        {/* ========================================= */}
        {/* ONGLET LOCALISATION */}
        {/* ========================================= */}
        {activeTab === 'location' && (
        <FormSection 
          title="II · Localisation" 
          description="Adresse et coordonnées géographiques"
        >
          <Grid cols={2}>
            <TextInput
              label="Localisation (Département)"
              value={formData.location}
              onChange={(value) => updateField('location', value)}
              placeholder="ex: Loire-Atlantique (44)"
              required
            />
            
            <Select
              label="Région"
              value={formData.region}
              onChange={(value) => updateField('region', value)}
              options={[
                { value: '', label: 'Sélectionner une région' },
                { value: 'pays-de-loire', label: 'Pays de la Loire' },
                { value: 'bretagne', label: 'Bretagne' },
                { value: 'ile-de-france', label: 'Île-de-France' },
                { value: 'nouvelle-aquitaine', label: 'Nouvelle-Aquitaine' },
                { value: 'occitanie', label: 'Occitanie' },
                { value: 'provence-alpes-cote-azur', label: 'Provence-Alpes-Côte d\'Azur' },
                { value: 'auvergne-rhone-alpes', label: 'Auvergne-Rhône-Alpes' },
                { value: 'bourgogne-franche-comte', label: 'Bourgogne-Franche-Comté' },
                { value: 'centre-val-de-loire', label: 'Centre-Val de Loire' },
                { value: 'grand-est', label: 'Grand Est' },
                { value: 'hauts-de-france', label: 'Hauts-de-France' },
                { value: 'normandie', label: 'Normandie' },
                { value: 'corse', label: 'Corse' },
              ]}
            />
          </Grid>
          
          <div className="border-t border-stone-200 pt-4">
            <h3 className="text-sm font-medium mb-4">Adresse complète</h3>
            <Grid cols={1}>
              <TextInput
                label="Rue"
                value={formData.address.street}
                onChange={(value) => updateNestedField('address', 'street', value)}
                placeholder="ex: 123 Route des Châteaux"
              />
              
              <Grid cols={3}>
                <TextInput
                  label="Ville"
                  value={formData.address.city}
                  onChange={(value) => updateNestedField('address', 'city', value)}
                  placeholder="ex: Nantes"
                />
                
                <TextInput
                  label="Code postal"
                  value={formData.address.postalCode}
                  onChange={(value) => updateNestedField('address', 'postalCode', value)}
                  placeholder="ex: 44000"
                />
                
                <TextInput
                  label="Département"
                  value={formData.address.department}
                  onChange={(value) => updateNestedField('address', 'department', value)}
                  placeholder="ex: Loire-Atlantique"
                />
              </Grid>
              
              <TextInput
                label="Pays"
                value={formData.address.country}
                onChange={(value) => updateNestedField('address', 'country', value)}
                placeholder="France"
              />
            </Grid>
          </div>
          
          <div className="border-t border-stone-200 pt-4">
            <h3 className="text-sm font-medium mb-4">Coordonnées GPS</h3>
            <Grid cols={2}>
              <NumberInput
                label="Latitude"
                value={formData.lat}
                onChange={(value) => updateField('lat', value)}
                placeholder="ex: 47.2184"
                step={0.000001}
                help="Coordonnée GPS pour la carte (ex: 47.2184)"
              />
              
              <NumberInput
                label="Longitude"
                value={formData.lng}
                onChange={(value) => updateField('lng', value)}
                placeholder="ex: -1.5536"
                step={0.000001}
                help="Coordonnée GPS pour la carte (ex: -1.5536)"
              />
            </Grid>
          </div>
        </FormSection>
        )}
        
        {/* ========================================= */}
        {/* ONGLET CAPACITÉS */}
        {/* ========================================= */}
        {activeTab === 'capacity' && (
        <FormSection 
          title="III · Capacités & Espaces" 
          description="Capacités d'accueil et configurations disponibles"
        >
          <div className="border-b border-stone-200 pb-4">
            <h3 className="text-sm font-medium mb-4">Capacités générales</h3>
            <Grid cols={2}>
              <NumberInput
                label="Capacité minimale"
                value={formData.capacityMin}
                onChange={(value) => updateField('capacityMin', value)}
                placeholder="ex: 10"
                min={1}
                unit="pers."
              />
              
              <NumberInput
                label="Capacité maximale"
                value={formData.capacityMax}
                onChange={(value) => updateField('capacityMax', value)}
                placeholder="ex: 200"
                min={1}
                unit="pers."
              />
              
              <NumberInput
                label="Capacité assis"
                value={formData.capacitySeated}
                onChange={(value) => updateField('capacitySeated', value)}
                placeholder="ex: 150"
                min={1}
                unit="pers."
              />
              
              <NumberInput
                label="Capacité debout (cocktail)"
                value={formData.capacityStanding}
                onChange={(value) => updateField('capacityStanding', value)}
                placeholder="ex: 200"
                min={1}
                unit="pers."
              />
            </Grid>
          </div>
          
          <div className="border-b border-stone-200 pb-4">
            <h3 className="text-sm font-medium mb-4">Configurations spécifiques (optionnel)</h3>
            <Grid cols={2}>
              <NumberInput
                label="Théâtre"
                value={formData.capacityDetails.theater}
                onChange={(value) => updateNestedField('capacityDetails', 'theater', value)}
                min={1}
                unit="pers."
              />
              
              <NumberInput
                label="Banquet"
                value={formData.capacityDetails.banquet}
                onChange={(value) => updateNestedField('capacityDetails', 'banquet', value)}
                min={1}
                unit="pers."
              />
              
              <NumberInput
                label="Cocktail"
                value={formData.capacityDetails.cocktail}
                onChange={(value) => updateNestedField('capacityDetails', 'cocktail', value)}
                min={1}
                unit="pers."
              />
              
              <NumberInput
                label="U"
                value={formData.capacityDetails.uShape}
                onChange={(value) => updateNestedField('capacityDetails', 'uShape', value)}
                min={1}
                unit="pers."
              />
              
              <NumberInput
                label="Cabaret"
                value={formData.capacityDetails.cabaret}
                onChange={(value) => updateNestedField('capacityDetails', 'cabaret', value)}
                min={1}
                unit="pers."
              />
              
              <NumberInput
                label="Classe"
                value={formData.capacityDetails.classroom}
                onChange={(value) => updateNestedField('capacityDetails', 'classroom', value)}
                min={1}
                unit="pers."
              />
              
              <NumberInput
                label="Réunion"
                value={formData.capacityDetails.meeting}
                onChange={(value) => updateNestedField('capacityDetails', 'meeting', value)}
                min={1}
                unit="pers."
              />
            </Grid>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Espaces disponibles</h3>
            <Grid cols={2}>
              <NumberInput
                label="Nombre de salles"
                value={formData.rooms}
                onChange={(value) => updateField('rooms', value)}
                min={1}
              />
              
              <NumberInput
                label="Surface totale des salles"
                value={formData.totalSurfaceRooms}
                onChange={(value) => updateField('totalSurfaceRooms', value)}
                min={1}
                unit="m²"
              />
            </Grid>
          </div>
        </FormSection>
        )}
        
        {/* ========================================= */}
        {/* ONGLET TARIFS */}
        {/* ========================================= */}
        {activeTab === 'pricing' && (
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
        )}
        
        {/* ========================================= */}
        {/* ONGLET MÉDIAS */}
        {/* ========================================= */}
        {activeTab === 'media' && (
        <>
        <FormSection 
          title="V · Images & Médias" 
          description="Images principales et galerie"
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
        </FormSection>

        <FormSection 
          title="Galerie Photos" 
          description="Gérez les images de la galerie du lieu (drag & drop, réorganisation)"
        >
          <VenueGalleryManager
            venueSlug={formData.slug}
            images={formData.gallery}
            onChange={(images) => updateField('gallery', images)}
          />
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Astuce :</strong> Les images sont automatiquement uploadées dans Firebase Storage sous <code className="bg-blue-100 px-1 rounded">venues/{formData.slug}/gallery/</code>
            </p>
          </div>
        </FormSection>
        </>
        )}
        
        {/* ========================================= */}
        {/* ONGLET SERVICES */}
        {/* ========================================= */}
        {activeTab === 'amenities' && (
        <>
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
        </>
        )}
        
        {/* ========================================= */}
        {/* ONGLET MARIAGE */}
        {/* ========================================= */}
        {activeTab === 'wedding' && (
        <FormSection 
          title="VIII · Informations Mariage" 
          description="Spécificités pour les mariages"
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
          />
        </FormSection>
        )}
        
        {/* ========================================= */}
        {/* ONGLET CONTACT */}
        {/* ========================================= */}
        {activeTab === 'contact' && (
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
        )}
        
        {/* ========================================= */}
        {/* ONGLET SEO */}
        {/* ========================================= */}
        {activeTab === 'seo' && (
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
            />
          </div>
        </FormSection>
        )}
        
        {/* ========================================= */}
        {/* ONGLET PARAMÈTRES */}
        {/* ========================================= */}
        {activeTab === 'settings' && (
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
        )}
        
        </div>
      </div>
      
      {/* Actions bas de page */}
      <div className="sticky bottom-0 bg-white border-t border-stone-200 shadow-lg z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 justify-end">
          <Link
            href="/admin/venues"
            className="px-6 py-2.5 rounded-lg border border-stone-300 hover:bg-stone-50 transition-colors font-medium"
          >
            Annuler
          </Link>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary flex items-center gap-2 px-6 py-2.5"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
