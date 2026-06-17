# Bidirectional Services Scroll Transition

## Goal

Make the existing `I Nostri Servizi` reveal reversible. Downward scrolling keeps the
current reveal order; upward scrolling hides the same content in reverse order.

## Required sequence

- Downward desktop reveal remains: heading, card 1, card 2, card 3.
- Upward desktop exit becomes: card 3, card 2, card 1, heading.
- Desktop items exit toward their original hidden position above while fading out.
- On mobile, the heading and vertically stacked cards remain independently observed.
- Downward mobile scrolling reveals each item from the left when it enters the viewport.
- Upward mobile scrolling hides each item toward the left when it exits through the
  bottom of the viewport. The stacked layout naturally produces card 3, card 2, card 1,
  then heading.
- Re-entering the section in either direction must replay the corresponding transition.

## State and observers

- Keep the implementation local to `src/pages/Landing.tsx`.
- Replace one-shot reveal state with reversible visibility state.
- Keep one desktop section observer and one mobile item observer.
- Do not disconnect targets after the first intersection.
- Desktop observer updates section visibility on both entry and exit. CSS transition
  delays depend on whether the section is entering or leaving.
- Desktop enter delays preserve the current heading-first sequence.
- Desktop exit delays reverse the sequence, starting with card 3 and ending with the
  heading.
- Mobile observer sets each item visibility directly from its current intersection
  state instead of only accumulating revealed indices.
- Ignore observer callbacks from the inactive breakpoint so desktop and mobile state do
  not interfere with each other.
- If `IntersectionObserver` is unavailable, show every item without transitions that
  could leave content hidden.

## Motion and accessibility

- Reuse the existing duration, easing, opacity, and translation distances.
- Keep elements in document flow to prevent layout shifts.
- Preserve links, card hover states, responsive grid, focus behavior, and semantic
  structure.
- Preserve `prefers-reduced-motion`: state may update, but visual transition is removed.

## Documentation and tests

- Update `tests/site-requirements.test.mjs` so the contract requires reversible observer
  state, retained observation, and reverse desktop delays.
- Update `PRD.md` from one-shot wording to bidirectional scroll behavior.
- Do not change routes, data flows, APIs, storage, assets, or global providers.

## Verification

- Add a failing static regression requirement before implementation.
- Run the full test suite, lint, production build, and `git diff --check`.
- At desktop width, scroll down to confirm heading then cards 1-3; scroll up to confirm
  cards 3-1 then heading.
- At 390 px, confirm each item reveals from the left on descent and hides toward the left
  on ascent without horizontal overflow.
- Confirm no browser console errors, then restore the user's normal viewport and leave
  the preview open.
