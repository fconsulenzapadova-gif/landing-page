# Hover Menu And Home Click Design

## Goal

Update the global navigation button behavior:

- desktop pointer hover opens the slide-out navigation menu without click;
- desktop click on the button navigates directly to `/`;
- keyboard focus opens the menu, and activation navigates to `/`;
- touch/mobile tap opens the menu, because touch has no hover state.

## Chosen Approach

Approach 2 is approved:

- mouse or pen hover opens the existing `GlobalNavigation` side panel;
- click with a mouse still sends the user to the landing page root `/`;
- touch interaction keeps mobile navigation usable by opening the menu instead of navigating away;
- existing overlay, route-change close, current-route highlight, Escape close, CTA, and measured home-header position remain active.

This balances the requested desktop interaction with mobile usability.

## Components

`src/components/GlobalNavigation.tsx` remains the only component that needs behavioral changes. It will:

- import router navigation support;
- add explicit handlers for pointer enter, focus, and click/tap activation;
- distinguish touch pointer interaction from mouse/pen interaction;
- keep existing `isOpen` state and panel rendering.

No new route, provider, API, storage key, or external integration is introduced.

## Accessibility

- The button keeps `aria-label`, `aria-expanded`, and `aria-controls`.
- Focus opens the menu so keyboard users can inspect navigation links.
- Escape still closes the panel.
- Touch users can still open the menu from mobile.
- Navigation links remain standard router links.

## PRD And Tests

Update `PRD.md` section 7.1 to describe hover/focus opening, desktop click-to-home, and touch tap-to-menu behavior.

Update `tests/site-requirements.test.mjs` with static checks for:

- router navigation from the menu button;
- pointer hover/focus opening;
- touch-safe menu opening.

## Verification

Run:

- static site requirements test;
- focused lint on changed files;
- production build;
- browser smoke test for desktop hover, desktop click-to-home, and mobile tap menu.

Deploy production after verification if implementation passes.
