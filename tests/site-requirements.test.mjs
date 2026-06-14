import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const sourceFiles = [
  'src/LandingApp.tsx',
  'src/pages/Landing.tsx',
  'src/pages/AcquistoCasa.tsx',
  'src/pages/VenditaImmobili.tsx',
  'src/pages/Locazioni.tsx',
  'src/pages/ServiceDetail.tsx',
  'src/pages/PublicRequests.tsx',
].map(read).join('\n');

test('global navigation exposes every required destination', () => {
  const navigation = read('src/components/GlobalNavigation.tsx');
  [
    '/',
    '/acquisto-casa',
    '/vendita-immobili',
    '/locazioni',
    '/verifica-stato-tetto/',
    '/valorizzazione-book-fotografico/',
    '/valutazione-patrimonio/',
    '/prenotazione',
  ].forEach((route) => assert.match(navigation, new RegExp(route.replaceAll('/', '\\/'))));
  assert.match(navigation, /Apri menu di navigazione/);
});

test('home contains the approved brand and hero copy', () => {
  const landing = read('src/pages/Landing.tsx');
  assert.match(landing, /Gemüt Capital/);
  assert.match(landing, /agenzia di mediazione immobiliare/);
  assert.match(landing, /Il Tuo Partner Immobiliare di Fiducia/);
  assert.match(landing, /Il termine tedesco Gemüt indica l'animo/);
});

test('dedicated service pages contain exact CTA labels', () => {
  const detail = read('src/pages/ServiceDetail.tsx');
  assert.match(detail, /Richiedi Ispezione/);
  assert.match(detail, /Richiedi Book Fotografico/);
  assert.match(detail, /Richiedi Valutazione/);
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
