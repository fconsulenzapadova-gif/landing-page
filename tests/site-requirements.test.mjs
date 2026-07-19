import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

function relativeLuminance(hex) {
  const channels = hex.match(/[a-f\d]{2}/gi).map((channel) => Number.parseInt(channel, 16) / 255);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
}

test('runtime uses a public-only app shell without CRM auth providers', () => {
  const app = read('src/LandingApp.tsx');
  const layout = read('src/components/AppLayout.tsx');

  assert.match(app, /BrowserRouter/);
  assert.match(app, /ScrollToTop/);
  assert.match(layout, /<Navigation \/>/);
  assert.match(layout, /<Footer \/>/);
  assert.match(layout, /<CookieConsent \/>/);
  assert.doesNotMatch(app, /AuthProvider|QueryClientProvider/);
});

test('public routes and legacy redirects are explicit', () => {
  const app = read('src/LandingApp.tsx');

  [
    'richieste',
    'prenotazione',
    'privacy',
    'acquisto-casa',
    'vendita-immobili',
    'locazioni',
    'valutazione-patrimonio',
    'immobili',
    'immobili/:slug',
    'servizi',
  ].forEach((route) => assert.match(app, new RegExp(route)));

  ['/accesso-clienti', '/dashboard', '/crm/*', '/login', '/auth'].forEach((route) => {
    assert.match(app, new RegExp(route.replaceAll('/', '\\/').replace('*', '\\*')));
  });
  assert.doesNotMatch(app, /localhost:8081/);
  assert.doesNotMatch(app, /servizi-personalizzati|verifica-stato-tetto|dettaglio-verifica-tetto/);
});

test('site content is centralized and keeps company details', () => {
  const site = read('src/content/site.ts');

  [
    'Gemüt Capital',
    'Gemüt Capital SRL',
    '379 260 6775',
    'info@gemutcapital.com',
    '05791060287',
    'PD - 492863',
    'gemutcapital@pec.it',
    'FeaturedListing',
  ].forEach((text) => assert.match(site, new RegExp(text)));

  assert.doesNotMatch(site, /DEMO-\d|fallbackListings|Placeholder per una scheda/);
});

test('main navigation exposes only home, listings and services', () => {
  const site = read('src/content/site.ts');
  const navigation = read('src/components/Navigation.tsx');
  const listingsPage = read('src/pages/ListingsPage.tsx');
  const servicesPage = read('src/pages/ServicesPage.tsx');

  assert.match(site, /navigationLinks/);
  assert.match(site, /\{ label: 'Home', to: '\/' \}/);
  assert.match(site, /\{ label: 'Immobili', to: '\/immobili' \}/);
  assert.match(site, /\{ label: 'Servizi', to: '\/servizi' \}/);
  assert.match(site, /serviceNavigationLinks/);
  assert.match(site, /\{ label: 'Vendita immobili', to: '\/vendita-immobili' \}/);
  assert.match(site, /\{ label: 'Locazioni', to: '\/locazioni' \}/);
  assert.match(site, /\{ label: 'Valutazione patrimonio', to: '\/valutazione-patrimonio' \}/);
  assert.doesNotMatch(site.slice(site.indexOf('navigationLinks'), site.indexOf('serviceNavigationLinks')), /Acquisto casa|Vendita immobili|Locazioni|Valutazione patrimonio/);
  assert.match(navigation, /navigationLinks/);
  assert.match(navigation, /serviceNavigationLinks/);
  assert.match(navigation, /group-hover:visible/);
  assert.match(navigation, /group-focus-within:visible/);
  assert.match(navigation, /aria-controls="mobile-service-navigation"/);
  assert.match(navigation, /max-width: 639px/);
  assert.match(navigation, /currentTarget\.blur\(\)/);
  assert.match(navigation, /onClick=\{closeServiceNavigation\}/);
  assert.match(listingsPage, /Immobili disponibili/);
  assert.match(listingsPage, /<h1 data-animate/);
  assert.doesNotMatch(listingsPage, /<PageHero|PageHero from/);
  assert.match(listingsPage, /In vendita/);
  assert.match(listingsPage, /In locazione/);
  assert.match(servicesPage, /Come vendiamo gli immobili/);
  assert.match(servicesPage, /Come diamo in locazione gli immobili/);
  assert.match(servicesPage, /Valutazione del patrimonio immobiliare/);
  assert.match(servicesPage, /detailPath=\{sale\.route\}/);
  assert.match(servicesPage, /detailPath=\{rental\.route\}/);
  assert.match(servicesPage, /detailPath=\{valuation\.route\}/);
  assert.doesNotMatch(servicesPage, /<PageHero|Come lavoriamo|service\.steps|service\.highlights/);
});

test('public listings come from the Cloudflare D1 and KV API', () => {
  const listings = read('src/lib/listings.ts');
  const hook = read('src/lib/useListings.ts');
  const listingsPage = read('src/pages/ListingsPage.tsx');
  const servicePage = read('src/pages/ServicePage.tsx');
  const listingPage = read('src/pages/ListingPage.tsx');
  const viteConfig = read('vite.config.ts');
  const worker = read('cloudflare/src/index.ts');
  const wrangler = read('cloudflare/wrangler.jsonc');
  const migration = read('cloudflare/migrations/0004_create_listings.sql');

  assert.match(listings, /VITE_LISTINGS_API_URL/);
  assert.match(listings, /\/api\/listings/);
  assert.match(listings, /mapApiListing/);
  assert.match(hook, /loadListings/);
  assert.match(worker, /getListingsResponse/);
  assert.match(worker, /getListingMediaResponse/);
  assert.match(wrangler, /"kv_namespaces"/);
  assert.match(wrangler, /"binding": "LISTING_MEDIA"/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS listings/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS listing_images/);
  assert.doesNotMatch(listings, /google|sheet|drive/i);
  assert.doesNotMatch(viteConfig, /drive-images|driveImages/i);
  assert.match(listingsPage, /usePageAnimations\(pageRef, \[listings\.length\]\)/);
  assert.match(listingPage, /function ListingDetails[\s\S]*?usePageAnimations\(pageRef\)/);
  assert.match(listingPage, /return <ListingDetails listing=\{listing\} \/>/);
  assert.doesNotMatch(servicePage, /useListings|ListingCard|Immobili in vendita|Immobili in locazione/);
});

test('listing API rows map to the public card contract', async () => {
  const { buildListingEndpoints, mapApiListing } = await import('../src/lib/listings.ts');
  const listing = mapApiListing({
    code: 'DEMO-001', slug: 'demo-padova', title: 'Demo Padova', requestType: 'vendita',
    propertyType: 'Appartamento', municipality: 'Padova', zone: 'Centro', address: '', postalCode: '35100',
    priceCents: 32500000, priceLabel: '', surfaceSqm: 110, rooms: 4, bedrooms: 2, bathrooms: 2,
    floor: '2', elevator: 'Sì', condition: 'Ottimo', energyClass: 'A2', availableFrom: 'Subito',
    summary: 'Scheda dimostrativa', description: 'Descrizione dimostrativa',
    features: ['Terrazzo'], highlights: ['Centro'], images: ['https://worker.test/media/demo/cover.webp'],
  });

  assert.equal(listing.slug, 'demo-padova');
  assert.equal(listing.status, 'In vendita');
  assert.equal(listing.priceValue, 325000);
  assert.match(listing.price, /325[.\s]000/);
  assert.equal(listing.image, 'https://worker.test/media/demo/cover.webp');
  assert.deepEqual(listing.images, ['https://worker.test/media/demo/cover.webp']);
  assert.ok(listing.details.includes('110 m²'));

  assert.deepEqual(buildListingEndpoints('localhost'), [
    'http://127.0.0.1:8787/api/listings',
    'https://gemut-leads-api.gemutcapital.workers.dev/api/listings',
  ]);
  assert.deepEqual(buildListingEndpoints('www.gemutcapital.com'), [
    'https://gemut-leads-api.gemutcapital.workers.dev/api/listings',
  ]);
});

test('lead form uses the Cloudflare API without Supabase or external CRM', () => {
  const leads = read('src/lib/leads.ts');
  const requests = read('src/pages/RequestsPage.tsx');
  const flow = read('src/lib/requestWizardFlow.ts');
  const contact = read('src/components/request/ContactStep.tsx');
  const turnstile = read('src/components/Turnstile.tsx');
  const worker = read('cloudflare/src/index.ts');
  const notification = read('cloudflare/src/notification.ts');
  const wrangler = read('cloudflare/wrangler.jsonc');
  const migration = read('cloudflare/migrations/0001_create_lead_submissions.sql');

  assert.match(leads, /VITE_LEADS_API_URL/);
  assert.match(leads, /localHostnames\.has\(window\.location\.hostname\).*localEndpoint/);
  assert.match(turnstile, /1x00000000000000000000BB/);
  assert.doesNotMatch(turnstile, /1x00000000000000000000AA/);
  assert.match(turnstile, /appearance: 'interaction-only'/);
  assert.doesNotMatch(turnstile, /min-h-\[65px\]/);
  assert.match(worker, /INSERT OR IGNORE INTO lead_submissions/);
  assert.match(worker, /TURNSTILE_SECRET_KEY/);
  assert.match(worker, /sendLeadNotification/);
  assert.match(notification, /replyTo/);
  assert.doesNotMatch(wrangler, /"send_email"/);
  assert.match(notification, /gmail\.googleapis\.com\/gmail\/v1\/users\/me\/messages\/send/);
  assert.match(worker, /GMAIL_REFRESH_TOKEN/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS lead_submissions/);
  assert.match(requests, /useSearchParams/);
  assert.match(flow, /requestType/);
  assert.match(requests, /stepLabels/);
  assert.match(contact, /<Turnstile/);
  assert.doesNotMatch(leads, /supabase|crm-pro-five|google/i);
});

test('successful request shows an accessible animated confirmation', () => {
  const requests = read('src/pages/RequestsPage.tsx');
  const successPath = new URL('../src/components/RequestSuccess.tsx', import.meta.url);

  assert.equal(existsSync(successPath), true, 'RequestSuccess.tsx must exist');
  const success = read('src/components/RequestSuccess.tsx');

  assert.match(requests, /<RequestSuccess onReset=\{resetForm\} \/>/);
  assert.match(requests, /<div ref=\{pageRef\}>\s*<RequestSuccess onReset=\{resetForm\} \/>\s*<\/div>/);
  assert.match(success, /Grazie!/);
  assert.match(success, /Richiesta ricevuta\. Ti contatteremo entro un giorno lavorativo\./);
  assert.match(success, /role="status"/);
  assert.match(success, /aria-live="polite"/);
  assert.match(success, /useLayoutEffect/);
  assert.match(success, /sceneRef\.current\?\.scrollIntoView\(\{ behavior: 'auto', block: 'start' \}\)/);
  assert.match(success, /headingRef\.current\?\.focus\(\)/);
  assert.match(success, /onComplete: \(\) => headingRef\.current\?\.focus\(\)/);
  assert.match(success, /useGSAP/);
  assert.match(success, /prefers-reduced-motion: reduce/);
  assert.match(success, /strokeDashoffset/);
});

test('starting a new request remounts a visible form', () => {
  const requests = read('src/pages/RequestsPage.tsx');

  assert.match(requests, /const resetForm = \(\) => \{[\s\S]*?setWizard\(resetRequestWizard\(initialIntent\)\);[\s\S]*?setStatus\('idle'\);/);
  assert.doesNotMatch(requests, /<form[^>]*\sdata-animate(?:=|\s|>)/);
});

test('request form has no introductory header section', () => {
  const requests = read('src/pages/RequestsPage.tsx');

  assert.doesNotMatch(requests, /<header[\s\S]*?<\/header>/);
  assert.doesNotMatch(requests, /Raccontaci cosa ti serve\./);
});

test('guided request controls expose four intents and progressive inputs', () => {
  const intent = read('src/components/request/RequestIntentSelector.tsx');
  const property = read('src/components/request/PropertyDetailsStep.tsx');
  const contact = read('src/components/request/ContactStep.tsx');
  const progress = read('src/components/request/WizardProgress.tsx');
  assert.match(intent, /role="radiogroup"/);
  assert.match(intent, /overflow-y-auto/);
  assert.match(progress, /circa 1 minuto/);
  assert.match(progress, /screen === 0/);
  assert.match(progress, /'Consenso'/);
  assert.match(property, /propertyTypes\.map/);
  assert.doesNotMatch(property, /Building2/);
  assert.doesNotMatch(contact, /UserRound/);
  assert.match(property, /request-screen-scroll/);
  assert.match(property, /form\.requestRole === 'proprietario' \? '' : 'items-center'/);
  assert.ok((property.match(/request-screen-scroll/g) ?? []).length >= 4);
  assert.ok((contact.match(/request-screen-scroll/g) ?? []).length >= 2);
  assert.match(property, /id="budget-minimum"/);
  assert.match(property, /id="budget-maximum"/);
  assert.match(property, /formatBudgetRange/);
  assert.doesNotMatch(property, /Altro importo/);
  assert.match(property, /timeframeOptions\.map/);
  assert.match(property, /flex flex-wrap justify-center gap-2/);
  assert.match(property, />\s*Altro periodo\s*</);
  assert.doesNotMatch(property, /showDetails|Aggiungi dettagli|Nascondi dettagli/);
  assert.match(contact, /contactPreference/);
  assert.match(contact, /form\.contactPreference === 'email'/);
  assert.match(contact, /Aggiungi anche/);
  assert.match(contact, /required: required/);
  assert.match(contact, /'aria-required': required/);
  assert.match(contact, /id="privacyAccepted"[\s\S]*?required[\s\S]*?aria-required=\{true\}/);
  assert.match(contact, /id="notes-panel"/);
  assert.doesNotMatch(contact, /showNotes|Aggiungi note|Nascondi note/);
});

test('request page composes the adaptive wizard and submits geometry', () => {
  const requests = read('src/pages/RequestsPage.tsx');
  const intent = read('src/components/request/RequestIntentSelector.tsx');
  const contact = read('src/components/request/ContactStep.tsx');
  const layout = read('src/components/AppLayout.tsx');

  assert.match(requests, /<RequestIntentSelector/);
  assert.match(requests, /<PropertyDetailsStep/);
  assert.match(requests, /<ContactStep/);
  assert.match(requests, /onMapUnavailable/);
  assert.match(requests, /selectRequestIntent/);
  assert.match(requests, /advanceRequestWizard/);
  assert.match(requests, /buildLeadRequestPayload/);
  assert.match(requests, /normalizeLeadFieldErrors/);
  assert.match(requests, /apiErrorSummary/);
  assert.match(requests, /loadPersistedRequestWizard\(window\.localStorage, initialIntent\)/);
  assert.match(requests, /savePersistedRequestWizard\(window\.localStorage, \{ wizard, progressScreen \}\)/);
  assert.match(requests, /clearPersistedRequestWizard\(window\.localStorage\)/);
  assert.match(requests, /initialScreen=\{detailsScreenByProgress\[progressScreen\]\}/);
  assert.match(requests, /initialScreen=\{contactScreenByProgress\[progressScreen\]\}/);
  assert.match(requests, /role=\{status === 'error' \? 'alert' : 'status'\}/);
  assert.match(intent, /getNextIntentIndex/);
  assert.match(requests, /h-\[calc\(100svh-4rem-1px\)\].*overflow-hidden/);
  assert.match(layout, /const isRequestWizard = location\.pathname === '\/richieste'/);
  assert.match(layout, /\{!isRequestWizard && <Footer \/>\}/);
  assert.match(contact, /id="notes"/);
  assert.match(contact, /value=\{form\.notes\}/);
  assert.match(contact, /updateField\('notes', event\.target\.value\)/);
  assert.match(contact, /aria-invalid=\{Boolean\(errors\.notes\)\}/);
  assert.match(contact, /id="notes-error"/);
});

test('request polygon map is free, lazy, branded and accessible', () => {
  const pkg = read('package.json');
  const map = read('src/components/request/LocationPolygonMap.tsx');
  const css = read('src/index.css');
  assert.match(pkg, /"maplibre-gl": "5\.24\.0"/);
  assert.doesNotMatch(pkg, /@mapbox\/mapbox-gl-draw/);
  assert.match(map, /https:\/\/tiles\.openfreemap\.org\/styles\/positron/);
  assert.match(map, /attributionControl: \{ compact: true \}/);
  assert.match(map, /aria-label="Annulla ultimo punto"/);
  assert.match(map, /aria-label="Ricomincia"/);
  assert.match(map, /Undo2/);
  assert.match(map, /RotateCcw/);
  assert.doesNotMatch(map, /Conferma area/);
  assert.doesNotMatch(map, /OpenFreeMap/);
  assert.match(map, /onUnavailable/);
  assert.match(map, /map\.on\('click', handleMapClick\)/);
  assert.match(map, /polygonFromPoints/);
  assert.match(map, /pointsFromPolygon/);
  assert.doesNotMatch(map, /direct_select|simple_select|MapboxDraw/);
  assert.doesNotMatch(map, /access_token|apiKey|geolocation|getCurrentPosition/);
  assert.match(css, /\.request-location-map/);
  assert.match(css, /\.request-location-map\s*\{[\s\S]*?height:\s*100%/);
  assert.match(css, /--brand-blue/);
  assert.match(css, /\.request-location-map \.maplibregl-canvas:focus-visible/);
  assert.doesNotMatch(css, /\.request-location-map \.maplibregl-canvas\s*\{\s*outline:\s*none/);
  assert.match(css, /\.request-location-map[\s\S]*?cursor:\s*crosshair/);
});

test('request wizard keeps content reachable on small mobile screens', () => {
  const requests = read('src/pages/RequestsPage.tsx');
  const intent = read('src/components/request/RequestIntentSelector.tsx');
  const property = read('src/components/request/PropertyDetailsStep.tsx');
  const contact = read('src/components/request/ContactStep.tsx');

  assert.match(requests, /px-2 py-2 sm:px-6 sm:py-8/);
  assert.match(requests, /p-3 sm:p-8/);
  assert.match(intent, /overflow-y-auto/);
  assert.match(intent, /request-screen-center/);
  assert.match(intent, /request-intent-card[^\n]*min-h-36/);
  assert.match(property, /request-screen-scroll/);
  assert.match(property, /request-screen-center/);
  assert.match(contact, /request-screen-scroll/);
  assert.match(contact, /request-screen-center/);
  assert.match(intent, /text-4xl.*sm:text-5xl/);
  assert.match(property, /shrink-0.*border-t/);
  assert.match(contact, /shrink-0.*border-t/);
});

test('location selector opens the map directly for seekers and keeps address input for owners', () => {
  const selector = read('src/components/request/LocationSelector.tsx');
  const map = read('src/components/request/LocationPolygonMap.tsx');
  const addressPreview = read('src/components/request/AddressMapPreview.tsx');
  const boundary = read('src/components/request/LocationMapErrorBoundary.ts');

  assert.match(selector, /if \(!canSelectArea \|\| mode === 'text'\)/);
  assert.match(selector, /<LocationPolygonMap/);
  assert.match(selector, /lazy\(\(\) => loadLocationMapModule\(/);
  assert.doesNotMatch(selector, /import LocationPolygonMap from/);
  assert.match(boundary, /class LocationMapErrorBoundary extends Component/);
  assert.match(boundary, /static getDerivedStateFromError/);
  assert.match(boundary, /componentDidCatch\(/);
  assert.match(selector, /createLocationSelectorLifecycle/);
  assert.match(selector, /<LocationMapErrorBoundary/);
  assert.match(selector, /draftValue=\{locationLifecycle\.getDraft\(\)\}/);
  assert.match(selector, /onDraftChange=\{handlePolygonDraftChange\}/);
  assert.match(selector, /polygonDraftValue/);
  assert.match(selector, /onPolygonDraftChange/);
  assert.match(map, /draftValue\?: LocationPolygon \| null/);
  assert.match(map, /onDraftChange\?: \(value: LocationPolygon \| null\) => void/);
  assert.match(map, /onDraftChangeRef\.current\?\.\(polygon\)/);
  assert.doesNotMatch(selector, /Dove stai cercando\?/);
  assert.doesNotMatch(selector, /role="tablist"/);
  assert.doesNotMatch(selector, /Seleziona sulla mappa/);
  assert.match(selector, /locationLifecycle\.handleMapUnavailable\(message\)/);
  assert.match(selector, /const canSelectArea = requestRole === 'cerca'/);
  assert.match(selector, /!canSelectArea \|\| mode === 'text'/);
  assert.match(selector, /'Indirizzo dell’immobile'/);
  assert.match(selector, /autoComplete=\{requestRole === 'proprietario' \? 'street-address' : 'off'\}/);
  assert.match(selector, /\{canSelectArea && \([\s\S]*?aria-label="Zone suggerite"/);
  assert.match(selector, /VITE_GEOAPIFY_API_KEY/);
  assert.match(selector, /https:\/\/api\.geoapify\.com\/v1\/geocode\/autocomplete/);
  assert.match(selector, /new AbortController\(\)/);
  assert.match(selector, /aria-label="Suggerimenti indirizzo"/);
  assert.match(selector, /aria-autocomplete=\{isOwner \? 'list' : undefined\}/);
  assert.match(selector, /<MapPin/);
  assert.match(selector, /absolute left-0 right-0 top-full z-20/);
  assert.match(selector, /<AddressMapPreview/);
  assert.match(addressPreview, /interactive: true/);
  assert.match(addressPreview, /new maplibregl\.Marker/);
  assert.match(addressPreview, /map\.flyTo/);
  assert.match(addressPreview, /api\.geoapify\.com\/v1\/geocode\/reverse/);
  assert.match(addressPreview, /map\.on\('click', handleMapClick\)/);
  assert.match(selector, /selectAddressFromMap/);
});

test('required image assets exist and are used', () => {
  const sources = [
    read('src/pages/HomePage.tsx'),
    read('src/pages/ServicePage.tsx'),
    read('src/pages/SpecialistPage.tsx'),
    read('src/pages/RequestsPage.tsx'),
    read('src/pages/ListingPage.tsx'),
    read('src/content/site.ts'),
    read('src/lib/listings.ts'),
  ].join('\n');
  const imageRefs = [...sources.matchAll(/\/images\/[^'")\s]+\.(?:webp|jpg)/g)].map((match) => match[0]);

  [
    '/images/Home.webp',
    '/images/Home-mobile.jpg',
    '/images/piazza-vicina.webp',
    '/images/piazza-vicina-mobile.jpg',
    '/images/prato-padova.webp',
    '/images/profile.webp',
    '/images/sfondo-patrimoni.webp',
    '/images/sfondo-patrimoni-mobile.jpg',
  ].forEach((path) => assert.ok(imageRefs.includes(path), `${path} must be used`));

  [...new Set(imageRefs)].forEach((path) => {
    const filePath = `public${path}`;
    const url = new URL(`../${filePath}`, import.meta.url);
    assert.equal(existsSync(url), true, filePath);
    assert.ok(statSync(url).size < 2_500_000, `${filePath} must stay below 2.5 MB`);
  });

  assert.doesNotMatch(sources, /UAV|drone|tetto-uav|verifica-stato-tetto|servizi-personalizzati|customServices/);
  assert.doesNotMatch(sources, /-optimized\.jpg|\.(?:jpeg|png|JPG|PNG)/);

  [
    'public/prato-padova-optimized.jpg',
    'public/foto-cortina-optimized.jpg',
    'public/sfondo-patrimoni-optimized.jpg',
    'public/sfondo-locazioni-optimized.jpg',
    'public/profile-optimized.jpg',
    'public/tetto-uav-optimized.jpg',
    'public/strada-verde-optimized.jpg',
    'public/dji_fly_20250917_193124_297_1758130816590_photo.JPG',
    'public/strada-verde.JPG',
    'public/Sfondo locazioni.JPG',
    'public/foto-cortina.JPG',
    'public/padova-test.jpg',
    'public/piazza-vicina.JPG',
    'public/prato-padova.jpg',
    'public/profile.jpg',
    'public/sfondo-patrimoni.jpg',
    'public/Tavola da disegno 1.png',
  ].forEach((path) => {
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), false, path);
  });
});

test('design system assets and GSAP motion are wired', () => {
  const pkg = read('package.json');
  const css = read('src/index.css');
  const motion = read('src/lib/usePageAnimations.ts');
  const home = read('src/pages/HomePage.tsx');
  const nav = read('src/components/Navigation.tsx');
  const listing = read('src/pages/ListingPage.tsx');
  const listingGallery = read('src/components/ListingGallery.tsx');
  const brandLogo = read('public/design-system/logo/logo-blue.svg');
  const favicon = read('public/favicon.svg');

  assert.match(pkg, /"gsap"/);
  assert.match(pkg, /"@gsap\/react"/);
  assert.match(css, /--brand-blue: #b3e5fc/);
  assert.match(css, /--paper-deep: #77736c/);
  assert.match(css, /--graphite: #666861/);
  assert.match(css, /--paper: #ece9e2/);
  assert.match(css, /--paper-soft: #f7f5ef/);
  assert.doesNotMatch(css, /--brand-blue-(?:hover|strong)|#81d4fa|#0277bd/);
  assert.ok(contrastRatio('#12130f', '#b3e5fc') >= 4.5);
  assert.ok(contrastRatio('#666861', '#ece9e2') >= 4.5);
  assert.ok(contrastRatio('#666861', '#f7f5ef') >= 4.5);
  assert.match(brandLogo, /fill: #b3e5fc/);
  assert.match(favicon, /fill="#b3e5fc"/);
  assert.match(css, /DeFontePlus-Leger\.woff2/);
  assert.match(css, /Minion Variable Concept/);
  assert.match(css, /\.scrollbar-hidden::-webkit-scrollbar/);
  assert.match(css, /scrollbar-width: none/);
  assert.match(motion, /useGSAP/);
  assert.match(motion, /ScrollTrigger/);
  assert.match(motion, /prefers-reduced-motion/);
  assert.match(home, /usePageAnimations/);
  assert.match(home, /Casa nuova, stesso/);
  assert.match(home, /GEMÜT/);
  assert.match(home, /\/images\/Home\.webp/);
  assert.match(home, /gsap\.fromTo/);
  assert.match(home, /gsap\.matchMedia/);
  assert.match(home, /prefers-reduced-motion/);
  assert.match(home, /no-preference/);
  assert.match(home, /clearProps: 'opacity,visibility,transform'/);
  assert.doesNotMatch(home, /stagger: \{ amount: 0\.08, from: 'end' \}/);
  assert.match(home, /ScrollTrigger/);
  assert.match(home, /data-curve-swipe/);
  assert.match(home, /data-curve-path/);
  assert.match(home, /home-curve-swipe/);
  assert.match(home, /featured-listings-gallery/);
  assert.match(home, /data-listings-backdrop/);
  assert.match(home, /data-listings-track/);
  assert.match(home, /data-listing-card/);
  assert.match(home, /aria-label="Immobili disponibili"/);
  assert.match(home, /data-listings-viewport className="[^"]*scrollbar-hidden/);
  assert.match(home, /self\.progress >= 0\.98/);
  assert.match(home, /galleryStartDelay/);
  assert.match(home, /getStartX/);
  assert.match(home, /\(viewport\.clientWidth - firstCard\.offsetWidth\) \/ 2/);
  assert.match(home, /x: \(\) => getStartX\(\)/);
  assert.match(home, /x: \(\) => -getDistance\(\)/);
  assert.match(home, /touch: '\(any-pointer: coarse\)'/);
  assert.match(home, /if \(reduceMotion \|\| touch\)/);
  assert.match(home, /listingsRevealTarget/);
  assert.match(home, /pinSpacing: false/);
  assert.match(home, /top\+=\$\{galleryStartDelay\(\)\} top/);
  assert.match(home, /margin-top:-100svh/);
  assert.match(home, /min-h-\[260svh\]/);
  assert.match(home, /home-listings-section/);
  assert.match(css, /@media \(any-pointer: coarse\)[\s\S]*\.home-listings-section[\s\S]*min-height: calc\(100svh \+ max\(62svh, 380px\)\)/);
  assert.doesNotMatch(home, /ref=\{heroRef\} className="section-line/);
  assert.doesNotMatch(home, /ref=\{listingsRef\} className="section-line/);
  assert.match(home, /\) : null\}\s+<Section className="bg-\[var\(--paper-soft\)\]">/);
  assert.doesNotMatch(home, /Servizi principali|data-service-reveal|servicesSectionRef|home-services-bidirectional/);
  assert.match(home, /ease: 'none'/);
  assert.doesNotMatch(home, /fromTo\(\s*cards/);
  assert.doesNotMatch(home, /data-listings-track[^\n]+mx-auto/);
  assert.doesNotMatch(home, /Case attualmente in vendita e locazione|Schede placeholder per mostrare il flusso|featured-listings-title/);
  assert.doesNotMatch(home, /id: 'featured-listings-gallery'[\s\S]{0,260}pin: true/);
  assert.match(home, /pin: true/);
  assert.match(home, /scrub: 0\.75/);
  assert.match(home, /scrub: 0\.35/);
  assert.match(home, /force3D: true/);
  assert.match(home, /attr:\s*\{\s*d:/);
  assert.doesNotMatch(home, /backgroundColor:/);
  assert.doesNotMatch(motion, /clipPath:/);
  assert.match(motion, /ignoreMobileResize: true/);
  assert.match(home, /bottom-=/);
  assert.match(home, /sticky top-0/);
  assert.match(home, /items-center overflow-hidden/);
  assert.match(home, /min-h-\[100svh\]/);
  assert.match(home, /sm:whitespace-nowrap/);
  assert.match(home, /text-4xl leading-\[1\.1\]/);
  assert.match(home, /sm:text-\[clamp\(2\.5rem,5\.5vw,4\.75rem\)\] sm:leading-\[1\.08\]/);
  assert.match(home, /-mt-\[0\.1em\] pt-\[0\.1em\]/);
  assert.match(home, /Primo passo/);
  assert.match(home, /text-xs font-bold uppercase text-\[var\(--ink\)\]/);
  assert.match(home, /mt-4 max-w-2xl text-base leading-7 text-\[var\(--ink\)\]/);
  assert.match(listing, /useParams/);
  assert.match(listing, /useListings/);
  assert.match(listing, /listing\.images/);
  assert.match(listing, /richieste\?type=/);
  assert.match(listing, /ListingGallery/);
  assert.match(listing, /onBack=\{\(\) => navigate\(-1\)\}/);
  assert.doesNotMatch(listing, /Torna alla home/);
  assert.ok(listing.indexOf('<ListingGallery') < listing.indexOf('<h1'));
  assert.match(listing, /listing\.price[\s\S]*listing\.location[\s\S]*listing\.title/);
  assert.match(listing, /<p className="font-display text-4xl[^>]*>[\s\S]*?\{listing\.price\}/);
  assert.match(listing, /<h1 className="font-display max-w-3xl/);
  assert.match(listing, /Superficie/);
  assert.match(listing, /Camere/);
  assert.match(listing, /Bagni/);
  assert.match(listing, /sticky bottom-0/);
  assert.match(listingGallery, /data-listing-carousel/);
  assert.match(listingGallery, /data-listing-back/);
  assert.match(listingGallery, /aspect-\[4\/3\]/);
  assert.match(listingGallery, /data-listing-lightbox/);
  assert.match(listingGallery, /aria-modal="true"/);
  assert.match(listingGallery, /ArrowLeft/);
  assert.match(listingGallery, /ArrowRight/);
  assert.match(listingGallery, /Escape/);
  assert.match(nav, /font-brand inline-flex pt-\[0\.08em\] text-\[1\.45rem\]/);
  assert.match(nav, /sm:text-\[1\.65rem\]/);
  assert.match(nav, /GEMÜT/);
  assert.doesNotMatch(nav, /<img/);
  assert.doesNotMatch(nav, /logo-black\.svg/);
  assert.doesNotMatch(nav, /logo-blue\.svg/);
  assert.match(nav, /className="focus-ring flex min-w-0 items-center rounded-lg"/);
  assert.match(nav, /data-site-navigation/);
  assert.match(nav, /isHome/);
  assert.match(nav, /sticky top-0/);
  assert.match(nav, /bg-\[rgba\(236,233,226,0\.82\)\]/);
  assert.match(nav, /bg-\[rgba\(236,233,226,0\.9\)\]/);
  assert.doesNotMatch(nav, /linear-gradient\(90deg,var\(--paper-deep\)/);
  assert.match(nav, /backdrop-blur-md/);
  assert.match(home, /-mt-16 flex min-h-\[100svh\]/);
  assert.match(home, /bg-black\/45 opacity-\[0\.67\]/);
  assert.match(nav, /ResizeObserver/);
  assert.match(nav, /shouldCollapse/);
  assert.match(nav, /data-mobile-nav-link/);
  assert.match(nav, /max-h-\[calc\(100svh-4rem\)\]/);
  assert.match(nav, /translate-y-0 opacity-100/);
  assert.match(nav, /text-\[1\.05rem\] leading-snug/);
  assert.doesNotMatch(nav, /top-16 z-\[70\] h-\[calc\(100svh-4rem\)\]/);
  assert.match(nav, /bg-\[var\(--brand-blue\)\] font-semibold text-\[var\(--ink\)\]/);
  assert.match(listingGallery, /overflow-x-auto p-1/);
  assert.doesNotMatch(nav, /company\.descriptor/);
  assert.doesNotMatch(nav, /xl:hidden|xl:flex/);

  [
    'public/design-system/logo/logo-blue.svg',
    'public/design-system/logo/logo-white.svg',
    'public/design-system/font/DeFontePlus-Leger.woff2',
    'public/design-system/font/DeFontePlus-Normale.woff2',
    'public/design-system/font/DeFontePlus-DemiGras.woff2',
    'public/design-system/font/DeFontePlus-Gros.woff2',
    'public/design-system/reference/tandem-awwwards-reference.jpg',
    'Design system/design.md',
  ].forEach((path) => {
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), true, path);
  });
});
