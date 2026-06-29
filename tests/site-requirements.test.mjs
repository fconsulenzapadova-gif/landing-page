import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

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
    'immobili/:slug',
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

test('public listings come from the public Google Sheet and public Drive folders', () => {
  const listings = read('src/lib/listings.ts');
  const hook = read('src/lib/useListings.ts');
  const driveImages = read('api/drive-images.ts');
  const servicePage = read('src/pages/ServicePage.tsx');

  assert.match(listings, /15gP-IIWheuid1GCGGRMJk5vysmq3Oa3rIhVT8ndD5eg/);
  assert.match(listings, /export\?format=csv&gid=/);
  assert.match(listings, /Link cartella immagini/);
  assert.match(listings, /\/api\/drive-images\?folder=/);
  assert.doesNotMatch(listings, /Alt immagini|get\('Ordine'\)|\.sort\(/);
  assert.match(hook, /loadListings/);
  assert.match(driveImages, /embeddedfolderview/);
  assert.match(driveImages, /flip-entry-title/);
  assert.doesNotMatch(driveImages, /googleapis|API_KEY/);
  assert.match(servicePage, /Immobili in vendita/);
  assert.match(servicePage, /Immobili in locazione/);
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

  const folderMarkup =
    '<div class="flip-entry"><a href="https://drive.google.com/file/d/IMAGE123/view?usp=drive_web">' +
    '<div class="flip-entry-title">01-copertina.jpg</div></a></div>' +
    '<div class="flip-entry-last-modified">';
  const images = parsePublicFolderImages(folderMarkup);

  assert.equal(images.length, 1);
  assert.equal(images[0].name, '01-copertina.jpg');
  assert.match(images[0].url, /thumbnail\?id=IMAGE123/);
});

test('lead form writes to the clean lead_submissions table', () => {
  const leads = read('src/lib/leads.ts');
  const requests = read('src/pages/RequestsPage.tsx');

  assert.match(leads, /lead_submissions/);
  assert.match(leads, /crm-pro-five\.vercel\.app\/api\/submit-lead/);
  assert.match(requests, /useSearchParams/);
  assert.match(requests, /type=acquisto|requestType/);
  assert.doesNotMatch(leads, /\.select\(\)/);
  assert.doesNotMatch(leads, /\.update\(/);
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
  const brandLogo = read('public/design-system/logo/logo-blue.svg');
  const favicon = read('public/favicon.svg');

  assert.match(pkg, /"gsap"/);
  assert.match(pkg, /"@gsap\/react"/);
  assert.match(css, /--brand-blue: #b3e5fc/);
  assert.match(css, /--brand-blue-hover: #81d4fa/);
  assert.match(css, /--brand-blue-strong: #0277bd/);
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
  assert.match(home, /ScrollTrigger/);
  assert.match(home, /data-curve-swipe/);
  assert.match(home, /data-curve-path/);
  assert.match(home, /home-curve-swipe/);
  assert.match(home, /featured-listings-gallery/);
  assert.match(home, /home-services-bidirectional/);
  assert.match(home, /data-service-reveal-index=\{index \+ 1\}/);
  assert.match(home, /self\.direction === 1/);
  assert.match(home, /onLeaveBack: \(\) => tween\.reverse\(\)/);
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
  assert.match(home, /listingsRevealTarget/);
  assert.match(home, /pinSpacing: false/);
  assert.match(home, /top\+=\$\{galleryStartDelay\(\)\} top/);
  assert.match(home, /margin-top:-100svh/);
  assert.match(home, /min-h-\[260svh\]/);
  assert.doesNotMatch(home, /ref=\{heroRef\} className="section-line/);
  assert.doesNotMatch(home, /ref=\{listingsRef\} className="section-line/);
  assert.match(home, /\) : null\}\s+<Section>\s+<div ref=\{servicesSectionRef\} className="grid gap-12/);
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
  assert.match(home, /sm:text-\[clamp\(2\.5rem,6vw,5\.25rem\)\]/);
  assert.match(home, /onMouseEnter/);
  assert.match(listing, /useParams/);
  assert.match(listing, /useListings/);
  assert.match(listing, /listing\.images/);
  assert.match(listing, /richieste\?type=/);
  assert.match(nav, /logo-blue\.svg/);
  assert.match(nav, /data-site-navigation/);
  assert.match(nav, /isHome/);
  assert.match(nav, /sticky top-0/);
  assert.match(nav, /bg-\[rgba\(251,250,246,0\.88\)\]/);
  assert.doesNotMatch(nav, /backdrop-blur/);
  assert.match(home, /-mt-16 flex min-h-\[100svh\]/);
  assert.match(nav, /ResizeObserver/);
  assert.match(nav, /shouldCollapse/);
  assert.match(nav, /data-mobile-nav-link/);
  assert.match(nav, /max-h-\[calc\(100svh-4rem\)\]/);
  assert.match(nav, /translate-y-0 opacity-100/);
  assert.match(nav, /text-\[1\.05rem\] leading-snug/);
  assert.doesNotMatch(nav, /top-16 z-\[70\] h-\[calc\(100svh-4rem\)\]/);
  assert.doesNotMatch(nav, /data-mobile-nav-link[\s\S]{0,240}(?:rounded-lg border|bg-\[var\(--brand-blue\)\])/);
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
