'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, MapPin, Users, Euro, Search, Filter, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Types pour les lieux
interface Venue {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  location: string;
  region: string;
  capacityMin?: number;
  capacityMax?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  images: {
    hero: string;
    cardImage?: string;
  };
  eventTypes: string[];
  featured: boolean;
  active: boolean;
  displayOrder?: number;
}

export default function VenuesAdminPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEventType, setFilterEventType] = useState<'all' | 'b2b' | 'mariage'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Charger les lieux depuis l'API
  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    setLoading(true);
    try {
      // Admin : inclure les lieux inactifs aussi
      const response = await fetch('/api/venues?includeInactive=true');
      if (response.ok) {
        const data = await response.json();
        setVenues(data.venues || []);
      }
    } catch (error) {
      console.error('Erreur chargement lieux:', error);
    } finally {
      setLoading(false);
    }
  };



  // Supprimer un lieu avec double confirmation (SOFT DELETE par défaut)
  const deleteVenue = async (venueId: string, venueName: string) => {
    // Première confirmation
    const firstConfirm = confirm(
      `⚠️ DÉSACTIVATION DU LIEU : "${venueName}" ?\n\n` +
      `Cette action va DÉSACTIVER le lieu (soft delete) :\n` +
      `• Le lieu ne sera plus visible sur le site public\n` +
      `• Le lieu restera dans la base de données\n` +
      `• Le lieu pourra être restauré ultérieurement\n` +
      `• Les images et données seront conservées\n\n` +
      `Cliquez sur OK pour continuer.`
    );
    
    if (!firstConfirm) return;

    try {
      // Soft delete par défaut (deleted: true, active: false)
      const response = await fetch(`/api/venues/${venueId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message}`);
        loadVenues();
      } else {
        alert('❌ Erreur lors de la désactivation');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('❌ Erreur lors de la désactivation');
    }
  };

  // Filtrage des lieux
  const filteredVenues = venues.filter((venue) => {
    // Recherche textuelle
    const matchSearch = 
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.slug.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par type d'événement
    const matchEventType = filterEventType === 'all' || 
      venue.eventTypes.includes(filterEventType);

    // Filtre par statut
    const matchStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && venue.active) ||
      (filterStatus === 'inactive' && !venue.active);

    return matchSearch && matchEventType && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-charcoal-900 mb-2">
            Gestion des Lieux
          </h1>
          <p className="text-secondary">
            {venues.length} lieu{venues.length > 1 ? 'x' : ''} au total • {filteredVenues.length} affiché{filteredVenues.length > 1 ? 's' : ''}
          </p>
        </div>

        <Link
          href="/admin/venues/nouveau"
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouveau lieu
        </Link>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, lieu ou slug..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
            />
          </div>

          {/* Bouton filtres */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters ? 'bg-accent text-white border-accent' : 'bg-white border-stone-300 hover:bg-stone-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filtres
          </button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type d'événement */}
            <div>
              <label className="block text-sm font-medium mb-2">Type d&apos;événement</label>
              <select
                value={filterEventType}
                onChange={(e) => setFilterEventType(e.target.value as any)}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
              >
                <option value="all">Tous</option>
                <option value="b2b">B2B / Séminaires</option>
                <option value="mariage">Mariages</option>
              </select>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
              >
                <option value="all">Tous</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Liste des lieux */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-secondary">Chargement des lieux...</p>
        </div>
      ) : filteredVenues.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
          <p className="text-secondary text-lg">Aucun lieu trouvé</p>
          {searchTerm && (
            <p className="text-sm text-secondary mt-2">
              Essayez de modifier votre recherche ou vos filtres
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-md ${
                venue.active ? 'border-neutral-200' : 'border-red-200 bg-red-50/30'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-4 p-4">
                {/* Image */}
                <div className="w-full md:w-48 h-32 relative rounded-lg overflow-hidden shrink-0 bg-stone-100">
                  {venue.images?.cardImage || venue.images?.hero ? (
                    <Image
                      src={venue.images.cardImage || venue.images.hero}
                      alt={venue.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 192px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary">
                      Pas d&apos;image
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-charcoal-900">
                          {venue.name}
                        </h3>
                        {venue.featured && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-accent text-white rounded">
                            Mis en avant
                          </span>
                        )}
                        {!venue.active && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded">
                            Inactif
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-secondary mb-2">{venue.shortDescription}</p>
                    </div>
                  </div>

                  {/* Métadonnées */}
                  <div className="flex flex-wrap gap-4 text-sm text-secondary mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {venue.location}
                    </div>
                    {(venue.capacityMin || venue.capacityMax) && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {venue.capacityMin}-{venue.capacityMax} pers.
                      </div>
                    )}
                    {venue.priceRange && (
                      <div className="flex items-center gap-1">
                        <Euro className="w-4 h-4" />
                        {venue.priceRange.min}€ - {venue.priceRange.max}€
                      </div>
                    )}
                  </div>

                  {/* Tags événements */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {venue.eventTypes.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-1 text-xs rounded-full bg-stone-100 text-stone-700"
                      >
                        {type === 'b2b' ? 'B2B / Séminaires' : type === 'mariage' ? 'Mariages' : type}
                      </span>
                    ))}
                  </div>

                  {/* Slug */}
                  <p className="text-xs text-secondary font-mono">
                    /lieux/{venue.slug}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 shrink-0 relative z-10">
                  {/* Voir sur le site */}
                  <Link
                    href={`/lieux/${venue.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors cursor-pointer"
                    title="Voir sur le site"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>

                  {/* Éditer */}
                  <Link
                    href={`/admin/venues/${venue.id}`}
                    className="p-2 rounded-lg bg-accent text-white hover:bg-accent-dark transition-colors cursor-pointer"
                    title="Éditer"
                  >
                    <Edit2 className="w-5 h-5" />
                  </Link>

                  {/* Supprimer (double confirmation) */}
                  <button
                    onClick={() => deleteVenue(venue.id, venue.name)}
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
                    title="Supprimer (double confirmation)"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
