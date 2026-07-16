# Task 8 Report — Documentazione e verifica completa

## Stato

Task 8 completata in locale. Memoria prodotto, architettura, pattern frontend e
milestone aggiornati sul comportamento reale del wizard. Nessun deploy Worker,
migrazione D1 remota, push o PR eseguiti.

Durante il collaudo sono stati chiusi due follow-up finali:

- override cursori `maplibregl-*` scoped alla mappa richiesta, coerenti con
  l'esempio ufficiale MapLibre/Mapbox Draw;
- cleanup Mapbox Draw resiliente alla perdita WebGL/style, che prima poteva
  lanciare `Cannot read properties of null (reading 'getLayer')` durante il
  passaggio automatico al testo.

## File Task 8

- `docs/product/PRD.md`
- `docs/architecture/overview.md`
- `docs/patterns/frontend.md`
- `docs/ai/progress.md`
- `src/index.css`
- `src/components/request/locationPolygonMapLifecycle.ts`
- `tests/site-requirements.test.mjs`
- `tests/location-polygon-map.test.mjs`
- `.superpowers/sdd/task-8-report.md`

## Documentazione durevole

- PRD: quattro intenti visibili, default mappa/testo per ruolo, pannelli
  esclusivi, tre macro-passaggi, controlli progressivi, stack cartografico
  gratuito, fallback, geometria D1 nullable e riepilogo Gmail.
- Architettura: confini dei componenti richiesta e flusso completo
  `RequestsPage → request components → MapLibre/OpenFreeMap or text location →
  LeadRequest → Worker validation → D1 → Gmail summary`.
- Pattern: mappa isolata/lazy, mapping intenti centralizzato, equivalente
  testuale obbligatorio, pannelli mai montati insieme e provider/style URL
  sostituibili.
- Progress: milestone locale esplicita, senza dichiarare deploy remoto.

## TDD follow-up

### Cursori Draw

RED:

```sh
/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  --test --test-name-pattern="request polygon map" tests/site-requirements.test.mjs
```

Exit `1`: mancava il selettore scoped `.mouse-add` con `cursor: crosshair`.

GREEN dopo CSS: exit `0`, 1 test pass. Aggiunti gli override pointer, move,
crosshair, grab e cell dell'esempio ufficiale, limitati a
`.request-location-map`.

### Cleanup dopo perdita WebGL

Il browser ha riprodotto un root React vuoto durante
`webglcontextlost`: Mapbox Draw provava a rimuovere layer da uno style MapLibre
gia perso.

RED:

```sh
/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  --test --test-name-pattern="cleanup survives" tests/location-polygon-map.test.mjs
```

Exit `1`, errore atteso: `Cannot read properties of null (reading 'getLayer')`.

GREEN dopo cleanup best-effort: exit `0`, 1 test pass. La rimozione del
controllo non interrompe piu il fallback e `map.remove()` viene comunque
tentato. Il browser, rieseguito con lo stesso evento, ha mostrato il pannello
testuale, tab mappa disabilitata e intento `Compro casa` preservato.

## Verifica automatica finale

Runtime bundled Node `v24.14.0`. Le invocazioni reali hanno usato i binari
assoluti seguenti; tutti i comandi exit `0`:

```sh
NODE=/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node
PNPM=/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm

"$NODE" --test tests/*.test.mjs
"$NODE" --test tests/request-wizard-ui.test.mjs
"$NODE" node_modules/typescript/bin/tsc -p tsconfig.app.json --noEmit
"$NODE" node_modules/eslint/bin/eslint.js .
"$NODE" node_modules/vite/bin/vite.js build
"$NODE" node_modules/wrangler/bin/wrangler.js deploy --dry-run --config cloudflare/wrangler.jsonc
"$NODE" node_modules/wrangler/bin/wrangler.js d1 migrations apply gemut-leads-db --local --config cloudflare/wrangler.jsonc
"$PNPM" install --lockfile-only --frozen-lockfile
PATH=/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH \
  "$PNPM" dlx npm@11.7.0 ci --dry-run --ignore-scripts
git diff --check
```

Esiti:

- suite completa: 48 pass, 0 fail;
- UI focused: 3 pass, 0 fail;
- typecheck e lint: puliti;
- build: 149 moduli, exit `0`; resta solo warning chunk MapLibre >500 kB,
  gia lazy e fuori dal bundle iniziale;
- Wrangler dry-run: upload simulato 17.50 KiB / gzip 5.58 KiB;
- D1 locale: nessuna migrazione pendente;
- entrambi i lockfile coerenti; nessuna modifica prodotta;
- diff check pulito.

`npm` non e nel PATH dell'ambiente. Test, lint, typecheck, build e Wrangler non
sono stati attribuiti a script npm: sono stati eseguiti direttamente con il
binario Node bundled. Il solo controllo `package-lock.json` ha eseguito davvero
`npm ci --dry-run --ignore-scripts`, tramite npm 11.7.0 avviato da pnpm con Node
bundled nel PATH. Un primo tentativo con `npm@latest` e fallito prima del check
per wrapper senza `node` nel PATH e non ha modificato il repository.

## Database e browser locale

Comandi locali:

```sh
"$NODE" node_modules/wrangler/bin/wrangler.js dev \
  --config cloudflare/wrangler.jsonc --port 8787 \
  --var TURNSTILE_SECRET_KEY:<chiave-test-ufficiale> \
  --var GMAIL_CLIENT_ID:local --var GMAIL_CLIENT_SECRET:local \
  --var GMAIL_REFRESH_TOKEN:local
"$NODE" node_modules/vite/bin/vite.js --host 127.0.0.1 --port 8080
```

Collaudo desktop e mobile con Chrome/agent-browser:

1. `Compro casa` e `Cerco in affitto`: mappa attiva osservata. `Vendo casa`:
   testo attivo osservato. `Metto in affitto`: selezionato manualmente a 390×844;
   apre il passaggio immobile con tab `Scrivi zona`, titolo `Dove si trova
   l’immobile?`, label `Comune, quartiere o indirizzo` e copy proprietario
   `Valore o canone desiderato`.
2. Esclusivita pannelli verificata da snapshot browser e regressione statica;
   la suite lifecycle copre il cambio tab con bozza conservata.
3. Disegno, modifica vertice, annullamento, reset e conferma provati sulla
   mappa; attribuzioni OpenFreeMap/OpenMapTiles/OpenStreetMap visibili.
4. `webglcontextlost` simulato: dopo fix passa al testo, disabilita la tab mappa
   e conserva domanda/intento; regressione cleanup aggiunta.
5. Tipo immobile → budget → tempistiche rivelati in sequenza; `Aggiungi
   dettagli` osservato con `expanded=false`.
6. Canale email mostra solo email obbligatoria; il comando secondario aggiunge
   telefono facoltativo.
7. Submit locale: `POST /api/leads` → `201 Created`, scena `Grazie!` mostrata.
   Query D1 locale conferma `request_type=locazione`, `request_role=cerca`,
   `location_mode=polygon`, geometria non nulla (269 byte).
8. `Nuova richiesta` torna al passaggio 0; generazione ID nuovo coperta anche
   dal test UI/controller. L'ID non e esposto nella UI e non e stato stampato.
9. Label/ruoli screen reader verificati negli snapshot accessibili; focus tra
   passaggi, reset ed errori e coperto dai 3 test UI. Sul browser mobile il
   passaggio avanti ha focalizzato il `LEGEND` `Dettagli dell’immobile`.

Evidenza mobile aggiuntiva:

- viewport effettivo 390×844, `scrollWidth=390`, nessun overflow orizzontale;
- flusso `Metto in affitto` completato con posizione testuale, appartamento,
  budget/tempistiche `Da definire`, telefono e privacy;
- Worker locale: `POST /api/leads` → `201 Created`, scena `Grazie!` visibile;
- query D1 locale: `request_type=locazione`, `request_role=proprietario`,
  `location_mode=text`, `location_geometry IS NULL` vero;
- `prefers-reduced-motion` emulato sullo stesso viewport: media query `true`,
  `transitionDuration` e `animationDuration` computate a `1e-05s`;
- nessun page error rilevato da agent-browser. Screenshot locale di evidenza:
  `/tmp/task8-mobile-metto-success.png` (non committato).

Il primo submit browser ha restituito 400 perché il primo avvio Wrangler usava
una variabile shell, non un binding Worker. Riavviato con `--var`, il submit ha
ottenuto 201. Con credenziali Gmail locali volutamente finte la notifica ha
registrato 401 in background, comportamento atteso: il lead D1 e rimasto
salvato. Nessuna email reale inviata.

## Limiti dichiarati

- Verifica browser locale eseguita a 1440×1000 e 390×844; nessun test remoto,
  deploy, migrazione D1 remota, push o PR.
- Warning React Router future flags presente nei test/browser, senza failure.

## Diff review

Scope limitato ai nove file Task 8 elencati sopra. Nessun secret, output build,
metadata `._*`, `.superdesign/tmp` o artefatto browser incluso. Stato locale D1
resta sotto directory ignorata `.wrangler`.
