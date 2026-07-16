# Form Turnstile And Success Animation Design

## Obiettivo

Rendere invisibile il widget Cloudflare Turnstile durante il normale utilizzo del form richieste e sostituire l'attuale conferma statica con una scena animata coerente con il design Gemüt.

## Ambito

- Intervenire sull'unico form pubblico, il wizard in `src/pages/RequestsPage.tsx`.
- Conservare Cloudflare Turnstile, la verifica server-side, il flusso Worker/D1 e la gestione errori esistenti.
- Non aggiungere dipendenze: usare GSAP già presente nel progetto.
- Non modificare altri contenuti, route o form.

## Turnstile invisibile

Il widget viene ancora renderizzato e genera il token prima dell'invio, ma usa l'opzione ufficiale `appearance: 'interaction-only'`. Il contenitore non riserva più i 65 px oggi visibili in produzione.

Per la maggior parte degli utenti non appare alcun elemento Cloudflare. Se Cloudflare richiede un'interazione, il challenge può comparire: questo comportamento resta necessario per completare la verifica antispam e non deve essere nascosto tramite CSS.

Gli errori di caricamento e scadenza continuano a svuotare il token e a mostrare il messaggio di fallback già esistente.

## Scena di successo

Dopo una risposta `ok` del Worker, il form viene sostituito nello stesso punto della pagina da una scena di conferma centrata, senza modale e senza redirect automatico.

Sequenza visiva:

1. il contenitore entra con una lieve dissolvenza;
2. un cerchio azzurro brand si espande;
3. la spunta viene disegnata sopra il cerchio;
4. titolo e testo entrano con movimento verticale breve e sfalsato;
5. le due azioni finali compaiono per ultime.

Copy:

- titolo: `Grazie!`;
- messaggio principale: `Richiesta ricevuta. Ti contatteremo entro un giorno lavorativo.`;
- azioni: `Torna alla home` e `Nuova richiesta`.

Il messaggio viene dichiarato con semantica `role="status"` e `aria-live="polite"`. Il titolo riceve il focus al cambio di stato, così anche chi usa tastiera o screen reader percepisce subito l'esito.

## Motion e stile

- Palette: carta, ink e azzurro `var(--brand-blue)` già esistenti.
- Tipografia: font display del sito per `Grazie!`, testo normale per il messaggio.
- Durata complessiva indicativa: 0,9-1,2 secondi.
- Movimento breve, senza confetti né elementi decorativi estranei al linguaggio editoriale del sito.
- Animazione GSAP con scope locale e cleanup automatico.
- Con `prefers-reduced-motion: reduce`, tutti gli elementi appaiono subito nello stato finale, senza transizioni.

## Stati e flusso dati

- `idle` e `submitting`: comportamento attuale.
- `error`: il form resta visibile e mostra errori/messaggio attuali.
- `success`: viene montata la scena animata e non viene più mostrato il form compilato.
- `Nuova richiesta`: genera un nuovo `requestId`, azzera dati/errori/stato e riporta al primo step.

Il testo di conferma è deterministico nel frontend e allineato al messaggio restituito dal Worker. Non vengono animati né visualizzati dati personali inseriti nel form.

## Struttura tecnica

- `src/components/Turnstile.tsx`: configurazione `appearance: 'interaction-only'` e contenitore senza altezza minima permanente.
- `src/components/RequestSuccess.tsx`: componente focalizzato su markup, accessibilità e timeline della scena.
- `src/pages/RequestsPage.tsx`: monta `RequestSuccess` quando `status === 'success'` e conserva callback di reset/home.
- `tests/site-requirements.test.mjs`: regressioni statiche per modalità Turnstile, assenza dell'altezza minima visibile, copy e presenza del componente successo.

## Gestione errori

Nessuna scena successo viene mostrata in caso di errore HTTP, timeout, errore di rete, token scaduto o validazione fallita. Il comportamento di retry resta nel form esistente. Un errore Turnstile continua a mostrare il fallback testuale accessibile.

## Verifica

- Test automatico inizialmente rosso per le nuove aspettative.
- Test completo Node, lint, typecheck e build.
- Verifica browser desktop e mobile del normale flusso Turnstile senza banner/spazio vuoto.
- Verifica browser della sequenza successo, dei pulsanti e del reset.
- Verifica con `prefers-reduced-motion` che la scena sia subito leggibile e stabile.

