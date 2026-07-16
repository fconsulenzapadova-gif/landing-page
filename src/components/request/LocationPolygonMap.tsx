import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';
import type { LocationPolygon } from '../../lib/leads';
import { isValidLocationPolygon } from '../../lib/requestWizard';
import {
  configureMapboxDrawForMapLibre,
  createLocationPolygonMapLifecycle,
} from './locationPolygonMapLifecycle';

configureMapboxDrawForMapLibre(MapboxDraw.constants.classes);

const styleUrl = 'https://tiles.openfreemap.org/styles/positron';
const padovaCenter: [number, number] = [11.8768, 45.4064];
const drawStyles = [
  { id: 'gemut-polygon-fill', type: 'fill', filter: ['all', ['==', '$type', 'Polygon']], paint: { 'fill-color': '#b3e5fc', 'fill-opacity': 0.36 } },
  { id: 'gemut-polygon-line', type: 'line', filter: ['all', ['==', '$type', 'Polygon']], paint: { 'line-color': '#12130f', 'line-width': 2 } },
  { id: 'gemut-polygon-points', type: 'circle', filter: ['all', ['==', '$type', 'Point']], paint: { 'circle-radius': 6, 'circle-color': '#b3e5fc', 'circle-stroke-color': '#12130f', 'circle-stroke-width': 2 } },
] as const;

interface Props {
  value: LocationPolygon | null;
  draftValue?: LocationPolygon | null;
  onChange: (value: LocationPolygon | null) => void;
  onDraftChange?: (value: LocationPolygon | null) => void;
  onUnavailable: (message: string) => void;
  error?: string;
}

export default function LocationPolygonMap({
  value,
  draftValue,
  onChange,
  onDraftChange,
  onUnavailable,
  error,
}: Props) {
  const initialDraft = draftValue === undefined ? value : draftValue;
  const validInitialDraft = isValidLocationPolygon(initialDraft) ? initialDraft : null;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const draftRef = useRef<LocationPolygon | null>(validInitialDraft);
  const initialValueRef = useRef(validInitialDraft);
  const onChangeRef = useRef(onChange);
  const onDraftChangeRef = useRef(onDraftChange);
  const onUnavailableRef = useRef(onUnavailable);
  const [draftIsValid, setDraftIsValid] = useState(Boolean(validInitialDraft));
  const [unavailableMessage, setUnavailableMessage] = useState('');

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onDraftChangeRef.current = onDraftChange;
  }, [onDraftChange]);

  useEffect(() => {
    onUnavailableRef.current = onUnavailable;
  }, [onUnavailable]);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const handleUnavailable = (message: string) => {
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
      handleUnavailable('La mappa non è disponibile. Inserisci la zona come testo.');
      return;
    }

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      styles: [...drawStyles],
    });
    drawRef.current = draw;
    const lifecycle = createLocationPolygonMapLifecycle({
      map,
      draw,
      control: draw as unknown as maplibregl.IControl,
      initialValue: initialValueRef.current,
      onDraft(polygon) {
        draftRef.current = polygon;
        setDraftIsValid(Boolean(polygon));
        onDraftChangeRef.current?.(polygon);
        onChangeRef.current(null);
      },
      onUnavailable: handleUnavailable,
    });

    return () => {
      lifecycle.dispose();
      drawRef.current = null;
    };
  }, []);

  function replaceDrawFeature(polygon: LocationPolygon) {
    const draw = drawRef.current;
    if (!draw) return;
    draw.deleteAll();
    const [featureId] = draw.add({ type: 'Feature', properties: {}, geometry: polygon });
    draftRef.current = polygon;
    setDraftIsValid(true);
    onDraftChangeRef.current?.(polygon);
    onChangeRef.current(null);
    draw.changeMode('direct_select', { featureId: String(featureId) });
  }

  function resetPolygon() {
    drawRef.current?.deleteAll();
    draftRef.current = null;
    setDraftIsValid(false);
    onDraftChangeRef.current?.(null);
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
