# ADR 0004: catalogo immobili su Cloudflare

Stato: accettata

Data: 18 luglio 2026

## Contesto

Il catalogo usava un CSV pubblico Google Sheets e scraping HTML di cartelle
Google Drive. Il flusso era fragile, pubblicava le fonti e non offriva un
confine stabile per un futuro CRM. R2 sarebbe lo storage media naturale, ma
l'account richiede checkout per attivare la subscription, incompatibile con il
vincolo operativo di non attivare fatturazione.

## Decisione

Usare D1 per `listings` e `listing_images`, Workers KV per immagini e lo stesso
Worker già distribuito come API pubblica. `GET /api/listings` restituisce solo
record `published`; `GET /media/<object-key>` serve media con cache immutabile.
Nessun endpoint pubblico scrive catalogo.

Il futuro CRM scriverà dietro autenticazione su D1 e KV. Immagini useranno
chiavi nuove e immutabili; D1 conserva ordine e relazione. Il DTO pubblico è il
confine stabile tra sito e backend.

## Conseguenze

- Nessuna dipendenza runtime da Google Sheets, Google Drive o markup esterno.
- Il piano Workers Free basta finché catalogo resta sotto 1 GB KV, 100.000
  letture/giorno e 1.000 scritture/giorno.
- KV ha consistenza eventuale; nuove chiavi possono richiedere breve propagazione.
- Immagini devono essere ottimizzate prima dell'upload.
- Se i limiti KV diventano stretti, l'adapter media può passare a R2 senza
  cambiare schema D1, URL logici o frontend.
