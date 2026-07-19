import type { LocationPolygon } from '../../lib/leads';
import { isValidLocationPolygon } from '../../lib/requestWizard.ts';

export type LocationPoint = [number, number];

export function polygonFromPoints(points: LocationPoint[]): LocationPolygon | null {
  if (points.length < 3 || points.length > 24) return null;
  if (points.some(([longitude, latitude]) => !Number.isFinite(longitude) || !Number.isFinite(latitude))) return null;

  const polygon: LocationPolygon = {
    type: 'Polygon',
    coordinates: [[...points, points[0]]],
  };
  return isValidLocationPolygon(polygon) ? polygon : null;
}

export function pointsFromPolygon(value: LocationPolygon | null): LocationPoint[] {
  if (!isValidLocationPolygon(value)) return [];
  return value.coordinates[0].slice(0, -1).map(([longitude, latitude]) => [longitude, latitude]);
}
