# Hero Agency Badge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show `agenzia di mediazione immobiliare` in the active home hero badge.

**Architecture:** Preserve the existing React hero structure and `Badge` component. Lock the exact copy in the static requirements test, update the active JSX, then synchronize the PRD.

**Tech Stack:** React 18, TypeScript, Node test runner, Vite

---

### Task 1: Lock and implement badge copy

**Files:**
- Modify: `tests/site-requirements.test.mjs:88-99`
- Modify: `src/pages/Landing.tsx:54-56`
- Modify: `PRD.md:182`

- [ ] **Step 1: Write the failing test**

Replace the old badge assertion and obsolete negative assertion with:

```js
assert.match(hero, />\s*agenzia di mediazione immobiliare\s*</);
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/site-requirements.test.mjs
```

Expected: FAIL because `Landing.tsx` still renders `Agenzia`.

- [ ] **Step 3: Write minimal implementation**

Change the badge body in `src/pages/Landing.tsx` to:

```tsx
<Badge variant="secondary" className="mb-8 animate-fade-in">
  agenzia di mediazione immobiliare
</Badge>
```

Update the PRD home bullet to:

```markdown
- badge hero `agenzia di mediazione immobiliare`;
```

- [ ] **Step 4: Run verification**

Run:

```bash
node --test tests/site-requirements.test.mjs
pnpm lint
pnpm build
```

Expected: all commands exit 0.

- [ ] **Step 5: Verify preview and diff**

Reload `http://localhost:8080/`, confirm exact visible badge copy, inspect console errors, run `git diff --check`, and review only the three intended product files plus this plan.
