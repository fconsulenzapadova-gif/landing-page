# Compact Specialist Cards

## Goal

Reduce both home specialist service cards by about 30%, including their typography and controls.

## Design

- Keep the two-card specialist grid and existing routes.
- Reduce the grid maximum width from its current size to about 70%.
- Reduce card padding and internal spacing proportionally.
- Reduce icon containers and icons to about 70% of their current dimensions.
- Reduce title, description, CTA text, CTA height, and arrow icon sizes to about 70%.
- Keep cards centered and equal-height.
- Preserve hover, focus, colors, backgrounds, links, and accessible interaction.
- On mobile, keep cards readable and full-width within a narrower centered container; do not use CSS transforms.

## Files

- `src/pages/Landing.tsx`
- `tests/site-requirements.test.mjs`
- `PRD.md`

## Verification

- Add a static requirement test for the compact specialist-card sizing contract.
- Run tests, focused lint, global lint, and production build.
- Inspect both cards at desktop and 320 px widths.
- Confirm no horizontal overflow and both CTA links remain usable.
