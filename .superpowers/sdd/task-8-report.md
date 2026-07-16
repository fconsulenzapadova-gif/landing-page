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

Runtime bundled Node `v24.14.0`; tutti i comandi seguenti exit `0`:

```sh
node --test tests/*.test.mjs
node --test tests/request-wizard-ui.test.mjs
node node_modules/typescript/bin/tsc -p tsconfig.app.json --noEmit
node node_modules/eslint/bin/eslint.js .
node node_modules/vite/bin/vite.js build
node node_modules/wrangler/bin/wrangler.js deploy --dry-run --config cloudflare/wrangler.jsonc
node node_modules/wrangler/bin/wrangler.js d1 migrations apply gemut-leads-db --local --config cloudflare/wrangler.jsonc
pnpm install --lockfile-only --frozen-lockfile
pnpm dlx npm@11.7.0 ci --dry-run --ignore-scripts
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

`npm` non e nel PATH dell'ambiente: i gate npm sono stati eseguiti tramite npm
11.7.0 avviato da pnpm con il binario Node bundled nel PATH. Un primo tentativo
con `npm@latest` e fallito prima del check per wrapper senza `node` nel PATH;
non ha modificato il repository. Il comando corretto sopra e terminato con exit
`0`.

## Database e browser locale

Comandi locali:

```sh
node node_modules/wrangler/bin/wrangler.js dev \
  --config cloudflare/wrangler.jsonc --port 8787 \
  --var TURNSTILE_SECRET_KEY:<chiave-test-ufficiale> \
  --var GMAIL_CLIENT_ID:local --var GMAIL_CLIENT_SECRET:local \
  --var GMAIL_REFRESH_TOKEN:local
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 8080
```

Collaudo desktop con Chrome/agent-browser:

1. `Compro casa` e `Cerco in affitto`: mappa attiva osservata. `Vendo casa`:
   testo attivo osservato. `Metto in affitto`: mapping proprietario/testo
   verificato dalla suite runtime, non ripetuto manualmente dopo richiesta di
   chiudere il collaudo.
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
   passaggi, reset ed errori e coperto dai 3 test UI. `prefers-reduced-motion`
   resta coperto dal test statico e dalle regole CSS; non e stato ripetuto come
   collaudo visuale mobile dedicato in questa esecuzione.

Il primo submit browser ha restituito 400 perché il primo avvio Wrangler usava
una variabile shell, non un binding Worker. Riavviato con `--var`, il submit ha
ottenuto 201. Con credenziali Gmail locali volutamente finte la notifica ha
registrato 401 in background, comportamento atteso: il lead D1 e rimasto
salvato. Nessuna email reale inviata.

## Limiti dichiarati

- Verifica visuale browser eseguita a 1440×1000. Il viewport mobile non e stato
  ripetuto prima della chiusura richiesta; responsive e mobile restano coperti
  da markup/classi e suite esistente, non equivalenti a un secondo collaudo
  visuale manuale.
- Nessun test remoto, deploy, migrazione D1 remota, push o PR.
- Warning React Router future flags presente nei test/browser, senza failure.

## Diff review

Scope limitato ai nove file Task 8 elencati sopra. Nessun secret, output build,
metadata `._*`, `.superdesign/tmp` o artefatto browser incluso. Stato locale D1
resta sotto directory ignorata `.wrangler`.
