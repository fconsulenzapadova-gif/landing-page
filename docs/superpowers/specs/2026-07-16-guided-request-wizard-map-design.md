# Guided Request Wizard With Map Design

## Obiettivo

Ridisegnare l'unico form pubblico `/richieste` per ridurre tempo, concentrazione e testo libero richiesti all'utente. Il flusso resta guidato, adattivo e coerente con il design editoriale Gemüt Capital.

Il design approvato parte dalla proposta Superdesign B e incorpora il selettore della proposta A tra `Scrivi zona` e `Seleziona sulla mappa`.

- Draft approvato: `https://p.superdesign.dev/draft/2d121202-aecb-4ee8-bd8b-fedc36235634`
- Versione: 2
- Canvas: `https://superdesign.dev/teams/0aa66c8b-2113-4730-95f7-d6d98549fbec/projects/1bcfcf4e-3463-47fd-bf7b-9b229ca9682c`

## Principi UX

- Una sola decisione principale alla volta, con rivelazione progressiva delle domande successive.
- Controlli grandi, leggibili e toccabili; niente dropdown quando bastano card, chip o controlli segmentati.
- Quattro obiettivi espliciti, senza chiedere all'utente di interpretare la parola generica `Locazione`.
- La località può essere espressa con testo oppure con un poligono; le due modalità sono alternative e occupano lo stesso spazio.
- Campi facoltativi chiaramente marcati e dotati di risposte rapide come `Da definire` o `Non lo so`.
- Stato, errori e avanzamento restano comprensibili senza affidarsi solo a colore o animazione.
- Tempo obiettivo percepito: circa due minuti.

## Obiettivi e ramificazioni

Il primo passaggio mostra quattro card:

| Card | `requestType` esistente | Nuovo `requestRole` | Modalità posizione iniziale |
| --- | --- | --- | --- |
| Compro casa | `acquisto` | `cerca` | `polygon` |
| Vendo casa | `vendita` | `proprietario` | `text` |
| Cerco in affitto | `locazione` | `cerca` | `polygon` |
| Metto in affitto | `locazione` | `proprietario` | `text` |

La selezione aggiorna copy, etichette, valori rapidi e modalità posizione predefinita. Quando l'utente cambia obiettivo, viene applicato il default della nuova ramificazione.

Il selettore `Scrivi zona` / `Seleziona sulla mappa` resta disponibile in entrambe le ramificazioni. Nei casi di ricerca parte sulla mappa; nei casi relativi a un bene proprio parte sulla barra di posizione.

## Struttura del wizard

Il flusso conserva tre macro-passaggi per non allungare artificialmente l'esperienza:

1. `Obiettivo`: quattro card esplicite. La scelta porta al passaggio successivo senza chiedere dati tecnici.
2. `Immobile`: posizione, tipologia, budget o valore e tempistiche. Ogni risposta rivela la successiva; il riepilogo compatto permette di modificare l'obiettivo.
3. `Contatti`: nome, canale preferito, solo il recapito necessario, consenso privacy e invio.

L'indicatore mostra il passaggio corrente e `circa 2 minuti`, senza percentuali di precisione fittizia.

### Passaggio immobile

La domanda principale cambia con il ruolo:

- `cerca`: `Dove stai cercando?`;
- `proprietario`: `Dove si trova l'immobile?`.

Subito sotto compare il controllo segmentato. Il pannello sottostante ha una sola modalità montata e visibile alla volta:

- `Scrivi zona`: una barra per comune, quartiere o indirizzo e chip di zone frequenti;
- `Seleziona sulla mappa`: mappa grande, un solo poligono editabile, istruzione breve e comandi esterni grandi.

Passare da una modalità all'altra non mostra mai barra e mappa insieme. Il valore temporaneo di ciascuna modalità viene conservato durante il passaggio, ma solo la modalità attiva viene inviata.

La tipologia immobile usa card con icona e testo. Budget/valore e tempistiche usano preset selezionabili più un'opzione personalizzata. Le caratteristiche aggiuntive restano facoltative dietro `Aggiungi dettagli`.

### Passaggio contatti

Ordine:

1. nome e cognome;
2. canale preferito: telefono, WhatsApp o email;
3. solo il campo necessario al canale scelto;
4. azione discreta per aggiungere anche l'altro recapito;
5. privacy;
6. Turnstile interaction-only e invio.

La scena `RequestSuccess` esistente resta invariata.

## Mappa gratuita

### Stack

- renderer: `maplibre-gl`;
- disegno: controllo compatibile `@mapbox/mapbox-gl-draw`, usato tramite comandi custom esterni;
- tiles/style: OpenFreeMap, stile chiaro `Positron` o equivalente configurabile;
- dati cartografici: OpenStreetMap;
- nessuna API key, registrazione, carta di credito o servizio a consumo.

La URL dello stile resta centralizzata, così il tile provider può essere sostituito senza riscrivere il componente. La mappa viene caricata lazy solo quando la modalità `polygon` è visibile.

### Aspetto e interazione

- centro iniziale su Padova e zoom adatto alla città/provincia;
- superficie chiara e poco rumorosa;
- poligono con fill azzurro brand traslucido, bordo e vertici ink;
- un solo poligono per richiesta;
- controlli grandi: `Annulla ultimo punto`, `Ricomincia`, `Conferma area`;
- attribuzione OpenStreetMap/OpenFreeMap sempre visibile e mai coperta;
- nessuna richiesta automatica di geolocalizzazione del dispositivo;
- su mobile il disegno avviene per tap e non richiede precisione millimetrica.

La modalità testuale è l'alternativa accessibile completa alla mappa. Se WebGL, tile o script non sono disponibili, il wizard passa a `Scrivi zona`, mantiene l'obiettivo e mostra un messaggio breve.

## Stato frontend

Il form estende il modello esistente con:

```ts
type RequestRole = 'cerca' | 'proprietario';
type LocationMode = 'text' | 'polygon';

interface LocationPolygon {
  type: 'Polygon';
  coordinates: [number, number][][];
}
```

Nuovi campi `LeadRequest`:

```ts
requestRole: RequestRole;
locationMode: LocationMode;
locationGeometry: LocationPolygon | null;
```

`location` resta obbligatorio per compatibilità e leggibilità:

- modalità testo: contiene il valore inserito;
- modalità poligono: contiene una sintesi deterministica, per esempio `Area selezionata sulla mappa — centro 45.41, 11.88`.

Il GeoJSON conserva l'area reale. Il reducer del wizard è responsabile di obiettivo, default della modalità, valori temporanei delle due modalità, avanzamento e reset.

## Persistenza e backend

Il Worker continua a essere l'autorità di validazione. Una migrazione D1 aggiunge colonne nullable per non alterare i lead esistenti:

- `request_role TEXT`;
- `location_mode TEXT`;
- `location_geometry TEXT`.

Per i nuovi lead il Worker richiede:

- `requestRole` in `cerca | proprietario`;
- `locationMode` in `text | polygon`;
- testo `location` non vuoto;
- in modalità `polygon`, GeoJSON `Polygon` valido con un solo anello esterno, almeno tre vertici distinti, anello chiuso, coordinate numeriche finite e dimensione massima limitata;
- in modalità `text`, `locationGeometry` nullo.

Il payload resta sotto il limite HTTP esistente. Il Worker serializza il GeoJSON validato nella nuova colonna. La notifica Gmail aggiunge ruolo, modalità posizione e, per il poligono, centro e numero di vertici; non inserisce un blocco di coordinate grezze nel corpo principale.

`requestType` conserva i tre valori attuali per compatibilità con schema, filtri e report. `requestRole` distingue ricerca e bene proprio senza ricostruire la tabella esistente.

## Validazione ed errori

- La scelta dell'obiettivo è obbligatoria.
- Modalità testo: posizione non vuota.
- Modalità mappa: poligono confermato con almeno tre vertici distinti.
- Un poligono in costruzione non viene considerato valido finché non viene confermato.
- Cambiare modalità conserva la bozza locale ma valida e invia solo quella attiva.
- Cambiare obiettivo applica il default previsto e aggiorna i copy; i dati incompatibili non vengono inviati.
- Errore caricamento mappa: fallback automatico a testo, messaggio accessibile, nessuna perdita degli altri dati.
- Errore server su geometria: ritorno al passaggio immobile, focus sul selettore/mappa e messaggio specifico.
- Errori HTTP, timeout, Turnstile e retry mantengono il comportamento esistente.

## Accessibilità

- Quattro obiettivi esposti come radiogroup o controlli equivalenti con stato annunciato.
- Selettore posizione esposto come tablist oppure radiogroup; pannello attivo collegato semanticamente.
- Tutte le funzioni essenziali restano disponibili senza mappa tramite input testo.
- Controlli mappa custom raggiungibili da tastiera; istruzioni non dipendono dal colore.
- Focus portato al titolo del nuovo passaggio e al primo errore.
- Target minimi 44 px e focus ring Gemüt.
- Transizioni brevi; con `prefers-reduced-motion` il cambio pannello è immediato.

## Componenti

- `RequestsPage`: orchestration, submit e integrazione col flusso esistente.
- `RequestIntentSelector`: quattro obiettivi e mapping `requestType/requestRole`.
- `WizardProgress`: macro-passaggi e tempo indicativo.
- `LocationSelector`: controllo segmentato e gestione dei due draft.
- `LocationTextInput`: barra, chip e copy adattivo.
- `LocationPolygonMap`: lazy map, draw lifecycle, controlli custom, GeoJSON e fallback.
- `PropertyTypeSelector`, `BudgetSelector`, `TimeframeSelector`: scelte rapide.
- `ContactStep`: progressive disclosure del recapito.
- `RequestSuccess`: invariato.

I componenti mappa non conoscono il payload lead: ricevono ed emettono solo stato geografico tipizzato. La serializzazione e la validazione del payload restano separate.

## Test e verifica

### Frontend

- mapping delle quattro card a `requestType/requestRole`;
- default `polygon` per `cerca`, `text` per `proprietario`;
- cambio obiettivo riapplica il default corretto;
- barra e mappa mutuamente esclusive;
- conservazione delle bozze e invio del solo valore attivo;
- validazione poligono e fallback mappa;
- disclosure del solo recapito richiesto;
- tastiera, focus, label, errori e reduced motion.

### Worker e D1

- payload testo valido;
- payload poligono valido;
- rifiuto di geometrie malformate, eccessive o non finite;
- serializzazione D1 delle nuove colonne;
- compatibilità con righe precedenti alla migrazione;
- notifica leggibile per entrambi i modi.

### Browser

- desktop e mobile per tutte e quattro le ramificazioni;
- disegno, modifica, reset e conferma poligono;
- cambio modalità senza doppio pannello;
- fallback con tiles/WebGL indisponibili;
- invio reale locale con Worker/Turnstile di test;
- scena di successo e `Nuova richiesta`.

## Fuori ambito

- geocoding o autocomplete esterno;
- geolocalizzazione automatica dell'utente;
- routing, distanze o calcolo prezzi;
- salvataggio di più poligoni;
- account utente o ripresa del wizard tra dispositivi;
- servizi cartografici a pagamento.

## Riferimenti tecnici

- OpenFreeMap: `https://openfreemap.org/`
- OpenFreeMap Quick Start: `https://openfreemap.org/quick_start/`
- MapLibre GL JS, disegno poligono: `https://maplibre.org/maplibre-gl-js/docs/examples/draw-polygon-with-mapbox-gl-draw/`
- MapLibre GL JS, GeoJSON polygon: `https://maplibre.org/maplibre-gl-js/docs/examples/add-a-geojson-polygon/`
- OpenStreetMap attribution e tile policy: `https://operations.osmfoundation.org/policies/tiles/`
