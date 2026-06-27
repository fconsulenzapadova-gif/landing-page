# Home Menu Alignment and Request Background

## Goal

Center the global navigation button vertically within the expanded home header and give the public request page one continuous Prato della Valle background.

## Navigation Design

- Keep `GlobalNavigation` global and fixed.
- On the home route only, measure the rendered `header` height at runtime.
- Set the closed/open menu button vertical position to half the header height minus half the button height.
- Recalculate on viewport resize and when the home header size changes.
- Keep the existing `top-4` position on every route other than `/`.
- Preserve the button's accessibility attributes and menu behavior.

## Request Page Design

- Use `/prato-padova.jpg` as the single background image on the outer request-page container.
- Remove the separate `/padova-test.jpg` background from the hero section.
- Keep the hero overlay and translucent emerald content panel for text contrast.
- Preserve form fields, query-string preselection, submission behavior, and responsive layout.

## Files

- `src/components/GlobalNavigation.tsx`
- `src/pages/PublicRequests.tsx`
- `tests/site-requirements.test.mjs`
- `PRD.md`

## Verification

- Add static tests for the request-page asset and route-specific dynamic menu positioning.
- Run tests, focused lint, global lint, and production build.
- Verify `/` at desktop and mobile widths: button centered in the rendered header without overlap.
- Verify `/richieste?type=acquisto`: one continuous Prato della Valle background, readable hero, working layout.
- Verify another route keeps the original top-left menu position.
