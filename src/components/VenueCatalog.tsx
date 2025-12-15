/**
 * Composant VenueCatalog - Catalogue de lieux avec filtrage
 * 
 * Affiche la liste des lieux avec système de filtres avancés côté client.
 * Gère le filtrage par type d'événement, capacité et région.
 * Textes traduits avec next-intl.
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
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import type { Venue } from '@/types/firebase';
import { displayVenueName } from '@/lib/formatVenueName';
import { getCardImage } from '@/lib/sharedVenueImages';

// Mapping des comptes Instagram par id/slug de lieu
const venueInstagram: Record<string, string> = {
  'chateau-corbe': 'https://www.instagram.com/chateaudelacorbe/',
  'manoir-boulaie': 'https://www.instagram.com/manoirdelaboulaie/',
  'domaine-nantais': 'https://www.instagram.com/domainenantais/',
  'le-dome': 'https://www.instagram.com/_le_dome/',
  'chateau-brulaire': 'https://www.instagram.com/chateaudelabrulaire/'
};

interface VenueCatalogProps {
  venues: Venue[];
}

interface Filters {
  eventType: 'all' | 'b2b' | 'wedding';
  capacity: number | null;
  region: string | null;
}

export default function VenueCatalog({ venues }: VenueCatalogProps) {
  const t = useTranslations('Venues');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  
  const [filters, setFilters] = useState<Filters>({
    eventType: 'all',
    capacity: null,
    region: null,
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
    });
  };

  return (
    <>
      {/* Filtres de recherche */}
      <div className="bg-stone/30 rounded-xl p-6 md:p-8 mb-12 border border-accent/10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <span className="text-accent uppercase tracking-widest text-xs md:text-sm font-medium">{tCommon('filters')}</span>
          <div className="w-12 h-px bg-accent/30" />
          <h2 className="text-xl md:text-2xl font-display font-semibold text-primary">
            {t('filters.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          
          {/* Type d'événement */}
          <div>
            <label htmlFor="eventType" className="form-label">
              {t('filters.eventType')}
            </label>
            <select
              id="eventType"
              className="form-input"
              value={filters.eventType}
              onChange={(e) => setFilters({ ...filters, eventType: e.target.value as Filters['eventType'] })}
            >
              <option value="all">{t('filters.allEvents')}</option>
              <option value="b2b">{t('filters.b2bEvents')}</option>
              <option value="wedding">{t('filters.weddings')}</option>
            </select>
          </div>

          {/* Capacité */}
          <div>
            <label htmlFor="capacity" className="form-label">
              {t('filters.minCapacity')}
            </label>
            <select
              id="capacity"
              className="form-input"
              value={filters.capacity || ''}
              onChange={(e) => setFilters({ ...filters, capacity: e.target.value ? Number(e.target.value) : null })}
            >
              <option value="">{t('filters.allCapacities')}</option>
              <option value="50">50+ {tCommon('persons')}</option>
              <option value="100">100+ {tCommon('persons')}</option>
              <option value="150">150+ {tCommon('persons')}</option>
              <option value="200">200+ {tCommon('persons')}</option>
            </select>
          </div>

          {/* Région */}
          <div>
            <label htmlFor="region" className="form-label">
              {t('filters.location')}
            </label>
            <select
              id="region"
              className="form-input"
              value={filters.region || ''}
              onChange={(e) => setFilters({ ...filters, region: e.target.value || null })}
            >
              <option value="">{t('filters.allLocations')}</option>
              <option value="Loire-Atlantique">Loire-Atlantique (44)</option>
              <option value="Vendée">Vendée (85)</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-accent/10">
          <button
            onClick={resetFilters}
            className="text-secondary hover:text-primary transition-colors flex items-center gap-2 text-sm md:text-base min-h-[44px] py-2"
          >
            <span className="text-xl">×</span>
            {t('filters.reset')}
          </button>
          <div className="text-sm md:text-base text-secondary min-h-[44px] flex items-center">
            <span className="font-semibold text-accent">{filteredVenues.length}</span>{' '}
            {filteredVenues.length > 1 ? t('filters.venuesFoundPlural') : t('filters.venuesFound')}
          </div>
        </div>
      </div>

      {/* Grille des lieux */}
      {filteredVenues.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl text-secondary/20 mb-4">◇</div>
          <h3 className="text-2xl font-display font-semibold text-primary mb-3">
            {t('filters.noVenuesTitle')}
          </h3>
          <p className="text-secondary mb-6">
            {t('filters.noVenuesDescription')}
          </p>
          <button onClick={resetFilters} className="btn-secondary">
            {t('filters.reset')}
          </button>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {filteredVenues.map((venue, index) => (
            <VenueCard key={venue.id} venue={venue} index={index} />
          ))}
        </motion.div>
      )}
    </>
  );
}

/**
 * Composant VenueCard - Carte individuelle d'un lieu
 * 
 * @param venue - Données du lieu à afficher
 * @param index - Index pour animation stagger
 */
function VenueCard({ venue, index }: { venue: Venue; index: number }) {
  const t = useTranslations('Venues');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  
  const capacityRange = venue.capacity
    ? `${venue.capacityMin || venue.capacity.min} - ${venue.capacity.max} ${tCommon('persons')}`
    : 'Capacité sur demande';

  const dayRate = venue.pricing?.b2b?.fullDay
    ? `${venue.pricing.b2b.fullDay.toLocaleString('fr-FR')}€`
    : 'Sur demande';

  return (
    <motion.article 
      className="venue-card group overflow-hidden"
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
          }
        }
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
    >
      {/* Image principale */}
      <Link 
        href={venue.externalUrl || venue.url || venue.contact?.website || `/lieux/${venue.slug}`}
        {...(venue.externalUrl || venue.url || venue.contact?.website ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="block relative overflow-hidden"
      >
        <div className="relative w-full aspect-16/10 md:aspect-16/11 bg-stone/20">
          <Image
            src={getCardImage(venue.id || venue.slug)}
            alt={displayVenueName(venue.name)}
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
        <Link 
          href={venue.externalUrl || venue.url || venue.contact?.website || `/lieux/${venue.slug}`}
          {...(venue.externalUrl || venue.url || venue.contact?.website ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="group-hover:text-accent transition-colors"
        >
          <h3 className="text-2xl font-display font-semibold text-primary mb-2">
            {displayVenueName(venue.name)}
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
            <span className="text-accent uppercase tracking-wider text-xs block mb-1">{t('location')}</span>
            <span>{venue.address.city}, {venue.address.region}</span>
          </div>
          <div>
            <span className="text-accent uppercase tracking-wider text-xs block mb-1">{t('capacity')}</span>
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
              {t('eventTypes.wedding')}
            </span>
          )}
          {(venue.eventTypes?.includes('corporate') || venue.eventTypes?.includes('conference') || venue.eventTypes?.includes('seminar')) && (
            <span className="inline-flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
              {t('eventTypes.b2b')}
            </span>
          )}
          {venue.amenitiesList && venue.amenitiesList.includes('Hébergement') && (
            <span className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
              {t('accommodation')}
            </span>
          )}
        </div>

        {/* Footer avec prix, Instagram et CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-auto pt-6 border-t border-stone/20">
          <div>
            <span className="text-xs md:text-sm text-secondary block mb-1.5">{t('from')}</span>
            <div className="font-semibold text-xl md:text-2xl text-accent">
              {dayRate}
              <span className="text-sm md:text-base text-secondary font-normal">{t('perDay')}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Instagram specific */}
            {(() => {
              const byMap = venueInstagram[venue.id || venue.slug];
              let insta: string | undefined = undefined;
              if (byMap) insta = byMap;
              else if (venue.contact?.instagram) {
                const raw = venue.contact.instagram;
                if (raw.startsWith('http')) insta = raw;
                else insta = `https://www.instagram.com/${raw.replace(/^@/, '')}/`;
              }
              if (!insta) return null;
              return (
                <a
                  href={insta}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-accent transition-colors text-sm"
                >
                  Instagram
                </a>
              );
            })()}

            <Link 
            href={venue.externalUrl || venue.url || venue.contact?.website || `/${locale}/lieux/${venue.slug}`}
            {...(venue.externalUrl || venue.url || venue.contact?.website ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="btn-primary text-sm md:text-base px-6 py-3 min-h-[48px] flex items-center gap-2 w-full sm:w-auto justify-center group/btn"
          >
            {venue.externalUrl || venue.url || venue.contact?.website ? t('visitWebsite') : t('discover')}
            <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
          </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
