# PRD - Gemut Capital

Ultimo aggiornamento: 27 giugno 2026

## 1. Scopo

Questo documento descrive lo stato reale del sito Gemut Capital dopo la
riscrittura public-only. Va letto prima di ogni task insieme ad `AGENTS.md`.
Se codice e PRD divergono, il codice reale prevale e questo file deve essere
aggiornato nello stesso task.

Obiettivi della riscrittura:

- eliminare la vecchia struttura CRM/dormiente dalla build pubblica;
- rendere il sito semplice da leggere, modificare e verificare;
- centralizzare contenuti, route e dati societari;
- mantenere compatibilita con le route pubbliche principali;
- usare un unico form lead reale;
- documentare chiaramente feature attive, parziali e simulate;
- applicare un design system editoriale ispirato alla reference Tandem, con
  logo ufficiale, azzurro cielo brand `#b3e5fc`, font De Fonte Plus e
  animazioni GSAP.

## 2. Sintesi prodotto

Il progetto e una SPA pubblica per **Gemut Capital SRL**, societa di mediazione
immobiliare a Padova e provincia.

Il sito presenta:

- servizi di acquisto casa;
- vendita immobili;
- locazioni;
- valutazione del patrimonio immobiliare;
- form richiesta lead;
- prenotazione consulenza tramite contatto diretto;
- privacy page sintetica;
- cookie banner locale.
- UI dinamica con hero full-screen fotografica, headline animata, preview
  servizi interattiva, navigazione misurata sullo spazio reale, reveal on
  scroll, parallax leggero, transizione curve swipe dalla hero al contenuto e
  gallery orizzontale di immobili letti dal foglio Google Sheets pubblico.

La nuova app non monta piu dashboard CRM, AuthProvider, React Query, hook CRM o
componenti shadcn/Radix nel runtime pubblico.

## 3. Legenda stato

| Stato | Significato |
| --- | --- |
| Attivo | Raggiungibile nel router pubblico corrente |
| Parziale | Raggiungibile, ma senza integrazione completa |
| Legacy compatibile | URL storico mantenuto solo come redirect |
| Simulato | UI o preferenza senza servizio esterno reale |
| Infrastrutturale | Configurazione, utility, test o supporto tecnico |

## 4. Mappa rapida: dove modificare

| Esigenza | File |
| --- | --- |
| Entry point React | `src/main-landing.tsx` |
| Router e redirect | `src/LandingApp.tsx` |
| Layout globale | `src/components/AppLayout.tsx` |
| Navigazione | `src/components/Navigation.tsx` |
| Footer | `src/components/Footer.tsx` |
| Cookie banner | `src/components/CookieConsent.tsx` |
| Dati societari, route, servizi, copy centrale | `src/content/site.ts` |
| Animazioni GSAP di pagina | `src/lib/usePageAnimations.ts` |
| Home | `src/pages/HomePage.tsx` |
| Dati immobili da Google Sheets | `src/lib/listings.ts`, `src/lib/useListings.ts` |
| Immagini da cartelle Drive pubbliche | `api/drive-images.ts` |
| Card immobile condivisa | `src/components/ListingCard.tsx` |
| Dettaglio immobile | `src/pages/ListingPage.tsx` |
| Pagine acquisto/vendita/locazioni | `src/pages/ServicePage.tsx`, `src/content/site.ts` |
| Pagina valutazione patrimonio | `src/pages/SpecialistPage.tsx`, `src/content/site.ts` |
| Form richieste | `src/pages/RequestsPage.tsx` |
| Invio lead Supabase/CRM | `src/lib/leads.ts`, `src/lib/supabase.ts` |
| WhatsApp | `src/lib/whatsapp.ts` |
| Prenotazione | `src/pages/BookingPage.tsx` |
| Privacy | `src/pages/PrivacyPage.tsx` |
| Hero pagina | `src/components/PageHero.tsx` |
| CTA link | `src/components/ButtonLink.tsx` |
| Icone centralizzate | `src/components/Icon.tsx` |
| Sezioni layout | `src/components/Section.tsx` |
| CSS globale | `src/index.css`, `tailwind.config.js` |
| Design system e reference | `Design system/design.md`, `Design system/Logo`, `Design system/font`, `Design system/Referance` |
| Asset runtime design system | `public/design-system` |
| Schema lead | `database_schema.sql`, `fix_rls_policies.sql` |
| Test statici | `tests/site-requirements.test.mjs` |
| HTML base e SEO | `index.html` |
| Config Vite | `vite.config.ts` |
| Deploy Vercel | `vercel.json`, `.vercelignore`, `public/CNAME` |
| Istruzioni agenti | `AGENTS.md` |

## 5. Stack

- React 18;
- TypeScript;
- Vite 8 con React SWC;
- React Router 6;
- Tailwind CSS;
- Lucide React;
- GSAP con `@gsap/react` e `ScrollTrigger`;
- Supabase JS;
- Node test runner;
- Vercel.

Dipendenze runtime dichiarate dopo la pulizia:

- `@gsap/react`;
- `@supabase/supabase-js`;
- `gsap`;
- `lucide-react`;
- `react`;
- `react-dom`;
- `react-router-dom`;
- `tailwindcss-animate`.

Nota: `package-lock.json` e stato rigenerato con `npm install --package-lock-only`
tramite npm temporaneo eseguito da `pnpm dlx`, per includere GSAP senza cambiare
il package manager del progetto.

## 6. Architettura runtime

```text
index.html
  -> src/main-landing.tsx
    -> LandingApp
      -> BrowserRouter
      -> ScrollToTop
      -> Suspense
      -> Routes
        -> AppLayout
          -> Navigation
          -> Outlet pagina
            -> pagine con usePageAnimations
          -> Footer
          -> CookieConsent
```

Scelte architetturali:

- nessun provider auth globale;
- nessun provider React Query;
- route lazy-loaded;
- contenuti e dati societari in `src/content/site.ts`;
- pagine principali data-driven;
- componenti condivisi piccoli e senza dipendenze shadcn;
- immobili caricati nel browser dall'export CSV pubblico del Google Sheet
  `15gP-IIWheuid1GCGGRMJk5vysmq3Oa3rIhVT8ndD5eg`, senza Google Sheets API;
- cartelle immagini lette dalla funzione Vercel `api/drive-images.ts` tramite
  la vista HTML pubblica `embeddedfolderview`, senza Google Drive API o chiavi;
- unico flusso form in `RequestsPage` + `submitLeadRequest`;
- animazioni create nelle pagine tramite `usePageAnimations`, con `useGSAP`,
  scope locale, `ScrollTrigger` e rispetto di `prefers-reduced-motion`;
- asset del design system serviti da `public/design-system`.

## 7. Routing

| Route | Componente/comportamento | Stato |
| --- | --- | --- |
| `/` | `HomePage` | Attivo |
| `/acquisto-casa` | `ServicePage` con servizio acquisto | Attivo |
| `/vendita-immobili` | `ServicePage` con servizio vendita | Attivo |
| `/locazioni` | `ServicePage` con servizio locazione | Attivo |
| `/valutazione-patrimonio` | `SpecialistPage` patrimonio | Attivo |
| `/richieste` | `RequestsPage` | Attivo |
| `/richieste?type=acquisto` | Form con tipo acquisto | Attivo |
| `/richieste?type=vendita` | Form con tipo vendita | Attivo |
| `/richieste?type=locazione` | Form con tipo locazione | Attivo |
| `/prenotazione` | `BookingPage` | Parziale |
| `/privacy` | `PrivacyPage` | Parziale |
| `/immobili/:slug` | `ListingPage` con dati e gallery dal foglio pubblico | Attivo |
| `/accesso-clienti` | Redirect a `/richieste` | Legacy compatibile |
| `/valorizzazione-book-fotografico` | Redirect a `/` | Legacy compatibile |
| `/servizi-premium` | Redirect a `/` | Legacy compatibile |
| `/dettaglio-valorizzazione-book` | Redirect a `/` | Legacy compatibile |
| `/dettaglio-valutazione-patrimonio` | Redirect a `/valutazione-patrimonio` | Legacy compatibile |
| `/dashboard` | Redirect a `/` | Legacy compatibile |
| `/crm/*` | Redirect a `/` | Legacy compatibile |
| `/login` | Redirect a `/` | Legacy compatibile |
| `/auth` | Redirect a `/` | Legacy compatibile |
| Qualsiasi altra route | Redirect a `/` | Attivo |

I vecchi redirect verso `localhost:8081` sono stati rimossi.

## 8. Esperienza pubblica

### Home

`HomePage` contiene:

- hero iniziale sempre full-screen con immagine `/images/Home.webp` full-bleed
  e variante verticale `/images/Home-mobile.jpg` sotto i 768px; navigazione
  sticky con fondo chiaro traslucido senza backdrop blur e headline centrale
  "Casa nuova, stesso GEMÜT"; la headline usa una scala ridotta e resta su una
  riga da `sm` in su, mentre su telefono puo andare a capo;
- headline hero animata con GSAP core (`gsap.fromTo`, `gsap.matchMedia`) e
  fallback per `prefers-reduced-motion`;
- transizione scroll iniziale con curve swipe SVG: la hero viene pinnata
  brevemente senza spazio aggiuntivo da pin e una curva color carta sale dal
  basso con `ScrollTrigger`; la curva mantiene il morph dinamico del path tra
  stato nascosto, onda e copertura completa;
- gallery orizzontale di immobili pubblicati nel foglio subito dopo la curve swipe, con
  sezione `sticky` CSS centrata verticalmente sulle card, senza titolo o
  descrizione introduttiva; la prima card parte centrata nel viewport e resta
  ferma durante il reveal, poi lo scrub GSAP avvia il movimento orizzontale
  dopo circa il 72% della transizione hero; le card sono gia
  renderizzate/cliccabili verso `/immobili/:slug`; la sezione gallery risale in
  overlap sotto la hero e il viewport delle card viene rivelato nella seconda
  meta della curve swipe, cosi le card compaiono mentre la curva sta ancora
  chiudendo ed evitano una schermata interamente carta; hero e gallery non
  applicano divisori propri durante l'overlap e anche la sezione servizi
  immediatamente successiva resta senza bordo superiore, evitando linee
  transitorie che scorrono verticalmente sullo sfondo; un fondale color carta
  dentro la sticky gallery diventa opaco subito prima dello sgancio del pin e
  copre il limite inferiore della hero mentre questa riprende a scorrere; il viewport
  mantiene lo scroll orizzontale nativo ma ne nasconde la barra overlay, che
  altrimenti apparirebbe temporaneamente come una linea durante lo scroll; su
  viewport mobile usa immagini JPEG ridimensionate a massimo 1280px per
  limitare memoria di decodifica e texture GPU;
- sezione servizi principali con preview immagine interattiva su hover/focus;
- CTA verso `/richieste` e `/prenotazione`;
- sezione chi siamo con `/images/profile.webp`;
- quattro value proposition;
- card scura per valutazione patrimonio;
- CTA finale verso il form.

Le animazioni della home sono attive tramite `usePageAnimations`: reveal on
scroll basati su transform/opacity e parallax leggero solo su dispositivi con
puntatore fine. Su touch il parallax continuo viene disattivato. Con
`prefers-reduced-motion` le animazioni vengono neutralizzate.

### Immobili da Google Sheets

Fonte attiva:

```text
https://docs.google.com/spreadsheets/d/15gP-IIWheuid1GCGGRMJk5vysmq3Oa3rIhVT8ndD5eg/
```

Il sito legge direttamente l'export CSV pubblico del tab con `gid=0`, senza
Google Sheets API, credenziali o variabili ambiente. Una riga viene pubblicata
solo se `Pubblica *` vale `Sì` e contiene almeno contratto e titolo.

Colonne supportate:

- pubblicazione, codice, slug, contratto, titolo e tipologia;
- comune, zona, indirizzo e CAP;
- prezzo numerico o testo prezzo;
- superficie, locali, camere, bagni, piano e ascensore;
- stato immobile, classe energetica e disponibilita;
- descrizione breve e completa;
- caratteristiche e punti di forza, separati da `|` o a capo;
- link cartella immagini pubblica;
- link immagini diretti facoltativi, alt text e ordine.

`api/drive-images.ts` riceve il link cartella, legge la vista HTML pubblica
Google Drive e restituisce solo JPG, JPEG, PNG, WebP, AVIF e GIF. I file sono
ordinati per nome: il primo diventa copertina, gli altri alimentano la gallery
del dettaglio. La cartella e i file devono essere accessibili a chiunque abbia
il link. Le risposte sono memorizzate dalla CDN fino a 5 minuti.

I cinque esempi iniziali sono stati rimossi dal codice e inseriti nel foglio
come righe `DEMO-001` ... `DEMO-005`. Usano percorsi immagini locali nella
colonna `Link immagini`; i nuovi immobili possono usare solo la cartella
pubblica. Se il foglio non e raggiungibile o non contiene righe pubblicate, il
sito non inventa immobili e restituisce una lista vuota.

`ListingPage` renderizza dati reali e gallery per `/immobili/:slug`. Le CTA
portano al form richieste con `type=vendita` o `type=locazione`.

### Servizi principali

`ServicePage` renderizza acquisto, vendita e locazioni partendo dai dati in
`site.ts`. Ogni servizio definisce:

- route;
- immagine hero;
- icona;
- testo summary;
- highlight;
- metodo di lavoro;
- benefici;
- CTA verso form;
- link WhatsApp con messaggio precompilato.

Le pagine vendita e locazioni mostrano anche le card filtrate dal foglio,
rispettivamente per contratto `Vendita` e `Locazione`.

La UI usa hero chiaro con titolo serif e immagine, highlight in card leggere,
metodo a righe numerate, benefici e CTA finale scura.

### Valutazione patrimonio

`SpecialistPage` renderizza solo la valutazione del patrimonio immobiliare.

Le CTA portano a `/prenotazione` e WhatsApp.

La UI usa lo stesso sistema hero/section del resto del sito e mantiene lo stato
di prenotazione parziale.

### Prenotazione

`BookingPage` e parziale: non integra calendario. Offre:

- link a `/richieste`;
- telefono;
- email.

### Privacy

`PrivacyPage` e parziale: contiene informativa sintetica, non una privacy policy
legale completa.

## 9. Form lead

File:

- `src/pages/RequestsPage.tsx`;
- `src/lib/leads.ts`;
- `src/lib/supabase.ts`.

Campi:

- nome;
- telefono;
- email;
- tipo richiesta;
- tipo immobile;
- zona;
- budget;
- tempistiche;
- caratteristiche/obiettivi;
- note.

Validazione frontend:

- nome obbligatorio;
- telefono obbligatorio;
- email obbligatoria e formato base valido;
- zona obbligatoria.

Il parametro query `type` accetta:

- `acquisto`;
- `vendita`;
- `locazione`.

Altri valori ricadono su `acquisto`.

UX corrente:

- hero editoriale chiaro con immagine;
- tipo richiesta selezionato con controllo segmentato;
- campi in griglia responsive;
- stesso payload `LeadRequest` e stessa funzione `submitLeadRequest`.

## 10. Supabase e CRM

`src/lib/supabase.ts` crea un client Supabase solo con:

- `VITE_SUPABASE_URL`;
- `VITE_SUPABASE_PUBLISHABLE_KEY`;
- `persistSession: false`;
- `autoRefreshToken: false`.

`src/lib/leads.ts` inserisce una riga in:

```text
lead_submissions
```

Non esegue `SELECT` o `UPDATE` anonimi. Questo sostituisce il vecchio flusso
`clients` + `client_requests` e rimuove il precedente rischio RLS.

Dopo l'inserimento Supabase, invia in modo non bloccante il lead al CRM esterno:

```text
https://crm-pro-five.vercel.app/api/submit-lead
```

Payload CRM:

```json
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "landing_page_url": "www.gemutcapital.com"
}
```

Se Supabase non e configurato, il form mostra errore e non invia dati.

## 11. Schema database

`database_schema.sql` definisce `lead_submissions` con:

- dati contatto;
- tipo richiesta;
- dettagli immobile;
- source;
- status;
- timestamp;
- indici;
- trigger `updated_at`;
- RLS.

Policy RLS:

- anon: solo `INSERT`;
- authenticated: `INSERT`, `SELECT`, `UPDATE`.

`fix_rls_policies.sql` riallinea solo le policy RLS di `lead_submissions`.

## 12. Cookie e localStorage

`CookieConsent` usa localStorage con chiave:

```text
cookie-consent
```

Preferenze:

- necessary;
- analytics;
- marketing.

Stato: UI attiva, analytics/marketing simulati. Le preferenze vengono salvate
ma non caricano script esterni.

## 13. Asset pubblici

Asset attivi:

- `public/design-system/logo/logo-blue.svg`;
- `public/design-system/logo/logo-white.svg`;
- `public/design-system/font/DeFontePlus-DemiGras.woff2`;
- `public/design-system/font/DeFontePlus-Gros.woff2`;
- `public/design-system/font/DeFontePlus-Leger.woff2`;
- `public/design-system/font/DeFontePlus-Normale.woff2`;
- `public/design-system/reference/tandem-awwwards-reference.jpg`;
- `public/images/Home.webp`;
- `public/images/Home-mobile.jpg`;
- `public/images/dji_fly_20250831_093124_158_1756625974281_photo.webp`;
- `public/images/dji_fly_20250831_093124_158_1756625974281_photo-mobile.jpg`;
- `public/images/dji_fly_20260118_083240_429_1768722357071_photo.webp`;
- `public/images/dji_fly_20260118_083240_429_1768722357071_photo-mobile.jpg`;
- `public/images/piazza-vicina.webp`;
- `public/images/piazza-vicina-mobile.jpg`;
- `public/images/prato-padova.webp`;
- `public/images/prato-padova-mobile.jpg`;
- `public/images/profile.webp`;
- `public/images/sfondo-patrimoni.webp`;
- `public/images/sfondo-patrimoni-mobile.jpg`;
- `public/favicon.svg`.

Asset sorgente o storici ancora presenti:

- `Design system/design.md`;
- `Design system/Logo/Logo blu.svg`;
- `Design system/Logo/Logo bianco.svg`;
- `Design system/font/*`;
- `Design system/Referance/TANDEM - Awwwards Honorable Mention.jpg`;
- `public/placeholder.svg`.

I nomi sono case-sensitive in produzione Linux.

## 14. Design system e motion

File:

- `Design system/design.md`;
- `src/index.css`;
- `src/lib/usePageAnimations.ts`;
- asset runtime in `public/design-system`.

Principi attivi:

- azzurro cielo brand `#b3e5fc`, hover `#81d4fa` e variante forte accessibile
  `#0277bd` per testi piccoli su superfici chiare;
- wordmark azzurro cielo da `public/design-system/logo/logo-blue.svg` (filename
  mantenuto per compatibilita) e variante da
  `public/design-system/logo/logo-white.svg`;
- font logo `De Fonte Plus` servito via `@font-face`;
- titoli editoriali con stack `Minion Variable Concept`, `Minion 3 Variable`,
  `Minion Pro`, `Georgia`, `serif`;
- il repository non contiene un file font Minion distribuibile, quindi Minion
  viene usato se disponibile nell'ambiente/browser e degrada sui fallback serif;
- card con raggio massimo 8px;
- sezioni full-width con bordi sottili e contenuto max `7xl`;
- CTA primarie azzurro cielo con testo ink e secondarie outline.
- navigazione con logo a sinistra, voci centrate quando entrano nella barra,
  CTA richiesta a destra e menu a tendina centrato solo in modalita compatta;
  il menu compatto si apre come tendina ad altezza contenuto sotto la barra,
  con breve transizione fade/slide e griglia a tre colonne da `sm`; le
  destinazioni sono link testuali da 1.05rem con peso medio, senza riquadri,
  bordi o sfondi, con la route attiva semibold e blu; "Invia richiesta" e
  separata da una linea sottile e usa un trattamento uppercase piu compatto;
  sulla home resta sticky ed e sovrapposta alla hero con fondo chiaro
  traslucido senza backdrop blur, mentre sulle altre route mantiene il fondo
  chiaro piu coprente; l'assenza del blur evita repaint continui durante lo
  scroll, soprattutto su Safari.
- hero home con immagine WebP full-bleed, testo centrato senza card e parola
  `GEMÜT` in font brand.

Motion attivo:

- `usePageAnimations` registra `@gsap/react` e `ScrollTrigger`;
- `HomePage` usa GSAP core per animare headline e immagine della hero iniziale;
- `HomePage` usa una timeline `ScrollTrigger` con `pin`, `pinSpacing: false` e
  `scrub` per la transizione curve swipe dalla hero al contenuto sottostante; il
  path SVG mantiene il morph dinamico originale, mentre immagine, testo e
  oscuramento usano transform/opacity; il pin e tarato corto e non aggiunge
  spacer, cosi la gallery puo salire sotto la curva invece di aspettare la fine
  della hero;
- la timeline hero e lo scroll orizzontale vengono reinizializzati quando
  arrivano asincronamente le righe del foglio; prima dello scroll il viewport
  immobili resta invisibile e non copre la prima schermata;
- il caricamento del CSV parte alla valutazione del modulo e le immagini delle
  card home usano `loading="eager"`: dati e media sono quindi preparati subito,
  mentre la visibilita resta governata dalla transizione scroll;
- `HomePage` usa `ScrollTrigger` senza `pin` GSAP per la gallery orizzontale
  degli immobili pubblicati nel foglio: la sezione resta `sticky` via CSS, risale con
  overlap di un viewport rispetto alla hero e il track si muove su asse `x` con
  `ease: "none"` e `scrub` numerico; il track viene inizializzato con la prima
  card centrata e il movimento parte con un ritardo pari a circa il 72% della
  distanza della curve swipe, mentre il viewport delle card viene rivelato
  prima dalla timeline hero per evitare comparse tardive o schermate vuote; i
  contenitori hero, gallery e la sezione servizi immediatamente successiva sono
  senza `section-line`, perche i loro bordi sovrapposti si separerebbero durante
  pin e sticky scroll; prima del termine del pin, il fondale
  `data-listings-backdrop` passa a opacita piena in base al progresso dello
  `ScrollTrigger`, impedendo al bordo composito inferiore della hero di
  attraversare verticalmente lo sfondo della gallery; la classe
  `scrollbar-hidden` nasconde la barra nativa del viewport senza disabilitare lo
  scorrimento orizzontale manuale;
- gli elementi con `data-animate` fanno reveal on scroll usando transform e
  opacity, con promozione temporanea del layer;
- `data-animate="image"` usa scale reveal senza animare `clip-path`;
- `data-parallax` applica parallax leggero legato allo scroll solo con
  `(hover: hover) and (pointer: fine)`;
- `ScrollTrigger.config({ ignoreMobileResize: true })` evita refresh durante le
  variazioni verticali della viewport mobile causate dalle barre del browser;
- hero, viewport e track della gallery hanno layer compositi mirati; il
  viewport della gallery usa paint containment;
- `prefers-reduced-motion: reduce` neutralizza reveal e parallax;
- cleanup automatico tramite scope `useGSAP`.

## 15. Configurazione

### `.env.example`

Variabili:

- `VITE_SUPABASE_URL`;
- `VITE_SUPABASE_PUBLISHABLE_KEY`;
- `VITE_APP_DOMAIN`;
- `VITE_APP_NAME`;
- `VITE_SUPABASE_PROJECT_ID`;
- `VITE_APP`.

Le variabili `VITE_*` sono esposte al browser.

### `index.html`

Contiene:

- lingua `it`;
- favicon `/favicon.svg`;
- viewport;
- meta description;
- title `Gemüt Capital - Mediazione immobiliare a Padova`;
- script `/src/main-landing.tsx`.

### Vite

`vite.config.ts`:

- `base: "/"`;
- dev server host `::`, porta `8080`;
- plugin React SWC;
- alias `@`;
- output `dist`;
- filtro warning `PLUGIN_WARNING`.

### Vercel

`vercel.json`:

- `npm install`;
- `CI=false npm run build`;
- output `dist`;
- rewrite globale verso `/index.html`.

La directory `api/` contiene `drive-images.ts`, funzione Edge pubblica usata
solo come proxy same-origin della vista pubblica delle cartelle Drive. Non usa
Google API, OAuth o chiavi.

## 16. Test e verifiche

Comandi previsti:

```bash
npm test
npm run lint
npm run build
```

In questo ambiente `npm` non era disponibile nel PATH. Le verifiche sono state
eseguite con il runtime Node bundled:

```bash
/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-requirements.test.mjs
/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/eslint/bin/eslint.js .
/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/typescript/bin/tsc -p tsconfig.app.json
/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/vite/bin/vite.js build
```

Test statici coprono:

- app shell public-only;
- route e redirect;
- contenuti centralizzati;
- form su `lead_submissions`;
- assenza di route e contenuti UAV o servizi personalizzati;
- assenza degli asset pubblici rimossi per UAV e servizi personalizzati;
- uso degli asset WebP attivi in `public/images`;
- wiring della transizione curve swipe della home;
- route e wiring della gallery immobili;
- lettura CSV pubblico, parsing righe, assenza di fallback hardcoded;
- parsing della vista pubblica delle cartelle Drive senza Google API;
- filtro immobili nelle pagine vendita e locazioni;
- asset richiesti.

Limiti:

- non verificano rendering visuale;
- non verificano invio Supabase reale;
- non verificano CRM reale;
- non verificano automaticamente una cartella Drive reale del cliente finche
  nel foglio non viene inserito un relativo link pubblico;
- non verificano layout responsive in browser.

## 17. Debito e limiti noti

- `BookingPage` non ha calendario reale.
- `PrivacyPage` e sintetica.
- Cookie analytics/marketing sono solo preferenze locali.
- I dati immobili dipendono dalla disponibilita dell'export CSV pubblico del
  foglio.
- L'elenco immagini usa il markup pubblico `embeddedfolderview` di Google
  Drive, non un'API contrattuale: se Google modifica quel markup, il parser va
  aggiornato.
- Le cartelle e le immagini Drive devono restare pubbliche; in caso contrario
  la scheda usa solo eventuali link diretti presenti nel foglio.
- Il CRM esterno e hardcoded in `src/lib/leads.ts`.
- Il form richiede che la tabella `lead_submissions` sia creata su Supabase reale.
- Il font Minion Variable Concept e richiamato nello stack CSS ma non e incluso
  come file nel repository.
- La working tree iniziale conteneva molte modifiche e molti metadata macOS
  `._*`; non ripristinare modifiche non proprie senza richiesta esplicita.
- Il percorso skill `$caveman` indicato in `AGENTS.md` non risultava presente
  nell'ambiente il 24 giugno 2026; seguire il fallback descritto in `AGENTS.md`.

## 18. Regole future

Prima di modificare:

1. leggere `AGENTS.md`;
2. leggere questo PRD;
3. usare la mappa rapida;
4. controllare `git status`;
5. cercare riferimenti con `rg`;
6. verificare il codice reale.

Dopo modifiche:

1. aggiornare PRD se cambia prodotto, route, dati, schema, asset, build o stato feature;
2. aggiornare AGENTS se cambiano regole operative;
3. eseguire test/lint/typecheck/build pertinenti;
4. controllare il diff.

Una modifica e completa solo quando codice, PRD e verifiche raccontano lo stesso
stato reale del repository.
