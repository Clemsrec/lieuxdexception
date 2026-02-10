'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, FileText, MapPin, Users, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

/**
 * Page d'édition des lieux ULTRA-SIMPLIFIÉE 
 * Garde uniquement les champs essentiels pour les pages publiques :
 * - Nom, description, localisation
 * - Capacités min/max
 * - Images hero et card
 * - Statut actif
 */

interface VenueFormData {
  // Essentiel public
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  location: string;
  region: string;
  capacityMin: number | undefined;
  capacityMax: number | undefined;
  heroImage: string;
  cardImage: string;
  active: boolean;
}

const DEFAULT_VENUE_DATA: VenueFormData = {
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  location: '',
  region: 'pays-de-loire',
  capacityMin: undefined,
  capacityMax: undefined,
  heroImage: '',
  cardImage: '',
  active: true,
};

type TabId = 'general' | 'location' | 'capacity' | 'media';

const TABS = [
  { id: 'general' as TabId, label: 'Informations', icon: FileText },
  { id: 'location' as TabId, label: 'Localisation', icon: MapPin },
  { id: 'capacity' as TabId, label: 'Capacités', icon: Users },
  { id: 'media' as TabId, label: 'Images', icon: ImageIcon },
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
            location: venue.location || '',
            region: venue.region || 'pays-de-loire',
            capacityMin: venue.capacity?.min ?? venue.capacityMin,
            capacityMax: venue.capacity?.max ?? venue.capacityMax,
            heroImage: venue.heroImage || venue.image || '',
            cardImage: venue.cardImage || '',
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
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          shortDescription: formData.shortDescription,
          location: formData.location,
          region: formData.region,
          capacity: {
            min: formData.capacityMin,
            max: formData.capacityMax,
          },
          capacityMin: formData.capacityMin, // Compatibilité
          capacityMax: formData.capacityMax, // Compatibilité
          heroImage: formData.heroImage,
          image: formData.heroImage, // Compatibilité
          cardImage: formData.cardImage,
          active: formData.active,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        alert('✅ Lieu mis à jour');
      } else {
        throw new Error('Erreur API');
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('❌ Erreur sauvegarde');
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
                <h2 className="text-xl font-semibold text-primary mb-4">Capacités d'accueil</h2>
                
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

          {/* Onglet Images */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">Images</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Image Hero (principale) *
                    </label>
                    <input
                      type="url"
                      value={formData.heroImage}
                      onChange={(e) => updateField('heroImage', e.target.value)}
                      className="form-input w-full"
                      placeholder="https://firebasestorage.googleapis.com/..."
                      required
                    />
                    <p className="text-xs text-secondary mt-1">
                      Image principale affichée en haut de la page du lieu
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Image Carte *
                    </label>
                    <input
                      type="url"
                      value={formData.cardImage}
                      onChange={(e) => updateField('cardImage', e.target.value)}
                      className="form-input w-full"
                      placeholder="https://firebasestorage.googleapis.com/..."
                      required
                    />
                    <p className="text-xs text-secondary mt-1">
                      Image miniature affichée dans les listes et cartes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}