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
    requestIntents.map(({ label }) => label),
    ['Compro casa', 'Vendo casa', 'Cerco in affitto', 'Metto in affitto'],
  );
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
