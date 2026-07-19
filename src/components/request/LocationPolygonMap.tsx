import maplibregl, { type GeoJSONSource, type MapMouseEvent } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RotateCcw, Undo2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { LocationPolygon } from '../../lib/leads';
import {
  pointsFromPolygon,
  polygonFromPoints,
  type LocationPoint,
} from './locationPolygonPoints';

const styleUrl = 'https://tiles.openfreemap.org/styles/positron';
const padovaCenter: [number, number] = [11.8768, 45.4064];
const sourceId = 'gemut-location-area';

interface Props {
  value: LocationPolygon | null;
  draftValue?: LocationPolygon | null;
  onChange: (value: LocationPolygon | null) => void;
  onDraftChange?: (value: LocationPolygon | null) => void;
  onUnavailable: (message: string) => void;
  error?: string;
}

function mapData(points: LocationPoint[]) {
  const polygon = polygonFromPoints(points);
  return {
    type: 'FeatureCollection' as const,
    features: [
      ...(polygon ? [{ type: 'Feature' as const, properties: { kind: 'area' }, geometry: polygon }] : []),
      ...(points.length >= 2 ? [{
        type: 'Feature' as const,
        properties: { kind: 'line' },
        geometry: { type: 'LineString' as const, coordinates: points },
      }] : []),
      ...points.map((coordinates, index) => ({
        type: 'Feature' as const,
        properties: { kind: 'point', index },
        geometry: { type: 'Point' as const, coordinates },
      })),
    ],
  };
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
  const initialPointsRef = useRef(pointsFromPolygon(initialDraft));
  const pointsRef = useRef<LocationPoint[]>(initialPointsRef.current);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const onChangeRef = useRef(onChange);
  const onDraftChangeRef = useRef(onDraftChange);
  const onUnavailableRef = useRef(onUnavailable);
  const unavailableReportedRef = useRef(false);
  const [pointCount, setPointCount] = useState(initialPointsRef.current.length);
  const [unavailableMessage, setUnavailableMessage] = useState('');

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { onDraftChangeRef.current = onDraftChange; }, [onDraftChange]);
  useEffect(() => { onUnavailableRef.current = onUnavailable; }, [onUnavailable]);

  function reportUnavailable(message: string) {
    if (unavailableReportedRef.current) return;
    unavailableReportedRef.current = true;
    setUnavailableMessage(message);
    onUnavailableRef.current(message);
  }

  function publishPoints(points: LocationPoint[]) {
    pointsRef.current = points;
    setPointCount(points.length);
    const polygon = polygonFromPoints(points);
    onDraftChangeRef.current?.(polygon);
    onChangeRef.current(polygon);
    const source = mapRef.current?.getSource(sourceId) as GeoJSONSource | undefined;
    source?.setData(mapData(points));
  }

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
        container,
        style: styleUrl,
        center: padovaCenter,
        zoom: 11,
        attributionControl: { compact: true },
        touchPitch: false,
      });
      mapRef.current = map;
    } catch {
      reportUnavailable('La mappa non è disponibile. Inserisci la zona come testo.');
      return;
    }

    const handleLoad = () => {
      try {
        map.addSource(sourceId, { type: 'geojson', data: mapData(pointsRef.current) });
        map.addLayer({
          id: 'gemut-polygon-fill',
          type: 'fill',
          source: sourceId,
          filter: ['==', ['get', 'kind'], 'area'],
          paint: { 'fill-color': '#b3e5fc', 'fill-opacity': 0.36 },
        });
        map.addLayer({
          id: 'gemut-polygon-line',
          type: 'line',
          source: sourceId,
          filter: ['in', ['get', 'kind'], ['literal', ['area', 'line']]],
          paint: { 'line-color': '#12130f', 'line-width': 2 },
        });
        map.addLayer({
          id: 'gemut-polygon-points',
          type: 'circle',
          source: sourceId,
          filter: ['==', ['get', 'kind'], 'point'],
          paint: {
            'circle-radius': 6,
            'circle-color': '#b3e5fc',
            'circle-stroke-color': '#12130f',
            'circle-stroke-width': 2,
          },
        });
      } catch {
        reportUnavailable('La mappa non è disponibile. Inserisci la zona come testo.');
      }
    };
    const handleMapClick = (event: MapMouseEvent) => {
      if (pointsRef.current.length >= 24) return;
      publishPoints([...pointsRef.current, [event.lngLat.lng, event.lngLat.lat]]);
    };
    const handleError = () => reportUnavailable('Non riusciamo a caricare la mappa. Inserisci la zona come testo.');
    const handleContextLost = () => reportUnavailable('La mappa non è più disponibile. Inserisci la zona come testo.');

    map.on('load', handleLoad);
    map.on('click', handleMapClick);
    map.on('error', handleError);
    map.on('webglcontextlost', handleContextLost);

    return () => {
      map.off('load', handleLoad);
      map.off('click', handleMapClick);
      map.off('error', handleError);
      map.off('webglcontextlost', handleContextLost);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  function resetPolygon() {
    publishPoints([]);
  }

  function removeLastVertex() {
    publishPoints(pointsRef.current.slice(0, -1));
  }

  const describedBy = [
    'location-map-instructions',
    error ? 'location-map-error' : '',
    unavailableMessage ? 'location-map-unavailable' : '',
  ].filter(Boolean).join(' ');
  const pointStatus = pointCount < 3
    ? `${pointCount} ${pointCount === 1 ? 'punto' : 'punti'} · ne servono ${3 - pointCount}`
    : `${pointCount} punti · area confermata`;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 sm:gap-3">
      <div
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[var(--control-border)] bg-[var(--paper-soft)]"
        role="application"
        aria-label="Seleziona una zona sulla mappa"
        aria-describedby={describedBy}
      >
        <p id="location-map-instructions" className="sr-only">
          Tocca la mappa per aggiungere punti. Da tre punti l’area è confermata automaticamente; puoi continuare ad aggiungerne. Il tracciato non può essere spostato.
        </p>
        <div ref={mapContainerRef} className="request-location-map min-h-0 flex-1" />
        {!unavailableMessage && (
          <p className="pointer-events-none absolute left-2 top-2 rounded-full border border-[var(--line)] bg-white/95 px-3 py-1.5 text-xs font-semibold text-[var(--ink)] shadow-sm" aria-live="polite">
            {pointStatus}
          </p>
        )}
        {unavailableMessage && (
          <p id="location-map-unavailable" className="border-t border-[var(--line)] bg-white p-3 text-sm text-[var(--ink)]" role="status">
            {unavailableMessage}
          </p>
        )}
      </div>

      <div className="flex shrink-0 justify-end gap-2" aria-label="Azioni area mappa">
        <button
          type="button"
          className="focus-ring inline-flex size-11 items-center justify-center rounded-lg border border-[var(--control-border)] bg-white text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Annulla ultimo punto"
          title="Annulla ultimo punto"
          disabled={pointCount === 0 || Boolean(unavailableMessage)}
          onClick={removeLastVertex}
        >
          <Undo2 className="h-5 w-5 stroke-[1.9]" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="focus-ring inline-flex size-11 items-center justify-center rounded-lg border border-[var(--control-border)] bg-white text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Ricomincia"
          title="Ricomincia"
          disabled={pointCount === 0 || Boolean(unavailableMessage)}
          onClick={resetPolygon}
        >
          <RotateCcw className="h-5 w-5 stroke-[1.9]" aria-hidden="true" />
        </button>
      </div>
      {error && <p id="location-map-error" className="shrink-0 text-sm font-medium text-red-700" role="alert">{error}</p>}
    </div>
  );
}
