import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import type { LocationMode, LocationPolygon, RequestRole } from '../../lib/leads';
import LocationMapErrorBoundary from './LocationMapErrorBoundary';
import {
  createLocationSelectorLifecycle,
  loadLocationMapModule,
} from './locationSelectorLifecycle';

const LocationPolygonMap = lazy(() => loadLocationMapModule(() => import('./LocationPolygonMap')));
const AddressMapPreview = lazy(() => import('./AddressMapPreview'));

type AddressSuggestion = {
  id: string;
  formatted: string;
  primary: string;
  secondary: string;
  latitude: number;
  longitude: number;
};

type GeoapifyAutocompleteResponse = {
  results?: Array<{
    place_id?: string;
    formatted?: string;
    address_line1?: string;
    address_line2?: string;
    lat?: number;
    lon?: number;
  }>;
};

const suggestedZones = [
  'Padova Centro',
  'Arcella',
  'Città Giardino',
  'Forcellini',
  'Abano Terme',
  'Noventa Padovana',
];

function useAddressSuggestions(query: string, apiKey: string | undefined) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const text = query.trim();
    if (!apiKey || text.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const parameters = new URLSearchParams({
          text,
          format: 'json',
          limit: '5',
          filter: 'countrycode:it',
          bias: 'proximity:11.8768,45.4064',
          apiKey,
        });
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?${parameters.toString()}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error('Address autocomplete unavailable');

        const data = await response.json() as GeoapifyAutocompleteResponse;
        const nextSuggestions = (data.results ?? []).flatMap((result) => {
          if (!result.formatted || typeof result.lat !== 'number' || typeof result.lon !== 'number') return [];
          return [{
            id: result.place_id ?? `${result.formatted}-${result.lat}-${result.lon}`,
            formatted: result.formatted,
            primary: result.address_line1 ?? result.formatted,
            secondary: result.address_line2 ?? '',
            latitude: result.lat,
            longitude: result.lon,
          }];
        });
        setSuggestions(nextSuggestions);
      } catch (requestError) {
        if (!(requestError instanceof DOMException && requestError.name === 'AbortError')) {
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [apiKey, query]);

  return { suggestions, isLoading };
}

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
  const inputId = `${baseId}-location`;
  const errorId = `${baseId}-location-error`;
  const canSelectArea = requestRole === 'cerca';
  const isOwner = requestRole === 'proprietario';
  const geoapifyApiKey = import.meta.env.VITE_GEOAPIFY_API_KEY?.trim();
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, isLoading } = useAddressSuggestions(
    isOwner && showSuggestions ? textValue : '',
    geoapifyApiKey,
  );
  const textLabel = canSelectArea ? 'Comune o quartiere' : 'Indirizzo dell’immobile';
  const placeholder = canSelectArea ? 'Es. Padova Centro o Arcella' : 'Es. via Roma 10, Padova';
  const suggestionsId = `${baseId}-address-suggestions`;

  function handleMapUnavailable(message: string) {
    locationLifecycle.handleMapUnavailable(message);
  }

  function handlePolygonDraftChange(value: LocationPolygon | null) {
    locationLifecycle.updateDraft(value);
    onPolygonDraftChange(value);
  }

  function handleAddressChange(value: string) {
    setSelectedAddress(null);
    setShowSuggestions(true);
    onTextChange(value);
  }

  function selectAddress(suggestion: AddressSuggestion) {
    setSelectedAddress(suggestion);
    setShowSuggestions(false);
    onTextChange(suggestion.formatted);
  }

  function selectAddressFromMap(address: string, coordinates: [number, number]) {
    setSelectedAddress({
      id: `${address}-${coordinates[0]}-${coordinates[1]}`,
      formatted: address,
      primary: address,
      secondary: '',
      longitude: coordinates[0],
      latitude: coordinates[1],
    });
    setShowSuggestions(false);
    onTextChange(address);
  }

  if (!canSelectArea || mode === 'text') {
    return (
      <div className={isOwner ? 'flex min-h-0 flex-1 flex-col gap-3' : 'grid gap-3'}>
          <label htmlFor={inputId} className="text-sm font-semibold text-[var(--ink)]">
            {textLabel}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 stroke-[1.8] text-[var(--graphite)]" aria-hidden="true" />
            <input
              id={inputId}
              value={textValue}
              onChange={(event) => (isOwner ? handleAddressChange(event.target.value) : onTextChange(event.target.value))}
              onFocus={() => isOwner && setShowSuggestions(true)}
              className="field-control min-h-14 rounded-lg border border-[var(--control-border)] bg-white py-3 pl-12 pr-4 text-base outline-none transition"
              placeholder={placeholder}
              autoComplete={requestRole === 'proprietario' ? 'street-address' : 'off'}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              aria-controls={isOwner ? suggestionsId : undefined}
              aria-expanded={isOwner ? showSuggestions && (isLoading || suggestions.length > 0) : undefined}
              aria-autocomplete={isOwner ? 'list' : undefined}
            />
            {isOwner && showSuggestions && (isLoading || suggestions.length > 0) && (
              <div
                id={suggestionsId}
                className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-y-auto rounded-lg border border-[var(--line)] bg-white shadow-xl"
                role="listbox"
                aria-label="Suggerimenti indirizzo"
              >
                {isLoading && <p className="px-4 py-3 text-sm text-[var(--graphite)]">Cerco gli indirizzi…</p>}
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    role="option"
                    aria-selected={selectedAddress?.id === suggestion.id}
                    onClick={() => selectAddress(suggestion)}
                    className="focus-ring flex w-full items-start gap-3 border-t border-[var(--line)] px-4 py-3 text-left first:border-t-0 hover:bg-[var(--paper-soft)]"
                  >
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 stroke-[1.8] text-[var(--graphite)]" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[var(--ink)]">{suggestion.primary}</span>
                      {suggestion.secondary && (
                        <span className="mt-0.5 block truncate text-xs text-[var(--graphite)]">{suggestion.secondary}</span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {isOwner && (
            <Suspense
              fallback={<div className="request-address-map min-h-0 flex-1 rounded-lg border border-[var(--control-border)]" aria-label="Caricamento mappa indirizzo" />}
            >
              <AddressMapPreview
                coordinates={selectedAddress
                  ? [selectedAddress.longitude, selectedAddress.latitude]
                  : suggestions[0]
                    ? [suggestions[0].longitude, suggestions[0].latitude]
                    : null}
                apiKey={geoapifyApiKey}
                onAddressSelect={selectAddressFromMap}
              />
            </Suspense>
          )}
          {canSelectArea && (
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
          )}
          {error && (
            <p id={errorId} className="text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          )}
      </div>
    );
  }

  return (
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
  );
}
