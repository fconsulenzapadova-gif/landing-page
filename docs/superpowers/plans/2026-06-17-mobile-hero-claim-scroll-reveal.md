# Mobile Hero Claim Scroll Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reveal the home hero operational claim once after the visitor scrolls downward past 24 px on mobile.

**Architecture:** Add one local state value, one previous-scroll ref, and one passive scroll effect to `Landing.tsx`. Drive mobile opacity and translation from state while `md:` classes keep desktop rendering immediately visible.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Node test runner, Vite

---

### Task 1: Add mobile-only one-shot scroll reveal

**Files:**
- Modify: `tests/site-requirements.test.mjs:81-125`
- Modify: `src/pages/Landing.tsx:24-125`
- Modify: `PRD.md:179-187`

- [ ] **Step 1: Write failing static requirements**

Add these assertions to the home hero test:

```js
assert.match(
  landing,
  /const \[hasMobileClaimRevealed, setHasMobileClaimRevealed\] = useState\(false\)/,
);
assert.match(landing, /const lastScrollYRef = useRef\(0\)/);
assert.match(landing, /window\.matchMedia\('\(max-width: 767px\)'\)/);
assert.match(landing, /currentScrollY > lastScrollYRef\.current/);
assert.match(landing, /currentScrollY > 24/);
assert.match(
  landing,
  /window\.addEventListener\('scroll', revealMobileClaim, \{ passive: true \}\)/,
);
assert.match(landing, /window\.removeEventListener\('scroll', revealMobileClaim\)/);
assert.match(hero, /hasMobileClaimRevealed/);
assert.match(hero, /translate-y-4 opacity-0/);
assert.match(hero, /md:translate-y-0 md:opacity-100/);
assert.match(hero, /motion-reduce:transition-none/);
```

- [ ] **Step 2: Run test to verify RED**

Run:

```bash
node --test tests/site-requirements.test.mjs
```

Expected: the home hero test fails because mobile claim reveal state and listener do not exist.

- [ ] **Step 3: Add state, scroll ref, and one-shot effect**

Add inside `Landing`:

```tsx
const [hasMobileClaimRevealed, setHasMobileClaimRevealed] = useState(false);
const lastScrollYRef = useRef(0);

useEffect(() => {
  if (hasMobileClaimRevealed) return;

  lastScrollYRef.current = window.scrollY;
  const mobileQuery = window.matchMedia('(max-width: 767px)');

  const revealMobileClaim = () => {
    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > lastScrollYRef.current;
    lastScrollYRef.current = currentScrollY;

    if (mobileQuery.matches && isScrollingDown && currentScrollY > 24) {
      setHasMobileClaimRevealed(true);
    }
  };

  window.addEventListener('scroll', revealMobileClaim, { passive: true });
  return () => window.removeEventListener('scroll', revealMobileClaim);
}, [hasMobileClaimRevealed]);
```

- [ ] **Step 4: Drive claim transition from state**

Replace the claim class with:

```tsx
className={`mx-auto mb-8 max-w-3xl text-xl text-gray-100 drop-shadow-md transition-all duration-500 ease-out motion-reduce:transition-none md:translate-y-0 md:opacity-100 ${
  hasMobileClaimRevealed ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
}`}
```

Remove `animate-fade-in` from this claim so its load animation cannot override the hidden mobile opacity.

- [ ] **Step 5: Update PRD**

Replace the home claim bullet with:

```markdown
- claim operativo su esperienza, professionalita e tecnologia, visibile subito da `md` in su e rivelato una sola volta su mobile con fade/slide dopo il primo scroll verso il basso oltre 24 px;
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

At a 390 x 844 viewport, reload the home page and verify computed opacity is 0 at `scrollY = 0`; scroll downward past 24 px and verify opacity becomes 1, vertical transform returns to rest, and a second scroll keeps it visible. Confirm no horizontal overflow. Reset the viewport, reload, and verify desktop computed opacity is 1 immediately and console contains no errors.
