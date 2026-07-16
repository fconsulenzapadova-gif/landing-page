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
import {
  advanceRequestWizard,
  buildLeadRequestPayload,
  createRequestWizardDraft,
  getNextIntentIndex,
  normalizeLeadFieldErrors,
  resetRequestWizard,
  retreatRequestWizard,
  selectRequestIntent,
  setRequestLocationMode,
  setRequestLocationText,
  setRequestPolygon,
  setRequestPolygonDraft,
  updateRequestField,
} from '../src/lib/requestWizardFlow.ts';

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

test('keyboard intent navigation selects without advancing until explicit continue', () => {
  const initialIntent = getInitialIntent('acquisto');
  const initial = createRequestWizardDraft(initialIntent, { requestId: 'request-1', startedAt: 100 });
  const nextIndex = getNextIntentIndex('ArrowRight', 0, requestIntents.length);

  assert.equal(nextIndex, 1);
  const selected = selectRequestIntent(initial, requestIntents[nextIndex]);
  assert.equal(selected.intentValue, 'vendita');
  assert.equal(selected.step, 0);

  const advanced = advanceRequestWizard(selected);
  assert.equal(advanced.step, 1);
});

test('reselecting the active intent preserves location and polygon drafts', () => {
  const initial = createRequestWizardDraft(getInitialIntent('acquisto'), { requestId: 'request-1', startedAt: 100 });
  const withText = setRequestLocationText(initial, 'Padova Centro');
  const withPolygonDraft = setRequestPolygonDraft(withText, polygon);
  const withPolygon = setRequestPolygon(withPolygonDraft, polygon);

  const reselected = selectRequestIntent(withPolygon, requestIntents[0]);
  assert.strictEqual(reselected, withPolygon);
  assert.equal(reselected.locationText, 'Padova Centro');
  assert.deepEqual(reselected.locationPolygonDraft, polygon);
  assert.deepEqual(reselected.form.locationGeometry, polygon);

  const changed = selectRequestIntent(reselected, requestIntents[1]);
  assert.equal(changed.locationText, '');
  assert.equal(changed.locationPolygonDraft, null);
  assert.equal(changed.form.locationGeometry, null);
  assert.equal(changed.form.locationMode, 'text');
});

test('back and edit preserve contact data while reset creates a clean query-derived draft', () => {
  const initial = createRequestWizardDraft(getInitialIntent('acquisto'), { requestId: 'request-1', startedAt: 100 });
  const atContacts = advanceRequestWizard(advanceRequestWizard(initial));
  const withContact = updateRequestField(atContacts, 'name', 'Ada Lovelace');
  const backAtProperty = retreatRequestWizard(withContact);
  const edited = setRequestLocationText(setRequestLocationMode(backAtProperty, 'text'), 'Arcella');

  assert.equal(edited.step, 1);
  assert.equal(edited.form.name, 'Ada Lovelace');
  assert.equal(edited.locationText, 'Arcella');

  const reset = resetRequestWizard(getInitialIntent('vendita'), { requestId: 'request-2', startedAt: 200 });
  assert.equal(reset.step, 0);
  assert.equal(reset.intentValue, 'vendita');
  assert.equal(reset.form.requestId, 'request-2');
  assert.equal(reset.form.name, '');
  assert.equal(reset.form.locationMode, 'text');
});

test('submission payload keeps notes and enforces exclusive text or polygon location', () => {
  const initial = createRequestWizardDraft(getInitialIntent('acquisto'), { requestId: 'request-1', startedAt: 100 });
  const withNotes = updateRequestField(initial, 'notes', 'Chiamare dopo le 18');
  const withTextAndPolygon = setRequestPolygon(setRequestLocationText(withNotes, '  Arcella  '), polygon);
  const textDraft = setRequestLocationMode(withTextAndPolygon, 'text');
  const textPayload = buildLeadRequestPayload(textDraft, 'https://example.test/richieste', 'https://example.test/');

  assert.equal(textPayload.location, 'Arcella');
  assert.equal(textPayload.locationGeometry, null);
  assert.equal(textPayload.notes, 'Chiamare dopo le 18');

  const polygonDraft = setRequestLocationMode(withTextAndPolygon, 'polygon');
  const polygonPayload = buildLeadRequestPayload(polygonDraft, 'https://example.test/richieste', '');
  assert.equal(polygonPayload.location, summarizePolygon(polygon));
  assert.deepEqual(polygonPayload.locationGeometry, polygon);
});

test('submission refuses an incoherent polygon payload', () => {
  const invalidPolygonDraft = createRequestWizardDraft(
    getInitialIntent('acquisto'),
    { requestId: 'request-1', startedAt: 100 },
  );

  assert.throws(
    () => buildLeadRequestPayload(invalidPolygonDraft, 'https://example.test/richieste', ''),
    /poligono valido/,
  );
});

test('API geometry errors map to visible location errors and earliest affected step', () => {
  const normalized = normalizeLeadFieldErrors({
    email: 'Email non valida.',
    locationGeometry: 'Area selezionata non valida.',
  });

  assert.deepEqual(normalized.formErrors, {
    location: 'Area selezionata non valida.',
    email: 'Email non valida.',
  });
  assert.equal(normalized.earliestStep, 1);
  assert.equal(normalized.firstField, 'location');
  assert.deepEqual(normalized.summary, ['Area selezionata non valida.', 'Email non valida.']);

  const contactOnly = normalizeLeadFieldErrors({ phone: 'Telefono non valido.' });
  assert.equal(contactOnly.earliestStep, 2);
  assert.equal(contactOnly.firstField, 'phone');
});
