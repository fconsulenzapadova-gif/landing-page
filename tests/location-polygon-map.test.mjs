import assert from 'node:assert/strict';
import test from 'node:test';

const lifecycleUrl = new URL('../src/components/request/locationPolygonMapLifecycle.ts', import.meta.url);

async function loadLifecycle() {
  return import(lifecycleUrl);
}

const initialPolygon = {
  type: 'Polygon',
  coordinates: [[[11.86, 45.40], [11.90, 45.40], [11.90, 45.44], [11.86, 45.40]]],
};

const updatedPolygon = {
  type: 'Polygon',
  coordinates: [[[11.84, 45.39], [11.92, 45.39], [11.92, 45.45], [11.84, 45.39]]],
};

function createMapHarness() {
  const listeners = new Map();
  const calls = {
    addedControls: [],
    removedControls: [],
    removed: 0,
    unsubscribed: [],
  };

  const map = {
    on(type, listener) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(listener);
      return {
        unsubscribe() {
          listeners.get(type)?.delete(listener);
          calls.unsubscribed.push(type);
        },
      };
    },
    addControl(control) {
      calls.addedControls.push(control);
    },
    hasControl(control) {
      return calls.addedControls.includes(control) && !calls.removedControls.includes(control);
    },
    removeControl(control) {
      calls.removedControls.push(control);
    },
    remove() {
      calls.removed += 1;
    },
  };

  return {
    map,
    calls,
    fire(type, event = {}) {
      for (const listener of [...(listeners.get(type) ?? [])]) listener(event);
    },
  };
}

function createDrawHarness() {
  const calls = { added: [], modes: [] };
  const draw = {
    add(feature) {
      calls.added.push(feature);
      return ['polygon-1'];
    },
    changeMode(mode, options) {
      calls.modes.push({ mode, options });
    },
  };
  return { draw, calls };
}

test('Mapbox Draw class names are configured for MapLibre before use', async () => {
  const { configureMapboxDrawForMapLibre } = await loadLifecycle();
  assert.equal(typeof configureMapboxDrawForMapLibre, 'function');
  const classes = {
    CANVAS: 'mapboxgl-canvas',
    CONTROL_BASE: 'mapboxgl-ctrl',
    CONTROL_PREFIX: 'mapboxgl-ctrl-',
    CONTROL_GROUP: 'mapboxgl-ctrl-group',
    ATTRIBUTION: 'mapboxgl-ctrl-attrib',
  };

  configureMapboxDrawForMapLibre(classes);

  assert.deepEqual(classes, {
    CANVAS: 'maplibregl-canvas',
    CONTROL_BASE: 'maplibregl-ctrl',
    CONTROL_PREFIX: 'maplibregl-ctrl-',
    CONTROL_GROUP: 'maplibregl-ctrl-group',
    ATTRIBUTION: 'maplibregl-ctrl-attrib',
  });
});

test('map lifecycle restores an initial polygon when the map loads', async () => {
  const { createLocationPolygonMapLifecycle } = await loadLifecycle();
  assert.equal(typeof createLocationPolygonMapLifecycle, 'function');
  const mapHarness = createMapHarness();
  const drawHarness = createDrawHarness();
  const control = {};
  const lifecycle = createLocationPolygonMapLifecycle({
    map: mapHarness.map,
    draw: drawHarness.draw,
    control,
    initialValue: initialPolygon,
    onDraft() {},
    onUnavailable() {},
  });

  mapHarness.fire('load');

  assert.deepEqual(mapHarness.calls.addedControls, [control]);
  assert.deepEqual(drawHarness.calls.added, [
    { type: 'Feature', properties: {}, geometry: initialPolygon },
  ]);
  assert.deepEqual(drawHarness.calls.modes, [
    { mode: 'direct_select', options: { featureId: 'polygon-1' } },
  ]);
  lifecycle.dispose();
});

test('map lifecycle handles polygon create, update and delete events', async () => {
  const { createLocationPolygonMapLifecycle } = await loadLifecycle();
  assert.equal(typeof createLocationPolygonMapLifecycle, 'function');
  const mapHarness = createMapHarness();
  const drawHarness = createDrawHarness();
  const drafts = [];
  const lifecycle = createLocationPolygonMapLifecycle({
    map: mapHarness.map,
    draw: drawHarness.draw,
    control: {},
    initialValue: null,
    onDraft(value) { drafts.push(value); },
    onUnavailable() {},
  });

  mapHarness.fire('load');
  mapHarness.fire('draw.create', { features: [{ geometry: initialPolygon }] });
  mapHarness.fire('draw.update', { features: [{ geometry: updatedPolygon }] });
  mapHarness.fire('draw.delete');

  assert.deepEqual(drafts, [initialPolygon, updatedPolygon, null]);
  assert.deepEqual(drawHarness.calls.modes, [
    { mode: 'draw_polygon', options: undefined },
    { mode: 'draw_polygon', options: undefined },
  ]);
  lifecycle.dispose();
});

test('map lifecycle reports fallback only once', async () => {
  const { createLocationPolygonMapLifecycle } = await loadLifecycle();
  assert.equal(typeof createLocationPolygonMapLifecycle, 'function');
  const mapHarness = createMapHarness();
  const drawHarness = createDrawHarness();
  const messages = [];
  const lifecycle = createLocationPolygonMapLifecycle({
    map: mapHarness.map,
    draw: drawHarness.draw,
    control: {},
    initialValue: null,
    onDraft() {},
    onUnavailable(message) { messages.push(message); },
  });

  mapHarness.fire('error');
  mapHarness.fire('error');
  mapHarness.fire('webglcontextlost');

  assert.deepEqual(messages, ['Non riusciamo a caricare la mappa. Inserisci la zona come testo.']);
  lifecycle.dispose();
});

test('map lifecycle unsubscribes listeners and removes control and map', async () => {
  const { createLocationPolygonMapLifecycle } = await loadLifecycle();
  assert.equal(typeof createLocationPolygonMapLifecycle, 'function');
  const mapHarness = createMapHarness();
  const drawHarness = createDrawHarness();
  const drafts = [];
  const control = {};
  const lifecycle = createLocationPolygonMapLifecycle({
    map: mapHarness.map,
    draw: drawHarness.draw,
    control,
    initialValue: null,
    onDraft(value) { drafts.push(value); },
    onUnavailable() {},
  });
  mapHarness.fire('load');

  lifecycle.dispose();
  mapHarness.fire('draw.create', { features: [{ geometry: initialPolygon }] });

  assert.deepEqual(mapHarness.calls.unsubscribed.sort(), [
    'draw.create',
    'draw.delete',
    'draw.update',
    'error',
    'load',
    'webglcontextlost',
  ]);
  assert.deepEqual(mapHarness.calls.removedControls, [control]);
  assert.equal(mapHarness.calls.removed, 1);
  assert.deepEqual(drafts, []);
});
