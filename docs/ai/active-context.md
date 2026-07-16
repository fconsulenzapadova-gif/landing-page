# Active Context

Ultimo aggiornamento: 16 luglio 2026

## Stato corrente

- App pubblica React/Vite in sviluppo sul branch `main`.
- Working tree già sporca prima della migrazione memoria, con modifiche prodotto e metadata macOS `._*` non appartenenti a questa migrazione.
- Non ripristinare, sovrascrivere o includere automaticamente modifiche non proprie.

## Focus handoff

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
