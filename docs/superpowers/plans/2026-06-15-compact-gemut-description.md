# Compact Gemüt Description Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the home-header Gemüt definition at a fixed 10 px on all viewports.

**Architecture:** Change only the definition paragraph's Tailwind typography. The existing header flow determines its new height, while `GlobalNavigation` continues measuring the rendered header and centering the menu button.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Node test runner, Vite.

---

### Task 1: Lock and Implement 10 px Typography

**Files:**
- Modify: `tests/site-requirements.test.mjs`
- Modify: `src/pages/Landing.tsx`

- [ ] **Step 1: Write failing test**

Assert the home header region contains `text-[10px]` and no responsive `sm:text-base` override.

- [ ] **Step 2: Verify RED**

Run `node --test tests/site-requirements.test.mjs`; expect failure because the paragraph currently uses `text-sm sm:text-base`.

- [ ] **Step 3: Implement**

Replace the paragraph typography with `text-[10px] leading-relaxed`, keeping existing copy, margins, width, and color.

- [ ] **Step 4: Verify GREEN**

Run `node --test tests/site-requirements.test.mjs`; expect all tests to pass.

### Task 2: Document and Verify

**Files:**
- Modify: `PRD.md`

- [ ] **Step 1: Update PRD**

Document the fixed 10 px definition typography and update the static test count.

- [ ] **Step 2: Run checks**

Run tests, focused lint, global lint, and production build. Report unchanged legacy global lint failures separately.

- [ ] **Step 3: Inspect browser**

Verify desktop and 320 px home layouts. Confirm computed font size is 10 px, navigation is vertically centered in the resized header, and no horizontal overflow exists.
