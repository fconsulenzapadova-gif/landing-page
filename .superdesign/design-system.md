# Gemüt Capital design system

## Product and tone

Public real-estate mediation site for Padova/province. It presents listings, services, and a guided lead request. Editorial, calm, trustworthy, contemporary; never a generic portal, CRM, or dashboard.

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

## Property detail UX

- Borrow the proven information architecture of a mature property portal, especially Immobiliare.it, without copying its visual identity.
- Design mobile-first. The first property content below the global navigation is the photo gallery, not title or introductory copy. On mobile use a swipeable single-image stage with clear image count and fullscreen action; enhance it into a broad editorial mosaic or wide media stage on desktop.
- Place a 44px minimum `Indietro` control at the gallery's top-left. It returns to browser history, preserving the originating list/filter context; it is not a Home link. Use a chevron-left plus concise label on mobile and never let it compete with gallery controls.
- Immediately below the gallery, prioritize buyer decisions in this order: price, location, compact property title/type, then surface, rooms, bedrooms, bathrooms and floor. Status and reference are useful metadata but visually secondary. Lift, condition and energy class follow in the characteristics section.
- Keep the property title materially smaller than the current hero title and subordinate to imagery, price and location, following mature portal hierarchy.
- Desktop content uses a readable main column plus a compact sticky enquiry card. Mobile uses normal-flow content plus a persistent but non-obstructive enquiry action.
- Keep the enquiry path direct: one primary CTA to the existing `/richieste?type=...` flow. Do not invent phone numbers, agents, mortgage tools, saved-listing accounts, sharing services, maps, floor plans, or unavailable data.
- Long-form description comes before the exhaustive characteristics. Characteristics use calm rows or compact spec groups, never a dashboard grid.
- Highlights remain editorial support, not a separate dark marketing landing page. Preserve generous paper space, thin rules, restrained surfaces, and strong typographic hierarchy.
- Gallery controls, lightbox, keyboard interaction, focus restoration, and image-count feedback remain accessible.

## Motion/accessibility

150–300ms transitions; no delay. Respect reduced motion. Semantic fieldsets/radio states, keyboard flow, inline errors, map-equivalent text input.

## Constraints

React 18, TypeScript, Vite, Tailwind, React Router, GSAP. Listing data comes from the existing Cloudflare DTO and Workers KV images. Preserve navigation, footer, loading/redirect behavior, gallery lightbox, and the existing request route. Do not add backend fields or placeholder product features.
