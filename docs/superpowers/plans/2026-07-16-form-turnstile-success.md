# Form Turnstile And Success Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide the normal Cloudflare Turnstile widget and replace the static form confirmation with an accessible, brand-consistent GSAP success scene.

**Architecture:** Keep Turnstile's existing explicit render and server verification, but opt into Cloudflare's `interaction-only` appearance and remove permanent layout height. Extract success rendering into `RequestSuccess`, where a scoped `useGSAP` timeline animates a brand circle, SVG check, copy, and actions while respecting reduced motion.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, GSAP, `@gsap/react`, Node test runner.

## Global Constraints

- Preserve Cloudflare Worker, D1, validation, token callbacks, and error fallback behavior.
- Use no new dependency.
- Copy must be `Grazie!` and `Richiesta ricevuta. Ti contatteremo entro un giorno lavorativo.`.
- Turnstile may become visible only when Cloudflare requires visitor interaction; do not conceal an active challenge with CSS.
- Respect `prefers-reduced-motion: reduce` by showing the final state immediately.
- Preserve unrelated dirty work. Do not commit implementation files because every overlapping file already contains user changes; commit only the new plan document.

---

### Task 1: Lock Turnstile And Success Requirements With Failing Tests

**Files:**
- Modify: `tests/site-requirements.test.mjs`
- Test: `tests/site-requirements.test.mjs`

**Interfaces:**
- Consumes: source files read through the existing `read(path)` helper.
- Produces: static regression requirements for `appearance: 'interaction-only'`, no permanent 65 px widget height, and `RequestSuccess` accessibility/copy/GSAP structure.

- [ ] **Step 1: Write failing Turnstile regression assertions**

Extend `lead form uses the Cloudflare API without Supabase or external CRM` after the test-key assertions:

```js
  assert.match(turnstile, /appearance: 'interaction-only'/);
  assert.doesNotMatch(turnstile, /min-h-\[65px\]/);
```

- [ ] **Step 2: Write the failing success-scene test**

Add after the lead-form test:

```js
test('successful request shows an accessible animated confirmation', () => {
  const requests = read('src/pages/RequestsPage.tsx');
  const success = read('src/components/RequestSuccess.tsx');

  assert.match(requests, /<RequestSuccess onReset=\{resetForm\} \/>/);
  assert.match(requests, /<div ref=\{pageRef\}>\s*<RequestSuccess onReset=\{resetForm\} \/>\s*<\/div>/);
  assert.match(success, /Grazie!/);
  assert.match(success, /Richiesta ricevuta\. Ti contatteremo entro un giorno lavorativo\./);
  assert.match(success, /role="status"/);
  assert.match(success, /aria-live="polite"/);
  assert.match(success, /headingRef\.current\?\.focus\(\)/);
  assert.match(success, /onComplete: \(\) => headingRef\.current\?\.focus\(\)/);
  assert.match(success, /useGSAP/);
  assert.match(success, /prefers-reduced-motion: reduce/);
  assert.match(success, /strokeDashoffset/);
});
```

- [ ] **Step 3: Run focused tests and verify RED**

Run:

```bash
node --test --test-name-pattern="lead form|successful request" tests/site-requirements.test.mjs
```

Expected: FAIL because Turnstile lacks `appearance`, still contains `min-h-[65px]`, and `RequestSuccess.tsx` does not exist.

---

### Task 2: Make Turnstile Normally Invisible

**Files:**
- Modify: `src/components/Turnstile.tsx`
- Test: `tests/site-requirements.test.mjs`

**Interfaces:**
- Consumes: existing `TurnstileApi.render` explicit-render configuration.
- Produces: `appearance: 'interaction-only'` while preserving token/error callbacks.

- [ ] **Step 1: Extend the local Turnstile type**

Add the option next to `size`:

```ts
      appearance: 'interaction-only';
```

- [ ] **Step 2: Configure interaction-only appearance**

Add the render option next to `size`:

```ts
          appearance: 'interaction-only',
```

- [ ] **Step 3: Remove permanent widget height without hiding challenges**

Replace the final multiline container with:

```tsx
  return <div ref={containerRef} aria-label="Verifica antispam" />;
```

- [ ] **Step 4: Run the Turnstile regression and verify GREEN for this behavior**

Run:

```bash
node --test --test-name-pattern="lead form" tests/site-requirements.test.mjs
```

Expected: PASS.

---

### Task 3: Build The Accessible GSAP Success Scene

**Files:**
- Create: `src/components/RequestSuccess.tsx`
- Modify: `src/pages/RequestsPage.tsx`
- Test: `tests/site-requirements.test.mjs`

**Interfaces:**
- Consumes: `onReset: () => void`, `ButtonLink`, `Section`, existing brand CSS variables, GSAP, and `useGSAP`.
- Produces: `RequestSuccess({ onReset }: RequestSuccessProps): JSX.Element`.

- [ ] **Step 1: Create the success component**

Create `src/components/RequestSuccess.tsx` with:

```tsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import ButtonLink from './ButtonLink';
import Section from './Section';

gsap.registerPlugin(useGSAP);

interface RequestSuccessProps {
  onReset: () => void;
}

export default function RequestSuccess({ onReset }: RequestSuccessProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const animatedItems = gsap.utils.toArray<HTMLElement>('[data-success-item]');
      const checkPath = sceneRef.current?.querySelector<SVGPathElement>('[data-success-check]');

      if (reduceMotion) {
        gsap.set(animatedItems, { autoAlpha: 1, x: 0, y: 0, scale: 1, clearProps: 'transform,visibility' });
        if (checkPath) gsap.set(checkPath, { strokeDashoffset: 0 });
        headingRef.current?.focus();
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .fromTo('[data-success-scene]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
        .fromTo(
          '[data-success-circle]',
          { autoAlpha: 0, scale: 0.45 },
          { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
        )
        .fromTo(
          '[data-success-check]',
          { strokeDashoffset: 52 },
          { strokeDashoffset: 0, duration: 0.45, ease: 'power2.out' },
          '-=0.22',
        )
        .fromTo(
          '[data-success-copy]',
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            onComplete: () => headingRef.current?.focus(),
          },
          '-=0.18',
        )
        .fromTo(
          '[data-success-actions]',
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.35 },
          '-=0.2',
        );
    },
    { scope: sceneRef },
  );

  return (
    <div ref={sceneRef} role="status" aria-live="polite">
      <Section className="section-line flex min-h-[70vh] items-center bg-[var(--paper-soft)]">
        <div
          data-success-scene
          className="mx-auto w-full max-w-xl rounded-lg border border-[var(--line)] bg-white px-6 py-10 text-center shadow-[0_20px_60px_rgba(18,19,15,0.08)] sm:px-10 sm:py-12"
        >
          <div data-success-circle data-success-item className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[var(--brand-blue)] text-[var(--ink)]">
            <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <path
                data-success-check
                d="M13 24.5 21 32l15-17"
                pathLength="52"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="52"
                strokeDashoffset="52"
              />
            </svg>
          </div>
          <h1 ref={headingRef} data-success-copy data-success-item tabIndex={-1} className="font-display mt-7 text-5xl leading-none text-[var(--ink)] sm:text-6xl">
            Grazie!
          </h1>
          <p data-success-copy data-success-item className="mx-auto mt-4 max-w-md text-base leading-7 text-[var(--graphite)] sm:text-lg">
            Richiesta ricevuta. Ti contatteremo entro un giorno lavorativo.
          </p>
          <div data-success-actions data-success-item className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to="/" variant="outline">Torna alla home</ButtonLink>
            <button type="button" className="focus-ring rounded-lg bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-[var(--ink)]" onClick={onReset}>
              Nuova richiesta
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}
```

- [ ] **Step 2: Wire the component into the request page**

In `src/pages/RequestsPage.tsx`, remove unused imports `ButtonLink` and `Icon`, then add:

```ts
import RequestSuccess from '../components/RequestSuccess';
```

Replace the existing `if (status === 'success')` block with:

```tsx
  if (status === 'success') {
    return (
      <div ref={pageRef}>
        <RequestSuccess onReset={resetForm} />
      </div>
    );
  }
```

- [ ] **Step 3: Run focused success test and verify GREEN**

Run:

```bash
node --test --test-name-pattern="successful request" tests/site-requirements.test.mjs
```

Expected: PASS.

- [ ] **Step 4: Run typecheck and address only implementation errors**

Run:

```bash
npx tsc -p tsconfig.app.json --noEmit
```

Expected: exit 0.

---

### Task 4: Document And Verify The Complete Change

**Files:**
- Modify: `docs/product/PRD.md`
- Modify: `docs/ai/progress.md`
- Verify: all files changed by Tasks 1-3.

**Interfaces:**
- Consumes: implemented Turnstile and success behavior.
- Produces: durable product state and verification evidence.

- [ ] **Step 1: Update request-form UX in the PRD**

Replace `pagina di conferma dopo salvataggio Cloudflare.` with:

```md
- Turnstile normalmente invisibile con comparsa solo quando Cloudflare richiede interazione;
- scena di conferma animata dopo salvataggio Cloudflare, con fallback immediato per `prefers-reduced-motion`.
```

- [ ] **Step 2: Record the milestone**

Add under `## Milestone` in `docs/ai/progress.md`:

```md
- 16 luglio 2026 — Turnstile reso normalmente invisibile e conferma form sostituita con scena GSAP accessibile e rispettosa di `prefers-reduced-motion`.
```

- [ ] **Step 3: Run complete verification**

Run:

```bash
npm test
npm run lint
npx tsc -p tsconfig.app.json --noEmit
npm run build
git diff --check
```

Expected: every command exits 0, with zero failed tests, lint errors, type errors, build errors, or whitespace errors.

- [ ] **Step 4: Inspect scoped diff and preserve unrelated work**

Run:

```bash
git diff -- src/components/Turnstile.tsx src/components/RequestSuccess.tsx src/pages/RequestsPage.tsx tests/site-requirements.test.mjs docs/product/PRD.md docs/ai/progress.md
git status --short
```

Expected: intended form changes are present; unrelated pre-existing dirty files remain untouched and unstaged.
