# Compact Gemüt Description

## Goal

Reduce the Gemüt definition in the home header to a fixed 10 px font size.

## Design

- Keep the existing definition text and centered layout.
- Use a fixed `10px` font size at mobile and desktop widths.
- Keep a readable line height.
- Preserve the existing title size and header spacing unless natural text reflow reduces the header height.
- Allow the dynamically measured navigation button position to follow the new header height.

## Files

- `src/pages/Landing.tsx`
- `tests/site-requirements.test.mjs`
- `PRD.md`

## Verification

- Add a static requirement test for the 10 px definition text.
- Run tests, focused lint, global lint, and production build.
- Inspect desktop and 320 px widths.
- Confirm the menu remains vertically centered in the header and there is no horizontal overflow.
