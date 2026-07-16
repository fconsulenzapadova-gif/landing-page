# Task 7 Report — Adaptive Wizard Integration

## Stato

Task 7 impl completa. `RequestsPage` ora orchestra 3 step, 4 intenti, posizione
testo/poligono, fallback mappa e submission coerente. Success/reset Cloudflare
preservati. Nessun deploy.

## Scope

- `src/pages/RequestsPage.tsx`: componenti guidati + stato/transizioni/payload.
- `tests/site-requirements.test.mjs`: integrazione + ownership Turnstile aggiornata.
- `docs/product/PRD.md`: UX/campi canonici riallineati.
- `src/lib/leads.ts`: nessun diff necessario; tipi estesi gia presenti da Task 1.
- `tests/request-wizard.test.mjs`: nessun diff necessario; helper/default gia coperti.

## Comportamento

- Query `type` → intento iniziale; 4 intenti espliciti.
- `cerca` → `polygon`; `proprietario` → `text`.
- Cambio intento conserva campi ragionevoli, azzera solo posizione/modo correlato,
  rimonta selector via `key`, avanza a step 1.
- Draft testo separato; draft mappa preservato dal lifecycle Task 6.
- Pannelli testo/mappa esclusivi; fallback mappa → testo + geometria rimossa.
- Step immobile richiede posizione valida + tipo immobile.
- Submit trimma testo; geometry inviata solo con `locationMode === 'polygon'`;
  posizione poligono sintetizzata via `summarizePolygon`.
- Reset: nuovo `requestId`, intento query-derived, draft vuoti, step 0.

## TDD

RED:

```sh
node --test --test-name-pattern="request page composes" tests/site-requirements.test.mjs
```

Exit 1: `/RequestIntentSelector/` assente in `RequestsPage`.

GREEN: stesso comando → 1 pass, 0 fail.

Regressione intermedia: suite mirata 5/6; test legacy cercava `<Turnstile>` nella
pagina. Asserzione riallineata a `ContactStep`; rerun 6/6.

## Verifica finale

Runtime bundled Node `v24.14.0`:

```sh
node --test tests/*.test.mjs
node node_modules/typescript/bin/tsc -p tsconfig.app.json --noEmit
node node_modules/eslint/bin/eslint.js .
node node_modules/vite/bin/vite.js build
git diff --check
```

Tutto exit 0: 38 test pass, typecheck/lint puliti, build 148 moduli. Build mostra
solo warning dimensione chunk MapLibre gia lazy; nessun errore.
