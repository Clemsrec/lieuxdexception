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
import Icon from '@/components/ui/Icon';

export interface VenueFiltersState {
  capacity: string;
  region: string;
  eventType: string;
  budget: string;
}

interface VenueFiltersProps {
  onFilterChange: (filters: VenueFiltersState) => void;
}

export default function VenueFilters({ onFilterChange }: VenueFiltersProps) {
  const [filters, setFilters] = useState<VenueFiltersState>({
    capacity: '',
    region: '',
    eventType: '',
    budget: '',
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
      budget: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Icon type="search" size={24} className="text-primary" aria-label="Recherche" />
        <h3 className="text-xl font-bold">Filtrer les domaines</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtre Capacité */}
        <div>
          <label htmlFor="filter-capacity" className="block text-sm font-medium mb-2">
            <Icon type="users" size={16} className="inline mr-1" aria-label="Capacité" />
            Capacité
          </label>
          <select
            id="filter-capacity"
            className="w-full border border-border rounded-lg p-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary"
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

        {/* Filtre Région */}
        <div>
          <label htmlFor="filter-region" className="block text-sm font-medium mb-2">
            <Icon type="mapPin" size={16} className="inline mr-1" aria-label="Région" />
            Région
          </label>
          <select
            id="filter-region"
            className="w-full border border-border rounded-lg p-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary"
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
          >
            <option value="">Toutes régions</option>
            <option value="ile-de-france">Île-de-France</option>
            <option value="pays-de-loire">Pays de la Loire</option>
            <option value="nouvelle-aquitaine">Nouvelle-Aquitaine</option>
            <option value="provence">Provence-Alpes-Côte d&apos;Azur</option>
            <option value="centre-val-de-loire">Centre-Val de Loire</option>
          </select>
        </div>

        {/* Filtre Type d'événement */}
        <div>
          <label htmlFor="filter-eventType" className="block text-sm font-medium mb-2">
            <Icon type="calendar" size={16} className="inline mr-1" aria-label="Type d'événement" />
            Type d&apos;événement
          </label>
          <select
            id="filter-eventType"
            className="w-full border border-border rounded-lg p-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary"
            value={filters.eventType}
            onChange={(e) => handleFilterChange('eventType', e.target.value)}
          >
            <option value="">Tous types</option>
            <option value="wedding">Mariage</option>
            <option value="seminar">Séminaire</option>
            <option value="conference">Conférence</option>
            <option value="reception">Réception</option>
            <option value="corporate">Team Building</option>
          </select>
        </div>

        {/* Filtre Budget */}
        <div>
          <label htmlFor="filter-budget" className="block text-sm font-medium mb-2">
            <Icon type="scale" size={16} className="inline mr-1" aria-label="Budget" />
            Budget
          </label>
          <select
            id="filter-budget"
            className="w-full border border-border rounded-lg p-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary"
            value={filters.budget}
            onChange={(e) => handleFilterChange('budget', e.target.value)}
          >
            <option value="">Tous budgets</option>
            <option value="0-5000">Moins de 5 000€</option>
            <option value="5000-10000">5 000€ - 10 000€</option>
            <option value="10000-20000">10 000€ - 20 000€</option>
            <option value="20000+">Plus de 20 000€</option>
          </select>
        </div>
      </div>

      {/* Bouton de réinitialisation */}
      {Object.values(filters).some((val) => val !== '') && (
        <button
          onClick={handleReset}
          className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <Icon type="ban" size={16} aria-label="Réinitialiser" />
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}
