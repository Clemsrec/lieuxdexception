/**
 * Composant VenueFilters - Filtres avancés pour les lieux
 * 
 * Permet de filtrer les lieux par capacité, région, type d'événement et budget.
 * 
 * @example
 * ```tsx
 * <VenueFilters onFilterChange={handleFilters} venues={venues} />
 * ```
 */

'use client';

import { useState } from 'react';

export interface VenueFiltersState {
  capacity: string;
  region: string;
  eventType: string;
}

interface VenueFiltersProps {
  onFilterChange: (filters: VenueFiltersState) => void;
}

export default function VenueFilters({ onFilterChange }: VenueFiltersProps) {
  const [filters, setFilters] = useState<VenueFiltersState>({
    capacity: '',
    region: '',
    eventType: '',
  });

  /**
   * Gère le changement d'un filtre individuel
   */
  const handleFilterChange = (key: keyof VenueFiltersState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  /**
   * Réinitialise tous les filtres
   */
  const handleReset = () => {
    const resetFilters = {
      capacity: '',
      region: '',
      eventType: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-bold mb-4">Filtrer les domaines</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtre Capacité */}
        <div>
          <label htmlFor="filter-capacity" className="block text-sm font-medium mb-2">
            Capacité
          </label>
          <select
            id="filter-capacity"
            className="w-full border border-border rounded-lg p-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary"
            value={filters.capacity}
            onChange={(e) => handleFilterChange('capacity', e.target.value)}
          >
            <option value="">Toutes capacités</option>
            <option value="0-50">Jusqu&apos;à 50 personnes</option>
            <option value="50-100">50-100 personnes</option>
            <option value="100-200">100-200 personnes</option>
            <option value="200-300">200-300 personnes</option>
            <option value="300+">300+ personnes</option>
          </select>
        </div>

        {/* Filtre Région */}
        <div>
          <label htmlFor="filter-region" className="block text-sm font-medium mb-2">
            Localisation
          </label>
          <select
            id="filter-region"
            className="w-full border border-border rounded-lg p-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary"
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
          >
            <option value="">Toutes localisations</option>
            <option value="Loire-Atlantique">Loire-Atlantique (44)</option>
            <option value="Vendée">Vendée (85)</option>
          </select>
        </div>

        {/* Filtre Type d'événement */}
        <div>
          <label htmlFor="filter-eventType" className="block text-sm font-medium mb-2">
            Type d&apos;événement
          </label>
          <select
            id="filter-eventType"
            className="w-full border border-border rounded-lg p-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary"
            value={filters.eventType}
            onChange={(e) => handleFilterChange('eventType', e.target.value)}
          >
            <option value="">Tous types</option>
            <option value="mariage">Mariage</option>
            <option value="b2b">Événement B2B</option>
            <option value="seminaire">Séminaire</option>
            <option value="conference">Conférence</option>
            <option value="reception">Réception</option>
            <option value="team-building">Team Building</option>
          </select>
        </div>
      </div>

      {/* Bouton de réinitialisation */}
      {Object.values(filters).some((val) => val !== '') && (
        <button
          onClick={handleReset}
          className="mt-4 inline-flex items-center gap-2 text-primary hover:text-accent font-medium transition-colors"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}
