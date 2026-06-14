# Servizio Fotografico Gratuito nella Vendita

## Obiettivo

Integrare la valorizzazione fotografica come servizio gratuito esclusivamente nella pagina pubblica `/vendita-immobili`, senza ripristinare la pagina specialistica, la card home o la voce menu rimosse.

## Esperienza utente

- La card esistente "Fotografia Professionale" resta nella sezione "Come Valorizziamo il Tuo Immobile".
- La card mostra un badge evidente "GRATUITO".
- Il testo usa la formula approvata: "Servizio fotografico professionale gratuito, incluso per gli immobili affidati in vendita."
- La fase "Preparazione Immobile" specifica che il servizio fotografico professionale è gratuito e incluso.
- Il vantaggio "Marketing Professionale" ribadisce l'inclusione gratuita senza introdurre condizioni ulteriori.
- Le CTA esistenti verso `/richieste?type=vendita` restano invariate.

## Confini

- Nessuna nuova route, pagina, integrazione dati o campo form.
- Gli URL storici del precedente servizio book continuano a reindirizzare alla home.
- Nessuna ricomparsa del servizio nella home o nel menu globale.

## Verifica

- Il copy approvato è presente in `VenditaImmobili.tsx`.
- La pagina rende badge e contenuto correttamente su desktop e mobile.
- I test statici verificano l'offerta gratuita nella pagina vendita e continuano a verificare la rimozione della vecchia feature autonoma.
- `PRD.md` descrive il servizio fotografico gratuito come parte attiva del percorso vendita.
