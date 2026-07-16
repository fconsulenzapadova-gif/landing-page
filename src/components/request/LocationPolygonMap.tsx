import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import type { LocationPolygon } from '../../lib/leads';
import { isValidLocationPolygon } from '../../lib/requestWizard';

const styleUrl = 'https://tiles.openfreemap.org/styles/positron';
const padovaCenter: [number, number] = [11.8768, 45.4064];
const drawStyles = [
  { id: 'gemut-polygon-fill', type: 'fill', filter: ['all', ['==', '$type', 'Polygon']], paint: { 'fill-color': '#b3e5fc', 'fill-opacity': 0.36 } },
  { id: 'gemut-polygon-line', type: 'line', filter: ['all', ['==', '$type', 'Polygon']], paint: { 'line-color': '#12130f', 'line-width': 2 } },
  { id: 'gemut-polygon-points', type: 'circle', filter: ['all', ['==', '$type', 'Point']], paint: { 'circle-radius': 6, 'circle-color': '#b3e5fc', 'circle-stroke-color': '#12130f', 'circle-stroke-width': 2 } },
] as const;

interface Props {
  value: LocationPolygon | null;
  onChange: (value: LocationPolygon | null) => void;
  onUnavailable: (message: string) => void;
  error?: string;
}

function polygonFromEvent(event: unknown) {
  if (!event || typeof event !== 'object' || !('features' in event)) return null;
  const { features } = event as { features?: unknown };
  if (!Array.isArray(features)) return null;

  for (const feature of features) {
    if (!feature || typeof feature !== 'object' || !('geometry' in feature)) continue;
    const geometry = (feature as { geometry?: unknown }).geometry;
    if (isValidLocationPolygon(geometry)) {
      return {
        type: 'Polygon',
        coordinates: geometry.coordinates.map((ring) =>
          ring.map(([longitude, latitude]): [number, number] => [longitude, latitude]),
        ),
      } satisfies LocationPolygon;
    }
  }

  return null;
}

export default function LocationPolygonMap({ value, onChange, onUnavailable, error }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const draftRef = useRef<LocationPolygon | null>(isValidLocationPolygon(value) ? value : null);
  const initialValueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const onUnavailableRef = useRef(onUnavailable);
  const unavailableRef = useRef(false);
  const [draftIsValid, setDraftIsValid] = useState(isValidLocationPolygon(value));
  const [unavailableMessage, setUnavailableMessage] = useState('');

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onUnavailableRef.current = onUnavailable;
  }, [onUnavailable]);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const notifyUnavailable = (message: string) => {
      if (unavailableRef.current) return;
      unavailableRef.current = true;
      setUnavailableMessage(message);
      onUnavailableRef.current(message);
    };

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container,
        style: styleUrl,
        center: padovaCenter,
        zoom: 11,
        attributionControl: false,
      });
    } catch {
      notifyUnavailable('La mappa non è disponibile. Inserisci la zona come testo.');
      return;
    }

    mapRef.current = map;
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      styles: [...drawStyles],
    });
    drawRef.current = draw;
    let controlAdded = false;

    const handleDrawChange = (event: unknown) => {
      const polygon = polygonFromEvent(event);
      draftRef.current = polygon;
      setDraftIsValid(Boolean(polygon));
      onChangeRef.current(null);
    };

    const handleDrawDelete = () => {
      draftRef.current = null;
      setDraftIsValid(false);
      onChangeRef.current(null);
      draw.changeMode('draw_polygon');
    };

    const handleLoad = () => {
      try {
        map.addControl(draw as unknown as maplibregl.IControl);
        controlAdded = true;
        const initialValue = initialValueRef.current;
        if (isValidLocationPolygon(initialValue)) {
          const [featureId] = draw.add({ type: 'Feature', properties: {}, geometry: initialValue });
          draftRef.current = initialValue;
          setDraftIsValid(true);
          draw.changeMode('direct_select', { featureId: String(featureId) });
        } else {
          draw.changeMode('draw_polygon');
        }
      } catch {
        notifyUnavailable('La mappa non è disponibile. Inserisci la zona come testo.');
      }
    };

    const handleMapError = () => {
      notifyUnavailable('Non riusciamo a caricare la mappa. Inserisci la zona come testo.');
    };

    const handleWebglContextLost = () => {
      notifyUnavailable('La mappa non è più disponibile. Inserisci la zona come testo.');
    };

    const subscriptions = [
      map.on('load', handleLoad),
      map.on('draw.create', handleDrawChange),
      map.on('draw.update', handleDrawChange),
      map.on('draw.delete', handleDrawDelete),
      map.on('error', handleMapError),
      map.on('webglcontextlost', handleWebglContextLost),
    ];

    return () => {
      subscriptions.forEach((subscription) => subscription.unsubscribe());
      if (controlAdded && map.hasControl(draw as unknown as maplibregl.IControl)) {
        map.removeControl(draw as unknown as maplibregl.IControl);
      }
      drawRef.current = null;
      mapRef.current = null;
      map.remove();
    };
  }, []);

  function replaceDrawFeature(polygon: LocationPolygon) {
    const draw = drawRef.current;
    if (!draw) return;
    draw.deleteAll();
    const [featureId] = draw.add({ type: 'Feature', properties: {}, geometry: polygon });
    draftRef.current = polygon;
    setDraftIsValid(true);
    onChangeRef.current(null);
    draw.changeMode('direct_select', { featureId: String(featureId) });
  }

  function resetPolygon() {
    drawRef.current?.deleteAll();
    draftRef.current = null;
    setDraftIsValid(false);
    onChangeRef.current(null);
    drawRef.current?.changeMode('draw_polygon');
  }

  function removeLastVertex() {
    const draft = draftRef.current;
    if (!draft) return;
    const points = draft.coordinates[0].slice(0, -1);
    if (points.length <= 3) {
      resetPolygon();
      return;
    }
    points.pop();
    const next = { type: 'Polygon', coordinates: [[...points, points[0]]] } satisfies LocationPolygon;
    replaceDrawFeature(next);
  }

  function confirmPolygon() {
    if (draftRef.current && isValidLocationPolygon(draftRef.current)) {
      onChangeRef.current(draftRef.current);
    }
  }

  const describedBy = [
    'location-map-instructions',
    error ? 'location-map-error' : '',
    unavailableMessage ? 'location-map-unavailable' : '',
  ].filter(Boolean).join(' ');
  const actionsDisabled = !draftIsValid || Boolean(unavailableMessage);

  return (
    <div className="grid gap-3">
      <div
        className="overflow-hidden rounded-lg border border-[var(--control-border)] bg-[var(--paper-soft)]"
        role="application"
        aria-label="Seleziona una zona sulla mappa"
        aria-describedby={describedBy}
      >
        <p id="location-map-instructions" className="sr-only">
          Traccia un poligono sulla mappa, correggi i punti se necessario, poi conferma l’area.
        </p>
        <div ref={mapContainerRef} className="request-location-map" />
        {unavailableMessage && (
          <p id="location-map-unavailable" className="border-t border-[var(--line)] bg-white p-4 text-sm text-[var(--ink)]" role="status">
            {unavailableMessage}
          </p>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-3" aria-label="Azioni area mappa">
        <button
          type="button"
          className="focus-ring min-h-11 rounded-lg border border-[var(--control-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={actionsDisabled}
          onClick={removeLastVertex}
        >
          Annulla ultimo punto
        </button>
        <button
          type="button"
          className="focus-ring min-h-11 rounded-lg border border-[var(--control-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={Boolean(unavailableMessage)}
          onClick={resetPolygon}
        >
          Ricomincia
        </button>
        <button
          type="button"
          className="focus-ring min-h-11 rounded-lg border border-[var(--ink)] bg-[var(--brand-blue)] px-4 py-3 text-sm font-semibold text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={actionsDisabled}
          onClick={confirmPolygon}
        >
          Conferma area
        </button>
      </div>

      <p className="text-xs leading-5 text-[var(--graphite)]">
        <a className="underline underline-offset-2" href="https://openfreemap.org/" target="_blank" rel="noreferrer">
          OpenFreeMap
        </a>{' '}
        ·{' '}
        <a className="underline underline-offset-2" href="https://openmaptiles.org/" target="_blank" rel="noreferrer">
          © OpenMapTiles
        </a>{' '}
        · Dati{' '}
        <a className="underline underline-offset-2" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
          © OpenStreetMap contributors
        </a>
      </p>
      {error && (
        <p id="location-map-error" className="text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
