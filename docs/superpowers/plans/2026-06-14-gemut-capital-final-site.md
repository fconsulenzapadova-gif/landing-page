# Gemut Capital Final Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allineare la webapp React/Vite alla versione finale Gemut Capital descritta in `prompt.md`, verificarla localmente e pubblicarla su Vercel.

**Architecture:** Conservare React Router, Tailwind, shadcn/Radix e Lucide. Montare menu e footer condivisi nel layout del router, mantenere le pagine esistenti e applicare modifiche mirate ai contenuti, alle route e ai wrapper fotografici.

**Tech Stack:** React 18, TypeScript, Vite, React Router 6, Tailwind CSS, Lucide React, Node test runner, Vercel.

---

### Task 1: Acceptance Coverage

**Files:**
- Create: `tests/site-requirements.test.mjs`
- Modify: `package.json`

- [ ] Scrivere test statici per route, copy, asset, menu globale, footer e stringhe vietate.
- [ ] Eseguire il test con il Node test runner e confermare che fallisca sullo stato iniziale.
- [ ] Aggiungere lo script `test` a `package.json`.

### Task 2: Global Public Layout

**Files:**
- Create: `src/components/GlobalNavigation.tsx`
- Create: `src/components/SiteFooter.tsx`
- Modify: `src/LandingApp.tsx`
- Modify: `src/index.css`

- [ ] Implementare il pulsante fisso hamburger/casa con pannello laterale accessibile.
- [ ] Chiudere il pannello dopo ogni navigazione e bloccare lo scroll quando aperto.
- [ ] Montare navigazione e footer fuori dalle singole route.
- [ ] Aggiungere focus visibile, animazioni e stili responsive.

### Task 3: Home Page

**Files:**
- Modify: `src/pages/Landing.tsx`

- [ ] Applicare brand, badge, claim e sottotitolo esatti.
- [ ] Aggiornare `I Nostri Servizi`, inserire il box Gemut e uniformare le tre card senza liste.
- [ ] Conservare e verificare lo smooth scroll della biografia.
- [ ] Mantenere i vantaggi richiesti e uniformare le CTA dei servizi personalizzati.
- [ ] Rimuovere header e footer locali.

### Task 4: Main Service Pages

**Files:**
- Modify: `src/pages/AcquistoCasa.tsx`
- Modify: `src/pages/VenditaImmobili.tsx`
- Modify: `src/pages/Locazioni.tsx`
- Create: `public/Sfondo locazioni.JPG`

- [ ] Usare un solo wrapper fotografico continuo per hero e prima sezione.
- [ ] Conservare CTA e contenuti non citati.
- [ ] Rimuovere `Assistenza Mutui` e `Passaparola`.
- [ ] Correggere il markup JSX invalido già presente.
- [ ] Rimuovere header e footer locali.

### Task 5: Dedicated Services And Public Forms

**Files:**
- Modify: `src/pages/ServiceDetail.tsx`
- Modify: `src/pages/PublicRequests.tsx`
- Modify: `src/pages/ServiziPersonalizzati.tsx`
- Create: `src/pages/Privacy.tsx`
- Create: `src/pages/Prenotazione.tsx`

- [ ] Applicare titoli, descrizioni e CTA esatti alle tre pagine dedicate.
- [ ] Conservare le sezioni informative e usare lo sfondo patrimoniale richiesto.
- [ ] Rimuovere header duplicati, controlli Indietro e link Area Clienti.
- [ ] Ripristinare le pagine mancanti richieste dal router con layout coerente.

### Task 6: Route And Asset Verification

**Files:**
- Modify: `src/LandingApp.tsx`
- Modify: `vercel.json` only if necessary

- [ ] Conservare le route interne e il fallback SPA.
- [ ] Reindirizzare `/servizi-premium` alla home e mantenere i redirect legacy pertinenti.
- [ ] Verificare i nomi asset con maiuscole, spazi ed estensioni esatte.
- [ ] Eseguire test, lint e build di produzione.

### Task 7: Browser And Production Verification

- [ ] Avviare `vite preview` su `127.0.0.1:4173`.
- [ ] Verificare le nove route richieste a desktop, tablet e mobile.
- [ ] Provare menu, animazione hamburger/casa e smooth scroll.
- [ ] Controllare errori console, overflow e risposte degli asset.
- [ ] Eseguire deploy Vercel di produzione.
- [ ] Verificare deployment e `https://www.gemutcapital.com/` con HTTP 200.

