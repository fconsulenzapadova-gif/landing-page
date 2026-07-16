# ADR 0003: raccolta lead su Cloudflare Worker e D1

Stato: accettata

Data: 16 luglio 2026

## Contesto

Il form pubblico scriveva direttamente dal browser su Supabase e inoltrava i
dati a un CRM Vercel hardcoded. Il flusso esponeva al client la configurazione
del provider database e distribuiva lo stesso lead su più sistemi.

## Decisione

Usare un Cloudflare Worker come unico confine di scrittura, Cloudflare D1 come
archivio e Turnstile come verifica antispam. Il frontend invia un payload
idempotente al Worker; validazione, controllo origine e scrittura avvengono lato
server. Dopo un nuovo inserimento, il Worker usa Gmail API con scope `gmail.send`
per inviare una notifica interna con i dati del lead. Nessuna API pubblica
consente di leggere i lead.

Il frontend resta su Vercel. Il Worker è distribuito separatamente e il suo URL
è configurato tramite `VITE_LEADS_API_URL`.

## Conseguenze

- Rimossi Supabase JS, schema PostgreSQL e inoltro CRM esterno.
- D1 e Worker rientrano nei limiti del piano Cloudflare gratuito finché il
  traffico resta sotto le quote documentate.
- Deploy e migrazioni richiedono Wrangler autenticato.
- Turnstile richiede site key frontend e secret Worker distinti.
- Consultazione/modifica stato lead avviene tramite dashboard o CLI D1 finché
  non esiste una necessità reale di dashboard riservata.
- Il recapito email è best-effort: un errore di consegna non cancella il record D1.
- Il trasporto Gmail API usa solo `gmail.send`; client secret e refresh token
  restano nei secret del Worker.
- Il flusso non richiede Cloudflare Workers Paid, Cloudflare Email Service o un
  provider email commerciale.
