import type { LeadRequestType, LocationMode, LocationPolygon, RequestRole } from './leads';

export type RequestIntentValue = 'acquisto' | 'vendita' | 'locazione-cerca' | 'locazione-proprietario';

export interface RequestIntent {
  value: RequestIntentValue;
  label: string;
  description: string;
  requestType: LeadRequestType;
  requestRole: RequestRole;
}

export const requestIntents: RequestIntent[] = [
  { value: 'acquisto', label: 'Compro casa', description: 'Cerco un immobile da acquistare.', requestType: 'acquisto', requestRole: 'cerca' },
  { value: 'vendita', label: 'Vendo casa', description: 'Voglio vendere o valutare un immobile.', requestType: 'vendita', requestRole: 'proprietario' },
  { value: 'locazione-cerca', label: 'Cerco in affitto', description: 'Cerco un immobile da prendere in affitto.', requestType: 'locazione', requestRole: 'cerca' },
  { value: 'locazione-proprietario', label: 'Metto in affitto', description: 'Voglio affittare un immobile che possiedo.', requestType: 'locazione', requestRole: 'proprietario' },
];

export function getDefaultLocationMode(role: RequestRole): LocationMode {
  return role === 'cerca' ? 'polygon' : 'text';
}

export function getInitialIntent(type: string | null): RequestIntent {
  if (type === 'vendita') return requestIntents[1];
  if (type === 'locazione') return requestIntents[2];
  return requestIntents[0];
}

export function isValidLocationPolygon(value: unknown): value is LocationPolygon {
  if (!value || typeof value !== 'object') return false;
  const polygon = value as LocationPolygon;
  if (polygon.type !== 'Polygon' || !Array.isArray(polygon.coordinates) || polygon.coordinates.length !== 1) return false;
  const ring = polygon.coordinates[0];
  if (!Array.isArray(ring) || ring.length < 4 || ring.length > 25) return false;
  const validPoint = (point: unknown): point is [number, number] =>
    Array.isArray(point) && point.length === 2 && point.every(Number.isFinite) &&
    point[0] >= -180 && point[0] <= 180 && point[1] >= -90 && point[1] <= 90;
  if (!ring.every(validPoint)) return false;
  const [firstLng, firstLat] = ring[0];
  const [lastLng, lastLat] = ring.at(-1)!;
  const distinct = new Set(ring.slice(0, -1).map(([lng, lat]) => `${lng},${lat}`));
  return firstLng === lastLng && firstLat === lastLat && distinct.size >= 3 && distinct.size <= 24;
}

export function polygonCenter(polygon: LocationPolygon): [number, number] {
  const points = polygon.coordinates[0].slice(0, -1);
  const [lng, lat] = points.reduce(([lngSum, latSum], point) => [lngSum + point[0], latSum + point[1]], [0, 0]);
  return [Number((lng / points.length).toFixed(6)), Number((lat / points.length).toFixed(6))];
}

export function summarizePolygon(polygon: LocationPolygon) {
  const [lng, lat] = polygonCenter(polygon);
  return `Area selezionata sulla mappa — centro ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}
