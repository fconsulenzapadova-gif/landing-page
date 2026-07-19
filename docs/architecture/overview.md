# Architecture Overview

Ultimo aggiornamento: 18 luglio 2026

## Runtime

`index.html` → `src/main-landing.tsx` → `LandingApp` → `BrowserRouter` → route lazy-loaded → `AppLayout` → pagina pubblica.

Stack: React 18, TypeScript, Vite 8, React Router 6, Tailwind CSS,
GSAP/ScrollTrigger, Vercel per il frontend e Cloudflare Workers + D1 + Workers
KV + Turnstile per catalogo e raccolta lead.

## Confini moduli

- Router e redirect: `src/LandingApp.tsx`.
- Layout globale: `src/components/AppLayout.tsx`, `Navigation.tsx`, `Footer.tsx`, `CookieConsent.tsx`.
- Contenuti, route e dati societari: `src/content/site.ts`.
- Pagine pubbliche: `src/pages/`.
- Catalogo: `src/lib/listings.ts`, `src/lib/useListings.ts`, componenti `Listing*`.
- Catalogo backend: `cloudflare/src/listings.ts` legge record pubblicati da D1,
  costruisce il DTO pubblico e serve media immutabili da Workers KV.
- Lead frontend: `src/pages/RequestsPage.tsx` orchestra i componenti isolati in
  `src/components/request/`; `src/lib/requestWizard.ts` centralizza gli intenti
  e `src/lib/requestWizardFlow.ts` governa transizioni e payload prima di
  `src/lib/leads.ts`.
- Posizione lead: `LocationSelector` monta un solo pannello tra testo e
  `LocationPolygonMap`; la mappa MapLibre/OpenFreeMap e caricata lazy, mentre il
  testo resta sempre equivalente e funge da fallback.
- Lead backend: `cloudflare/src/index.ts` → validazione server + Turnstile → D1
  → notifica tramite Gmail API con scope limitato a `gmail.send`.
- Motion: `src/lib/usePageAnimations.ts`; animazioni specifiche home in `HomePage.tsx`.

## Flussi dati

### Immobili

```text
Browser → GET /api/listings → Worker → D1 listings + listing_images
  → DTO pubblico → pagine/card
Browser → /media/<object-key> → Worker → Workers KV → immagine cacheabile
```

Solo record `published` sono pubblici. Immagini ordinate tramite `position` e
referenziate da chiavi immutabili. Nessun endpoint pubblico scrive catalogo:
il futuro CRM userà endpoint autenticati sullo stesso schema, senza cambiare il
contratto di lettura del sito.

### Lead

```text
RequestsPage → request components → MapLibre/OpenFreeMap or text location
  → LeadRequest(requestType + requestRole + locationMode + GeoJSON)
  → Worker validation → D1 nullable geometry columns → Gmail summary
```

`RequestsPage` conserva intento, bozze e campi tra i tre macro-passaggi. Il
payload passa dalla validazione client a `POST /api/leads`; il Worker controlla
origine, payload, honeypot e Turnstile, valida la coerenza tra `locationMode` e
GeoJSON, poi esegue un insert idempotente in D1. `request_role`, `location_mode`
e `location_geometry` sono nullable per compatibilita con le righe precedenti;
le nuove richieste valorizzano ruolo e modalita, mentre la geometria resta nulla
per il testo.

Il browser non possiede credenziali database e non esiste un endpoint pubblico
di lettura. Il Worker non salva IP, token Turnstile o user agent e non inoltra
dati a CRM terzi. Solo un nuovo inserimento D1 genera il riepilogo Gmail,
evitando duplicati sullo stesso `requestId`; il messaggio descrive la geometria
senza esporre le coordinate complete. Un errore email viene registrato nei log
ma non annulla il lead gia salvato. Le credenziali OAuth Gmail restano
esclusivamente nei secret del Worker.

## Deploy

Vercel installa dipendenze, esegue build Vite, pubblica `dist` e riscrive route
SPA verso `index.html`. Il Worker pubblico è distribuito separatamente con
Wrangler, usa binding D1 e KV ed espone catalogo read-only, media e invio lead.
Il frontend usa `VITE_LISTINGS_API_URL` e `VITE_LEADS_API_URL`; in assenza della
prima deriva `/api/listings` dalla seconda. Su localhost prova prima il Worker
locale e, se non disponibile, ripiega sull'API pubblica read-only remota.

Dettagli prodotto e stato feature: `docs/product/PRD.md`. Comandi: `docs/runbooks/development.md`.
