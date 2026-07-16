# Gemüt Capital design system

## Product and tone

Public real-estate mediation site for Padova/province. `/richieste` collects a qualified lead with minimal time and cognitive load. Editorial, calm, trustworthy, contemporary; never CRM/dashboard.

## Visual identity

- Brand blue `#b3e5fc`; only blue allowed. Ink `#12130f`; graphite `#666861`; paper `#ece9e2`; paper-soft `#f7f5ef`; line `#d8d4ca`; control border `#807e77`; sage `#7d8777`; clay `#b55d42`.
- No gradients, neon, glass-heavy effects, huge shadows, invented colors.
- De Fonte Plus for brand only; Minion/Georgia for editorial headings; Avenir Next/Helvetica/Arial for UI.
- Max radius 8px; thin borders; flat surfaces. Primary CTA/selection brand-blue + ink. Focus double ink + blue ring. Touch targets min 44px.

## Guided request UX

- One decision cluster per screen. Prefer large cards, chips, segmented controls, ranges, progressive disclosure over selects and free text.
- Show progress and remaining time. Optional details remain optional with `Non lo so`/`Da definire` escape paths.
- Buying: location can be typed as zone or drawn as polygon.
- Renting branches first: `Cerco in affitto` gets zone/polygon; `Metto in affitto` gets property position only.
- Selling: property position only, never polygon.
- Zone input is always fastest path. Polygon is optional, large-control, mobile-safe, with undo/reset and equivalent text alternative.
- Real map may use free OpenStreetMap-compatible tiles with visible attribution. Brand overlays use paper/ink/line/blue. Polygon uses translucent blue fill + ink outline.

## Motion/accessibility

150–300ms transitions; no delay. Respect reduced motion. Semantic fieldsets/radio states, keyboard flow, inline errors, map-equivalent text input.

## Constraints

React 18, TypeScript, Vite, Tailwind, React Router, GSAP. Keep current Worker/D1/Turnstile submission and success scene. Existing payload stores `location` text; polygon storage needs explicit implementation choice. Preserve navigation/footer.
