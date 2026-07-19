# Active Context

Ultimo aggiornamento: 19 luglio 2026

## Stato corrente

- App pubblica React/Vite in sviluppo sul branch `main`.
- Working tree già sporca prima della migrazione memoria, con modifiche prodotto e metadata macOS `._*` non appartenenti a questa migrazione.
- Non ripristinare, sovrascrivere o includere automaticamente modifiche non proprie.

## Focus handoff

- Dettaglio `/immobili/:slug` riprogettato mobile-first dopo iterazione
  Superdesign: gallery full-bleed prima di ogni testo, `Indietro` basato su
  cronologia, prezzo/zona/titolo compatto e fatti principali in ordine di
  priorità. CTA sticky mobile si arresta prima del footer; desktop usa card
  laterale sticky. Gallery, lightbox, frecce touch e ritorno lista verificati in
  browser a 390 px e 1440 px senza overflow o errori console. Test, lint e build
  superati; nessun deploy eseguito.

- Catalogo immobili ora su Cloudflare: D1 (`listings`, `listing_images`) +
  Workers KV (`LISTING_MEDIA`) dietro `GET /api/listings` e `/media/*`.
  Integrazione Google Sheets/Drive e funzione Vercel rimosse. Tre record demo e
  sei immagini demo sono presenti localmente e nel backend remoto. Worker
  `gemut-leads-api` versione `a9e9dd75-d19a-4c34-8059-d78279c99f10` distribuito.
  Frontend Vercel produzione `dpl_5o69BcbZH97Fb4nLwXmyx85AC6bX` attivo su
  `www.gemutcapital.com`; catalogo, filtro locazione, dettaglio e immagini KV
  verificati in browser senza errori console.
  Frontend deriva endpoint catalogo da `VITE_LEADS_API_URL` se
  `VITE_LISTINGS_API_URL` non è configurata. Su localhost prova il Worker locale
  e ripiega automaticamente sul catalogo remoto read-only: home e `/immobili`
  mostrano i tre demo anche senza `worker:dev`. Nessun endpoint CRM di scrittura
  è ancora esposto.
  Lifecycle reveal asincrono corretto: `ListingsPage` reinizializza GSAP quando
  cambia il numero di record; `ListingPage` monta il componente animato solo
  dopo il caricamento. Card e dettaglio non restano più a `opacity: 0`.
  `/immobili` non mostra più la hero fotografica: parte direttamente da titolo,
  filtri e lista.

- Wizard `/richieste` adattato ai telefoni piccoli: titoli restano in alto,
  contenuti centrati e pannelli lunghi scorrono internamente; le azioni restano
  ancorate. La schermata iniziale conserva gerarchia e dimensioni originali,
  comprimendole solo sui viewport bassi. La mappa area aggiunge un vertice a ogni tap, conferma
  automaticamente il poligono dal terzo punto, permette ulteriori punti e non
  consente selezione o trascinamento del tracciato.

- Wizard `/richieste` ora a schermate fisse, senza footer né scroll del documento:
  obiettivi 2×2 su mobile con descrizione e avanzamento al tap, dettagli
  immobile e consenso contatti divisi in scene. La ricerca apre direttamente
  la sola mappa, con il titolo `Disegna la zona` e la domanda
  `Dove ti piacerebbe abitare?`; vendita e
  locazione del proprietario accettano solo indirizzo, con campo sopra mappa
  interattiva che riempie lo spazio libero: i suggerimenti Geoapify aggiornano
  la posizione e un clic sulla mappa inserisce l’indirizzo (chiave pubblica
  `VITE_GEOAPIFY_API_KEY`, da limitare al dominio). La mappa riempie lo spazio
  disponibile, l’area viene confermata automaticamente e i controlli
  annulla/reset sono icone compatte; le attribuzioni non hanno una fascia
  esterna. Testo avanzamento solo nella prima schermata; la barra segue tutte
  le otto schermate effettive, non solo le tre macro-sezioni. Da posizione in
  poi le azioni restano ancorate in basso: indietro a sinistra e avanti a
  destra; i titoli del wizard non usano icone decorative e tutti i contenuti
  delle schermate (fuori dalla mappa) sono centrati verticalmente. Test, lint
  e build superati dopo l’integrazione Geoapify.
- Nelle schermate immobile, `Budget` usa due campi affiancati minimo/massimo
  più `Da definire`; le pillole tempistica sono centrate e il campo `Altro
  periodo` è sempre visibile; anche `Dettagli facoltativi` resta sempre aperto.
  Test, lint e build superati.
- Nella schermata consenso il campo note facoltative è sempre aperto e non ha
  più la pillola mostra/nascondi.
- Il wizard salva automaticamente in `localStorage` dati, geometria e
  sotto-schermata corrente: il refresh ripristina esattamente la compilazione.
  La bozza scade dopo 24 ore, viene rimossa su invio riuscito/nuova richiesta e
  non contiene token Turnstile, honeypot o metadati tecnici.
- Progetto Geoapify `Gemüt Capital Website` creato e chiave configurata in
  `.env` locale e su Vercel Production, con referrer/origini consentiti per
  localhost e i due domini pubblici. Il frontend aggiornato è in produzione
  con deployment Vercel `dpl_7E9ggAhKfVpWVXfEcgS5Fx1wjEA5`; entrambi gli alias
  pubblici rispondono `200` su `/richieste` e il bundle distribuito contiene
  l’integrazione Geoapify.
- Wizard guidato distribuito in produzione: migrazione D1
  `0003_add_lead_location_geometry.sql`, Worker `gemut-leads-api` versione
  `35863fff-9915-436c-a072-b5245932f924` e deployment Vercel
  `dpl_FWvmKSy8P7b2idnM7oVAYdL8CXaA`. Gli alias `gemutcapital.com` e
  `www.gemutcapital.com` sono attivi; smoke test pubblico su `/richieste`
  conferma mappa predefinita per la ricerca, switch testuale esclusivo e assenza
  di error overlay/console.
- Migrazione form Cloudflare distribuita: Worker, D1, Turnstile e frontend Vercel
  sono attivi. Health, CORS, migrazioni, build e controlli locali superati.
- Fix `Nuova richiesta` distribuito in produzione con deployment Vercel
  `dpl_8Wfgrj9shN2baH3HoQv9VR33Xr6K`; collaudo end-to-end sul dominio pubblico superato.
- Su localhost Turnstile usa la chiave ufficiale di test invisibile e il form
  punta solo al Worker locale; la fascia rossa di test non compare in produzione.
- Notifica lead Gmail API attiva nel Worker e limitata allo scope `gmail.send`.
  Client ID, client secret e refresh token sono secret Cloudflare; nessun valore
  sensibile è nel repository. Il messaggio di prova è stato inviato a
  `filippo@gemutcapital.com` e il Worker remoto è distribuito.
- Cloudflare è DNS autorevole per `gemutcapital.com`; i record di Vercel e Google
  Workspace, inclusi MX, SPF e DKIM, sono stati preservati.
- Metodo memoria migrato da PRD monolitico in root a indice `docs/ai/MEMORY.md`.
- Product brief canonico: `docs/product/PRD.md`.
- Root `PRD.md`: solo puntatore compatibilità.
- Prima di cambiare prodotto, verificare codice reale e riallineare memoria pertinente.
