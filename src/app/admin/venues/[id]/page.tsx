'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, FileText, MapPin, Users, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import ImagePicker from '@/components/admin/ImagePicker';

/**
 * Page d'édition des lieux - FORMULAIRE COMPLET 
 * Tous les champs affichés sur la page publique sont éditables
 */

interface DetailedSpace {
  name: string;
  size: number;
}

interface CapacityDetails {
  meeting?: number;
  uShape?: number;
  theater?: number;
  cabaret?: number;
  classroom?: number;
  banquet?: number;
  cocktail?: number;
  cocktailPark?: number;
}

interface VenueFormData {
  // Informations principales
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  tagline: string;
  experienceText: string;
  
  // Localisation
  location: string;
  region: string;
  
  // Capacités simples
  capacityMin: number | undefined;
  capacityMax: number | undefined;
  
  // Capacités détaillées
  capacityDetails: CapacityDetails;
  
  // Infrastructures
  rooms: number | undefined;
  detailedSpaces: DetailedSpace[];
  accommodationRooms: number | undefined;
  accommodationDetails: string;
  parkingSpaces: number | undefined;
  
  // Équipements & Services
  equipment: string[];
  services: string[];
  activities: string[];
  
  // Contact
  contactPhone: string;
  contactEmail: string;
  contactPhoneB2B: string;
  contactPhoneMariages: string;
  contactEmailB2B: string;
  contactEmailMariages: string;
  contactInstagram: string;
  contactMariagesNet: string;
  contactWebsite: string;
  
  // Images
  heroImage: string;
  cardImage: string;
  gallery: string[];
  
  // Marketing
  displayStatus: string;
  privatizable: boolean;
  renovationDate: string;
  
  // Statut
  active: boolean;
}

const DEFAULT_VENUE_DATA: VenueFormData = {
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  tagline: '',
  experienceText: '',
  location: '',
  region: 'pays-de-loire',
  capacityMin: undefined,
  capacityMax: undefined,
  capacityDetails: {},
  rooms: undefined,
  detailedSpaces: [],
  accommodationRooms: undefined,
  accommodationDetails: '',
  parkingSpaces: undefined,
  equipment: [],
  services: [],
  activities: [],
  contactPhone: '',
  contactEmail: '',
  contactPhoneB2B: '',
  contactPhoneMariages: '',
  contactEmailB2B: '',
  contactEmailMariages: '',
  contactInstagram: '',
  contactMariagesNet: '',
  contactWebsite: '',
  heroImage: '',
  cardImage: '',
  gallery: [],
  displayStatus: '',
  privatizable: false,
  renovationDate: '',
  active: true,
};

type TabId = 'general' | 'marketing' | 'location' | 'capacity' | 'capacity-details' | 'infrastructure' | 'equipment' | 'contact' | 'media' | 'gallery';

const TABS = [
  { id: 'general' as TabId, label: 'Informations', icon: FileText },
  { id: 'marketing' as TabId, label: 'Textes & Marketing', icon: FileText },
  { id: 'location' as TabId, label: 'Localisation', icon: MapPin },
  { id: 'capacity' as TabId, label: 'Capacités', icon: Users },
  { id: 'capacity-details' as TabId, label: 'Capacités détaillées', icon: Users },
  { id: 'infrastructure' as TabId, label: 'Infrastructures', icon: FileText },
  { id: 'equipment' as TabId, label: 'Équipements & Services', icon: FileText },
  { id: 'contact' as TabId, label: 'Contact', icon: FileText },
  { id: 'media' as TabId, label: 'Images', icon: ImageIcon },
  { id: 'gallery' as TabId, label: 'Galerie', icon: ImageIcon },
];

export default function VenueEditPage() {
  const params = useParams();
  const router = useRouter();
  const venueId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [formData, setFormData] = useState<VenueFormData>(DEFAULT_VENUE_DATA);

  // Charger les données du lieu
  useEffect(() => {
    const loadVenue = async () => {
      try {
        const response = await fetch(`/api/venues/${venueId}`);
        if (response.ok) {
          const { venue } = await response.json();
          
          setFormData({
            name: venue.name || '',
            slug: venue.slug || '',
            description: venue.description || '',
            shortDescription: venue.shortDescription || '',
            tagline: venue.tagline || '',
            experienceText: venue.experienceText || '',
            location: venue.location || '',
            region: venue.region || 'pays-de-loire',
            capacityMin: venue.capacity?.min ?? venue.capacityMin,
            capacityMax: venue.capacity?.max ?? venue.capacityMax,
            capacityDetails: venue.capacityDetails || {},
            rooms: venue.rooms,
            detailedSpaces: venue.detailedSpaces || [],
            accommodationRooms: venue.accommodationRooms,
            accommodationDetails: venue.accommodationDetails || '',
            parkingSpaces: venue.parkingSpaces,
            equipment: venue.equipment || [],
            services: venue.services || [],
            activities: venue.activities || [],
            contactPhone: venue.contact?.phone || venue.phone || '',
            contactEmail: venue.contact?.email || venue.email || '',
            contactPhoneB2B: venue.contact?.phoneB2B || venue.phoneB2B || '',
            contactPhoneMariages: venue.contact?.phoneMariages || venue.phoneMariages || '',
            contactEmailB2B: venue.contact?.emailB2B || venue.emailB2B || '',
            contactEmailMariages: venue.contact?.emailMariages || venue.emailMariages || '',
            contactInstagram: venue.contact?.instagram || '',
            contactMariagesNet: venue.contact?.mariagesNet || '',
            contactWebsite: venue.contact?.website || venue.websiteUrl || venue.url || '',
            heroImage: venue.heroImage || venue.image || venue.images?.hero || '',
            cardImage: venue.cardImage || venue.images?.cardImage || '',
            gallery: venue.gallery || venue.images?.gallery || [],
            displayStatus: venue.displayStatus || '',
            privatizable: venue.privatizable ?? false,
            renovationDate: venue.renovationDate || '',
            active: venue.active ?? true,
          });
        } else {
          alert('❌ Lieu non trouvé');
          router.push('/admin/venues');
        }
      } catch (error) {
        console.error('Erreur chargement lieu:', error);
        alert('❌ Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    loadVenue();
  }, [venueId, router]);

  // Sauvegarder les modifications
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/venues/${venueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Informations principales
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          shortDescription: formData.shortDescription,
          tagline: formData.tagline,
          experienceText: formData.experienceText,
          
          // Localisation
          location: formData.location,
          region: formData.region,
          
          // Capacités simples
          capacity: {
            min: formData.capacityMin,
            max: formData.capacityMax,
          },
          capacityMin: formData.capacityMin,
          capacityMax: formData.capacityMax,
          
          // Capacités détaillées
          capacityDetails: formData.capacityDetails,
          
          // Infrastructures
          rooms: formData.rooms,
          detailedSpaces: formData.detailedSpaces,
          accommodationRooms: formData.accommodationRooms,
          accommodationDetails: formData.accommodationDetails,
          parkingSpaces: formData.parkingSpaces,
          
          // Équipements & Services
          equipment: formData.equipment,
          services: formData.services,
          activities: formData.activities,
          
          // Contact (format structuré)
          contact: {
            phone: formData.contactPhone,
            email: formData.contactEmail,
            phoneB2B: formData.contactPhoneB2B,
            phoneMariages: formData.contactPhoneMariages,
            emailB2B: formData.contactEmailB2B,
            emailMariages: formData.contactEmailMariages,
            instagram: formData.contactInstagram,
            mariagesNet: formData.contactMariagesNet,
            website: formData.contactWebsite,
          },
          // Contact (compatibilité format plat)
          phone: formData.contactPhone,
          email: formData.contactEmail,
          phoneB2B: formData.contactPhoneB2B,
          phoneMariages: formData.contactPhoneMariages,
          emailB2B: formData.contactEmailB2B,
          emailMariages: formData.contactEmailMariages,
          
          // Images
          heroImage: formData.heroImage,
          image: formData.heroImage,
          cardImage: formData.cardImage,
          gallery: formData.gallery,
          images: {
            hero: formData.heroImage,
            cardImage: formData.cardImage,
            gallery: formData.gallery,
          },
          
          // Marketing
          displayStatus: formData.displayStatus,
          privatizable: formData.privatizable,
          renovationDate: formData.renovationDate,
          
          // Statut
          active: formData.active,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        alert('✅ Lieu mis à jour avec succès');
      } else {
        throw new Error('Erreur API');
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // Mise à jour des champs
  const updateField = (field: keyof VenueFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Auto-génération du slug
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
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/venues"
                className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Link>
              <div className="w-px h-6 bg-neutral-300" />
              <h1 className="text-lg font-semibold text-primary">
                {formData.name || 'Nouveau lieu'}
              </h1>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sauvegarde...
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
      
      {/* Onglets */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 hover:text-accent hover:border-accent/30 ${
                    activeTab === tab.id 
                      ? 'border-accent text-accent bg-accent/5' 
                      : 'border-transparent text-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Contenu */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-8 space-y-8">
        
          {/* Onglet Informations */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">Informations principales</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Nom du lieu *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateField('name', value);
                        if (!formData.slug) {
                          updateField('slug', generateSlug(value));
                        }
                      }}
                      className="form-input w-full"
                      placeholder="ex: Château Le Dôme"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => updateField('slug', generateSlug(e.target.value))}
                      className="form-input w-full"
                    />
                    <p className="text-xs text-secondary mt-1">
                      URL du lieu : /lieux/{formData.slug || 'slug'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Description courte *
                    </label>
                    <textarea
                      value={formData.shortDescription}
                      onChange={(e) => updateField('shortDescription', e.target.value)}
                      className="form-input w-full"
                      rows={2}
                      placeholder="Description courte pour les cartes et aperçus (2-3 phrases)"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Description complète *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      className="form-input w-full"
                      rows={6}
                      placeholder="Description détaillée du lieu, son histoire, ses atouts..."
                      required
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => updateField('active', e.target.checked)}
                      className="form-checkbox"
                    />
                    <label htmlFor="active" className="text-sm font-medium text-primary">
                      Lieu actif (visible sur le site)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Textes & Marketing */}
          {activeTab === 'marketing' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Textes & Marketing</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Tagline (Phrase d&apos;accroche)
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => updateField('tagline', e.target.value)}
                    className="form-input w-full"
                    placeholder="ex: Un château d'exception au cœur de la Loire"
                  />
                  <p className="text-xs text-secondary mt-1">
                    Phrase courte affichée sous le nom du lieu
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Texte expérience client
                  </label>
                  <textarea
                    value={formData.experienceText}
                    onChange={(e) => updateField('experienceText', e.target.value)}
                    className="form-input w-full"
                    rows={4}
                    placeholder="Décrivez l'expérience unique que vivent vos clients..."
                  />
                  <p className="text-xs text-secondary mt-1">
                    Texte mis en valeur dans un encadré spécial sur la page
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Statut d&apos;affichage (Badge marketing)
                  </label>
                  <input
                    type="text"
                    value={formData.displayStatus}
                    onChange={(e) => updateField('displayStatus', e.target.value)}
                    className="form-input w-full"
                    placeholder="ex: Nouveau, Ouverture prochainement, Réouverture..."
                  />
                  <p className="text-xs text-secondary mt-1">
                    Badge affiché sur la carte du lieu (laisser vide si non applicable)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Date de rénovation
                  </label>
                  <input
                    type="text"
                    value={formData.renovationDate}
                    onChange={(e) => updateField('renovationDate', e.target.value)}
                    className="form-input w-full"
                    placeholder="ex: Mars 2025, Printemps 2026..."
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="privatizable"
                    checked={formData.privatizable}
                    onChange={(e) => updateField('privatizable', e.target.checked)}
                    className="form-checkbox"
                  />
                  <label htmlFor="privatizable" className="text-sm font-medium text-primary">
                    Lieu privatisable
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Localisation */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">Localisation</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Localisation (Département) *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      className="form-input w-full"
                      placeholder="ex: Loire-Atlantique (44)"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Région *
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e) => updateField('region', e.target.value)}
                      className="form-input w-full"
                      required
                    >
                      <option value="pays-de-loire">Pays de la Loire</option>
                      <option value="bretagne">Bretagne</option>
                      <option value="nouvelle-aquitaine">Nouvelle-Aquitaine</option>
                      <option value="centre-val-de-loire">Centre-Val de Loire</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Capacités */}
          {activeTab === 'capacity' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">Capacités d&apos;accueil</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Capacité minimum
                    </label>
                    <input
                      type="number"
                      value={formData.capacityMin || ''}
                      onChange={(e) => updateField('capacityMin', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="form-input w-full"
                      placeholder="ex: 20"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Capacité maximum
                    </label>
                    <input
                      type="number"
                      value={formData.capacityMax || ''}
                      onChange={(e) => updateField('capacityMax', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="form-input w-full"
                      placeholder="ex: 200"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Capacités détaillées */}
          {activeTab === 'capacity-details' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Capacités détaillées par configuration</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Configuration théâtre
                  </label>
                  <input
                    type="number"
                    value={formData.capacityDetails.theater || ''}
                    onChange={(e) => updateField('capacityDetails', {
                      ...formData.capacityDetails,
                      theater: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    className="form-input w-full"
                    placeholder="ex: 150"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Banquet (assis)
                  </label>
                  <input
                    type="number"
                    value={formData.capacityDetails.banquet || ''}
                    onChange={(e) => updateField('capacityDetails', {
                      ...formData.capacityDetails,
                      banquet: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    className="form-input w-full"
                    placeholder="ex: 120"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Cocktail (debout)
                  </label>
                  <input
                    type="number"
                    value={formData.capacityDetails.cocktail || ''}
                    onChange={(e) => updateField('capacityDetails', {
                      ...formData.capacityDetails,
                      cocktail: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    className="form-input w-full"
                    placeholder="ex: 200"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Cocktail parc (extérieur)
                  </label>
                  <input
                    type="number"
                    value={formData.capacityDetails.cocktailPark || ''}
                    onChange={(e) => updateField('capacityDetails', {
                      ...formData.capacityDetails,
                      cocktailPark: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    className="form-input w-full"
                    placeholder="ex: 5000"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Configuration en U
                  </label>
                  <input
                    type="number"
                    value={formData.capacityDetails.uShape || ''}
                    onChange={(e) => updateField('capacityDetails', {
                      ...formData.capacityDetails,
                      uShape: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    className="form-input w-full"
                    placeholder="ex: 40"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Réunion
                  </label>
                  <input
                    type="number"
                    value={formData.capacityDetails.meeting || ''}
                    onChange={(e) => updateField('capacityDetails', {
                      ...formData.capacityDetails,
                      meeting: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    className="form-input w-full"
                    placeholder="ex: 30"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Rang d&apos;école (classroom)
                  </label>
                  <input
                    type="number"
                    value={formData.capacityDetails.classroom || ''}
                    onChange={(e) => updateField('capacityDetails', {
                      ...formData.capacityDetails,
                      classroom: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    className="form-input w-full"
                    placeholder="ex: 80"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Cabaret
                  </label>
                  <input
                    type="number"
                    value={formData.capacityDetails.cabaret || ''}
                    onChange={(e) => updateField('capacityDetails', {
                      ...formData.capacityDetails,
                      cabaret: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    className="form-input w-full"
                    placeholder="ex: 90"
                    min="1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Onglet Images */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">Images</h2>
                
                <div className="space-y-6">
                  {/* Image Hero */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Image Hero (principale) *
                    </label>
                    <div className="space-y-3">
                      {/* Input URL manuel */}
                      <input
                        type="url"
                        value={formData.heroImage}
                        onChange={(e) => updateField('heroImage', e.target.value)}
                        className="form-input w-full"
                        placeholder="https://firebasestorage.googleapis.com/..."
                        required
                      />
                      
                      {/* Bouton ImagePicker */}
                      <ImagePicker
                        currentValue={formData.heroImage}
                        onSelect={(url, path) => updateField('heroImage', url)}
                        initialPath="venues"
                      />
                      
                      <p className="text-xs text-secondary">
                        Image principale affichée en haut de la page du lieu (minimum 1920x1080px recommandé)
                      </p>
                    </div>
                  </div>
                  
                  {/* Image Carte */}
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Image Carte *
                    </label>
                    <div className="space-y-3">
                      {/* Input URL manuel */}
                      <input
                        type="url"
                        value={formData.cardImage}
                        onChange={(e) => updateField('cardImage', e.target.value)}
                        className="form-input w-full"
                        placeholder="https://firebasestorage.googleapis.com/..."
                        required
                      />
                      
                      {/* Bouton ImagePicker */}
                      <ImagePicker
                        currentValue={formData.cardImage}
                        onSelect={(url, path) => updateField('cardImage', url)}
                        initialPath="venues"
                      />
                      
                      <p className="text-xs text-secondary">
                        Image miniature affichée dans les listes et cartes (minimum 800x600px recommandé)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Onglet Infrastructures */}
          {activeTab === 'infrastructure' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Infrastructures</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Nombre de salles
                  </label>
                  <input
                    type="number"
                    value={formData.rooms || ''}
                    onChange={(e) => updateField('rooms', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="form-input w-full"
                    placeholder="ex: 3"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Nombre de chambres
                  </label>
                  <input
                    type="number"
                    value={formData.accommodationRooms || ''}
                    onChange={(e) => updateField('accommodationRooms', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="form-input w-full"
                    placeholder="ex: 15"
                    min="1"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary mb-2">
                    Détails hébergement
                  </label>
                  <textarea
                    value={formData.accommodationDetails}
                    onChange={(e) => updateField('accommodationDetails', e.target.value)}
                    className="form-input w-full"
                    rows={2}
                    placeholder="ex: 15 chambres dont 8 twin, 5 doubles et 2 suites"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Places de parking
                  </label>
                  <input
                    type="number"
                    value={formData.parkingSpaces || ''}
                    onChange={(e) => updateField('parkingSpaces', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="form-input w-full"
                    placeholder="ex: 50"
                    min="1"
                  />
                </div>
              </div>
              
              {/* Salles détaillées */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-primary">
                    Salles détaillées (avec superficie)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      updateField('detailedSpaces', [
                        ...formData.detailedSpaces,
                        { name: '', size: 0 }
                      ]);
                    }}
                    className="btn-secondary text-sm"
                  >
                    Ajouter une salle
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.detailedSpaces.map((space, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <input
                        type="text"
                        value={space.name}
                        onChange={(e) => {
                          const newSpaces = [...formData.detailedSpaces];
                          newSpaces[index].name = e.target.value;
                          updateField('detailedSpaces', newSpaces);
                        }}
                        className="form-input flex-1"
                        placeholder="Nom de la salle"
                      />
                      <input
                        type="number"
                        value={space.size}
                        onChange={(e) => {
                          const newSpaces = [...formData.detailedSpaces];
                          newSpaces[index].size = parseInt(e.target.value) || 0;
                          updateField('detailedSpaces', newSpaces);
                        }}
                        className="form-input w-32"
                        placeholder="m²"
                        min="1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newSpaces = formData.detailedSpaces.filter((_, i) => i !== index);
                          updateField('detailedSpaces', newSpaces);
                        }}
                        className="btn-secondary text-sm whitespace-nowrap"
                      >
                        Retirer
                      </button>
                    </div>
                  ))}
                  {formData.detailedSpaces.length === 0 && (
                    <p className="text-sm text-secondary italic">Aucune salle détaillée ajoutée</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Onglet Équipements & Services */}
          {activeTab === 'equipment' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Équipements & Services</h2>
              
              {/* Équipements techniques */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-primary">
                    Équipements techniques
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      updateField('equipment', [...formData.equipment, '']);
                    }}
                    className="btn-secondary text-sm"
                  >
                    Ajouter un équipement
                  </button>
                </div>
                
                <div className="space-y-2">
                  {formData.equipment.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newEquipment = [...formData.equipment];
                          newEquipment[index] = e.target.value;
                          updateField('equipment', newEquipment);
                        }}
                        className="form-input flex-1"
                        placeholder="ex: Vidéoprojecteur HD, Sonorisation..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newEquipment = formData.equipment.filter((_, i) => i !== index);
                          updateField('equipment', newEquipment);
                        }}
                        className="btn-secondary text-sm"
                      >
                        Retirer
                      </button>
                    </div>
                  ))}
                  {formData.equipment.length === 0 && (
                    <p className="text-sm text-secondary italic">Aucun équipement ajouté</p>
                  )}
                </div>
              </div>
              
              {/* Services */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-primary">
                    Services disponibles
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      updateField('services', [...formData.services, '']);
                    }}
                    className="btn-secondary text-sm"
                  >
                    Ajouter un service
                  </button>
                </div>
                
                <div className="space-y-2">
                  {formData.services.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newServices = [...formData.services];
                          newServices[index] = e.target.value;
                          updateField('services', newServices);
                        }}
                        className="form-input flex-1"
                        placeholder="ex: Traiteur exclusif, Wedding planner..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newServices = formData.services.filter((_, i) => i !== index);
                          updateField('services', newServices);
                        }}
                        className="btn-secondary text-sm"
                      >
                        Retirer
                      </button>
                    </div>
                  ))}
                  {formData.services.length === 0 && (
                    <p className="text-sm text-secondary italic">Aucun service ajouté</p>
                  )}
                </div>
              </div>
              
              {/* Activités */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-primary">
                    Activités proposées
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      updateField('activities', [...formData.activities, '']);
                    }}
                    className="btn-secondary text-sm"
                  >
                    Ajouter une activité
                  </button>
                </div>
                
                <div className="space-y-2">
                  {formData.activities.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newActivities = [...formData.activities];
                          newActivities[index] = e.target.value;
                          updateField('activities', newActivities);
                        }}
                        className="form-input flex-1"
                        placeholder="ex: Dégustation vins, Golf, Spa..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newActivities = formData.activities.filter((_, i) => i !== index);
                          updateField('activities', newActivities);
                        }}
                        className="btn-secondary text-sm"
                      >
                        Retirer
                      </button>
                    </div>
                  ))}
                  {formData.activities.length === 0 && (
                    <p className="text-sm text-secondary italic">Aucune activité ajoutée</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Onglet Contact */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Informations de contact</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Téléphone principal
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => updateField('contactPhone', e.target.value)}
                      className="form-input w-full"
                      placeholder="ex: 02 40 00 00 00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Email principal
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => updateField('contactEmail', e.target.value)}
                      className="form-input w-full"
                      placeholder="ex: contact@chateau.fr"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-neutral-200">
                  <h3 className="text-lg font-medium text-primary mb-3">Contact B2B (Séminaires)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Téléphone B2B
                      </label>
                      <input
                        type="tel"
                        value={formData.contactPhoneB2B}
                        onChange={(e) => updateField('contactPhoneB2B', e.target.value)}
                        className="form-input w-full"
                        placeholder="ex: 02 40 00 00 01"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Email B2B
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmailB2B}
                        onChange={(e) => updateField('contactEmailB2B', e.target.value)}
                        className="form-input w-full"
                        placeholder="ex: seminaires@chateau.fr"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-neutral-200">
                  <h3 className="text-lg font-medium text-primary mb-3">Contact Mariages</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Téléphone Mariages
                      </label>
                      <input
                        type="tel"
                        value={formData.contactPhoneMariages}
                        onChange={(e) => updateField('contactPhoneMariages', e.target.value)}
                        className="form-input w-full"
                        placeholder="ex: 02 40 00 00 02"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Email Mariages
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmailMariages}
                        onChange={(e) => updateField('contactEmailMariages', e.target.value)}
                        className="form-input w-full"
                        placeholder="ex: mariages@chateau.fr"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-neutral-200">
                  <h3 className="text-lg font-medium text-primary mb-3">Liens externes</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Site web
                      </label>
                      <input
                        type="url"
                        value={formData.contactWebsite}
                        onChange={(e) => updateField('contactWebsite', e.target.value)}
                        className="form-input w-full"
                        placeholder="https://www.chateau.fr"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={formData.contactInstagram}
                        onChange={(e) => updateField('contactInstagram', e.target.value)}
                        className="form-input w-full"
                        placeholder="@chateau_excellence"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-primary mb-2">
                        Lien Mariages.net
                      </label>
                      <input
                        type="url"
                        value={formData.contactMariagesNet}
                        onChange={(e) => updateField('contactMariagesNet', e.target.value)}
                        className="form-input w-full"
                        placeholder="https://www.mariages.net/..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Onglet Galerie */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Galerie photos</h2>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-primary">
                    Images de la galerie (10-20 photos recommandées)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      updateField('gallery', [...formData.gallery, '']);
                    }}
                    className="btn-secondary text-sm"
                  >
                    Ajouter une image
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.gallery.map((imageUrl, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1 space-y-2">
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => {
                            const newGallery = [...formData.gallery];
                            newGallery[index] = e.target.value;
                            updateField('gallery', newGallery);
                          }}
                          className="form-input w-full"
                          placeholder="https://firebasestorage.googleapis.com/..."
                        />
                        <ImagePicker
                          currentValue={imageUrl}
                          onSelect={(url) => {
                            const newGallery = [...formData.gallery];
                            newGallery[index] = url;
                            updateField('gallery', newGallery);
                          }}
                          initialPath="venues"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newGallery = formData.gallery.filter((_, i) => i !== index);
                          updateField('gallery', newGallery);
                        }}
                        className="btn-secondary text-sm whitespace-nowrap"
                      >
                        Retirer
                      </button>
                    </div>
                  ))}
                  {formData.gallery.length === 0 && (
                    <p className="text-sm text-secondary italic">Aucune image dans la galerie</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}