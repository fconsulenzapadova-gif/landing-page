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

test('public listings come from the public Google Sheet and public Drive folders', () => {
  const listings = read('src/lib/listings.ts');
  const hook = read('src/lib/useListings.ts');
  const driveImages = read('api/drive-images.ts');
  const servicePage = read('src/pages/ServicePage.tsx');
  const viteConfig = read('vite.config.ts');

  assert.match(listings, /15gP-IIWheuid1GCGGRMJk5vysmq3Oa3rIhVT8ndD5eg/);
  assert.match(listings, /export\?format=csv&gid=/);
  assert.match(listings, /Link cartella immagini/);
  assert.match(listings, /\/api\/drive-images\?folder=/);
  assert.doesNotMatch(listings, /Alt immagini|Link immagini|get\('Ordine'\)|normalizeListingImageUrl|splitImageLinks|\.sort\(/);
  assert.match(hook, /loadListings/);
  assert.match(driveImages, /embeddedfolderview/);
  assert.match(driveImages, /flip-entry-title/);
  assert.match(driveImages, /isCoverImage/);
  assert.doesNotMatch(driveImages, /googleapis|API_KEY/);
  assert.match(viteConfig, /local-drive-images-function/);
  assert.match(viteConfig, /driveImagesHandler/);
  assert.doesNotMatch(servicePage, /useListings|ListingCard|Immobili in vendita|Immobili in locazione/);
});

test('listing parsers map public sheet rows and public folder markup', async () => {
  const { parseListingsSheet } = await import('../src/lib/listings.ts');
  const { parsePublicFolderImages } = await import('../api/drive-images.ts');
  const csv = [
    'Pubblica *,Codice immobile *,Contratto *,Titolo *,Tipologia *,Comune *,Descrizione breve *,Link cartella immagini *',
    'Sì,GEM-002,Vendita,Casa seconda,Appartamento,Padova,Descrizione,https://drive.google.com/drive/folders/FOLDER123',
    'Sì,GEM-001,Locazione,Casa prima,Loft,Vicenza,Descrizione,https://drive.google.com/drive/folders/FOLDER456',
  ].join('\n');
  const parsed = parseListingsSheet(csv);

  assert.equal(parsed.listings.length, 2);
  assert.equal(parsed.listings[0].slug, 'gem-002');
  assert.equal(parsed.listings[0].requestType, 'vendita');
  assert.equal(parsed.listings[0].imageFolderUrl, 'https://drive.google.com/drive/folders/FOLDER123');
  assert.equal(parsed.listings[0].imageAlt, 'Casa seconda a Padova');
  assert.equal(parsed.listings[1].slug, 'gem-001');
  assert.equal(parsed.listings[1].requestType, 'locazione');

  const folderEntry = (id, name) =>
    `<div class="flip-entry"><a href="https://drive.google.com/file/d/${id}/view?usp=drive_web">` +
    `<div class="flip-entry-title">${name}</div></a></div>` +
    '<div class="flip-entry-last-modified">';
  const folderMarkup = [
    folderEntry('IMAGE003', '03-esterno.jpg'),
    folderEntry('IMAGE002', 'copertina.PNG'),
    folderEntry('IMAGE001', '01-interno.webp'),
  ].join('');
  const images = parsePublicFolderImages(folderMarkup);

  assert.equal(images.length, 3);
  assert.equal(images[0].name, 'copertina.PNG');
  assert.match(images[0].url, /thumbnail\?id=IMAGE002/);
  assert.deepEqual(images.slice(1).map((image) => image.name), ['01-interno.webp', '03-esterno.jpg']);

  const imagesWithoutCover = parsePublicFolderImages(
    folderEntry('IMAGE003', '03-esterno.jpg') + folderEntry('IMAGE001', '01-interno.webp'),
  );
  assert.equal(imagesWithoutCover[0].name, '01-interno.webp');
});

test('lead form uses the Cloudflare API without Supabase or external CRM', () => {
  const leads = read('src/lib/leads.ts');
  const requests = read('src/pages/RequestsPage.tsx');
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
  assert.match(requests, /type=acquisto|requestType/);
  assert.match(requests, /stepLabels/);
  assert.match(requests, /<Turnstile/);
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
  assert.match(success, /headingRef\.current\?\.focus\(\)/);
  assert.match(success, /onComplete: \(\) => headingRef\.current\?\.focus\(\)/);
  assert.match(success, /useGSAP/);
  assert.match(success, /prefers-reduced-motion: reduce/);
  assert.match(success, /strokeDashoffset/);
});

test('starting a new request remounts a visible form', () => {
  const requests = read('src/pages/RequestsPage.tsx');

  assert.match(requests, /const resetForm = \(\) => \{[\s\S]*?setStep\(0\);[\s\S]*?setStatus\('idle'\);/);
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
  assert.match(progress, /circa 2 minuti/);
  assert.match(property, /propertyTypes\.map/);
  assert.match(property, /budgetOptions\.map/);
  assert.match(property, /timeframeOptions\.map/);
  assert.match(contact, /contactPreference/);
  assert.match(contact, /form\.contactPreference === 'email'/);
  assert.match(contact, /Aggiungi anche/);
  assert.match(contact, /required: required/);
  assert.match(contact, /'aria-required': required/);
  assert.match(contact, /id="privacyAccepted"[\s\S]*?required[\s\S]*?aria-required=\{true\}/);
});

test('request polygon map is free, lazy, branded and accessible', () => {
  const pkg = read('package.json');
  const map = read('src/components/request/LocationPolygonMap.tsx');
  const css = read('src/index.css');
  assert.match(pkg, /"maplibre-gl": "5\.24\.0"/);
  assert.match(pkg, /"@mapbox\/mapbox-gl-draw": "1\.5\.1"/);
  assert.match(map, /https:\/\/tiles\.openfreemap\.org\/styles\/positron/);
  assert.match(map, /© OpenStreetMap contributors/);
  assert.match(map, /© OpenMapTiles/);
  assert.match(map, /Annulla ultimo punto/);
  assert.match(map, /Ricomincia/);
  assert.match(map, /Conferma area/);
  assert.match(map, /onUnavailable/);
  assert.match(map, /configureMapboxDrawForMapLibre\(MapboxDraw\.constants\.classes\)/);
  assert.match(map, /createLocationPolygonMapLifecycle/);
  assert.doesNotMatch(map, /access_token|apiKey|geolocation|getCurrentPosition/);
  assert.match(css, /\.request-location-map/);
  assert.match(css, /--brand-blue/);
  assert.match(css, /\.request-location-map \.maplibregl-canvas:focus-visible/);
  assert.doesNotMatch(css, /\.request-location-map \.maplibregl-canvas\s*\{\s*outline:\s*none/);
});

test('location selector swaps text and map in one accessible panel', () => {
  const selector = read('src/components/request/LocationSelector.tsx');
  const map = read('src/components/request/LocationPolygonMap.tsx');
  const boundary = read('src/components/request/LocationMapErrorBoundary.ts');

  assert.match(selector, /Scrivi zona/);
  assert.match(selector, /Seleziona sulla mappa/);
  assert.match(selector, /mode === 'text' \? \(/);
  assert.match(selector, /<LocationPolygonMap/);
  assert.match(selector, /lazy\(\(\) => loadLocationMapModule\(/);
  assert.doesNotMatch(selector, /import LocationPolygonMap from/);
  assert.match(boundary, /class LocationMapErrorBoundary extends Component/);
  assert.match(boundary, /static getDerivedStateFromError/);
  assert.match(boundary, /componentDidCatch\(/);
  assert.match(selector, /createLocationSelectorLifecycle/);
  assert.match(selector, /<LocationMapErrorBoundary/);
  assert.match(selector, /draftValue=\{locationLifecycle\.getDraft\(\)\}/);
  assert.match(selector, /onDraftChange=\{locationLifecycle\.updateDraft\}/);
  assert.match(map, /draftValue\?: LocationPolygon \| null/);
  assert.match(map, /onDraftChange\?: \(value: LocationPolygon \| null\) => void/);
  assert.match(map, /onDraftChangeRef\.current\?\.\(polygon\)/);
  assert.match(selector, /role="tablist"/);
  assert.match(selector, /aria-selected=\{mode === 'text'\}/);
  assert.match(selector, /role="tabpanel"/);
  assert.match(selector, /onKeyDown=\{moveTabFocus\}/);
  assert.match(selector, /locationLifecycle\.handleMapUnavailable\(message\)/);
  assert.match(selector, /requestRole === 'proprietario'[\s\S]*?Comune, quartiere o indirizzo/);

  const conditionalStart = selector.indexOf("{mode === 'text' ? (");
  const conditionalEnd = selector.indexOf('\n      )}', conditionalStart);
  assert.ok(conditionalStart >= 0 && conditionalEnd > conditionalStart, 'location panels must share one conditional');
  assert.equal((selector.slice(conditionalStart, conditionalEnd).match(/role="tabpanel"/g) ?? []).length, 2);
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
  assert.match(listingGallery, /data-listing-carousel/);
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
