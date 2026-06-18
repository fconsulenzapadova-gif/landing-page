# Why Choose Mobile Fade Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reveal the `Perché Sceglierci` heading and four reasons one by one on mobile using opacity only.

**Architecture:** Extend `Landing.tsx` with section-local item refs, one-shot reveal state, and a mobile `IntersectionObserver`. Keep desktop visible through `md:opacity-100`; keep the existing services observer independent.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, IntersectionObserver, Node test runner.

---

### Task 1: Add failing static requirement

**Files:**
- Modify: `tests/site-requirements.test.mjs:180`

- [ ] **Step 1: Write failing test**

Add:

```js
test('why choose uses mobile one-shot fade-only reveals', () => {
  const landing = read('src/pages/Landing.tsx');
  const whyChoose = landing.slice(
    landing.indexOf('{/* Why Choose Me Section */}'),
    landing.indexOf('{/* Servizi su Misura Section */}'),
  );

  assert.match(landing, /const \[revealedMobileWhyChooseItems, setRevealedMobileWhyChooseItems\]/);
  assert.match(landing, /const whyChooseRevealRefs = useRef/);
  assert.match(landing, /setRevealedMobileWhyChooseItems\(new Set\(\[0, 1, 2, 3, 4\]\)\)/);
  assert.match(landing, /whyChooseObserver\.unobserve\(entry\.target\)/);
  for (let index = 0; index < 5; index += 1) {
    assert.match(whyChoose, new RegExp(`data-why-choose-reveal-index="${index}"`));
  }
  assert.match(whyChoose, /transition-opacity/);
  assert.match(whyChoose, /opacity-0/);
  assert.match(whyChoose, /md:opacity-100/);
  assert.match(whyChoose, /motion-reduce:transition-none/);
  assert.doesNotMatch(whyChoose, /(?:^|\\s)-?(?:translate|scale)-/);
});
```

- [ ] **Step 2: Verify RED**

Run:

```bash
PATH="/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" /Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx npm@10 test
```

Expected: new test fails because `revealedMobileWhyChooseItems` and `data-why-choose-reveal-index` do not exist.

### Task 2: Implement one-shot mobile fades

**Files:**
- Modify: `src/pages/Landing.tsx:24-126`
- Modify: `src/pages/Landing.tsx:432-475`

- [ ] **Step 1: Add state and refs**

Add:

```tsx
const [revealedMobileWhyChooseItems, setRevealedMobileWhyChooseItems] = useState<Set<number>>(
  new Set(),
);
const whyChooseRevealRefs = useRef<(HTMLDivElement | null)[]>([]);
```

- [ ] **Step 2: Add observer**

Add:

```tsx
useEffect(() => {
  const whyChooseItems = whyChooseRevealRefs.current.filter(
    (item): item is HTMLDivElement => item !== null,
  );

  if (whyChooseItems.length !== 5) return;

  if (!('IntersectionObserver' in window)) {
    setRevealedMobileWhyChooseItems(new Set([0, 1, 2, 3, 4]));
    return;
  }

  const whyChooseObserver = new IntersectionObserver(
    (entries) => {
      const revealedIndexes = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => Number((entry.target as HTMLElement).dataset.whyChooseRevealIndex));

      if (revealedIndexes.length === 0) return;

      setRevealedMobileWhyChooseItems((currentItems) => {
        const nextItems = new Set(currentItems);
        revealedIndexes.forEach((index) => nextItems.add(index));
        return nextItems;
      });

      entries.forEach((entry) => {
        if (entry.isIntersecting) whyChooseObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
  );

  whyChooseItems.forEach((item) => whyChooseObserver.observe(item));
  return () => whyChooseObserver.disconnect();
}, []);
```

- [ ] **Step 3: Mark and style targets**

Assign index `0` to the heading group and `1` through `4` to reasons. Each target uses:

```tsx
className={`transition-opacity duration-700 ease-out motion-reduce:transition-none md:opacity-100 ${
  revealedMobileWhyChooseItems.has(index) ? 'opacity-100' : 'opacity-0'
}`}
```

Preserve existing spacing and `text-center` classes. Do not add translate, scale, delay, or absolute positioning.

- [ ] **Step 4: Verify GREEN**

Run full test command. Expected: all tests pass.

### Task 3: Document and verify

**Files:**
- Modify: `PRD.md:177-190`

- [ ] **Step 1: Update PRD**

Replace the generic advantages bullet with explicit active behavior: mobile heading/subtitle fade first, then four reasons fade individually on viewport entry; fade-only, one-shot; desktop remains static.

- [ ] **Step 2: Run quality gates**

Run `test`, `lint`, and `build` through `pnpm dlx npm@10`. Expected: zero failures/errors; stale browser-data warnings may remain non-blocking.

- [ ] **Step 3: Browser verification**

At approximately 390 px, verify five independent fade-only reveals, no layout shift, and no replay on upward scroll. At desktop width, verify all content stays visible. Check console for errors.

- [ ] **Step 4: Review diff**

Run `git diff --check` and inspect diffs limited to test, `Landing.tsx`, and `PRD.md`. Do not alter unrelated dirty files.
