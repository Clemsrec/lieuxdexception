'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { displayVenueName } from '@/lib/formatVenueName';
import { getMapThumbnail } from '@/lib/sharedVenueImages';
import Link from 'next/link';
import { Venue } from '@/types/firebase';
import { MapPin, Users, Phone, Mail } from 'lucide-react';

/**
 * Composant carte interactive Leaflet pour afficher les châteaux
 * Style premium avec markers personnalisés et popups luxe
 */

interface VenuesMapProps {
  venues: Venue[];
}

/**
 * Icône marker personnalisée (pin or champagne)
 */
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        position: relative;
        width: 40px;
        height: 50px;
      ">
        <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C10.335 0 2.5 7.835 2.5 17.5C2.5 30.625 20 50 20 50C20 50 37.5 30.625 37.5 17.5C37.5 7.835 29.665 0 20 0Z" fill="#C9A961" stroke="#1B365D" stroke-width="2"/>
          <circle cx="20" cy="17.5" r="6" fill="#1B365D"/>
        </svg>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
};

/**
 * Composant pour ajuster la vue de la carte
 */
function MapBounds({ venues }: { venues: Venue[] }) {
  const map = useMap();

  useEffect(() => {
    if (venues.length === 0) return;

    const bounds = L.latLngBounds(
      venues
        .filter(v => v.lat && v.lng)
        .map(v => [v.lat, v.lng] as [number, number])
    );

    // Ajouter du padding pour éviter que les markers soient coupés
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
  }, [venues, map]);

  return null;
}

export default function VenuesMap({ venues }: VenuesMapProps) {
  console.log('🗺️ [VenuesMap] Venues reçues:', venues.length, venues);
  // Filtrer les venues avec coordonnées valides
  const venuesWithCoords = venues.filter(v => v.lat && v.lng && v.lat !== 0 && v.lng !== 0);
  console.log('🗺️ [VenuesMap] Venues avec coordonnées:', venuesWithCoords.length, venuesWithCoords.map(v => ({ id: v.id, name: v.name, lat: v.lat, lng: v.lng })));

  // N'afficher la map qu'après le mount côté client (évite double init en dev)
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (venuesWithCoords.length === 0) {
    return (
      <div className="w-full h-[600px] bg-stone-light rounded-lg flex items-center justify-center">
        <p className="text-neutral-600 font-heading">
          Aucun lieu avec coordonnées disponibles (reçu {venues.length} venues)
        </p>
      </div>
    );
  }

  // Centre par défaut : Pays de la Loire
  const defaultCenter: [number, number] = [47.2, -1.5];
  
  // Afficher un placeholder pendant le premier render
  if (!isMounted) {
    return (
      <div className="w-full h-[600px] bg-stone-light rounded-lg flex items-center justify-center">
        <p className="text-neutral-600 font-heading">Chargement de la carte...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg border-2 border-accent/20">
      <MapContainer
        center={defaultCenter}
        zoom={9}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        {/* Tuiles OpenStreetMap avec style clair */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
          className="map-tiles"
        />

        {/* Ajuster la vue aux markers */}
        <MapBounds venues={venuesWithCoords} />

        {/* Markers pour chaque château */}
        {venuesWithCoords.map((venue) => (
          <Marker
            key={venue.id}
            position={[venue.lat, venue.lng]}
            icon={createCustomIcon()}
          >
            <Popup
              className="venue-popup"
              minWidth={380}
              maxWidth={420}
            >
              <div className="p-3">
                {/* Image du château (forcée aux 4 images partagées) */}
                <div className="relative w-full h-56 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={getMapThumbnail(venue.id || venue.slug)}
                    alt={displayVenueName(venue.name)}
                    fill
                    className="object-cover"
                    sizes="420px"
                  />
                </div>

                {/* Nom du château */}
                <h3 className="font-display text-2xl text-primary mb-2">
                  {displayVenueName(venue.name)}
                </h3>

                {/* Ligne décorative */}
                <div className="w-16 h-px bg-accent mb-4" />

                {/* Informations */}
                <div className="space-y-2 mb-4">
                  {/* Adresse */}
                  {venue.address && (
                    <div className="flex items-start gap-2 text-sm text-neutral-700">
                      <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>
                        {venue.address.street && `${venue.address.street}, `}
                        {venue.address.postalCode} {venue.address.city}
                        {venue.address.region && `, ${venue.address.region}`}
                      </span>
                    </div>
                  )}

                  {/* Capacité */}
                  {venue.capacity && (
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <Users className="w-4 h-4 text-accent shrink-0" />
                      <span>
                        {venue.capacity.min}-{venue.capacity.max} personnes
                      </span>
                    </div>
                  )}

                  {/* Téléphone */}
                  {venue.contact?.phone && (
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <Phone className="w-4 h-4 text-accent shrink-0" />
                      <a 
                        href={`tel:${venue.contact.phone}`}
                        className="hover:text-accent transition-colors"
                      >
                        {venue.contact.phone}
                      </a>
                    </div>
                  )}

                  {/* Email */}
                  {venue.contact?.email && (
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <Mail className="w-4 h-4 text-accent shrink-0" />
                      <a 
                        href={`mailto:${venue.contact.email}`}
                        className="hover:text-accent transition-colors truncate"
                      >
                        {venue.contact.email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Bouton CTA */}
                <Link
                  href={`/lieux/${venue.slug}`}
                  className="block w-full text-center bg-accent hover:bg-accent-dark text-white font-heading font-semibold py-3 px-4 rounded-md transition-all duration-300 hover:shadow-lg"
                >
                  Découvrir le lieu →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style jsx global>{`
        /* Styles personnalisés pour la carte Leaflet */
        .leaflet-container {
          font-family: var(--font-body);
          z-index: 1;
        }

        /* Désaturer légèrement les tuiles pour un look plus premium */
        .map-tiles {
          filter: saturate(0.8) brightness(1.05);
        }

        /* Popup personnalisée */
        .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(27, 54, 93, 0.15);
          border: 2px solid rgba(201, 169, 97, 0.2);
        }

        .leaflet-popup-content {
          margin: 0;
          width: 100% !important;
        }

        .leaflet-popup-tip {
          background: white;
          border: 2px solid rgba(201, 169, 97, 0.2);
          border-top: none;
          border-right: none;
        }
        
        /* Bouton de fermeture - repositionné en haut à droite, bien visible */
        .leaflet-popup-close-button {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 32px;
          height: 32px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          color: #1B365D !important;
          font-size: 24px;
          font-weight: bold;
          padding: 0;
          border: 2px solid rgba(201, 169, 97, 0.3);
        }
        
        .leaflet-popup-close-button:hover {
          background: #C9A961;
          color: white !important;
          border-color: #C9A961;
        }

        /* Boutons de contrôle */
        .leaflet-control-zoom a {
          background-color: white;
          color: #1B365D;
          border: 2px solid rgba(201, 169, 97, 0.3);
          width: 36px;
          height: 36px;
          line-height: 32px;
          font-size: 20px;
          font-weight: 600;
        }

        .leaflet-control-zoom a:hover {
          background-color: #C9A961;
          color: white;
          border-color: #C9A961;
        }

        /* Attribution */
        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid rgba(201, 169, 97, 0.2);
        }

        /* Marker hover animation */
        .custom-marker {
          transition: transform 0.2s ease;
        }

        .custom-marker:hover {
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  );
}
