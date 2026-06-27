# Voce aziendale plurale per il sito pubblico

## Obiettivo

Uniformare tutti i testi del sito pubblico alla voce aziendale plurale di Gemüt Capital, mantenendo il cliente come interlocutore singolare.

Esempi:

- `Ti aiuto a trovare...` diventa `Ti aiutiamo a trovare...`;
- `Ti accompagno...` diventa `Ti accompagniamo...`;
- `Mi occupo...` diventa `Ci occupiamo...`;
- `La mia esperienza...` diventa `La nostra esperienza...`;
- `Contattami...` diventa `Contattaci...`;
- `Sono sempre disponibile...` diventa `Siamo sempre disponibili...`.

## Regola editoriale

La voce di Gemüt Capital usa la prima persona plurale:

- pronomi e possessivi aziendali: `noi`, `ci`, `nostro`, `nostra`, `nostri`, `nostre`;
- verbi aziendali: `aiutiamo`, `accompagniamo`, `analizziamo`, `cerchiamo`, `controlliamo`, `gestiamo`, `ascoltiamo`, `studiamo`, `sviluppiamo`, `offriamo`, `seguiamo`, `garantiamo`, `indichiamo`;
- CTA di contatto: `contattaci`, `chiamaci`, `scrivici`, quando riferite all'agenzia.

Il cliente resta al singolare:

- `tu`, `ti`, `tuo`, `tua`, `tuoi`, `tue`;
- CTA rivolte al cliente come `Trova`, `Richiedi`, `Invia`, `Prenota`;
- formulazioni in prima persona che rappresentano la scelta del cliente, come `Vorrei sapere quanto vale il mio immobile`.

Non si forza il plurale nei sostantivi o nelle espressioni nominali. Per esempio, `Controllo clausole contrattuali` resta invariato quando `Controllo` indica l'attività e non il verbo in prima persona.

## Ambito

L'audit copre il copy visibile e accessibile delle route pubbliche attive:

- `/`;
- `/acquisto-casa`;
- `/vendita-immobili`;
- `/locazioni`;
- `/servizi-personalizzati`;
- `/verifica-stato-tetto`;
- `/valutazione-patrimonio`;
- `/richieste`;
- `/prenotazione`;
- `/privacy`;
- `/accesso-clienti`.

Copre inoltre:

- menu e footer globali;
- cookie consent;
- pulsanti e link WhatsApp;
- etichette accessibili come `aria-label`;
- messaggi di conferma, errore, toast e alert mostrati all'utente;
- messaggi restituiti dal processore delle richieste quando visualizzati nella UI.

## Esclusioni

La sezione home `Scopri Chi Sono Io` resta completamente invariata, inclusi:

- testo del pulsante di apertura e chiusura;
- badge e titolo;
- biografia di Filippo Marcuzzo;
- CTA interna `Parliamone Insieme`;
- ogni frase in prima persona singolare contenuta nel blocco espandibile.

Restano fuori anche:

- commenti del codice;
- log tecnici e messaggi console non mostrati all'utente;
- codice CRM dormiente non raggiungibile dalle route correnti, salvo `/accesso-clienti`, che è ancora una route attiva;
- copy puramente legale, descrittivo o nominale che non esprime una voce aziendale singolare;
- dati societari, route, URL, email e numeri telefonici.

## File coinvolti

L'implementazione deve verificare almeno:

- `src/pages/Landing.tsx`;
- `src/pages/AcquistoCasa.tsx`;
- `src/pages/VenditaImmobili.tsx`;
- `src/pages/Locazioni.tsx`;
- `src/pages/ServiziPersonalizzati.tsx`;
- `src/pages/ServiceDetail.tsx`;
- `src/pages/PublicRequests.tsx`;
- `src/pages/Prenotazione.tsx`;
- `src/pages/Privacy.tsx`;
- `src/pages/ClientAccess.tsx`;
- `src/components/GlobalNavigation.tsx`;
- `src/components/SiteFooter.tsx`;
- `src/components/CookieConsent.tsx`;
- `src/components/WhatsAppButton.tsx`;
- `src/utils/clientRequestProcessor.ts`;
- `tests/site-requirements.test.mjs`;
- `PRD.md`.

## Strategia di implementazione

La conversione avviene tramite audit semantico manuale, frase per frase. Non si usano sostituzioni globali indiscriminate.

Per ogni testo:

1. identificare chi parla;
2. convertire solo la voce aziendale singolare al plurale;
3. mantenere il cliente al singolare;
4. preservare significato, tono, punteggiatura e lunghezza per quanto ragionevole;
5. non modificare struttura JSX, route, navigazione, form o logica.

## Test

Aggiornare i test statici per verificare:

- presenza di esempi rappresentativi della nuova voce plurale;
- assenza delle principali formulazioni aziendali singolari fuori dalla sezione esclusa;
- permanenza dei testi singolari approvati nella sezione `Scopri Chi Sono Io`;
- permanenza del titolo cliente `Vorrei sapere quanto vale il mio immobile`;
- route e CTA esistenti non modificate.

La verifica finale comprende:

- test statici;
- lint mirato sui file modificati;
- lint globale, registrando separatamente eventuali errori legacy;
- build di produzione;
- controllo browser desktop e mobile delle route principali;
- ricerca finale delle forme singolari residue;
- controllo del diff e allineamento di `PRD.md`.

## Criteri di accettazione

- Tutto il copy aziendale visibile nelle route incluse usa la prima persona plurale.
- Il destinatario resta al singolare.
- La sezione `Scopri Chi Sono Io` è identica allo stato precedente.
- Nessuna route, CTA, logica, dato societario o comportamento cambia.
- I testi risultano grammaticalmente naturali, non sostituzioni meccaniche.
- Test e build pertinenti passano.
- `PRD.md` descrive la voce editoriale plurale e l'esclusione della biografia.
