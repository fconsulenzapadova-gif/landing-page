# Final Review Fix A — Report

Base: `3240975`

## Risultato

- `PropertyDetailsStep` mostra preset di compravendita per acquisto/vendita e
  canoni mensili per `locazione`.
- Label mantenute per ruolo: `Budget massimo`, `Canone mensile indicativo`,
  `Valore o canone desiderato`.
- Radio `Altro importo` e `Altro periodo` rivelano input accessibili; i valori
  restano nei campi esistenti `LeadRequest.budget` e `LeadRequest.timeframe`.
- Le bozze custom sopravvivono ai passaggi preset/custom finché lo step resta
  montato e vengono ripristinate tornando indietro dal passo contatti.
- Il cambio tra compravendita e locazione azzera budget/tempistiche incompatibili,
  evitando che un preset di acquisto ricompaia nella UI affitto.
- Nessuna modifica a mappe, contatti, Worker, D1, deploy, API o policy pnpm.

## TDD

RED 1:

```text
node --test tests/request-wizard-ui.test.mjs
3 pass, 2 fail
```

Fail attesi: preset mensili e scelte custom assenti.

RED 2:

```text
node --test tests/request-wizard.test.mjs
9 pass, 1 fail
```

Fail atteso: cambio acquisto → locazione conservava `Fino a 200.000 €`.

GREEN mirati:

```text
tests/request-wizard.test.mjs: 10/10
tests/request-wizard-ui.test.mjs: 5/5
```

La suite UI esegue componenti React reali tramite Vite SSR + happy-dom e copre
preset, label, navigazione radio da tastiera, conservazione bozze e payload.

## Gate finali

Runtime bundled Node `v24.14.0`:

```text
node --test tests/*.test.mjs                         PASS — 51/51
node --test tests/request-wizard-ui.test.mjs        PASS — 5/5
node node_modules/typescript/bin/tsc ... --noEmit   PASS
node node_modules/eslint/bin/eslint.js .            PASS
node node_modules/vite/bin/vite.js build            PASS
git diff --check                                    PASS
```

Warning non bloccanti già presenti: future flags React Router 7 nella suite UI
e chunk MapLibre oltre 500 kB nella build.

## File

- `src/components/request/PropertyDetailsStep.tsx`
- `src/lib/requestWizardFlow.ts`
- `tests/request-wizard-ui.test.mjs`
- `tests/request-wizard.test.mjs`
- `docs/product/PRD.md`
- `.superpowers/sdd/final-fix-ui-report.md`
