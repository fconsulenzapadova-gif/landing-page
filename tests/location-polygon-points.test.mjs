import assert from 'node:assert/strict';
import test from 'node:test';

const pointsUrl = new URL('../src/components/request/locationPolygonPoints.ts', import.meta.url);

test('area becomes valid automatically from the third point onward', async () => {
  const { polygonFromPoints } = await import(pointsUrl);
  const first = [11.86, 45.40];
  const second = [11.90, 45.40];
  const third = [11.90, 45.44];
  const fourth = [11.86, 45.44];

  assert.equal(polygonFromPoints([first, second]), null);
  assert.deepEqual(polygonFromPoints([first, second, third]), {
    type: 'Polygon',
    coordinates: [[first, second, third, first]],
  });
  assert.deepEqual(polygonFromPoints([first, second, third, fourth]), {
    type: 'Polygon',
    coordinates: [[first, second, third, fourth, first]],
  });
});

test('saved polygons restore as appendable points without the closing coordinate', async () => {
  const { pointsFromPolygon } = await import(pointsUrl);
  const polygon = {
    type: 'Polygon',
    coordinates: [[[11.86, 45.40], [11.90, 45.40], [11.90, 45.44], [11.86, 45.40]]],
  };

  assert.deepEqual(pointsFromPolygon(polygon), [
    [11.86, 45.40],
    [11.90, 45.40],
    [11.90, 45.44],
  ]);
});
