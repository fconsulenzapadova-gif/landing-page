# Home Service Card Titles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three primary home service-card titles with the approved copy.

**Architecture:** Update text nodes only in `Landing.tsx`. Keep the existing card components, descriptions, icons, destinations, responsive layout, and interactions unchanged.

**Tech Stack:** React 18, TypeScript, Node test runner, Vite.

---

### Task 1: Update and Lock Card Titles

**Files:**
- Modify: `tests/site-requirements.test.mjs`
- Modify: `src/pages/Landing.tsx`

- [ ] **Step 1: Write failing test**

Assert `Landing.tsx` contains exactly `Sto cercando un immobile`, `Vorrei sapere quanto vale il mio immobile`, and `Servizi per l'affitto`; assert the old lowercase and long rental titles are absent.

- [ ] **Step 2: Verify RED**

Run `node --test tests/site-requirements.test.mjs`; expect failure because old titles remain.

- [ ] **Step 3: Implement copy**

Replace only the three `CardTitle` text nodes.

- [ ] **Step 4: Verify GREEN**

Run `node --test tests/site-requirements.test.mjs`; expect all tests to pass.

### Task 2: Document and Verify

**Files:**
- Modify: `PRD.md`

- [ ] **Step 1: Update PRD**

Replace the listed home card titles with approved copy. Keep the static test count current.

- [ ] **Step 2: Run checks**

Run tests, focused lint, global lint, and production build. Report unchanged legacy global lint failures separately.

- [ ] **Step 3: Inspect browser**

Verify desktop and 320 px home layouts. Confirm exact titles, unchanged hrefs, and no horizontal overflow.
