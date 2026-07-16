# PRD - Gemut Capital

Ultimo aggiornamento: 16 luglio 2026

## 1. Scopo

Questo documento descrive lo stato reale del sito Gemut Capital dopo la
riscrittura public-only. È il product brief canonico indicizzato da
`docs/ai/MEMORY.md`.
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
- UI dinamica con hero full-screen fotografica, headline animata, navigazione
  misurata sullo spazio reale, reveal on scroll, parallax leggero, transizione
  curve swipe dalla hero al contenuto e gallery orizzontale di immobili letti
  dal foglio Google Sheets pubblico.

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
| Catalogo immobili | `src/pages/ListingsPage.tsx` |
| Immagini da cartelle Drive pubbliche | `api/drive-images.ts` |
| Card immobile condivisa | `src/components/ListingCard.tsx` |
| Carosello e lightbox immobile | `src/components/ListingGallery.tsx` |
| Dettaglio immobile | `src/pages/ListingPage.tsx` |
| Pagina servizi aggregata | `src/pages/ServicesPage.tsx` |
| Pagine acquisto/vendita/locazioni | `src/pages/ServicePage.tsx`, `src/content/site.ts` |
| Pagina valutazione patrimonio | `src/pages/SpecialistPage.tsx`, `src/content/site.ts` |
| Form richieste | `src/pages/RequestsPage.tsx` |
| Invio lead Cloudflare | `src/lib/leads.ts`, `cloudflare/src/index.ts` |
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
| Schema lead D1 | `cloudflare/migrations/` |
| Test | `tests/site-requirements.test.mjs`, `tests/cloudflare-leads.test.mjs` |
| HTML base e SEO | `index.html` |
| Config Vite | `vite.config.ts` |
| Deploy Vercel | `vercel.json`, `.vercelignore`, `public/CNAME` |
| Indice memoria agenti | `docs/ai/MEMORY.md` |

## 5. Stack

- React 18;
- TypeScript;
- Vite 8 con React SWC;
- React Router 6;
- Tailwind CSS;
- Lucide React;
- GSAP con `@gsap/react` e `ScrollTrigger`;
- Cloudflare Workers, D1 e Turnstile;
- Node test runner;
- Vercel.

Dipendenze runtime dichiarate dopo la pulizia:

- `@gsap/react`;
- `gsap`;
- `lucide-react`;
- `react`;
- `react-dom`;
- `react-router-dom`;
- `tailwindcss-animate`.

Wrangler è una dipendenza di sviluppo per validare, migrare e distribuire il
backend Cloudflare.

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
- navigazione principale limitata a Home, Immobili e Servizi;
- pagine principali data-driven;
- componenti condivisi piccoli e senza dipendenze shadcn;
- immobili caricati nel browser dall'export CSV pubblico del Google Sheet
  `15gP-IIWheuid1GCGGRMJk5vysmq3Oa3rIhVT8ndD5eg`, senza Google Sheets API;
- cartelle immagini lette dalla funzione Vercel `api/drive-images.ts` tramite
  la vista HTML pubblica `embeddedfolderview`, senza Google Drive API o chiavi;
- la stessa funzione e montata come middleware in dev e preview Vite, evitando
  differenze tra localhost e produzione;
- unico flusso form in `RequestsPage` + `submitLeadRequest`;
- animazioni create nelle pagine tramite `usePageAnimations`, con `useGSAP`,
  scope locale, `ScrollTrigger` e rispetto di `prefers-reduced-motion`;
- `Footer` usa lo stesso hook con scope proprio, perche e fuori dall'`Outlet`
  pagina ma contiene elementi `data-animate`;
- asset del design system serviti da `public/design-system`.

## 7. Routing

| Route | Componente/comportamento | Stato |
| --- | --- | --- |
| `/` | `HomePage` | Attivo |
| `/immobili` | `ListingsPage`, catalogo completo vendita e locazione | Attivo |
| `/servizi` | `ServicesPage`, vendita, locazione e valutazione patrimonio | Attivo |
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
  sticky con fondo paper normale traslucido, backdrop blur, e headline centrale
  "Casa nuova, stesso GEMÜT"; su telefono mantiene `text-4xl` e usa interlinea
  `1.1` quando va a capo; da `sm` in su resta su una riga, ripristina interlinea
  `1.08` e usa una scala desktop ridotta
  `clamp(2.5rem, 5.5vw, 4.75rem)`;
- headline hero animata una sola volta con GSAP core (`gsap.fromTo`,
  `gsap.matchMedia`) e fallback per `prefers-reduced-motion`; al termine
  l'animazione rimuove gli stili inline di opacita e transform, mentre lo
  scroll non modifica piu la headline, garantendo testo e `GEMÜT` al 100%;
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
  applicano divisori propri durante l'overlap e anche la sezione chi siamo
  immediatamente successiva resta senza bordo superiore, evitando linee
  transitorie che scorrono verticalmente sullo sfondo; un fondale color carta
  dentro la sticky gallery diventa opaco subito prima dello sgancio del pin e
  copre il limite inferiore della hero mentre questa riprende a scorrere; il viewport
  mantiene lo scroll orizzontale nativo ma ne nasconde la barra overlay, che
  altrimenti apparirebbe temporaneamente come una linea durante lo scroll; su
  viewport mobile usa immagini JPEG ridimensionate a massimo 1280px per
  limitare memoria di decodifica e texture GPU; su tutti i dispositivi che
  espongono un puntatore touch (`any-pointer: coarse`) la gallery non usa lo
  scrub orizzontale legato allo scroll verticale: il track resta statico e
  avanza solo tramite lo scorrimento orizzontale nativo dell'utente; la sezione
  mantiene spazio pari a un viewport piu la durata della curve swipe, cosi lo
  sticky conserva le card centrate verticalmente durante tutta la transizione
  hero; sui dispositivi desktop con solo puntatore fine mantiene l'animazione
  automatica esistente;
- CTA verso `/richieste` e `/prenotazione`;
- sezione chi siamo con `/images/profile.webp`;
- quattro value proposition;
- card scura per valutazione patrimonio;
- CTA finale azzurra verso il form, con testi in ink nero.

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
- link cartella immagini pubblica.

Il valore cartella deve essere URL Drive completo in testo semplice (o ID
cartella), non smart chip/hyperlink con etichetta personalizzata: l'export CSV
pubblico espone il testo visualizzato, non l'URL nascosto.

L'ordine pubblico coincide con l'ordine fisico delle righe nel foglio. Non
esiste una colonna ordine. Il testo alternativo immagini non e gestito nel
foglio: viene generato dal sito combinando titolo e comune.

`api/drive-images.ts` riceve il link cartella, legge la vista HTML pubblica
Google Drive e restituisce solo JPG, JPEG, PNG, WebP, AVIF e GIF. I file sono
ordinati per nome. Se esiste un file con nome base `copertina` (estensione e
maiuscole irrilevanti), viene spostato in prima posizione e usato come
copertina; altrimenti viene usata la prima immagine ordinata per nome. Le altre
immagini alimentano la gallery del dettaglio. La cartella e i file devono
essere accessibili a chiunque abbia il link. Le risposte sono memorizzate dalla
CDN fino a 5 minuti.

I cinque esempi iniziali sono stati rimossi dal codice e inseriti nel foglio
come righe `DEMO-001` ... `DEMO-005`. Le immagini arrivano solo dalla cartella
pubblica associata alla riga. Se una riga non ha cartella o la cartella non
restituisce immagini, il sito usa un'immagine locale neutra coerente con
vendita o locazione. Se il foglio non e raggiungibile o non contiene righe
pubblicate, il sito non inventa immobili e restituisce una lista vuota.

`ListingPage` renderizza dati reali per `/immobili/:slug`. La gallery hero usa
`ListingGallery`: carosello con frecce, contatore e miniature, piu lightbox a
schermo intero. Il lightbox supporta chiusura su sfondo, `Escape`, navigazione
con frecce tastiera, focus iniziale e focus trap. Con una sola immagine restano
attivi apertura e chiusura del lightbox, senza controlli di navigazione. Il
contenitore delle miniature include spazio interno per mostrare interamente
bordo e ring della miniatura selezionata. Le CTA portano al form richieste con
`type=vendita` o `type=locazione`.

`ListingsPage` renderizza su `/immobili` tutte le righe pubblicate, sia in
vendita sia in locazione. Il filtro iniziale e `Tutti`; i filtri `In vendita`
e `In locazione` restringono la griglia nel browser. Durante il caricamento e
quando il filtro non produce risultati vengono mostrati stati testuali
espliciti. Le card portano al dettaglio `/immobili/:slug`.

### Servizi principali

`ServicesPage` e la destinazione principale `/servizi` e contiene tre sezioni:

- come Gemüt Capital vende gli immobili;
- come Gemüt Capital mette in locazione gli immobili;
- valutazione del patrimonio immobiliare.

La pagina non usa una hero introduttiva. Ogni sezione riusa contenuti
centralizzati in `site.ts` e mostra solo immagine, titolo, breve introduzione e
CTA verso la relativa pagina di dettaglio: `/vendita-immobili`, `/locazioni` o
`/valutazione-patrimonio`. Approccio completo, passaggi operativi e CTA di
contatto restano nelle pagine di dettaglio. La pagina non include il servizio
acquisto.

`ServicePage` renderizza acquisto, vendita e locazioni partendo dai dati in
`site.ts`. Vendita, locazioni e valutazione sono raggiungibili da `/servizi` e
dal sottomenu; la route acquisto resta attiva per accesso diretto. Ogni
servizio definisce:

- route;
- immagine hero;
- icona;
- testo summary;
- highlight;
- metodo di lavoro;
- benefici;
- CTA verso form;
- link WhatsApp con messaggio precompilato.

Le pagine vendita e locazioni non duplicano il catalogo immobili: tutte le
card, sia vendita sia locazione, restano centralizzate in `/immobili`.

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
- `src/components/Turnstile.tsx`;
- `cloudflare/src/index.ts`;
- `cloudflare/src/validation.ts`.

La pagina apre direttamente sul wizard, senza header introduttivo, eyebrow,
testo introduttivo o immagine.

Campi:

- identificativo richiesta idempotente;
- tipo richiesta;
- tipo immobile;
- zona o indirizzo;
- budget o valore indicativo;
- tempistiche;
- caratteristiche/obiettivi;
- nome;
- telefono;
- email;
- canale di contatto preferito;
- note.
- consenso informativa;
- token Turnstile, non persistito;
- URL sorgente e referrer;
- honeypot invisibile.

Validazione frontend:

- nome obbligatorio;
- almeno telefono o email;
- coerenza tra dato presente e canale di contatto scelto;
- email e telefono con controllo formato base;
- tipo immobile e zona obbligatori;
- consenso informativa obbligatorio;
- Turnstile completato.

Il parametro query `type` accetta:

- `acquisto`;
- `vendita`;
- `locazione`.

Altri valori ricadono su `acquisto`.

UX corrente:

- header compatto con solo titolo;
- wizard in tre passaggi: obiettivo, immobile, contatti;
- domande e label adattate a acquisto, vendita o locazione;
- progressivo accessibile e navigazione avanti/indietro;
- campi responsive, errori associati agli input e stato invio esplicito;
- Turnstile normalmente invisibile con comparsa solo quando Cloudflare richiede interazione;
- scena di conferma animata dopo salvataggio Cloudflare, con fallback immediato per `prefers-reduced-motion`.
- `Nuova richiesta` azzera dati e stato, genera un nuovo identificativo e rimonta il primo passaggio immediatamente visibile.

## 10. Cloudflare lead API

`src/lib/leads.ts` invia JSON all'endpoint configurato in:

- `VITE_LEADS_API_URL`.

Il browser non contiene chiavi D1. Il Worker:

- accetta solo `POST /api/leads` dalle origini configurate;
- valida e limita ogni campo;
- rifiuta honeypot, invii troppo rapidi e Turnstile non valido;
- usa `requestId` come chiave idempotente;
- inserisce in D1 senza esporre endpoint di lettura;
- non salva IP, user agent o token Turnstile;
- non inoltra dati a Supabase, Google Forms o CRM esterni.

## 11. Schema database

`cloudflare/migrations/0001_create_lead_submissions.sql` definisce D1
`lead_submissions` con:

- dati contatto;
- tipo richiesta;
- dettagli immobile;
- canale preferito, URL sorgente e referrer;
- status;
- timestamp;
- indici composti per stato/tipo e data;
- vincoli SQL su tipi richiesta, canali e presenza di un contatto.

L'accesso è mediato dal binding D1 del Worker. Nessuna credenziale database è
esposta nel client.

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

- azzurro brand `#b3e5fc`;
  sulle superfici chiare l'azzurro viene usato come fondo o accento con testo
  ink `#12130f`, mai come colore di testo piccolo;
- fondo principale leggermente piu scuro `#ece9e2`, superficie chiara
  `#f7f5ef` e testo secondario `#666861`;
- contrasto conforme ai livelli AA richiamati da EN 301 549: testo standard
  almeno `4.5:1`, testo grande almeno `3:1`; ink su azzurro raggiunge `13.8:1`
  graphite sul fondo principale `4.66:1` e ink sul fondo paper `14.5:1`;
- wordmark nero nella navigazione renderizzato come testo HTML con `font-brand`,
  evitando SVG testuali esterni che su Safari possono non caricare il font
  corretto; restano variante azzurro cielo da
  `public/design-system/logo/logo-blue.svg` e variante bianca da
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
  le uniche voci principali sono `Home`, `Immobili` e `Servizi`;
  `Servizi` resta un link a `/servizi` e su hover o focus apre un sottomenu
  desktop verso vendita, locazioni e valutazione patrimonio; sulle route di
  dettaglio la voce `Servizi` resta evidenziata; il click su una destinazione
  rimuove il focus e chiude subito il sottomenu prima della navigazione;
  il menu compatto si apre come tendina ad altezza contenuto sotto la barra,
  viene usato sempre sotto i 640px oltre che in caso di collisione e mostra una
  freccia separata accanto al link `Servizi` per espandere le stesse tre
  destinazioni senza impedire al link principale di aprire `/servizi`; da
  `sm` usa una riga con tre voci e CTA; le
  destinazioni sono link testuali con peso `600` anche sulla route attiva,
  senza riquadri o bordi propri, con route attiva ink su fondo azzurro; "Invia richiesta" e
  separata da una linea sottile e usa un trattamento uppercase piu compatto;
  sulla home resta sticky ed e sovrapposta alla hero; su tutte le route usa il
  fondo paper normale in versione traslucida, piu coprente fuori dalla home;
  mantiene backdrop blur.
- hero home con immagine WebP full-bleed, overlay `bg-black/45` con opacita
  iniziale `0.67`, testo centrato senza card e parola `GEMÜT` in font brand
  azzurro, con padding e line-height dedicati per evitare il taglio dei puntini
  della `Ü` su Safari.

Motion attivo:

- `usePageAnimations` registra `@gsap/react` e `ScrollTrigger`;
- `Footer` usa `usePageAnimations` sul proprio elemento root, cosi i blocchi
  footer non restano nascosti dallo stato iniziale CSS dei reveal;
- `HomePage` usa GSAP core per animare headline e immagine della hero iniziale;
  l'intro headline e l'intro immagine sono separate dalle timeline dipendenti
  dagli immobili asincroni, vengono eseguite una sola volta e la headline
  ripulisce opacity/visibility/transform al termine;
- `HomePage` usa una timeline `ScrollTrigger` con `pin`, `pinSpacing: false` e
  `scrub` per la transizione curve swipe dalla hero al contenuto sottostante; il
  path SVG mantiene il morph dinamico originale, mentre immagine e oscuramento
  usano transform/opacity; la headline non viene modificata dallo scroll; il
  pin e tarato corto e non aggiunge
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
  contenitori hero, gallery e la sezione chi siamo immediatamente successiva
  sono senza `section-line`, perche i loro bordi sovrapposti si separerebbero durante
  pin e sticky scroll; prima del termine del pin, il fondale
  `data-listings-backdrop` passa a opacita piena in base al progresso dello
  `ScrollTrigger`, impedendo al bordo composito inferiore della hero di
  attraversare verticalmente lo sfondo della gallery; la classe
  `scrollbar-hidden` nasconde la barra nativa del viewport senza disabilitare lo
  scorrimento orizzontale manuale; quando `any-pointer: coarse` identifica
  almeno un input touch, il tween orizzontale e il relativo `ScrollTrigger`
  non vengono creati, la sezione usa
  `calc(100svh + max(62svh, 380px))` per conservare la centratura sticky fino
  al termine della curve swipe e resta navigabile solo con swipe orizzontale
  nativo; il ramo desktop con solo puntatore fine resta invariato;
- `src/main-landing.tsx` abilita la classe `motion-enabled` prima del render
  React, cosi gli elementi con `data-animate` partono gia nello stato iniziale
  CSS del reveal e non diventano visibili prima che GSAP agganci lo
  `ScrollTrigger`;
- gli elementi con `data-animate` fanno reveal on scroll usando `fromTo` su
  transform e opacity, con promozione temporanea del layer; questo evita il
  mini flicker causato dai vecchi `from` tween che portavano l'elemento a
  opacity 0 solo al momento di avvio del trigger;
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

### Variabili ambiente

Variabili:

- `VITE_LEADS_API_URL`: URL pubblico del Worker;
- `VITE_TURNSTILE_SITE_KEY`: site key pubblica Turnstile;
- `TURNSTILE_SECRET_KEY`: secret del Worker, salvato con Wrangler;
- `ALLOWED_ORIGINS`: origini accettate dal Worker.

Solo le variabili `VITE_*` sono esposte al browser. Il secret Turnstile non
deve mai essere incluso in file frontend o committato.

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
- middleware locale `/api/drive-images` che riusa la funzione Vercel durante
  `vite dev` e `vite preview`;
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
- wizard lead e wiring Cloudflare/D1/Turnstile;
- validazione server del payload lead;
- assenza di route e contenuti UAV o servizi personalizzati;
- assenza degli asset pubblici rimossi per UAV e servizi personalizzati;
- uso degli asset WebP attivi in `public/images`;
- wiring della transizione curve swipe della home;
- scala desktop e interlinea mobile della headline home;
- disattivazione dello scrub automatico della gallery home sui dispositivi
  touch e spazio sticky necessario alla centratura verticale;
- route e wiring della gallery immobili;
- navigazione principale e pagine aggregate `/immobili` e `/servizi`;
- carosello e lightbox accessibili nel dettaglio immobile;
- lettura CSV pubblico, parsing righe, assenza di fallback hardcoded;
- parsing della vista pubblica delle cartelle Drive senza Google API;
- priorita del file `copertina` e fallback alla prima immagine per nome;
- assenza di duplicazione del catalogo nelle pagine vendita e locazioni;
- asset richiesti.
- token colore e rapporti minimi di contrasto della palette.

Limiti:

- non verificano rendering visuale;
- l'invio D1 remoto richiede risorse Cloudflare distribuite;
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
  la scheda usa l'immagine locale neutra del relativo contratto.
- Il form richiede Worker, D1 e Turnstile distribuiti e due variabili frontend.
- La consultazione operativa dei lead avviene da dashboard/CLI D1; non esiste
  ancora una dashboard applicativa riservata.
- Il font Minion Variable Concept e richiamato nello stack CSS ma non e incluso
  come file nel repository.

## 18. Manutenzione memoria

`docs/ai/MEMORY.md` è l'indice canonico. Le modifiche future devono aggiornare
la memoria più specifica:

- questo PRD per scope, route, comportamento utente e stato feature;
- `docs/architecture/` per confini moduli, flussi dati e decisioni tecniche;
- `docs/runbooks/` per comandi, setup e workflow operativi;
- `docs/patterns/` per convenzioni ricorrenti;
- `docs/ai/active-context.md` per stato temporaneo e handoff;
- `docs/ai/progress.md` per milestone durevoli.

Una modifica è completa solo quando codice, memoria pertinente e verifiche
descrivono lo stesso stato reale del repository.
