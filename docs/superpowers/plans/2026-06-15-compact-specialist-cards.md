# Compact Specialist Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the two home specialist cards and all their internal content by about 30%.

**Architecture:** Keep the existing card markup and routes. Apply explicit Tailwind dimensions and spacing to the specialist grid, card headers, icon containers, typography, content, buttons, and arrows so layout dimensions shrink instead of using transforms.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Node test runner, Vite.

---

### Task 1: Add the Compact-Sizing Regression Test

**Files:**
- Modify: `tests/site-requirements.test.mjs`

- [ ] **Step 1: Write the failing test**

Slice the `Servizi su Misura` section from `src/pages/Landing.tsx`. Assert the section uses `max-w-[44rem]`, `gap-5`, compact card header/content padding, 44 px icon containers, 22 px icons, 0.875 rem body/title text, and 28 px CTA height with 0.7 rem text.

- [ ] **Step 2: Verify RED**

Run:

```bash
node --test tests/site-requirements.test.mjs
```

Expected: the compact-card test fails because current classes are larger.

### Task 2: Resize Both Specialist Cards

**Files:**
- Modify: `src/pages/Landing.tsx`
- Test: `tests/site-requirements.test.mjs`

- [ ] **Step 1: Shrink grid and spacing**

Change the specialist grid to `max-w-[44rem]`, `gap-5`, and keep two columns from `md`.

- [ ] **Step 2: Shrink card internals**

For both cards, use compact header/content padding, `h-11 w-11` icon containers, `h-[1.375rem] w-[1.375rem]` icons, `text-[0.875rem]` titles/descriptions, and tighter margins.

- [ ] **Step 3: Shrink CTAs**

Use `h-7`, `text-[0.7rem]`, compact horizontal padding, and 11 px arrow icons while preserving full-width links and focus/hover behavior.

- [ ] **Step 4: Verify GREEN**

Run:

```bash
node --test tests/site-requirements.test.mjs
```

Expected: all tests pass.

### Task 3: Update Documentation and Verify

**Files:**
- Modify: `PRD.md`

- [ ] **Step 1: Update PRD**

Document that the two specialist cards use a compact presentation about 30% smaller. Update the static test count.

- [ ] **Step 2: Run checks**

Run tests, focused lint, global lint, and production build. Report pre-existing global lint failures separately.

- [ ] **Step 3: Inspect responsive layout**

Verify `/` at desktop and 320 px widths. Confirm both cards are smaller, centered, equal-height, readable, clickable, and create no horizontal overflow.
