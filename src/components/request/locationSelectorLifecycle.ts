import type { LocationMode, LocationPolygon } from '../../lib/leads.ts';

export const locationMapLoadErrorMessage = 'La mappa non è disponibile. Inserisci la zona come testo.';

interface LifecycleOptions {
  initialDraft: LocationPolygon | null;
  onModeChange: (mode: LocationMode) => void;
  onMapUnavailable: (message: string) => void;
}

function copyPolygon(value: LocationPolygon | null): LocationPolygon | null {
  if (!value) return null;
  return {
    type: 'Polygon',
    coordinates: value.coordinates.map((ring) =>
      ring.map(([longitude, latitude]): [number, number] => [longitude, latitude]),
    ),
  };
}

export async function loadLocationMapModule<Module>(
  loadModule: () => Promise<Module>,
) {
  return loadModule();
}

export function createLocationSelectorLifecycle({
  initialDraft,
  onModeChange,
  onMapUnavailable,
}: LifecycleOptions) {
  let draft = copyPolygon(initialDraft);
  let mapUnavailableReported = false;

  return {
    getDraft() {
      return copyPolygon(draft);
    },
    updateDraft(value: LocationPolygon | null) {
      draft = copyPolygon(value);
    },
    changeMode(mode: LocationMode) {
      if (mode === 'polygon' && mapUnavailableReported) return;
      onModeChange(mode);
    },
    isMapUnavailable() {
      return mapUnavailableReported;
    },
    handleMapUnavailable(message: string) {
      if (mapUnavailableReported) return;
      mapUnavailableReported = true;
      onMapUnavailable(message);
      onModeChange('text');
    },
  };
}
