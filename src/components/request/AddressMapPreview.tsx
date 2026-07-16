import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';

const styleUrl = 'https://tiles.openfreemap.org/styles/positron';
const padovaCenter: [number, number] = [11.8768, 45.4064];

interface Props {
  coordinates: [number, number] | null;
  apiKey?: string;
  onAddressSelect: (address: string, coordinates: [number, number]) => void;
}

type GeoapifyReverseResponse = {
  results?: Array<{ formatted?: string }>;
};

export default function AddressMapPreview({ coordinates, apiKey, onAddressSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const apiKeyRef = useRef(apiKey);
  const onAddressSelectRef = useRef(onAddressSelect);
  const [isUnavailable, setIsUnavailable] = useState(false);
  apiKeyRef.current = apiKey;
  onAddressSelectRef.current = onAddressSelect;

  function showMarker(coordinatesToShow: [number, number]) {
    markerRef.current?.remove();
    markerRef.current = new maplibregl.Marker({ color: '#12130f' })
      .setLngLat(coordinatesToShow)
      .addTo(mapRef.current!);
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      const map = new maplibregl.Map({
        container,
        style: styleUrl,
        center: padovaCenter,
        zoom: 11,
        interactive: true,
        attributionControl: { compact: true },
      });
      mapRef.current = map;
      map.getCanvas().style.cursor = 'crosshair';

      const handleMapClick = async (event: maplibregl.MapMouseEvent) => {
        const coordinatesFromMap: [number, number] = [event.lngLat.lng, event.lngLat.lat];
        showMarker(coordinatesFromMap);
        const currentApiKey = apiKeyRef.current;
        if (!currentApiKey) return;

        try {
          const parameters = new URLSearchParams({
            lat: String(event.lngLat.lat),
            lon: String(event.lngLat.lng),
            format: 'json',
            apiKey: currentApiKey,
          });
          const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?${parameters.toString()}`);
          if (!response.ok) throw new Error('Reverse geocoding unavailable');
          const data = await response.json() as GeoapifyReverseResponse;
          const address = data.results?.[0]?.formatted;
          if (address) onAddressSelectRef.current(address, coordinatesFromMap);
        } catch {
          // The selected pin remains visible if address lookup is temporarily unavailable.
        }
      };
      map.on('click', handleMapClick);

      return () => {
        map.off('click', handleMapClick);
        markerRef.current?.remove();
        markerRef.current = null;
        map.remove();
        mapRef.current = null;
      };
    } catch {
      setIsUnavailable(true);
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markerRef.current?.remove();
    markerRef.current = null;
    if (!coordinates) {
      map.flyTo({ center: padovaCenter, zoom: 11, essential: true });
      return;
    }

    map.flyTo({ center: coordinates, zoom: 16, essential: true });
    showMarker(coordinates);
  }, [coordinates]);

  if (isUnavailable) {
    return (
      <div className="rounded-lg border border-[var(--control-border)] bg-[var(--paper-soft)] p-4 text-sm text-[var(--graphite)]" role="status">
        L’anteprima della mappa non è disponibile.
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-[var(--control-border)] bg-[var(--paper-soft)]">
      <div ref={containerRef} className="request-address-map" aria-label="Mappa dell’indirizzo: seleziona un punto per inserire l’indirizzo" />
    </div>
  );
}
