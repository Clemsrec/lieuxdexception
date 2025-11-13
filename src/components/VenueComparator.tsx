/**
 * Composant VenueComparator - Comparateur de lieux
 * 
 * Permet de sélectionner jusqu'à 3 domaines et de les comparer
 * sur différents critères (capacité, localisation, équipements, tarifs).
 * 
 * @example
 * ```tsx
 * <VenueComparator venues={venues} />
 * ```
 */

'use client';

import { useState } from 'react';
import type { Venue } from '@/types/firebase';
import Icon from '@/components/ui/Icon';

interface VenueComparatorProps {
  venues: Venue[];
}

export default function VenueComparator({ venues }: VenueComparatorProps) {
  const [selectedVenues, setSelectedVenues] = useState<Venue[]>([]);

  /**
   * Ajoute ou retire un lieu de la sélection
   */
  const toggleVenue = (venue: Venue) => {
    if (selectedVenues.find((v) => v.id === venue.id)) {
      setSelectedVenues(selectedVenues.filter((v) => v.id !== venue.id));
    } else if (selectedVenues.length < 3) {
      setSelectedVenues([...selectedVenues, venue]);
    }
  };

  /**
   * Vérifie si un lieu est sélectionné
   */
  const isSelected = (venueId: string) => {
    return selectedVenues.some((v) => v.id === venueId);
  };

  return (
    <div>
      {/* Sélection des lieux */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">
          Sélectionnez jusqu&apos;à 3 domaines à comparer
          {selectedVenues.length > 0 && (
            <span className="text-primary ml-2">
              ({selectedVenues.length}/3)
            </span>
          )}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {venues.map((venue) => {
            const selected = isSelected(venue.id);
            const disabled = selectedVenues.length >= 3 && !selected;

            return (
              <button
                key={venue.id}
                onClick={() => toggleVenue(venue)}
                disabled={disabled}
                className={`p-4 border-2 rounded-lg transition ${
                  selected
                    ? 'border-primary bg-blue-50 shadow-md'
                    : disabled
                    ? 'border-gray-200 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-primary hover:shadow'
                }`}
              >
                <div className="relative">
                  <img
                    src={venue.image || venue.images.hero}
                    className="w-full h-24 object-cover rounded mb-2"
                    alt={venue.name}
                  />
                  {selected && (
                    <div className="absolute top-0 right-0 bg-primary text-white rounded-full p-1">
                      <Icon type="check" size={16} aria-label="Sélectionné" />
                    </div>
                  )}
                </div>
                <p className="font-medium text-sm text-center">{venue.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message d'instruction */}
      {selectedVenues.length === 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <Icon type="info" size={20} className="text-blue-600 shrink-0 mt-0.5" aria-label="Information" />
            <p className="text-blue-800 text-sm">
              Sélectionnez au moins un autre domaine pour commencer la comparaison.
            </p>
          </div>
        </div>
      )}

      {/* Tableau comparatif */}
      {selectedVenues.length >= 2 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left font-medium border-b">Critères</th>
                {selectedVenues.map((venue) => (
                  <th key={venue.id} className="p-4 text-center border-b">
                    <div className="relative">
                      <img
                        src={venue.image || venue.images.hero}
                        className="w-full h-32 object-cover rounded mb-2"
                        alt={venue.name}
                      />
                      <button
                        onClick={() => toggleVenue(venue)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                        title="Retirer de la comparaison"
                      >
                        <Icon type="ban" size={16} aria-label="Retirer" />
                      </button>
                    </div>
                    <p className="font-bold text-lg">{venue.name}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow
                label="Localisation"
                icon="mapPin"
                values={selectedVenues.map((v) => v.location || `${v.address.city}, ${v.address.region}`)}
              />
              <CompareRow
                label="Capacité maximale"
                icon="users"
                values={selectedVenues.map((v) => `${v.capacity.max} personnes`)}
              />
              <CompareRow
                label="Types d'événements"
                icon="calendar"
                values={selectedVenues.map((v) => v.eventTypes.join(', '))}
              />
              <CompareRow
                label="Tarif journée B2B"
                icon="scale"
                values={selectedVenues.map(
                  (v) => `${v.priceRange?.min || v.pricing.b2b.fullDay}€ - ${v.priceRange?.max || v.pricing.b2b.fullDay}€`
                )}
              />
              <CompareRow
                label="Hébergement"
                icon="building"
                values={selectedVenues.map((v) => {
                  const hasAccommodation = v.accommodation ?? v.amenities.accommodation;
                  const rooms = v.accommodationRooms;
                  return hasAccommodation
                    ? rooms
                      ? `Oui (${rooms} chambres)`
                      : 'Oui'
                    : 'Non';
                })}
                highlight={(value) => value !== 'Non'}
              />
              <CompareRow
                label="Traiteur sur place"
                icon="chefHat"
                values={selectedVenues.map((v) =>
                  v.catering ?? v.amenities.catering ? 'Oui' : 'Non'
                )}
                highlight={(value) => value !== 'Non'}
              />
              <CompareRow
                label="Parking"
                icon="car"
                values={selectedVenues.map((v) => {
                  const parkingSpaces = v.parking;
                  const hasParking = parkingSpaces || v.amenities.parking;
                  return hasParking
                    ? typeof parkingSpaces === 'number'
                      ? `${parkingSpaces} places`
                      : 'Oui'
                    : 'Non';
                })}
              />
              <CompareRow
                label="Matériel audiovisuel"
                icon="mic"
                values={selectedVenues.map((v) =>
                  v.audioVisual ?? v.amenities.audioVisual ? 'Oui' : 'Non'
                )}
              />
              <CompareRow
                label="WiFi"
                icon="globe"
                values={selectedVenues.map((v) =>
                  v.wifi ?? v.amenities.wifi ? 'Oui' : 'Non'
                )}
              />
              <CompareRow
                label="Accessibilité PMR"
                icon="users2"
                values={selectedVenues.map((v) =>
                  v.accessibility ?? v.amenities.accessibility ? 'Oui' : 'Non'
                )}
                highlight={(value) => value !== 'Non'}
              />

              {/* Boutons d'action */}
              <tr>
                <td className="p-4 font-medium bg-gray-50 border-t">Actions</td>
                {selectedVenues.map((venue) => (
                  <td key={venue.id} className="p-4 text-center border-t">
                    <div className="space-y-2">
                      <a
                        href={venue.url || venue.contact.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full inline-flex items-center justify-center gap-2"
                      >
                        Voir le site
                        <Icon type="externalLink" size={16} aria-label="Lien externe" />
                      </a>
                      <a
                        href={`/contact?venue=${venue.id}`}
                        className="inline-block w-full border-2 border-primary text-primary px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium"
                      >
                        Demander un devis
                      </a>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* État vide */}
      {selectedVenues.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Icon type="search" size={48} className="text-gray-300 mx-auto mb-4" aria-label="Sélection vide" />
          <p className="text-gray-500 text-lg">
            Sélectionnez des domaines ci-dessus pour commencer la comparaison
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Ligne de comparaison dans le tableau
 */
interface CompareRowProps {
  label: string;
  icon: string;
  values: string[];
  highlight?: (value: string) => boolean;
}

function CompareRow({ label, icon, values, highlight }: CompareRowProps) {
  return (
    <tr className="border-t hover:bg-gray-50 transition">
      <td className="p-4 font-medium bg-gray-50">
        <div className="flex items-center gap-2">
          <Icon type={icon as any} size={16} aria-label={label} />
          {label}
        </div>
      </td>
      {values.map((value, idx) => (
        <td
          key={idx}
          className={`p-4 text-center ${
            highlight && highlight(value) ? 'font-semibold text-green-700' : ''
          }`}
        >
          {value}
        </td>
      ))}
    </tr>
  );
}
