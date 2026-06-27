# Interactive Gemut Definition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reveal the German meaning of Gemut above the home hero title on desktop hover or keyboard focus and toggle it on touch tap.

**Architecture:** Keep one disclosure state in `Landing.tsx` so visible state and `aria-expanded` remain synchronized for every input method. Render a collapsible CSS-grid row before the title; its row height, opacity, translation, and margin transition move the surrounding hero copy without absolute positioning.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Node test runner, Vite

---

### Task 1: Add accessible animated hero disclosure

**Files:**
- Modify: `tests/site-requirements.test.mjs:81-106`
- Modify: `src/pages/Landing.tsx:24-70`
- Modify: `PRD.md:179-186`

- [ ] **Step 1: Write the failing static requirement test**

Add assertions to the home hero test:

```js
const definition = "Il termine tedesco Gemüt indica l'animo";
assert.ok(hero.indexOf(definition) < hero.indexOf('<h2'));
assert.match(landing, /const \[isGemutDefinitionOpen, setIsGemutDefinitionOpen\] = useState\(false\)/);
assert.match(hero, /onPointerEnter=\{handleGemutPointerEnter\}/);
assert.match(landing, /const handleGemutDisclosurePointerLeave = \(event: React\.PointerEvent<HTMLDivElement>\)/);
assert.match(hero, /onPointerLeave=\{handleGemutDisclosurePointerLeave\}/);
assert.match(hero, /onPointerUp=\{handleGemutPointerUp\}/);
assert.match(hero, /event\.pointerType === 'touch'/);
assert.match(hero, /onFocus=\{handleGemutFocus\}/);
assert.match(hero, /onBlur=\{handleGemutBlur\}/);
assert.match(hero, /aria-expanded=\{isGemutDefinitionOpen\}/);
assert.match(hero, /aria-controls="gemut-definition"/);
assert.match(hero, /grid-rows-\[0fr\]/);
assert.match(hero, /grid-rows-\[1fr\]/);
assert.match(hero, /transition-\[grid-template-rows,opacity,transform,margin\]/);
```

- [ ] **Step 2: Run test to verify RED**

Run:

```bash
node --test tests/site-requirements.test.mjs
```

Expected: the home hero test fails because disclosure state and interaction handlers do not exist and the definition follows the title.

- [ ] **Step 3: Add minimal interaction state and handlers**

Inside `Landing`, add:

```tsx
const [isGemutDefinitionOpen, setIsGemutDefinitionOpen] = useState(false);

const handleGemutPointerEnter = (event: React.PointerEvent<HTMLButtonElement>) => {
  if (event.pointerType !== 'touch') setIsGemutDefinitionOpen(true);
};

const handleGemutDisclosurePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
  if (event.pointerType !== 'touch') setIsGemutDefinitionOpen(false);
};

const handleGemutPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
  if (event.pointerType === 'touch') setIsGemutDefinitionOpen((isOpen) => !isOpen);
};

const handleGemutFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
  if (event.currentTarget.matches(':focus-visible')) setIsGemutDefinitionOpen(true);
};

const handleGemutBlur = () => setIsGemutDefinitionOpen(false);
```

- [ ] **Step 4: Render definition before title and make name interactive**

Wrap the definition and title in `<div onPointerLeave={handleGemutDisclosurePointerLeave}>` so title movement cannot cancel hover. Use a collapsed grid row with `id="gemut-definition"`, `aria-hidden={!isGemutDefinitionOpen}`, and state-driven classes:

```tsx
<div
  id="gemut-definition"
  aria-hidden={!isGemutDefinitionOpen}
  className={`grid transition-[grid-template-rows,opacity,transform,margin] duration-300 ease-out ${
    isGemutDefinitionOpen
      ? 'mb-5 grid-rows-[1fr] translate-y-0 opacity-100'
      : 'mb-0 grid-rows-[0fr] -translate-y-2 opacity-0'
  }`}
>
  <div className="overflow-hidden">
    <p className="mx-auto max-w-3xl text-sm leading-relaxed text-blue-50 drop-shadow-md sm:text-base">
      Il termine tedesco Gemüt indica l'animo, lo spirito o l'indole di una persona,
      rappresenta la sfera emotiva, il cuore o il temperamento intesi come sede dei
      sentimenti.
    </p>
  </div>
</div>
```

Replace the title name span with:

```tsx
<button
  type="button"
  className="rounded-sm text-sky-200 underline decoration-sky-200/50 decoration-2 underline-offset-4 transition-colors hover:text-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
  aria-expanded={isGemutDefinitionOpen}
  aria-controls="gemut-definition"
  onPointerEnter={handleGemutPointerEnter}
  onPointerUp={handleGemutPointerUp}
  onFocus={handleGemutFocus}
  onBlur={handleGemutBlur}
>
  Gemüt Capital
</button>
```

Keep the rest of the title and operational claim after the title.

- [ ] **Step 5: Update PRD behavior**

Replace the home definition bullet with:

```markdown
- definizione del termine tedesco Gemüt nascosta per default e mostrata sopra il titolo su hover/focus di `Gemüt Capital` o tap mobile, con espansione animata che sposta titolo e claim;
```

- [ ] **Step 6: Verify GREEN and quality gates**

Run:

```bash
node --test tests/site-requirements.test.mjs
pnpm lint
pnpm build
```

Expected: 15 tests pass; lint and build exit 0.

- [ ] **Step 7: Verify browser behavior**

Reload `http://localhost:8080/`. Verify the definition is hidden initially, appears above the title on mouse hover, disappears on pointer leave, opens on keyboard focus, and toggles over two taps at a mobile viewport. Confirm title movement, no console errors, and no unrelated diff changes.
