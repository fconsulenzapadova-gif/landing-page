import type { FeaturedListing } from '../content/site';

interface ApiListing {
  code: string;
  slug: string;
  title: string;
  requestType: 'vendita' | 'locazione';
  propertyType: string;
  municipality: string;
  zone: string;
  address: string;
  postalCode: string;
  priceCents: number | null;
  priceLabel: string;
  surfaceSqm: number | null;
  rooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: string;
  elevator: string;
  condition: string;
  energyClass: string;
  availableFrom: string;
  summary: string;
  description: string;
  features: string[];
  highlights: string[];
  images: string[];
}

interface ListingsResponse {
  listings?: ApiListing[];
}

const localEndpoint = 'http://127.0.0.1:8787/api/listings';
const productionEndpoint = 'https://gemut-leads-api.gemutcapital.workers.dev/api/listings';
const localHostnames = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

export function buildListingEndpoints(hostname: string, configuredEndpoint = '', leadsEndpoint = '') {
  const remoteEndpoint =
    configuredEndpoint.trim() ||
    leadsEndpoint.trim().replace(/\/api\/leads\/?$/, '/api/listings') ||
    productionEndpoint;

  return localHostnames.has(hostname) ? [localEndpoint, remoteEndpoint] : [remoteEndpoint];
}

function getListingsEndpoints() {
  return buildListingEndpoints(
    window.location.hostname,
    import.meta.env.VITE_LISTINGS_API_URL,
    import.meta.env.VITE_LEADS_API_URL,
  );
}

const formatPrice = (priceCents: number | null, customLabel: string, requestType: ApiListing['requestType']) => {
  if (customLabel) return customLabel;
  if (priceCents !== null) {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(priceCents / 100);
  }
  return requestType === 'vendita' ? 'Prezzo su richiesta' : 'Canone su richiesta';
};

const addNumericDetail = (details: string[], value: number | null, singular: string, plural: string) => {
  if (value !== null) details.push(`${value} ${value === 1 ? singular : plural}`);
};

export function mapApiListing(listing: ApiListing): FeaturedListing {
  const location = [listing.zone, listing.municipality].filter(Boolean).join(', ');
  const details: string[] = [];

  if (listing.propertyType) details.push(listing.propertyType);
  if (listing.surfaceSqm !== null) details.push(`${listing.surfaceSqm} m²`);
  addNumericDetail(details, listing.rooms, 'locale', 'locali');
  addNumericDetail(details, listing.bedrooms, 'camera', 'camere');
  addNumericDetail(details, listing.bathrooms, 'bagno', 'bagni');
  if (listing.floor) details.push(`Piano ${listing.floor}`);
  if (listing.elevator) details.push(`Ascensore: ${listing.elevator}`);
  if (listing.energyClass) details.push(`Classe energetica ${listing.energyClass}`);
  if (listing.availableFrom) details.push(`Disponibile dal ${listing.availableFrom}`);
  details.push(...listing.features);

  const fallbackImage = listing.requestType === 'vendita' ? '/images/piazza-vicina.webp' : '/images/sfondo-patrimoni.webp';
  const fallbackMobileImage = listing.requestType === 'vendita' ? '/images/piazza-vicina-mobile.jpg' : '/images/sfondo-patrimoni-mobile.jpg';
  const images = listing.images.length ? listing.images : [fallbackImage];

  return {
    code: listing.code,
    slug: listing.slug,
    title: listing.title,
    status: listing.requestType === 'vendita' ? 'In vendita' : 'In locazione',
    requestType: listing.requestType,
    propertyType: listing.propertyType,
    municipality: listing.municipality,
    zone: listing.zone,
    address: listing.address,
    postalCode: listing.postalCode,
    location,
    price: formatPrice(listing.priceCents, listing.priceLabel, listing.requestType),
    priceValue: listing.priceCents === null ? undefined : listing.priceCents / 100,
    surface: listing.surfaceSqm?.toString(),
    rooms: listing.rooms?.toString(),
    bedrooms: listing.bedrooms?.toString(),
    bathrooms: listing.bathrooms?.toString(),
    floor: listing.floor,
    elevator: listing.elevator,
    condition: listing.condition,
    energyClass: listing.energyClass,
    availableFrom: listing.availableFrom,
    image: images[0],
    mobileImage: listing.images[0] || fallbackMobileImage,
    images,
    imageAlt: `${listing.title}${listing.municipality ? ` a ${listing.municipality}` : ''}`,
    summary: listing.summary,
    description: listing.description || listing.summary,
    details: details.length ? details : [listing.propertyType || 'Immobile'],
    highlights: listing.highlights.length ? listing.highlights : listing.features,
  };
}

let listingsRequest: Promise<FeaturedListing[]> | null = null;

export async function loadListings() {
  if (listingsRequest) return listingsRequest;

  listingsRequest = (async () => {
    for (const endpoint of getListingsEndpoints()) {
      try {
        const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
        if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
          throw new Error(`Catalogo immobili non disponibile (${response.status})`);
        }
        const payload = (await response.json()) as ListingsResponse;
        return (payload.listings ?? []).map(mapApiListing);
      } catch {
        // Local development can fall back to the public read-only catalog.
      }
    }
    return [];
  })();

  return listingsRequest;
}
