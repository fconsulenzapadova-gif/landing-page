import assert from 'node:assert/strict';
import test from 'node:test';

const lifecycleUrl = new URL('../src/components/request/locationSelectorLifecycle.ts', import.meta.url);
const boundaryUrl = new URL('../src/components/request/LocationMapErrorBoundary.ts', import.meta.url);

async function loadLifecycle() {
  return import(lifecycleUrl);
}

const unconfirmedDraft = {
  type: 'Polygon',
  coordinates: [[[11.86, 45.40], [11.90, 45.40], [11.90, 45.44], [11.86, 45.40]]],
};

test('lazy map rejection falls back to text only once', async () => {
  const {
    createLocationSelectorLifecycle,
    loadLocationMapModule,
    locationMapLoadErrorMessage,
  } = await loadLifecycle();
  const { default: LocationMapErrorBoundary } = await import(boundaryUrl);
  const modes = [];
  const messages = [];
  const lifecycle = createLocationSelectorLifecycle({
    initialDraft: null,
    onModeChange(mode) { modes.push(mode); },
    onMapUnavailable(message) { messages.push(message); },
  });
  const importError = new Error('map chunk unavailable');
  const boundary = new LocationMapErrorBoundary({
    children: null,
    onUnavailable(message) { lifecycle.handleMapUnavailable(message); },
  });

  await assert.rejects(
    loadLocationMapModule(() => Promise.reject(importError)),
    (error) => {
      boundary.componentDidCatch(error);
      return error === importError;
    },
  );
  boundary.componentDidCatch(importError);

  assert.deepEqual(messages, [locationMapLoadErrorMessage]);
  assert.deepEqual(modes, ['text']);
});

test('unconfirmed polygon draft survives text and map switches', async () => {
  const { createLocationSelectorLifecycle } = await loadLifecycle();
  const modes = [];
  const lifecycle = createLocationSelectorLifecycle({
    initialDraft: null,
    onModeChange(mode) { modes.push(mode); },
    onMapUnavailable() {},
  });

  lifecycle.updateDraft(unconfirmedDraft);
  lifecycle.changeMode('text');
  lifecycle.changeMode('polygon');

  assert.deepEqual(modes, ['text', 'polygon']);
  assert.deepEqual(lifecycle.getDraft(), unconfirmedDraft);
  assert.notEqual(lifecycle.getDraft(), unconfirmedDraft);
  assert.notEqual(lifecycle.getDraft().coordinates[0], unconfirmedDraft.coordinates[0]);
});
