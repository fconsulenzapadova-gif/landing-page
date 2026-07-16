# Active Context

Ultimo aggiornamento: 16 luglio 2026

## Stato corrente

- App pubblica React/Vite in sviluppo sul branch `main`.
- Working tree già sporca prima della migrazione memoria, con modifiche prodotto e metadata macOS `._*` non appartenenti a questa migrazione.
- Non ripristinare, sovrascrivere o includere automaticamente modifiche non proprie.

## Focus handoff

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
  `.env` locale, con referrer/origini consentiti per localhost e i due domini
  pubblici. La variabile Vercel di produzione e il collaudo live restano in
  attesa dell’accesso Vercel dell’utente nella scheda Chrome già aperta.
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
