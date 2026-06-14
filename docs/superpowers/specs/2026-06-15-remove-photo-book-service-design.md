# Rimozione servizio Book Fotografico

## Obiettivo

Rimuovere esclusivamente la feature pubblica "Valorizzazione con Book Fotografico", senza modificare gli altri servizi o il form richieste.

## Modifiche

- Rimuovere la card e il relativo pulsante dalla sezione "Servizi su Misura" della home.
- Centrare i due servizi specialistici rimanenti in una griglia a due colonne.
- Rimuovere la voce dal menu globale.
- Rimuovere la variante book dalla configurazione condivisa di `ServiceDetail`.
- Conservare gli URL storici `/valorizzazione-book-fotografico` e `/dettaglio-valorizzazione-book` come redirect alla home.
- Conservare `public/piazza-vicina.JPG`, perché è usato anche da `PublicRequests`.
- Aggiornare test statici e `PRD.md` per descrivere lo stato reale.

## Verifica

- La home mostra solo UAV e valutazione patrimonio nella sezione "Servizi su Misura".
- Il menu non mostra il servizio book.
- Entrambi gli URL storici reindirizzano a `/`.
- Nessun copy o CTA del servizio book resta nei file runtime pubblici.
- Test, lint del file modificato e build passano; eventuali errori lint globali preesistenti vengono riportati senza estendere lo scope.
