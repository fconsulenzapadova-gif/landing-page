import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, statSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const extractProtectedBlock = (source, startMarker, endMarker) => {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);

  assert.notEqual(start, -1, `Missing protected block start marker: ${startMarker}`);
  assert.notEqual(end, -1, `Missing protected block end marker: ${endMarker}`);
  assert.ok(end > start, 'Protected block end marker must follow start marker');

  return {
    protectedBlock: source.slice(start, end),
    sourceWithoutBlock: source.slice(0, start) + source.slice(end),
  };
};
const sourceFiles = [
  'src/LandingApp.tsx',
  'src/pages/Landing.tsx',
  'src/pages/AcquistoCasa.tsx',
  'src/pages/VenditaImmobili.tsx',
  'src/pages/Locazioni.tsx',
  'src/pages/ServiceDetail.tsx',
  'src/pages/PublicRequests.tsx',
].map(read).join('\n');

const landingSource = read('src/pages/Landing.tsx');
const {
  protectedBlock: aboutBlock,
  sourceWithoutBlock: landingWithoutAbout,
} = extractProtectedBlock(
  landingSource,
  '{/* Chi Sono Io Toggle Button */}',
  '{/* Why Choose Me Section */}',
);

test('global navigation exposes every required destination', () => {
  const navigation = read('src/components/GlobalNavigation.tsx');
  [
    '/',
    '/acquisto-casa',
    '/vendita-immobili',
    '/locazioni',
    '/servizi-personalizzati',
    '/verifica-stato-tetto/',
    '/valutazione-patrimonio/',
    '/prenotazione',
  ].forEach((route) => assert.match(navigation, new RegExp(route.replaceAll('/', '\\/'))));
  assert.match(navigation, /Apri menu di navigazione/);
});

test('global navigation separates destinations into titled visual sections', () => {
  const navigation = read('src/components/GlobalNavigation.tsx');

  assert.match(navigation, /const navigationSections = \[/);
  ['Principale', 'Servizi immobiliari', 'Servizi su misura'].forEach((title) => {
    assert.match(navigation, new RegExp(`title: '${title}'`));
  });
  [
    'Home',
    'Sto cercando un immobile',
    'Quanto vale il mio immobile',
    'Locazioni',
    'Servizi personalizzati',
  ].forEach((label) => assert.match(navigation, new RegExp(`label: '${label}'`)));
  assert.match(navigation, /space-y-6/);
  assert.match(navigation, /aria-labelledby=/);
  assert.match(navigation, /<h2/);
});

test('desktop navigation closes after hover and highlights the current route', () => {
  const navigation = read('src/components/GlobalNavigation.tsx');

  assert.match(navigation, /const closeMenuTimer = useRef<number \| null>\(null\)/);
  assert.match(navigation, /const scheduleMenuClose = \(\) =>/);
  assert.match(navigation, /window\.setTimeout\(\(\) => \{/);
  assert.match(navigation, /onPointerLeave=\{\(event\) =>/);
  assert.match(navigation, /onPointerEnter=\{\(event\) =>/);
  assert.match(navigation, /if \(event\.pointerType !== 'touch'\) scheduleMenuClose\(\)/);
  assert.match(navigation, /if \(event\.pointerType !== 'touch'\) cancelScheduledClose\(\)/);
  assert.match(navigation, /aria-current=\{isCurrent \? 'page' : undefined\}/);
  assert.match(navigation, /bg-blue-700 text-white/);
});

test('route changes reset scroll so destination headers open from the top', () => {
  const app = read('src/LandingApp.tsx');

  assert.match(app, /function ScrollToTop\(\)/);
  assert.match(app, /const \{ pathname \} = useLocation\(\)/);
  assert.match(app, /useLayoutEffect\(\(\) => \{/);
  assert.match(app, /window\.scrollTo\(\{ top: 0, left: 0, behavior: 'auto' \}\)/);
  assert.match(app, /\}, \[pathname\]\)/);
  assert.match(app, /<ScrollToTop \/>/);
  assert.ok(app.indexOf('<ScrollToTop />') < app.indexOf('<Routes>'));
});

test('global navigation keeps the menu button fixed without measuring a home header', () => {
  const navigation = read('src/components/GlobalNavigation.tsx');

  assert.match(navigation, /top-4/);
  assert.match(navigation, /isHiddenByFullscreenHero/);
  assert.match(navigation, /data-mobile-fullscreen-hero/);
  assert.match(navigation, /window\.scrollY < Math\.max\(24, window\.innerHeight \* 0\.75\)/);
  assert.match(navigation, /window\.setTimeout\(syncFullscreenHeroVisibility, 150\)/);
  assert.match(navigation, /mobile-fullscreen-hero-ready/);
  assert.match(navigation, /pointer-events-none opacity-0/);
  assert.doesNotMatch(navigation, /md:pointer-events-auto/);
  assert.doesNotMatch(navigation, /document\.querySelector\('header'\)/);
  assert.doesNotMatch(navigation, /ResizeObserver/);
  assert.doesNotMatch(navigation, /getBoundingClientRect\(\)\.height/);
  assert.doesNotMatch(navigation, /homeButtonTop/);
  assert.doesNotMatch(navigation, /style=\{/);
});

test('global navigation opens on hover or focus and routes home on desktop click', () => {
  const navigation = read('src/components/GlobalNavigation.tsx');

  assert.match(navigation, /useNavigate/);
  assert.match(navigation, /const navigate = useNavigate\(\)/);
  assert.match(navigation, /onPointerEnter=\{handleMenuButtonPointerEnter\}/);
  assert.match(navigation, /onPointerDown=\{handleMenuButtonPointerDown\}/);
  assert.match(navigation, /onMouseEnter=\{handleMenuButtonMouseEnter\}/);
  assert.match(navigation, /onFocus=\{handleMenuButtonFocus\}/);
  assert.match(navigation, /onClick=\{handleMenuButtonClick\}/);
  assert.match(navigation, /event\.pointerType === 'touch'/);
  assert.match(navigation, /if \(lastActivationPointerType\.current\) return/);
  assert.match(navigation, /lastActivationPointerType\.current === 'touch'/);
  assert.match(navigation, /navigate\('\/'\)/);
});

test('home contains the approved hero and service copy', () => {
  const landing = read('src/pages/Landing.tsx');
  const css = read('src/index.css');
  const hero = landing.slice(
    landing.indexOf('{/* Hero Section */}'),
    landing.indexOf('{/* Services Section */}'),
  );
  const definition = "Il termine tedesco Gemüt indica l'animo";

  assert.match(hero, /min-h-\[100svh\]/);
  assert.match(hero, /items-center/);
  assert.match(hero, /data-mobile-fullscreen-hero="true"/);
  assert.match(landing, /mobile-fullscreen-hero-ready/);
  assert.match(hero, /min-h-\[calc\(100svh-8rem\)\]/);
  assert.match(hero, /justify-center/);
  assert.doesNotMatch(hero, /md:min-h-\[500px\]/);
  assert.doesNotMatch(hero, /md:block/);
  assert.doesNotMatch(hero, /md:min-h-0/);
  assert.doesNotMatch(hero, /Agenzia di mediazione immobiliare/);
  assert.match(landing, /const \[heroTitleStage, setHeroTitleStage\]/);
  assert.match(landing, /setHeroTitleStage\('full'\), 1000/);
  assert.match(landing, /setHeroTitleStage\('trusted'\), 3300/);
  assert.match(landing, /const heroTitleWords = \[/);
  assert.match(landing, /delay: '1600ms'/);
  assert.match(hero, /heroTitleStage === 'brand'/);
  assert.match(hero, /hero-title-copy/);
  assert.match(hero, /hero-title-word/);
  assert.match(hero, /hero-title-trust-wipe/);
  assert.match(css, /\.hero-title-copy/);
  assert.match(css, /\.hero-title-word/);
  assert.match(hero, /index > 0 && ' '/);
  assert.match(css, /@keyframes heroTitleCopyIn/);
  assert.match(css, /\.hero-title-trust-wipe--active/);
  assert.match(css, /background-position: 100% 0/);
  assert.match(css, /background-position: 0 0/);
  assert.ok(hero.indexOf(definition) < hero.indexOf('<h2'));
  assert.match(
    landing,
    /const \[isGemutDefinitionOpen, setIsGemutDefinitionOpen\] = useState\(false\)/,
  );
  assert.match(hero, /onPointerEnter=\{handleGemutPointerEnter\}/);
  assert.match(
    landing,
    /const handleGemutDisclosurePointerLeave = \(event: React\.PointerEvent<HTMLDivElement>\)/,
  );
  assert.match(hero, /onPointerLeave=\{handleGemutDisclosurePointerLeave\}/);
  assert.match(hero, /onPointerUp=\{handleGemutPointerUp\}/);
  assert.match(landing, /event\.pointerType === 'touch'/);
  assert.match(hero, /onFocus=\{handleGemutFocus\}/);
  assert.match(hero, /onBlur=\{handleGemutBlur\}/);
  assert.match(hero, /aria-expanded=\{isGemutDefinitionOpen\}/);
  assert.match(hero, /aria-controls="gemut-definition"/);
  assert.match(hero, /grid-rows-\[0fr\]/);
  assert.match(hero, /grid-rows-\[1fr\]/);
  assert.match(hero, /transition-\[grid-template-rows,opacity,transform,margin\]/);
  assert.doesNotMatch(landing, /hasMobileClaimRevealed/);
  assert.doesNotMatch(landing, /syncMobileClaimVisibility/);
  assert.doesNotMatch(hero, /Esperienza, professionalità e tecnologia/);
  assert.doesNotMatch(hero, /underline/);
  assert.doesNotMatch(hero, /decoration-sky/);
  assert.match(hero, /Gemüt Capital/);
  assert.match(hero, /il tuo partner immobiliare/);
  assert.match(hero, /di fiducia/);
  assert.match(css, /--brand-accent-blue: #2563eb/);
  assert.match(css, /\.brand-blue-text/);
  assert.match(css, /var\(--brand-accent-blue\) 0 50%/);
  assert.match(hero, /className={`brand-blue-text rounded-sm/);
  assert.match(landing, /<span className="brand-blue-text"> Immobiliare<\/span>/);
  assert.match(
    hero,
    /Il termine tedesco Gemüt indica l'animo, lo spirito o l'indole di una persona,\s+rappresenta la sfera emotiva, il cuore o il temperamento intesi come sede dei\s+sentimenti\./,
  );
  assert.doesNotMatch(hero, /Il Tuo Partner Immobiliare di Fiducia/);
  assert.doesNotMatch(landing, /Agenzia di mediazione immobiliare Gemüt Capital/);
  assert.doesNotMatch(landing, /Più\s+nello specifico/);
  assert.match(
    landing,
    /Esperienza, professionalità e tecnologia al servizio delle tue esigenze immobiliari\.\s+Trova la casa dei tuoi sogni o vendi al miglior prezzo con il supporto di un esperto\./,
  );
  assert.match(landing, /Sto cercando un immobile/);
  assert.match(landing, /Vorrei sapere quanto vale il mio immobile/);
  assert.match(landing, /Servizi per l'affitto/);
  assert.doesNotMatch(landing, /sto cercando un immobile/);
  assert.doesNotMatch(landing, /vorrei sapere quanto vale il mio immobile/);
  assert.doesNotMatch(landing, /sto cercando un immobile in affitto o ho un immobile da affittare/);
});

test('home services use the same reversible reveal on mobile and desktop', () => {
  const landing = read('src/pages/Landing.tsx');
  const services = landing.slice(
    landing.indexOf('{/* Services Section */}'),
    landing.indexOf('{/* Chi Sono Io Toggle Button */}'),
  );

  assert.match(landing, /const \[revealedServiceItems, setRevealedServiceItems\]/);
  assert.match(landing, /const isInRevealRange = \(element: HTMLElement\)/);
  assert.match(landing, /window\.addEventListener\('scroll', syncServiceVisibility/);
  assert.match(landing, /window\.removeEventListener\('scroll', syncServiceVisibility\)/);
  assert.match(services, /data-service-reveal-index="0"/);
  assert.match(services, /data-service-reveal-index="1"/);
  assert.match(services, /data-service-reveal-index="2"/);
  assert.match(services, /data-service-reveal-index="3"/);
  assert.match(services, /-translate-x-8 opacity-0/);
  assert.match(services, /motion-reduce:transition-none/);
  assert.doesNotMatch(services, /md:(?:translate|opacity|\[transition-delay)/);
  assert.doesNotMatch(landing, /hasDesktopServicesRevealed|mobileQuery/);
});

test('about disclosure centers the profile photo with an accessible motion fallback', () => {
  const landing = read('src/pages/Landing.tsx');

  assert.match(landing, /const aboutPhotoRef = useRef<HTMLDivElement>\(null\)/);
  assert.match(landing, /ref=\{aboutPhotoRef\}/);
  assert.match(landing, /aboutPhotoRef\.current\?\.scrollIntoView/);
  assert.match(landing, /behavior: prefersReducedMotion \? 'auto' : 'smooth'/);
  assert.match(landing, /block: 'center'/);
  assert.match(landing, /inline: 'nearest'/);
  assert.doesNotMatch(landing, /aboutTextRef/);
});

test('why choose and final sections reveal reversibly on mobile and desktop', () => {
  const landing = read('src/pages/Landing.tsx');
  const whyChoose = landing.slice(
    landing.indexOf('{/* Why Choose Me Section */}'),
    landing.indexOf('{/* Servizi su Misura Section */}'),
  );
  const finalSections = landing.slice(
    landing.indexOf('{/* Servizi su Misura Section */}'),
    landing.indexOf('{/* Contact Section */}') + '{/* Contact Section */}'.length + 1200,
  );

  assert.match(
    landing,
    /const \[revealedWhyChooseItems, setRevealedWhyChooseItems\]/,
  );
  assert.match(
    landing,
    /const \[revealedLandingItems, setRevealedLandingItems\]/,
  );
  assert.match(landing, /const whyChooseRevealRefs = useRef/);
  assert.match(landing, /const landingRevealRefs = useRef/);
  assert.match(landing, /window\.addEventListener\('scroll', syncWhyChooseVisibility/);
  assert.match(landing, /window\.addEventListener\('scroll', syncLandingVisibility/);

  for (let index = 0; index < 5; index += 1) {
    assert.match(whyChoose, new RegExp(`data-why-choose-reveal-index="${index}"`));
  }

  for (let index = 0; index < 6; index += 1) {
    assert.match(landing, new RegExp(`data-landing-reveal-index="${index}"`));
  }

  assert.match(whyChoose, /transition-opacity/);
  assert.match(whyChoose, /opacity-0/);
  assert.match(whyChoose, /motion-reduce:transition-none/);
  assert.match(finalSections, /-translate-x-8 opacity-0/);
  assert.doesNotMatch(whyChoose, /md:opacity-100/);
  assert.doesNotMatch(finalSections, /md:translate-x-0|md:opacity-100/);
  assert.doesNotMatch(whyChoose, /(?:^|\s)-?(?:translate|scale)-/);
});

test('every Contattaci Ora CTA opens WhatsApp directly without revealing email', () => {
  const acquisition = read('src/pages/AcquistoCasa.tsx');
  const sale = read('src/pages/VenditaImmobili.tsx');
  const contactCtas = `${acquisition}\n${sale}`;

  assert.equal(contactCtas.match(/Contattaci Ora/g)?.length, 2);
  [acquisition, sale].forEach((page) => {
    assert.match(page, /getWhatsAppUrl/);
    assert.match(page, /target="_blank"/);
    assert.match(page, /rel="noopener noreferrer"/);
    assert.match(page, /MessageCircle/);
  });
  assert.match(acquisition, /informazioni per acquistare un immobile/);
  assert.match(sale, /informazioni per vendere il mio immobile/);
  assert.doesNotMatch(
    contactCtas,
    /showEmail|emailCopied|handleContactClick|handleCopyEmail|navigator\.clipboard/,
  );
});

test('public company copy uses representative plural voice', () => {
  assert.match(landingWithoutAbout, /Ti aiutiamo a trovare la casa perfetta/);
  assert.match(landingWithoutAbout, /La nostra esperienza e dedizione/);
  assert.match(landingWithoutAbout, /Contattaci oggi stesso/);
  assert.match(landingWithoutAbout, /Siamo sempre disponibili/);

  const acquisition = read('src/pages/AcquistoCasa.tsx');
  assert.match(acquisition, /Ti accompagniamo in ogni fase/);
  assert.match(acquisition, /Come Ti Aiutiamo nell'Acquisto/);
  assert.match(acquisition, /Analizziamo le tue esigenze e cerchiamo immobili/);
  assert.match(acquisition, /Ci occupiamo di tutta la documentazione/);

  const sale = read('src/pages/VenditaImmobili.tsx');
  assert.match(sale, /La Nostra Strategia di Marketing/);
  assert.match(sale, /Perché Affidarti a Noi/);
  assert.match(sale, /Ci occupiamo di tutto/);

  const rentals = read('src/pages/Locazioni.tsx');
  assert.match(rentals, /Gestiamo ogni aspetto della locazione/);
  assert.match(rentals, /Aiutiamo gli inquilini/);
  assert.match(rentals, /Ascoltiamo le tue esigenze specifiche/);

  const custom = read('src/pages/ServiziPersonalizzati.tsx');
  assert.match(custom, /Come Lavoriamo sui Progetti Personalizzati/);
  assert.match(custom, /Studiamo nel dettaglio le tue esigenze specifiche/);
  assert.match(custom, /Sviluppiamo un piano d'azione specifico/);

  const detail = read('src/pages/ServiceDetail.tsx');
  assert.match(
    detail,
    /Raccontaci l’immobile e l’obiettivo: ti indichiamo il percorso più adatto/,
  );
});

test('personal biography and customer voice remain singular', () => {
  assert.equal(
    createHash('sha256').update(aboutBlock).digest('hex'),
    'fcde29a1955fe7350ccc4af5461aec25bd1bcfc4bdbe9a147357445ac9849819',
  );
  assert.match(aboutBlock, /Sono <strong/);
  assert.match(aboutBlock, /La mia attività nasce/);
  assert.match(aboutBlock, /Il mio approccio/);
  assert.match(aboutBlock, /offro un servizio completo/);
  assert.match(aboutBlock, /accompagno i miei clienti/);
  assert.match(landingSource, /Vorrei sapere quanto vale il mio immobile/);
});

test('known singular company phrases stay outside public company copy', () => {
  const auditedSources = [
    landingWithoutAbout,
    read('src/pages/AcquistoCasa.tsx'),
    read('src/pages/VenditaImmobili.tsx'),
    read('src/pages/Locazioni.tsx'),
    read('src/pages/ServiziPersonalizzati.tsx'),
    read('src/pages/ServiceDetail.tsx'),
    read('src/pages/PublicRequests.tsx'),
    read('src/pages/Prenotazione.tsx'),
    read('src/pages/Privacy.tsx'),
    read('src/pages/ClientAccess.tsx'),
    read('src/components/GlobalNavigation.tsx'),
    read('src/components/SiteFooter.tsx'),
    read('src/components/CookieConsent.tsx'),
    read('src/components/WhatsAppButton.tsx'),
    read('src/utils/clientRequestProcessor.ts'),
  ];
  const singularCompanyPatterns = [
    /\bti aiuto\b/i,
    /\bti accompagno\b/i,
    /\bcome ti aiuto\b/i,
    /\banalizzo\b/i,
    /\bgestisco\b/i,
    /\bascolto\b/i,
    /\bmi occupo\b/i,
    /\bcontattami\b/i,
    /\braccontami\b/i,
    /\bti indico\b/i,
    /\bla mia strategia\b/i,
    /\baffidarti a me\b/i,
    /\bcome lavoro\b/i,
    /\boffro\b/i,
    /\bposso\b/i,
    /\bseguo\b/i,
    /\bgarantisco\b/i,
    /\bcontrollo\b(?!\s+clausole contrattuali\b)/i,
  ];

  auditedSources.forEach((source) => {
    singularCompanyPatterns.forEach((pattern) => assert.doesNotMatch(source, pattern));
  });
});

test('home starts from the hero without a standalone header section', () => {
  const landing = read('src/pages/Landing.tsx');
  const servicesIntro = landing.slice(
    landing.indexOf('{/* Services Section */}'),
    landing.indexOf('<div className="grid md:grid-cols-3 gap-8">'),
  );

  assert.doesNotMatch(landing, /<header className=/);
  assert.doesNotMatch(landing, /Agenzia di mediazione immobiliare Gemüt Capital/);
  assert.doesNotMatch(servicesIntro, /Il termine tedesco Gemüt indica l'animo/);
});

test('home specialist cards use the compact sizing contract', () => {
  const landing = read('src/pages/Landing.tsx');
  const specialistSection = landing.slice(
    landing.indexOf('{/* Servizi su Misura Section */}'),
    landing.indexOf('{/* CTA for Custom Services */}'),
  );

  [
    'max-w-[44rem]',
    'gap-5',
    'min-h-[18rem]',
    'md:min-h-0',
    'p-4',
    'h-11 w-11',
    'h-[1.375rem] w-[1.375rem]',
    'text-[0.875rem]',
    'h-7',
    'text-[0.7rem]',
    'h-[0.6875rem] w-[0.6875rem]',
  ].forEach((className) => assert.match(specialistSection, new RegExp(className.replaceAll('[', '\\[').replaceAll(']', '\\]'))));
});

test('public request page uses one Prato della Valle background', () => {
  const requests = read('src/pages/PublicRequests.tsx');

  assert.match(requests, /url\(\/prato-padova-optimized\.jpg\)/);
  assert.doesNotMatch(requests, /piazza-vicina\.JPG/);
  assert.doesNotMatch(requests, /padova-test\.jpg/);
});

test('dedicated service pages contain exact CTA labels', () => {
  const detail = read('src/pages/ServiceDetail.tsx');
  assert.match(detail, /Richiedi Ispezione/);
  assert.match(detail, /Richiedi Valutazione/);
});

test('photo book service is removed and old URLs redirect home', () => {
  const app = read('src/LandingApp.tsx');
  const navigation = read('src/components/GlobalNavigation.tsx');
  const landing = read('src/pages/Landing.tsx');
  const detail = read('src/pages/ServiceDetail.tsx');

  [navigation, landing, detail].forEach((source) => {
    assert.doesNotMatch(source, /Valorizzazione con Book Fotografico/);
    assert.doesNotMatch(source, /Richiedi Book Fotografico/);
  });
  assert.doesNotMatch(detail, /'valorizzazione-book-fotografico':/);
  assert.match(
    app,
    /path="\/valorizzazione-book-fotografico" element={<Navigate to="\/" replace \/>}/,
  );
  assert.match(
    app,
    /path="\/dettaglio-valorizzazione-book" element={<Navigate to="\/" replace \/>}/,
  );
});

test('removed public copy is absent from relevant pages', () => {
  [
    'Servizi Premium',
    'Assistenza Mutui',
    'Passaparola',
    'Risultati Garantiti',
    'Area Clienti',
  ].forEach((text) => assert.doesNotMatch(sourceFiles, new RegExp(text)));
});

test('required local assets and restored pages exist', () => {
  [
    'public/prato-padova.jpg',
    'public/sfondo-patrimoni.jpg',
    'public/foto-cortina.JPG',
    'public/Sfondo locazioni.JPG',
    'src/pages/Privacy.tsx',
    'src/pages/Prenotazione.tsx',
  ].forEach((path) => assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), true, path));
});

test('active pages use optimized images with bounded file sizes', () => {
  const optimizedAssets = [
    'public/prato-padova-optimized.jpg',
    'public/sfondo-patrimoni-optimized.jpg',
    'public/foto-cortina-optimized.jpg',
    'public/sfondo-locazioni-optimized.jpg',
    'public/tetto-uav-optimized.jpg',
    'public/strada-verde-optimized.jpg',
    'public/profile-optimized.jpg',
  ];
  const optimizedSources = [
    read('src/pages/Landing.tsx'),
    read('src/pages/PublicRequests.tsx'),
    read('src/pages/AcquistoCasa.tsx'),
    read('src/pages/VenditaImmobili.tsx'),
    read('src/pages/Locazioni.tsx'),
    read('src/pages/ServiziPersonalizzati.tsx'),
    read('src/pages/ServiceDetail.tsx'),
  ].join('\n');

  optimizedAssets.forEach((path) => {
    const url = new URL(`../${path}`, import.meta.url);
    assert.equal(existsSync(url), true, path);
    assert.ok(statSync(url).size < 900_000, `${path} must stay below 900 KB`);
    assert.match(optimizedSources, new RegExp(path.replace('public/', '').replace('.', '\\.')));
  });
  assert.ok(
    statSync(new URL('../public/sfondo-patrimoni-optimized.jpg', import.meta.url)).size > 100_000,
    'the SDR sale image must contain visible photographic data',
  );
  assert.match(landingSource, /fetchPriority="high"/);
  assert.match(landingSource, /loading="lazy"/);
  assert.match(landingSource, /decoding="async"/);
  assert.match(landingSource, /width="512"/);
  assert.match(landingSource, /height="768"/);
});

test('footer contains approved company details', () => {
  const footer = read('src/components/SiteFooter.tsx');
  const publicPages = [
    read('src/pages/PublicRequests.tsx'),
    read('src/pages/ClientAccess.tsx'),
  ].join('\n');
  [
    'Gemüt Capital SRL',
    'Mediazione immobiliare',
    '379 260 6775',
    'info@gemutcapital.com',
    'Partita IVA: 05791060287',
    'REA: PD - 492863',
    'gemutcapital@pec.it',
    'Informativa Privacy',
    '© 2026 Gemüt Capital SRL',
  ].forEach((text) => assert.match(footer, new RegExp(text)));

  assert.doesNotMatch(footer, /© 2025/);

  assert.doesNotMatch(footer, /FileText|rounded-lg bg-white\/5/);
  assert.doesNotMatch(publicPages, /0555 8150 289/);
});
