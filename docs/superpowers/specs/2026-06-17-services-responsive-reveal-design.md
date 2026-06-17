# Responsive Services Reveal

## Goal

Animate the home `I Nostri Servizi` heading and three primary service cards with
different reveal directions and timing on desktop and mobile.

## Desktop behavior

- The sequence starts once when the services section enters the viewport.
- The title and subtitle fade in while moving downward from above.
- After the heading begins its reveal, the three cards fade and move downward from
  above, ordered left to right.
- Card delays are staggered by roughly 150 ms, with the first card starting after the
  heading is established.

## Mobile behavior

- The heading group and each card are observed independently.
- Each item reveals once when it enters the viewport during downward scrolling.
- Every mobile item fades and moves rightward from an initial position 2rem to the
  left.
- No artificial stagger is added on mobile; scroll position controls the sequence.

## Motion and layout

- Use 500-700 ms ease-out transitions.
- Keep all items in normal document flow while hidden so layout does not jump.
- Preserve existing card hover, active, link, responsive grid, and accessibility
  behavior.
- Respect the global reduced-motion rules and add an explicit transition override.

## Implementation

- Keep section state, refs, observer setup, and class changes in
  `src/pages/Landing.tsx`.
- Use one section `IntersectionObserver` for desktop sequence state.
- Use one item `IntersectionObserver` for the mobile heading and three cards.
- Stop observing targets after their first reveal.
- If `IntersectionObserver` is unavailable, reveal every item immediately.
- Use Tailwind responsive variants so desktop state affects only `md` and wider while
  mobile item state affects widths below `md`.
- Update `tests/site-requirements.test.mjs` with static requirements for observers,
  directions, stagger order, fallback, and reduced motion.
- Update the home section behavior documented in `PRD.md`.

## Verification

- Observe a failing static requirement before implementation, then pass afterward.
- Run the complete test suite, lint, and production build.
- At 1024 px, verify heading-first and left-to-right card reveal from above.
- At 390 px, verify heading and cards reveal individually from the left as they enter
  during downward scroll, with no horizontal overflow.
- Check console errors and restore the user's viewport after testing.

