# Responsive Services Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reveal the home services heading and cards from above in a desktop sequence and individually from the left during mobile scrolling.

**Architecture:** Observe the whole services section for desktop sequence state and observe the heading plus each card for mobile item state. Responsive Tailwind classes isolate each state to its breakpoint, while outer wrappers animate without changing existing card hover behavior.

**Tech Stack:** React 18, TypeScript, IntersectionObserver, Tailwind CSS, Node test runner, Vite

---

### Task 1: Add responsive services reveal

**Files:**
- Modify: `tests/site-requirements.test.mjs:81-150`
- Modify: `src/pages/Landing.tsx:24-230`
- Modify: `PRD.md:179-190`

- [ ] **Step 1: Write failing static requirements**

Add assertions to the home test:

```js
const services = landing.slice(
  landing.indexOf('{/* Services Section */}'),
  landing.indexOf('{/* Chi Sono Io Toggle Button */}'),
);
assert.match(landing, /const \[hasDesktopServicesRevealed, setHasDesktopServicesRevealed\] = useState\(false\)/);
assert.match(landing, /const \[revealedMobileServiceItems, setRevealedMobileServiceItems\]/);
assert.match(landing, /const servicesSectionRef = useRef<HTMLElement>\(null\)/);
assert.match(landing, /new IntersectionObserver/);
assert.match(landing, /'IntersectionObserver' in window/);
assert.match(landing, /setRevealedMobileServiceItems\(new Set\(\[0, 1, 2, 3\]\)\)/);
assert.match(services, /data-service-reveal-index="0"/);
assert.match(services, /data-service-reveal-index="1"/);
assert.match(services, /data-service-reveal-index="2"/);
assert.match(services, /data-service-reveal-index="3"/);
assert.match(services, /-translate-x-8 opacity-0/);
assert.match(services, /md:-translate-y-8 md:opacity-0/);
assert.match(services, /md:\[transition-delay:450ms\]/);
assert.match(services, /md:\[transition-delay:600ms\]/);
assert.match(services, /md:\[transition-delay:750ms\]/);
assert.match(services, /motion-reduce:transition-none/);
```

- [ ] **Step 2: Run test to verify RED**

Run:

```bash
node --test tests/site-requirements.test.mjs
```

Expected: the home test fails because services observers and responsive reveal classes do not exist.

- [ ] **Step 3: Add reveal state, refs, and observers**

Add inside `Landing`:

```tsx
const [hasDesktopServicesRevealed, setHasDesktopServicesRevealed] = useState(false);
const [revealedMobileServiceItems, setRevealedMobileServiceItems] = useState<Set<number>>(
  new Set(),
);
const servicesSectionRef = useRef<HTMLElement>(null);
const serviceRevealRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const desktopObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      setHasDesktopServicesRevealed(true);
      desktopObserver.unobserve(entry.target);
    },
    { threshold: 0.15 },
  );

  const mobileObserver = new IntersectionObserver(
    (entries) => {
      const revealedIndexes = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => Number((entry.target as HTMLElement).dataset.serviceRevealIndex));

      if (revealedIndexes.length === 0) return;

      setRevealedMobileServiceItems((currentItems) => {
        const nextItems = new Set(currentItems);
        revealedIndexes.forEach((index) => nextItems.add(index));
        return nextItems;
      });

      entries.forEach((entry) => {
        if (entry.isIntersecting) mobileObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
  );

  desktopObserver.observe(servicesSection);
  serviceItems.forEach((item) => mobileObserver.observe(item));

  return () => {
    desktopObserver.disconnect();
    mobileObserver.disconnect();
  };
}, []);
```

- [ ] **Step 4: Add exact responsive wrappers and classes**

Apply these exact structural changes around the unchanged heading and card contents:

```diff
-<section className="py-16 px-4 bg-white">
+<section ref={servicesSectionRef} className="py-16 px-4 bg-white">
   <div className="container mx-auto">
-    <div className="text-center mb-12">
+    <div
+      ref={(element) => {
+        serviceRevealRefs.current[0] = element;
+      }}
+      data-service-reveal-index="0"
+      className={`mb-12 text-center transition-all duration-700 ease-out motion-reduce:transition-none md:delay-0 ${
+        revealedMobileServiceItems.has(0)
+          ? 'translate-x-0 opacity-100'
+          : '-translate-x-8 opacity-0'
+      } ${
+        hasDesktopServicesRevealed
+          ? 'md:translate-x-0 md:translate-y-0 md:opacity-100'
+          : 'md:translate-x-0 md:-translate-y-8 md:opacity-0'
+      }`}
+    >
       <h3 className="text-3xl font-bold text-gray-900 mb-4">I Nostri Servizi</h3>
       <p className="text-gray-600 max-w-2xl mx-auto">
         Un servizio completo e personalizzato per ogni esigenza immobiliare
       </p>
     </div>
     <div className="grid md:grid-cols-3 gap-8">
-      <Link to="/acquisto-casa" className="block">
+      <div
+        ref={(element) => {
+          serviceRevealRefs.current[1] = element;
+        }}
+        data-service-reveal-index="1"
+        className={`h-full transition-all duration-700 ease-out motion-reduce:transition-none md:[transition-delay:450ms] ${
+          revealedMobileServiceItems.has(1)
+            ? 'translate-x-0 opacity-100'
+            : '-translate-x-8 opacity-0'
+        } ${
+          hasDesktopServicesRevealed
+            ? 'md:translate-x-0 md:translate-y-0 md:opacity-100'
+            : 'md:translate-x-0 md:-translate-y-8 md:opacity-0'
+        }`}
+      >
+        <Link to="/acquisto-casa" className="block h-full">
           <Card>...</Card>
         </Link>
+      </div>
-      <Link to="/vendita-immobili" className="block">
+      <div
+        ref={(element) => {
+          serviceRevealRefs.current[2] = element;
+        }}
+        data-service-reveal-index="2"
+        className={`h-full transition-all duration-700 ease-out motion-reduce:transition-none md:[transition-delay:600ms] ${
+          revealedMobileServiceItems.has(2)
+            ? 'translate-x-0 opacity-100'
+            : '-translate-x-8 opacity-0'
+        } ${
+          hasDesktopServicesRevealed
+            ? 'md:translate-x-0 md:translate-y-0 md:opacity-100'
+            : 'md:translate-x-0 md:-translate-y-8 md:opacity-0'
+        }`}
+      >
+        <Link to="/vendita-immobili" className="block h-full">
           <Card>...</Card>
         </Link>
+      </div>
-      <Link to="/locazioni" className="block">
+      <div
+        ref={(element) => {
+          serviceRevealRefs.current[3] = element;
+        }}
+        data-service-reveal-index="3"
+        className={`h-full transition-all duration-700 ease-out motion-reduce:transition-none md:[transition-delay:750ms] ${
+          revealedMobileServiceItems.has(3)
+            ? 'translate-x-0 opacity-100'
+            : '-translate-x-8 opacity-0'
+        } ${
+          hasDesktopServicesRevealed
+            ? 'md:translate-x-0 md:translate-y-0 md:opacity-100'
+            : 'md:translate-x-0 md:-translate-y-8 md:opacity-0'
+        }`}
+      >
+        <Link to="/locazioni" className="block h-full">
           <Card>...</Card>
         </Link>
+      </div>
     </div>
```

Keep each existing full `Card`, `CardHeader`, and `CardContent` body in place where the diff shows its compact unchanged `<Card>...</Card>` context.

- [ ] **Step 6: Update PRD**

Replace the primary service card bullet with:

```markdown
- sezione `I Nostri Servizi` con titolo/sottotitolo e card `Sto cercando un immobile`, `Vorrei sapere quanto vale il mio immobile` e `Servizi per l'affitto`; su desktop la sezione compare dall'alto in sequenza titolo → tre card da sinistra a destra, mentre su mobile ogni blocco compare da sinistra quando entra nel viewport durante lo scroll;
```

- [ ] **Step 7: Verify GREEN and quality gates**

Run:

```bash
node --test tests/site-requirements.test.mjs
pnpm lint
pnpm build
```

Expected: 15 tests pass; lint and build exit 0.

- [ ] **Step 8: Verify browser behavior**

At 1024 px, reload at the top and verify the heading starts above/transparent, then the section intersection reveals it and the three cards with increasing delays. At 390 px, reload at the top and scroll downward; verify the heading and each card move from the left only when their own target enters the effective viewport. Confirm all four remain revealed, no horizontal overflow appears, console contains no errors, and restore the user's viewport.
