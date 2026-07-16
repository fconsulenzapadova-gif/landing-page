# Architecture Overview

Ultimo aggiornamento: 16 luglio 2026

## Runtime

`index.html` → `src/main-landing.tsx` → `LandingApp` → `BrowserRouter` → route lazy-loaded → `AppLayout` → pagina pubblica.

Stack: React 18, TypeScript, Vite 8, React Router 6, Tailwind CSS,
GSAP/ScrollTrigger, Vercel per il frontend e Cloudflare Workers + D1 +
Turnstile per la raccolta lead.

## Confini moduli

- Router e redirect: `src/LandingApp.tsx`.
- Layout globale: `src/components/AppLayout.tsx`, `Navigation.tsx`, `Footer.tsx`, `CookieConsent.tsx`.
- Contenuti, route e dati societari: `src/content/site.ts`.
- Pagine pubbliche: `src/pages/`.
- Catalogo: `src/lib/listings.ts`, `src/lib/useListings.ts`, componenti `Listing*`.
- Lead frontend: `src/pages/RequestsPage.tsx` → `src/lib/leads.ts` → Worker Cloudflare.
- Lead backend: `cloudflare/src/index.ts` → validazione server + Turnstile → D1
  → notifica tramite Gmail API con scope limitato a `gmail.send`.
- Motion: `src/lib/usePageAnimations.ts`; animazioni specifiche home in `HomePage.tsx`.
- Proxy immagini Drive: `api/drive-images.ts`, riusato dal middleware Vite in dev/preview.

## Flussi dati

### Immobili

Browser → export CSV pubblico Google Sheets → parser `listings.ts` → pagine/card. Cartella Drive pubblica → `/api/drive-images` → parser HTML `embeddedfolderview` → immagini ordinate, con `copertina.*` prioritaria.

Nessuna Google API, OAuth o chiave. Se fonte non disponibile, nessun immobile inventato; per riga senza immagini viene usato fallback locale neutro.

### Lead

Wizard pubblico → validazione client → `POST /api/leads` sul Worker → controllo
origine, payload, honeypot e Turnstile → insert idempotente in D1. Il browser non
possiede credenziali database e non esiste un endpoint pubblico di lettura. Il
Worker non salva IP, token Turnstile o user agent e non inoltra dati a CRM terzi.
Solo un nuovo inserimento D1 genera la notifica, evitando duplicati sullo stesso
`requestId`. Un errore email viene registrato nei log ma non annulla il lead già
salvato. Le credenziali OAuth Gmail restano esclusivamente nei secret del Worker.

## Deploy

Vercel installa dipendenze, esegue build Vite, pubblica `dist` e riscrive route
SPA verso `index.html`. La funzione Edge `api/drive-images.ts` espone solo il
proxy same-origin della cartella Drive pubblica. Il Worker lead è distribuito
separatamente con Wrangler, usa un binding D1 e riceve dal frontend solo tramite
`VITE_LEADS_API_URL`.

Dettagli prodotto e stato feature: `docs/product/PRD.md`. Comandi: `docs/runbooks/development.md`.
