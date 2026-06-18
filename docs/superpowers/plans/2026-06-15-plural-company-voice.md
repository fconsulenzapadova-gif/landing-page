# Plural Company Voice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert all active public-site company copy from first-person singular to first-person plural while preserving singular customer language and leaving the complete “Scopri Chi Sono Io” area unchanged.

**Architecture:** Apply a manual semantic copy audit to existing JSX and user-visible runtime messages. Add static regression tests that isolate the protected biography block, assert representative plural copy, reject known singular company phrases outside that block, and preserve routes and customer-voice text.

**Tech Stack:** React 18, TypeScript, Vite, React Router, Tailwind CSS, Node test runner.

---

## File Map

- Modify `tests/site-requirements.test.mjs`: add plural-voice and protected-biography regression coverage.
- Modify `src/pages/Landing.tsx`: pluralize company copy outside the biography block.
- Modify `src/pages/AcquistoCasa.tsx`: pluralize acquisition-service copy.
- Modify `src/pages/VenditaImmobili.tsx`: pluralize sales-service headings and copy.
- Modify `src/pages/Locazioni.tsx`: pluralize rental-service copy.
- Modify `src/pages/ServiziPersonalizzati.tsx`: pluralize process heading and active verbs.
- Modify `src/pages/ServiceDetail.tsx`: pluralize specialist-service CTA copy.
- Modify `src/pages/PublicRequests.tsx`: verify all company messages already use plural and correct any residue.
- Modify `src/pages/Prenotazione.tsx`: verify company voice remains plural.
- Modify `src/pages/Privacy.tsx`: verify no company singular copy exists.
- Modify `src/pages/ClientAccess.tsx`: verify active legacy route copy remains plural.
- Modify `src/components/GlobalNavigation.tsx`: verify shared CTA copy.
- Modify `src/components/SiteFooter.tsx`: verify shared legal/contact copy.
- Modify `src/components/CookieConsent.tsx`: verify shared company voice remains plural.
- Modify `src/components/WhatsAppButton.tsx`: verify shared contact labels.
- Modify `src/utils/clientRequestProcessor.ts`: verify user-visible result messages use plural.
- Modify `PRD.md`: document the editorial voice and biography exception.

### Task 1: Add Plural-Voice Regression Tests

**Files:**
- Modify: `tests/site-requirements.test.mjs`

- [ ] **Step 1: Write the failing tests**

Add helpers and tests equivalent to:

```js
const landingSource = read('src/pages/Landing.tsx');
const aboutStart = landingSource.indexOf('{/* Chi Sono Io Toggle Button */}');
const aboutEnd = landingSource.indexOf('{/* Why Choose Me Section */}');
const landingWithoutAbout =
  landingSource.slice(0, aboutStart) + landingSource.slice(aboutEnd);
```

Assert representative plural copy:

```js
assert.match(landingWithoutAbout, /Ti aiutiamo a trovare la casa perfetta/);
assert.match(landingWithoutAbout, /La nostra esperienza e dedizione/);
assert.match(landingWithoutAbout, /Contattaci oggi stesso/);
assert.match(landingWithoutAbout, /Siamo sempre disponibili/);

const acquisition = read('src/pages/AcquistoCasa.tsx');
assert.match(acquisition, /Ti accompagniamo in ogni fase/);
assert.match(acquisition, /Come Ti Aiutiamo nell'Acquisto/);
assert.match(acquisition, /Analizziamo le tue esigenze e cerchiamo immobili/);
assert.match(acquisition, /Ci occupiamo di tutta la documentazione/);

const sale = read('src/pages/VenditaImmobili.tsx');
assert.match(sale, /La Nostra Strategia di Marketing/);
assert.match(sale, /Perché Affidarti a Noi/);
assert.match(sale, /Ci occupiamo di tutto/);

const rentals = read('src/pages/Locazioni.tsx');
assert.match(rentals, /Gestiamo ogni aspetto della locazione/);
assert.match(rentals, /Aiutiamo gli inquilini/);
assert.match(rentals, /Ascoltiamo le tue esigenze specifiche/);

const custom = read('src/pages/ServiziPersonalizzati.tsx');
assert.match(custom, /Come Lavoriamo sui Progetti Personalizzati/);
assert.match(custom, /Studiamo nel dettaglio le tue esigenze specifiche/);
assert.match(custom, /Sviluppiamo un piano d'azione specifico/);

const detail = read('src/pages/ServiceDetail.tsx');
assert.match(detail, /Raccontaci l’immobile e l’obiettivo: ti indichiamo il percorso più adatto/);
```

Protect customer voice and biography:

```js
const aboutBlock = landingSource.slice(aboutStart, aboutEnd);
assert.match(aboutBlock, /Sono <strong/);
assert.match(aboutBlock, /La mia attività nasce/);
assert.match(aboutBlock, /Il mio approccio/);
assert.match(aboutBlock, /offro un servizio completo/);
assert.match(aboutBlock, /accompagno i miei clienti/);
assert.match(landingSource, /Vorrei sapere quanto vale il mio immobile/);
```

Reject known company singular copy outside the biography:

```js
[
  landingWithoutAbout,
  acquisition,
  sale,
  rentals,
  custom,
  detail,
].forEach((source) => {
  [
    /Ti aiuto\b/,
    /Ti accompagno\b/,
    /Come Ti Aiuto\b/,
    /\bAnalizzo\b/,
    /\bGestisco\b/,
    /\bAscolto\b/,
    /\bMi occupo\b/,
    /\bContattami\b/,
    /\bRaccontami\b/,
    /\bti indico\b/,
    /\bLa Mia Strategia\b/,
    /\bAffidarti a Me\b/,
    /\bCome Lavoro\b/,
  ].forEach((pattern) => assert.doesNotMatch(source, pattern));
});
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
npm test
```

Expected: plural-company-voice test fails on current singular phrases such as `Ti aiuto`, `Ti accompagno`, or `La Mia Strategia`.

### Task 2: Convert Home Copy Without Touching Biography

**Files:**
- Modify: `src/pages/Landing.tsx`

- [ ] **Step 1: Apply exact semantic replacements outside the protected block**

Use:

```text
Ti aiuto a trovare... → Ti aiutiamo a trovare...
La mia esperienza e dedizione fanno... → La nostra esperienza e dedizione fanno...
Contattami oggi stesso... → Contattaci oggi stesso...
Sono sempre disponibile... → Siamo sempre disponibili...
aria-label="Contattami su WhatsApp" → aria-label="Contattaci su WhatsApp"
```

Do not edit text between:

```tsx
{/* Chi Sono Io Toggle Button */}
```

and:

```tsx
{/* Why Choose Me Section */}
```

- [ ] **Step 2: Run the plural-copy tests**

Run:

```bash
npm test
```

Expected: home assertions pass; remaining tests still fail on other pages.

### Task 3: Convert Core Service Pages

**Files:**
- Modify: `src/pages/AcquistoCasa.tsx`
- Modify: `src/pages/VenditaImmobili.tsx`
- Modify: `src/pages/Locazioni.tsx`

- [ ] **Step 1: Convert acquisition copy**

Apply:

```text
Ti accompagno → Ti accompagniamo
Come Ti Aiuto nell'Acquisto → Come Ti Aiutiamo nell'Acquisto
Analizzo ... e cerco ... → Analizziamo ... e cerchiamo ...
Controllo ... e ti assisto ... → Controlliamo ... e ti assistiamo ...
Ti accompagno nelle visite → Ti accompagniamo nelle visite
Gestisco la trattativa → Gestiamo la trattativa
Mi occupo di tutta la documentazione → Ci occupiamo di tutta la documentazione
Ti seguo in ogni fase → Ti seguiamo in ogni fase
```

- [ ] **Step 2: Convert sales copy**

Apply:

```text
La Mia Strategia di Marketing → La Nostra Strategia di Marketing
Perché Affidarti a Me → Perché Affidarti a Noi
Mi occupo di tutto → Ci occupiamo di tutto
```

- [ ] **Step 3: Convert rental copy**

Apply:

```text
Gestisco ogni aspetto → Gestiamo ogni aspetto
Aiuto gli inquilini → Aiutiamo gli inquilini
Ascolto le tue esigenze → Ascoltiamo le tue esigenze
```

Keep nominal list item `Controllo clausole contrattuali` unchanged.

- [ ] **Step 4: Run tests**

Run:

```bash
npm test
```

Expected: home and core-service plural assertions pass; remaining failures identify custom/specialist copy.

### Task 4: Convert Custom and Specialist Service Copy

**Files:**
- Modify: `src/pages/ServiziPersonalizzati.tsx`
- Modify: `src/pages/ServiceDetail.tsx`

- [ ] **Step 1: Convert custom-service copy**

Apply:

```text
Come Lavoro sui Progetti Personalizzati → Come Lavoriamo sui Progetti Personalizzati
Studio dettagliato delle tue esigenze... → Studiamo nel dettaglio le tue esigenze...
Sviluppo di un piano d'azione... → Sviluppiamo un piano d'azione...
```

Keep the existing plural alert `Ti contatteremo presto`.

- [ ] **Step 2: Convert specialist CTA copy**

Apply:

```text
Raccontami l’immobile e l’obiettivo: ti indico il percorso più adatto.
→
Raccontaci l’immobile e l’obiettivo: ti indichiamo il percorso più adatto.
```

- [ ] **Step 3: Run tests and verify GREEN**

Run:

```bash
npm test
```

Expected: all static tests pass.

### Task 5: Audit Remaining Active User-Visible Copy

**Files:**
- Verify/modify: `src/pages/PublicRequests.tsx`
- Verify/modify: `src/pages/Prenotazione.tsx`
- Verify/modify: `src/pages/Privacy.tsx`
- Verify/modify: `src/pages/ClientAccess.tsx`
- Verify/modify: `src/components/GlobalNavigation.tsx`
- Verify/modify: `src/components/SiteFooter.tsx`
- Verify/modify: `src/components/CookieConsent.tsx`
- Verify/modify: `src/components/WhatsAppButton.tsx`
- Verify/modify: `src/utils/clientRequestProcessor.ts`

- [ ] **Step 1: Search for residual company singular forms**

Run:

```bash
rg -n -i "\b(mia|mio|miei|mie|mi|io|sono|aiuto|accompagno|analizzo|cerco|controllo|gestisco|ascolto|studio|sviluppo|offro|seguo|garantisco|indico|raccontami|contattami)\b" \
  src/pages src/components src/utils \
  --glob '!src/components/ui/**' \
  --glob '!src/components/Dashboard.tsx' \
  --glob '!src/components/PageHeader.tsx' \
  --glob '!src/components/BackButton.tsx'
```

Classify every match as:

- protected biography;
- customer voice;
- nominal/legal text;
- technical/non-visible text;
- company singular residue requiring conversion.

- [ ] **Step 2: Correct only confirmed user-visible company residues**

Preserve already-correct plural examples:

```text
Ti contatteremo entro 24 ore
Raccontaci la tua esigenza immobiliare
Utilizziamo cookie tecnici essenziali
Ci aiutano a capire come interagisci
La tua richiesta sarà processata dal nostro team
```

- [ ] **Step 3: Run all tests**

Run:

```bash
npm test
```

Expected: all tests pass.

### Task 6: Update Product Documentation

**Files:**
- Modify: `PRD.md`

- [ ] **Step 1: Document the editorial rule**

Add to the public-experience section:

```text
Il copy pubblico usa la prima persona plurale per la voce di Gemüt Capital e mantiene il cliente come interlocutore singolare. La sezione espandibile "Scopri Chi Sono Io" conserva la voce personale di Filippo Marcuzzo in prima persona singolare.
```

Update the test count only if the final suite count changes.

- [ ] **Step 2: Verify PRD against runtime state**

Run:

```bash
rg -n "prima persona plurale|Scopri Chi Sono Io|test statici:" PRD.md
```

Expected: editorial rule and current test count present.

### Task 7: Final Verification

**Files:**
- Verify all modified files.

- [ ] **Step 1: Run static tests**

```bash
npm test
```

Expected: zero failures.

- [ ] **Step 2: Run focused lint**

```bash
npx eslint \
  src/pages/Landing.tsx \
  src/pages/AcquistoCasa.tsx \
  src/pages/VenditaImmobili.tsx \
  src/pages/Locazioni.tsx \
  src/pages/ServiziPersonalizzati.tsx \
  src/pages/ServiceDetail.tsx \
  src/pages/PublicRequests.tsx \
  src/pages/Prenotazione.tsx \
  src/pages/Privacy.tsx \
  src/pages/ClientAccess.tsx \
  src/components/GlobalNavigation.tsx \
  src/components/SiteFooter.tsx \
  src/components/CookieConsent.tsx \
  src/components/WhatsAppButton.tsx \
  src/utils/clientRequestProcessor.ts \
  tests/site-requirements.test.mjs
```

Expected: no new lint errors in edited files.

- [ ] **Step 3: Run global lint**

```bash
npm run lint
```

Expected: record result separately; do not attribute pre-existing legacy failures to this copy task.

- [ ] **Step 4: Run production build**

```bash
npm run build
```

Expected: Vite build exits successfully.

- [ ] **Step 5: Verify browser rendering**

At desktop and 320 px mobile:

- open `/`, `/acquisto-casa`, `/vendita-immobili`, `/locazioni`, `/servizi-personalizzati`, `/verifica-stato-tetto`, `/richieste`;
- verify representative plural copy is visible;
- open “Scopri Chi Sono Io” and verify personal singular copy remains;
- verify no horizontal overflow;
- verify routes and CTAs remain unchanged.

- [ ] **Step 6: Inspect diff and working tree**

Run:

```bash
git diff --check
git diff --stat
git status --short
```

Expected: no whitespace errors; only intended copy/tests/PRD changes plus previously existing user changes.
