# Remove Photo Book Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the public photo-book service card, menu entry, detail configuration, and active page while redirecting its old URLs to the home page.

**Architecture:** Keep the shared `ServiceDetail` page for UAV and patrimony evaluation only. Preserve route compatibility with explicit redirects and preserve the shared `piazza-vicina.JPG` asset because `PublicRequests` still uses it.

**Tech Stack:** React 18, TypeScript, React Router 6, Tailwind CSS, Node test runner, Vite.

---

### Task 1: Define Removed-Service Requirements

**Files:**
- Modify: `tests/site-requirements.test.mjs`

- [x] **Step 1: Write the failing tests**

Update required navigation routes to exclude the photo-book route. Add assertions that runtime source contains neither the public copy nor its active `ServiceDetail` slug, and that both old routes redirect to `/`.

```js
test('photo book service is removed and old URLs redirect home', () => {
  const app = read('src/LandingApp.tsx');
  const navigation = read('src/components/GlobalNavigation.tsx');
  const landing = read('src/pages/Landing.tsx');
  const detail = read('src/pages/ServiceDetail.tsx');

  [navigation, landing, detail].forEach((source) => {
    assert.doesNotMatch(source, /Valorizzazione con Book Fotografico/);
    assert.doesNotMatch(source, /Richiedi Book Fotografico/);
  });
  assert.doesNotMatch(detail, /'valorizzazione-book-fotografico':/);
  assert.match(app, /path="\/valorizzazione-book-fotografico" element={<Navigate to="\/" replace \/>}/);
  assert.match(app, /path="\/dettaglio-valorizzazione-book" element={<Navigate to="\/" replace \/>}/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-requirements.test.mjs
```

Expected: FAIL because current runtime still exposes the card, menu entry, active service config, and book CTA.

### Task 2: Remove Runtime Feature

**Files:**
- Modify: `src/pages/Landing.tsx`
- Modify: `src/components/GlobalNavigation.tsx`
- Modify: `src/pages/ServiceDetail.tsx`
- Modify: `src/LandingApp.tsx`

- [x] **Step 1: Remove home card and unused icon**

Delete the complete photo-book `Card` block and remove `Camera` from the `lucide-react` import. Change specialist grid to:

```tsx
<div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
```

- [x] **Step 2: Remove menu item**

Delete:

```tsx
{ label: 'Valorizzazione con Book Fotografico', to: '/valorizzazione-book-fotografico/' },
```

- [x] **Step 3: Remove detail variant**

Remove `Camera`, the `valorizzazione-book-fotografico` slug, its `serviceData` entry, and the unused `purple` color configuration.

- [x] **Step 4: Redirect old URLs home**

Use:

```tsx
<Route path="/valorizzazione-book-fotografico" element={<Navigate to="/" replace />} />
<Route path="/dettaglio-valorizzazione-book" element={<Navigate to="/" replace />} />
```

- [x] **Step 5: Run tests to verify green**

Run the Task 1 command. Expected: 7 tests pass, 0 fail.

### Task 3: Update Product Documentation

**Files:**
- Modify: `PRD.md`

- [x] **Step 1: Record current product state**

Remove the service from the product summary, home description, specialist service list, and primary asset description. Change both book routes to redirects to `/`, update “Tre servizi specialistici” to two, and update the document date to June 15, 2026.

- [x] **Step 2: Confirm repository references**

Run:

```bash
rg -n -i "Valorizzazione con Book Fotografico|Richiedi Book Fotografico|'valorizzazione-book-fotografico':" src tests
```

Expected: no matches. Route strings may remain only in `src/LandingApp.tsx` as redirects.

### Task 4: Verify End to End

**Files:**
- Verify: all modified files

- [x] **Step 1: Run focused lint**

Run ESLint on `src/LandingApp.tsx`, `src/components/GlobalNavigation.tsx`, `src/pages/Landing.tsx`, and `src/pages/ServiceDetail.tsx`. Expected: exit 0.

- [x] **Step 2: Run production build**

Run Vite build directly with bundled Node. Expected: exit 0.

- [x] **Step 3: Verify browser**

Confirm home shows only UAV and patrimony specialist cards; menu omits book service; direct navigation to both old URLs ends at `/`.

- [x] **Step 4: Inspect diff**

Run `git diff --check`, review `git diff`, and confirm `public/piazza-vicina.JPG` remains present and unchanged.
