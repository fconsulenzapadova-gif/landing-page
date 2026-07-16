# Progress

## Milestone

- 16 luglio 2026 — corretto e distribuito il reset post-conferma: `Nuova richiesta` rimonta il wizard visibile al primo passaggio, con regressione coperta da test e collaudo browser locale/produzione.
- 16 luglio 2026 — Turnstile reso normalmente invisibile e conferma form sostituita con scena GSAP accessibile e rispettosa di `prefers-reduced-motion`.
- 16 luglio 2026 — form richieste riprogettato come wizard e storage lead
  migrato da Supabase/CRM a Cloudflare Worker + D1 + Turnstile.
- 16 luglio 2026 — Worker/D1/Turnstile e frontend distribuiti; localhost isolato
  dal database remoto con verifica Turnstile di test invisibile.
- 16 luglio 2026 — notifica lead distribuita tramite Gmail API con il solo scope
  `gmail.send`; OAuth salvato nei secret Worker e messaggio di prova inviato senza
  attivare servizi a pagamento.
- 16 luglio 2026 — DNS autorevole migrato su Cloudflare preservando record web,
  Google Workspace, SPF e DKIM; Worker notifiche distribuito e health/CORS verificati.
- 16 luglio 2026 — adottato bootstrap memoria portabile: indice AI, PRD prodotto, overview architettura, decision record, runbook, pattern e contesto attivo.
- 1 luglio 2026 — documentato stato app public-only, catalogo immobili da Google Sheets/Drive, navigazione Home/Immobili/Servizi e motion GSAP.

## Stato

- Migrazione memoria: completata.
- Stato prodotto e limiti: vedere `docs/product/PRD.md`.
- Attività temporanee o handoff: vedere `docs/ai/active-context.md`.
