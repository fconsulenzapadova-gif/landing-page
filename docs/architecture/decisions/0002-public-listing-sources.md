# ADR 0002: fonti pubbliche per catalogo immobili

Stato: superata da ADR 0004

Data: 16 luglio 2026 (decisione preesistente, formalizzata durante migrazione memoria)

## Contesto

Il catalogo deve essere aggiornabile senza backend o credenziali Google nel browser.

## Decisione

Leggere immobili dall'export CSV pubblico di Google Sheets. Leggere immagini dalla vista pubblica `embeddedfolderview` di Google Drive tramite proxy same-origin `api/drive-images.ts`.

## Conseguenze

- Nessuna Google Sheets/Drive API, OAuth o secret.
- Foglio, cartelle e file devono restare pubblici.
- Il parser Drive dipende da markup HTML non contrattuale e può richiedere manutenzione.
- Un errore fonte non autorizza fallback con immobili hardcoded.

Questa integrazione è stata rimossa integralmente il 18 luglio 2026. Il file
resta solo come storico della decisione precedente.
