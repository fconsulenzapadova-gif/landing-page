# Frontend Patterns

Ultimo aggiornamento: 16 luglio 2026

- Conservare React, Vite, TypeScript e Tailwind; niente provider o librerie globali senza necessità prodotto reale.
- Centralizzare copy, route, servizi e dati societari in `src/content/site.ts`.
- Navigazione primaria: Home, Immobili, Servizi. Sottomenu Servizi: vendita, locazione, valutazione anche mobile.
- Catalogo completo solo in `/immobili`; non duplicarlo nelle pagine servizio.
- Home senza elenco servizi; percorsi servizi in `/servizi` e sottomenu.
- Unico form pubblico: wizard `RequestsPage.tsx` + trasporto `leads.ts`;
  validazione autorevole e persistenza restano nel Worker Cloudflare.
- Centralizzare mapping, label e coppie `requestType`/`requestRole` degli
  intenti in `src/lib/requestWizard.ts`; non duplicarli nei componenti.
- Isolare rendering e lifecycle MapLibre in un componente lazy dedicato; la
  pagina e il selettore posizione gestiscono solo stato, fallback e payload.
- Fornire sempre un equivalente testuale completo per ogni selezione su mappa.
- Montare un solo pannello posizione alla volta: testo e mappa si sostituiscono,
  non devono mai coesistere nello stesso stato UI.
- Tenere provider cartografico e URL dello stile sostituibili, senza diffondere
  token o dipendenze dal provider negli altri componenti.
- Componenti condivisi piccoli, data-driven, responsive e accessibili.
- Motion GSAP con scope/cleanup, `prefers-reduced-motion`; parallax solo puntatore fine; touch conserva scroll nativo.
- Prima di rinominare/spostare/eliminare, cercare riferimenti con `rg`.
- Distinguere sempre feature attive, parziali, legacy/dormienti e simulate.
- Non inventare route, API, tabelle, env var o dati societari.
