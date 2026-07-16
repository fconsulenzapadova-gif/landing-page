# Task 7 Report — Adaptive Wizard Integration

## Stato

Task 7 + review findings impl. Wizard 3 step/4 intenti, keyboard sicura,
draft persistenti, note canoniche, payload coerente, routing errori API.
Success/reset Cloudflare preservati. Nessun deploy.

## Scope finale

- `src/pages/RequestsPage.tsx`: orchestrazione React + summary/focus API.
- `src/lib/requestWizardFlow.ts`: controller puro testabile.
- `src/lib/leads.ts`: error fields includono `form` server-side.
- `RequestIntentSelector`: frecce/Home/End selezionano; CTA avanza.
- `LocationSelector`: draft poligono controllato/liftato.
- `ContactStep`: `notes` controllato + errore accessibile.
- Test controller in `tests/request-wizard.test.mjs`; test UI React/happy-dom in
  `tests/request-wizard-ui.test.mjs`; wiring static ridotto in
  `tests/site-requirements.test.mjs`.
- `docs/product/PRD.md`: UX canonica riallineata.

## Findings chiusi

1. Tastiera: selezione intento non cambia step. `Continua` avanza esplicitamente.
2. Reselezione stesso intento ritorna stesso draft; nessun reset posizione,
   geometria o bozza poligono non confermata. Cambio reale resetta solo posizione.
3. `notes` di nuovo visibile, controllato, incluso via spread nel payload/API.
4. `locationGeometry` server → `location`; errori ordinati per step minimo,
   pagina torna a step 0/1/2, focus sul primo campo, summary `role="alert"` espone
   anche errori di step successivi.
5. Controller runtime copre keyboard, transizioni, back/edit, reset, payload
   text/polygon, rifiuto payload incoerente, normalizzazione/routing errori.
6. Avanti, indietro e reset focalizzano heading stabile `tabIndex={-1}` del
   passaggio appena renderizzato.
7. Errori API `requestType`/`requestRole` tornano al passaggio obiettivo e
   focalizzano heading con `aria-invalid` e `aria-describedby` verso errore visibile.
8. Test UI monta pagina reale, invia eventi, usa submit fake e verifica focus.
   `usePageAnimations` e `RequestSuccess` sono isolati via plugin Vite test-only:
   nessun ticker GSAP nel runner. Teardown chiude happy-dom e Vite; nessun
   `force-exit`.

## TDD

RED osservati:

- `ERR_MODULE_NOT_FOUND` per `requestWizardFlow.ts`.
- Wiring pagina assente: `/selectRequestIntent/`.
- Draft lift assente: export `setRequestPolygonDraft` e prop `polygonDraftValue`.
- Payload polygon invalido non lanciava errore: `Missing expected exception`.
- Note senza `aria-invalid`: asserzione wiring fallita.

GREEN focused:

- `tests/request-wizard.test.mjs`: 9/9.
- `request page composes`: 1/1.
- `location selector swaps`: 1/1.
- focused lead/wizard/location/success/reset: 6/6.
- `tests/request-wizard-ui.test.mjs`: 3/3 (step focus, submit/reset, errori intento).

## Verifica finale

Runtime bundled Node `v24.14.0`:

```sh
node --test tests/*.test.mjs
node node_modules/typescript/bin/tsc -p tsconfig.app.json --noEmit
node node_modules/eslint/bin/eslint.js .
node node_modules/vite/bin/vite.js build
git diff --check
```

Tutto exit 0: 47 test pass; typecheck/lint puliti; build 149 moduli. Solo warning
dimensione chunk MapLibre gia lazy; nessun errore. `npm ci --dry-run` conferma
`package-lock.json`; `pnpm install --lockfile-only --frozen-lockfile` conferma
`pnpm-lock.yaml` senza cambiare policy.
