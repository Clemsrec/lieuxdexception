/**
 * Composant InteractiveMap - Carte interactive Google Maps
 * 
 * Affiche une carte interactive avec markers pour chaque lieu d'exception.
 * Version responsive : carte sur desktop, liste sur mobile.
 * 
 * @example
 * ```tsx
 * <InteractiveMap venues={venues} />
 * ```
 */

'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import type { Venue } from '@/types/firebase';
import { displayVenueName } from '@/lib/formatVenueName';

interface InteractiveMapProps {
  venues: Venue[];
}

const mapStyles = {
  height: '500px',
  width: '100%',
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

/**
 * Centre de la carte sur la France
 */
const defaultCenter = {
  lat: 47.0,
  lng: 2.0,
};

export default function InteractiveMap({ venues }: InteractiveMapProps) {
  const [selected, setSelected] = useState<Venue | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Version mobile : liste des lieux
  if (isMobile) {
    return (
      <div className="space-y-4">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="bg-white rounded-lg shadow p-4 flex gap-4 hover:shadow-md transition"
          >
            <img
                src={venue.image || venue.images.hero}
                className="w-24 h-24 object-cover rounded"
                alt={displayVenueName(venue.name)}
              />
            <div className="flex-1">
              <h3 className="font-bold text-lg">{displayVenueName(venue.name)}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <span>📍</span>
                <span>{venue.location || venue.address.city}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <span className="font-medium">Capacité:</span>
                <span>Capacité: {venue.capacity.max} pers.</span>
              </div>
              <a
                href={venue.url || venue.contact.website || '#'}
                className="inline-flex items-center gap-1 text-blue-600 text-sm hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Découvrir →
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Version desktop : carte Google Maps
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  if (!apiKey) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <div className="text-4xl text-yellow-600 mx-auto mb-2">⚠</div>
        <p className="text-yellow-800 font-medium mb-2">
          Clé API Google Maps non configurée
        </p>
        <p className="text-sm text-yellow-700">
          Ajoutez <code className="bg-yellow-100 px-2 py-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> dans votre fichier <code className="bg-yellow-100 px-2 py-1 rounded">.env.local</code>
        </p>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={6}
        center={defaultCenter}
        options={mapOptions}
      >
        {venues.map((venue) => {
          const position = {
            lat: venue.lat || venue.address.coordinates.lat,
            lng: venue.lng || venue.address.coordinates.lng,
          };

          return (
            <Marker
              key={venue.id}
              position={position}
              onClick={() => setSelected(venue)}
              icon={{
                url: '/marker-custom.svg',
                scaledSize: new google.maps.Size(40, 40),
              }}
              title={displayVenueName(venue.name)}
            />
          );
        })}

        {selected && (
          <InfoWindow
            position={{
              lat: selected.lat || selected.address.coordinates.lat,
              lng: selected.lng || selected.address.coordinates.lng,
            }}
            onCloseClick={() => setSelected(null)}
          >
            <div className="p-2 max-w-xs">
              <img
                src={selected.image || selected.images.hero}
                className="w-full h-32 object-cover rounded mb-2"
                alt={displayVenueName(selected.name)}
              />
              <h3 className="font-bold text-lg mb-1">{displayVenueName(selected.name)}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                <span>📍</span>
                <span>{selected.location || selected.address.city}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                <span className="font-medium">Capacité:</span>
                <span>Capacité: {selected.capacity.max} personnes</span>
              </div>
              <a
                href={selected.url || selected.contact.website || '#'}
                className="inline-flex items-center gap-1 text-blue-600 text-sm hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Découvrir ce lieu →
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
