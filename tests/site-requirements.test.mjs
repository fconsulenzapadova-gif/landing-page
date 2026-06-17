import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
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
    '/verifica-stato-tetto/',
    '/valutazione-patrimonio/',
    '/prenotazione',
  ].forEach((route) => assert.match(navigation, new RegExp(route.replaceAll('/', '\\/'))));
  assert.match(navigation, /Apri menu di navigazione/);
});

test('global navigation keeps the menu button fixed without measuring a home header', () => {
  const navigation = read('src/components/GlobalNavigation.tsx');

  assert.match(navigation, /top-4/);
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
  const hero = landing.slice(
    landing.indexOf('{/* Hero Section */}'),
    landing.indexOf('{/* Services Section */}'),
  );
  const definition = "Il termine tedesco Gemüt indica l'animo";

  assert.match(hero, />\s*agenzia di mediazione immobiliare\s*</);
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
  assert.match(
    landing,
    /const \[hasMobileClaimRevealed, setHasMobileClaimRevealed\] = useState\(false\)/,
  );
  assert.match(landing, /const lastScrollYRef = useRef\(0\)/);
  assert.match(landing, /window\.matchMedia\('\(max-width: 767px\)'\)/);
  assert.match(landing, /currentScrollY > lastScrollYRef\.current/);
  assert.match(landing, /currentScrollY > 24/);
  assert.match(
    landing,
    /window\.addEventListener\('scroll', revealMobileClaim, \{ passive: true \}\)/,
  );
  assert.match(landing, /window\.removeEventListener\('scroll', revealMobileClaim\)/);
  assert.match(hero, /hasMobileClaimRevealed/);
  assert.match(hero, /translate-y-4 opacity-0/);
  assert.match(hero, /md:translate-y-0 md:opacity-100/);
  assert.match(hero, /motion-reduce:transition-none/);
  assert.match(hero, /Gemüt Capital/);
  assert.match(hero, /il tuo partner immobiliare/);
  assert.match(hero, /di fiducia/);
  assert.match(hero, /text-sky-200/);
  assert.match(
    hero,
    /Il termine tedesco Gemüt indica l'animo, lo spirito o l'indole di una persona,\s+rappresenta la sfera emotiva, il cuore o il temperamento intesi come sede dei\s+sentimenti\./,
  );
  assert.doesNotMatch(hero, /Il Tuo Partner Immobiliare di Fiducia/);
  assert.doesNotMatch(landing, /Agenzia di mediazione immobiliare Gemüt Capital/);
  assert.doesNotMatch(landing, /Più\s+nello specifico/);
  assert.match(landing, /Sto cercando un immobile/);
  assert.match(landing, /Vorrei sapere quanto vale il mio immobile/);
  assert.match(landing, /Servizi per l'affitto/);
  assert.doesNotMatch(landing, /sto cercando un immobile/);
  assert.doesNotMatch(landing, /vorrei sapere quanto vale il mio immobile/);
  assert.doesNotMatch(landing, /sto cercando un immobile in affitto o ho un immobile da affittare/);
});

test('home services use responsive bidirectional reveal sequences', () => {
  const landing = read('src/pages/Landing.tsx');
  const services = landing.slice(
    landing.indexOf('{/* Services Section */}'),
    landing.indexOf('{/* Chi Sono Io Toggle Button */}'),
  );
  const desktopObserverCallback = landing.slice(
    landing.indexOf('const desktopObserver = new IntersectionObserver'),
    landing.indexOf('const mobileObserver = new IntersectionObserver'),
  );
  const mobileObserverCallback = landing.slice(
    landing.indexOf('const mobileObserver = new IntersectionObserver'),
    landing.indexOf('desktopObserver.observe(servicesSection)'),
  );
  const servicesObserverEffect = landing.slice(
    landing.indexOf('const servicesSection = servicesSectionRef.current'),
    landing.indexOf('if (!showAboutSection) return'),
  );
  const servicesScrollHandler = landing.slice(
    landing.indexOf('const trackServicesScrollDirection = () =>'),
    landing.indexOf('const syncServicesBreakpoint = () =>'),
  );

  assert.match(
    landing,
    /const \[hasDesktopServicesRevealed, setHasDesktopServicesRevealed\] = useState\(false\)/,
  );
  assert.match(
    landing,
    /const \[revealedMobileServiceItems, setRevealedMobileServiceItems\]/,
  );
  assert.match(landing, /const servicesSectionRef = useRef<HTMLElement>\(null\)/);
  assert.match(
    landing,
    /const servicesScrollDirectionRef = useRef<'up' \| 'down'>\('down'\)/,
  );
  assert.match(landing, /const servicesLastScrollYRef = useRef\(0\)/);
  assert.match(landing, /servicesLastScrollYRef\.current = currentScrollY/);
  assert.match(
    servicesScrollHandler,
    /const direction = currentScrollY > servicesLastScrollYRef\.current \? 'down' : 'up'/,
  );
  assert.match(
    servicesScrollHandler,
    /servicesScrollDirectionRef\.current = direction/,
  );
  assert.match(
    servicesScrollHandler,
    /const sectionRect = servicesSection\.getBoundingClientRect\(\)/,
  );
  assert.match(
    servicesScrollHandler,
    /desktopQuery\.matches &&\s*sectionRect\.top < window\.innerHeight &&\s*sectionRect\.bottom > 0/,
  );
  assert.match(
    servicesScrollHandler,
    /setHasDesktopServicesRevealed\(direction === 'down'\)/,
  );
  assert.match(
    servicesObserverEffect,
    /window\.addEventListener\('scroll', trackServicesScrollDirection, \{ passive: true \}\)/,
  );
  assert.match(
    servicesObserverEffect,
    /window\.removeEventListener\('scroll', trackServicesScrollDirection\)/,
  );
  assert.match(
    servicesObserverEffect,
    /desktopQuery\.addEventListener\('change', syncServicesBreakpoint\)/,
  );
  assert.match(
    servicesObserverEffect,
    /mobileQuery\.addEventListener\('change', syncServicesBreakpoint\)/,
  );
  assert.match(
    servicesObserverEffect,
    /desktopQuery\.removeEventListener\('change', syncServicesBreakpoint\)/,
  );
  assert.match(
    servicesObserverEffect,
    /mobileQuery\.removeEventListener\('change', syncServicesBreakpoint\)/,
  );
  assert.match(
    servicesObserverEffect,
    /if \(desktopQuery\.matches\) \{\s*setHasDesktopServicesRevealed\(sectionIsVisible\)/,
  );
  assert.match(
    servicesObserverEffect,
    /itemRect\.top < mobileBoundary && itemRect\.bottom > 0/,
  );
  assert.match(landing, /new IntersectionObserver/);
  assert.match(landing, /'IntersectionObserver' in window/);
  assert.match(
    desktopObserverCallback,
    /if \(!desktopQuery\.matches\) return/,
  );
  assert.doesNotMatch(
    desktopObserverCallback,
    /if \(!desktopQuery\.matches \|\| !entry\.isIntersecting\) return/,
  );
  assert.match(
    desktopObserverCallback,
    /setHasDesktopServicesRevealed\(servicesScrollDirectionRef\.current === 'down'\)/,
  );
  assert.match(
    desktopObserverCallback,
    /!entry\.isIntersecting[\s\S]*servicesScrollDirectionRef\.current === 'up'[\s\S]*entry\.boundingClientRect\.top >= window\.innerHeight[\s\S]*setHasDesktopServicesRevealed\(false\)/,
  );
  assert.match(mobileObserverCallback, /if \(!mobileQuery\.matches\) return/);
  assert.match(
    mobileObserverCallback,
    /const mobileBoundary = window\.innerHeight \* 0\.9/,
  );
  assert.match(
    mobileObserverCallback,
    /if \(entry\.isIntersecting\) \{\s*nextItems\.add\(index\)/,
  );
  assert.match(
    mobileObserverCallback,
    /if \(!entry\.isIntersecting && entry\.boundingClientRect\.top >= mobileBoundary\) \{\s*nextItems\.delete\(index\)/,
  );
  assert.doesNotMatch(mobileObserverCallback, /direction === '(?:up|down)'/);
  assert.match(mobileObserverCallback, /return hasChanged \? nextItems : currentItems/);
  assert.doesNotMatch(landing, /desktopObserver\.unobserve/);
  assert.doesNotMatch(landing, /mobileObserver\.unobserve/);
  assert.match(
    landing,
    /setRevealedMobileServiceItems\(new Set\(\[0, 1, 2, 3\]\)\)/,
  );
  assert.match(services, /data-service-reveal-index="0"/);
  assert.match(services, /data-service-reveal-index="1"/);
  assert.match(services, /data-service-reveal-index="2"/);
  assert.match(services, /data-service-reveal-index="3"/);
  const serviceRevealBlocks = [0, 1, 2, 3].map((index) => {
    const start = services.indexOf(`data-service-reveal-index="${index}"`);
    const end = index < 3
      ? services.indexOf(`data-service-reveal-index="${index + 1}"`)
      : services.length;

    return services.slice(start, end);
  });
  assert.match(services, /-translate-x-8 opacity-0/);
  assert.match(services, /md:-translate-y-8 md:opacity-0/);
  assert.match(services, /md:\[transition-delay:450ms\]/);
  assert.match(services, /md:\[transition-delay:600ms\]/);
  assert.match(services, /md:\[transition-delay:750ms\]/);
  assert.match(
    serviceRevealBlocks[0],
    /: 'md:translate-x-0 md:-translate-y-8 md:opacity-0 md:\[transition-delay:450ms\]'/,
  );
  assert.match(
    serviceRevealBlocks[1],
    /: 'md:translate-x-0 md:-translate-y-8 md:opacity-0 md:\[transition-delay:300ms\]'/,
  );
  assert.match(
    serviceRevealBlocks[2],
    /: 'md:translate-x-0 md:-translate-y-8 md:opacity-0 md:\[transition-delay:150ms\]'/,
  );
  assert.match(
    serviceRevealBlocks[3],
    /: 'md:translate-x-0 md:-translate-y-8 md:opacity-0 md:\[transition-delay:0ms\]'/,
  );
  assert.match(services, /motion-reduce:transition-none/);
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
    '5aae75fcc81af0e2d45bb1b13e7e82c49229615986b3e1ff4386f6719f8d0553',
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

  assert.match(requests, /url\(\/prato-padova\.jpg\)/);
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

test('footer contains approved company details', () => {
  const footer = read('src/components/SiteFooter.tsx');
  [
    'Gemüt Capital SRL',
    'Mediazione immobiliare',
    '379 260 6775',
    'info@gemutcapital.com',
    '0555 8150 289',
    'da comunicare',
    'Informativa Privacy',
  ].forEach((text) => assert.match(footer, new RegExp(text)));
});
