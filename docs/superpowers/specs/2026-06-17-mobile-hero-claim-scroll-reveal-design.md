# Mobile Hero Claim Scroll Reveal

## Goal

Reveal the home hero operational claim with a small scroll-triggered transition only
on mobile viewports.

## Behavior

- On viewports below the Tailwind `md` breakpoint, the claim starts visually hidden.
- The first downward scroll that takes the page beyond 24 px reveals the claim.
- The reveal runs once per home page mount and remains visible afterward.
- Desktop and tablet viewports at `md` and above keep the claim visible immediately.
- The claim keeps its layout space while hidden, preventing hero and service content
  from jumping when it appears.

## Motion

- Transition opacity from 0 to 1 and vertical translation from 1rem below to its
  resting position.
- Use a 400-500 ms ease-out transition.
- Preserve the repository's global `prefers-reduced-motion` behavior and add an
  explicit motion-reduce transition override to the claim.

## Implementation

- Keep state, scroll tracking, and markup changes in `src/pages/Landing.tsx`.
- Register one passive `scroll` listener in an effect and remove it after reveal or
  component cleanup.
- Track the previous scroll position so upward movement cannot trigger the reveal.
- Use `window.matchMedia('(max-width: 767px)')` to constrain the trigger to mobile.
- Update `tests/site-requirements.test.mjs` with static requirements for mobile-only,
  downward, thresholded, one-shot behavior and responsive transition classes.
- Update the home behavior in `PRD.md`.

## Verification

- Observe the static requirement fail before implementation, then pass afterward.
- Run the full test suite, lint, and production build.
- Verify at a 390 px viewport that the claim is initially transparent, reveals after
  downward scrolling past 24 px, remains visible, and causes no horizontal overflow.
- Verify at desktop width that the claim is immediately visible and console has no
  errors.

