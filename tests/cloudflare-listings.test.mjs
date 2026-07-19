import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../cloudflare/src/index.ts';

const rows = [
  {
    code: 'DEMO-001', slug: 'demo-padova', title: 'Demo Padova', contract_type: 'vendita',
    property_type: 'Appartamento', municipality: 'Padova', zone: 'Centro', address: '', postal_code: '35100',
    price_cents: 32500000, price_label: null, surface_sqm: 110, rooms: 4, bedrooms: 2, bathrooms: 2,
    floor: '2', elevator: 'Sì', condition: 'Ottimo', energy_class: 'A2', available_from: 'Subito',
    summary: 'Scheda dimostrativa', description: 'Descrizione dimostrativa', features: '["Terrazzo"]',
    highlights: '["Centro"]', image_key: 'demo/demo-padova/cover.webp', image_alt: 'Demo Padova', image_position: 0,
  },
];

function createEnv(object = null) {
  return {
    DB: {
      prepare(query) {
        assert.match(query, /status = 'published'/);
        return { bind() { return this; }, async all() { return { success: true, results: rows }; } };
      },
    },
    LISTING_MEDIA: {
      async getWithMetadata(key, type) {
        assert.equal(key, 'demo/demo-padova/cover.webp');
        assert.equal(type, 'arrayBuffer');
        return object;
      },
    },
    ALLOWED_ORIGINS: 'http://localhost:8080',
  };
}

test('public listings endpoint returns published D1 rows with KV media URLs', async () => {
  const response = await worker.fetch(new Request('https://worker.test/api/listings'), createEnv(), { waitUntil() {} });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
  assert.equal(payload.listings.length, 1);
  assert.equal(payload.listings[0].requestType, 'vendita');
  assert.deepEqual(payload.listings[0].features, ['Terrazzo']);
  assert.deepEqual(payload.listings[0].images, ['https://worker.test/media/demo/demo-padova/cover.webp']);
});

test('KV media endpoint streams objects with immutable caching', async () => {
  const object = {
    value: new Uint8Array([1, 2, 3]).buffer,
    metadata: { contentType: 'image/webp', etag: '"demo-etag"' },
  };
  const response = await worker.fetch(
    new Request('https://worker.test/media/demo/demo-padova/cover.webp'),
    createEnv(object),
    { waitUntil() {} },
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Content-Type'), 'image/webp');
  assert.match(response.headers.get('Cache-Control'), /immutable/);
  assert.equal(response.headers.get('ETag'), '"demo-etag"');
});
