# Move Gemüt Description to Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the existing Gemüt definition from the services introduction into an expanded home header.

**Architecture:** Keep the change inside the existing `Landing` page. A static source test identifies the header and services-introduction regions, ensuring the copy appears only in the intended region. Update the PRD home description to match runtime placement.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Node test runner, Vite.

---

### Task 1: Lock Header Copy Placement

**Files:**
- Modify: `tests/site-requirements.test.mjs`
- Test: `tests/site-requirements.test.mjs`

- [ ] **Step 1: Write the failing test**

Add a test that slices `Landing.tsx` into the `<header>` region and the services introduction before the card grid. Assert the Gemüt definition is present in the header and absent from the services introduction.

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/site-requirements.test.mjs
```

Expected: FAIL because the definition is still inside the services introduction.

### Task 2: Move the Description

**Files:**
- Modify: `src/pages/Landing.tsx`
- Test: `tests/site-requirements.test.mjs`

- [ ] **Step 1: Implement the header layout**

Change the header container to centered vertical content with responsive vertical padding. Keep `Gemüt Capital` as the heading and place the existing definition below it in a constrained paragraph.

- [ ] **Step 2: Remove the old services panel**

Delete the bordered definition panel below the `I Nostri Servizi` introduction.

- [ ] **Step 3: Run the test to verify it passes**

Run:

```bash
node --test tests/site-requirements.test.mjs
```

Expected: all tests PASS.

### Task 3: Align Documentation and Verify

**Files:**
- Modify: `PRD.md`

- [ ] **Step 1: Update product documentation**

Clarify in section 7.2 that the Gemüt explanation appears in the expanded home header above the hero.

- [ ] **Step 2: Run automated verification**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all commands exit 0. Existing non-blocking browser-data freshness warnings may remain.

- [ ] **Step 3: Verify responsive rendering**

Open `http://localhost:8080/` at desktop and mobile widths. Confirm the title and description are readable, centered, non-overlapping, and the definition no longer appears below `I Nostri Servizi`.
