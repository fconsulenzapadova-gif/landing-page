# Home Menu Alignment and Request Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Center the global menu button in the home header and use one continuous Prato della Valle background on the public request page.

**Architecture:** `GlobalNavigation` derives a route-specific inline `top` value by measuring the home `header` and observing size changes. `PublicRequests` owns one background image on its outer container; the hero stays transparent except for its contrast overlay and content panel.

**Tech Stack:** React 18, TypeScript, React Router 6, Tailwind CSS, Node test runner, Vite.

---

### Task 1: Add Regression Tests

**Files:**
- Modify: `tests/site-requirements.test.mjs`

- [ ] **Step 1: Test dynamic home alignment**

Read `src/components/GlobalNavigation.tsx` and assert it uses the home pathname, queries the page header, observes its size, and applies a computed top style while preserving `top-4` for other routes.

- [ ] **Step 2: Test the request background**

Read `src/pages/PublicRequests.tsx`; assert `/prato-padova.jpg` is present and `/piazza-vicina.JPG` plus `/padova-test.jpg` are absent.

- [ ] **Step 3: Verify RED**

Run:

```bash
node --test tests/site-requirements.test.mjs
```

Expected: the two new tests fail because both requested behaviors are missing.

### Task 2: Implement Dynamic Home Menu Position

**Files:**
- Modify: `src/components/GlobalNavigation.tsx`
- Test: `tests/site-requirements.test.mjs`

- [ ] **Step 1: Track home button top**

Add state for the measured button position. On `/`, find the rendered `header`, calculate `(headerHeight - 48) / 2`, and update state.

- [ ] **Step 2: Observe layout changes**

Use `ResizeObserver` and a window resize listener. Disconnect/remove both in effect cleanup. Reset to default positioning outside `/`.

- [ ] **Step 3: Apply route-specific positioning**

Use inline `style={{ top: homeButtonTop }}` on `/`; retain the `top-4` Tailwind class elsewhere.

### Task 3: Unify Request Page Background

**Files:**
- Modify: `src/pages/PublicRequests.tsx`
- Test: `tests/site-requirements.test.mjs`

- [ ] **Step 1: Replace outer background**

Set the outer container image to `/prato-padova.jpg`.

- [ ] **Step 2: Remove the hero image layer**

Remove `/padova-test.jpg` and the hero background-image style. Remove the opaque gradient background class so the page background remains continuous. Keep the dark overlay and emerald panel.

- [ ] **Step 3: Verify GREEN**

Run:

```bash
node --test tests/site-requirements.test.mjs
```

Expected: all tests pass.

### Task 4: Update Documentation and Verify

**Files:**
- Modify: `PRD.md`

- [ ] **Step 1: Update PRD**

Document dynamic home-header menu alignment and the single Prato della Valle request-page background. Remove the statement that `/piazza-vicina.JPG` is used by the request form. Update the static test count.

- [ ] **Step 2: Run automated checks**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: tests and build exit 0. Report pre-existing global lint failures separately if unchanged; run focused lint on modified source/test files.

- [ ] **Step 3: Verify browser behavior**

Check `/` at desktop and 320 px widths, `/richieste?type=acquisto`, and `/acquisto-casa`. Confirm measured centering, continuous background, readable content, no horizontal overflow, and default menu position off home.
