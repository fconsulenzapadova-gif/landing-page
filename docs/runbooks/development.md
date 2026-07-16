# Development Runbook

Ultimo aggiornamento: 16 luglio 2026

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

## Workflow dati esterni

- Google Sheet: pubblicare solo righe con `Pubblica * = Sì`; URL cartella Drive come testo semplice o ID.
- Google Drive: cartella/file accessibili a chiunque abbia link; `copertina.*` diventa prima immagine.
- Cloudflare lead: configurazione in `cloudflare/wrangler.jsonc`, Worker in
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
