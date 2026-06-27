# Services Reverse Scroll Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the home services animation replay backward while the user scrolls upward, hiding card 3, card 2, card 1, then the heading.

**Architecture:** Keep the two existing `IntersectionObserver` instances in `Landing.tsx`, but retain observation and combine callbacks with a scroll-direction ref. Desktop uses reversible section state plus conditional CSS delays; mobile keeps independent item state and removes an item only when it exits through the lower viewport boundary during upward scrolling.

**Tech Stack:** React 18, TypeScript, IntersectionObserver, Tailwind CSS, Node test runner, Vite.

---

### Task 1: Lock the bidirectional animation contract

**Files:**
- Modify: `tests/site-requirements.test.mjs:146-178`

- [ ] **Step 1: Replace the one-shot static test with a failing bidirectional contract**

```js
test('home services use responsive bidirectional reveal sequences', () => {
  const landing = read('src/pages/Landing.tsx');
  const services = landing.slice(
    landing.indexOf('{/* Services Section */}'),
    landing.indexOf('{/* Chi Sono Io Toggle Button */}'),
  );

  assert.match(
    landing,
    /const \[hasDesktopServicesRevealed, setHasDesktopServicesRevealed\] = useState\(false\)/,
  );
  assert.match(
    landing,
    /const \[revealedMobileServiceItems, setRevealedMobileServiceItems\]/,
  );
  assert.match(
    landing,
    /const servicesScrollDirectionRef = useRef<'up' \| 'down'>\('down'\)/,
  );
  assert.match(landing, /const servicesSectionRef = useRef<HTMLElement>\(null\)/);
  assert.match(landing, /new IntersectionObserver/);
  assert.match(landing, /'IntersectionObserver' in window/);
  assert.match(
    landing,
    /setRevealedMobileServiceItems\(new Set\(\[0, 1, 2, 3\]\)\)/,
  );
  assert.match(
    landing,
    /setHasDesktopServicesRevealed\(servicesScrollDirectionRef\.current === 'down'\)/,
  );
  assert.match(landing, /nextItems\.delete\(index\)/);
  assert.doesNotMatch(landing, /desktopObserver\.unobserve|mobileObserver\.unobserve/);
  assert.match(services, /data-service-reveal-index="0"/);
  assert.match(services, /data-service-reveal-index="1"/);
  assert.match(services, /data-service-reveal-index="2"/);
  assert.match(services, /data-service-reveal-index="3"/);
  assert.match(services, /-translate-x-8 opacity-0/);
  assert.match(services, /md:-translate-y-8 md:opacity-0/);
  assert.match(services, /md:\[transition-delay:450ms\]/);
  assert.match(services, /md:\[transition-delay:300ms\]/);
  assert.match(services, /md:\[transition-delay:150ms\]/);
  assert.match(services, /md:\[transition-delay:0ms\]/);
  assert.match(services, /motion-reduce:transition-none/);
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
PATH="/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" \
node --test --test-name-pattern="home services use responsive bidirectional" tests/site-requirements.test.mjs
```

Expected: FAIL because `servicesScrollDirectionRef`, reversible state, and exit delays do not exist.

- [ ] **Step 3: Commit the failing regression test**

```bash
git add tests/site-requirements.test.mjs
git commit -m "test: require reverse services transition"
```

### Task 2: Implement reversible observer state and timing

**Files:**
- Modify: `src/pages/Landing.tsx:28-123`
- Modify: `src/pages/Landing.tsx:206-315`

- [ ] **Step 1: Add dedicated services scroll refs**

Add beside the existing service refs:

```tsx
const servicesLastScrollYRef = useRef(0);
const servicesScrollDirectionRef = useRef<'up' | 'down'>('down');
```

- [ ] **Step 2: Replace the one-shot observer effect with reversible state**

Replace the services `useEffect` body with:

```tsx
useEffect(() => {
  const servicesSection = servicesSectionRef.current;
  const serviceItems = serviceRevealRefs.current.filter(
    (item): item is HTMLDivElement => item !== null,
  );

  if (!servicesSection || serviceItems.length !== 4) return;

  if (!('IntersectionObserver' in window)) {
    setHasDesktopServicesRevealed(true);
    setRevealedMobileServiceItems(new Set([0, 1, 2, 3]));
    return;
  }

  const desktopQuery = window.matchMedia('(min-width: 768px)');
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  servicesLastScrollYRef.current = window.scrollY;

  const trackServicesScrollDirection = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY !== servicesLastScrollYRef.current) {
      servicesScrollDirectionRef.current =
        currentScrollY > servicesLastScrollYRef.current ? 'down' : 'up';
      servicesLastScrollYRef.current = currentScrollY;
    }
  };

  window.addEventListener('scroll', trackServicesScrollDirection, { passive: true });

  const desktopObserver = new IntersectionObserver(
    ([entry]) => {
      if (!desktopQuery.matches || !entry.isIntersecting) return;
      setHasDesktopServicesRevealed(servicesScrollDirectionRef.current === 'down');
    },
    { threshold: 0.15 },
  );

  const mobileObserver = new IntersectionObserver(
    (entries) => {
      if (!mobileQuery.matches) return;

      setRevealedMobileServiceItems((currentItems) => {
        const nextItems = new Set(currentItems);

        entries.forEach((entry) => {
          const index = Number((entry.target as HTMLElement).dataset.serviceRevealIndex);

          if (entry.isIntersecting && servicesScrollDirectionRef.current === 'down') {
            nextItems.add(index);
          } else if (
            !entry.isIntersecting &&
            servicesScrollDirectionRef.current === 'up' &&
            entry.boundingClientRect.top >= window.innerHeight * 0.9
          ) {
            nextItems.delete(index);
          }
        });

        return nextItems;
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
  );

  desktopObserver.observe(servicesSection);
  serviceItems.forEach((item) => mobileObserver.observe(item));

  return () => {
    window.removeEventListener('scroll', trackServicesScrollDirection);
    desktopObserver.disconnect();
    mobileObserver.disconnect();
  };
}, []);
```

- [ ] **Step 3: Make desktop transition delays depend on enter/exit state**

Remove static desktop delay utilities from the four wrapper prefixes. Add these delay
utilities to each desktop state branch:

```tsx
// Heading
hasDesktopServicesRevealed
  ? 'md:translate-x-0 md:translate-y-0 md:opacity-100 md:[transition-delay:0ms]'
  : 'md:translate-x-0 md:-translate-y-8 md:opacity-0 md:[transition-delay:450ms]'

// Card 1
hasDesktopServicesRevealed
  ? 'md:translate-x-0 md:translate-y-0 md:opacity-100 md:[transition-delay:450ms]'
  : 'md:translate-x-0 md:-translate-y-8 md:opacity-0 md:[transition-delay:300ms]'

// Card 2
hasDesktopServicesRevealed
  ? 'md:translate-x-0 md:translate-y-0 md:opacity-100 md:[transition-delay:600ms]'
  : 'md:translate-x-0 md:-translate-y-8 md:opacity-0 md:[transition-delay:150ms]'

// Card 3
hasDesktopServicesRevealed
  ? 'md:translate-x-0 md:translate-y-0 md:opacity-100 md:[transition-delay:750ms]'
  : 'md:translate-x-0 md:-translate-y-8 md:opacity-0 md:[transition-delay:0ms]'
```

- [ ] **Step 4: Run focused test and confirm GREEN**

Run:

```bash
PATH="/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" \
node --test --test-name-pattern="home services use responsive bidirectional" tests/site-requirements.test.mjs
```

Expected: one matching test passes; other tests are skipped by the name filter.

- [ ] **Step 5: Commit implementation**

```bash
git add src/pages/Landing.tsx tests/site-requirements.test.mjs
git commit -m "feat: reverse services transition on scroll up"
```

### Task 3: Synchronize product documentation and verify runtime

**Files:**
- Modify: `PRD.md:118-121`

- [ ] **Step 1: Update the home services behavior in PRD**

Replace the existing services bullet with:

```markdown
- sezione `I Nostri Servizi` con titolo/sottotitolo e card `Sto cercando un immobile`, `Vorrei sapere quanto vale il mio immobile` e `Servizi per l'affitto`; su desktop la discesa mostra titolo e tre card da sinistra a destra, mentre la risalita le nasconde nell'ordine inverso card 3 → card 2 → card 1 → titolo; su mobile ogni blocco entra da sinistra durante la discesa ed esce verso sinistra durante la risalita, seguendo l'ordine inverso naturale del layout verticale;
```

- [ ] **Step 2: Run complete automated verification**

Run:

```bash
export PATH="/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
pnpm test
pnpm run lint
pnpm run build
git diff --check
```

Expected: 16 tests pass, lint exits 0, Vite build succeeds, diff check prints nothing.

- [ ] **Step 3: Verify desktop behavior in browser**

At width 1024 px:

1. Reload `/` at page top.
2. Scroll down until services intersect; record opacity over time and confirm heading, card 1, card 2, card 3.
3. Continue below the section, then scroll upward; record opacity over time and confirm card 3, card 2, card 1, heading.
4. Confirm cards return to `translateY(-32px)` and opacity `0`.

- [ ] **Step 4: Verify mobile behavior in browser**

At width 390 px:

1. Scroll downward through services; confirm each item reaches opacity `1` independently.
2. Scroll upward; confirm card 3, card 2, card 1, heading return to `translateX(-32px)` and opacity `0` as they exit the bottom boundary.
3. Confirm `document.documentElement.scrollWidth === document.documentElement.clientWidth`.
4. Check browser error logs, reset viewport, reload `/`, and leave preview visible.

- [ ] **Step 5: Commit documentation**

```bash
git add PRD.md
git commit -m "docs: document bidirectional services motion"
```
