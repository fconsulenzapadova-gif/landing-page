import { lazy, Suspense, useId, useRef, type KeyboardEvent } from 'react';
import type { LocationMode, LocationPolygon, RequestRole } from '../../lib/leads';
import LocationMapErrorBoundary from './LocationMapErrorBoundary';
import {
  createLocationSelectorLifecycle,
  loadLocationMapModule,
} from './locationSelectorLifecycle';

const LocationPolygonMap = lazy(() => loadLocationMapModule(() => import('./LocationPolygonMap')));

const suggestedZones = [
  'Padova Centro',
  'Arcella',
  'Città Giardino',
  'Forcellini',
  'Abano Terme',
  'Noventa Padovana',
];

interface Props {
  requestRole: RequestRole;
  mode: LocationMode;
  textValue: string;
  polygonValue: LocationPolygon | null;
  polygonDraftValue: LocationPolygon | null;
  error?: string;
  onModeChange: (mode: LocationMode) => void;
  onTextChange: (value: string) => void;
  onPolygonChange: (value: LocationPolygon | null) => void;
  onPolygonDraftChange: (value: LocationPolygon | null) => void;
  onMapUnavailable: (message: string) => void;
}

function moveTabFocus(event: KeyboardEvent<HTMLButtonElement>) {
  const tabs = Array.from(
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
  );
  const currentIndex = tabs.indexOf(event.currentTarget);
  if (currentIndex < 0) return;

  let nextIndex: number | undefined;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % tabs.length;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = tabs.length - 1;
  if (nextIndex === undefined) return;

  event.preventDefault();
  tabs[nextIndex]?.focus();
  tabs[nextIndex]?.click();
}

export default function LocationSelector({
  requestRole,
  mode,
  textValue,
  polygonValue,
  polygonDraftValue,
  error,
  onModeChange,
  onTextChange,
  onPolygonChange,
  onPolygonDraftChange,
  onMapUnavailable,
}: Props) {
  const onModeChangeRef = useRef(onModeChange);
  const onMapUnavailableRef = useRef(onMapUnavailable);
  onModeChangeRef.current = onModeChange;
  onMapUnavailableRef.current = onMapUnavailable;
  const lifecycleRef = useRef<ReturnType<typeof createLocationSelectorLifecycle> | null>(null);
  if (!lifecycleRef.current) {
    lifecycleRef.current = createLocationSelectorLifecycle({
      initialDraft: polygonDraftValue,
      onModeChange(nextMode) { onModeChangeRef.current(nextMode); },
      onMapUnavailable(message) { onMapUnavailableRef.current(message); },
    });
  }
  const locationLifecycle = lifecycleRef.current;
  const baseId = useId();
  const titleId = `${baseId}-location-title`;
  const textTabId = `${baseId}-location-text-tab`;
  const mapTabId = `${baseId}-location-map-tab`;
  const textPanelId = `${baseId}-location-text-panel`;
  const mapPanelId = `${baseId}-location-map-panel`;
  const inputId = `${baseId}-location`;
  const errorId = `${baseId}-location-error`;
  const title = requestRole === 'cerca' ? 'Dove stai cercando?' : 'Dove si trova l’immobile?';
  const textLabel = requestRole === 'proprietario'
    ? 'Comune, quartiere o indirizzo'
    : 'Comune o quartiere';
  const placeholder = requestRole === 'proprietario'
    ? 'Es. Padova, Arcella o via Roma 10'
    : 'Es. Padova Centro o Arcella';

  function handleMapUnavailable(message: string) {
    locationLifecycle.handleMapUnavailable(message);
  }

  function handlePolygonDraftChange(value: LocationPolygon | null) {
    locationLifecycle.updateDraft(value);
    onPolygonDraftChange(value);
  }

  return (
    <section aria-labelledby={titleId} className="grid gap-6">
      <div>
        <h2 id={titleId} className="font-display text-3xl leading-tight text-[var(--ink)] sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--graphite)]">Scegli il metodo più rapido per te.</p>
      </div>

      <div
        className="inline-grid grid-cols-2 rounded-lg border border-[var(--line)] bg-[var(--paper)] p-1"
        role="tablist"
        aria-label="Metodo posizione"
        aria-orientation="horizontal"
      >
        <button
          id={textTabId}
          type="button"
          role="tab"
          aria-selected={mode === 'text'}
          aria-controls={textPanelId}
          tabIndex={mode === 'text' ? 0 : -1}
          onClick={() => locationLifecycle.changeMode('text')}
          onKeyDown={moveTabFocus}
          className={`focus-ring min-h-11 rounded-md px-4 py-2 text-sm font-semibold transition ${
            mode === 'text' ? 'bg-white text-[var(--ink)] shadow-sm' : 'text-[var(--graphite)]'
          }`}
        >
          Scrivi zona
        </button>
        <button
          id={mapTabId}
          type="button"
          role="tab"
          aria-selected={mode === 'polygon'}
          aria-controls={mapPanelId}
          tabIndex={mode === 'polygon' ? 0 : -1}
          disabled={locationLifecycle.isMapUnavailable()}
          onClick={() => locationLifecycle.changeMode('polygon')}
          onKeyDown={moveTabFocus}
          className={`focus-ring min-h-11 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
            mode === 'polygon' ? 'bg-white text-[var(--ink)] shadow-sm' : 'text-[var(--graphite)]'
          }`}
        >
          Seleziona sulla mappa
        </button>
      </div>

      {mode === 'text' ? (
        <div
          id={textPanelId}
          role="tabpanel"
          aria-labelledby={textTabId}
          className="grid gap-3"
        >
          <label htmlFor={inputId} className="text-sm font-semibold text-[var(--ink)]">
            {textLabel}
          </label>
          <input
            id={inputId}
            value={textValue}
            onChange={(event) => onTextChange(event.target.value)}
            className="field-control min-h-14 rounded-lg border border-[var(--control-border)] bg-white px-4 text-base outline-none transition"
            placeholder={placeholder}
            autoComplete={requestRole === 'proprietario' ? 'street-address' : 'off'}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
          />
          <div className="flex flex-wrap gap-2" aria-label="Zone suggerite">
            {suggestedZones.map((zone) => (
              <button
                key={zone}
                type="button"
                onClick={() => onTextChange(zone)}
                className="focus-ring min-h-11 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-[var(--ink)]"
              >
                {zone}
              </button>
            ))}
          </div>
          {error && (
            <p id={errorId} className="text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          )}
        </div>
      ) : (
        <div id={mapPanelId} role="tabpanel" aria-labelledby={mapTabId}>
          <LocationMapErrorBoundary onUnavailable={handleMapUnavailable}>
            <Suspense
              fallback={(
                <p className="rounded-lg border border-[var(--line)] bg-[var(--paper-soft)] p-4 text-sm" role="status">
                  Caricamento mappa…
                </p>
              )}
            >
              <LocationPolygonMap
                value={polygonValue}
                draftValue={locationLifecycle.getDraft()}
                onChange={onPolygonChange}
                onDraftChange={handlePolygonDraftChange}
                onUnavailable={handleMapUnavailable}
                error={error}
              />
            </Suspense>
          </LocationMapErrorBoundary>
        </div>
      )}
    </section>
  );
}
