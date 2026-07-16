import type { LocationPolygon } from '../../lib/leads';
import { isValidLocationPolygon } from '../../lib/requestWizard.ts';

const mapLibreDrawClassNames = {
  CANVAS: 'maplibregl-canvas',
  CONTROL_BASE: 'maplibregl-ctrl',
  CONTROL_PREFIX: 'maplibregl-ctrl-',
  CONTROL_GROUP: 'maplibregl-ctrl-group',
  ATTRIBUTION: 'maplibregl-ctrl-attrib',
} as const;

interface SubscriptionAdapter {
  unsubscribe: () => void;
}

interface MapAdapter {
  on: (type: string, listener: (event: unknown) => void) => SubscriptionAdapter;
  addControl: (control: unknown) => unknown;
  hasControl: (control: unknown) => boolean;
  removeControl: (control: unknown) => unknown;
  remove: () => unknown;
}

interface DrawAdapter {
  add: (feature: {
    type: 'Feature';
    properties: Record<string, never>;
    geometry: LocationPolygon;
  }) => Array<string | number>;
  changeMode: (mode: string, options?: { featureId: string }) => unknown;
}

interface LifecycleOptions {
  map: MapAdapter;
  draw: DrawAdapter;
  control: unknown;
  initialValue: LocationPolygon | null;
  onDraft: (value: LocationPolygon | null) => void;
  onUnavailable: (message: string) => void;
}

export function configureMapboxDrawForMapLibre(classes: object) {
  Object.assign(classes, mapLibreDrawClassNames);
}

function polygonFromEvent(event: unknown): LocationPolygon | null {
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
      };
    }
  }

  return null;
}

export function createLocationPolygonMapLifecycle({
  map,
  draw,
  control,
  initialValue,
  onDraft,
  onUnavailable,
}: LifecycleOptions) {
  let controlAdded = false;
  let disposed = false;
  let unavailableReported = false;

  const reportUnavailable = (message: string) => {
    if (unavailableReported) return;
    unavailableReported = true;
    onUnavailable(message);
  };

  const handleDrawChange = (event: unknown) => {
    onDraft(polygonFromEvent(event));
  };

  const handleDrawDelete = () => {
    onDraft(null);
    draw.changeMode('draw_polygon');
  };

  const handleLoad = () => {
    if (controlAdded) return;
    try {
      map.addControl(control);
      controlAdded = true;
      if (isValidLocationPolygon(initialValue)) {
        const [featureId] = draw.add({ type: 'Feature', properties: {}, geometry: initialValue });
        draw.changeMode('direct_select', { featureId: String(featureId) });
      } else {
        draw.changeMode('draw_polygon');
      }
    } catch {
      reportUnavailable('La mappa non è disponibile. Inserisci la zona come testo.');
    }
  };

  const subscriptions = [
    map.on('load', handleLoad),
    map.on('draw.create', handleDrawChange),
    map.on('draw.update', handleDrawChange),
    map.on('draw.delete', handleDrawDelete),
    map.on('error', () => {
      reportUnavailable('Non riusciamo a caricare la mappa. Inserisci la zona come testo.');
    }),
    map.on('webglcontextlost', () => {
      reportUnavailable('La mappa non è più disponibile. Inserisci la zona come testo.');
    }),
  ];

  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      subscriptions.forEach((subscription) => subscription.unsubscribe());
      if (controlAdded && map.hasControl(control)) map.removeControl(control);
      map.remove();
    },
  };
}
