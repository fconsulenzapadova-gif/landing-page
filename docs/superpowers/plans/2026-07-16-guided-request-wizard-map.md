# Guided Request Wizard With Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved adaptive Gemüt request wizard with four explicit intents, mutually exclusive text/map location entry, free polygon drawing, progressive property/contact questions, and complete Worker/D1 persistence.

**Architecture:** Keep `RequestsPage` as orchestration and submission boundary, but move intent, location, property and contact UI into focused components. Store the broad three-value `requestType` for compatibility, add `requestRole`, `locationMode` and validated GeoJSON to the lead contract, and persist those values in nullable D1 columns. Render maps client-side with MapLibre GL, OpenFreeMap tiles and Mapbox GL Draw; keep text entry as the complete fallback.

**Tech Stack:** React 18, TypeScript 5, Vite 8, Tailwind CSS 3, MapLibre GL JS 5.24.0, Mapbox GL Draw 1.5.1, OpenFreeMap/OpenStreetMap, Cloudflare Workers + D1, Node test runner, GSAP.

## Global Constraints

- Preserve the existing Worker endpoint, Turnstile verification, D1 idempotency and `RequestSuccess` scene.
- Preserve `requestType: 'acquisto' | 'vendita' | 'locazione'`; use `requestRole: 'cerca' | 'proprietario'` to distinguish the four UI intents.
- Default `locationMode` to `polygon` for `cerca` and `text` for `proprietario`; changing intent reapplies that default.
- `Scrivi zona` and `Seleziona sulla mappa` are mutually exclusive and occupy the same panel.
- Use MapLibre + OpenFreeMap only; no API key, account, payment, geocoding or device geolocation.
- Keep OpenStreetMap/OpenFreeMap attribution visible.
- Keep one polygon, one outer ring, 3–24 distinct vertices, finite WGS84 coordinates and a 6,000-character serialized limit.
- Keep all map-essential actions available through large custom controls and provide text mode as the keyboard/screen-reader equivalent.
- Respect `prefers-reduced-motion`; minimum target size 44 px.
- Preserve unrelated dirty work in `docs/product/PRD.md`, `src/components/RequestSuccess.tsx`, `tests/site-requirements.test.mjs`, metadata files and any later user changes. Stage only files named by each task.
- Use the narrowest relevant test first; finish with full tests, lint, typecheck, build and Worker dry-run.

---

## File Structure

### New frontend files

- `src/lib/requestWizard.ts`: intent configuration, role/mode types, polygon helpers and deterministic location summaries.
- `src/components/request/WizardProgress.tsx`: three-step progress and time estimate.
- `src/components/request/RequestIntentSelector.tsx`: four intent cards and semantic radiogroup.
- `src/components/request/LocationSelector.tsx`: segmented text/map switch and active-panel orchestration.
- `src/components/request/LocationPolygonMap.tsx`: lazy MapLibre lifecycle, polygon draw/edit/reset/confirm and failure callback.
- `src/components/request/PropertyDetailsStep.tsx`: position plus type, budget, timeframe and optional detail choices.
- `src/components/request/ContactStep.tsx`: preferred channel first, progressive recapito disclosure, privacy and Turnstile.

### Modified frontend files

- `src/lib/leads.ts`: extended lead payload types.
- `src/pages/RequestsPage.tsx`: wizard state, validation, step transitions and submission.
- `src/index.css`: MapLibre/Draw overrides using existing design tokens.
- `package.json`, `pnpm-lock.yaml`, `package-lock.json`: pinned mapping dependencies.

### Backend and docs

- `cloudflare/migrations/0003_add_lead_location_geometry.sql`: additive nullable columns.
- `cloudflare/src/validation.ts`: authoritative role/mode/GeoJSON parsing.
- `cloudflare/src/index.ts`: D1 bindings.
- `cloudflare/src/notification.ts`: readable role/location notification fields.
- `tests/request-wizard.test.mjs`: pure wizard helper tests.
- `tests/cloudflare-leads.test.mjs`: backend validation/notification tests.
- `tests/site-requirements.test.mjs`: integration/structure regressions.
- `docs/product/PRD.md`, `docs/architecture/overview.md`, `docs/patterns/frontend.md`, `docs/ai/progress.md`: durable product/architecture state after implementation.

---

### Task 1: Define The Wizard Domain Contract

**Files:**
- Create: `src/lib/requestWizard.ts`
- Create: `tests/request-wizard.test.mjs`
- Modify: `src/lib/leads.ts`
- Test: `tests/request-wizard.test.mjs`

**Interfaces:**
- Consumes: existing `LeadRequestType` from `src/lib/leads.ts`.
- Produces: `RequestRole`, `LocationMode`, `LocationPolygon`, `RequestIntent`, `requestIntents`, `getDefaultLocationMode`, `getInitialIntent`, `isValidLocationPolygon`, `polygonCenter`, `summarizePolygon`.

- [ ] **Step 1: Write failing domain tests**

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getDefaultLocationMode,
  getInitialIntent,
  isValidLocationPolygon,
  polygonCenter,
  requestIntents,
  summarizePolygon,
} from '../src/lib/requestWizard.ts';

const polygon = {
  type: 'Polygon',
  coordinates: [[[11.86, 45.40], [11.90, 45.40], [11.90, 45.44], [11.86, 45.40]]],
};

test('four explicit intents map to compatible type and role values', () => {
  assert.deepEqual(
    requestIntents.map(({ value, requestType, requestRole }) => ({ value, requestType, requestRole })),
    [
      { value: 'acquisto', requestType: 'acquisto', requestRole: 'cerca' },
      { value: 'vendita', requestType: 'vendita', requestRole: 'proprietario' },
      { value: 'locazione-cerca', requestType: 'locazione', requestRole: 'cerca' },
      { value: 'locazione-proprietario', requestType: 'locazione', requestRole: 'proprietario' },
    ],
  );
});

test('location defaults follow role and query type', () => {
  assert.equal(getDefaultLocationMode('cerca'), 'polygon');
  assert.equal(getDefaultLocationMode('proprietario'), 'text');
  assert.equal(getInitialIntent('vendita').value, 'vendita');
  assert.equal(getInitialIntent('locazione').value, 'locazione-cerca');
});

test('polygon helpers validate and summarize one closed outer ring', () => {
  assert.equal(isValidLocationPolygon(polygon), true);
  assert.deepEqual(polygonCenter(polygon), [11.886667, 45.413333]);
  assert.equal(summarizePolygon(polygon), 'Area selezionata sulla mappa — centro 45.4133, 11.8867');
  assert.equal(isValidLocationPolygon({ ...polygon, coordinates: [[[11.86, 45.40], [11.90, 45.40]]] }), false);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/request-wizard.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/lib/requestWizard.ts`.

- [ ] **Step 3: Add the shared types to `src/lib/leads.ts`**

```ts
export type RequestRole = 'cerca' | 'proprietario';
export type LocationMode = 'text' | 'polygon';

export interface LocationPolygon {
  type: 'Polygon';
  coordinates: [number, number][][];
}

```

Append these fields immediately after `requestType` inside the existing `LeadRequest` interface:

```ts
requestRole: RequestRole;
locationMode: LocationMode;
locationGeometry: LocationPolygon | null;
```

- [ ] **Step 4: Implement `src/lib/requestWizard.ts`**

```ts
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
```

- [ ] **Step 5: Run the domain test and typecheck**

Run: `node --test tests/request-wizard.test.mjs && npx tsc -p tsconfig.app.json --noEmit`

Expected: PASS; TypeScript exit 0.

- [ ] **Step 6: Commit the contract**

```bash
git add src/lib/leads.ts src/lib/requestWizard.ts tests/request-wizard.test.mjs
git commit -m "feat: define guided request domain"
```

---

### Task 2: Validate And Persist Role And Geometry

**Files:**
- Create: `cloudflare/migrations/0003_add_lead_location_geometry.sql`
- Modify: `cloudflare/src/validation.ts`
- Modify: `cloudflare/src/index.ts`
- Modify: `tests/cloudflare-leads.test.mjs`
- Test: `tests/cloudflare-leads.test.mjs`

**Interfaces:**
- Consumes: payload fields `requestRole`, `locationMode`, `locationGeometry` from Task 1.
- Produces: `ValidLead.requestRole`, `ValidLead.locationMode`, `ValidLead.locationGeometry`; persisted D1 columns.

- [ ] **Step 1: Add failing Worker validation cases**

Extend `validPayload` with:

```js
requestRole: 'cerca',
locationMode: 'polygon',
location: 'Area selezionata sulla mappa — centro 45.4133, 11.8867',
locationGeometry: {
  type: 'Polygon',
  coordinates: [[[11.86, 45.40], [11.90, 45.40], [11.90, 45.44], [11.86, 45.40]]],
},
```

Add tests:

```js
test('accepts text and polygon location modes', () => {
  const polygon = validateLeadPayload(validPayload(), now);
  assert.equal(polygon.ok, true);
  assert.equal(polygon.value.locationGeometry.coordinates[0].length, 4);

  const text = validateLeadPayload(validPayload({
    requestRole: 'proprietario', locationMode: 'text', location: 'Via Roma 1, Padova', locationGeometry: null,
  }), now);
  assert.equal(text.ok, true);
});

test('rejects inconsistent or malformed geometry', () => {
  for (const override of [
    { requestRole: 'altro' },
    { locationMode: 'text', locationGeometry: validPayload().locationGeometry },
    { locationMode: 'polygon', locationGeometry: null },
    { locationGeometry: { type: 'Polygon', coordinates: [[[11, 45], [12, 45], [11, 45]]] } },
    { locationGeometry: { type: 'Polygon', coordinates: [[[181, 45], [12, 45], [12, 46], [181, 45]]] } },
  ]) {
    const result = validateLeadPayload(validPayload(override), now);
    assert.equal(result.ok, false);
    assert.ok(result.fieldErrors.requestRole || result.fieldErrors.locationMode || result.fieldErrors.locationGeometry);
  }
});
```

- [ ] **Step 2: Run Worker tests and verify RED**

Run: `node --test tests/cloudflare-leads.test.mjs`

Expected: FAIL because `ValidLead` ignores the new fields and invalid geometry is accepted.

- [ ] **Step 3: Add migration `0003_add_lead_location_geometry.sql`**

```sql
ALTER TABLE lead_submissions ADD COLUMN request_role TEXT CHECK (request_role IN ('cerca', 'proprietario'));
ALTER TABLE lead_submissions ADD COLUMN location_mode TEXT CHECK (location_mode IN ('text', 'polygon'));
ALTER TABLE lead_submissions ADD COLUMN location_geometry TEXT;
```

- [ ] **Step 4: Implement authoritative parsing in `validation.ts`**

Add exact types/constants:

```ts
export const requestRoles = ['cerca', 'proprietario'] as const;
export const locationModes = ['text', 'polygon'] as const;
export type RequestRole = (typeof requestRoles)[number];
export type LocationMode = (typeof locationModes)[number];
export interface LocationPolygon { type: 'Polygon'; coordinates: [number, number][][]; }
const maxGeometryLength = 6_000;
```

Add `parseLocationGeometry` using the same ring rules as Task 1, plus `JSON.stringify(value).length <= maxGeometryLength`. Parse `requestRole` and `locationMode` with `text(..., 20)`. Add field errors when enums are invalid, text mode has geometry, or polygon mode lacks a valid polygon. Return the three sanitized fields in `ValidLead`.

```ts
function parseLocationGeometry(value: unknown): LocationPolygon | null {
  if (!value || typeof value !== 'object' || JSON.stringify(value).length > maxGeometryLength) return null;
  const polygon = value as LocationPolygon;
  const ring = polygon.type === 'Polygon' && polygon.coordinates.length === 1 ? polygon.coordinates[0] : null;
  if (!ring || ring.length < 4 || ring.length > 25) return null;
  const pointIsValid = (point: unknown): point is [number, number] =>
    Array.isArray(point) && point.length === 2 && point.every(Number.isFinite) &&
    point[0] >= -180 && point[0] <= 180 && point[1] >= -90 && point[1] <= 90;
  if (!ring.every(pointIsValid)) return null;
  const distinct = new Set(ring.slice(0, -1).map(([lng, lat]) => `${lng},${lat}`));
  const first = ring[0];
  const last = ring.at(-1)!;
  return distinct.size >= 3 && distinct.size <= 24 && first[0] === last[0] && first[1] === last[1] ? polygon : null;
}
```

- [ ] **Step 5: Bind the new D1 values in `index.ts`**

Update insert columns and SQL parameter markers to include:

```ts
request_role, location_mode, location_geometry,
```

Bind after `lead.requestType`:

```ts
lead.requestRole,
lead.locationMode,
lead.locationGeometry ? JSON.stringify(lead.locationGeometry) : null,
```

- [ ] **Step 6: Run tests, local migration and Worker dry-run**

Run:

```bash
node --test tests/cloudflare-leads.test.mjs
npm run worker:db:migrate:local
npm run worker:check
```

Expected: all tests PASS; migration `0003` applied; Wrangler dry-run succeeds.

- [ ] **Step 7: Commit backend persistence**

```bash
git add cloudflare/migrations/0003_add_lead_location_geometry.sql cloudflare/src/validation.ts cloudflare/src/index.ts tests/cloudflare-leads.test.mjs
git commit -m "feat: persist request location geometry"
```

---

### Task 3: Make Lead Notifications Explain The New Intent

**Files:**
- Modify: `cloudflare/src/notification.ts`
- Modify: `tests/cloudflare-leads.test.mjs`
- Test: `tests/cloudflare-leads.test.mjs`

**Interfaces:**
- Consumes: sanitized `ValidLead` from Task 2.
- Produces: readable Gmail rows for role, location mode and polygon summary without raw coordinate dumps.

- [ ] **Step 1: Write failing notification assertions**

```js
test('notification explains search role and polygon without dumping GeoJSON', () => {
  const validated = validateLeadPayload(validPayload(), now).value;
  const message = buildLeadNotification(validated, {
    from: 'filippo@gemutcapital.com', to: 'filippo@gemutcapital.com', receivedAt: '2027-01-15T08:00:00.000Z',
  });
  assert.match(message.text, /Ruolo: Ricerca immobile/);
  assert.match(message.text, /Modalità posizione: Area disegnata sulla mappa/);
  assert.match(message.text, /Vertici area: 3/);
  assert.doesNotMatch(message.text, /coordinates|11\.86,45\.4/);
});
```

- [ ] **Step 2: Run focused test and verify RED**

Run: `node --test --test-name-pattern="notification explains" tests/cloudflare-leads.test.mjs`

Expected: FAIL because the new rows are absent.

- [ ] **Step 3: Add notification labels and derived vertex count**

```ts
const requestRoleLabels = { cerca: 'Ricerca immobile', proprietario: 'Bene proprio' } as const;
const locationModeLabels = { text: 'Zona o indirizzo scritto', polygon: 'Area disegnata sulla mappa' } as const;

const polygonVertices = lead.locationGeometry ? String(lead.locationGeometry.coordinates[0].length - 1) : 'Non applicabile';
const fields = [
  ['Tipo richiesta', requestType],
  ['Ruolo', requestRoleLabels[lead.requestRole]],
  ['Nome', lead.name],
  ['Email', display(lead.email)],
  ['Telefono', display(lead.phone)],
  ['Contatto preferito', contactPreference],
  ['Tipo immobile', lead.propertyType],
  ['Modalità posizione', locationModeLabels[lead.locationMode]],
  ['Zona', lead.location],
  ['Vertici area', polygonVertices],
  ['Budget / valore', display(lead.budget)],
  ['Tempistiche', display(lead.timeframe)],
  ['Caratteristiche', display(lead.features)],
  ['Note', display(lead.notes)],
  ['Pagina di provenienza', display(lead.sourceUrl)],
  ['Referrer', display(lead.referrer)],
  ['Consenso privacy', 'Accettato'],
  ['Ricevuta il', options.receivedAt],
  ['ID richiesta', lead.requestId],
] as const;
```

- [ ] **Step 4: Run notification and complete Worker tests**

Run: `node --test tests/cloudflare-leads.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit notification copy**

```bash
git add cloudflare/src/notification.ts tests/cloudflare-leads.test.mjs
git commit -m "feat: describe mapped areas in lead email"
```

---

### Task 4: Build Guided Intent And Choice Controls

**Files:**
- Create: `src/components/request/WizardProgress.tsx`
- Create: `src/components/request/RequestIntentSelector.tsx`
- Create: `src/components/request/PropertyDetailsStep.tsx`
- Create: `src/components/request/ContactStep.tsx`
- Modify: `tests/site-requirements.test.mjs`
- Test: `tests/site-requirements.test.mjs`

**Interfaces:**
- Consumes: `RequestIntent`, `RequestIntentValue`, `LeadRequest` fields and Turnstile callbacks.
- Produces: presentational components with controlled values; no direct submit or API calls.

- [ ] **Step 1: Add failing component-structure regression**

```js
test('guided request controls expose four intents and progressive inputs', () => {
  const intent = read('src/components/request/RequestIntentSelector.tsx');
  const property = read('src/components/request/PropertyDetailsStep.tsx');
  const contact = read('src/components/request/ContactStep.tsx');
  const progress = read('src/components/request/WizardProgress.tsx');
  ['Compro casa', 'Vendo casa', 'Cerco in affitto', 'Metto in affitto'].forEach((label) => assert.match(intent, new RegExp(label)));
  assert.match(intent, /role="radiogroup"/);
  assert.match(progress, /circa 2 minuti/);
  assert.match(property, /propertyTypes\.map/);
  assert.match(property, /budgetOptions\.map/);
  assert.match(property, /timeframeOptions\.map/);
  assert.match(contact, /contactPreference/);
  assert.match(contact, /form\.contactPreference === 'email'/);
  assert.match(contact, /Aggiungi anche/);
});
```

- [ ] **Step 2: Run focused test and verify RED**

Run: `node --test --test-name-pattern="guided request controls" tests/site-requirements.test.mjs`

Expected: FAIL because the component files do not exist.

- [ ] **Step 3: Implement `RequestIntentSelector` and `WizardProgress`**

`RequestIntentSelector` must be controlled and use the shared configuration:

```tsx
interface Props { value: RequestIntentValue; onChange: (intent: RequestIntent) => void; }

export default function RequestIntentSelector({ value, onChange }: Props) {
  return (
    <fieldset className="grid gap-5">
      <legend className="font-display text-3xl leading-tight sm:text-4xl">Qual è il tuo obiettivo?</legend>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4" role="radiogroup" aria-label="Obiettivo richiesta">
        {requestIntents.map((intent) => {
          const active = value === intent.value;
          return <button key={intent.value} type="button" role="radio" aria-checked={active} onClick={() => onChange(intent)} className={`focus-ring min-h-28 rounded-lg border p-4 text-left ${active ? 'border-[var(--ink)] bg-[var(--brand-blue)] shadow-[inset_0_0_0_1px_var(--ink)]' : 'border-[var(--control-border)] bg-white'}`}><span className="block font-semibold">{intent.label}</span><span className="mt-2 block text-sm text-[var(--graphite)]">{intent.description}</span></button>;
        })}
      </div>
    </fieldset>
  );
}
```

`WizardProgress` renders the existing three labels, active bars, `aria-current="step"`, and `Tempo stimato: circa 2 minuti`.

- [ ] **Step 4: Implement progressive property choices**

In `PropertyDetailsStep`, declare exact option arrays and render each with `role="radio"` buttons:

```ts
const propertyTypes = [
  ['appartamento', 'Appartamento'], ['villa', 'Villa o casa'], ['commerciale', 'Ufficio o commerciale'],
  ['terreno', 'Terreno'], ['altro', 'Altro'],
] as const;
const budgetOptions = ['Da definire', 'Fino a 200.000 €', '200.000–350.000 €', '350.000–500.000 €', 'Oltre 500.000 €'] as const;
const timeframeOptions = [['subito', 'Il prima possibile'], ['entro-3-mesi', 'Entro 3 mesi'], ['entro-6-mesi', 'Entro 6 mesi'], ['oltre-6-mesi', 'Oltre 6 mesi'], ['da-definire', 'Da definire']] as const;
```

Render location first through a `locationSlot: ReactNode`, then reveal property type, budget/value and timeframe. Keep an `Aggiungi dettagli` button controlling the optional textarea.

- [ ] **Step 5: Implement contact-channel progressive disclosure**

`ContactStep` accepts the controlled form, errors, `updateField`, Turnstile callbacks and `requestId`. Render name, contact-preference radiogroup, then only email for `email`, only phone for `telefono|whatsapp`, plus an `Aggiungi anche email/telefono` toggle for the secondary field. Preserve hidden honeypot, privacy copy/link, inline errors and `Turnstile`.

- [ ] **Step 6: Run structure tests and typecheck**

Run: `node --test --test-name-pattern="guided request controls" tests/site-requirements.test.mjs && npx tsc -p tsconfig.app.json --noEmit`

Expected: PASS; TypeScript exit 0.

- [ ] **Step 7: Commit guided controls**

```bash
git add src/components/request/WizardProgress.tsx src/components/request/RequestIntentSelector.tsx src/components/request/PropertyDetailsStep.tsx src/components/request/ContactStep.tsx tests/site-requirements.test.mjs
git commit -m "feat: add guided request controls"
```

---

### Task 5: Add The Free Polygon Map

**Files:**
- Create: `src/components/request/LocationPolygonMap.tsx`
- Modify: `src/index.css`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `package-lock.json`
- Modify: `tests/site-requirements.test.mjs`
- Test: `tests/site-requirements.test.mjs`

**Interfaces:**
- Consumes: `LocationPolygon` and `isValidLocationPolygon` from Task 1.
- Produces: `LocationPolygonMap({ value, onChange, onUnavailable, error })`; confirmed polygon or `null`.

- [ ] **Step 1: Add failing map integration assertions**

```js
test('request polygon map is free, lazy, branded and accessible', () => {
  const pkg = read('package.json');
  const map = read('src/components/request/LocationPolygonMap.tsx');
  const css = read('src/index.css');
  assert.match(pkg, /"maplibre-gl": "5\.24\.0"/);
  assert.match(pkg, /"@mapbox\/mapbox-gl-draw": "1\.5\.1"/);
  assert.match(map, /https:\/\/tiles\.openfreemap\.org\/styles\/positron/);
  assert.match(map, /© OpenStreetMap contributors/);
  assert.match(map, /Annulla ultimo punto/);
  assert.match(map, /Ricomincia/);
  assert.match(map, /Conferma area/);
  assert.match(map, /onUnavailable/);
  assert.doesNotMatch(map, /access_token|apiKey|geolocation|getCurrentPosition/);
  assert.match(css, /\.request-location-map/);
  assert.match(css, /--brand-blue/);
});
```

- [ ] **Step 2: Run focused test and verify RED**

Run: `node --test --test-name-pattern="request polygon map" tests/site-requirements.test.mjs`

Expected: FAIL because dependencies and component are absent.

- [ ] **Step 3: Install pinned map dependencies and synchronize both lockfiles**

```bash
pnpm add -E maplibre-gl@5.24.0 @mapbox/mapbox-gl-draw@1.5.1
pnpm add -DE @types/mapbox__mapbox-gl-draw@1.4.9
pnpm dlx npm@latest install --package-lock-only
```

- [ ] **Step 4: Implement the MapLibre lifecycle**

`LocationPolygonMap.tsx` must import both CSS files, create the map once, use OpenFreeMap Positron, hide built-in draw buttons and register `draw.create`, `draw.update`, `draw.delete`, `error` and `webglcontextlost` handlers.

```tsx
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
```

On `load`, add MapboxDraw as `maplibregl.IControl`, restore `value` if present, otherwise call `draw.changeMode('draw_polygon')`. Keep current draft in a ref. On draw/update, normalize the first valid polygon and invalidate the confirmed parent value until `Conferma area` is pressed. Cleanup every listener, control and map instance.

- [ ] **Step 5: Implement custom large actions**

```ts
function removeLastVertex() {
  const draft = draftRef.current;
  if (!draft) return;
  const points = draft.coordinates[0].slice(0, -1);
  if (points.length <= 3) return resetPolygon();
  points.pop();
  const next = { type: 'Polygon', coordinates: [[...points, points[0]]] } satisfies LocationPolygon;
  replaceDrawFeature(next);
}

function replaceDrawFeature(polygon: LocationPolygon) {
  const draw = drawRef.current;
  if (!draw) return;
  draw.deleteAll();
  const [featureId] = draw.add({ type: 'Feature', properties: {}, geometry: polygon });
  draftRef.current = polygon;
  onChangeRef.current(null);
  draw.changeMode('direct_select', { featureId: String(featureId) });
}

function resetPolygon() {
  drawRef.current?.deleteAll();
  draftRef.current = null;
  onChangeRef.current(null);
  drawRef.current?.changeMode('draw_polygon');
}

function confirmPolygon() {
  if (draftRef.current && isValidLocationPolygon(draftRef.current)) onChange(draftRef.current);
}
```

Render a `role="application"` map region with a short screen-reader instruction, the three buttons, visible attribution link, and inline error. Disable undo/confirm when the current draft is invalid.

- [ ] **Step 6: Add token-based CSS overrides**

```css
.request-location-map { min-height: clamp(22rem, 52vw, 32rem); background: var(--paper-soft); }
.request-location-map .maplibregl-canvas { outline: none; }
.request-location-map .maplibregl-ctrl-attrib { background: rgb(247 245 239 / 0.92); color: var(--graphite); }
```

Use `drawStyles` in `new MapboxDraw({ displayControlsDefault: false, styles: [...drawStyles] })`; polygon styling is a WebGL layer configuration, not CSS. Keep `onChangeRef` synchronized with `onChange` in a small effect so map listeners never capture a stale callback.

- [ ] **Step 7: Run focused test, typecheck and build**

Run: `node --test --test-name-pattern="request polygon map" tests/site-requirements.test.mjs && npx tsc -p tsconfig.app.json --noEmit && npm run build`

Expected: PASS; Vite build emits a lazy map chunk and no missing CSS/type errors.

- [ ] **Step 8: Commit the map**

```bash
git add package.json pnpm-lock.yaml package-lock.json src/components/request/LocationPolygonMap.tsx src/index.css tests/site-requirements.test.mjs
git commit -m "feat: add free polygon location map"
```

---

### Task 6: Make Text And Map Entry Mutually Exclusive

**Files:**
- Create: `src/components/request/LocationSelector.tsx`
- Modify: `tests/site-requirements.test.mjs`
- Test: `tests/site-requirements.test.mjs`

**Interfaces:**
- Consumes: `LocationMode`, `LocationPolygon`, `RequestRole`, `LocationPolygonMap`.
- Produces: controlled text/map selector with `onModeChange`, `onTextChange`, `onPolygonChange`, `onMapUnavailable`.

- [ ] **Step 1: Write failing exclusivity/default assertions**

```js
test('location selector swaps text and map in one panel', () => {
  const selector = read('src/components/request/LocationSelector.tsx');
  assert.match(selector, /Scrivi zona/);
  assert.match(selector, /Seleziona sulla mappa/);
  assert.match(selector, /mode === 'text' \? \(/);
  assert.match(selector, /<LocationPolygonMap/);
  assert.match(selector, /role="tablist"/);
  assert.match(selector, /aria-selected=\{mode === 'text'\}/);
  assert.doesNotMatch(selector, /mode === 'text'.*<LocationPolygonMap/s);
});
```

- [ ] **Step 2: Run focused test and verify RED**

Run: `node --test --test-name-pattern="location selector swaps" tests/site-requirements.test.mjs`

Expected: FAIL because `LocationSelector.tsx` is absent.

- [ ] **Step 3: Implement `LocationSelector`**

```tsx
const suggestedZones = ['Padova Centro', 'Arcella', 'Città Giardino', 'Forcellini', 'Abano Terme', 'Noventa Padovana'];

export default function LocationSelector({ requestRole, mode, textValue, polygonValue, error, onModeChange, onTextChange, onPolygonChange, onMapUnavailable }: Props) {
  const title = requestRole === 'cerca' ? 'Dove stai cercando?' : 'Dove si trova l’immobile?';
  return (
    <section aria-labelledby="location-title" className="grid gap-6">
      <div><h2 id="location-title" className="font-display text-3xl sm:text-4xl">{title}</h2><p className="mt-2 text-sm text-[var(--graphite)]">Scegli il metodo più rapido per te.</p></div>
      <div className="inline-grid grid-cols-2 rounded-lg border border-[var(--line)] bg-[var(--paper)] p-1" role="tablist" aria-label="Metodo posizione">
        {(['text', 'polygon'] as const).map((nextMode) => <button key={nextMode} type="button" role="tab" aria-selected={mode === nextMode} onClick={() => onModeChange(nextMode)} className={`focus-ring min-h-11 rounded-md px-4 text-sm font-semibold ${mode === nextMode ? 'bg-white text-[var(--ink)] shadow-sm' : 'text-[var(--graphite)]'}`}>{nextMode === 'text' ? 'Scrivi zona' : 'Seleziona sulla mappa'}</button>)}
      </div>
      {mode === 'text' ? (
        <div role="tabpanel" className="grid gap-3"><label htmlFor="location" className="text-sm font-semibold">Comune, quartiere o indirizzo</label><input id="location" value={textValue} onChange={(event) => onTextChange(event.target.value)} className="field-control min-h-14 rounded-lg border border-[var(--control-border)] bg-white px-4" /><div className="flex flex-wrap gap-2">{suggestedZones.map((zone) => <button key={zone} type="button" onClick={() => onTextChange(zone)} className="focus-ring min-h-11 rounded-full border border-[var(--line)] bg-white px-4 text-sm">{zone}</button>)}</div></div>
      ) : (
        <div role="tabpanel"><LocationPolygonMap value={polygonValue} onChange={onPolygonChange} onUnavailable={onMapUnavailable} error={error} /></div>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Run focused test and typecheck**

Run: `node --test --test-name-pattern="location selector swaps" tests/site-requirements.test.mjs && npx tsc -p tsconfig.app.json --noEmit`

Expected: PASS.

- [ ] **Step 5: Commit the selector**

```bash
git add src/components/request/LocationSelector.tsx tests/site-requirements.test.mjs
git commit -m "feat: switch between text and map location"
```

---

### Task 7: Integrate The Adaptive Wizard And Submission

**Files:**
- Modify: `src/pages/RequestsPage.tsx`
- Modify: `src/lib/leads.ts`
- Modify: `tests/site-requirements.test.mjs`
- Modify: `tests/request-wizard.test.mjs`
- Test: `tests/site-requirements.test.mjs`, `tests/request-wizard.test.mjs`

**Interfaces:**
- Consumes: every controlled component and helper from Tasks 1, 4, 5 and 6.
- Produces: complete three-step request flow and extended API payload.

- [ ] **Step 1: Add failing integration assertions**

```js
test('request page composes the adaptive wizard and submits geometry', () => {
  const requests = read('src/pages/RequestsPage.tsx');
  assert.match(requests, /<RequestIntentSelector/);
  assert.match(requests, /<PropertyDetailsStep/);
  assert.match(requests, /<ContactStep/);
  assert.match(requests, /getDefaultLocationMode/);
  assert.match(requests, /summarizePolygon/);
  assert.match(requests, /locationGeometry/);
  assert.match(requests, /requestRole/);
  assert.match(requests, /setStep\(1\)/);
  assert.match(requests, /onMapUnavailable/);
});
```

- [ ] **Step 2: Run focused integration test and verify RED**

Run: `node --test --test-name-pattern="request page composes" tests/site-requirements.test.mjs`

Expected: FAIL because `RequestsPage` still renders the old inline fields.

- [ ] **Step 3: Extend initial state with separate drafts**

Keep UI-only text draft outside the submitted `LeadRequest`:

```ts
const initialIntent = getInitialIntent(searchParams.get('type'));
const [intentValue, setIntentValue] = useState(initialIntent.value);
const [locationText, setLocationText] = useState('');

function createEmptyForm(intent: RequestIntent): LeadRequest {
  return {
    requestId: crypto.randomUUID(),
    requestType: intent.requestType,
    requestRole: intent.requestRole,
    locationMode: getDefaultLocationMode(intent.requestRole),
    propertyType: '',
    location: '',
    locationGeometry: null,
    budget: '',
    timeframe: '',
    features: '',
    name: '',
    phone: '',
    email: '',
    contactPreference: 'telefono',
    notes: '',
    privacyAccepted: false,
    turnstileToken: '',
    website: '',
    startedAt: Date.now(),
    sourceUrl: '',
    referrer: '',
  };
}
```

- [ ] **Step 4: Implement intent and location transitions**

```ts
function selectIntent(intent: RequestIntent) {
  const defaultMode = getDefaultLocationMode(intent.requestRole);
  setIntentValue(intent.value);
  setLocationText('');
  setForm((current) => ({ ...current, requestType: intent.requestType, requestRole: intent.requestRole, locationMode: defaultMode, location: '', locationGeometry: null }));
  setErrors({});
  window.requestAnimationFrame(() => setStep(1));
}

function selectLocationMode(locationMode: LocationMode) {
  setForm((current) => ({ ...current, locationMode, location: locationMode === 'text' ? locationText : current.locationGeometry ? summarizePolygon(current.locationGeometry) : '' }));
}

function setPolygon(locationGeometry: LocationPolygon | null) {
  setForm((current) => ({ ...current, locationGeometry, location: locationGeometry ? summarizePolygon(locationGeometry) : '' }));
}

function onMapUnavailable(message: string) {
  setForm((current) => ({ ...current, locationMode: 'text', location: locationText, locationGeometry: null }));
  setMessage(message);
}
```

- [ ] **Step 5: Update step validation and submission sanitation**

Step 1 requires property type plus either non-empty `locationText` in text mode or valid `locationGeometry` in polygon mode. Before submit, construct:

```ts
const request = {
  ...form,
  location: form.locationMode === 'text' ? locationText.trim() : summarizePolygon(form.locationGeometry!),
  locationGeometry: form.locationMode === 'polygon' ? form.locationGeometry : null,
  sourceUrl: window.location.href,
  referrer: document.referrer,
};
```

- [ ] **Step 6: Replace inline JSX with focused components**

Render `WizardProgress` above all steps; step 0 uses `RequestIntentSelector`; step 1 uses `PropertyDetailsStep` with `LocationSelector` passed as `locationSlot`; step 2 uses `ContactStep`. Preserve previous/back/submit actions, status message, success branch and reset. Reset must create a new request ID, restore query-derived intent and its default mode, clear both drafts and return to step 0.

- [ ] **Step 7: Run frontend tests and typecheck**

Run:

```bash
node --test tests/request-wizard.test.mjs
node --test --test-name-pattern="lead form|guided request|location selector|request page|successful request|starting a new request" tests/site-requirements.test.mjs
npx tsc -p tsconfig.app.json --noEmit
```

Expected: all PASS.

- [ ] **Step 8: Commit integration without unrelated dirty hunks**

```bash
git add src/pages/RequestsPage.tsx src/lib/leads.ts tests/request-wizard.test.mjs
git add -p tests/site-requirements.test.mjs
git commit -m "feat: integrate adaptive request wizard"
```

---

### Task 8: Document And Verify The Complete Flow

**Files:**
- Modify: `docs/product/PRD.md`
- Modify: `docs/architecture/overview.md`
- Modify: `docs/patterns/frontend.md`
- Modify: `docs/ai/progress.md`
- Verify: all files changed by Tasks 1–7

**Interfaces:**
- Consumes: implemented behavior and verification results.
- Produces: durable documentation and final evidence.

- [ ] **Step 1: Update durable product and architecture memory**

Add exact product state to `docs/product/PRD.md`: four visible intents, role-based map/text defaults, mutually exclusive panels, three macro-steps, progressive controls, free map stack, map fallback and saved geometry.

Add exact data flow to `docs/architecture/overview.md`:

```text
RequestsPage → request components → MapLibre/OpenFreeMap or text location
  → LeadRequest(requestType + requestRole + locationMode + GeoJSON)
  → Worker validation → D1 nullable geometry columns → Gmail summary
```

Add conventions to `docs/patterns/frontend.md`: keep map rendering isolated, centralize intent mapping, always provide a text equivalent, never mount text and map panels together, and keep provider/style URL replaceable.

Add one milestone to `docs/ai/progress.md` after all verification passes.

- [ ] **Step 2: Run complete automated verification**

```bash
npm test
npm run lint
npx tsc -p tsconfig.app.json --noEmit
npm run build
npm run worker:check
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 3: Run local database and browser verification**

```bash
npm run worker:db:migrate:local
npm run worker:dev
npm run dev
```

Verify in browser at desktop and mobile widths:

1. `Compro casa` and `Cerco in affitto` open step 2 with map active.
2. `Vendo casa` and `Metto in affitto` open step 2 with text active.
3. Switching tabs replaces, never stacks, the active panel.
4. Map draw, edit, undo, reset and confirm work; attribution remains visible.
5. Simulated WebGL/tile failure falls back to text without losing intent.
6. Property choices progressively reveal; optional details stay collapsed by default.
7. Contact channel reveals only its required field and allows the secondary field.
8. Local submit reaches Worker, validates Turnstile test token, writes new D1 columns and shows success.
9. `Nuova richiesta` resets to step 0 with a new ID.
10. Keyboard focus, screen-reader labels and reduced-motion behavior remain correct.

- [ ] **Step 4: Inspect the final diff and preserve user work**

Run: `git status --short && git diff --stat && git diff -- src cloudflare tests docs package.json`

Expected: only planned feature files plus pre-existing user hunks; no `.superdesign/tmp`, `._*`, secrets, build output or unrelated modifications staged.

- [ ] **Step 5: Commit documentation and final fixes**

```bash
git add docs/product/PRD.md docs/architecture/overview.md docs/patterns/frontend.md docs/ai/progress.md
git commit -m "docs: record guided request wizard"
```

Do not deploy the Worker, run remote D1 migrations, push, or create a PR without separate user authorization.
