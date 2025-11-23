/**
 * Composant VenueCatalog - Catalogue de lieux avec filtrage
 * 
 * Affiche la liste des lieux avec système de filtres avancés côté client.
 * Gère le filtrage par type d'événement, capacité, région et budget.
 * 
 * @example
 * ```tsx
 * <VenueCatalog venues={venues} />
 * ```
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Venue } from '@/types/firebase';

interface VenueCatalogProps {
  venues: Venue[];
}

interface Filters {
  eventType: 'all' | 'b2b' | 'wedding';
  capacity: number | null;
  region: string | null;
  budget: number | null;
}

export default function VenueCatalog({ venues }: VenueCatalogProps) {
  const [filters, setFilters] = useState<Filters>({
    eventType: 'all',
    capacity: null,
    region: null,
    budget: null,
  });

  /**
   * Filtre les lieux en fonction des critères sélectionnés
   */
  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      // Filtre par type d'événement
      if (filters.eventType !== 'all') {
        if (filters.eventType === 'b2b') {
          // Vérifie les types corporate/conference/seminar
          const hasB2BType = venue.eventTypes?.some(type => 
            ['corporate', 'conference', 'seminar'].includes(type)
          );
          if (!hasB2BType) return false;
        } else if (filters.eventType === 'wedding') {
          const hasWedding = venue.eventTypes?.includes('wedding');
          if (!hasWedding) return false;
        }
      }

      // Filtre par capacité
      if (filters.capacity !== null) {
        const maxCapacity = venue.capacity?.max || 0;
        if (maxCapacity < filters.capacity) return false;
      }

      // Filtre par région
      if (filters.region !== null) {
        if (venue.region !== filters.region) return false;
      }

      // Filtre par budget (utilise pricing.b2b.fullDay comme référence)
      if (filters.budget !== null && venue.pricing) {
        const dayRate = venue.pricing.b2b.fullDay || 0;
        if (dayRate > filters.budget) return false;
      }

      return true;
    });
  }, [venues, filters]);

  /**
   * Réinitialise tous les filtres
   */
  const resetFilters = () => {
    setFilters({
      eventType: 'all',
      capacity: null,
      region: null,
      budget: null,
    });
  };

  return (
    <>
      {/* Filtres de recherche */}
      <div className="bg-stone/30 rounded-xl p-6 md:p-8 mb-12 border border-accent/10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <span className="text-accent uppercase tracking-widest text-xs md:text-sm font-medium">Filtres</span>
          <div className="w-12 h-px bg-accent/30" />
          <h2 className="text-xl md:text-2xl font-display font-semibold text-primary">
            Filtrer par vos critères
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          
          {/* Type d'événement */}
          <div>
            <label htmlFor="eventType" className="form-label">
              Type d&apos;événement
            </label>
            <select
              id="eventType"
              className="form-input"
              value={filters.eventType}
              onChange={(e) => setFilters({ ...filters, eventType: e.target.value as Filters['eventType'] })}
            >
              <option value="all">Tous les événements</option>
              <option value="b2b">Événements B2B</option>
              <option value="wedding">Mariages</option>
            </select>
          </div>

          {/* Capacité */}
          <div>
            <label htmlFor="capacity" className="form-label">
              Capacité minimum
            </label>
            <select
              id="capacity"
              className="form-input"
              value={filters.capacity || ''}
              onChange={(e) => setFilters({ ...filters, capacity: e.target.value ? Number(e.target.value) : null })}
            >
              <option value="">Toutes capacités</option>
              <option value="50">50+ personnes</option>
              <option value="100">100+ personnes</option>
              <option value="150">150+ personnes</option>
              <option value="200">200+ personnes</option>
            </select>
          </div>

          {/* Région */}
          <div>
            <label htmlFor="region" className="form-label">
              Région
            </label>
            <select
              id="region"
              className="form-input"
              value={filters.region || ''}
              onChange={(e) => setFilters({ ...filters, region: e.target.value || null })}
            >
              <option value="">Toutes les régions</option>
              <option value="Centre-Val de Loire">Centre-Val de Loire</option>
              <option value="Pays de la Loire">Pays de la Loire</option>
              <option value="Île-de-France">Île-de-France</option>
              <option value="Provence-Alpes-Côte d'Azur">Provence-Alpes-Côte d&apos;Azur</option>
              <option value="Bourgogne-Franche-Comté">Bourgogne-Franche-Comté</option>
              <option value="Normandie">Normandie</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label htmlFor="budget" className="form-label">
              Budget maximum / jour
            </label>
            <select
              id="budget"
              className="form-input"
              value={filters.budget || ''}
              onChange={(e) => setFilters({ ...filters, budget: e.target.value ? Number(e.target.value) : null })}
            >
              <option value="">Tous budgets</option>
              <option value="5000">Jusqu&apos;à 5 000€</option>
              <option value="8000">Jusqu&apos;à 8 000€</option>
              <option value="12000">Jusqu&apos;à 12 000€</option>
              <option value="20000">Plus de 12 000€</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-accent/10">
          <button
            onClick={resetFilters}
            className="text-secondary hover:text-primary transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <span className="text-xl">×</span>
            Réinitialiser les filtres
          </button>
          <div className="text-sm md:text-base text-secondary">
            <span className="font-semibold text-accent">{filteredVenues.length}</span> lieu{filteredVenues.length > 1 ? 'x' : ''} trouvé{filteredVenues.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Grille des lieux */}
      {filteredVenues.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl text-secondary/20 mb-4">◇</div>
          <h3 className="text-2xl font-display font-semibold text-primary mb-3">
            Aucun lieu trouvé
          </h3>
          <p className="text-secondary mb-6">
            Essayez de modifier vos critères de recherche pour voir plus de résultats.
          </p>
          <button onClick={resetFilters} className="btn-secondary">
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {filteredVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </>
  );
}

/**
 * Composant VenueCard - Carte individuelle d'un lieu
 * 
 * @param venue - Données du lieu à afficher
 */
function VenueCard({ venue }: { venue: Venue }) {
  const capacityRange = venue.capacity
    ? `${venue.capacityMin || venue.capacity.min} - ${venue.capacity.max} personnes`
    : 'Capacité sur demande';

  const dayRate = venue.pricing?.b2b?.fullDay
    ? `${venue.pricing.b2b.fullDay.toLocaleString('fr-FR')}€`
    : 'Sur demande';

  return (
    <article className="venue-card group overflow-hidden">
      {/* Image principale */}
      <Link href={`/lieux/${venue.slug}`} className="block relative overflow-hidden">
        <div className="relative w-full aspect-16/10 md:aspect-16/11 bg-stone/20">
          <Image
            src={venue.images.hero || '/images/venues/placeholder.jpg'}
            alt={venue.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        
        {/* Badge featured */}
        {venue.featured && (
          <div className="absolute top-4 right-4 bg-linear-to-r from-accent to-accent/80 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
            <span className="inline mr-1">★</span>
            Mis en avant
          </div>
        )}
      </Link>

      {/* Contenu */}
      <div className="flex-1 flex flex-col p-6 md:p-8">
        <Link href={`/lieux/${venue.slug}`} className="group-hover:text-accent transition-colors">
          <h3 className="text-2xl font-display font-semibold text-primary mb-2">
            {venue.name}
          </h3>
        </Link>

        {venue.tagline && (
          <p className="text-accent text-sm font-medium mb-3 italic">
            {venue.tagline}
          </p>
        )}

        {/* Localisation et capacité */}
        <div className="flex flex-wrap items-start gap-4 text-sm text-secondary mb-4">
          <div>
            <span className="text-accent uppercase tracking-wider text-xs block mb-1">Localisation</span>
            <span>{venue.address.city}, {venue.address.region}</span>
          </div>
          <div>
            <span className="text-accent uppercase tracking-wider text-xs block mb-1">Capacité</span>
            <span>{capacityRange}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-secondary text-sm mb-6 line-clamp-3 leading-relaxed">
          {venue.description}
        </p>

        {/* Tags types d'événements */}
        <div className="flex flex-wrap gap-2 mb-6">
          {venue.eventTypes?.includes('wedding') && (
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
              Mariages
            </span>
          )}
          {(venue.eventTypes?.includes('corporate') || venue.eventTypes?.includes('conference') || venue.eventTypes?.includes('seminar')) && (
            <span className="inline-flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
              Événements B2B
            </span>
          )}
          {venue.amenitiesList && venue.amenitiesList.includes('Hébergement') && (
            <span className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
              Hébergement
            </span>
          )}
        </div>

        {/* Footer avec prix et CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-auto pt-6 border-t border-stone/20">
          <div>
            <span className="text-xs md:text-sm text-secondary block mb-1.5">À partir de</span>
            <div className="font-semibold text-xl md:text-2xl text-accent">
              {dayRate}
              <span className="text-sm md:text-base text-secondary font-normal">/jour</span>
            </div>
          </div>
          <Link href={`/lieux/${venue.slug}`} className="btn-primary text-sm md:text-base px-6 py-3 flex items-center gap-2 w-full sm:w-auto justify-center group/btn">
            Découvrir ce lieu
            <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
