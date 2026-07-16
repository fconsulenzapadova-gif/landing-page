# Frontend Patterns

Ultimo aggiornamento: 16 luglio 2026

- Conservare React, Vite, TypeScript e Tailwind; niente provider o librerie globali senza necessità prodotto reale.
- Centralizzare copy, route, servizi e dati societari in `src/content/site.ts`.
- Navigazione primaria: Home, Immobili, Servizi. Sottomenu Servizi: vendita, locazione, valutazione anche mobile.
- Catalogo completo solo in `/immobili`; non duplicarlo nelle pagine servizio.
- Home senza elenco servizi; percorsi servizi in `/servizi` e sottomenu.
- Unico form pubblico: wizard `RequestsPage.tsx` + trasporto `leads.ts`;
  validazione autorevole e persistenza restano nel Worker Cloudflare.
- Componenti condivisi piccoli, data-driven, responsive e accessibili.
- Motion GSAP con scope/cleanup, `prefers-reduced-motion`; parallax solo puntatore fine; touch conserva scroll nativo.
- Prima di rinominare/spostare/eliminare, cercare riferimenti con `rg`.
- Distinguere sempre feature attive, parziali, legacy/dormienti e simulate.
- Non inventare route, API, tabelle, env var o dati societari.
