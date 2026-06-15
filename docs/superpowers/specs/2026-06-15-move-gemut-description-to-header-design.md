# Move Gemüt Description to Header

## Goal

Give the home header enough space to explain the meaning of `Gemüt`, moving the existing description away from the services introduction.

## Design

- Keep the home header above the hero and preserve its white translucent background.
- Increase vertical padding so the header contains both the centered `Gemüt Capital` title and the existing description.
- Place the description below the title in a centered, readable text block with a constrained width.
- Keep responsive wrapping from 320 px upward.
- Remove the description panel from the `I Nostri Servizi` section.
- Keep the description text unchanged.

## Scope

- Update `src/pages/Landing.tsx`.
- Update the static requirement test to verify the description is inside the header and no longer inside the services section.
- Update `PRD.md` because the home content placement changes.

## Verification

- Run static tests, lint, and production build.
- Inspect the home at desktop and mobile widths.
- Confirm title and description remain readable and do not overlap the global menu.
