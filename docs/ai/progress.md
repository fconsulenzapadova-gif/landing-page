# Progress

## Milestone

- 16 luglio 2026 — UI del wizard richieste aggiornata come app a schermate:
  viewport bloccato senza footer o scroll, obiettivi 2×2 su mobile con
  avanzamento al tap, dettagli immobile e consenso contatti separati. Dalla
  posizione in poi i comandi sono fissi in basso, con indietro a sinistra e
  avanti a destra. La ricerca mostra direttamente la sola mappa, mentre per i
  proprietari è consentito solo l’indirizzo; chi cerca vede `Dove ti
  piacerebbe abitare?`, la mappa riempie lo spazio libero e l’area è confermata
  in modo automatico con controlli annulla/reset a icona. Le attribuzioni non
  hanno una fascia esterna. Il testo di avanzamento resta soltanto all’inizio.
  Test, lint, build e controllo browser superati.
- 16 luglio 2026 — wizard richieste guidato distribuito in produzione con
  migrazione D1 additiva, Worker compatibile e frontend Vercel; health Worker,
  build remota e smoke test pubblico su mappa/testo superati.
- 16 luglio 2026 — wizard richieste guidato completato e verificato in locale
  su viewport desktop e mobile: quattro intenti, posizione testuale o area
  MapLibre/OpenFreeMap, payload e geometria D1, fallback WebGL, invio Worker e
  reset accessibile; nessun deploy remoto eseguito in questa milestone.
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
