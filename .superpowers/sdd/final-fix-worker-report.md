# Final Fix Worker Report

## Stato

Fix Worker completato dalla base `3fca23a`. La validazione accetta solo i
quattro intenti compatibili, supporta il payload legacy esclusivamente quando i
tre campi estesi sono tutti assenti e rifiuta gli aggiornamenti parziali.

La posizione poligonale viene ora ricavata dal GeoJSON validato con la stessa
media deterministica dei vertici usata dal frontend. Il valore canonico viene
restituito dalla validazione, persistito in D1 e rigenerato dalla notifica anche
se un `ValidLead` di test contiene una `location` arbitraria.

## TDD

RED mirato: `tests/cloudflare-leads.test.mjs` ha prodotto 6 failure attese su
pair impossibili, inferenza legacy, payload parziale, canonicalizzazione
validazione/D1 e trust boundary della notifica.

GREEN mirato: 18 test passati, 0 falliti.

## Verifica

- suite Node completa: 57 pass, 0 fail;
- typecheck: exit 0;
- lint: exit 0;
- build Vite: exit 0, 149 moduli; solo warning noto sul chunk MapLibre lazy;
- Wrangler deploy dry-run: exit 0;
- migrazioni D1 locali: exit 0, nessuna migrazione pendente;
- `git diff --check`: pulito.

Nessun lockfile o policy pnpm modificato. Nessun deploy, migrazione remota o
push eseguito.

## Rollout documentato

Ordine esplicito: migrazione D1 additiva, Worker compatibile, frontend,
osservazione, eventuale Worker rigoroso successivo. Il payload legacy deduce
ruolo compatibile e posizione testuale; qualunque payload parzialmente esteso
resta rifiutato.
