# Frontend Patterns

Ultimo aggiornamento: 19 luglio 2026

- Conservare React, Vite, TypeScript e Tailwind; niente provider o librerie globali senza necessità prodotto reale.
- Centralizzare copy, route, servizi e dati societari in `src/content/site.ts`.
- Navigazione primaria: Home, Immobili, Servizi. Sottomenu Servizi: vendita, locazione, valutazione anche mobile.
- Catalogo completo solo in `/immobili`; non duplicarlo nelle pagine servizio.
- Il frontend immobili consuma solo il DTO `GET /api/listings`; schema D1 e
  storage media restano dietro il Worker. Chiavi media immutabili, ordine in D1.
- Nel dettaglio immobile partire sempre dalla gallery su mobile. Ordinare poi
  prezzo, zona, titolo compatto e dati decisionali; mantenere stato e riferimento
  secondari. `Indietro` usa la cronologia, non una destinazione Home fissa.
- La CTA mobile del dettaglio può essere sticky solo dentro il contenuto pagina:
  deve fermarsi prima del footer e non coprire informazioni. Su desktop usare
  una sola card laterale sticky, senza inventare canali o dati non presenti.
- Home senza elenco servizi; percorsi servizi in `/servizi` e sottomenu.
- Unico form pubblico: wizard `RequestsPage.tsx` + trasporto `leads.ts`;
  validazione autorevole e persistenza restano nel Worker Cloudflare.
- Centralizzare mapping, label e coppie `requestType`/`requestRole` degli
  intenti in `src/lib/requestWizard.ts`; non duplicarli nei componenti.
- Isolare rendering e lifecycle MapLibre in un componente lazy dedicato; la
  pagina e il selettore posizione gestiscono solo stato, fallback e payload.
- Nel wizard a viewport fisso, rendere scrollabile solo il contenuto variabile;
  barra di avanzamento, titoli e azioni devono restare raggiungibili su schermi bassi.
- La mappa area è additiva: ogni tap aggiunge un punto, dal terzo punto il
  poligono è valido; non esporre selezione, trascinamento o modifica del tracciato.
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
