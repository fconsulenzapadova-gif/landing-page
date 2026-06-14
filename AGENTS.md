# Istruzioni obbligatorie per agenti

## Avvio di ogni task

1. Attivare e usare sempre [`$caveman`](/Users/filippomarcuzzo/.codex/skills/caveman/SKILL.md) con intensita `ultra`.
2. Leggere completamente `PRD.md` prima di analizzare o modificare il progetto.
3. Usare la sezione "Mappa rapida: dove modificare" del PRD per trovare i file rilevanti.
4. Verificare sempre il codice reale prima di assumere che una funzione sia attiva.
5. Distinguere feature attive, parziali, legacy/dormienti e simulate.
6. Controllare `git status`; non sovrascrivere o ripristinare modifiche non proprie.

## Durante il lavoro

- Conservare stack, pattern e componenti condivisi esistenti.
- Cercare riferimenti e dipendenze con `rg` prima di spostare, rinominare o eliminare codice.
- Non descrivere codice legacy o simulato come feature di produzione.
- Non inventare route, API, tabelle, variabili ambiente o dati societari.
- Mantenere modifiche focalizzate e verificabili.
- Proteggere compatibilita route, responsive, accessibilita e flussi dati.

## Aggiornamento PRD obbligatorio

Aggiornare `PRD.md` nello stesso task quando cambia almeno uno di questi elementi:

- comportamento prodotto;
- route o redirect;
- pagina, componente o responsabilita di un file;
- architettura o provider globali;
- flusso utente;
- schema DB, tabella, RLS o tipo dati;
- API o integrazione esterna;
- localStorage o gestione auth;
- asset, configurazione, build o deploy;
- stato di una feature: attiva, parziale, legacy o simulata;
- limite noto, requisito o criterio di verifica.

Se la modifica non richiede aggiornamento PRD, verificarlo esplicitamente prima di chiudere il task.

## Chiusura di ogni task

1. Eseguire test, lint, build e verifiche pertinenti quando disponibili.
2. Controllare il diff per modifiche accidentali.
3. Confermare che `PRD.md` descriva ancora lo stato reale del repository.
4. Comunicare in modalita `$caveman ultra`: risultato, file cambiati, verifiche, limiti residui.
