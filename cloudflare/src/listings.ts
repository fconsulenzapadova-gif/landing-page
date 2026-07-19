interface D1Result<T> {
  success: boolean;
  results: T[];
}

interface D1PreparedStatement {
  bind: (...values: unknown[]) => D1PreparedStatement;
  all: <T>() => Promise<D1Result<T>>;
}

export interface ListingsDatabase {
  prepare: (query: string) => D1PreparedStatement;
}

interface MediaMetadata {
  contentType?: string;
  etag?: string;
}

export interface ListingsMediaStore {
  getWithMetadata: (
    key: string,
    type: 'arrayBuffer',
  ) => Promise<{ value: ArrayBuffer | null; metadata: MediaMetadata | null }>;
}

interface ListingRow {
  code: string;
  slug: string;
  title: string;
  contract_type: 'vendita' | 'locazione';
  property_type: string;
  municipality: string;
  zone: string;
  address: string;
  postal_code: string;
  price_cents: number | null;
  price_label: string | null;
  surface_sqm: number | null;
  rooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: string;
  elevator: string;
  condition: string;
  energy_class: string;
  available_from: string;
  summary: string;
  description: string;
  features: string;
  highlights: string;
  image_key: string | null;
  image_alt: string | null;
  image_position: number | null;
}

const listingQuery = `
  SELECT
    l.code, l.slug, l.title, l.contract_type, l.property_type,
    l.municipality, l.zone, l.address, l.postal_code, l.price_cents,
    l.price_label, l.surface_sqm, l.rooms, l.bedrooms, l.bathrooms,
    l.floor, l.elevator, l.condition, l.energy_class, l.available_from,
    l.summary, l.description, l.features, l.highlights,
    i.object_key AS image_key, i.alt_text AS image_alt, i.position AS image_position
  FROM listings l
  LEFT JOIN listing_images i ON i.listing_id = l.id
  WHERE l.status = 'published'
  ORDER BY l.sort_order ASC, l.published_at DESC, i.position ASC
`;

const parseStringArray = (value: string) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

const mediaUrl = (request: Request, objectKey: string) => {
  const encodedKey = objectKey.split('/').map(encodeURIComponent).join('/');
  return new URL(`/media/${encodedKey}`, request.url).href;
};

export async function getListingsResponse(request: Request, database: ListingsDatabase) {
  try {
    const result = await database.prepare(listingQuery).all<ListingRow>();
    if (!result.success) throw new Error('D1 query failed');

    const listings = new Map<string, Record<string, unknown> & { images: string[] }>();
    for (const row of result.results) {
      let listing = listings.get(row.slug);
      if (!listing) {
        listing = {
          code: row.code,
          slug: row.slug,
          title: row.title,
          requestType: row.contract_type,
          propertyType: row.property_type,
          municipality: row.municipality,
          zone: row.zone,
          address: row.address,
          postalCode: row.postal_code,
          priceCents: row.price_cents,
          priceLabel: row.price_label || '',
          surfaceSqm: row.surface_sqm,
          rooms: row.rooms,
          bedrooms: row.bedrooms,
          bathrooms: row.bathrooms,
          floor: row.floor,
          elevator: row.elevator,
          condition: row.condition,
          energyClass: row.energy_class,
          availableFrom: row.available_from,
          summary: row.summary,
          description: row.description,
          features: parseStringArray(row.features),
          highlights: parseStringArray(row.highlights),
          images: [],
        };
        listings.set(row.slug, listing);
      }
      if (row.image_key) listing.images.push(mediaUrl(request, row.image_key));
    }

    return new Response(JSON.stringify({ listings: [...listings.values()] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return Response.json(
      { listings: [], message: 'Catalogo momentaneamente non disponibile.' },
      { status: 503, headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' } },
    );
  }
}

export async function getListingMediaResponse(request: Request, mediaStore: ListingsMediaStore, objectKey: string) {
  if (!objectKey || objectKey.includes('..')) return new Response('Not found', { status: 404 });

  const object = await mediaStore.getWithMetadata(objectKey, 'arrayBuffer');
  if (!object.value) return new Response('Not found', { status: 404 });

  const headers = new Headers({ 'Content-Type': object.metadata?.contentType || 'application/octet-stream' });
  if (object.metadata?.etag) headers.set('ETag', object.metadata.etag);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('X-Content-Type-Options', 'nosniff');

  if (object.metadata?.etag && request.headers.get('If-None-Match') === object.metadata.etag) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(object.value, { status: 200, headers });
}
