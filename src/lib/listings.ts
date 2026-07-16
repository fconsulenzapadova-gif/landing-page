import type { FeaturedListing } from '../content/site';

export const LISTINGS_SHEET_ID = '15gP-IIWheuid1GCGGRMJk5vysmq3Oa3rIhVT8ndD5eg';
export const LISTINGS_SHEET_GID = '0';
export const LISTINGS_SHEET_URL = `https://docs.google.com/spreadsheets/d/${LISTINGS_SHEET_ID}/export?format=csv&gid=${LISTINGS_SHEET_GID}`;

interface ParsedSheet {
  listings: FeaturedListing[];
  hasDataRows: boolean;
}

interface DriveImagesResponse {
  images?: Array<{ id: string; name: string; url: string }>;
}

const normalizeHeader = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\*/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

const normalizeValue = (value: string | undefined) => value?.trim() ?? '';

const isYes = (value: string) => ['si', 'sì', 'yes', 'true', '1'].includes(value.trim().toLowerCase());

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const splitList = (value: string) =>
  value
    .split(/\r?\n|\|/)
    .map((item) => item.trim())
    .filter(Boolean);

export function parseCsv(input: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (character === '"') {
      if (quoted && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (character === ',' && !quoted) {
      row.push(field);
      field = '';
      continue;
    }

    if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && input[index + 1] === '\n') index += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      continue;
    }

    field += character;
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

const parseItalianNumber = (value: string) => {
  const normalized = value.replace(/\s/g, '').replace(/[€]/g, '');
  if (!normalized) return undefined;

  const machineValue = normalized.includes(',')
    ? normalized.replace(/\./g, '').replace(',', '.')
    : /^\d{1,3}(?:\.\d{3})+$/.test(normalized)
      ? normalized.replace(/\./g, '')
      : normalized;
  const parsed = Number(machineValue);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const formatPrice = (numericValue: number | undefined, customText: string, requestType: 'vendita' | 'locazione') => {
  if (customText) return customText;
  if (numericValue !== undefined) {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(numericValue);
  }
  return requestType === 'vendita' ? 'Prezzo su richiesta' : 'Canone su richiesta';
};

const buildLocation = (zone: string, municipality: string) =>
  [zone, municipality].filter(Boolean).join(', ') || municipality || zone;

const addDetail = (details: string[], value: string, suffix: string) => {
  if (value) details.push(`${value}${suffix}`);
};

export function parseListingsSheet(csv: string): ParsedSheet {
  const rows = parseCsv(csv).filter((row) => row.some((cell) => cell.trim()));
  if (rows.length < 2) return { listings: [], hasDataRows: false };

  const headers = rows[0].map(normalizeHeader);
  const dataRows = rows.slice(1).filter((row) => row.some((cell) => cell.trim()));
  const seenSlugs = new Set<string>();

  const listings = dataRows
    .map<FeaturedListing | null>((row, rowIndex) => {
      const values = new Map(headers.map((header, columnIndex) => [header, normalizeValue(row[columnIndex])]));
      const get = (...names: string[]) => {
        for (const name of names) {
          const value = values.get(normalizeHeader(name));
          if (value) return value;
        }
        return '';
      };

      if (!isYes(get('Pubblica'))) return null;

      const contract = get('Contratto').toLowerCase();
      const requestType = contract.startsWith('loc') ? 'locazione' : contract.startsWith('vend') ? 'vendita' : null;
      const title = get('Titolo');
      if (!requestType || !title) return null;

      const code = get('Codice immobile', 'Codice', 'Riferimento') || `RIGA-${rowIndex + 2}`;
      const slug = slugify(get('Slug URL', 'Slug') || code || title);
      if (!slug || seenSlugs.has(slug)) return null;
      seenSlugs.add(slug);

      const municipality = get('Comune');
      const zone = get('Zona');
      const propertyType = get('Tipologia');
      const surface = get('Superficie mq', 'Superficie');
      const rooms = get('Locali');
      const bedrooms = get('Camere');
      const bathrooms = get('Bagni');
      const floor = get('Piano');
      const elevator = get('Ascensore');
      const condition = get('Stato immobile');
      const energyClass = get('Classe energetica');
      const availableFrom = get('Disponibile dal');
      const features = splitList(get('Caratteristiche'));
      const highlights = splitList(get('Punti di forza'));
      const defaultImage =
        requestType === 'vendita' ? '/images/piazza-vicina.webp' : '/images/sfondo-patrimoni.webp';
      const defaultMobileImage =
        requestType === 'vendita' ? '/images/piazza-vicina-mobile.jpg' : '/images/sfondo-patrimoni-mobile.jpg';
      const details: string[] = [];

      if (propertyType) details.push(propertyType);
      addDetail(details, surface, ' m²');
      addDetail(details, rooms, Number(rooms) === 1 ? ' locale' : ' locali');
      addDetail(details, bedrooms, Number(bedrooms) === 1 ? ' camera' : ' camere');
      addDetail(details, bathrooms, Number(bathrooms) === 1 ? ' bagno' : ' bagni');
      if (floor) details.push(`Piano ${floor}`);
      if (elevator) details.push(`Ascensore: ${elevator}`);
      if (energyClass) details.push(`Classe energetica ${energyClass}`);
      if (availableFrom) details.push(`Disponibile dal ${availableFrom}`);
      details.push(...features);

      const priceValue = parseItalianNumber(get('Prezzo EUR', 'Prezzo'));
      const summary = get('Descrizione breve');

      return {
        code,
        slug,
        title,
        status: requestType === 'vendita' ? 'In vendita' : 'In locazione',
        requestType,
        propertyType,
        municipality,
        zone,
        address: get('Indirizzo'),
        postalCode: get('CAP'),
        location: buildLocation(zone, municipality),
        price: formatPrice(priceValue, get('Testo prezzo'), requestType),
        priceValue,
        surface,
        rooms,
        bedrooms,
        bathrooms,
        floor,
        elevator,
        condition,
        energyClass,
        availableFrom,
        image: defaultImage,
        mobileImage: defaultMobileImage,
        images: [defaultImage],
        imageFolderUrl: get('Link cartella immagini', 'Cartella immagini'),
        imageAlt: `${title}${municipality ? ` a ${municipality}` : ''}`,
        summary: summary || get('Descrizione completa') || `${propertyType || 'Immobile'} ${requestType === 'vendita' ? 'in vendita' : 'in locazione'}${municipality ? ` a ${municipality}` : ''}.`,
        description: get('Descrizione completa') || summary,
        details: details.length ? details : [propertyType || 'Immobile'],
        highlights: highlights.length ? highlights : features,
      };
    })
    .filter((listing): listing is FeaturedListing => listing !== null);

  return { listings, hasDataRows: dataRows.length > 0 };
}

const loadPublicFolderImages = async (folderUrl: string) => {
  if (!folderUrl) return [];

  try {
    const response = await fetch(`/api/drive-images?folder=${encodeURIComponent(folderUrl)}`);
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) return [];
    const payload = (await response.json()) as DriveImagesResponse;
    return payload.images?.map((image) => image.url).filter(Boolean) ?? [];
  } catch {
    return [];
  }
};

const resolveListingImages = async (listing: FeaturedListing) => {
  const folderImages = await loadPublicFolderImages(listing.imageFolderUrl);
  if (!folderImages.length) return listing;

  return {
    ...listing,
    image: folderImages[0],
    mobileImage: folderImages[0],
    images: folderImages,
  };
};

let listingsRequest: Promise<FeaturedListing[]> | null = null;

export async function loadListings() {
  if (listingsRequest) return listingsRequest;

  listingsRequest = fetch(LISTINGS_SHEET_URL, { cache: 'no-store' })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Google Sheet non disponibile (${response.status})`);
      const parsed = parseListingsSheet(await response.text());
      if (!parsed.listings.length) return [];
      return Promise.all(parsed.listings.map(resolveListingImages));
    })
    .catch(() => []);

  return listingsRequest;
}
