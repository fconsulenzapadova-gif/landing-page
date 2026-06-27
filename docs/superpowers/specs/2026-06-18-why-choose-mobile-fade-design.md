# Why Choose Mobile Fade Reveal

## Goal

Reveal the home `Perché Sceglierci` section progressively on mobile using opacity
only: first the heading group, then each of the four reasons as the visitor scrolls
down the page.

## Mobile behavior

- Treat the title and subtitle as one reveal item.
- Observe the heading group and each reason independently.
- Reveal each item once when it enters the mobile viewport.
- Keep revealed items visible when the visitor scrolls upward.
- Use a fade-only transition: opacity changes, with no translation, scaling, or
  layout movement.
- Let viewport entry determine the sequence instead of adding artificial time delays.

## Desktop behavior

- Keep the section fully visible and unchanged at `md` widths and above.
- Do not add desktop reveal timing, observer-driven styling, or movement.

## Motion and accessibility

- Keep every item in normal document flow while transparent so layout remains stable.
- Use the existing transition duration and easing conventions from the home page.
- Under `prefers-reduced-motion`, remove transition timing and show entered items
  immediately.
- If `IntersectionObserver` is unavailable, reveal all five items immediately.

## Implementation boundary

- Keep state, refs, observer setup, and responsive classes in
  `src/pages/Landing.tsx`; the behavior is specific to one home section.
- Use one mobile item `IntersectionObserver` for the heading group and four reasons.
- Mark targets with section-specific data attributes so this observer remains
  independent from the existing `I Nostri Servizi` reveal.
- Stop observing each target after its first reveal.
- Update `tests/site-requirements.test.mjs` with static requirements for five targets,
  one-shot observation, opacity-only mobile classes, fallback, reduced motion, and
  unchanged desktop visibility.
- Update the home behavior in `PRD.md` because this changes active product behavior.

## Verification

- Add the static requirement first and observe its expected failure.
- Implement the minimum behavior, then run the full test suite, lint, and production
  build.
- At a mobile width near 390 px, verify heading-first reveal followed by the four
  reasons individually during downward scrolling.
- Confirm no item translates or causes layout shift, revealed items stay visible when
  scrolling upward, and reduced-motion behavior is effectively immediate.
- At desktop width, confirm the complete section remains visible without reveal
  animation.
- Check browser console for runtime errors.
