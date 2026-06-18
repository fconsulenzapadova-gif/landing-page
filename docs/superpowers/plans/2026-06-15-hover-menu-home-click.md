# Hover Menu Home Click Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the global navigation button open the menu on desktop hover/focus, navigate home on desktop click, and keep mobile tap opening the menu.

**Architecture:** Keep the existing `GlobalNavigation` state and side panel. Add explicit pointer/focus/click handlers in the same component, using React Router navigation for desktop click-to-home and pointer-type tracking for touch-safe behavior.

**Tech Stack:** React 18, TypeScript, React Router 6, Tailwind CSS, Node test runner.

---

### Task 1: Add Static Test Coverage

**Files:**
- Modify: `tests/site-requirements.test.mjs`

- [ ] **Step 1: Add a failing test**

Add this test after `global navigation centers the menu button from the measured home header only`:

```js
test('global navigation opens on hover or focus and routes home on desktop click', () => {
  const navigation = read('src/components/GlobalNavigation.tsx');

  assert.match(navigation, /useNavigate/);
  assert.match(navigation, /const navigate = useNavigate\(\)/);
  assert.match(navigation, /onPointerEnter=\{handleMenuButtonPointerEnter\}/);
  assert.match(navigation, /onFocus=\{handleMenuButtonFocus\}/);
  assert.match(navigation, /onClick=\{handleMenuButtonClick\}/);
  assert.match(navigation, /event\.pointerType === 'touch'/);
  assert.match(navigation, /navigate\('\/'\)/);
});
```

- [ ] **Step 2: Run test and verify failure**

Run:

```bash
/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-requirements.test.mjs
```

Expected: FAIL because `useNavigate`, `handleMenuButtonPointerEnter`, `handleMenuButtonFocus`, `handleMenuButtonClick`, and touch pointer handling do not exist yet.

### Task 2: Implement Navigation Button Behavior

**Files:**
- Modify: `src/components/GlobalNavigation.tsx`

- [ ] **Step 1: Update imports**

Change:

```ts
import { Link, useLocation } from 'react-router-dom';
```

To:

```ts
import { Link, useLocation, useNavigate } from 'react-router-dom';
```

- [ ] **Step 2: Add router navigation and handlers**

Inside `GlobalNavigation`, after `const location = useLocation();`, add:

```ts
const navigate = useNavigate();
```

After the `isHome` constant, add:

```ts
const openMenu = () => setIsOpen(true);

const handleMenuButtonPointerEnter = (event: React.PointerEvent<HTMLButtonElement>) => {
  if (event.pointerType === 'touch') return;
  openMenu();
};

const handleMenuButtonFocus = () => {
  openMenu();
};

const handleMenuButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  if (event.detail === 0) {
    setIsOpen(false);
    navigate('/');
    return;
  }

  if ('pointerType' in event.nativeEvent && event.nativeEvent.pointerType === 'touch') {
    openMenu();
    return;
  }

  setIsOpen(false);
  navigate('/');
};
```

- [ ] **Step 3: Wire the button events**

Change the button event prop:

```tsx
onClick={() => setIsOpen((current) => !current)}
```

To:

```tsx
onPointerEnter={handleMenuButtonPointerEnter}
onFocus={handleMenuButtonFocus}
onClick={handleMenuButtonClick}
```

- [ ] **Step 4: Run test and verify pass**

Run:

```bash
/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/site-requirements.test.mjs
```

Expected: PASS for the new static test and existing tests.

### Task 3: Update Product Documentation

**Files:**
- Modify: `PRD.md`

- [ ] **Step 1: Update section 7.1**

Replace the old hover icon bullet block with wording that states:

```md
- pulsante fisso a sinistra, centrato verticalmente rispetto all'header misurato nella home e posizionato in alto nelle altre route;
- apertura del pannello laterale al passaggio mouse/penna e al focus tastiera;
- click desktop sul pulsante che porta direttamente alla route `/`;
- tap touch/mobile sul pulsante che apre il menu, dato che non esiste hover;
- icona menu che diventa casa al passaggio del mouse;
```

- [ ] **Step 2: Verify PRD matches code**

Run:

```bash
rg -n "passaggio mouse|click desktop|tap touch|useNavigate|pointerType" PRD.md src/components/GlobalNavigation.tsx
```

Expected: PRD and component both show the new behavior.

### Task 4: Verify And Deploy

**Files:**
- Verify: `src/components/GlobalNavigation.tsx`
- Verify: `tests/site-requirements.test.mjs`
- Verify: `PRD.md`

- [ ] **Step 1: Run focused lint**

Run:

```bash
PATH="/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ./node_modules/.bin/eslint src/components/GlobalNavigation.tsx tests/site-requirements.test.mjs
```

Expected: PASS for changed files.

- [ ] **Step 2: Run production build**

Run:

```bash
PATH="/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" ./node_modules/.bin/vite build
```

Expected: build completes and writes `dist`.

- [ ] **Step 3: Browser smoke test**

Use browser automation or in-app browser:

- open local or deployed home;
- hover global menu button on desktop and confirm side panel opens;
- click global menu button from a non-home page on desktop and confirm URL becomes `/`;
- emulate mobile/touch or inspect behavior and confirm tap opens menu.

- [ ] **Step 4: Deploy production**

Run:

```bash
PATH="/Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" /Users/filippomarcuzzo/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm dlx vercel@latest deploy --prod --yes
```

Expected: Vercel returns a ready production deployment and aliases `www.gemutcapital.com`.
