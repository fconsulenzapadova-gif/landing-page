# Interactive Gemut Definition

## Goal

Hide the German meaning of Gemut by default and reveal it above the home hero title
when a visitor interacts with the `Gemüt Capital` name.

## Interaction

- Desktop mouse or pen hover over `Gemüt Capital` reveals the definition.
- Moving the pointer away hides it.
- Keyboard focus-visible reveals the definition; blur hides it without forcing touch focus open.
- Touch tap toggles the definition; a second tap closes it.
- The interactive name exposes button semantics and `aria-expanded`.

## Layout and motion

- The definition is rendered immediately above the title.
- Its container transitions from collapsed to expanded while fading and translating
  upward into place over 250-300 ms.
- Expanding the container moves the title and claim downward smoothly; collapsing it
  moves them back upward.
- Existing hero copy, colors, badge, background, and responsive typography remain.
- Existing reduced-motion rules reduce the transition to effectively instant motion.

## Implementation boundary

- Keep behavior inside `src/pages/Landing.tsx`; do not add a shared component for one
  home-only interaction.
- Use React state only for persistent touch toggle state. Use hover and focus styling
  for transient desktop and keyboard interaction.
- Update `tests/site-requirements.test.mjs` with static requirements for hidden-default
  disclosure, supported interactions, accessibility attributes, and definition order.
- Update the home behavior documented in `PRD.md`.

## Verification

- Run the static test in red-green order.
- Run the full static suite, lint, and production build.
- In the browser, verify hidden default state, desktop hover reveal/hide, keyboard
  focus behavior, touch-size tap toggle, text movement, and console errors.
