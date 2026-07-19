# Pages

## `/immobili/:slug`

- `src/pages/ListingPage.tsx`
  - `src/components/ListingGallery.tsx`
    - `src/components/Icon.tsx`
  - `src/components/ButtonLink.tsx`
  - `src/components/LoadingState.tsx`
  - `src/components/Section.tsx`
  - `src/content/site.ts`
  - `src/lib/useListings.ts`
    - `src/lib/listings.ts`
  - `src/lib/usePageAnimations.ts`
- `src/components/AppLayout.tsx`
  - `src/components/Navigation.tsx`
  - `src/components/Footer.tsx`
  - `src/components/CookieConsent.tsx`
- `src/index.css`
- `tailwind.config.js`
- `public/design-system/logo/logo-blue.svg`
- `public/design-system/logo/logo-white.svg`

Render: while the catalog promise resolves, show `LoadingState`; missing slugs redirect home. A resolved listing mounts `ListingDetails`, whose current desktop branch is a two-column header with copy/CTAs and carousel, then details rows/cards, then a dark highlights section. Gallery includes thumbnails and a keyboard-accessible fullscreen lightbox.

## `/richieste`

- `src/pages/RequestsPage.tsx`
  - `src/components/RequestSuccess.tsx`
  - `src/components/ButtonLink.tsx`
  - `src/components/Section.tsx`
  - `src/components/Turnstile.tsx`
  - `src/content/site.ts`
  - `src/lib/leads.ts`
  - `src/lib/usePageAnimations.ts`
- `src/components/AppLayout.tsx`
  - `src/components/Navigation.tsx`
  - `src/components/Footer.tsx`
  - `src/components/CookieConsent.tsx`
- `src/index.css`
- `tailwind.config.js`
- `public/design-system/logo/logo-blue.svg`
- `public/design-system/logo/logo-white.svg`

Render: success component after submit; otherwise 3-step form. New branch logic distinguishes buying, tenant search, selling, and landlord listing.
