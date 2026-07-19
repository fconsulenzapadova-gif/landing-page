# Development Runbook

Ultimo aggiornamento: 18 luglio 2026

## Avvio

1. Leggere `docs/ai/MEMORY.md`, `docs/ai/active-context.md`, `docs/ai/progress.md` e i documenti pertinenti.
2. Eseguire `git status --short --branch`.
3. Usare la mappa rapida in `docs/product/PRD.md` e verificare codice reale con `rg`.
4. Preservare modifiche utente e metadata non pertinenti.

## Comandi standard

```bash
npm test
npm run lint
npm run build
```

Typecheck esplicito quando pertinente:

```bash
npx tsc -p tsconfig.app.json --noEmit
```

Se `npm` non è nel `PATH`, caricare prima il runtime workspace disponibile e usare Node bundled per test, ESLint, TypeScript e Vite. Non codificare un path utente assoluto nella memoria.

## Verifica minima prima handoff

1. Eseguire check più stretti utili alla modifica; per cambi architetturali/prodotto usare test, lint, typecheck e build quando disponibili.
2. Controllare `git diff --check` e diff dei soli file toccati.
3. Aggiornare documento memoria più specifico.
4. Confermare coerenza tra codice, stato feature e `docs/product/PRD.md`.

## Catalogo Cloudflare

- Dati immobili: tabelle `listings` e `listing_images` in D1, schema in
  `cloudflare/migrations/0004_create_listings.sql`.
- Media: Workers KV `LISTING_MEDIA`; ogni chiave deve essere immutabile e avere
  metadata `contentType` ed `etag`.
- API pubblica: `GET /api/listings` e `GET /media/<object-key>`; nessuna scrittura pubblica.
- Demo: `cloudflare/seeds/demo-listings.sql`, eseguibile localmente con
  `npm run worker:db:seed-listings:local` e da remoto con
  `npm run worker:db:seed-listings`. Il seed sostituisce solo ID `demo-*`.
- Futuro CRM: scrivere prima media con nuova chiave, poi record/relazioni D1 in
  transazione; pubblicare impostando `status = 'published'` solo a dati completi.

Workers KV Free include 1 GB, 100.000 letture/giorno e 1.000 scritture/giorno.
Ottimizzare le immagini prima dell'upload. Se il catalogo supera questi limiti,
migrare il solo adapter media a R2 mantenendo invariati object key e API pubblica.

Configurazione Cloudflare in `cloudflare/wrangler.jsonc`, Worker in
`cloudflare/src/`, schema versionato in `cloudflare/migrations/`.

## Cloudflare lead

Verifica e sviluppo locale:

```bash
npm run worker:check
npm run worker:db:migrate:local
npm run worker:dev
```

Per lo sviluppo, copiare `cloudflare/.dev.vars.example` in
`cloudflare/.dev.vars`; contiene solo la chiave Turnstile di test ufficiale.
Su `localhost` il frontend usa automaticamente il widget di test invisibile e
invia esclusivamente al Worker locale su `127.0.0.1:8787`. In questo modo non
scrive dati di prova nel database remoto e non mostra il banner Turnstile di test.
In locale la notifica viene ignorata se i secret Gmail non sono presenti. I test
del contenuto MIME e del trasporto usano mock e non inviano email reali.

Rollout compatibile dei campi posizione guidata:

1. applicare prima la migrazione D1 additiva che aggiunge le colonne nullable;
2. distribuire il Worker di compatibilità;
3. distribuire il frontend che invia `requestRole`, `locationMode` e
   `locationGeometry`;
4. osservare errori di validazione, inserimenti e notifiche durante la finestra
   di transizione;
5. solo in un rilascio successivo, quando non arrivano più client legacy,
   valutare un Worker rigoroso che richieda sempre i tre nuovi campi.

Il Worker di compatibilità considera legacy un payload solo se tutti e tre i
campi nuovi sono assenti. In quel caso deduce `acquisto → cerca`,
`vendita → proprietario` e `locazione → cerca`, usando posizione testuale e
geometria nulla. Un payload parzialmente aggiornato resta non valido e non viene
reinterpretato. Questa modifica documenta e prepara l'ordine di rollout: non
distribuisce Worker o frontend e non applica migrazioni remote.

Prima distribuzione remota:

1. autenticare Wrangler con `wrangler login --use-keyring`;
2. creare D1 con `wrangler d1 create gemut-leads-db` e riportare il
   `database_id` in `cloudflare/wrangler.jsonc`;
3. applicare `npm run worker:db:migrate`;
4. creare un widget Turnstile per `gemutcapital.com` e
   `www.gemutcapital.com`;
5. salvare il secret con `wrangler secret put TURNSTILE_SECRET_KEY`;
6. distribuire con `npm run worker:deploy`;
7. impostare sul frontend `VITE_LEADS_API_URL` e
   `VITE_TURNSTILE_SITE_KEY`, poi ridistribuire Vercel.

Notifiche email:

1. abilitare Gmail API in un progetto Google Cloud interno all'organizzazione;
2. concedere esclusivamente lo scope
   `https://www.googleapis.com/auth/gmail.send`;
3. creare un client OAuth Desktop dedicato e salvare nel Worker i secret
   `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET` e `GMAIL_REFRESH_TOKEN`;
4. usare `scripts/authorize-gmail.mjs` per l'autorizzazione iniziale o il rinnovo:
   lo script carica il refresh token nel Worker e invia un messaggio di prova;
5. distribuire il Worker e verificare health, CORS e log Worker.

La notifica parte da e arriva a `filippo@gemutcapital.com`. Non abilitare
Cloudflare Email Service a pagamento e non sostituire gli MX di Google Workspace
con Email Routing.

Lettura operativa dei lead: usare dashboard D1 oppure `wrangler d1 execute`
con query `SELECT` mirate. Non aggiungere API pubbliche di lettura.
